import type { Art, CaRegel, Spalte } from "./types";
import { ASCHE_BAND, TAURIN_MIN, caRegel } from "./fediaf";
import { inTs } from "./energie";

/** g je 1000 kcal = Wert wie gefüttert (g/100 g) ÷ ME (kcal/100 g) × 1000 */
export const proTausendKcal = (wert: number, me: number) => (wert / me) * 1000;

export type CaPCheck = { ratio: number; caTs: number; pTs: number; regel: CaRegel; okRatio: boolean; okCa: boolean; okP: boolean; nah: boolean; caUeber: boolean };

export function caPCheck(art: Art, spalte: Spalte, ca: number, ph: number, feuchte: number, endgewicht?: number | null, wochen?: number): CaPCheck {
  const regel = caRegel(art, spalte, endgewicht, wochen);
  const ratio = ca / ph;
  const caTs = inTs(ca, feuchte);
  const pTs = inTs(ph, feuchte);
  const okRatio = regel.rMin <= ratio && ratio <= regel.rMax;
  const okCa = caTs >= regel.caMin && (regel.caMax === null || caTs <= regel.caMax);
  const okP = pTs >= regel.pMin && (regel.pMax === null || pTs <= regel.pMax);
  const nah = regel.rMin - 0.1 <= ratio && ratio <= regel.rMax + 0.1;
  return { ratio, caTs, pTs, regel, okRatio, okCa, okP, nah, caUeber: regel.caMax !== null && caTs > regel.caMax };
}

/** Taurin in % TS = (mg/kg ÷ 10.000) ÷ TS × 100 */
export function taurinCheck(mgKg: number, feuchte: number, spalte: Spalte, nass: boolean) {
  const ts = (mgKg / 10000 / (100 - feuchte)) * 100;
  const min = TAURIN_MIN[`${spalte}:${nass ? "nass" : "trocken"}`] ?? 0;
  return { ts, min, ok: ts >= min };
}

export const ascheImBand = (aTs: number) => aTs >= ASCHE_BAND.min && aTs <= ASCHE_BAND.max;

/** Stufen: Verhältnis zum Minimum → Punkte. */
export function stufe(r: number, steps: Array<[number, number]>): number {
  for (const [thr, pts] of steps) if (r >= thr) return pts;
  return 0;
}
