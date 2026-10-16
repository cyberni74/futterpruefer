import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { publishedWhere, reviewCardSelect } from "@/lib/queries";
import { slugify } from "@/lib/slug";

export type BrandRow = { brand: string; slug: string; count: number; avg: number; updatedAt: Date | null };

/** Alle Marken mit mindestens einem veröffentlichten Test, alphabetisch. */
export const getBrands = cache(async (): Promise<BrandRow[]> => {
  const rows = await prisma.review.groupBy({
    by: ["brand"],
    where: { ...publishedWhere(), NOT: { brand: "" } },
    _count: { _all: true },
    _avg: { totalScore: true },
    _max: { updatedAt: true },
  });
  return rows
    .map((r) => ({ brand: r.brand, slug: slugify(r.brand), count: r._count._all, avg: Math.round(r._avg.totalScore ?? 0), updatedAt: r._max.updatedAt }))
    .filter((r) => r.slug)
    .sort((a, b) => a.brand.localeCompare(b.brand, "de", { sensitivity: "base" }));
});

export async function getBrandBySlug(slug: string): Promise<BrandRow | null> {
  return (await getBrands()).find((b) => b.slug === slug) ?? null;
}

export function getBrandReviews(brand: string) {
  return prisma.review.findMany({ where: { ...publishedWhere(), brand }, orderBy: [{ totalScore: "desc" }, { publishedAt: "desc" }], select: reviewCardSelect });
}
