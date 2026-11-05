import { summeKriterien, TESTVORLAGE_V2, parseLayoutData } from "@/components/testvorlage-v2/schema";
import { CRITERIA, totalScore } from "@/lib/scoring";

export type ScoreRow = {
  slug: string;
  layout: string | null;
  layoutData: unknown;
  totalScore: number;
  scoreRaw: number; scoreHarmful: number; scoreNutrients: number; scoreDeclaration: number; scoreNeeds: number; scoreValue: number;
};

export type ScoreAbweichung = { slug: string; schema: "kriterien" | "teilnoten"; gespeichert: number; summe: number };

/**
 * Nur lesen: meldet Tests, deren gespeicherte Gesamtwertung von der Summe der Teilwerte abweicht.
 * Kriterien-Schema (Testvorlage V2, auch Ergänzungsfutter): Summe der Kriterien-Punkte in layoutData.
 * Teilnoten-Schema (klassisch): Summe der Teilnoten, nur wenn welche eingetragen sind.
 */
export function pruefeScoreSummen(rows: ScoreRow[]): ScoreAbweichung[] {
  const out: ScoreAbweichung[] = [];
  for (const r of rows) {
    if (r.layout === TESTVORLAGE_V2) {
      const p = parseLayoutData(r.layoutData);
      if (p.ok && p.data.kriterien?.length) {
        const summe = summeKriterien(p.data);
        if (summe !== r.totalScore) out.push({ slug: r.slug, schema: "kriterien", gespeichert: r.totalScore, summe });
      }
      continue;
    }
    const teile = CRITERIA.map((c) => r[c.key]);
    if (teile.every((v) => !v)) continue;
    const summe = totalScore(r);
    if (summe !== r.totalScore) out.push({ slug: r.slug, schema: "teilnoten", gespeichert: r.totalScore, summe });
  }
  return out;
}
