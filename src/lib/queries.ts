import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { buildMonthlyWinners, currentPom } from "@/lib/pom";
import { FEATURED_COMPARISON, FEATURED_COMPARISONS } from "@/lib/featured-comparison";

export const publishedWhere = () => ({ status: "PUBLISHED" as const, publishedAt: { lte: new Date() } });

export const reviewCardSelect = {
  id: true,
  slug: true,
  title: true,
  brand: true,
  productName: true,
  keyword: true,
  teaser: true,
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

/** Nur Vercel-Preview. Produktion und lokale Läufe ohne VERCEL_ENV bleiben bei veröffentlichten Tests. */
export function previewDraftsEnabled(): boolean {
  return process.env.VERCEL_ENV === "preview";
}

export function getReviewBySlug(slug: string, options?: { includeDrafts?: boolean }) {
  const includeDrafts = options?.includeDrafts === true;
  return prisma.review.findFirst({
    where: includeDrafts ? { slug } : { slug, ...publishedWhere() },
    include: {
      category: true,
      studien: { orderBy: [{ wirkstoff: { sortOrder: "asc" } }, { createdAt: "asc" }], include: { wirkstoff: true } },
    },
  });
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

/** Startseiten-Kasten „Testsieger“: Konfiguration plus Bild aus dem veröffentlichten Blogbeitrag. */
export async function getFeaturedComparison() {
  if (!FEATURED_COMPARISON) return null;
  const post = await prisma.blogPost.findFirst({
    where: { slug: FEATURED_COMPARISON.slug, ...publishedWhere() },
    select: { slug: true, imageUrl: true, imageAlt: true, imageBlur: true },
  });
  return post ? { ...FEATURED_COMPARISON, post } : null;
}

/** Alle Startseiten-Kästen „Testsieger“ in der Reihenfolge von FEATURED_COMPARISONS (neuester zuerst). */
export async function getFeaturedComparisons() {
  if (FEATURED_COMPARISONS.length === 0) return [];
  const posts = await prisma.blogPost.findMany({
    where: { slug: { in: FEATURED_COMPARISONS.map((c) => c.slug) }, ...publishedWhere() },
    select: { slug: true, imageUrl: true, imageAlt: true, imageBlur: true },
  });
  const bySlug = new Map(posts.map((p) => [p.slug, p]));
  return FEATURED_COMPARISONS.flatMap((c) => {
    const post = bySlug.get(c.slug);
    return post ? [{ ...c, post }] : [];
  });
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

/**
 * Verwandte Tests: Nachbarn in der Punkte-Rangliste der Kategorie (ringförmig), nicht immer die Top 3.
 * So verweist jeder Test auf Produkte mit ähnlicher Punktzahl, und jeder Test bekommt Links von
 * anderen Testseiten (keine Seite hängt nur an der Kategorieübersicht).
 */
export async function getRelatedReviews(categoryId: string, excludeId: string, take = 3) {
  const ranking = await prisma.review.findMany({
    where: { ...publishedWhere(), categoryId },
    orderBy: [{ totalScore: "desc" }, { id: "asc" }],
    select: { id: true },
  });
  const ids = relatedNeighborIds(ranking.map((r) => r.id), excludeId, take);
  if (!ids.length) return [];
  const rows = await prisma.review.findMany({ where: { id: { in: ids } }, select: reviewCardSelect });
  const byId = new Map(rows.map((r) => [r.id, r]));
  return ids.flatMap((id) => byId.get(id) ?? []);
}

/** Ring-Nachbarn: einer davor, dann die folgenden. Ergebnis nach Punkten absteigend wie die Rangliste. */
export function relatedNeighborIds(ranked: string[], selfId: string, take = 3): string[] {
  const others = ranked.filter((id) => id !== selfId);
  if (others.length <= take) return others;
  const i = ranked.indexOf(selfId);
  if (i < 0) return others.slice(0, take);
  const n = ranked.length;
  const picked: number[] = [];
  for (const offset of [-1, ...Array.from({ length: take - 1 }, (_, k) => k + 1)]) {
    picked.push((((i + offset) % n) + n) % n);
  }
  return picked.sort((a, b) => a - b).map((idx) => ranked[idx]);
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

/** Anzahl veröffentlichter Tests und Beiträge für Aufrufe unter den Vorschau-Boxen. */
export async function getPublishedCounts() {
  const [tests, posts] = await Promise.all([prisma.review.count({ where: publishedWhere() }), prisma.blogPost.count({ where: publishedWhere() })]);
  return { tests, posts };
}

/** Chronologisch vorheriger veröffentlichter Beitrag; beim ältesten der neueste (Ring). */
export async function getPreviousPost(postId: string) {
  const ids = await prisma.blogPost.findMany({
    where: publishedWhere(),
    orderBy: [{ publishedAt: "desc" }, { id: "asc" }],
    select: { id: true },
  });
  if (ids.length < 2) return null;
  const i = ids.findIndex((r) => r.id === postId);
  if (i < 0) return null;
  const prevId = ids[(i + 1) % ids.length].id;
  return prisma.blogPost.findUnique({ where: { id: prevId }, select: blogCardSelect });
}
