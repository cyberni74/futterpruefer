/**
 * Startseiten-Kästen für die großen Vergleichstests.
 * Für einen neuen Vergleichstest einen Eintrag OBEN in FEATURED_COMPARISONS einfügen (neuester zuerst);
 * alle Einträge erscheinen untereinander über „Produkt des Monats“. Bild und Alt-Text kommen aus dem
 * Blogbeitrag (slug); ist der Beitrag nicht veröffentlicht, erscheint sein Kasten nicht.
 * Kein Amazon-Link: Die Kästen verlinken nur auf unseren Vergleichstest.
 * Neutral formulieren: Platz, Punkte, Ampel – keine Wirkversprechen, keine Heilaussagen.
 * Pokal nur mit Testsieger ab Gelb (51 Punkte). Alle Rot: winner und score weglassen, kein Pokal.
 */
import { RATING_THRESHOLDS } from "@/lib/scoring";

export type FeaturedComparison = {
  /** Slug des Blogbeitrags unter /blog/… */
  slug: string;
  /** Name des Vergleichstests, z. B. „Der große Nassfutter-Test Oktober 2026“. */
  testName: string;
  month: number;
  year: number;
  /** Produktname des Testsiegers. Fehlt, wenn kein Produkt Testsieger ist (alle Rot). */
  winner?: string;
  /** Punkte des Testsiegers (0–100). Fehlt ohne Testsieger. */
  score?: number;
  /** Kurztext unter der Überschrift (max. vier Zeilen). */
  summary: string;
  /** Ersatz, falls der Blogbeitrag keinen Alt-Text hat. */
  imageAltFallback: string;
};

/** Pokal nur bei benanntem Testsieger ab Gelb. Rot bleibt ohne Siegel. */
export function showsWinnerSeal(c: Pick<FeaturedComparison, "winner" | "score">): boolean {
  return c.winner != null && c.winner !== "" && c.score != null && c.score >= RATING_THRESHOLDS.mittel;
}

/** Neuester Vergleichstest zuerst. */
export const FEATURED_COMPARISONS: FeaturedComparison[] = [
  {
    slug: "monoprotein-katzenfutter-test-2026",
    testName: "Monoprotein-Katzenfutter im Test, Oktober 2026",
    month: 10,
    year: 2026,
    winner: "GranataPet DeliCatessen Huhn PUR",
    score: 74,
    summary:
      "Drei Monoprotein-Nassfutter für Katzen im Vergleich. GranataPet DeliCatessen Huhn PUR liegt mit 74 von 100 Punkten (Gelb) vorn, vor MjAMjAM Känguru pur (72, Gelb) und LEONARDO Rind pur (67, Gelb).",
    imageAltFallback: "Pokal Testsieger Monoprotein-Katzenfutter im Test, Oktober 2026: GranataPet DeliCatessen Huhn PUR, 74 von 100 Punkten, Gelb",
  },
  {
    slug: "veganes-katzenfutter-test-oktober-2026",
    testName: "Veganes Katzenfutter im Test, Oktober 2026",
    month: 10,
    year: 2026,
    summary:
      "Drei vegane Alleinfutter für Katzen im Vergleich. AMI Cat (60, Gelb), Benevo Original (51) und Benevo Duo (36, Rot). AMI Cat knapp Gelb, beide Benevo Rot. Keine Empfehlung.",
    imageAltFallback: "Veganes Katzenfutter im Test, Oktober 2026: AMI Cat knapp Gelb, Benevo Original und Benevo Duo Rot, keine Empfehlung",
  },
  {
    slug: "veganes-hundefutter-test-oktober-2026",
    testName: "Veganes Hundefutter im Test, Oktober 2026",
    month: 10,
    year: 2026,
    winner: "VEGDOG Green Crunch",
    score: 59,
    summary:
      "Drei vegane Alleinfutter für Hunde im Vergleich. VEGDOG Green Crunch liegt mit 59 von 100 Punkten (Gelb) vorn, vor VUTTER Nassfutter Wie Ente (59, Gelb) und VEGDOG Farmer's Crunch (59, Gelb).",
    imageAltFallback: "Pokal Testsieger Veganes Hundefutter im Test, Oktober 2026: VEGDOG Green Crunch, 59 von 100 Punkten, Gelb",
  },
  {
    slug: "gelenk-test-hund-oktober-2026",
    testName: "Der große Gelenk-Test Oktober 2026",
    month: 10,
    year: 2026,
    winner: "Cadoc Grünlippmuschel Pulver",
    score: 59,
    summary:
      "Vier Gelenk-Ergänzungsfutter für Hunde im Vergleich. Cadoc liegt mit 59 von 100 Punkten (Gelb) vorn, die drei anderen Produkte sind Rot.",
    imageAltFallback: "Pokal Testsieger im großen Gelenk-Test Oktober 2026: Cadoc Grünlippmuschel Pulver, 59 von 100 Punkten, Gelb",
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
