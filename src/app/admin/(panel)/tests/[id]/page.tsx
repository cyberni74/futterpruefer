import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ReviewEditor } from "@/components/admin/review-editor";
import { getBrands } from "@/lib/admin/brands";
import { StatusBadge } from "@/components/admin/status-badge";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { reviewToEditorData } from "@/lib/admin/editor-data";
import { deleteReview, saveReview } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Test bearbeiten" };

export default async function EditReviewPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ neu?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const [review, categories, brands, referenzen] = await Promise.all([
    prisma.review.findUnique({
      where: { id },
      include: { wirkstoffe: { orderBy: { sortOrder: "asc" }, include: { studien: { orderBy: { createdAt: "asc" } } } } },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true, slug: true, animal: true } }),
    getBrands(),
    prisma.referenzdosis.findMany({ orderBy: [{ wirkstoff: "asc" }, { tierart: "asc" }] }),
  ]);
  if (!review) notFound();

  return (
    <ReviewEditor
      key={review.id}
      initial={reviewToEditorData(review)}
      categories={categories}
      referenzen={referenzen.map((r) => ({
        id: r.id,
        wirkstoff: r.wirkstoff,
        tierart: r.tierart,
        mgProKgMin: r.mgProKgMin == null ? null : Number(r.mgProKgMin.toString()),
        einheit: r.einheit,
        quelle: r.quelle,
        luecke: r.luecke,
        hinweis: r.hinweis,
      }))}
      brands={brands}
      action={saveReview.bind(null, review.id)}
      justCreated={sp.neu === "1"}
      badge={<StatusBadge status={review.status} publishedAt={review.publishedAt} />}
      deleteSlot={
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">Löschen entfernt den Test endgültig, inklusive Produkt-des-Monats-Einträgen.</p>
          <ConfirmButton action={deleteReview.bind(null, review.id)} label="Test löschen" confirmText={`„${review.title}“ wirklich endgültig löschen?`} />
        </div>
      }
    />
  );
}
