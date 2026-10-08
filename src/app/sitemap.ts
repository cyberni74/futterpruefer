import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { publishedWhere } from "@/lib/queries";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const statics = ["/", "/tests", "/blog", "/methodik", "/team", "/fuer-hersteller", "/kontakt", "/faq", "/produkt-des-monats", "/lexikon", "/glossar", "/impressum", "/datenschutz"].map((p) => ({ url: absoluteUrl(p), changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.6 }));
  try {
    const [cats, reviews, posts, lex] = await Promise.all([
      prisma.category.findMany({ select: { slug: true } }),
      prisma.review.findMany({ where: publishedWhere(), select: { slug: true, updatedAt: true, category: { select: { slug: true } } } }),
      prisma.blogPost.findMany({ where: publishedWhere(), select: { slug: true, updatedAt: true } }),
      prisma.lexikonEntry.findMany({ where: publishedWhere(), select: { slug: true, updatedAt: true } }),
    ]);
    return [
      ...statics,
      ...cats.map((c) => ({ url: absoluteUrl(`/${c.slug}`), changeFrequency: "daily" as const, priority: 0.8 })),
      ...reviews.map((r) => ({ url: absoluteUrl(`/${r.category.slug}/${r.slug}`), lastModified: r.updatedAt, priority: 0.9 })),
      ...posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: p.updatedAt, priority: 0.7 })),
      ...lex.map((e) => ({ url: absoluteUrl(`/lexikon/${e.slug}`), lastModified: e.updatedAt, priority: 0.6 })),
    ];
  } catch {
    return statics;
  }
}
