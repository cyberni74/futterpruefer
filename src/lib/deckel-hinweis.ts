import { CRITERIA, clampScore, isMethodikV1, totalScore, type CriterionKey, type Scores } from "@/lib/scoring";

/**
 * Gemeinsame Zeile unter den Kriterien, gleiches Muster wie bei Ergänzungsfutter
 * (`capNote`): „Deckel aktiv (…Grund…). Summe {teil}, gewertet {totalScore}.“
 * Teilwerte bleiben die Rohbewertung; hier wird nichts gekappt.
 */
export function formatDeckelHinweis(gruende: readonly string[], summe: number, gewertet: number): string {
  if (gruende.length === 0 || summe === gewertet) return "";
  const innen = gruende.join(" ");
  // Der Notenhinweis endet schon mit „(befriedigend).“. Der Satzpunkt von
  // „Deckel aktiv (…).“ steht danach, sonst erscheint live „(befriedigend).).“.
  // Andere Gründe (ausreichend, Heilaussage, …) bleiben unverändert.
  const kern = innen.endsWith("(befriedigend).") ? innen.slice(0, -1) : innen;
  return `Deckel aktiv (${kern}). Summe ${summe}, gewertet ${gewertet}.`;
}

/**
 * Obergrenzen für Alleinfutter, Version 2 (seit 05.11.2026).
 * Schwellen und Wortlaut wie auf /methodik, Abschnitt „Ampel und Note“.
 * „unter“ ist strikt: 6 von 15 bei der Deklaration löst die Obergrenze 59 nicht aus.
 */
export const ALLEINFUTTER_DECKEL: readonly { key: CriterionKey; unter: number; cap: number; grund: string }[] = [
  { key: "scoreHarmful", unter: 10, cap: 50, grund: "Schadstoffe & Bedenkliches unter 10 von 20 Punkten: höchstens 50 Punkte (ausreichend)." },
  { key: "scoreNutrients", unter: 8, cap: 50, grund: "Nährstoffprofil unter 8 von 20 Punkten: höchstens 50 Punkte (ausreichend)." },
  { key: "scoreNeeds", unter: 4, cap: 50, grund: "Bedarfsdeckung unter 4 von 10 Punkten: höchstens 50 Punkte (ausreichend)." },
  { key: "scoreRaw", unter: 12, cap: 59, grund: "Rohstoffqualität unter 12 von 30 Punkten: höchstens 59 Punkte (befriedigend)." },
  { key: "scoreDeclaration", unter: 6, cap: 59, grund: "Deklaration & Transparenz unter 6 von 15 Punkten: höchstens 59 Punkte (befriedigend)." },
];

/** Wenn keine veröffentlichte Einzelregel die Abweichung erklärt. */
const OBERGRENZE_ALLGEMEIN = "Die Gesamtwertung weicht von der Summe der Teilwerte ab.";

function teileAngezeigt(scores: Partial<Scores> | null | undefined): Scores {
  return Object.fromEntries(CRITERIA.map((c) => [c.key, clampScore(c.key, scores?.[c.key] ?? 0)])) as Scores;
}

function gruendeZurAbweichung(teile: Scores, summe: number, gewertet: number, methodikVersion?: string | null): string[] {
  // Version 1 (Tierliebhaber, Medidog): die neuen Obergrenzen gelten dort nicht.
  if (isMethodikV1(methodikVersion)) return [OBERGRENZE_ALLGEMEIN];
  const treffer = ALLEINFUTTER_DECKEL.filter((r) => teile[r.key] < r.unter);
  if (treffer.length === 0) return [OBERGRENZE_ALLGEMEIN];
  const minCap = Math.min(...treffer.map((r) => r.cap));
  if (Math.min(summe, minCap) === gewertet) return treffer.map((r) => r.grund);
  // Eine strengere Regel würde eine niedrigere Gesamtwertung erzwingen, als gespeichert ist.
  // Nur Regeln nennen, deren Obergrenze zur gespeicherten Wertung passt.
  const passend = treffer.filter((r) => r.cap >= gewertet);
  if (passend.length > 0) {
    const minPassend = Math.min(...passend.map((r) => r.cap));
    if (Math.min(summe, minPassend) === gewertet) return passend.map((r) => r.grund);
  }
  return [OBERGRENZE_ALLGEMEIN];
}

/**
 * Hinweis für die sechs klassischen Kriterienbalken.
 * Leer, wenn die Summe der angezeigten Teilwerte der Gesamtwertung entspricht.
 */
export function alleinfutterDeckelHinweis(scores: Partial<Scores> | null | undefined, gewertet: number, methodikVersion?: string | null): string {
  const teile = teileAngezeigt(scores);
  const summe = totalScore(teile);
  const g = Number.isFinite(Number(gewertet)) ? Math.round(Number(gewertet)) : 0;
  if (summe === g) return "";
  return formatDeckelHinweis(gruendeZurAbweichung(teile, summe, g, methodikVersion), summe, g);
}
