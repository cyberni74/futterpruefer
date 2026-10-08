import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { sanitize } from "@/lib/sanitize";
import { FpImage } from "@/components/fp-image";
import { PreviewBanner } from "@/components/admin/preview-banner";
import { STATUS_LABEL, statusKey } from "@/lib/admin/publish";
import { formatDateTime } from "@/lib/admin/datetime";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Vorschau Blogartikel" };

export default async function BlogPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.blogPost.findUnique({ where: { id } });
  if (!p) notFound();
  const key = statusKey(p.status, p.publishedAt);

  return (
    <article className="mx-auto max-w-3xl">
      <PreviewBanner
        editHref={`/admin/blog/${p.id}`}
        note={`Status: ${STATUS_LABEL[key]}${key === "geplant" ? ` (${formatDateTime(p.publishedAt)})` : ""}`}
      />
      <p className="text-sm font-semibold text-brand">Fachblog</p>
      <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">{p.title}</h1>
      {p.excerpt && <p className="mt-3 text-lg text-muted">{p.excerpt}</p>}
      <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-bg-soft">
        <FpImage src={p.imageUrl} alt={p.imageAlt} blur={p.imageBlur} sizes="(min-width: 768px) 768px, 100vw" priority />
      </div>
      <div className="prose-fp mt-10" dangerouslySetInnerHTML={{ __html: sanitize(p.bodyHtml) }} />
    </article>
  );
}
