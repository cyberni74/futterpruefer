/**
 * Startseiten-Kästen „Testsieger“ für die großen Vergleichstests („Der große …-Test“).
 * Für einen neuen Vergleichstest einen Eintrag OBEN in FEATURED_COMPARISONS einfügen (neuester zuerst);
 * alle Einträge erscheinen untereinander über „Produkt des Monats“. Bild und Alt-Text kommen aus dem
 * Blogbeitrag (slug); ist der Beitrag nicht veröffentlicht, erscheint sein Kasten nicht.
 * Kein Amazon-Link: Die Kästen verlinken nur auf unseren Vergleichstest.
 * Neutral formulieren: Platz, Punkte, Ampel – keine Wirkversprechen, keine Heilaussagen.
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

/** Neuester Vergleichstest zuerst. */
export const FEATURED_COMPARISONS: FeaturedComparison[] = [
  {
    slug: "gelenk-test-hund-oktober-2026",
    testName: "Der große Gelenk-Test Oktober 2026",
    month: 10,
    year: 2026,
    winner: "Cadoc Grünlippmuschel Pulver",
    score: 64,
    summary:
      "Fünf Gelenk-Ergänzungsfutter für Hunde im Vergleich. Cadoc liegt mit 64 von 100 Punkten (Gelb) vorn, die vier anderen Produkte sind Rot.",
    imageAltFallback: "Pokal Testsieger im großen Gelenk-Test Oktober 2026: Cadoc Grünlippmuschel Pulver, 64 von 100 Punkten, Gelb",
  },
  {
    slug: "nassfutter-test-rind-hund-oktober-2026",
    testName: "Der große Nassfutter-Test Oktober 2026",
    month: 10,
    year: 2026,
    winner: "Josera Meat Lovers Pure Beef",
    score: 81,
    summary:
      "Sieben Rind-Nassfutter für Hunde im Vergleich. Josera siegt mit 81 von 100 Punkten (Grün), vor GranCarno Rind + Lamm (79) und MjAMjAM Rind pur (77).",
    imageAltFallback: "Pokal Testsieger im großen Nassfutter-Test Oktober 2026: Josera Meat Lovers Pure Beef, 81 von 100 Punkten, Grün",
  },
];

/** @deprecated Nur noch der neueste Eintrag; die Startseite nutzt FEATURED_COMPARISONS. */
export const FEATURED_COMPARISON: FeaturedComparison | null = FEATURED_COMPARISONS[0] ?? null;

export const comparisonPath = (c: Pick<FeaturedComparison, "slug">) => `/blog/${c.slug}`;
