import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { blogCardSelect, publishedWhere, reviewCardSelect } from "@/lib/queries";
import { sanitize, stripHtml } from "@/lib/sanitize";
import { linkify, type LinkTerm } from "@/lib/linkify";

export const getLexikonEntries = cache(() =>
  prisma.lexikonEntry.findMany({ where: publishedWhere(), orderBy: { name: "asc" } }),
);

export const getGlossary = cache(() => prisma.glossaryTerm.findMany({ orderBy: { term: "asc" } }));

export function getLexikonEntry(slug: string) {
  return prisma.lexikonEntry.findFirst({ where: { slug, ...publishedWhere() } });
}

/** Alle Begriffe für die automatische Verlinkung (Lexikon vor Glossar). */
export const getLinkTerms = cache(async (): Promise<LinkTerm[]> => {
  const [lex, glossary] = await Promise.all([getLexikonEntries(), getGlossary()]);
  return [
    ...lex.map((e) => ({
      id: `lex:${e.id}`,
      patterns: [e.name, ...e.synonyms],
      href: `/lexikon/${e.slug}`,
      title: `${e.name}: ${e.shortDescription}`.slice(0, 200),
      className: `lex-link lex-${e.concern.toLowerCase()}`,
    })),
    ...glossary.map((g) => ({
      id: `gl:${g.id}`,
      patterns: [g.term, ...g.synonyms],
      href: `/glossar#${g.slug}`,
      title: `${g.term}: ${g.definition}`.slice(0, 200),
      className: "gloss-link",
    })),
  ];
});

/** Artikel-HTML: bereinigen, dann Lexikon-/Glossarbegriffe verlinken. */
export async function renderArticle(html: string | null | undefined, exclude: string[] = []): Promise<string> {
  const terms = (await getLinkTerms()).filter((t) => !exclude.includes(t.href));
  return linkify(sanitize(html), terms);
}

const words = (list: Array<string | null | undefined>) =>
  [...new Set(list.flatMap((s) => (s ?? "").split(/[,;/]|\s+/)).map((w) => w.trim()).filter((w) => w.length >= 5))].slice(0, 12);

/** Fachartikel passend zu einem Test (Stichwörter, Marke, Tierart). */
export async function getPostsForReview(r: { brand: string; keyword: string; keywords: string[]; category: { animal: string } }, take = 3) {
  const terms = words([r.brand, r.keyword, ...r.keywords, r.category.animal === "HUND" ? "Hunde" : "Katzen"]);
  const matches = terms.length
    ? await prisma.blogPost.findMany({
        where: { ...publishedWhere(), OR: terms.flatMap((t) => [{ title: { contains: t, mode: "insensitive" as const } }, { excerpt: { contains: t, mode: "insensitive" as const } }, { bodyHtml: { contains: t, mode: "insensitive" as const } }]) },
        orderBy: { publishedAt: "desc" },
        take,
        select: blogCardSelect,
      })
    : [];
  if (matches.length >= take) return matches;
  const fill = await prisma.blogPost.findMany({ where: { ...publishedWhere(), id: { notIn: matches.map((m) => m.id) } }, orderBy: { publishedAt: "desc" }, take: take - matches.length, select: blogCardSelect });
  return [...matches, ...fill];
}

/** Tests passend zu einem Fachartikel. */
export async function getReviewsForPost(p: { title: string; keywords: string[]; bodyHtml: string }, take = 3) {
  const lex = await getLexikonEntries();
  const body = stripHtml(p.bodyHtml).toLowerCase();
  const lexHits = lex.filter((e) => [e.name, ...e.synonyms].some((n) => body.includes(n.toLowerCase()))).map((e) => e.name);
  const terms = words([...p.keywords, ...lexHits, ...p.title.split(" ")]).filter((w) => !/^(warum|werden|sollten|richtig|zwingend|brauchen|sinnvoll|marketing|unterschied)$/i.test(w));
  if (!terms.length) return [];
  return prisma.review.findMany({
    where: { ...publishedWhere(), OR: terms.flatMap((t) => [{ title: { contains: t, mode: "insensitive" as const } }, { keyword: { contains: t, mode: "insensitive" as const } }, { verdict: { contains: t, mode: "insensitive" as const } }, { bodyHtml: { contains: t, mode: "insensitive" as const } }]) },
    orderBy: { totalScore: "desc" },
    take,
    select: reviewCardSelect,
  });
}

/** Tests, in denen ein Lexikon-Begriff vorkommt. */
export function getReviewsMentioning(names: string[], take = 12) {
  const n = names.map((s) => s.trim()).filter((s) => s.length >= 3);
  if (!n.length) return Promise.resolve([]);
  return prisma.review.findMany({
    where: { ...publishedWhere(), OR: n.flatMap((t) => [{ bodyHtml: { contains: t, mode: "insensitive" as const } }, { verdict: { contains: t, mode: "insensitive" as const } }, { cons: { has: t } }, { pros: { has: t } }]) },
    orderBy: { totalScore: "desc" },
    take,
    select: reviewCardSelect,
  });
}
