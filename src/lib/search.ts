import "server-only";
import { prisma } from "@/lib/db";

export type SearchHit = {
  type: "test" | "blog" | "lexikon";
  slug: string;
  title: string;
  subtitle: string;
  score: number | null;
  imageUrl: string | null;
};

/** Volltextsuche (deutsch) + Trigramm-Ähnlichkeit für Tippfehler. */
export async function search(query: string | null | undefined, limit = 20): Promise<SearchHit[]> {
  const q = (query ?? "").trim().slice(0, 100);
  if (q.length < 2) return [];
  const like = `%${q.toLowerCase().replace(/[%_\\]/g, "\\$&")}%`;
  const now = new Date();

  const [tests, posts, lex] = await Promise.all([
    prisma.$queryRaw<Array<{ slug: string; title: string; brand: string; keyword: string; totalScore: number; imageUrl: string | null; rank: number }>>`
      SELECT slug, title, brand, keyword, "totalScore", "imageUrl",
        ts_rank(to_tsvector('german', coalesce(title,'') || ' ' || coalesce(brand,'') || ' ' || coalesce("productName",'') || ' ' || coalesce(keyword,'') || ' ' || coalesce(verdict,'')), websearch_to_tsquery('german', ${q}))
        + similarity(lower(brand || ' ' || "productName"), lower(${q})) AS rank
      FROM "Review"
      WHERE status = 'PUBLISHED' AND "publishedAt" <= ${now} AND (
        to_tsvector('german', coalesce(title,'') || ' ' || coalesce(brand,'') || ' ' || coalesce("productName",'') || ' ' || coalesce(keyword,'') || ' ' || coalesce(verdict,'')) @@ websearch_to_tsquery('german', ${q})
        OR lower(brand || ' ' || "productName") % lower(${q})
        OR word_similarity(lower(${q}), lower(brand || ' ' || "productName")) > 0.4
        OR lower(brand || ' ' || "productName") LIKE ${like}
      )
      ORDER BY rank DESC
      LIMIT ${limit}`,
    prisma.$queryRaw<Array<{ slug: string; title: string; excerpt: string; imageUrl: string | null; rank: number }>>`
      SELECT slug, title, excerpt, "imageUrl",
        ts_rank(to_tsvector('german', coalesce(title,'') || ' ' || coalesce(excerpt,'')), websearch_to_tsquery('german', ${q}))
        + similarity(lower(title), lower(${q})) AS rank
      FROM "BlogPost"
      WHERE status = 'PUBLISHED' AND "publishedAt" <= ${now} AND (
        to_tsvector('german', coalesce(title,'') || ' ' || coalesce(excerpt,'')) @@ websearch_to_tsquery('german', ${q})
        OR word_similarity(lower(${q}), lower(title)) > 0.4
        OR lower(title) LIKE ${like}
      )
      ORDER BY rank DESC
      LIMIT ${limit}`,
    prisma.$queryRaw<Array<{ slug: string; name: string; shortDescription: string; rank: number }>>`
      SELECT slug, name, "shortDescription",
        similarity(lower(name), lower(${q})) + CASE WHEN lower(name) LIKE ${like} THEN 0.5 ELSE 0 END AS rank
      FROM "LexikonEntry"
      WHERE status = 'PUBLISHED' AND "publishedAt" <= ${now} AND (
        lower(name) LIKE ${like}
        OR word_similarity(lower(${q}), lower(name)) > 0.4
        OR EXISTS (SELECT 1 FROM unnest(synonyms) s WHERE lower(s) LIKE ${like})
      )
      ORDER BY rank DESC
      LIMIT ${limit}`,
  ]);

  const hits: Array<SearchHit & { rank: number }> = [
    ...tests.map((t) => ({ type: "test" as const, slug: t.slug, title: t.title, subtitle: t.keyword || t.brand, score: t.totalScore, imageUrl: t.imageUrl, rank: Number(t.rank) })),
    ...lex.map((l) => ({ type: "lexikon" as const, slug: l.slug, title: l.name, subtitle: l.shortDescription, score: null, imageUrl: null, rank: Number(l.rank) })),
    ...posts.map((p) => ({ type: "blog" as const, slug: p.slug, title: p.title, subtitle: p.excerpt, score: null, imageUrl: p.imageUrl, rank: Number(p.rank) })),
  ];
  return hits.sort((a, b) => b.rank - a.rank).slice(0, limit).map(({ type, slug, title, subtitle, score, imageUrl }) => ({ type, slug, title, subtitle, score, imageUrl }));
}
