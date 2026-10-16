import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { publishedWhere } from "@/lib/queries";
import { absoluteUrl } from "@/lib/site";
import { sitemapEntries } from "@/lib/sitemap-entries";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [categories, reviews, posts, lexikon, glossary] = await Promise.all([
      prisma.category.findMany({ select: { slug: true } }),
      prisma.review.findMany({ where: publishedWhere(), select: { slug: true, updatedAt: true, category: { select: { slug: true } } } }),
      prisma.blogPost.findMany({ where: publishedWhere(), select: { slug: true, updatedAt: true } }),
      prisma.lexikonEntry.findMany({ where: publishedWhere(), select: { slug: true, updatedAt: true } }),
      prisma.glossaryTerm.findMany({ select: { slug: true, updatedAt: true } }),
    ]);
    return sitemapEntries({
      categories,
      reviews: reviews.map((row) => ({ slug: row.slug, updatedAt: row.updatedAt, categorySlug: row.category.slug })),
      posts,
      lexikon,
      glossary,
    }).map((entry) => ({
      url: absoluteUrl(entry.path),
      ...(entry.lastModified ? { lastModified: entry.lastModified } : {}),
      ...(entry.changeFrequency ? { changeFrequency: entry.changeFrequency } : {}),
      priority: entry.priority,
    }));
  } catch {
    return sitemapEntries({ categories: [], reviews: [], posts: [], lexikon: [], glossary: [] }).map((entry) => ({
      url: absoluteUrl(entry.path),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    }));
  }
}
