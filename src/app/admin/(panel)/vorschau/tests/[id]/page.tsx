import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { sanitize } from "@/lib/sanitize";
import { VerdictPanel } from "@/components/verdict-panel";
import { FpImage } from "@/components/fp-image";
import { PreviewBanner } from "@/components/admin/preview-banner";
import { STATUS_LABEL, statusKey } from "@/lib/admin/publish";
import { formatDateTime } from "@/lib/admin/datetime";
import { PRICE_CLASS_LABEL } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Vorschau Test" };

export default async function ReviewPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = await prisma.review.findUnique({ where: { id }, include: { category: true } });
  if (!r) notFound();
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
      </p>
      <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-bg-soft">
        <FpImage src={r.imageUrl} alt={r.imageAlt} blur={r.imageBlur} sizes="(min-width: 768px) 768px, 100vw" priority />
      </div>
      <div className="mt-8">
        <VerdictPanel data={r} />
      </div>
      <div className="prose-fp mt-10" dangerouslySetInnerHTML={{ __html: sanitize(r.bodyHtml) }} />
    </article>
  );
}
