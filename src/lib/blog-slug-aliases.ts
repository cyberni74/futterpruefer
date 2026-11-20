/**
 * Evergreen-Slugs für Vergleichstests, die bisher eine Monats-URL hatten.
 * Der Datenbank-Slug bleibt bis zum ausgeführten SQL-Skript der alte Wert.
 * Öffentliche Canonicals und interne Links nutzen die neuen Pfade.
 */
export const BLOG_SLUG_CANONICAL: Readonly<Record<string, string>> = {
  "gelenk-test-hund-oktober-2026": "gelenktabletten-hund-vergleich",
  "lachsoel-test-hund-oktober-2026": "lachsoel-hund-vergleich",
};

/** Neuer öffentlicher Slug → aktueller Datenbank-Slug (bis das SQL-Skript läuft). */
export const BLOG_SLUG_DATABASE: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(BLOG_SLUG_CANONICAL).map(([legacy, canonical]) => [canonical, legacy]),
);

export function canonicalBlogSlug(slug: string): string {
  return BLOG_SLUG_CANONICAL[slug] ?? slug;
}

export function databaseBlogSlug(slug: string): string {
  return BLOG_SLUG_DATABASE[slug] ?? slug;
}

/** Alle Slugs, unter denen derselbe Beitrag gefunden werden muss. */
export function blogSlugLookupKeys(slug: string): string[] {
  const keys = new Set([slug, canonicalBlogSlug(slug), databaseBlogSlug(slug)]);
  return [...keys];
}

export function blogPath(slug: string): string {
  return `/blog/${canonicalBlogSlug(slug)}`;
}

export const BLOG_SLUG_REDIRECTS: ReadonlyArray<{ source: string; destination: string }> = Object.entries(BLOG_SLUG_CANONICAL).map(
  ([legacy, canonical]) => ({ source: `/blog/${legacy}`, destination: `/blog/${canonical}` }),
);
