import { TESTVORLAGE_V2 } from "@/components/testvorlage-v2/schema";
import { hasFilledClassicScores, harmfulFailed, isMethodikV1, ratingFor, RATING_THRESHOLDS, type CriterionKey, type Scores } from "@/lib/scoring";

/** Vergleich: Testsieger nur bei einem eindeutigen Bestwert ab Gelb (51 Punkte), nie bei Rot und nie bei Gleichstand. */
export function showsComparisonWinner(score: number, best: number, leaderCount = 1): boolean {
  return leaderCount === 1 && score === best && score >= RATING_THRESHOLDS.mittel && ratingFor(score) !== "schlecht";
}

export type WinnerCandidate = { id: string; totalScore: number; scoreNutrients?: number | null; pricePer1000kcal?: number | null; methodikVersion?: string | null };

/** Preis je 1.000 kcal vom Vergleichseintrag oder aus layoutData. Fehlt er, greift die zweite Gleichstandsstufe nicht. */
export function pricePer1000kcalOf(item: { pricePer1000kcal?: unknown; layoutData?: unknown }): number | null {
  const direct = finitePrice(item.pricePer1000kcal);
  if (direct != null) return direct;
  const data = item.layoutData;
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  return finitePrice((data as { pricePer1000kcal?: unknown }).pricePer1000kcal);
}

function finitePrice(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/**
 * Testsieger eines Vergleichs nach der veröffentlichten Regel: höchste Punktzahl; bei Punktgleichstand entscheidet das
 * Nährstoffprofil, dann der Preis je 1.000 kcal (niedriger gewinnt). Sieger nur ab Gelb, nie bei Rot. Ist auch danach nichts
 * entschieden, gibt es keinen Sieger. Tests auf Methodik Version 1 treten nie als Sieger oder Platz an (nicht mit Version-2-Werten vergleichbar).
 */
export function pickWinner(items: WinnerCandidate[]): string | null {
  const pool = items.filter((i) => !isMethodikV1(i.methodikVersion));
  if (pool.length < 1) return null;
  const best = Math.max(...pool.map((i) => i.totalScore));
  let tied = pool.filter((i) => i.totalScore === best);
  if (best < RATING_THRESHOLDS.mittel || ratingFor(best) === "schlecht") return null;
  if (tied.length > 1) {
    const bestNutrients = Math.max(...tied.map((i) => i.scoreNutrients ?? -1));
    tied = tied.filter((i) => (i.scoreNutrients ?? -1) === bestNutrients);
  }
  if (tied.length > 1) {
    const priced = tied.filter((i) => i.pricePer1000kcal != null);
    if (priced.length === tied.length) {
      const cheapest = Math.min(...priced.map((i) => i.pricePer1000kcal as number));
      tied = priced.filter((i) => i.pricePer1000kcal === cheapest);
    }
  }
  return tied.length === 1 ? tied[0].id : null;
}

type ClassicScoreReview = Partial<Scores> & { layout?: string | null };

/** Die sechs Alleinfutter-Spalten gelten nur, wenn sie wirklich bewertet sind. V2 und leere Teilnoten (alles 0) nicht. */
export function classicCriteriaApply(review: ClassicScoreReview): boolean {
  return review.layout !== TESTVORLAGE_V2 && hasFilledClassicScores(review);
}

export function criterionFailed(review: ClassicScoreReview, key: CriterionKey, value: number): boolean {
  return classicCriteriaApply(review) && key === "scoreHarmful" && harmfulFailed(value);
}
