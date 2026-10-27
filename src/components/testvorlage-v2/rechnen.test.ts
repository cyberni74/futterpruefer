import { describe, expect, it } from "vitest";
import { TACHO_HINTERGRUND, ampelFuerAnteil, berechneKosten, tachoAnteil, tachoEndpunkt, tachoPfad } from "./rechnen";

describe("Tacho-Geometrie (berechnete Bögen, kein stroke-dasharray)", () => {
  it("0 Punkte: kein gefüllter Bogen", () => {
    expect(tachoPfad(0, 100)).toBeNull();
  });
  it("100 %: Endpunkt rechts am Ende des Halbkreises, Bogen bleibt ≤ 180°", () => {
    const e = tachoEndpunkt(1);
    expect(e.x).toBeCloseTo(178, 6);
    expect(e.y).toBeCloseTo(104, 6);
    expect(tachoPfad(100, 100)).toBe("M 22 104 A 78 78 0 0 1 178 104");
    expect(TACHO_HINTERGRUND).toBe("M 22 104 A 78 78 0 0 1 178 104");
  });
  it("50 %: Endpunkt oben in der Mitte", () => {
    const e = tachoEndpunkt(0.5);
    expect(e.x).toBeCloseTo(100, 6);
    expect(e.y).toBeCloseTo(26, 6);
  });
  it("entspricht der Vorlage: 92 von 100 endet bei (175.549, 84.602)", () => {
    expect(tachoPfad(92, 100)).toBe("M 22 104 A 78 78 0 0 1 175.549 84.602");
  });
  it("jeder Anteil von 0 bis 100 % liegt auf dem Kreis und oberhalb der Grundlinie", () => {
    for (let p = 1; p <= 100; p++) {
      const e = tachoEndpunkt(p / 100);
      expect(Math.hypot(e.x - 100, e.y - 104)).toBeCloseTo(78, 6);
      expect(e.y).toBeLessThanOrEqual(104 + 1e-9);
    }
  });
  it("Anteil wird auf 0 bis 1 begrenzt, ungültige Werte ergeben 0", () => {
    expect(tachoAnteil(150, 100)).toBe(1);
    expect(tachoAnteil(-5, 100)).toBe(0);
    expect(tachoAnteil(5, 0)).toBe(0);
    expect(tachoAnteil(Number.NaN, 10)).toBe(0);
  });
  it("jedes Kriterium füllt sich zu punkte/max (eigenes Maximum)", () => {
    expect(tachoEndpunkt(tachoAnteil(15, 30)).x).toBeCloseTo(100, 6);
    expect(tachoEndpunkt(tachoAnteil(10, 20)).x).toBeCloseTo(100, 6);
  });
  it("Ampel: ab 80 % grün, ab 60 % gelb, darunter rot", () => {
    expect(ampelFuerAnteil(0.8)).toBe("gut");
    expect(ampelFuerAnteil(0.79)).toBe("mittel");
    expect(ampelFuerAnteil(0.6)).toBe("mittel");
    expect(ampelFuerAnteil(0.59)).toBe("schlecht");
  });
});

describe("Kostenrechner", () => {
  it("Tagesdosis, Teilkosten, Packungen und Kaufpreis", () => {
    const k = berechneKosten({ preis: 30, dosisProKg: 0.4, koerpergewicht: 10, tage: 30, inhalt: 120 });
    expect(k.tagesdosis).toBeCloseTo(4);
    expect(k.menge).toBeCloseTo(120);
    expect(k.packungen).toBe(1);
    expect(k.teilkosten).toBeCloseTo(30);
    expect(k.kaufpreis).toBeCloseTo(30);
  });
  it("Packungen werden aufgerundet, Teilkosten rechnen anteilig", () => {
    const k = berechneKosten({ preis: 20, dosisProKg: 1, koerpergewicht: 5, tage: 30, inhalt: 100 });
    expect(k.menge).toBe(150);
    expect(k.packungen).toBe(2);
    expect(k.teilkosten).toBeCloseTo(30);
    expect(k.kaufpreis).toBe(40);
  });
  it("ohne Preis oder mit ungültigen Werten kein Betrag, keine Abstürze", () => {
    expect(berechneKosten({ preis: null, dosisProKg: 1, koerpergewicht: 5, tage: 30, inhalt: 100 }).teilkosten).toBeNull();
    const leer = berechneKosten({ preis: 5, dosisProKg: 1, koerpergewicht: 0, tage: 30, inhalt: 100 });
    expect(leer.packungen).toBe(0);
    expect(berechneKosten({ preis: 5, dosisProKg: 1, koerpergewicht: 5, tage: 30, inhalt: 0 }).kaufpreis).toBeNull();
  });
});
