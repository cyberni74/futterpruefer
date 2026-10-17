export type SitemapRecord = { slug: string; updatedAt: Date; categorySlug?: string };

const STATIC_PATHS = [
  "/",
  "/tests",
  "/marken",
  "/blog",
  "/methodik",
  "/methodik/ergaenzungsfutter",
  "/team",
  "/fuer-hersteller",
  "/kontakt",
  "/faq",
  "/werbeaussagen",
  "/produkt-des-monats",
  "/lexikon",
  "/glossar",
  "/impressum",
  "/datenschutz",
] as const;

export type SitemapEntry = {
  path: string;
  lastModified?: Date;
  changeFrequency?: "weekly" | "daily";
  priority: number;
};

function latest(dates: Date[]): Date | undefined {
  if (!dates.length) return undefined;
  return new Date(Math.max(...dates.map((date) => date.getTime())));
}

/**
 * lastmod nur aus echten updatedAt-Werten.
 * Statische Seiten ohne eigenen Inhalt bleiben ohne Datum, damit kein Build-Zeitpunkt als Änderung erscheint.
 */
export function sitemapEntries(input: {
  categories: { slug: string }[];
  reviews: SitemapRecord[];
  posts: SitemapRecord[];
  lexikon: SitemapRecord[];
  glossary: SitemapRecord[];
  brands?: SitemapRecord[];
}): SitemapEntry[] {
  const reviewDates = input.reviews.map((row) => row.updatedAt);
  const postDates = input.posts.map((row) => row.updatedAt);
  const lexDates = input.lexikon.map((row) => row.updatedAt);
  const glossDates = input.glossary.map((row) => row.updatedAt);
  const byPath: Record<string, Date | undefined> = {
    "/": latest([...reviewDates, ...postDates, ...lexDates, ...glossDates]),
    "/tests": latest(reviewDates),
    "/marken": latest(reviewDates),
    "/blog": latest(postDates),
    "/lexikon": latest(lexDates),
    "/glossar": latest(glossDates),
    "/produkt-des-monats": latest(reviewDates),
    "/methodik/ergaenzungsfutter": new Date("2026-10-17T00:00:00.000Z"),
  };
  const entries: SitemapEntry[] = STATIC_PATHS.map((path) => ({
    path,
    ...(byPath[path] ? { lastModified: byPath[path] } : {}),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.6,
  }));
  for (const category of input.categories) {
    const lastModified = latest(input.reviews.filter((row) => row.categorySlug === category.slug).map((row) => row.updatedAt));
    entries.push({
      path: `/${category.slug}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: "daily",
      priority: 0.8,
    });
  }
  for (const review of input.reviews) {
    entries.push({ path: `/${review.categorySlug}/${review.slug}`, lastModified: review.updatedAt, priority: 0.9 });
  }
  for (const post of input.posts) {
    entries.push({ path: `/blog/${post.slug}`, lastModified: post.updatedAt, priority: 0.7 });
  }
  for (const brand of input.brands ?? []) {
    entries.push({ path: `/marken/${brand.slug}`, lastModified: brand.updatedAt, priority: 0.7 });
  }
  for (const entry of input.lexikon) {
    entries.push({ path: `/lexikon/${entry.slug}`, lastModified: entry.updatedAt, priority: 0.6 });
  }
  return entries;
}
