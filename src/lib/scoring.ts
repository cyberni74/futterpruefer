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
export const METHODOLOGY_STAND = "05.11.2026";

export const METHODOLOGY_CHANGELOG_ERGAENZUNG =
  "27.10.2026 – Ergänzung: Ergänzungsfutter, die ein Futter im Alltagssinn sind und keinen benannten Wirkstoff haben, etwa Nassfutter-Filets und Snacks, bewerten wir nach den sechs Kriterien dieser Seite. So bleiben sie mit unseren bisherigen Tests solcher Produkte vergleichbar. Die fünf Kriterien der Ergänzungsfutter-Methodik gelten für funktionelle Ergänzungsfutter mit Wirkstoff oder Wirkversprechen, etwa Tropfen, Pulver, Öle und Tabletten. Durch diese Festlegung hat sich keine Punktzahl geändert. Ältere Tests funktioneller Produkte mit sechs Teilnoten bleiben nach den sechs Kriterien bewertet.";

/** Eintrag für /methodik/ergaenzungsfutter, 05.11.2026. */
export const METHODOLOGY_CHANGELOG_ERGAENZUNG_V2 =
  "05.11.2026 – Version 2: Ampelgrenzen Grün ab 68, Gelb ab 51, Rot bis 50 (redaktionelle Entscheidung über die Einstufung, keine neue Prüfung der Produkte). Obergrenzen sinken im selben Verhältnis: Heilaussage 79 → 67 (nie Grün), Alibi-Dosierung, fehlende Wirkstoffmenge und Sicherheit mittel 59 → 50, Sicherheit schwer 39 → 33. Ausgenommen sind die auf /methodik im Abschnitt „Ausnahmen“ genannten Tests.";

export const METHODOLOGY_CHANGELOG_ABGRENZUNG =
  "27.10.2026: Abgrenzung Unbelegt/Fragwürdig ergänzt; entspricht unserer bisherigen Bewertungspraxis, keine Punktzahl geändert.";

export const METHODOLOGY_CHANGELOG = [
  "05.11.2026 – Ampel und Note, Version 2: Wir haben entschieden, alle Ampelgrenzen einheitlich um 15 % zu senken. Grün ab 68 Punkten (bisher 80), Gelb ab 51 (bisher 60), Rot bis 50. Das ist eine redaktionelle Entscheidung über die Einstufung, keine neue Prüfung der Produkte. Neu für Alleinfutter: Obergrenzen 59 und 50. Ergänzungsfutter: 79 → 67, 59 → 50, 39 → 33. Neuer Notenschlüssel: 68 Punkte = 1,8, 51 Punkte = 3,5. Kriterien und Gewichtung bleiben unverändert. Unser Siegel ‚Empfohlen‘ vergeben wir weiterhin erst ab 80 Punkten. Neu eingestuft: 52 Bewertungen (15 von Gelb auf Grün, 37 von Rot auf Gelb). Neuer Punktwert wegen Obergrenze: 24 Bewertungen, z. B. MjAMjAM Saftiges Huhn an leckeren Möhrchen 75 → 59, VEGDOG Nassfutter Adult Linsen & Hirse 70 → 59, ProDen PlaqueOff Pulver 59 → 50. Ausgenommen: alle Tests der Marke Tierliebhaber (43) und von Medidog (2); sie bleiben auf dem Stand von Version 1. Erläuterung: Abschnitt „Ausnahmen“ auf dieser Seite.",
  "05.11.2026 – Preis-Leistung bei veganem und vegetarischem Alleinfutter: eigene Vergleichsgruppe, Preis je 1.000 kcal. Trocken: unter 2,50 € = 5, bis 3,49 € = 4, bis 4,49 € = 3, bis 5,99 € = 2, ab 6,00 € = 1. Nass: unter 8,00 € = 5, bis 9,99 € = 4, bis 11,99 € = 3, bis 14,99 € = 2, ab 15,00 € = 1. Grund: Pflanzliche Proteinkonzentrate und die nötigen Zusätze haben nach unserer Einschätzung eine andere Kostenstruktur als fleischhaltiges Futter, das deshalb hier kein Preismaßstab ist. Redaktionelle Methodenentscheidung. Neu bewertet: VEGDOG Adult Nass 68 → 70, AMI Cat 59 → 60 (Rot → Gelb), Benevo Original 50 → 51, Happy Dog Sensible India 58 → 60 (Rot → Gelb), VUTTER Nassfutter Wie Ente 75 → 79; Benevo Duo unverändert 36.",
  "27.10.2026 – Werbeaussagen-Check: zwei weitere Stufen. ‚Plausibel‘ heißt: Es gibt nachvollziehbare Gründe für die Aussage, ein vollständiger Beleg fehlt. ‚Unbelegt‘ heißt: eine allgemeine Anpreisung ohne prüfbaren Inhalt oder ein vom Hersteller erklärter, aber nicht belegter Begriff; wir können die Aussage weder bestätigen noch widerlegen. Beide Stufen gelten nicht als ‚ohne Einwand‘. Zusätzlich beziehen wir die Angaben im Amazon-Listing ein und kennzeichnen sie als ‚Amazon-Listing (Urheber unbekannt)‘.",
  "27.10.2026 – Neu bewertet: MjAMjAM Saftiges Huhn an leckeren Möhrchen. Nach unserer aktuellen Futter-Methodik nachgeprüft, einschließlich der Angaben im Amazon-Listing. Neu gewertet sind der Jodzusatz, die Fütterungsempfehlung sowie Werbeangaben zu Allergien, Rohfütterung, Vitaminversorgung und Qualität. Ergebnis: 75 statt 87 Punkte, Ampel Gelb statt Grün.",
  "27.10.2026 – Preis-Leistung: klargestellt, dass wir Preise je Tierart vergleichen. Bestehende Wertungen ändern sich dadurch nicht.",
  "26.10.2026 – Korrektur: Vom 16.10. bis 26.10.2026 nannten diese Seite und einige andere Seiten von Futterprüfer für Alleinfutter sieben Kriterien, darunter „Transparenz / Herstellerunterlagen“ (10 Punkte), und eine auf 90 Punkte verkleinerte Gewichtung der übrigen sechs. Angewandt haben wir diese Gewichtung in keinem Test. Alle veröffentlichten Alleinfutter-Tests sind nach den sechs Kriterien in der Tabelle bewertet, auch die seit dem 16.10.2026 erschienenen. Durch diese Korrektur hat sich keine Punktzahl geändert.",
] as const;

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

/** Die sechs Alleinfutter-Teilnoten sind gesetzt, sobald eine davon nicht 0 ist. Alles 0 ist der Datenbank-Standard und keine Bewertung. */
export function hasFilledClassicScores(scores: Partial<Scores> | null | undefined): boolean {
  if (!scores) return false;
  return CRITERIA.some((c) => (scores[c.key] ?? 0) > 0);
}

export type Rating = "gut" | "mittel" | "schlecht";

/** Ampel-Schwellen der Gesamtwertung, Version 2 (seit 05.11.2026): ≥ 68 Grün, 51–67 Gelb, ≤ 50 Rot (vorher 80/60). */
export const RATING_THRESHOLDS = { gut: 68, mittel: 51 } as const;

/** Schwellen der Version 1 (bis 05.11.2026). Gelten weiter für Tests mit methodikVersion „1“ (Ausnahmen auf /methodik). */
export const RATING_THRESHOLDS_V1 = { gut: 80, mittel: 60 } as const;

/** Bewertungsstand der Tests, die auf Version 1 bleiben (Anzeige in Listen). */
export const METHODIK_V1_STAND = "27.10.2026";

/** Das Siegel „Empfohlen“ gibt es erst ab 80 Punkten. Bewusst nicht an RATING_THRESHOLDS.gut gekoppelt. */
export const EMPFOHLEN_AB = 80;

/** Test mit dem DB-Feld methodikVersion „1“: Darstellung weiter nach Version 1. */
export const isMethodikV1 = (methodikVersion: string | null | undefined) => (methodikVersion ?? "").trim() === "1";

export const thresholdsFor = (methodikVersion?: string | null) => (isMethodikV1(methodikVersion) ? RATING_THRESHOLDS_V1 : RATING_THRESHOLDS);

export function ratingFor(total: number | null | undefined, methodikVersion?: string | null): Rating {
  const t = total ?? 0;
  const th = thresholdsFor(methodikVersion);
  if (t >= th.gut) return "gut";
  if (t >= th.mittel) return "mittel";
  return "schlecht";
}

/**
 * Siegel „Empfohlen“: nur ab EMPFOHLEN_AB Punkten und nie bei Tests auf Version 1 (dort gibt es keine Siegel).
 * Testseiten setzen Note und Siegel nicht aus diesem Helper. Das Notenwort kommt aus dem Datenbank-Patch (layoutData.hero.notenwort).
 */
export const showsEmpfohlen = (total: number | null | undefined, methodikVersion?: string | null) => !isMethodikV1(methodikVersion) && (total ?? 0) >= EMPFOHLEN_AB;

/** Notenschlüssel C (Version 2): feste Ankerpunkte, dazwischen linear, kaufmännisch auf eine Nachkommastelle. Rechnung für /methodik; die angezeigte Note einer Testseite steht im Datenbank-Patch. */
export const NOTEN_ANKER: ReadonlyArray<{ punkte: number; note: number }> = [
  { punkte: 100, note: 0.5 }, { punkte: 72, note: 1.5 }, { punkte: 60, note: 2.5 }, { punkte: 51, note: 3.5 }, { punkte: 34, note: 4.5 }, { punkte: 0, note: 5.5 },
];

/** Note zu 0–100 Punkten; die Ampelgrenzen fallen auf Notengrenzen (Grün höchstens 1,8, Gelb 1,9–3,5, Rot ab 3,6). */
export function noteFuerPunkte(punkte: number): number {
  const p = Math.min(100, Math.max(0, Math.round(punkte)));
  let note = 5.5;
  for (let i = 0; i < NOTEN_ANKER.length - 1; i++) {
    const hi = NOTEN_ANKER[i], lo = NOTEN_ANKER[i + 1];
    if (p <= hi.punkte && p >= lo.punkte) {
      note = hi.note + ((hi.punkte - p) / (hi.punkte - lo.punkte)) * (lo.note - hi.note);
      break;
    }
  }
  let n = Math.round(note * 10 + 1e-9) / 10;
  const th = RATING_THRESHOLDS;
  if (p >= th.gut) n = Math.min(n, 1.8);
  else if (p >= th.mittel) n = Math.min(3.5, Math.max(n, 1.9));
  else n = Math.max(n, 3.6);
  return n;
}

export function notenwort(note: number): string {
  if (note <= 1.5) return "sehr gut";
  if (note <= 2.5) return "gut";
  if (note <= 3.5) return "befriedigend";
  if (note <= 4.5) return "ausreichend";
  return "mangelhaft";
}

export const RATING_LABEL: Record<Rating, string> = {
  gut: "Empfehlenswert",
  mittel: "Mit Abstrichen",
  schlecht: "Rot – keine Empfehlung",
};

export function ratioRating(value: number, max: number, methodikVersion?: string | null): Rating {
  return ratingFor(max > 0 ? (value / max) * 100 : 0, methodikVersion);
}
