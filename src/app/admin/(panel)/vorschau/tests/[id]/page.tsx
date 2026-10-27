import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { sanitize } from "@/lib/sanitize";
import { VerdictPanel } from "@/components/verdict-panel";
import { FpImage } from "@/components/fp-image";
import { PreviewBanner } from "@/components/admin/preview-banner";
import { STATUS_LABEL, statusKey } from "@/lib/admin/publish";
import { formatDateTime } from "@/lib/admin/datetime";
import { resolveAuthor } from "@/lib/authors";
import { PRICE_CLASS_LABEL } from "@/lib/site";
import { TestvorlageV2, resolveLayout } from "@/components/testvorlage-v2";
import { RATING_LABEL, ratingFor } from "@/lib/scoring";
import { capNote, efBars, prepareErgaenzungArticle, renderStudienListe, scoreErgaenzung, studieDosisText, type EfInput } from "@/lib/ergaenzung";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Vorschau Test" };

export default async function ReviewPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = await prisma.review.findUnique({
    where: { id },
    include: { category: true, studien: { orderBy: [{ wirkstoff: { sortOrder: "asc" } }, { createdAt: "asc" }], include: { wirkstoff: true } } },
  });
  if (!r) notFound();
  const vorlage = resolveLayout({ slug: r.slug, layout: r.layout, layoutData: r.layoutData, totalScore: r.totalScore });
  if (vorlage) {
    const k = statusKey(r.status, r.publishedAt);
    return (
      <article className="mx-auto max-w-6xl">
        <PreviewBanner editHref={`/admin/tests/${r.id}`} note={`Testvorlage V2 · Status: ${STATUS_LABEL[k]}${k === "geplant" ? ` (${formatDateTime(r.publishedAt)})` : ""}`} />
        <TestvorlageV2 data={vorlage} totalScore={r.totalScore} ampelLabel={RATING_LABEL[ratingFor(r.totalScore)]} kopf={<h1>{r.title}</h1>} />
      </article>
    );
  }
  const efInput: EfInput | null = r.bewertungsart === "ERGAENZUNGSFUTTER" ? {
    auswahl: r.efWirkstoffAuswahl ?? 0,
    dosierung: r.efWirkstoffDosierung ?? 0,
    werbung: r.efWerbung ?? 0,
    traeger: r.efTraeger ?? 0,
    mengen: r.efTransparenzMengen ?? 0,
    unterlagen: r.efTransparenzUnterlagen ?? 0,
    alibi: r.efAlibiDosierung,
    keineReferenzdosis: r.efKeineReferenzdosis,
    heilaussage: r.efHeilaussage,
    sicherheit: r.efSicherheit,
  } : null;
  const efResult = efInput ? scoreErgaenzung(efInput) : null;
  const body = efResult
    ? prepareErgaenzungArticle(sanitize(r.bodyHtml), {
        studienHtml: renderStudienListe(r.studien.map((s) => ({
          wirkstoff: s.wirkstoff.name,
          autoren: s.autoren,
          jahr: s.jahr,
          titel: s.titel,
          zeitschrift: s.zeitschrift,
          tierart: s.tierart,
          evidenzstufe: s.evidenzstufe,
          dosis: studieDosisText({
            studiendosisJeKg: s.studiendosisJeKg == null ? null : Number(s.studiendosisJeKg.toString()),
            einheit: s.einheit ?? "",
            studiendosisOriginal: s.studiendosisOriginal,
          }),
          ergebnis: s.ergebnisKurz,
          link: s.link,
        }))),
        tierschutz: r.efTierschutzText,
        rot: efResult.ampel === "ROT",
      })
    : sanitize(r.bodyHtml);
  const key = statusKey(r.status, r.publishedAt);

  return (
    <article className="mx-auto max-w-3xl">
      <PreviewBanner
        editHref={`/admin/tests/${r.id}`}
        note={`Status: ${STATUS_LABEL[key]}${key === "geplant" ? ` (${formatDateTime(r.publishedAt)})` : ""}`}
      />
      <p className="text-sm font-semibold text-brand">
        {r.category.name} · {r.brand}
      </p>
      <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">{r.title}</h1>
      <p className="mt-2 text-sm text-muted">
        {r.productName} · Preisklasse {PRICE_CLASS_LABEL[r.priceClass]}
        {r.pricePerKg ? ` · ${r.pricePerKg.toString().replace(".", ",")} €/kg` : ""}
        {` · Von ${resolveAuthor(r.authorSlug).name}`}
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <figure>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-bg-soft">
            <FpImage src={r.imageUrl} alt={r.imageAlt} blur={r.imageBlur} sizes="(min-width: 640px) 384px, 100vw" priority />
          </div>
          <figcaption className="mt-1.5 text-sm text-muted">Verpackung{!r.imageUrl && " (fehlt)"}</figcaption>
        </figure>
        <figure>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-bg-soft">
            <FpImage src={r.contentImageUrl} alt={r.contentImageAlt} blur={r.contentImageBlur} sizes="(min-width: 640px) 384px, 100vw" />
          </div>
          <figcaption className="mt-1.5 text-sm text-muted">Das Futter selbst{!r.contentImageUrl && " (fehlt)"}</figcaption>
        </figure>
      </div>
      <div className="mt-8">
        <VerdictPanel data={r} bars={efInput && efResult ? efBars(efInput, efResult) : undefined} capNote={efResult ? capNote(efResult) || undefined : undefined} safetyWarning={efResult?.warnsignal ? r.efSicherheitBegruendung : undefined} />
      </div>
      <div className="prose-fp mt-10" dangerouslySetInnerHTML={{ __html: body }} />
      {r.conclusionHtml.trim() && (
        <section className="mt-10"><h2 className="text-2xl font-extrabold">Fazit</h2><div className="prose-fp mt-3" dangerouslySetInnerHTML={{ __html: sanitize(r.conclusionHtml) }} /></section>
      )}
    </article>
  );
}
