import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { canonicalBrand } from "@/lib/brand-alias";
import { publishedWhere, reviewCardSelect } from "@/lib/queries";
import { slugify } from "@/lib/slug";

export type BrandRow = { brand: string; slug: string; count: number; avg: number; updatedAt: Date | null; variants: string[] };

/** Alle Marken mit mindestens einem veröffentlichten Test, alphabetisch; Schreibweisen/Produktlinien sind zusammengeführt. */
export const getBrands = cache(async (): Promise<BrandRow[]> => {
  const rows = await prisma.review.groupBy({
    by: ["brand"],
    where: { ...publishedWhere(), NOT: { brand: "" } },
    _count: { _all: true },
    _sum: { totalScore: true },
    _max: { updatedAt: true },
  });
  const merged = new Map<string, { brand: string; count: number; sum: number; updatedAt: Date | null; variants: string[] }>();
  for (const r of rows) {
    const brand = canonicalBrand(r.brand);
    const key = slugify(brand);
    if (!key) continue;
    const cur = merged.get(key) ?? { brand, count: 0, sum: 0, updatedAt: null, variants: [] };
    cur.count += r._count._all;
    cur.sum += r._sum.totalScore ?? 0;
    const u = r._max.updatedAt;
    if (u && (!cur.updatedAt || u > cur.updatedAt)) cur.updatedAt = u;
    cur.variants.push(r.brand);
    merged.set(key, cur);
  }
  return [...merged.entries()]
    .map(([slug, v]) => ({ brand: v.brand, slug, count: v.count, avg: Math.round(v.sum / v.count), updatedAt: v.updatedAt, variants: v.variants }))
    .sort((a, b) => a.brand.localeCompare(b.brand, "de", { sensitivity: "base" }));
});

export async function getBrandBySlug(slug: string): Promise<BrandRow | null> {
  return (await getBrands()).find((b) => b.slug === slug) ?? null;
}

export function getBrandReviews(variants: string[]) {
  return prisma.review.findMany({ where: { ...publishedWhere(), brand: { in: variants } }, orderBy: [{ totalScore: "desc" }, { publishedAt: "desc" }], select: reviewCardSelect });
}
