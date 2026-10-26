import { describe, expect, it } from "vitest";
import { decodeHash, encodeHash } from "./hash";
import { startState } from "./state";
import { alterAusPosition, lebensphase, positionAusAlter } from "./state";
import { parseZahl, pruefe } from "./validierung";

describe("Teilen-Link (#-Fragment)", () => {
  it("Roundtrip erhält alle Werte", () => {
    const s = startState("hund", "trocken");
    Object.assign(s.werte.trocken, { p: 25, f: 14, fa: 2.5, a: 7, m: 10, ca: 1.3, ph: 0.95 });
    Object.assign(s, { gewicht: 20, alterPos: 60, hundAktiv: "normal", kastriert: false, endgewicht: 30 });
    const back = decodeHash(encodeHash(s));
    expect(back).toEqual(s);
  });
  it("manipulierte Werte werden verworfen", () => {
    const s = decodeHash("v=1&t=hund&ft=trocken&p=abc&f=999&kg=-5&al=9999&ak=hacker")!;
    expect(s.werte.trocken.p).toBeNull();
    expect(s.werte.trocken.f).toBeNull();
    expect(s.gewicht).toBeNull();
    expect(s.alterPos).toBeNull();
    expect(s.hundAktiv).toBeNull();
  });
  it("unbekannte Version und kaputte Art → null", () => {
    expect(decodeHash("v=2&t=hund")).toBeNull();
    expect(decodeHash("v=1&t=pferd")).toBeNull();
  });
  it("Deep-Link der Startseite #typ=nass", () => {
    expect(decodeHash("typ=nass", "katze")?.futterart).toBe("nass");
    expect(decodeHash("typ=nass", "katze")?.art).toBe("katze");
    expect(decodeHash("")).toBeNull();
  });
});

describe("Alter und Validierung", () => {
  it("Altersregler Hund: Wochen, dann Jahre", () => {
    expect(alterAusPosition("hund", 0)).toEqual({ wert: 8, einheit: "wochen" });
    expect(alterAusPosition("hund", 44)).toEqual({ wert: 52, einheit: "wochen" });
    expect(alterAusPosition("hund", 45)).toEqual({ wert: 1, einheit: "jahre" });
    expect(lebensphase("hund", { wert: 2, einheit: "jahre" })).toBe("jung");
    expect(lebensphase("hund", { wert: 8, einheit: "jahre" })).toBe("senior");
    expect(positionAusAlter("hund", { wert: 17, einheit: "wochen" })).toBe(9);
  });
  it("Altersregler Katze: Monate, dann Jahre", () => {
    expect(lebensphase("katze", alterAusPosition("katze", 3))).toBe("kitten");
    expect(lebensphase("katze", alterAusPosition("katze", 11))).toBe("adult");
    expect(lebensphase("katze", { wert: 12, einheit: "jahre" })).toBe("senior");
  });
  it("parseZahl: Komma und Punkt", () => {
    expect(parseZahl("2,5")).toBe(2.5);
    expect(parseZahl("2.5")).toBe(2.5);
    expect(parseZahl("")).toBeNull();
    expect(parseZahl("abc")).toBeNaN();
  });
  it("fehlende Pflichtwerte → kein Ergebnis", () => {
    const p = pruefe(startState("hund", "trocken"));
    expect(p.eingabe).toBeNull();
    expect(p.fehlend).toContain("Rohprotein");
  });
  it("Nassfutter ohne Feuchte → Pflichtfeld-Fehler", () => {
    const s = startState("hund", "nass");
    expect(pruefe(s).fehler.m).toBeDefined();
  });
  it("Summe über 102 % → Fehler an der Summe", () => {
    const s = startState("hund", "trocken");
    Object.assign(s.werte.trocken, { p: 40, f: 30, fa: 10, a: 12, m: 11 });
    expect(pruefe(s).fehler.summe).toBeDefined();
  });
  it("vollständige Eingabe ergibt Eingabe-Objekt", () => {
    const s = startState("hund", "trocken");
    Object.assign(s.werte.trocken, { p: 25, f: 14, fa: 2.5, a: 7, m: 10 });
    Object.assign(s, { gewicht: 20, alterPos: 49, hundAktiv: "normal" });
    expect(pruefe(s).eingabe?.tier).toMatchObject({ art: "hund", phase: "adult", alter: "adult" });
  });
});
