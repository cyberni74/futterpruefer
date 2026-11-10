import { TESTVORLAGE_V2 } from "@/components/testvorlage-v2/schema";
import { hasFilledClassicScores, harmfulFailed, type Scores } from "@/lib/scoring";

/**
 * Höchste Warnstufe in layoutData.sicherheit (Schema: OK, HINWEIS, KRITISCH).
 * HINWEIS bleibt der gelbe Hinweis in der Sicherheitsbox und setzt kein rotes Karten-Badge.
 */
const V2_BADGE_STUFEN = new Set(["KRITISCH"]);

/** Review.efSicherheit (Schema: OK, MITTEL, SCHWER). Nur MITTEL und SCHWER sind ein Sicherheitsrisiko. */
const EF_BADGE_STUFEN = new Set(["MITTEL", "SCHWER"]);

export type BedenklichInput = Partial<Scores> & {
  layout?: string | null;
  /** Review.efSicherheit. Badge nur bei MITTEL oder SCHWER. */
  efSicherheit?: string | null;
  layoutData?: unknown;
};

/**
 * Karten-Badge „Bedenklich“.
 * Nur wenn die sechs Alleinfutter-Teilnoten wirklich gesetzt sind (nicht alle 0) und
 * „Schadstoffe & Bedenkliches“ unter der Hälfte liegt. Testvorlage V2 und Tests ohne
 * diese Teilnoten (etwa Ergänzungsfutter nur mit Wirkstoff-Kriterien) zeigen das Badge
 * nur bei einem echten Sicherheitsrisiko: efSicherheit MITTEL oder SCHWER, oder
 * sicherheit.stufe KRITISCH. HINWEIS und OK setzen kein Badge.
 */
export function showsBedenklichBadge(review: BedenklichInput): boolean {
  if (review.layout === TESTVORLAGE_V2 || !hasFilledClassicScores(review)) return hasExplicitWarnsignal(review);
  return harmfulFailed(review.scoreHarmful);
}

export function hasExplicitWarnsignal(review: Pick<BedenklichInput, "efSicherheit" | "layoutData">): boolean {
  if (review.efSicherheit && EF_BADGE_STUFEN.has(review.efSicherheit)) return true;
  const stufe = sicherheitStufe(review.layoutData);
  return stufe != null && V2_BADGE_STUFEN.has(stufe);
}

function sicherheitStufe(layoutData: unknown): string | null {
  if (!layoutData || typeof layoutData !== "object" || Array.isArray(layoutData)) return null;
  const sicherheit = (layoutData as { sicherheit?: unknown }).sicherheit;
  if (!sicherheit || typeof sicherheit !== "object" || Array.isArray(sicherheit)) return null;
  const stufe = (sicherheit as { stufe?: unknown }).stufe;
  return typeof stufe === "string" ? stufe : null;
}
