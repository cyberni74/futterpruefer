import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ReviewEditor } from "@/components/admin/review-editor";
import { getBrands } from "@/lib/admin/brands";
import { EMPTY_REVIEW } from "@/lib/admin/editor-data";
import { saveReview } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Neuer Test" };

export default async function NewReviewPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true, slug: true } }),
    getBrands(),
  ]);
  return <ReviewEditor initial={EMPTY_REVIEW} categories={categories} brands={brands} action={saveReview.bind(null, null)} />;
}
