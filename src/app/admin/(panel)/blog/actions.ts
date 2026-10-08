"use server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/auth";
import { sanitize } from "@/lib/sanitize";
import { revalidateContent } from "@/lib/revalidate";
import { blogFormToRaw, blogSchema, isUniqueViolation, toFieldErrors, type ActionResult } from "@/lib/admin/schemas";
import { resolvePublish, statusKey, STATUS_LABEL } from "@/lib/admin/publish";
import { applyRedirectPlan, contentPath, planSlugRedirect } from "@/lib/admin/redirects";
import { fail, guard, ok, revalidateAdmin } from "@/lib/admin/guard";

export async function savePost(id: string | null, _prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;

  const parsed = blogSchema.safeParse(blogFormToRaw(formData));
  if (!parsed.success) return fail("Bitte die markierten Felder korrigieren.", toFieldErrors(parsed.error));
  const v = parsed.data;

  const existing = id ? await prisma.blogPost.findUnique({ where: { id }, select: { id: true, slug: true, status: true, publishedAt: true } }) : null;
  if (id && !existing) return fail("Dieser Artikel existiert nicht mehr.");

  const pub = resolvePublish(v.publishMode, v.scheduledAt, existing);
  if (!pub.ok) return fail(pub.error, { scheduledAt: pub.error });

  const data = {
    slug: v.slug,
    title: v.title,
    excerpt: v.excerpt,
    imageUrl: v.imageUrl || null,
    imageAlt: v.imageAlt,
    imageBlur: v.imageBlur || null,
    bodyHtml: sanitize(v.bodyHtml),
    metaTitle: v.metaTitle,
    metaDescription: v.metaDescription,
    keywords: v.keywords,
    status: pub.status,
    publishedAt: pub.publishedAt,
  };

  let savedId: string;
  try {
    savedId = await prisma.$transaction(async (tx) => {
      const saved = existing ? await tx.blogPost.update({ where: { id: existing.id }, data }) : await tx.blogPost.create({ data });
      await applyRedirectPlan(tx.redirect, planSlugRedirect("blog", existing?.slug, v.slug));
      return saved.id;
    });
  } catch (e) {
    if (isUniqueViolation(e)) {
      const msg = "Dieser Slug ist bereits vergeben – bitte einen anderen wählen.";
      return fail(msg, { slug: msg });
    }
    console.error("savePost", e);
    return fail("Speichern fehlgeschlagen. Bitte erneut versuchen.");
  }

  revalidateContent("blog", [existing?.slug, v.slug]);
  revalidateAdmin();

  if (!existing) redirect(`/admin/blog/${savedId}?neu=1`);

  const label = STATUS_LABEL[statusKey(pub.status, pub.publishedAt)];
  const slugNote = existing.slug !== v.slug ? ` Weiterleitung von ${contentPath("blog", existing.slug)} angelegt.` : "";
  return ok(`Gespeichert (${label}).${slugNote}`);
}

export async function deletePost(id: string) {
  await requireAdmin();
  const post = await prisma.blogPost.findUnique({ where: { id }, select: { slug: true } });
  if (!post) return { ok: false, message: "Artikel nicht gefunden." };
  const path = contentPath("blog", post.slug);
  await prisma.$transaction([prisma.redirect.deleteMany({ where: { toPath: path } }), prisma.blogPost.delete({ where: { id } })]);
  revalidateContent("blog", [post.slug]);
  revalidateAdmin();
  redirect("/admin/blog?geloescht=1");
}
