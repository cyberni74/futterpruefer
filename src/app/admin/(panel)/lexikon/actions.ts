"use server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/auth";
import { sanitize } from "@/lib/sanitize";
import { isUniqueViolation, toFieldErrors, type ActionResult } from "@/lib/admin/schemas";
import { lexikonFormToRaw, lexikonSchema } from "@/lib/admin/lexikon";
import { resolvePublish, statusKey, STATUS_LABEL } from "@/lib/admin/publish";
import { applyRedirectPlan, contentPath, planSlugRedirect } from "@/lib/admin/redirects";
import { fail, guard, ok, revalidateAdmin } from "@/lib/admin/guard";
import { revalidateTerms } from "@/lib/admin/revalidate-terms";

export async function saveLexikon(id: string | null, _prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;

  const parsed = lexikonSchema.safeParse(lexikonFormToRaw(formData));
  if (!parsed.success) return fail("Bitte die markierten Felder korrigieren.", toFieldErrors(parsed.error));
  const v = parsed.data;

  const existing = id ? await prisma.lexikonEntry.findUnique({ where: { id }, select: { id: true, slug: true, status: true, publishedAt: true } }) : null;
  if (id && !existing) return fail("Dieser Eintrag existiert nicht mehr.");

  const pub = resolvePublish(v.publishMode, v.scheduledAt, existing);
  if (!pub.ok) return fail(pub.error, { scheduledAt: pub.error });

  const data = {
    slug: v.slug,
    name: v.name,
    synonyms: v.synonyms,
    group: v.group,
    concern: v.concern,
    shortDescription: v.shortDescription,
    assessment: v.assessment,
    bodyHtml: sanitize(v.bodyHtml),
    metaTitle: v.metaTitle,
    metaDescription: v.metaDescription,
    status: pub.status,
    publishedAt: pub.publishedAt,
  };

  let savedId: string;
  try {
    savedId = await prisma.$transaction(async (tx) => {
      const saved = existing ? await tx.lexikonEntry.update({ where: { id: existing.id }, data }) : await tx.lexikonEntry.create({ data });
      await applyRedirectPlan(tx.redirect, planSlugRedirect("lexikon", existing?.slug, v.slug));
      return saved.id;
    });
  } catch (e) {
    if (isUniqueViolation(e)) {
      const msg = "Dieser Slug ist bereits vergeben – bitte einen anderen wählen.";
      return fail(msg, { slug: msg });
    }
    console.error("saveLexikon", e);
    return fail("Speichern fehlgeschlagen. Bitte erneut versuchen.");
  }

  revalidateTerms();
  revalidateAdmin();

  if (!existing) redirect(`/admin/lexikon/${savedId}?neu=1`);

  const label = STATUS_LABEL[statusKey(pub.status, pub.publishedAt)];
  const slugNote = existing.slug !== v.slug ? ` Weiterleitung von ${contentPath("lexikon", existing.slug)} angelegt.` : "";
  return ok(`Gespeichert (${label}).${slugNote}`);
}

export async function deleteLexikon(id: string) {
  await requireAdmin();
  const entry = await prisma.lexikonEntry.findUnique({ where: { id }, select: { slug: true } });
  if (!entry) return { ok: false, message: "Eintrag nicht gefunden." };
  const path = contentPath("lexikon", entry.slug);
  await prisma.$transaction([prisma.redirect.deleteMany({ where: { toPath: path } }), prisma.lexikonEntry.delete({ where: { id } })]);
  revalidateTerms();
  revalidateAdmin();
  redirect("/admin/lexikon?geloescht=1");
}
