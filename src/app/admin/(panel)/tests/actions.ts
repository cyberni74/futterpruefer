"use server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/auth";
import { sanitize } from "@/lib/sanitize";
import { autolinkUrls } from "@/lib/autolink";
import { totalScore } from "@/lib/scoring";
import { EF_METHODIK_VERSION } from "@/lib/ergaenzung";
import { checkEfForm, draftsToInputs, efFormFromFormData, efInputFromForm, preisTagesdosis, previewEf } from "@/lib/admin/ergaenzung-form";
import { revalidateContent } from "@/lib/revalidate";
import { isUniqueViolation, reviewFormToRaw, reviewSchema, toFieldErrors, type ActionResult } from "@/lib/admin/schemas";
import { resolvePublish, statusKey, STATUS_LABEL } from "@/lib/admin/publish";
import { applyRedirectPlan, contentPath, planSlugRedirect } from "@/lib/admin/redirects";
import { fail, guard, ok, revalidateAdmin } from "@/lib/admin/guard";
import { canonicalBrand, getBrands } from "@/lib/admin/brands";
import type { Prisma } from "@/generated/prisma/client";
import { TESTVORLAGE_V2, parseLayoutData, pruefeVorVeroeffentlichung, summeKriterien, type LayoutData } from "@/components/testvorlage-v2/schema";

export async function saveReview(id: string | null, _prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;

  const raw = reviewFormToRaw(formData);
  // Testvorlage V2: Inhalte stehen in layoutData (JSON), nicht in den klassischen Feldern
  const isV2 = raw.layout === TESTVORLAGE_V2;
  let layoutData: LayoutData | null = null;
  if (isV2) {
    let json: unknown = null;
    try {
      json = JSON.parse(String(formData.get("layoutData") ?? "null"));
    } catch {
      return fail("Die Daten der Testvorlage sind kein gültiges JSON.", { layoutData: "Ungültiges JSON." });
    }
    const p = parseLayoutData(json);
    if (!p.ok) return fail("Bitte die Daten der Testvorlage korrigieren.", { layoutData: p.error.split("; ").join("\n") });
    layoutData = p.data;
    raw.verdict = (layoutData.hero?.gesamturteil ?? "").slice(0, 400);
    raw.pros = layoutData.pros ?? [];
    raw.cons = layoutData.cons ?? [];
  }
  const parsed = reviewSchema.safeParse(raw);
  if (!parsed.success) return fail("Bitte die markierten Felder korrigieren.", toFieldErrors(parsed.error));
  const v = parsed.data;

  const existing = id ? await prisma.review.findUnique({ where: { id }, select: { id: true, slug: true, status: true, publishedAt: true } }) : null;
  if (id && !existing) return fail("Dieser Test existiert nicht mehr.");

  const category = await prisma.category.findUnique({ where: { id: v.categoryId }, select: { id: true, animal: true } });
  if (!category) return fail("Bitte eine gültige Kategorie wählen.", { categoryId: "Kategorie nicht gefunden." });

  const bewertungsart: "ALLEINFUTTER" | "ERGAENZUNGSFUTTER" = formData.get("bewertungsart") === "ERGAENZUNGSFUTTER" ? "ERGAENZUNGSFUTTER" : "ALLEINFUTTER";
  const vorlageTotal = layoutData ? summeKriterien(layoutData) : 0;
  if (layoutData && v.publishMode !== "draft") {
    const issues = pruefeVorVeroeffentlichung(layoutData, { bewertungsart, totalScore: vorlageTotal });
    if (issues.length) return fail("Zum Veröffentlichen fehlt noch etwas in der Testvorlage.", { layoutData: issues.map((i) => i.message).join("\n") });
  }
  const efState = efFormFromFormData(formData);
  const efChecked = isV2 ? ({ ok: false, message: "", fieldErrors: {} } as const) : checkEfForm(efState, category.animal === "KATZE" ? "KATZE" : "HUND", v.publishMode !== "draft");
  if (!isV2 && bewertungsart === "ERGAENZUNGSFUTTER" && !efChecked.ok) return fail(efChecked.message, efChecked.fieldErrors);
  const efScores = efChecked.ok ? efChecked.scores : efInputFromForm(efState);
  const efResult = previewEf({ ...efState, ...{
    auswahl: String(efScores.auswahl),
    dosierung: String(efScores.dosierung),
    werbung: String(efScores.werbung),
    traeger: String(efScores.traeger),
    mengen: String(efScores.mengen),
    unterlagen: String(efScores.unterlagen),
    alibi: efState.alibi,
    keineReferenz: efState.keineReferenz,
  } }).result;
  const preis = preisTagesdosis(efState.preisTagesdosis);
  if (efState.preisTagesdosis.trim() && preis == null) return fail("Bitte den Preis pro Tagesdosis prüfen.", { efPreisTagesdosisEur: "Bitte einen gültigen Betrag angeben." });
  const { wirkstoffe, studien } = draftsToInputs(efState);

  const pub = resolvePublish(v.publishMode, v.scheduledAt, existing);
  if (!pub.ok) return fail(pub.error, { scheduledAt: pub.error });

  const scores = {
    scoreRaw: v.scoreRaw,
    scoreHarmful: v.scoreHarmful,
    scoreNutrients: v.scoreNutrients,
    scoreDeclaration: v.scoreDeclaration,
    scoreNeeds: v.scoreNeeds,
    scoreValue: v.scoreValue,
  };
  const data = {
    slug: v.slug,
    title: v.title,
    brand: canonicalBrand(v.brand, await getBrands()),
    productName: v.productName,
    keyword: v.keyword,
    categoryId: v.categoryId,
    priceClass: v.priceClass,
    pricePerKg: v.pricePerKg,
    imageUrl: v.imageUrl || null,
    imageAlt: v.imageAlt,
    imageBlur: v.imageBlur || null,
    contentImageUrl: v.contentImageUrl || null,
    contentImageAlt: v.contentImageAlt,
    contentImageBlur: v.contentImageBlur || null,
    ...(isV2 ? {} : scores),
    totalScore: isV2 ? vorlageTotal : bewertungsart === "ERGAENZUNGSFUTTER" ? efResult.gesamt : totalScore(scores),
    bewertungsart,
    layout: isV2 ? TESTVORLAGE_V2 : "",
    ...(layoutData ? { layoutData: layoutData as unknown as Prisma.InputJsonValue } : {}),
    ...(!isV2 && (bewertungsart === "ERGAENZUNGSFUTTER" || efChecked.ok) ? {
    methodikVersion: bewertungsart === "ERGAENZUNGSFUTTER" ? EF_METHODIK_VERSION : "",
    efWirkstoffAuswahl: efScores.auswahl,
    efWirkstoffAuswahlBegruendung: efState.auswahlBegruendung.trim(),
    efWirkstoffDosierung: bewertungsart === "ERGAENZUNGSFUTTER" ? efResult.dosierung : efScores.dosierung,
    efWirkstoffDosierungBegruendung: efState.dosierungBegruendung.trim(),
    efWerbung: efScores.werbung,
    efWerbungBegruendung: efState.werbungBegruendung.trim(),
    efTraeger: efScores.traeger,
    efTraegerBegruendung: efState.traegerBegruendung.trim(),
    efTransparenzMengen: efScores.mengen,
    efTransparenzMengenBegruendung: efState.mengenBegruendung.trim(),
    efTransparenzUnterlagen: efScores.unterlagen,
    efTransparenzUnterlagenBegruendung: efState.unterlagenBegruendung.trim(),
    efAlibiDosierung: efState.alibi,
    efKeineReferenzdosis: efState.keineReferenz,
    efHeilaussage: efState.heilaussage,
    efSicherheit: efState.sicherheit,
    efSicherheitBegruendung: efState.sicherheitBegruendung.trim(),
    efTierschutzText: efState.tierschutz.trim(),
    efTraegerAbzuege: efState.traegerAbzuege,
    efPreisTagesdosisEur: preis == null ? null : Math.round(preis * 100) / 100,
    } : {}),
    verdict: v.verdict,
    ...(isV2 ? {} : { harmfulReason: v.harmfulReason }),
    composition: v.composition,
    analysis: v.analysis,
    packageSize: v.packageSize,
    price: v.price,
    pricePerDay: v.pricePerDay,
    priceDate: v.priceDate,
    testedAt: v.testedAt,
    gallery: v.gallery,
    claims: v.claims,
    pros: v.pros,
    cons: v.cons,
    ...(isV2 ? {} : { bodyHtml: autolinkUrls(sanitize(v.bodyHtml)), conclusionHtml: autolinkUrls(sanitize(v.conclusionHtml)) }),
    teaser: v.teaser,
    metaTitle: v.metaTitle,
    metaDescription: v.metaDescription,
    keywords: v.keywords,
    authorSlug: v.authorSlug,
    status: pub.status,
    publishedAt: pub.publishedAt,
  };

  let savedId: string;
  try {
    savedId = await prisma.$transaction(async (tx) => {
      const saved = existing ? await tx.review.update({ where: { id: existing.id }, data }) : await tx.review.create({ data });
      if (!isV2 && (bewertungsart === "ERGAENZUNGSFUTTER" || efChecked.ok)) {
      await tx.ergaenzungStudie.deleteMany({ where: { reviewId: saved.id } });
      await tx.ergaenzungWirkstoff.deleteMany({ where: { reviewId: saved.id } });
      const idByKey = new Map<string, string>();
      for (const [index, wirkstoff] of wirkstoffe.entries()) {
        const created = await tx.ergaenzungWirkstoff.create({
          data: {
            reviewId: saved.id,
            name: wirkstoff.name,
            mengeMgProTagesdosis: wirkstoff.mengeMgProTagesdosis,
            referenzMgProKg: wirkstoff.referenzMgProKg,
            sortOrder: index,
          },
        });
        idByKey.set(wirkstoff.key, created.id);
      }
      for (const studie of studien) {
        const wirkstoffId = idByKey.get(studie.wirkstoffKey);
        if (!wirkstoffId) continue;
        await tx.ergaenzungStudie.create({
          data: {
            reviewId: saved.id,
            wirkstoffId,
            titel: studie.titel,
            autoren: studie.autoren,
            jahr: studie.jahr,
            zeitschrift: studie.zeitschrift,
            tierart: studie.tierart,
            studiendosisJeKg: studie.studiendosisJeKg,
            einheit: studie.einheit || null,
            studiendosisOriginal: studie.studiendosisOriginal,
            ergebnisKurz: studie.ergebnisKurz,
            link: studie.link,
            linkFreigabe: studie.linkFreigabe,
            evidenzstufe: studie.evidenzstufe,
            richtung: studie.richtung,
            geprueftAm: new Date(`${studie.geprueftAm}T12:00:00Z`),
          },
        });
      }
      }
      await applyRedirectPlan(tx.redirect, planSlugRedirect("tests", existing?.slug, v.slug));
      return saved.id;
    });
  } catch (e) {
    if (isUniqueViolation(e)) {
      const msg = "Dieser Slug ist bereits vergeben – bitte einen anderen wählen.";
      return fail(msg, { slug: msg });
    }
    console.error("saveReview", e);
    return fail("Speichern fehlgeschlagen. Bitte erneut versuchen.");
  }

  revalidateContent("review", [existing?.slug, v.slug]);
  revalidateAdmin();

  if (!existing) redirect(`/admin/tests/${savedId}?neu=1`);

  const label = STATUS_LABEL[statusKey(pub.status, pub.publishedAt)];
  const slugNote = existing.slug !== v.slug ? ` Weiterleitung von ${contentPath("tests", existing.slug)} angelegt.` : "";
  return ok(`Gespeichert (${label}).${slugNote}`);
}

export async function deleteReview(id: string) {
  await requireAdmin();
  const review = await prisma.review.findUnique({ where: { id }, select: { slug: true } });
  if (!review) return { ok: false, message: "Test nicht gefunden." };
  const path = contentPath("tests", review.slug);
  await prisma.$transaction([prisma.redirect.deleteMany({ where: { toPath: path } }), prisma.review.delete({ where: { id } })]);
  revalidateContent("review", [review.slug]);
  revalidateAdmin();
  redirect("/admin/tests?geloescht=1");
}
