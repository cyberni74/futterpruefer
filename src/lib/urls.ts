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

/** Weiche Trennstellen für lange Kategorienamen („Ergänzungs­futter­mittel“), damit sie mobil sauber umbrechen. */
export function hyphenateCategory(name: string | null | undefined): string {
  return (name ?? "").replace(/futtermittel/gi, (m) => `­${m.slice(0, 6)}­${m.slice(6)}`).replace(/^­/, "");
}
