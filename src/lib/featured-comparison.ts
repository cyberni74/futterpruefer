/**
 * Startseiten-Kasten „Testsieger“ für den jeweils aktuellen großen Vergleichstest („Der große …-Test“).
 * Für den nächsten Vergleichstest nur diesen Eintrag austauschen. Bild und Alt-Text kommen aus dem
 * Blogbeitrag (slug); ist der Beitrag nicht veröffentlicht, erscheint der Kasten nicht.
 * Kein Amazon-Link: Der Kasten verlinkt nur auf unseren Vergleichstest.
 */
export type FeaturedComparison = {
  /** Slug des Blogbeitrags unter /blog/… */
  slug: string;
  /** Name des Vergleichstests, z. B. „Der große Nassfutter-Test Oktober 2026“. */
  testName: string;
  month: number;
  year: number;
  /** Produktname des Testsiegers. */
  winner: string;
  /** Punkte des Testsiegers (0–100). */
  score: number;
  /** Kurztext unter der Überschrift (max. vier Zeilen). */
  summary: string;
  /** Ersatz, falls der Blogbeitrag keinen Alt-Text hat. */
  imageAltFallback: string;
};

export const FEATURED_COMPARISON: FeaturedComparison | null = {
  slug: "nassfutter-test-rind-hund-oktober-2026",
  testName: "Der große Nassfutter-Test Oktober 2026",
  month: 10,
  year: 2026,
  winner: "Josera Meat Lovers Pure Beef",
  score: 81,
  summary:
    "Sieben Rind-Nassfutter für Hunde im Vergleich. Josera siegt mit 81 von 100 Punkten (Grün), vor GranCarno Rind + Lamm (79) und MjAMjAM Rind pur (77).",
  imageAltFallback: "Pokale für Platz 1 bis 3 im großen Nassfutter-Test Oktober 2026",
};

export const comparisonPath = (c: Pick<FeaturedComparison, "slug">) => `/blog/${c.slug}`;
