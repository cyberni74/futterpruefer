import type { Art, HundAktiv, KatzeAktiv } from "./types";
import type { EnergieEinheit } from "./energie";

export type Num = number | null;
export type FutterartWahl = "trocken" | "nass" | "snack";
export type Typ = "alleinfutter" | "ergaenzung";

/** Analysewerte je Futterart; null = noch nicht gesetzt (keine Vorgabewerte, kein Note für nie eingegebene Werte). */
export type Werte = {
  p: Num; f: Num; fa: Num; a: Num; m: Num;
  ca: Num; ph: Num; taurin: Num;
  me: Num; meEinheit: EnergieEinheit;
  stueck: Num;
  /** Erste Zutaten (optional, Freitext), nur für die Kollagen-Heuristik; nicht im Teilen-Link */
  zutaten: string | null;
};

export type FormState = {
  art: Art;
  futterart: FutterartWahl;
  typ: Typ;
  werte: Record<FutterartWahl, Werte>;
  gewicht: Num;
  /** Position auf dem zweiteiligen Alters-Regler, siehe alterAusPosition */
  alterPos: Num;
  endgewicht: Num;
  hundAktiv: HundAktiv | null;
  katzeAktiv: KatzeAktiv | null;
  kastriert: boolean | null;
};

export const leereWerte = (): Werte => ({ p: null, f: null, fa: null, a: null, m: null, ca: null, ph: null, taurin: null, me: null, meEinheit: "kcal100g", stueck: null, zutaten: null });

export const startState = (art: Art = "hund", futterart: FutterartWahl = "trocken"): FormState => ({
  art,
  futterart,
  typ: futterart === "snack" ? "ergaenzung" : "alleinfutter",
  werte: { trocken: leereWerte(), nass: leereWerte(), snack: leereWerte() },
  gewicht: null,
  alterPos: null,
  endgewicht: null,
  hundAktiv: null,
  katzeAktiv: null,
  kastriert: null,
});

export type AlterEinheit = "wochen" | "monate" | "jahre";
export type Alter = { wert: number; einheit: AlterEinheit };

/** Hund: Position 0–44 = 8–52 Wochen, danach 1–18 Jahre. Katze: 0–10 = 2–12 Monate, danach 1–22 Jahre. */
export const ALTER_MAX: Record<Art, number> = { hund: 44 + 18, katze: 10 + 22 };

export function alterAusPosition(art: Art, pos: number): Alter {
  if (art === "hund") return pos <= 44 ? { wert: 8 + pos, einheit: "wochen" } : { wert: pos - 44, einheit: "jahre" };
  return pos <= 10 ? { wert: 2 + pos, einheit: "monate" } : { wert: pos - 10, einheit: "jahre" };
}

export function positionAusAlter(art: Art, a: Alter): number {
  if (art === "hund") return a.einheit === "wochen" ? a.wert - 8 : 44 + a.wert;
  return a.einheit === "monate" ? a.wert - 2 : 10 + a.wert;
}

export type Lebensphase = "welpe" | "jung" | "adult" | "senior" | "kitten";

export function lebensphase(art: Art, a: Alter): Lebensphase {
  if (art === "hund") {
    if (a.einheit === "wochen") return "welpe";
    return a.wert <= 2 ? "jung" : a.wert <= 7 ? "adult" : "senior";
  }
  return a.einheit === "monate" ? "kitten" : a.wert >= 11 ? "senior" : "adult";
}

export const alterText = (a: Alter) =>
  a.einheit === "wochen" ? `${a.wert} Wochen` : a.einheit === "monate" ? `${a.wert} Monate` : a.wert === 1 ? "1 Jahr" : `${a.wert} Jahre`;
