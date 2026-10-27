import { z } from "zod";
import type { Eingabe } from "./index";
import type { FutterInput, TierInput } from "./types";
import { alterAusPosition, lebensphase, type FormState, type Werte } from "./state";
import { zuKcal100g } from "./energie";

/** Akzeptiert Dezimalkomma und -punkt; leer → null; Unsinn → NaN. */
export function parseZahl(text: string): number | null {
  const t = text.trim().replace(/\s/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
  if (t === "" || t === "-") return null;
  return /^-?\d+(\.\d+)?$/.test(t) ? Number(t) : Number.NaN;
}

const pct = z.number().min(0, "Der Wert darf nicht negativ sein.").max(100, "Der Wert darf höchstens 100 % sein.");

export type Feld = "p" | "f" | "fa" | "a" | "m" | "ca" | "ph" | "taurin" | "me" | "stueck" | "gewicht" | "alter" | "endgewicht" | "aktiv" | "summe" | "futter";

export type Pruefung = {
  fehler: Partial<Record<Feld, string>>;
  warnungen: Partial<Record<Feld, string>>;
  /** Pflichtwerte, die noch fehlen (nur Bezeichner für die Anzeige) */
  fehlend: string[];
  eingabe: Eingabe | null;
};

const GEWICHT = { hund: [0.5, 100], katze: [0.3, 12] } as const;

export function pruefe(s: FormState): Pruefung {
  const fehler: Pruefung["fehler"] = {};
  const warnungen: Pruefung["warnungen"] = {};
  const fehlend: string[] = [];
  const w: Werte = s.werte[s.futterart];
  const nass = s.futterart === "nass";

  for (const [k, label] of [["p", "Rohprotein"], ["f", "Rohfett"], ["fa", "Rohfaser"], ["a", "Rohasche"]] as const) {
    const v = w[k];
    if (v == null) fehlend.push(label);
    else if (!pct.safeParse(v).success) fehler[k] = "Bitte einen Wert zwischen 0 und 100 eingeben.";
  }
  if (w.m == null) {
    if (nass) {
      fehlend.push("Feuchte");
      fehler.m = "Bei Nassfutter ist die Feuchte Pflicht.";
    }
  } else if (!pct.safeParse(w.m).success) fehler.m = "Bitte einen Wert zwischen 0 und 100 eingeben.";
  else if (s.futterart === "trocken" && w.m > 14) warnungen.m = "Trockenfutter hat meist höchstens 14 % Feuchte. Bitte prüfen Sie die Art des Futters.";
  else if (nass && w.m < 60) warnungen.m = "Nassfutter hat meist mindestens 60 % Feuchte. Bitte prüfen Sie die Art des Futters.";

  for (const k of ["ca", "ph"] as const) {
    const v = w[k];
    if (v != null) {
      if (!pct.safeParse(v).success) fehler[k] = "Bitte einen Wert zwischen 0 und 100 eingeben.";
      else if (v > 5) warnungen[k] = "Wert ungewöhnlich, bitte prüfen.";
    }
  }
  if (w.ca != null && w.ph != null && w.ph > 0 && w.ca / w.ph > 4) warnungen.ca = "Wert ungewöhnlich, bitte prüfen.";
  if (w.taurin != null && (w.taurin < 0 || w.taurin > 20000)) fehler.taurin = "Bitte einen Wert in mg/kg eingeben.";

  let meKcal: number | null = null;
  if (w.me != null) {
    meKcal = zuKcal100g(w.me, w.meEinheit);
    if (meKcal < 50 || meKcal > 600) {
      fehler.me = "Die Energie muss zwischen 50 und 600 kcal/100 g liegen.";
      meKcal = null;
    }
  }

  // Summe und NfE
  const alle = [w.p, w.f, w.fa, w.a].every((x) => x != null);
  if (alle && !fehler.p && !fehler.f && !fehler.fa && !fehler.a) {
    const summe = (w.p ?? 0) + (w.f ?? 0) + (w.fa ?? 0) + (w.a ?? 0) + (w.m ?? (nass ? 0 : 10));
    if (summe > 102 && (w.m != null || !nass)) fehler.summe = "Die Werte ergeben zusammen mehr als 100 %. Bitte prüfen Sie die Eingabe.";
    else if (100 - summe < -2) fehler.summe = "Die Werte passen nicht zusammen. Bitte prüfen Sie die Eingabe.";
  }

  // Tier
  const art = s.art;
  const [gMin, gMax] = GEWICHT[art];
  if (s.gewicht == null) fehlend.push("Gewicht");
  else if (s.gewicht < gMin || s.gewicht > gMax) fehler.gewicht = `Das Gewicht muss zwischen ${gMin} und ${gMax} kg liegen.`;
  if (s.alterPos == null) fehlend.push("Alter");
  const alter = s.alterPos != null ? alterAusPosition(art, s.alterPos) : null;
  const phase = alter ? lebensphase(art, alter) : null;
  if (phase === "welpe") {
    if (s.endgewicht == null) fehlend.push("Endgewicht");
    else if (s.gewicht != null && s.endgewicht <= s.gewicht) fehler.endgewicht = "Das erwartete Endgewicht muss über dem aktuellen Gewicht liegen.";
  }
  const braucht = phase != null && phase !== "welpe" && phase !== "kitten";
  if (braucht && art === "hund" && s.hundAktiv == null) fehlend.push("Aktivität");
  if (braucht && art === "katze" && s.katzeAktiv == null) fehlend.push("Aktivität");

  if (Object.keys(fehler).length > 0 || fehlend.length > 0 || alter == null || phase == null || s.gewicht == null) {
    return { fehler, warnungen, fehlend, eingabe: null };
  }

  const futter: FutterInput = {
    typ: nass ? "nass" : "trocken",
    p: w.p!, f: w.f!, fa: w.fa!, a: w.a!, m: w.m,
    ca: w.ca, ph: w.ph, taurinMgKg: art === "katze" ? w.taurin : null,
    meHersteller: meKcal,
  };
  const kastriert = s.kastriert === true;
  let tier: TierInput;
  if (art === "hund") {
    tier =
      phase === "welpe"
        ? { art, gewicht: s.gewicht, phase: "welpe", wochen: alter.wert, endgewicht: s.endgewicht }
        : { art, gewicht: s.gewicht, phase: "adult", alter: phase as "jung" | "adult" | "senior", aktiv: s.hundAktiv!, kastriert };
  } else {
    tier = phase === "kitten" ? { art, gewicht: s.gewicht, phase: "kitten", monate: alter.wert } : { art, gewicht: s.gewicht, phase: "adult", aktiv: s.katzeAktiv!, kastriert };
  }
  return { fehler, warnungen, fehlend, eingabe: { futter, tier, ergaenzung: s.futterart === "snack" || s.typ === "ergaenzung", stueckGramm: w.stueck } };
}
