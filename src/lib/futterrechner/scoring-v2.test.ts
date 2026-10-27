import { describe, expect, it } from "vitest";
import { berechne } from "./index";
import { kollagen, lin, zutatenListe } from "./naehrstoffe";
import { encodeHash } from "./hash";
import { startState } from "./state";
import { KOLLAGEN_TEXT_FREIGEGEBEN, NOTEN_SCHWELLEN } from "./fediaf";
import type { ErgebnisOk, FutterInput, TierInput } from "./types";

const HUND20: TierInput = { art: "hund", gewicht: 20, phase: "adult", alter: "adult", aktiv: "normal" };
const KATZE_W: TierInput = { art: "katze", gewicht: 4.5, phase: "adult", aktiv: "wohnung", kastriert: true };

const rechne = (futter: FutterInput, tier: TierInput) => {
  const r = berechne({ futter, tier });
  expect(r.status).toBe("ok");
  return r as ErgebnisOk;
};

const T11: FutterInput = { typ: "nass", p: 11.5, f: 2.4, fa: 0.3, a: 2.5, m: 82, ca: 0.42, ph: 0.3, taurinMgKg: 500 };
const T13: FutterInput = { typ: "nass", p: 10.5, f: 5.5, fa: 0.5, a: 2.0, m: 78 };
const T16: FutterInput = { typ: "trocken", p: 26, f: 14, fa: 2.5, a: 7, m: 10, ca: 1.3, ph: 0.95 };

/** Sollwerte aus docs/futterrechner/testfaelle.py (Referenz-Branch docs/futterrechner-scoring-v2) */
const FAELLE: Array<[string, FutterInput, TierInput, Record<string, number>, number, string, number, number, boolean]> = [
  ["T9 fettreich nass Hund", { typ: "nass", p: 10, f: 9, fa: 0.5, a: 2.3, m: 76, ca: 0.35, ph: 0.25 }, HUND20, { pf: 2, pe: 14.7, pmin: 10, fmin: 5, nfe: 5, capr: 20, plaus: 10 }, 67, "ausreichend", 0, 0, false],
  ["T10 45 % Protein, kein Deckel", { typ: "trocken", p: 45, f: 15, fa: 2.5, a: 8, m: 8, ca: 1.6, ph: 1.1 }, HUND20, { pf: 35, pe: 15, pmin: 10, fmin: 5, nfe: 5, capr: 20, plaus: 10 }, 100, "sehr gut", 0, 0, false],
  ["T11 Kollagen Stufe 1", T11, KATZE_W, { pf: 35, pe: 15, pmin: 10, fmin: 5, nfe: 10, capr: 20, taurin: 10, plaus: 7 }, 89, "gut", 8, 0, false],
  [
    "T12 wie T11 mit Sammelbegriff",
    { ...T11, zutaten: "Fleisch und tierische Nebenerzeugnisse (davon 4 % Huhn), pflanzliche Eiweißextrakte, Fisch und Fischnebenerzeugnisse, Mineralstoffe, Zucker" },
    KATZE_W, { pf: 35, pe: 15, pmin: 10, fmin: 5, nfe: 10, capr: 20, taurin: 10, plaus: 7 }, 87, "gut", 8, 2, true,
  ],
  [
    "T13 Luftröhre + Knorpel",
    { ...T13, zutaten: "Kaninchen 40 % (Fleisch, Herz, Luftröhre), Rinderknorpel, Karotte, Kartoffel, Leinöl, Mineralstoffe" },
    HUND20, { pf: 16.7, pe: 15, pmin: 10, fmin: 5, nfe: 5, plaus: 10 }, 71, "befriedigend", 0, 6, true,
  ],
  [
    "T14 Gelatine erst an Position 6",
    { ...T13, zutaten: "Huhn 60 % (Brust, Herz, Leber), Reis, Karotte, Erbsen, Leinöl, Gelatine" },
    HUND20, { pf: 16.7, pe: 15, pmin: 10, fmin: 5, nfe: 5, plaus: 10 }, 77, "befriedigend", 0, 0, true,
  ],
  ["T15 Asche 12 % TS, Ca 2,3 % TS", { typ: "trocken", p: 26, f: 12, fa: 2.5, a: 10.8, m: 10, ca: 2.07, ph: 1.25 }, HUND20, { pf: 21.5, pe: 13.8, pmin: 10, fmin: 5, nfe: 3, capr: 20, plaus: 7 }, 75, "befriedigend", 5, 0, false],
  [
    "T16 hydrolysierte Hühnerleber, Hefehydrolysat",
    { ...T16, zutaten: "Huhn getrocknet 30 %, Reis, hydrolysierte Hühnerleber 4 %, Hefehydrolysat, Hühnerfett" },
    HUND20, { pf: 15.8, pe: 12.8, pmin: 10, fmin: 5, nfe: 2.5, capr: 20, plaus: 10 }, 76, "befriedigend", 0, 0, true,
  ],
  ["T17 Feld nur Leerzeichen", { ...T16, zutaten: "   " }, HUND20, { pf: 15.8, pe: 12.8, pmin: 10, fmin: 5, nfe: 2.5, capr: 20, plaus: 10 }, 76, "befriedigend", 0, 0, false],
];

describe("Scoring v2: neue Testfälle T9–T17", () => {
  it.each(FAELLE)("%s", (_n, futter, tier, punkte, score, note, a1, a2, geprueft) => {
    const r = rechne(futter, tier);
    expect(r.punkte).toEqual(punkte);
    expect(r.score).toBe(score);
    expect(r.note).toBe(note);
    expect(r.kollagen.abzugNaehrwerte).toBe(a1);
    expect(r.kollagen.abzugZutaten).toBe(a2);
    expect(r.kollagen.zutatenGeprueft).toBe(geprueft);
    expect(r.abzug).toBe(a1 + a2);
  });

  it("T9: fettreiches Futter bekommt den Fett-Hinweis im P:F-Grund", () => {
    const r = rechne(FAELLE[0][1], HUND20);
    const g = r.gruende.find((x) => x.id === "pf")!;
    expect(g.art).toBe("bad");
    expect(g.text).toContain("fettbetont");
    expect(g.text).toContain("Hewson-Hughes et al. 2013");
    expect(r.pf).toBeCloseTo(1.11, 2);
  });
  it("T10: hohes Protein wird nie bestraft", () => {
    const r = rechne(FAELLE[1][1], HUND20);
    expect(r.note).toBe("sehr gut");
    expect(r.deckel).toEqual([]);
    expect(r.gruende.some((g) => g.id === "kollagen")).toBe(false);
  });
});

describe("Skala und Ampel unverändert", () => {
  it("Notenschwellen 90/80/70/60", () => {
    expect(NOTEN_SCHWELLEN.map(([s]) => s)).toEqual([90, 80, 70, 60]);
  });
  it("Taurin hat keinen Deckel (T11 bleibt trotz niedrigem Taurin „gut“)", () => {
    const r = rechne({ ...T11, taurinMgKg: 100 }, KATZE_W);
    expect(r.deckel).toEqual([]);
  });
});

describe("zutatenListe", () => {
  it("trennt oben an Komma und Semikolon, Klammern bleiben beim Bestandteil", () => {
    expect(zutatenListe("A (b, c; d), E; F [g, h], , G", 10)).toEqual(["A (b, c; d)", "E", "F [g, h]", "G"]);
  });
  it("verschachtelte Klammern und Begrenzung auf n", () => {
    expect(zutatenListe("A (b (c, d), e), B, C, D", 2)).toEqual(["A (b (c, d), e)", "B"]);
  });
  it("leer, nur Trenner, nur Leerzeichen", () => {
    expect(zutatenListe("", 5)).toEqual([]);
    expect(zutatenListe(" , ;; ", 5)).toEqual([]);
    expect(zutatenListe("   ", 5)).toEqual([]);
  });
});

describe("kollagen() an den Grenzen", () => {
  it("Asche TS genau 10 → 0, 12 → 3, ab 14 → 6 (bei Protein ab Schwelle)", () => {
    expect(kollagen("hund", 25, 10, null).abzugNaehrwerte).toBe(0);
    expect(kollagen("hund", 25, 10.01, null).abzugNaehrwerte).toBe(0);
    expect(kollagen("hund", 25, 12, null).abzugNaehrwerte).toBe(3);
    expect(kollagen("hund", 25, 14, null).abzugNaehrwerte).toBe(6);
    expect(kollagen("hund", 25, 20, null).abzugNaehrwerte).toBe(6);
  });
  it("Protein TS knapp unter der Schwelle → 0 (Hund 25, Katze 30)", () => {
    expect(kollagen("hund", 24.99, 14, null).abzugNaehrwerte).toBe(0);
    expect(kollagen("katze", 29.99, 14, null).abzugNaehrwerte).toBe(0);
    expect(kollagen("katze", 30, 14, null).abzugNaehrwerte).toBe(6);
  });
  it("Calcium TS über 2,0 % bringt 2 Punkte, aber nur, wenn Stufe 1 greift", () => {
    expect(kollagen("hund", 25, 12, 2.01).abzugNaehrwerte).toBe(5);
    expect(kollagen("hund", 25, 12, 2.0).abzugNaehrwerte).toBe(3);
    expect(kollagen("hund", 25, 9, 2.5).abzugNaehrwerte).toBe(0);
  });
  it("Stufe 2: starke Begriffe 4 + 2 je weiterem, höchstens 6; Sammelbegriff einmal 2", () => {
    expect(kollagen("hund", 10, 5, null, "Rinderknorpel, Wasser").abzugZutaten).toBe(4);
    expect(kollagen("hund", 10, 5, null, "Rinderknorpel, Luftröhre").abzugZutaten).toBe(6);
    expect(kollagen("hund", 10, 5, null, "Schwarte, Knorpel, Sehnen, Haut, Federn").abzugZutaten).toBe(6);
    expect(kollagen("hund", 10, 5, null, "Nebenerzeugnisse, Nebenerzeugnisse").abzugZutaten).toBe(2);
    expect(kollagen("hund", 10, 5, null, "Knorpel, Nebenerzeugnisse").abzugZutaten).toBe(6);
  });
  it("Umlaute und Wortgrenzen: Häute, Luftröhre, Haut am Wortende, „Hautpflege“ nicht", () => {
    expect(kollagen("hund", 10, 5, null, "Rinderhäute").treffer).toEqual(["Rinderhäute"]);
    expect(kollagen("hund", 10, 5, null, "Luftröhren").abzugZutaten).toBe(4);
    expect(kollagen("hund", 10, 5, null, "Hühnerhaut").abzugZutaten).toBe(4);
    expect(kollagen("hund", 10, 5, null, "Hautpflege").abzugZutaten).toBe(0);
    expect(kollagen("hund", 10, 5, null, "Federmehl").abzugZutaten).toBe(4);
    expect(kollagen("hund", 10, 5, null, "Fischhydrolysat").abzugZutaten).toBe(0);
  });
  it("hydrolysierte Tierproteine zählen schwach, Leber/Hefe/Pflanze nicht", () => {
    expect(kollagen("hund", 10, 5, null, "hydrolysierte Tierproteine").abzugZutaten).toBe(2);
    expect(kollagen("hund", 10, 5, null, "hydrolysiertes Tierprotein, Hefehydrolysat").schwach).toBe(true);
    expect(kollagen("hund", 10, 5, null, "hydrolysierte Hühnerleber").abzugZutaten).toBe(0);
    expect(kollagen("hund", 10, 5, null, "hydrolysiertes Pflanzenprotein").abzugZutaten).toBe(0);
  });
  it("nur die ersten fünf Zutaten werden geprüft", () => {
    expect(kollagen("hund", 10, 5, null, "A, B, C, D, E, Gelatine").abzugZutaten).toBe(0);
    expect(kollagen("hund", 10, 5, null, "A, B, C, D, Gelatine").abzugZutaten).toBe(4);
  });
  it("lin() und zutatenGeprueft", () => {
    expect(lin(5, 0, 10)).toBe(0.5);
    expect(lin(1, 1, 1)).toBe(1);
    expect(kollagen("hund", 1, 1, null, "  ").zutatenGeprueft).toBe(false);
    expect(kollagen("hund", 1, 1, null, null).zutatenGeprueft).toBe(false);
  });
});

describe("Wortlaut-Regel und Teilen-Link", () => {
  it("ohne Zutatenfeld deutet kein Text an, dass Zutaten geprüft wurden", () => {
    expect(KOLLAGEN_TEXT_FREIGEGEBEN).toBe(false);
    const r = rechne(T11, KATZE_W);
    const g = r.gruende.find((x) => x.id === "kollagen")!;
    expect(g.titel).toContain("nach den Nährwerten");
    expect(`${g.titel} ${g.text}`.toLowerCase()).not.toMatch(/zutat/);
    expect(r.kollagen.zutatenGeprueft).toBe(false);
  });
  it("mit Zutatenfeld: „in den ersten fünf Zutaten, die Sie eingegeben haben“ und die Treffer", () => {
    const r = rechne({ ...T13, zutaten: "Kaninchen (Luftröhre), Rinderknorpel, Karotte" }, HUND20);
    const g = r.gruende.find((x) => x.id === "kollagen")!;
    expect(g.titel).toContain("nach Ihren Zutatenangaben");
    expect(g.text).toContain("In den ersten fünf Zutaten, die Sie eingegeben haben");
    expect(g.text).toContain("Rinderknorpel");
    expect(g.text).toContain("Luftröhre");
  });
  it("Langtexte bleiben ohne Freigabe aus (kein PDCAAS im Hinweis)", () => {
    const r = rechne(T11, KATZE_W);
    expect(r.gruende.find((x) => x.id === "kollagen")!.text).not.toContain("PDCAAS");
  });
  it("Zutaten gehen nicht in den Teilen-Link", () => {
    const s = startState("hund", "nass");
    s.werte.nass.zutaten = "Rinderknorpel, Wasser";
    Object.assign(s.werte.nass, { p: 10, f: 5, fa: 0.5, a: 2, m: 78 });
    const hash = encodeHash(s);
    expect(hash).not.toMatch(/zutat|Rinderknorpel/i);
    expect(hash).toContain("p=10");
  });
  it("Zutaten ändern nur den Kollagen-Abzug", () => {
    const ohne = rechne(T13, HUND20);
    const mit = rechne({ ...T13, zutaten: "Rinderknorpel, Wasser" }, HUND20);
    expect(mit.punkte).toEqual(ohne.punkte);
    expect(mit.basis).toBe(ohne.basis);
    expect(mit.score).toBe(ohne.score - 4);
  });
  it("Leeres oder fehlendes Zutatenfeld ergibt dasselbe Ergebnis", () => {
    expect(rechne({ ...T13, zutaten: "" }, HUND20).score).toBe(rechne(T13, HUND20).score);
    expect(rechne({ ...T13, zutaten: null }, HUND20).score).toBe(rechne(T13, HUND20).score);
  });
});
