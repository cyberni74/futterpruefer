import "server-only";
import { autolinkUrls } from "./autolink";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { blogCardSelect, publishedWhere, reviewCardSelect } from "@/lib/queries";
import { fitsAnimal, subjectAnimal, type AnimalKind } from "@/lib/animals";
import { sanitize, stripHtml } from "@/lib/sanitize";
import { stripAffiliateForRot } from "@/lib/rot-guard";
import { linkify, type LinkTerm } from "@/lib/linkify";
import { badgeScores } from "@/lib/score-badge";

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
export async function renderArticle(html: string | null | undefined, exclude: string[] = [], opts: { rot?: boolean } = {}): Promise<string> {
  const terms = (await getLinkTerms()).filter((t) => !exclude.includes(t.href));
  const clean = badgeScores(autolinkUrls(sanitize(html)));
  // Rot-Regel: auf Testseiten unter 60 Punkten kein Partner-Link und keine Amazon-CTA-Box.
  return linkify(opts.rot ? stripAffiliateForRot(clean) : clean, terms);
}

const words = (list: Array<string | null | undefined>) =>
  [...new Set(list.flatMap((s) => (s ?? "").split(/[,;/]|\s+/)).map((w) => w.trim()).filter((w) => w.length >= 5))].slice(0, 12);

const tagsOf = (values: Array<string | null | undefined>) =>
  [...new Set(values.map((value) => (value ?? "").trim()).filter((value) => value.length >= 3))];

/** Fachartikel zum Test über gemeinsame Tags (keywords, Marke). Keine fremden Artikel nur zum Auffüllen. */
export async function getPostsForReview(r: { brand: string; keyword: string; keywords: string[]; category: { animal: string } }, take = 3) {
  const tags = tagsOf([r.brand, r.keyword, ...r.keywords]);
  if (!tags.length) return [];
  const animal: AnimalKind = r.category.animal === "KATZE" ? "KATZE" : "HUND";
  const rows = await prisma.blogPost.findMany({
    where: {
      ...publishedWhere(),
      OR: [
        { keywords: { hasSome: tags } },
        ...tags.flatMap((tag) => [
          { title: { contains: tag, mode: "insensitive" as const } },
          { excerpt: { contains: tag, mode: "insensitive" as const } },
        ]),
      ],
    },
    orderBy: { publishedAt: "desc" },
    take: 24,
    select: { ...blogCardSelect, keywords: true },
  });
  return rows.filter((post) => fitsAnimal(`${post.title} ${post.excerpt} ${post.keywords.join(" ")}`, animal)).slice(0, take);
}

/** Tests zum Fachartikel über Tags, eingeschränkt auf die genannte Tierart. */
/**
 * Tests, die im Kasten „Passende Tests“ eines bestimmten Beitrags nicht erscheinen (Blog-Slug → Test-Slugs).
 * Betrifft nur diese Auswahl; die Testseiten selbst bleiben unverändert.
 */
export const RELATED_REVIEW_EXCLUDE: Record<string, string[]> = {
  "hunde-nahrungsergaenzung": ["medidog-ulmenrinden-paste"],
};

export async function getReviewsForPost(p: { slug?: string; title: string; keywords: string[]; excerpt?: string; bodyHtml: string }, take = 3) {
  const animal = subjectAnimal(p.title, p.excerpt, p.keywords);
  const excluded = (p.slug && RELATED_REVIEW_EXCLUDE[p.slug]) || [];
  const animalWhere = { ...(animal ? { category: { animal } } : {}), ...(excluded.length ? { slug: { notIn: excluded } } : {}) };
  const tags = tagsOf(p.keywords);
  if (tags.length) {
    const tagged = await prisma.review.findMany({
      where: {
        ...publishedWhere(),
        ...animalWhere,
        OR: [
          { keywords: { hasSome: tags } },
          ...tags.flatMap((tag) => [
            { title: { contains: tag, mode: "insensitive" as const } },
            { keyword: { contains: tag, mode: "insensitive" as const } },
          ]),
        ],
      },
      orderBy: { totalScore: "desc" },
      take,
      select: reviewCardSelect,
    });
    if (tagged.length) return tagged;
  }
  const lex = await getLexikonEntries();
  const body = stripHtml(p.bodyHtml).toLowerCase();
  const lexHits = lex.filter((e) => [e.name, ...e.synonyms].some((n) => body.includes(n.toLowerCase()))).map((e) => e.name);
  const terms = words([...p.keywords, ...lexHits, ...p.title.split(" ")]).filter((w) => !/^(warum|werden|sollten|richtig|zwingend|brauchen|sinnvoll|marketing|unterschied)$/i.test(w));
  if (!terms.length) return [];
  return prisma.review.findMany({
    where: { ...publishedWhere(), ...animalWhere, OR: terms.flatMap((t) => [{ title: { contains: t, mode: "insensitive" as const } }, { keyword: { contains: t, mode: "insensitive" as const } }, { verdict: { contains: t, mode: "insensitive" as const } }, { bodyHtml: { contains: t, mode: "insensitive" as const } }]) },
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
