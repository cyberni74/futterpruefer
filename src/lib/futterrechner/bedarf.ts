import type { Bedarf, Spalte, TierInput } from "./types";
import { HUND_FAKTOR, KASTRIERT_FAKTOR, KATZE_FAKTOR, KITTEN_FAKTOR, SPANNE, WELPE } from "./fediaf";

/** RER = 70 × kg^0,75 (nur Info; NRC 2006, AAHA 2021) */
export const rer = (kg: number) => 70 * kg ** 0.75;

const mitSpanne = (kcal: number, faktor: number | null, formel: string): Bedarf => ({
  kcal,
  lo: kcal * (1 - SPANNE),
  hi: kcal * (1 + SPANNE),
  faktor,
  formel,
});

/** Energiebedarf (MER, kcal/Tag) als Startwert mit ±10 %. */
export function bedarf(t: TierInput): Bedarf {
  const kg = t.gewicht;
  if (t.art === "hund") {
    if (t.phase === "welpe") {
      const ew = t.endgewicht;
      if (ew == null || ew <= 0) return mitSpanne(NaN, null, "FEDIAF VII-8b Wachstum");
      return mitSpanne((WELPE.a - WELPE.b * (kg / ew)) * kg ** 0.75, null, "FEDIAF VII-8b Wachstum");
    }
    let f: number =
      t.aktiv === "wenig"
        ? HUND_FAKTOR.wenig
        : t.aktiv === "sportlich"
          ? t.alter === "jung" ? HUND_FAKTOR.sportlichJung : HUND_FAKTOR.sportlich
          : t.aktiv === "arbeit"
            ? HUND_FAKTOR.arbeit
            : t.alter === "jung" ? HUND_FAKTOR.normalJung : t.alter === "adult" ? HUND_FAKTOR.normalAdult : HUND_FAKTOR.normalSenior;
    if (t.kastriert) f *= KASTRIERT_FAKTOR;
    return mitSpanne(f * kg ** 0.75, f, "FEDIAF VII-6/VII-7");
  }
  if (t.phase === "kitten") {
    const k = KITTEN_FAKTOR.find((x) => t.monate < x.bisMonate)!;
    const faktor = (100 * (k.lo + k.hi)) / 2;
    return mitSpanne(100 * kg ** 0.67 * ((k.lo + k.hi) / 2), faktor, "FEDIAF VII-10");
  }
  const base = t.kastriert || t.aktiv === "wohnung" ? KATZE_FAKTOR.gedaempft : KATZE_FAKTOR.freigang;
  return mitSpanne(base * kg ** 0.67, base, "FEDIAF VII-9");
}

/** FEDIAF-Spalte für die Mindestwerte je 1000 kcal. */
export function spalte(t: TierInput, faktor: number | null): Spalte {
  if (t.art === "hund") {
    if (t.phase === "welpe") return t.wochen < 14 ? "wachstum_frueh" : "wachstum_spaet";
    return (faktor ?? 0) <= 100 ? "adult95" : "adult110";
  }
  if (t.phase === "kitten") return "wachstum";
  return (faktor ?? 0) <= 75 ? "adult75" : "adult100";
}
