import type { Art, Energie } from "./types";
import { KCAL_JE_MJ } from "./fediaf";

/** TS (%) = 100 − Feuchte */
export const trockenmasse = (feuchte: number) => 100 - feuchte;

/** Wert in der Trockenmasse (%) */
export const inTs = (wert: number, feuchte: number) => (wert / trockenmasse(feuchte)) * 100;

/** NfE (%) = 100 − (Feuchte + Rohprotein + Rohfett + Rohfaser + Rohasche); nur Information. */
export const nfe = (p: number, f: number, fa: number, a: number, m: number) => 100 - (p + f + fa + a + m);

/**
 * Umsetzbare Energie nach dem NRC-2006-Vierschrittverfahren (FEDIAF Kap. 7.2.2.2, Tab. VII-5), je 100 g wie gefüttert.
 * NfE wird für die Energie nicht negativ.
 */
export function meNrc2006(art: Art, p: number, f: number, fa: number, a: number, m: number): Energie {
  const n = nfe(p, f, fa, a, m);
  const ge = 5.7 * p + 9.4 * f + 4.1 * (Math.max(n, 0) + fa);
  const faTs = inTs(fa, m);
  const dig = art === "hund" ? 91.2 - 1.43 * faTs : 87.9 - 0.88 * faTs;
  const de = (ge * dig) / 100;
  const me = de - (art === "hund" ? 1.04 : 0.77) * p;
  return { nfe: n, ge, dig, de, me };
}

export type EnergieEinheit = "kcal100g" | "kcalkg" | "mjkg";

/** Herstellerangabe in kcal/100 g umrechnen (1 MJ = 239 kcal). */
export function zuKcal100g(wert: number, einheit: EnergieEinheit): number {
  if (einheit === "kcalkg") return wert / 10;
  if (einheit === "mjkg") return (wert * KCAL_JE_MJ) / 10;
  return wert;
}
