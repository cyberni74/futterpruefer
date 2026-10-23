export const CRITERIA = [
  { key: "scoreRaw", label: "Rohstoffqualität", short: "Rohstoffe", max: 30, description: "Sinnhaftigkeit und Qualität der Rohstoffe" },
  { key: "scoreHarmful", label: "Schadstoffe & Bedenkliches", short: "Schadstoffe", max: 20, description: "Ungeeignete oder problematische Inhaltsstoffe" },
  { key: "scoreNutrients", label: "Nährstoffprofil", short: "Nährstoffe", max: 20, description: "Protein, Fett, Vitamine, Mineralstoffe" },
  { key: "scoreDeclaration", label: "Deklaration & Transparenz", short: "Deklaration", max: 15, description: "Nachvollziehbare Angaben, ehrliche Werbeaussagen statt solcher, die wir für irreführend halten" },
  { key: "scoreNeeds", label: "Bedarfsdeckung", short: "Bedarf", max: 10, description: "Passt das Produkt zum Bedarf des Tiers?" },
  { key: "scoreValue", label: "Preis-Leistung", short: "Preis-Leistung", max: 5, description: "Preis-Leistungs-Verhältnis" },
] as const;

export type CriterionKey = (typeof CRITERIA)[number]["key"];
export type Scores = Record<CriterionKey, number>;

export const MAX_TOTAL = CRITERIA.reduce((s, c) => s + c.max, 0);

/**
 * Veröffentlichte Gewichtung ab 16.10.2026 für Methodik-Seite und Kriterienlisten.
 * `previousMax` ist der bisherige Höchstwert. CRITERIA bleibt die Skala bereits
 * gespeicherter Tests; deren Punktzahlen werden nicht umgerechnet.
 */
export const METHODOLOGY_STAND = "16.10.2026";

export const METHODOLOGY_CHANGELOG =
  "16.10.2026 – Neues Kriterium „Transparenz / Herstellerunterlagen“ (max. 10 Punkte, abgestuft nach Beweiswert). Die übrigen Kriterien wurden anteilig auf 90 Punkte angepasst, die Ampelgrenzen bleiben gleich. Das Kriterium gilt für neue und aktualisierte Tests ab diesem Datum.";

export const PUBLISHED_CRITERIA = [
  { key: "scoreRaw", label: "Rohstoffqualität", description: "Sinnhaftigkeit und Qualität der Rohstoffe", max: 27, previousMax: 30 },
  { key: "scoreHarmful", label: "Schadstoffe & Bedenkliches", description: "Ungeeignete oder problematische Inhaltsstoffe", max: 18, previousMax: 20 },
  { key: "scoreNutrients", label: "Nährstoffprofil", description: "Protein, Fett, Vitamine, Mineralstoffe", max: 18, previousMax: 20 },
  { key: "scoreDeclaration", label: "Deklaration & Transparenz", description: "Nachvollziehbare Angaben auf Etikett und Website, ehrliche Werbeaussagen statt solcher, die wir für irreführend halten", max: 13, previousMax: 15 },
  { key: "scoreNeeds", label: "Bedarfsdeckung", description: "Passt das Produkt zum Bedarf des Tiers?", max: 9, previousMax: 10 },
  { key: "scoreValue", label: "Preis-Leistung", description: "Preis-Leistungs-Verhältnis", max: 5, previousMax: 5 },
  { key: "scoreTransparency", label: "Transparenz / Herstellerunterlagen", description: "Belegt der Hersteller seine Angaben mit prüfbaren Unterlagen?", max: 10, previousMax: null },
] as const;

export const PUBLISHED_MAX_TOTAL = PUBLISHED_CRITERIA.reduce((sum, criterion) => sum + criterion.max, 0);

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
