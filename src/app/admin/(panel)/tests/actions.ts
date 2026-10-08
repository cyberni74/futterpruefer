"use server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/auth";
import { sanitize } from "@/lib/sanitize";
import { autolinkUrls } from "@/lib/autolink";
import { totalScore } from "@/lib/scoring";
import { revalidateContent } from "@/lib/revalidate";
import { isUniqueViolation, reviewFormToRaw, reviewSchema, toFieldErrors, type ActionResult } from "@/lib/admin/schemas";
import { resolvePublish, statusKey, STATUS_LABEL } from "@/lib/admin/publish";
import { applyRedirectPlan, contentPath, planSlugRedirect } from "@/lib/admin/redirects";
import { fail, guard, ok, revalidateAdmin } from "@/lib/admin/guard";
import { canonicalBrand, getBrands } from "@/lib/admin/brands";

export async function saveReview(id: string | null, _prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;

  const parsed = reviewSchema.safeParse(reviewFormToRaw(formData));
  if (!parsed.success) return fail("Bitte die markierten Felder korrigieren.", toFieldErrors(parsed.error));
  const v = parsed.data;

  const existing = id ? await prisma.review.findUnique({ where: { id }, select: { id: true, slug: true, status: true, publishedAt: true } }) : null;
  if (id && !existing) return fail("Dieser Test existiert nicht mehr.");

  const category = await prisma.category.findUnique({ where: { id: v.categoryId }, select: { id: true } });
  if (!category) return fail("Bitte eine gültige Kategorie wählen.", { categoryId: "Kategorie nicht gefunden." });

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
    ...scores,
    totalScore: totalScore(scores),
    verdict: v.verdict,
    harmfulReason: v.harmfulReason,
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
    bodyHtml: autolinkUrls(sanitize(v.bodyHtml)),
    metaTitle: v.metaTitle,
    metaDescription: v.metaDescription,
    keywords: v.keywords,
    status: pub.status,
    publishedAt: pub.publishedAt,
  };

  let savedId: string;
  try {
    savedId = await prisma.$transaction(async (tx) => {
      const saved = existing ? await tx.review.update({ where: { id: existing.id }, data }) : await tx.review.create({ data });
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
