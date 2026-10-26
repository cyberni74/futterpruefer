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
    expect(r.punkte).toEqual({ protein: 35, fett: 20, capr: 20, plaus: 15 });
    expect(r.score).toBe(100);
    expect(r.note).toBe("sehr gut");
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
    expect(r.score).toBe(100);
    expect(r.note).toBe("sehr gut");
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
    expect(r.score).toBe(100);
    expect(r.note).toBe("sehr gut");
    expect(r.hinweise.some((h) => h.id === "welpe")).toBe(true);
  });

  it("T3b Welpe mit Adult-Futter aus T1", () => {
    const r = ok(T1, welpe);
    near(r.rp, 1.35, 0.01);
    near(r.rf, 1.78, 0.01);
    near(r.capr!.ratio, 1.37, 0.01);
    near(r.menge, 348.26, 0.5);
    expect(r.score).toBe(100);
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
    expect(r.punkte).toEqual({ protein: 30, fett: 20, plaus: 10 });
    expect(r.score).toBe(86);
    expect(r.note).toBe("gut");
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
    expect(r.punkte).toEqual({ protein: 35, fett: 20, capr: 20, taurin: 10, plaus: 15 });
    expect(r.score).toBe(100);
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
    expect(r.punkte).toEqual({ protein: 30, fett: 20, capr: 20, taurin: 10, plaus: 15 });
    expect(r.score).toBe(95);
    expect(r.note).toBe("sehr gut");
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
    expect(r.punkte).toEqual({ protein: 10, fett: 14, capr: 0, plaus: 15 });
    expect(r.score).toBe(43);
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
