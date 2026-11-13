export type SitemapRecord = { slug: string; updatedAt: Date; categorySlug?: string; count?: number };

/**
 * Letzte inhaltliche Änderung statischer Seiten (Git-Commit der Seite, UTC).
 * Nicht die Build-Zeit: sonst bekäme jede Auslieferung ein neues lastmod.
 */
export const STATIC_LASTMOD: Record<string, Date> = {
  "/": new Date("2026-11-13T12:23:38.000Z"),
  "/tests": new Date("2026-11-13T12:23:38.000Z"),
  "/marken": new Date("2026-11-13T12:23:38.000Z"),
  "/blog": new Date("2026-11-13T12:23:38.000Z"),
  "/methodik": new Date("2026-11-05T20:33:40.000Z"),
  "/methodik/ergaenzungsfutter": new Date("2026-10-17T00:00:00.000Z"),
  "/futterrechner": new Date("2026-10-27T08:45:51.000Z"),
  "/futterrechner/hund": new Date("2026-10-26T22:49:01.000Z"),
  "/futterrechner/katze": new Date("2026-10-26T22:49:01.000Z"),
  "/team": new Date("2026-11-13T11:13:15.000Z"),
  "/fuer-hersteller": new Date("2026-10-26T08:05:24.000Z"),
  "/kontakt": new Date("2026-10-16T07:42:23.000Z"),
  "/faq": new Date("2026-10-16T07:42:23.000Z"),
  "/werbeaussagen": new Date("2026-10-28T03:01:27.000Z"),
  "/produkt-des-monats": new Date("2026-11-13T12:23:38.000Z"),
  "/lexikon": new Date("2026-11-13T12:23:38.000Z"),
  "/glossar": new Date("2026-11-13T12:23:38.000Z"),
  "/impressum": new Date("2026-10-23T15:47:51.000Z"),
  "/datenschutz": new Date("2026-11-13T12:23:38.000Z"),
};

/** Marken mit nur einem veröffentlichten Test bleiben erreichbar, kommen aber nicht in die Sitemap. */
export function includeBrandInSitemap(count: number): boolean {
  return count >= 2;
}

const STATIC_PATHS = [
  "/",
  "/tests",
  "/marken",
  "/blog",
  "/methodik",
  "/methodik/ergaenzungsfutter",
  "/futterrechner",
  "/futterrechner/hund",
  "/futterrechner/katze",
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

/** Letzte Änderung der Einzeltest-Vorlage (Fazit, Kurz gesagt, FAQ). Pro Vorlagenänderung hier neu setzen. */
export const TEMPLATE_CHANGED_AT = new Date("2026-10-23T12:00:00.000Z");

/** lastmod = neuerer Wert aus Inhalt und Vorlage, damit Google geänderte Vorlagen erkennt. */
function withTemplate(updatedAt: Date): Date {
  return updatedAt > TEMPLATE_CHANGED_AT ? updatedAt : TEMPLATE_CHANGED_AT;
}

function latest(dates: Date[]): Date | undefined {
  if (!dates.length) return undefined;
  return new Date(Math.max(...dates.map((date) => date.getTime())));
}

/**
 * Jeder Eintrag hat lastmod. Dynamische Seiten nehmen das neueste updatedAt,
 * statische Seiten das Datum ihrer letzten inhaltlichen Änderung.
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
  const contentLatest = latest([...reviewDates, ...postDates, ...lexDates, ...glossDates]);
  const staticLatest = latest(Object.values(STATIC_LASTMOD))!;
  const entries: SitemapEntry[] = STATIC_PATHS.map((path) => ({
    path,
    lastModified: byPath[path] ?? STATIC_LASTMOD[path] ?? staticLatest,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.6,
  }));
  for (const category of input.categories) {
    const lastModified = latest(input.reviews.filter((row) => row.categorySlug === category.slug).map((row) => withTemplate(row.updatedAt)));
    entries.push({
      path: `/${category.slug}`,
      lastModified: lastModified ?? contentLatest ?? staticLatest,
      changeFrequency: "daily",
      priority: 0.8,
    });
  }
  for (const review of input.reviews) {
    entries.push({ path: `/${review.categorySlug}/${review.slug}`, lastModified: withTemplate(review.updatedAt), priority: 0.9 });
  }
  for (const post of input.posts) {
    entries.push({ path: `/blog/${post.slug}`, lastModified: post.updatedAt, priority: 0.7 });
  }
  for (const brand of input.brands ?? []) {
    if (!includeBrandInSitemap(brand.count ?? 2)) continue;
    entries.push({ path: `/marken/${brand.slug}`, lastModified: brand.updatedAt, priority: 0.7 });
  }
  for (const entry of input.lexikon) {
    entries.push({ path: `/lexikon/${entry.slug}`, lastModified: entry.updatedAt, priority: 0.6 });
  }
  return entries;
}
