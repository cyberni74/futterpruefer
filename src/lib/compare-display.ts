import { TESTVORLAGE_V2 } from "@/components/testvorlage-v2/schema";
import { hasFilledClassicScores, harmfulFailed, ratingFor, RATING_THRESHOLDS, type CriterionKey, type Scores } from "@/lib/scoring";

/** Vergleich: Testsieger nur bei einem eindeutigen Bestwert ab Gelb (60 Punkte), nie bei Rot und nie bei Gleichstand. */
export function showsComparisonWinner(score: number, best: number, leaderCount = 1): boolean {
  return leaderCount === 1 && score === best && score >= RATING_THRESHOLDS.mittel && ratingFor(score) !== "schlecht";
}

type ClassicScoreReview = Partial<Scores> & { layout?: string | null };

/** Die sechs Alleinfutter-Spalten gelten nur, wenn sie wirklich bewertet sind. V2 und leere Teilnoten (alles 0) nicht. */
export function classicCriteriaApply(review: ClassicScoreReview): boolean {
  return review.layout !== TESTVORLAGE_V2 && hasFilledClassicScores(review);
}

export function criterionFailed(review: ClassicScoreReview, key: CriterionKey, value: number): boolean {
  return classicCriteriaApply(review) && key === "scoreHarmful" && harmfulFailed(value);
}
