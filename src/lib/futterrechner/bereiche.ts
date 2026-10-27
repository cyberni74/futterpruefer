import type { Art } from "./types";
import type { FutterartWahl } from "./state";

/** Regler-Bereiche nach Konzept 6.3. Das Zahlenfeld erlaubt mehr (Validierung in validierung.ts). */
export type Bereich = { min: number; max: number; step: number; platzhalter: number };
export type FutterBereiche = { p: Bereich; f: Bereich; fa: Bereich; a: Bereich; m: Bereich; ca: Bereich; ph: Bereich; taurin?: Bereich };

const b = (min: number, max: number, step: number, platzhalter: number): Bereich => ({ min, max, step, platzhalter });

const snack = (): FutterBereiche => ({
  p: b(0, 80, 0.5, 30), f: b(0, 40, 0.5, 12), fa: b(0, 15, 0.5, 2), a: b(0, 20, 0.5, 7), m: b(3, 85, 0.5, 18),
  ca: b(0.05, 3, 0.05, 1), ph: b(0.05, 2, 0.05, 0.8),
});

export const BEREICHE: Record<Art, Record<FutterartWahl, FutterBereiche>> = {
  hund: {
    trocken: { p: b(10, 45, 0.5, 24), f: b(3, 30, 0.5, 13), fa: b(0, 12, 0.1, 2.5), a: b(2, 15, 0.1, 7), m: b(3, 14, 0.5, 10), ca: b(0.2, 3, 0.05, 1.2), ph: b(0.2, 2, 0.05, 0.9) },
    nass: { p: b(3, 20, 0.1, 10), f: b(0.5, 15, 0.1, 7), fa: b(0, 3, 0.1, 0.5), a: b(0.5, 5, 0.1, 2.2), m: b(60, 88, 0.5, 78), ca: b(0.05, 1, 0.01, 0.3), ph: b(0.05, 0.8, 0.01, 0.22) },
    snack: snack(),
  },
  katze: {
    trocken: { p: b(20, 55, 0.5, 32), f: b(5, 28, 0.5, 15), fa: b(0, 10, 0.1, 2.5), a: b(3, 14, 0.1, 7.5), m: b(3, 14, 0.5, 8), ca: b(0.3, 2.5, 0.05, 1.1), ph: b(0.3, 2, 0.05, 0.9), taurin: b(0, 3000, 50, 1500) },
    nass: { p: b(5, 20, 0.1, 11), f: b(0.5, 12, 0.1, 5.5), fa: b(0, 3, 0.1, 0.4), a: b(0.5, 5, 0.1, 2), m: b(65, 88, 0.5, 80), ca: b(0.05, 1, 0.01, 0.3), ph: b(0.05, 0.8, 0.01, 0.22), taurin: b(0, 3000, 50, 1000) },
    snack: { ...snack(), taurin: b(0, 3000, 50, 1000) },
  },
};

export const GEWICHT = {
  /** Hund: bis 10 kg in 0,5er-Schritten, darüber in 1er-Schritten (zweistufige Skala, Position 0–… → kg). */
  hund: { max: 80, feld: [0.5, 100] as const },
  katze: { min: 1, max: 10, step: 0.1, feld: [0.3, 12] as const },
};

/** Zweistufige Gewichtsskala Hund: Positionen 0–19 = 0,5–10 kg, 20–89 = 11–80 kg. */
export const hundGewichtPos = { max: 19 + 70 };
export const hundKgAusPos = (pos: number) => (pos <= 19 ? 0.5 + pos * 0.5 : 10 + (pos - 19));
export const hundPosAusKg = (kg: number) => (kg <= 10 ? Math.round((kg - 0.5) / 0.5) : 19 + Math.round(kg - 10));
