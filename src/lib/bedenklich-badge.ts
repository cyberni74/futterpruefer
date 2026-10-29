import { TESTVORLAGE_V2 } from "@/components/testvorlage-v2/schema";
import { harmfulFailed } from "@/lib/scoring";

/** Stufen in layoutData.sicherheit, die einem roten Warnsignal entsprechen (nicht OK). */
const V2_WARN_STUFEN = new Set(["HINWEIS", "KRITISCH"]);

export type BedenklichInput = {
  layout?: string | null;
  scoreHarmful?: number | null;
  /** Wie efResult.warnsignal: gesetzt, sobald die Sicherheit nicht OK ist. */
  efSicherheit?: string | null;
  layoutData?: unknown;
};

/**
 * Karten-Badge „Bedenklich“.
 * Klassische Tests: wie bisher, wenn „Schadstoffe & Bedenkliches“ unter der Hälfte liegt
 * (fehlender Wert zählt als 0). Testvorlage V2 füllt dieses Feld nicht; dort nur bei
 * einem expliziten Warnsignal (efSicherheit ≠ OK oder sicherheit.stufe HINWEIS/KRITISCH).
 */
export function showsBedenklichBadge(review: BedenklichInput): boolean {
  if (review.layout === TESTVORLAGE_V2) return hasExplicitWarnsignal(review);
  return harmfulFailed(review.scoreHarmful);
}

export function hasExplicitWarnsignal(review: Pick<BedenklichInput, "efSicherheit" | "layoutData">): boolean {
  if (review.efSicherheit && review.efSicherheit !== "OK") return true;
  const stufe = sicherheitStufe(review.layoutData);
  return stufe != null && V2_WARN_STUFEN.has(stufe);
}

function sicherheitStufe(layoutData: unknown): string | null {
  if (!layoutData || typeof layoutData !== "object" || Array.isArray(layoutData)) return null;
  const sicherheit = (layoutData as { sicherheit?: unknown }).sicherheit;
  if (!sicherheit || typeof sicherheit !== "object" || Array.isArray(sicherheit)) return null;
  const stufe = (sicherheit as { stufe?: unknown }).stufe;
  return typeof stufe === "string" ? stufe : null;
}
