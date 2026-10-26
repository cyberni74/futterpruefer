import type { CaRegel, Mindest, Note, Spalte } from "./types";

/**
 * Alle Zahlen aus FEDIAF Nutritional Guidelines, September 2025 (Tabellenverweise je Wert).
 * Energie nach NRC (2006). Spiegel von docs/futterrechner/rechner.py.
 */

/** Notenwörter: einzige Stelle. Alternative nach Rechtsprüfung: stark / gut / solide / knapp / schwach. */
export const NOTEN: Record<Note, string> = {
  "sehr gut": "sehr gut",
  gut: "gut",
  befriedigend: "befriedigend",
  ausreichend: "ausreichend",
  mangelhaft: "mangelhaft",
};

/** Reihenfolge von best nach schlechtest. */
export const NOTEN_REIHE: Note[] = ["sehr gut", "gut", "befriedigend", "ausreichend", "mangelhaft"];

/** Notenschwellen in Punkten (passend zu Grün ≥ 80 / Gelb 60–79 / Rot < 60). */
export const NOTEN_SCHWELLEN: Array<[number, Note]> = [
  [90, "sehr gut"],
  [80, "gut"],
  [70, "befriedigend"],
  [60, "ausreichend"],
];

/** Mindestwerte Rohprotein und Rohfett in g je 1000 kcal ME: FEDIAF Tab. III-3b (Hund), III-4b (Katze). */
export const MINDEST: Record<Spalte, Mindest> = {
  adult110: { p: 45.0, f: 13.75 },
  adult95: { p: 52.1, f: 13.75 },
  wachstum_frueh: { p: 62.5, f: 21.25 },
  wachstum_spaet: { p: 50.0, f: 21.25 },
  adult100: { p: 62.5, f: 22.5 },
  adult75: { p: 83.3, f: 22.5 },
  wachstum: { p: 70.0, f: 22.5 },
};

/** Ca/P in g je 100 g TS und Ca:P-Bereich: FEDIAF Tab. III-3a, III-4a, Fußnoten a und b. */
export function caRegel(art: "hund" | "katze", spalte: Spalte, endgewicht?: number | null, wochen?: number): CaRegel {
  if (art === "hund") {
    if (spalte === "adult110") return { caMin: 0.5, caMax: 2.5, pMin: 0.4, pMax: 1.6, rMin: 1.0, rMax: 2.0 };
    if (spalte === "adult95") return { caMin: 0.58, caMax: 2.5, pMin: 0.46, pMax: 1.6, rMin: 1.0, rMax: 2.0 };
    if (spalte === "wachstum_frueh") return { caMin: 1.0, caMax: 1.6, pMin: 0.9, pMax: null, rMin: 1.0, rMax: 1.6 };
    // Fußnote b: Der höhere Ca-Mindestwert gilt bei großen Rassen bis etwa 6 Monate (26 Wochen).
    const klein = endgewicht != null && (endgewicht <= 15 || (wochen != null && wochen > 26));
    if (klein) return { caMin: 0.8, caMax: 1.8, pMin: 0.7, pMax: null, rMin: 1.0, rMax: 1.8 };
    return { caMin: 1.0, caMax: 1.8, pMin: 0.7, pMax: null, rMin: 1.0, rMax: 1.6 };
  }
  if (spalte === "adult100") return { caMin: 0.4, caMax: null, pMin: 0.26, pMax: null, rMin: 1.0, rMax: 2.0 };
  if (spalte === "adult75") return { caMin: 0.53, caMax: null, pMin: 0.35, pMax: null, rMin: 1.0, rMax: 2.0 };
  return { caMin: 1.0, caMax: null, pMin: 0.84, pMax: null, rMin: 1.0, rMax: 1.5 };
}

/** Taurin-Mindestwerte in % TS: FEDIAF Tab. III-4a. */
export const TAURIN_MIN: Record<string, number> = {
  "adult100:nass": 0.2,
  "adult75:nass": 0.27,
  "wachstum:nass": 0.25,
  "adult100:trocken": 0.1,
  "adult75:trocken": 0.13,
  "wachstum:trocken": 0.1,
};

/** MER-Faktoren Hund (kcal/kg^0,75): FEDIAF Tab. VII-6 und VII-7. */
export const HUND_FAKTOR = { wenig: 95, normalJung: 130, normalAdult: 110, normalSenior: 95, sportlich: 125, sportlichJung: 130, arbeit: 162.5 } as const;
/** Kastriert: Faktor × 0,9, eigene Ableitung aus AAHA 2021 (1,4–1,6 statt 1,6–1,8 × RER). */
export const KASTRIERT_FAKTOR = 0.9;
/** Welpe: FEDIAF Tab. VII-8b. */
export const WELPE = { a: 254.1, b: 135.0 } as const;
/** Katze adult, kg^0,67: FEDIAF Tab. VII-9. */
export const KATZE_FAKTOR = { gedaempft: 75, freigang: 100 } as const;
/** Kitten, Vielfaches von 100 × kg^0,67: FEDIAF Tab. VII-10. */
export const KITTEN_FAKTOR = [
  { bisMonate: 4, lo: 2.0, hi: 2.5 },
  { bisMonate: 9, lo: 1.75, hi: 2.0 },
  { bisMonate: Infinity, lo: 1.5, hi: 1.5 },
] as const;

/** Spanne um den Startwert (eigene Festlegung, FEDIAF: Bedarfsangaben können 10–60 % überschätzen). */
export const SPANNE = 0.1;
/** Leckerli-Budget: höchstens 10 % des Tagesbedarfs (AAHA 2021). */
export const LECKERLI_ANTEIL = 0.1;
/** Rohasche-Band „unauffällig“ in % TS: eigene Festlegung auf Basis von Kazimierska et al. 2020. */
export const ASCHE_BAND = { min: 3, max: 12 } as const;
/** Hund: ab dieser Rohfaser (% TS) unterschätzt die NRC-Formel die Energie (FEDIAF). */
export const FASER_GRENZE_HUND = 8;
/** Umrechnung MJ → kcal. */
export const KCAL_JE_MJ = 239;
