import { describe, expect, it } from "vitest";
import { berechne } from "./index";
import type { ErgebnisErgaenzung, ErgebnisOk, FutterInput, TierInput } from "./types";

const ok = (futter: FutterInput, tier: TierInput, ergaenzung = false) => {
  const r = berechne({ futter, tier, ergaenzung });
  expect(r.status).toBe("ok");
  return r as ErgebnisOk;
};
const near = (x: number | null, y: number, tol = 0.1) => expect(Math.abs((x as number) - y)).toBeLessThanOrEqual(tol);

const T1: FutterInput = { typ: "trocken", p: 25, f: 14, fa: 2.5, a: 7, m: 10, ca: 1.3, ph: 0.95 };
const hund20: TierInput = { art: "hund", gewicht: 20, phase: "adult", alter: "adult", aktiv: "normal" };

describe("Testfälle aus Konzept 9.4 (Referenz: rechner.py)", () => {
  it("T1 Hund adult, Trockenfutter", () => {
    const r = ok(T1, hund20);
    near(r.ts, 90);
    near(r.nfe, 41.5);
    near(r.ge, 454.5);
    near(r.dig, 87.23, 0.01);
    near(r.de, 396.45);
    near(r.me, 370.45);
    near(r.bedarf.kcal, 1040.3);
    near(r.menge, 280.82, 0.5);
    near(r.mengeLo, 252.74, 0.5);
    near(r.mengeHi, 308.91, 0.5);
    expect(r.spalte).toBe("adult110");
    near(r.p1000, 67.49, 0.05);
    near(r.f1000, 37.79, 0.05);
    near(r.rp, 1.5, 0.01);
    near(r.capr!.ratio, 1.37, 0.01);
    near(r.capr!.caTs, 1.44, 0.01);
    near(r.capr!.pTs, 1.06, 0.01);
    near(r.aTs, 7.8, 0.05);
    expect(r.punkte).toEqual({ pf: 14.5, pe: 12.3, pmin: 10, fmin: 5, nfe: 2.2, capr: 20, plaus: 10 });
    expect(r.score).toBe(74);
    expect(r.note).toBe("befriedigend");
    expect(r.kollagen).toMatchObject({ abzugNaehrwerte: 0, abzugZutaten: 0, zutatenGeprueft: false });
    near(r.pf, 1.786, 0.001);
  });

  it("T2 Hund adult, Nassfutter, kastriert, wenig aktiv", () => {
    const r = ok(
      { typ: "nass", p: 10.5, f: 7, fa: 0.5, a: 2.2, m: 78, ca: 0.3, ph: 0.22 },
      { art: "hund", gewicht: 10, phase: "adult", alter: "adult", aktiv: "wenig", kastriert: true },
    );
    near(r.ts, 22);
    near(r.nfe, 1.8);
    near(r.ge, 135.08);
    near(r.dig, 87.95, 0.01);
    near(r.me, 107.88);
    near(r.bedarf.kcal, 480.8);
    near(r.bedarf.faktor, 85.5);
    near(r.menge, 445.67, 0.5);
    expect(r.spalte).toBe("adult95");
    near(r.p1000, 97.33, 0.05);
    near(r.f1000, 64.89, 0.05);
    near(r.aTs, 10.0, 0.05);
    expect(r.punkte).toEqual({ pf: 9.2, pe: 15, pmin: 10, fmin: 5, nfe: 5, capr: 20, plaus: 10 });
    expect(r.score).toBe(74);
    expect(r.note).toBe("befriedigend");
  });

  const T3: FutterInput = { typ: "trocken", p: 28, f: 17, fa: 2.5, a: 7.5, m: 10, ca: 1.3, ph: 1.0 };
  const welpe: TierInput = { art: "hund", gewicht: 12, phase: "welpe", wochen: 17, endgewicht: 30 };

  it("T3 Welpe 17 Wochen, 12 kg, Endgewicht 30 kg", () => {
    const r = ok(T3, welpe);
    near(r.ge, 473.15);
    near(r.me, 383.6);
    near(r.bedarf.kcal, 1290.1);
    near(r.menge, 336.32, 0.5);
    expect(r.spalte).toBe("wachstum_spaet");
    near(r.p1000, 72.99, 0.05);
    near(r.f1000, 44.32, 0.05);
    near(r.rp, 1.46, 0.01);
    near(r.rf, 2.09, 0.01);
    near(r.capr!.ratio, 1.3, 0.01);
    near(r.capr!.caTs, 1.44, 0.01);
    expect(r.punkte).toEqual({ pf: 11.9, pe: 13.1, pmin: 10, fmin: 5, nfe: 4, capr: 20, plaus: 10 });
    expect(r.score).toBe(74);
    expect(r.note).toBe("befriedigend");
    expect(r.hinweise.some((h) => h.id === "welpe")).toBe(true);
  });

  it("T3b Welpe mit Adult-Futter aus T1", () => {
    const r = ok(T1, welpe);
    near(r.rp, 1.35, 0.01);
    near(r.rf, 1.78, 0.01);
    near(r.capr!.ratio, 1.37, 0.01);
    near(r.menge, 348.26, 0.5);
    expect(r.punkte).toEqual({ pf: 14.5, pe: 11.9, pmin: 10, fmin: 5, nfe: 2.2, capr: 20, plaus: 10 });
    expect(r.score).toBe(74);
  });

  it("T4 Senior-Hund, Feuchte und Ca/P fehlen", () => {
    const r = ok(
      { typ: "trocken", p: 22, f: 10, fa: 3.5, a: 6, m: null },
      { art: "hund", gewicht: 25, phase: "adult", alter: "senior", aktiv: "normal", kastriert: true },
    );
    expect(r.feuchte).toBe(10);
    expect(r.feuchteGeschaetzt).toBe(true);
    near(r.me, 347.59);
    near(r.bedarf.kcal, 955.9);
    near(r.menge, 275.01, 0.5);
    expect(r.spalte).toBe("adult95");
    near(r.rp, 1.21, 0.01);
    expect(r.punkte).toEqual({ pf: 22.1, pe: 10.7, pmin: 10, fmin: 5, nfe: 0.3, plaus: 8 });
    expect(r.score).toBe(70);
    expect(r.note).toBe("befriedigend");
    expect(r.deckel).toContain("gut");
  });

  it("T5 Katze adult, Nassfutter, kastriert, Wohnung", () => {
    const r = ok(
      { typ: "nass", p: 11, f: 5.5, fa: 0.4, a: 2.0, m: 80, ca: 0.3, ph: 0.22, taurinMgKg: 1000 },
      { art: "katze", gewicht: 4.5, phase: "adult", aktiv: "wohnung", kastriert: true },
    );
    near(r.ge, 120.55);
    near(r.me, 95.37);
    near(r.bedarf.kcal, 205.5);
    near(r.menge, 215.42, 0.5);
    expect(r.spalte).toBe("adult75");
    near(r.p1000, 115.34, 0.05);
    near(r.f1000, 57.67, 0.05);
    near(r.taurin!.ts, 0.5, 0.01);
    expect(r.punkte).toEqual({ pf: 20, pe: 12.1, pmin: 10, fmin: 5, nfe: 10, capr: 20, taurin: 10, plaus: 10 });
    expect(r.score).toBe(84);
    expect(r.note).toBe("gut");
  });

  it("T6 Kitten 5 Monate, 2,5 kg, Trockenfutter", () => {
    const r = ok(
      { typ: "trocken", p: 34, f: 20, fa: 2, a: 7.5, m: 8, ca: 1.2, ph: 1.0, taurinMgKg: 2000 },
      { art: "katze", gewicht: 2.5, phase: "kitten", monate: 5 },
    );
    near(r.me, 409.64);
    near(r.bedarf.kcal, 346.4);
    near(r.menge, 84.57, 0.5);
    expect(r.spalte).toBe("wachstum");
    near(r.rp, 1.19, 0.01);
    near(r.taurin!.ts, 0.22, 0.01);
    expect(r.punkte).toEqual({ pf: 14, pe: 9.2, pmin: 10, fmin: 5, nfe: 3.6, capr: 20, taurin: 10, plaus: 10 });
    expect(r.score).toBe(71);
    expect(r.note).toBe("befriedigend");
  });

  it("T7 Mangelhaftes Futter: Hund adult, wenig aktiv", () => {
    const r = ok(
      { typ: "trocken", p: 15, f: 4.5, fa: 4, a: 9.5, m: 10, ca: 2.4, ph: 0.8 },
      { art: "hund", gewicht: 15, phase: "adult", alter: "adult", aktiv: "wenig" },
    );
    near(r.me, 305.03);
    near(r.bedarf.kcal, 724, 1);
    near(r.menge, 237, 1);
    near(r.p1000, 49.18, 0.05);
    near(r.f1000, 14.75, 0.05);
    near(r.rp, 0.94, 0.01);
    near(r.capr!.caTs, 2.67, 0.01);
    expect(r.punkte).toEqual({ pf: 35, pe: 0, pmin: 5, fmin: 5, nfe: 0, capr: 0, plaus: 10 });
    expect(r.score).toBe(55);
    expect(r.note).toBe("mangelhaft");
    expect(r.deckel).toEqual(["ausreichend", "ausreichend"]);
  });

  it("T8 Katzen-Snack: keine Note, Leckerli-Budget", () => {
    const r = berechne({
      futter: { typ: "trocken", p: 30, f: 12, fa: 2, a: 7, m: 18 },
      tier: { art: "katze", gewicht: 4.5, phase: "adult", aktiv: "wohnung", kastriert: true },
      ergaenzung: true,
      stueckGramm: 2,
    }) as ErgebnisErgaenzung;
    expect(r.status).toBe("ergaenzung");
    near(r.me, 336, 1);
    near(r.mer, 206, 1);
    near(r.budgetKcal, 21, 0.5);
    near(r.budgetGramm, 6, 0.3);
    near(r.kcalStueck, 6.7, 0.1);
  });
});

// ---------------------------------------------------------------------------
// Bewertung v2 nach Rechtsprüfung 27.10.2026: 21 Fälle × 4 Konfigurationen (Spiegel von docs/futterrechner/testfaelle.py)
// ---------------------------------------------------------------------------
import { KOLLAGEN_ABZUG_AKTIV, KOLL_STUFE1_MAX, UNTERGRENZE_FEDIAF_KONFORM, UNTERGRENZE_WERT } from "./fediaf";
import type { BewertungsOptionen } from "./index";

const H20: TierInput = { art: "hund", gewicht: 20, phase: "adult", alter: "adult", aktiv: "normal" };
const KW: TierInput = { art: "katze", gewicht: 4.5, phase: "adult", aktiv: "wohnung", kastriert: true };
const FALL: Record<string, [FutterInput, TierInput]> = {
  T1: [T1, H20],
  T2: [{ typ: "nass", p: 10.5, f: 7, fa: 0.5, a: 2.2, m: 78, ca: 0.3, ph: 0.22 }, { art: "hund", gewicht: 10, phase: "adult", alter: "adult", aktiv: "wenig", kastriert: true }],
  T3: [{ typ: "trocken", p: 28, f: 17, fa: 2.5, a: 7.5, m: 10, ca: 1.3, ph: 1.0 }, { art: "hund", gewicht: 12, phase: "welpe", wochen: 17, endgewicht: 30 }],
  T3b: [T1, { art: "hund", gewicht: 12, phase: "welpe", wochen: 17, endgewicht: 30 }],
  T4: [{ typ: "trocken", p: 22, f: 10, fa: 3.5, a: 6, m: null }, { art: "hund", gewicht: 25, phase: "adult", alter: "senior", aktiv: "normal", kastriert: true }],
  T5: [{ typ: "nass", p: 11, f: 5.5, fa: 0.4, a: 2.0, m: 80, ca: 0.3, ph: 0.22, taurinMgKg: 1000 }, KW],
  T6: [{ typ: "trocken", p: 34, f: 20, fa: 2, a: 7.5, m: 8, ca: 1.2, ph: 1.0, taurinMgKg: 2000 }, { art: "katze", gewicht: 2.5, phase: "kitten", monate: 5 }],
  T7: [{ typ: "trocken", p: 15, f: 4.5, fa: 4, a: 9.5, m: 10, ca: 2.4, ph: 0.8 }, { art: "hund", gewicht: 15, phase: "adult", alter: "adult", aktiv: "wenig" }],
  T9: [{ typ: "nass", p: 10, f: 9, fa: 0.5, a: 2.3, m: 76, ca: 0.35, ph: 0.25 }, H20],
  T10: [{ typ: "trocken", p: 45, f: 15, fa: 2.5, a: 8, m: 8, ca: 1.6, ph: 1.1 }, H20],
  T11: [{ typ: "nass", p: 11.5, f: 2.4, fa: 0.3, a: 2.5, m: 82, ca: 0.42, ph: 0.3, taurinMgKg: 500 }, KW],
  T12: [{ typ: "nass", p: 11.5, f: 2.4, fa: 0.3, a: 2.5, m: 82, ca: 0.42, ph: 0.3, taurinMgKg: 500, zutaten: "Fleisch und tierische Nebenerzeugnisse (davon 4 % Huhn), pflanzliche Eiweißextrakte, Fisch und Fischnebenerzeugnisse, Mineralstoffe, Zucker" }, KW],
  T13: [{ typ: "nass", p: 10.5, f: 5.5, fa: 0.5, a: 2.0, m: 78, zutaten: "Kaninchen 40 % (Fleisch, Herz, Luftröhre), Rinderknorpel, Karotte, Kartoffel, Leinöl, Mineralstoffe" }, H20],
  T14: [{ typ: "nass", p: 10.5, f: 5.5, fa: 0.5, a: 2.0, m: 78, zutaten: "Huhn 60 % (Brust, Herz, Leber), Reis, Karotte, Erbsen, Leinöl, Gelatine" }, H20],
  T16: [{ typ: "trocken", p: 26, f: 14, fa: 2.5, a: 7, m: 10, ca: 1.3, ph: 0.95, zutaten: "Huhn getrocknet 30 %, Reis, hydrolysierte Hühnerleber 4 %, Hefehydrolysat, Hühnerfett" }, H20],
  T17: [{ typ: "trocken", p: 26, f: 14, fa: 2.5, a: 7, m: 10, ca: 1.3, ph: 0.95, zutaten: "   " }, H20],
  T15: [{ typ: "trocken", p: 26, f: 12, fa: 2.5, a: 10.8, m: 10, ca: 2.07, ph: 1.25 }, H20],
  T18: [{ typ: "trocken", p: 22, f: 22, fa: 3, a: 7, m: 10, ca: 1.2, ph: 0.9 }, H20],
  T19: [{ typ: "trocken", p: 22, f: 22, fa: 3, a: 7, m: 10, ca: 2.6, ph: 1.6 }, H20],
  T20: [{ typ: "nass", p: 14, f: 12, fa: 0.3, a: 2, m: 72, ca: 0.35, ph: 0.28, taurinMgKg: 300 }, KW],
  T21: [{ typ: "trocken", p: 22, f: 22, fa: 3, a: 7, m: 10, ca: 1.2, ph: 0.9, zutaten: "Geflügel, Rinderknorpel, Mais, Gelatine, Hühnerfett" }, H20],
};
const PT: Record<string, Record<string, number>> = {
  T1: { pf: 14.5, pe: 12.3, pmin: 10, fmin: 5, nfe: 2.2, capr: 20, plaus: 10 },
  T2: { pf: 9.2, pe: 15.0, pmin: 10, fmin: 5, nfe: 5.0, capr: 20, plaus: 10 },
  T3: { pf: 11.9, pe: 13.1, pmin: 10, fmin: 5, nfe: 4.0, capr: 20, plaus: 10 },
  T3b: { pf: 14.5, pe: 11.9, pmin: 10, fmin: 5, nfe: 2.2, capr: 20, plaus: 10 },
  T4: { pf: 22.1, pe: 10.7, pmin: 10, fmin: 5, nfe: 0.3, plaus: 8 },
  T5: { pf: 20.0, pe: 12.1, pmin: 10, fmin: 5, nfe: 10.0, capr: 20, taurin: 10, plaus: 10 },
  T6: { pf: 14.0, pe: 9.2, pmin: 10, fmin: 5, nfe: 3.6, capr: 20, taurin: 10, plaus: 10 },
  T7: { pf: 35.0, pe: 0.0, pmin: 5.0, fmin: 5, nfe: 0.0, capr: 0, plaus: 10 },
  T9: { pf: 2.0, pe: 14.7, pmin: 10, fmin: 5, nfe: 5.0, capr: 20, plaus: 10 },
  T10: { pf: 35.0, pe: 15.0, pmin: 10, fmin: 5, nfe: 5.0, capr: 20, plaus: 10 },
  T11: { pf: 35.0, pe: 15.0, pmin: 10, fmin: 5, nfe: 10.0, capr: 20, taurin: 10, plaus: 7 },
  T13: { pf: 16.7, pe: 15.0, pmin: 10, fmin: 5, nfe: 5.0, plaus: 10 },
  T16: { pf: 15.8, pe: 12.8, pmin: 10, fmin: 5, nfe: 2.5, capr: 20, plaus: 10 },
  T15: { pf: 21.5, pe: 13.8, pmin: 10, fmin: 5, nfe: 3.0, capr: 20, plaus: 7 },
  T18: { pf: 0.0, pe: 9.6, pmin: 10, fmin: 5, nfe: 3.8, capr: 20, plaus: 10 },
  T19: { pf: 0.0, pe: 9.6, pmin: 10, fmin: 5, nfe: 3.8, capr: 0, plaus: 10 },
  T20: { pf: 3.3, pe: 8.6, pmin: 10, fmin: 5, nfe: 10.0, capr: 20, taurin: 0, plaus: 10 },
};
PT.T12 = PT.T11; PT.T14 = PT.T13; PT.T17 = PT.T16; PT.T21 = PT.T18;
// score, note, abzugNW, abzugZut, zutatenGeprueft, hinweis, untergrenzeGegriffen
type Soll = [number, string, number, number, boolean, boolean, boolean];
const SOLL_A5: Record<string, Soll> = {
  T1: [74, "befriedigend", 0, 0, false, false, false], T2: [74, "befriedigend", 0, 0, false, false, false],
  T3: [74, "befriedigend", 0, 0, false, false, false], T3b: [74, "befriedigend", 0, 0, false, false, false],
  T4: [70, "befriedigend", 0, 0, false, false, false], T5: [84, "gut", 0, 0, false, false, false],
  T6: [71, "befriedigend", 0, 0, false, false, false], T7: [55, "mangelhaft", 0, 0, false, false, false],
  T9: [67, "ausreichend", 0, 0, false, false, false], T10: [100, "sehr gut", 0, 0, false, false, false],
  T11: [97, "sehr gut", 0, 0, false, true, false], T12: [97, "sehr gut", 0, 0, true, true, false],
  T13: [71, "befriedigend", 0, 6, true, true, false], T14: [77, "befriedigend", 0, 0, true, false, false],
  T16: [76, "befriedigend", 0, 0, true, false, false], T17: [76, "befriedigend", 0, 0, false, false, false],
  T15: [80, "gut", 0, 0, false, true, false], T18: [58, "mangelhaft", 0, 0, false, false, false],
  T19: [38, "mangelhaft", 0, 0, false, false, false], T20: [58, "mangelhaft", 0, 0, false, false, false],
  T21: [52, "mangelhaft", 0, 6, true, true, false],
};
const SOLL: Record<string, Record<string, Soll>> = {
  // Auslieferungszustand ohne Untergrenze und ohne Abzug (so rechnet auch docs/futterrechner/testfaelle.py)
  STANDARD: { ...SOLL_A5, T13: [77, "befriedigend", 0, 0, true, true, false], T21: [58, "mangelhaft", 0, 0, true, true, false] },
  A5: SOLL_A5,
  A5_BODEN: { ...SOLL_A5, T18: [60, "ausreichend", 0, 0, false, false, true], T21: [60, "ausreichend", 0, 6, true, true, true] },
  A5_S1_3: { ...SOLL_A5, T11: [94, "sehr gut", 3, 0, false, true, false], T12: [94, "sehr gut", 3, 0, true, true, false], T15: [78, "befriedigend", 2, 0, false, true, false] },
  // Auslieferung nach Entscheidung vom 27.10.2026: Untergrenze an, Kollagen-Abzug aus
  AUSLIEFERUNG: { ...SOLL_A5, T13: [77, "befriedigend", 0, 0, true, true, false], T18: [60, "ausreichend", 0, 0, false, false, true], T21: [60, "ausreichend", 0, 0, true, true, true] },
};
const KONFIG: Record<string, BewertungsOptionen> = {
  STANDARD: { abzugAktiv: false, untergrenze: false, stufe1Max: 0 },
  A5: { abzugAktiv: true, untergrenze: false, stufe1Max: 0 },
  A5_BODEN: { abzugAktiv: true, untergrenze: true, stufe1Max: 0 },
  A5_S1_3: { abzugAktiv: true, untergrenze: false, stufe1Max: 3 },
  AUSLIEFERUNG: { abzugAktiv: false, untergrenze: true, stufe1Max: 0 },
};

describe("Rechtsprüfung 27.10.2026: Sollwerte je Konfiguration", () => {
  for (const [kname, opt] of Object.entries(KONFIG)) {
    describe(kname, () => {
      it.each(Object.keys(SOLL[kname]))("%s", (key) => {
        const [futter, tier] = FALL[key];
        const r = berechne({ futter, tier }, opt) as ErgebnisOk;
        expect(r.status).toBe("ok");
        const [score, note, a1, a2, geprueft, hinweis, boden] = SOLL[kname][key];
        expect(r.punkte).toEqual(PT[key]);
        expect([r.score, r.note, r.kollagen.abzugNaehrwerte, r.kollagen.abzugZutaten, r.kollagen.zutatenGeprueft, r.kollagen.flag, r.untergrenzeGegriffen])
          .toEqual([score, note, a1, a2, geprueft, hinweis, boden]);
      });
    });
  }
  it("Konstanten im Auslieferungszustand: Abzug aus, Stufe 1 = 0, Untergrenze 60 an (Entscheidung Manni 27.10.2026)", () => {
    expect(KOLLAGEN_ABZUG_AKTIV).toBe(false);
    expect(KOLL_STUFE1_MAX).toBe(0);
    expect(UNTERGRENZE_FEDIAF_KONFORM).toBe(true);
    expect(UNTERGRENZE_WERT).toBe(60);
  });
  it("ohne Optionen rechnet bewerte() mit den Konstanten", () => {
    for (const key of Object.keys(SOLL.AUSLIEFERUNG)) {
      const [futter, tier] = FALL[key];
      const r = berechne({ futter, tier }) as ErgebnisOk;
      expect([r.score, r.untergrenzeGegriffen]).toEqual([SOLL.AUSLIEFERUNG[key][0], SOLL.AUSLIEFERUNG[key][6]]);
    }
  });
});
