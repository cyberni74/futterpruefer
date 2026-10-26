import { describe, expect, it } from "vitest";
import { berechne } from "./index";
import { zuKcal100g } from "./energie";
import type { ErgebnisOk, FutterInput, TierInput } from "./types";

const base: FutterInput = { typ: "trocken", p: 25, f: 14, fa: 2.5, a: 7, m: 10, ca: 1.3, ph: 0.95 };
const hund: TierInput = { art: "hund", gewicht: 20, phase: "adult", alter: "adult", aktiv: "normal" };

describe("Kantenfälle", () => {
  it("Summe 103 % → unplausibel", () => {
    expect(berechne({ futter: { ...base, p: 40, f: 30, fa: 10, a: 12, m: 11 }, tier: hund }).status).toBe("unplausibel");
  });
  it("Nassfutter ohne Feuchte → fehlt", () => {
    expect(berechne({ futter: { ...base, typ: "nass", m: null }, tier: hund }).status).toBe("fehlt");
  });
  it("NfE −1 → auf 0 gesetzt, Hinweis", () => {
    const r = berechne({ futter: { ...base, p: 30, f: 20, fa: 5, a: 20, m: 27 }, tier: hund }) as ErgebnisOk;
    expect(r.status).toBe("ok");
    expect(r.nfeTs).toBe(0);
    expect(r.hinweise.some((h) => h.id === "nfe")).toBe(true);
  });
  it("NfE unter −2 → unplausibel", () => {
    expect(berechne({ futter: { ...base, p: 30, f: 20, fa: 5, a: 20, m: 30 }, tier: hund }).status).toBe("unplausibel");
  });
  it("Herstellerenergie 3.600 kcal/kg = 360 kcal/100 g wird verwendet", () => {
    expect(zuKcal100g(3600, "kcalkg")).toBe(360);
    const r = berechne({ futter: { ...base, meHersteller: zuKcal100g(3600, "kcalkg") }, tier: hund }) as ErgebnisOk;
    expect(r.me).toBe(360);
  });
  it("MJ-Umrechnung 15 MJ/kg → 358,5 kcal/100 g", () => {
    expect(zuKcal100g(15, "mjkg")).toBeCloseTo(358.5, 5);
  });
  it("Herstellerwert weicht über 15 % ab → Hinweis, Herstellerwert gilt", () => {
    const r = berechne({ futter: { ...base, meHersteller: 500 }, tier: hund }) as ErgebnisOk;
    expect(r.me).toBe(500);
    expect(r.hinweise.some((h) => h.id === "me")).toBe(true);
  });
  it("Welpe 8 Wochen → Spalte Wachstum früh (Protein-Min. 62,5)", () => {
    const r = berechne({ futter: base, tier: { art: "hund", gewicht: 4, phase: "welpe", wochen: 8, endgewicht: 20 } }) as ErgebnisOk;
    expect(r.spalte).toBe("wachstum_frueh");
    expect(r.mindest.p).toBe(62.5);
  });
  it("Welpe ohne Endgewicht → keine Menge, Bewertung läuft", () => {
    const r = berechne({ futter: base, tier: { art: "hund", gewicht: 4, phase: "welpe", wochen: 20, endgewicht: null } }) as ErgebnisOk;
    expect(r.status).toBe("ok");
    expect(r.menge).toBeNull();
    expect(r.hinweise.some((h) => h.id === "endgewicht")).toBe(true);
  });
  it("Hund mit Rohfaser 9 % TS → Hinweis und −5", () => {
    const r = berechne({ futter: { ...base, fa: 9 }, tier: hund }) as ErgebnisOk;
    expect(r.hinweise.some((h) => h.id === "faser")).toBe(true);
    expect(r.punkte.plaus).toBe(10);
  });
  it("Katze unkastriert mit Freigang → Spalte 100 (Protein-Min. 62,5)", () => {
    const r = berechne({
      futter: { typ: "trocken", p: 34, f: 20, fa: 2, a: 7.5, m: 8, ca: 1.2, ph: 1 },
      tier: { art: "katze", gewicht: 4, phase: "adult", aktiv: "freigang", kastriert: false },
    }) as ErgebnisOk;
    expect(r.spalte).toBe("adult100");
    expect(r.mindest.p).toBe(62.5);
    expect(r.bedarf.faktor).toBe(100);
  });
  it("Ca/P fehlt → höchstens gut", () => {
    const r = berechne({ futter: { ...base, ca: null, ph: null }, tier: hund }) as ErgebnisOk;
    expect(r.note).toBe("gut");
  });
  it("Rohasche außerhalb des Bands → −5", () => {
    const r = berechne({ futter: { ...base, a: 14 }, tier: hund }) as ErgebnisOk;
    expect(r.punkte.plaus).toBe(10);
  });
});
