/** Zentrale URL-Bildung: Tests liegen unter /{kategorie-slug}/{test-slug}. */
export const categoryPath = (slug: string) => `/${slug}`;
export const reviewPath = (r: { slug: string; category: { slug: string } }) => `/${r.category.slug}/${r.slug}`;

/** Frühere Kategorie-Slugs (vor der URL-Umstellung) → aktuelle. */
export const OLD_CATEGORY_SLUGS: Record<string, string> = {
  "alleinfutter-hund": "alleinfuttermittel-hund",
  "alleinfutter-katze": "alleinfuttermittel-katze",
  "ergaenzungsfutter-hund": "ergaenzungsfuttermittel-hund",
  "ergaenzungsfutter-katze": "ergaenzungsfuttermittel-katze",
};
