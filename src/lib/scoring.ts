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
 * Veröffentlichte Gewichtung für Methodik-Seite und Kriterienlisten (Alleinfutter).
 * Entspricht seit 26.10.2026 wieder exakt CRITERIA, also der Skala, nach der alle
 * gespeicherten Alleinfutter-Tests bewertet sind (Korrektur § 5 UWG, Rechtsprüfung 26.10.2026).
 */
export const METHODOLOGY_STAND = "27.10.2026";

export const METHODOLOGY_CHANGELOG_ERGAENZUNG =
  "27.10.2026 – Ergänzung: Ergänzungsfutter, die ein Futter im Alltagssinn sind und keinen benannten Wirkstoff haben, etwa Nassfutter-Filets und Snacks, bewerten wir nach den sechs Kriterien dieser Seite. So bleiben sie mit unseren bisherigen Tests solcher Produkte vergleichbar. Die fünf Kriterien der Ergänzungsfutter-Methodik gelten für funktionelle Ergänzungsfutter mit Wirkstoff oder Wirkversprechen, etwa Tropfen, Pulver, Öle und Tabletten. Durch diese Festlegung hat sich keine Punktzahl geändert. Ältere Tests funktioneller Produkte mit sechs Teilnoten bleiben nach den sechs Kriterien bewertet.";

export const METHODOLOGY_CHANGELOG_ABGRENZUNG =
  "27.10.2026: Abgrenzung Unbelegt/Fragwürdig ergänzt; entspricht unserer bisherigen Bewertungspraxis, keine Punktzahl geändert.";

export const METHODOLOGY_CHANGELOG =
  "26.10.2026 – Korrektur: Vom 16.10. bis 26.10.2026 nannten diese Seite und einige andere Seiten von Futterprüfer für Alleinfutter sieben Kriterien, darunter „Transparenz / Herstellerunterlagen“ (10 Punkte), und eine auf 90 Punkte verkleinerte Gewichtung der übrigen sechs. Angewandt haben wir diese Gewichtung in keinem Test. Alle veröffentlichten Alleinfutter-Tests sind nach den sechs Kriterien in der Tabelle bewertet, auch die seit dem 16.10.2026 erschienenen. Durch diese Korrektur hat sich keine Punktzahl geändert.";

export const PUBLISHED_CRITERIA = [
  { key: "scoreRaw", label: "Rohstoffqualität", description: "Sinnhaftigkeit und Qualität der Rohstoffe", max: 30 },
  { key: "scoreHarmful", label: "Schadstoffe & Bedenkliches", description: "Ungeeignete oder problematische Inhaltsstoffe", max: 20 },
  { key: "scoreNutrients", label: "Nährstoffprofil", description: "Protein, Fett, Vitamine, Mineralstoffe", max: 20 },
  { key: "scoreDeclaration", label: "Deklaration & Transparenz", description: "Nachvollziehbare Angaben auf Etikett und Website, ehrliche Werbeaussagen statt solcher, die wir für irreführend halten", max: 15 },
  { key: "scoreNeeds", label: "Bedarfsdeckung", description: "Passt das Produkt zum Bedarf des Tiers?", max: 10 },
  { key: "scoreValue", label: "Preis-Leistung", description: "Preis-Leistungs-Verhältnis", max: 5 },
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
