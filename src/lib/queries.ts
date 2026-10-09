import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { buildMonthlyWinners, currentPom } from "@/lib/pom";

export const publishedWhere = () => ({ status: "PUBLISHED" as const, publishedAt: { lte: new Date() } });

export const reviewCardSelect = {
  id: true,
  slug: true,
  title: true,
  brand: true,
  productName: true,
  keyword: true,
  imageUrl: true,
  imageAlt: true,
  imageBlur: true,
  totalScore: true,
  scoreHarmful: true,
  priceClass: true,
  publishedAt: true,
  category: { select: { slug: true, shortName: true, animal: true } },
} satisfies Prisma.ReviewSelect;

export type ReviewCardData = Prisma.ReviewGetPayload<{ select: typeof reviewCardSelect }>;

export const blogCardSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  imageUrl: true,
  imageAlt: true,
  imageBlur: true,
  publishedAt: true,
} satisfies Prisma.BlogPostSelect;

export type BlogCardData = Prisma.BlogPostGetPayload<{ select: typeof blogCardSelect }>;

export function getLatestReviews(take = 10) {
  return prisma.review.findMany({ where: publishedWhere(), orderBy: { publishedAt: "desc" }, take, select: reviewCardSelect });
}

/** Neueste Änderung eines veröffentlichten Tests – Grundlage für das Jahr im Startseiten-Title. */
export const getNewestReviewUpdate = cache(async (): Promise<Date | null> => {
  const row = await prisma.review.findFirst({
    where: publishedWhere(),
    orderBy: { updatedAt: "desc" },
    select: { updatedAt: true },
  });
  return row?.updatedAt ?? null;
});

export function getLatestPosts(take = 5) {
  return prisma.blogPost.findMany({ where: publishedWhere(), orderBy: { publishedAt: "desc" }, take, select: blogCardSelect });
}

export function getCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}

export function getCategory(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export function getReviewBySlug(slug: string) {
  return prisma.review.findFirst({ where: { slug, ...publishedWhere() }, include: { category: true } });
}

export function getPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({ where: { slug, ...publishedWhere() } });
}

/** Produkte des Monats (Testsieger je Monat, manuelle Einträge überschreiben), neueste zuerst. */
export async function getProductOfMonthArchive() {
  const [reviews, manual] = await Promise.all([
    prisma.review.findMany({ where: publishedWhere(), select: reviewCardSelect }),
    prisma.productOfMonth.findMany({ where: { review: publishedWhere() }, include: { review: { select: reviewCardSelect } } }),
  ]);
  return buildMonthlyWinners(reviews, manual);
}

export async function getProductOfMonth() {
  return currentPom(await getProductOfMonthArchive());
}

export type TickerEntry = { id: string; text: string; href: string | null; isWarning: boolean };

export async function getTickerEntries(): Promise<TickerEntry[]> {
  const now = new Date();
  const [manual, reviews, posts] = await Promise.all([
    prisma.tickerItem.findMany({
      where: { active: true, OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
      orderBy: [{ isWarning: "desc" }, { createdAt: "desc" }],
      take: 5,
    }),
    prisma.review.findMany({ where: publishedWhere(), orderBy: { publishedAt: "desc" }, take: 3, select: { id: true, slug: true, title: true, totalScore: true, category: { select: { slug: true } } } }),
    prisma.blogPost.findMany({ where: publishedWhere(), orderBy: { publishedAt: "desc" }, take: 2, select: { id: true, slug: true, title: true } }),
  ]);
  return [
    ...manual.map((m) => ({ id: m.id, text: m.text, href: m.href, isWarning: m.isWarning })),
    ...reviews.map((r) => ({ id: r.id, text: `Neuer Test: ${r.title} – ${r.totalScore}/100 Punkte`, href: `/${r.category.slug}/${r.slug}`, isWarning: false })),
    ...posts.map((p) => ({ id: p.id, text: `Fachblog: ${p.title}`, href: `/blog/${p.slug}`, isWarning: false })),
  ];
}

export function getRelatedReviews(categoryId: string, excludeId: string, take = 3) {
  return prisma.review.findMany({
    where: { ...publishedWhere(), categoryId, id: { not: excludeId } },
    orderBy: { totalScore: "desc" },
    take,
    select: reviewCardSelect,
  });
}

export async function findRedirect(path: string) {
  return prisma.redirect.findUnique({ where: { fromPath: path } });
}

/**
 * Löst einen (ggf. alten) Test-Slug zur aktuellen URL auf – auch über Slug-Weiterleitungen aus dem Admin (/tests/<alt> → /tests/<neu>).
 */
export async function resolveReviewPath(slug: string): Promise<string | null> {
  let current = slug;
  for (let hop = 0; hop < 5; hop++) {
    const r = await prisma.review.findFirst({ where: { slug: current, ...publishedWhere() }, select: { slug: true, category: { select: { slug: true } } } });
    if (r) return `/${r.category.slug}/${r.slug}`;
    const red = await prisma.redirect.findUnique({ where: { fromPath: `/tests/${current}` } });
    const next = red?.toPath.match(/^\/tests\/([a-z0-9-]+)$/)?.[1];
    if (!next || next === current) return red?.toPath ?? null;
    current = next;
  }
  return null;
}

/** Je Kategorie: Anzahl veröffentlichter Tests und der bestbewertete Test (für interne Verlinkung auf der Startseite). */
export async function getCategoryLeaders() {
  const categories = await getCategories();
  return Promise.all(
    categories.map(async (c) => {
      const where = { ...publishedWhere(), categoryId: c.id };
      const [count, top] = await Promise.all([
        prisma.review.count({ where }),
        prisma.review.findFirst({ where, orderBy: [{ totalScore: "desc" }, { publishedAt: "desc" }], select: { slug: true, brand: true, productName: true, totalScore: true } }),
      ]);
      return { ...c, count, top };
    }),
  );
}

export function getHomeFaq(take = 4) {
  return prisma.faqItem.findMany({ orderBy: { sortOrder: "asc" }, take });
}

export function countPublishedReviews(categoryId: string) {
  return prisma.review.count({ where: { ...publishedWhere(), categoryId } });
}
