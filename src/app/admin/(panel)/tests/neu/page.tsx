import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ReviewEditor } from "@/components/admin/review-editor";
import { EMPTY_REVIEW } from "@/lib/admin/editor-data";
import { saveReview } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Neuer Test" };

export default async function NewReviewPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true, slug: true } });
  return <ReviewEditor initial={EMPTY_REVIEW} categories={categories} action={saveReview.bind(null, null)} />;
}
