export const CRITERIA = [
  { key: "scoreRaw", label: "Rohstoffqualität", short: "Rohstoffe", max: 30, description: "Sinnhaftigkeit und Qualität der Rohstoffe" },
  { key: "scoreHarmful", label: "Schadstoffe & Bedenkliches", short: "Schadstoffe", max: 20, description: "Ungeeignete oder problematische Inhaltsstoffe" },
  { key: "scoreNutrients", label: "Nährstoffprofil", short: "Nährstoffe", max: 20, description: "Protein, Fett, Vitamine, Mineralstoffe" },
  { key: "scoreDeclaration", label: "Deklaration & Transparenz", short: "Deklaration", max: 15, description: "Nachvollziehbare Angaben, ehrliche statt unzulässiger Werbeaussagen" },
  { key: "scoreNeeds", label: "Bedarfsdeckung", short: "Bedarf", max: 10, description: "Passt das Produkt zum Bedarf des Tiers?" },
  { key: "scoreValue", label: "Preis-Leistung", short: "Preis-Leistung", max: 5, description: "Preis-Leistungs-Verhältnis" },
] as const;

export type CriterionKey = (typeof CRITERIA)[number]["key"];
export type Scores = Record<CriterionKey, number>;

export const MAX_TOTAL = CRITERIA.reduce((s, c) => s + c.max, 0);

/** Unter diesem Anteil gilt „Schadstoffe & Bedenkliches“ als durchgefallen. */
export const HARMFUL_FAIL_RATIO = 0.5;

export function clampScore(key: CriterionKey, value: unknown): number {
  const max = CRITERIA.find((c) => c.key === key)!.max;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(max, Math.max(0, Math.round(n)));
}

export function totalScore(scores: Partial<Scores> | null | undefined): number {
  if (!scores) return 0;
  return CRITERIA.reduce((sum, c) => sum + clampScore(c.key, scores[c.key] ?? 0), 0);
}

export function harmfulFailed(scoreHarmful: number | null | undefined): boolean {
  return (scoreHarmful ?? 0) < 20 * HARMFUL_FAIL_RATIO;
}

export type Rating = "gut" | "mittel" | "schlecht";

/** Ampel-Schwellen der Gesamtwertung: ≥ 80 Grün, 60–79 Gelb, < 60 Rot. */
export const RATING_THRESHOLDS = { gut: 80, mittel: 60 } as const;

export function ratingFor(total: number | null | undefined): Rating {
  const t = total ?? 0;
  if (t >= RATING_THRESHOLDS.gut) return "gut";
  if (t >= RATING_THRESHOLDS.mittel) return "mittel";
  return "schlecht";
}

export const RATING_LABEL: Record<Rating, string> = {
  gut: "Empfehlenswert",
  mittel: "Mit Abstrichen",
  schlecht: "Nicht empfehlenswert",
};

export function ratioRating(value: number, max: number): Rating {
  return ratingFor(max > 0 ? (value / max) * 100 : 0);
}
