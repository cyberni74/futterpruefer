import { TESTVORLAGE_V2 } from "@/components/testvorlage-v2/schema";
import { harmfulFailed, ratingFor, RATING_THRESHOLDS, type CriterionKey } from "@/lib/scoring";

/** Vergleich: Testsieger nur ab Gelb (60 Punkte) und nie bei Rot. */
export function showsComparisonWinner(score: number, best: number): boolean {
  return score === best && score >= RATING_THRESHOLDS.mittel && ratingFor(score) !== "schlecht";
}

/** Die sechs Alleinfutter-Spalten gelten nicht für die Testvorlage V2 (eigene Kriterien in layoutData). */
export function classicCriteriaApply(layout: string | null | undefined): boolean {
  return layout !== TESTVORLAGE_V2;
}

export function criterionFailed(layout: string | null | undefined, key: CriterionKey, value: number): boolean {
  return classicCriteriaApply(layout) && key === "scoreHarmful" && harmfulFailed(value);
}
