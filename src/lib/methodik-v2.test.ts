import { describe, expect, it } from "vitest";
import { pickWinner } from "./compare-display";
import { ohneMethodikV1, v1Zuletzt, V1_KENNZEICHNUNG } from "./methodik-rank";
import { EMPFOHLEN_AB, METHODIK_V1_STAND, NOTEN_ANKER, noteFuerPunkte, notenwort, RATING_THRESHOLDS, RATING_THRESHOLDS_V1, showsEmpfohlen, thresholdsFor } from "./scoring";

describe("Version 2: Schwellen, Siegel, Notenschlüssel C", () => {
  it("Grenzen 68/51, Version 1 80/60, Empfohlen ab 80 unabhängig von Grün", () => {
    expect(RATING_THRESHOLDS).toEqual({ gut: 68, mittel: 51 });
    expect(RATING_THRESHOLDS_V1).toEqual({ gut: 80, mittel: 60 });
    expect(EMPFOHLEN_AB).toBe(80);
    expect(EMPFOHLEN_AB).not.toBe(RATING_THRESHOLDS.gut);
    expect(thresholdsFor("1")).toBe(RATING_THRESHOLDS_V1);
    expect(thresholdsFor("")).toBe(RATING_THRESHOLDS);
    expect(thresholdsFor(null)).toBe(RATING_THRESHOLDS);
    expect(thresholdsFor("2")).toBe(RATING_THRESHOLDS);
  });
  it("Siegel „Empfohlen“ nur ab 80 und nie bei Version-1-Tests", () => {
    expect(showsEmpfohlen(79)).toBe(false);
    expect(showsEmpfohlen(80)).toBe(true);
    expect(showsEmpfohlen(68)).toBe(false);
    expect(showsEmpfohlen(92, "1")).toBe(false);
  });
  it("Noten aus den Ankern 100/72/60/51/34/0, Ampelgrenzen fallen auf Notengrenzen", () => {
    expect(NOTEN_ANKER.map((a) => a.punkte)).toEqual([100, 72, 60, 51, 34, 0]);
    const erwartet: Record<number, number> = { 100: 0.5, 80: 1.2, 78: 1.3, 76: 1.4, 72: 1.5, 71: 1.6, 68: 1.8, 67: 1.9, 60: 2.5, 59: 2.6, 51: 3.5, 50: 3.6, 34: 4.5, 0: 5.5 };
    for (const [p, n] of Object.entries(erwartet)) expect(noteFuerPunkte(Number(p)), `${p} Punkte`).toBe(n);
    for (let p = 68; p <= 100; p++) expect(noteFuerPunkte(p)).toBeLessThanOrEqual(1.8);
    for (let p = 51; p <= 67; p++) { const n = noteFuerPunkte(p); expect(n).toBeGreaterThanOrEqual(1.9); expect(n).toBeLessThanOrEqual(3.5); }
    for (let p = 0; p <= 50; p++) expect(noteFuerPunkte(p)).toBeGreaterThanOrEqual(3.6);
    expect(notenwort(1.5)).toBe("sehr gut");
    expect(notenwort(1.8)).toBe("gut");
    expect(notenwort(2.6)).toBe("befriedigend");
    expect(notenwort(3.6)).toBe("ausreichend");
    expect(notenwort(4.6)).toBe("mangelhaft");
  });
});

describe("T3: Tests auf Methodik Version 1 nicht zwischen Version-2-Werten ranken", () => {
  it("v1Zuletzt: Version 2 in ihrer Reihenfolge, Version 1 stabil am Ende", () => {
    const rows = [{ id: "a", methodikVersion: "1" }, { id: "b", methodikVersion: "" }, { id: "c", methodikVersion: "1" }, { id: "d", methodikVersion: null }];
    expect(v1Zuletzt(rows).map((r) => r.id)).toEqual(["b", "d", "a", "c"]);
  });
  it("Filter für Listen ohne Version 1 und Kennzeichnung", () => {
    expect(ohneMethodikV1()).toEqual({ methodikVersion: { not: "1" } });
    expect(V1_KENNZEICHNUNG).toBe(`Bewertungsstand ${METHODIK_V1_STAND} · Methodik Version 1`);
    expect(V1_KENNZEICHNUNG).toBe("Bewertungsstand 27.10.2026 · Methodik Version 1");
  });
  it("kein Produktname im Code der Version-1-Logik", () => {
    for (const f of [ohneMethodikV1.toString(), v1Zuletzt.toString(), V1_KENNZEICHNUNG]) expect(f).not.toMatch(/tierliebhaber|medidog/i);
  });
});

describe("V13: Gleichstandsregel im Vergleich", () => {
  it("höchste Punktzahl gewinnt, nur ab Gelb", () => {
    expect(pickWinner([{ id: "a", totalScore: 60 }, { id: "b", totalScore: 55 }])).toBe("a");
    expect(pickWinner([{ id: "a", totalScore: 50 }, { id: "b", totalScore: 40 }])).toBeNull();
    expect(pickWinner([{ id: "a", totalScore: 51 }])).toBe("a");
  });
  it("bei Gleichstand entscheidet das Nährstoffprofil, dann der Preis je 1.000 kcal", () => {
    expect(pickWinner([{ id: "a", totalScore: 59, scoreNutrients: 16 }, { id: "b", totalScore: 59, scoreNutrients: 16 }, { id: "c", totalScore: 59, scoreNutrients: 12 }])).toBeNull();
    expect(pickWinner([{ id: "a", totalScore: 59, scoreNutrients: 16, pricePer1000kcal: 5 }, { id: "b", totalScore: 59, scoreNutrients: 16, pricePer1000kcal: 7 }, { id: "c", totalScore: 59, scoreNutrients: 12, pricePer1000kcal: 1 }])).toBe("a");
    expect(pickWinner([{ id: "a", totalScore: 59, scoreNutrients: 12 }, { id: "b", totalScore: 59, scoreNutrients: 16 }])).toBe("b");
  });
  it("Tests auf Methodik Version 1 sind nie Sieger", () => {
    expect(pickWinner([{ id: "v1", totalScore: 92, methodikVersion: "1" }, { id: "x", totalScore: 55 }])).toBe("x");
    expect(pickWinner([{ id: "v1", totalScore: 92, methodikVersion: "1" }])).toBeNull();
  });
});
