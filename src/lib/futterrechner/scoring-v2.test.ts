import { describe, expect, it } from "vitest";
import { berechne } from "./index";
import { kollagen, lin, zutatenListe } from "./naehrstoffe";
import { encodeHash } from "./hash";
import { startState } from "./state";
import { KOLLAGEN_TEXT_FREIGEGEBEN, KOLL_STUFE1_MAX, KOLL_STUFE1_MAX_GRENZE, NOTEN_SCHWELLEN } from "./fediaf";
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

/** Sollwerte im Auslieferungszustand (Abzug und Untergrenze aus), A5 Rechtsprüfung 27.10.2026. Alle Konfigurationen: testfaelle.test.ts */
const FAELLE: Array<[string, FutterInput, TierInput, Record<string, number>, number, string, number, number, boolean]> = [
  ["T9 fettreich nass Hund", { typ: "nass", p: 10, f: 9, fa: 0.5, a: 2.3, m: 76, ca: 0.35, ph: 0.25 }, HUND20, { pf: 2, pe: 14.7, pmin: 10, fmin: 5, nfe: 5, capr: 20, plaus: 10 }, 67, "ausreichend", 0, 0, false],
  ["T10 45 % Protein, kein Deckel", { typ: "trocken", p: 45, f: 15, fa: 2.5, a: 8, m: 8, ca: 1.6, ph: 1.1 }, HUND20, { pf: 35, pe: 15, pmin: 10, fmin: 5, nfe: 5, capr: 20, plaus: 10 }, 100, "sehr gut", 0, 0, false],
  ["T11 Kollagen Stufe 1", T11, KATZE_W, { pf: 35, pe: 15, pmin: 10, fmin: 5, nfe: 10, capr: 20, taurin: 10, plaus: 7 }, 97, "sehr gut", 0, 0, false],
  [
    "T12 wie T11 mit Sammelbegriff",
    { ...T11, zutaten: "Fleisch und tierische Nebenerzeugnisse (davon 4 % Huhn), pflanzliche Eiweißextrakte, Fisch und Fischnebenerzeugnisse, Mineralstoffe, Zucker" },
    KATZE_W, { pf: 35, pe: 15, pmin: 10, fmin: 5, nfe: 10, capr: 20, taurin: 10, plaus: 7 }, 97, "sehr gut", 0, 0, true,
  ],
  [
    "T13 Luftröhre + Knorpel",
    { ...T13, zutaten: "Kaninchen 40 % (Fleisch, Herz, Luftröhre), Rinderknorpel, Karotte, Kartoffel, Leinöl, Mineralstoffe" },
    HUND20, { pf: 16.7, pe: 15, pmin: 10, fmin: 5, nfe: 5, plaus: 10 }, 77, "befriedigend", 0, 0, true,
  ],
  [
    "T14 Gelatine erst an Position 6",
    { ...T13, zutaten: "Huhn 60 % (Brust, Herz, Leber), Reis, Karotte, Erbsen, Leinöl, Gelatine" },
    HUND20, { pf: 16.7, pe: 15, pmin: 10, fmin: 5, nfe: 5, plaus: 10 }, 77, "befriedigend", 0, 0, true,
  ],
  ["T15 Asche 12 % TS, Ca 2,3 % TS", { typ: "trocken", p: 26, f: 12, fa: 2.5, a: 10.8, m: 10, ca: 2.07, ph: 1.25 }, HUND20, { pf: 21.5, pe: 13.8, pmin: 10, fmin: 5, nfe: 3, capr: 20, plaus: 7 }, 80, "gut", 0, 0, false],
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

  it("T9: fettreiches Futter bekommt keinen Zusatzsatz „fettbetont“ im P:F-Grund (A6, Klärung offen)", () => {
    const r = rechne(FAELLE[0][1], HUND20);
    const g = r.gruende.find((x) => x.id === "pf")!;
    expect(g.art).toBe("bad");
    expect(g.text).not.toContain("fettbetont");
    expect(g.text).not.toContain("Hewson-Hughes");
    expect(g.text).not.toContain("schmackhaft");
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

const K3 = (art: "hund" | "katze", p: number, a: number, ca: number | null, z?: string | null) => kollagen(art, p, a, ca, z, true, 3);
const KZ = (z: string) => kollagen("hund", 10, 5, null, z, true);

describe("kollagen() an den Grenzen (A5)", () => {
  it("Stufe 1 bei Asche TS über 10 und Protein ab Schwelle; Abzug nur mit Schalter und Stufe1Max", () => {
    expect(K3("hund", 25, 10, null).stufe1).toBe(false);
    expect(K3("hund", 25, 10.01, null).stufe1).toBe(true);
    expect(K3("hund", 25, 10, null).abzugNaehrwerte).toBe(0);
    expect(K3("hund", 25, 10.01, null).abzugNaehrwerte).toBe(0);
    expect(K3("hund", 25, 12, null).abzugNaehrwerte).toBe(2);
    expect(K3("hund", 25, 14, null).abzugNaehrwerte).toBe(3);
    expect(K3("hund", 25, 20, null).abzugNaehrwerte).toBe(3);
    expect(kollagen("hund", 25, 14, null, null, true, 0).abzugNaehrwerte).toBe(0);
    expect(kollagen("hund", 25, 14, null, null, false, 3).abzugNaehrwerte).toBe(0);
  });
  it("Auslieferungszustand: Stufe 1 gibt den Hinweis, aber keinen Abzug", () => {
    const k = kollagen("hund", 25, 14, null);
    expect(k).toMatchObject({ stufe1: true, abzugNaehrwerte: 0, abzugZutaten: 0, flag: true });
  });
  it("Protein TS knapp unter der Schwelle → keine Stufe 1 (Hund 25, Katze 30)", () => {
    expect(K3("hund", 24.99, 14, null).stufe1).toBe(false);
    expect(K3("katze", 29.99, 14, null).stufe1).toBe(false);
    expect(K3("katze", 30, 14, null).stufe1).toBe(true);
    expect(K3("katze", 30, 14, null).abzugNaehrwerte).toBe(3);
  });
  it("Calcium TS bringt keinen Zusatzabzug mehr (A5(a))", () => {
    expect(K3("hund", 25, 12, 2.01).abzugNaehrwerte).toBe(2);
    expect(K3("hund", 25, 12, 2.0).abzugNaehrwerte).toBe(2);
    expect(K3("hund", 25, 9, 2.5).abzugNaehrwerte).toBe(0);
  });
  it("Stufe1Max gilt nur von 0 bis 3; 4 wirft einen Fehler", () => {
    expect(KOLL_STUFE1_MAX).toBeGreaterThanOrEqual(0);
    expect(KOLL_STUFE1_MAX).toBeLessThanOrEqual(KOLL_STUFE1_MAX_GRENZE);
    expect(KOLL_STUFE1_MAX_GRENZE).toBe(3);
    expect(() => kollagen("hund", 25, 14, null, null, true, 4)).toThrow();
    expect(() => kollagen("hund", 25, 14, null, null, true, -1)).toThrow();
    expect(() => kollagen("hund", 25, 14, null, null, true, 3)).not.toThrow();
  });
  it("Stufe 2: starke Begriffe 4 + 2 je weiterem, höchstens 6; Sammelbegriffe nie Abzug", () => {
    expect(KZ("Rinderknorpel, Wasser").abzugZutaten).toBe(4);
    expect(KZ("Rinderknorpel, Luftröhre").abzugZutaten).toBe(6);
    expect(KZ("Schwarte, Knorpel, Sehnen, Haut, Federn").abzugZutaten).toBe(6);
    expect(KZ("Nebenerzeugnisse, Nebenerzeugnisse").abzugZutaten).toBe(0);
    expect(KZ("Knorpel, Nebenerzeugnisse").abzugZutaten).toBe(4);
    expect(KZ("Knorpel, Nebenerzeugnisse").trefferStark).toEqual(["Knorpel"]);
    expect(KZ("Knorpel, Nebenerzeugnisse").trefferSchwach).toEqual(["Nebenerzeugnisse"]);
    expect(kollagen("hund", 10, 5, null, "Rinderknorpel, Luftröhre").abzugZutaten).toBe(0);
  });
  it("Umlaute und Wortgrenzen: Häute, Luftröhre, Haut am Wortende, „Hautpflege“ nicht", () => {
    expect(KZ("Rinderhäute").treffer).toEqual(["Rinderhäute"]);
    expect(KZ("Luftröhren").abzugZutaten).toBe(4);
    expect(KZ("Hühnerhaut").abzugZutaten).toBe(4);
    expect(KZ("Hautpflege").flag).toBe(false);
    expect(KZ("Federmehl").abzugZutaten).toBe(4);
    expect(KZ("Fischhydrolysat").flag).toBe(false);
  });
  it("hydrolysierte Tierproteine zählen als Sammelbegriff, Leber/Hefe/Pflanze nicht", () => {
    expect(KZ("hydrolysierte Tierproteine")).toMatchObject({ abzugZutaten: 0, flag: true, trefferStark: [] });
    expect(KZ("hydrolysiertes Tierprotein, Hefehydrolysat").trefferSchwach.length).toBe(1);
    expect(KZ("hydrolysierte Hühnerleber").flag).toBe(false);
    expect(KZ("hydrolysiertes Pflanzenprotein").flag).toBe(false);
  });
  it("nur die ersten fünf Zutaten werden geprüft", () => {
    expect(KZ("A, B, C, D, E, Gelatine").flag).toBe(false);
    expect(KZ("A, B, C, D, Gelatine").abzugZutaten).toBe(4);
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
    expect(KOLLAGEN_TEXT_FREIGEGEBEN).toBe(true);
    const r = rechne(T11, KATZE_W);
    const g = r.gruende.find((x) => x.id === "kollagen")!;
    expect(g.titel).toBe("Hinweis zur Proteinqualität (nach den Nährwerten)");
    expect(`${g.titel} ${g.text}`).not.toMatch(/Zutaten, die Sie eingegeben|Zutatenangaben|in den ersten fünf Zutaten/);
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
  it("alte Langtexte kommen nirgends vor (kein „PDCAAS) von null“, kein „83 %“ mit Kollagen)", () => {
    const texte = [
      rechne(T11, KATZE_W),
      rechne({ ...T13, zutaten: "Knochenmehl, Rinderknorpel, Nebenerzeugnisse" }, HUND20),
    ].map((r) => r.gruende.find((x) => x.id === "kollagen")!.text).join(" ");
    expect(texte).not.toContain("PDCAAS");
    expect(texte).not.toMatch(/83 %/);
    expect(texte).not.toContain("Diese Kombination entsteht oft");
    expect(texte).not.toContain("Tierische Mehle aus Schlachtnebenprodukten");
  });
  it("Zutaten gehen nicht in den Teilen-Link", () => {
    const s = startState("hund", "nass");
    s.werte.nass.zutaten = "Rinderknorpel, Wasser";
    Object.assign(s.werte.nass, { p: 10, f: 5, fa: 0.5, a: 2, m: 78 });
    const hash = encodeHash(s);
    expect(hash).not.toMatch(/zutat|Rinderknorpel/i);
    expect(hash).toContain("p=10");
  });
  it("Zutaten ändern nur den Kollagen-Abzug (und der gilt nur bei aktivem Schalter)", () => {
    const ohne = rechne(T13, HUND20);
    const mit = rechne({ ...T13, zutaten: "Rinderknorpel, Wasser" }, HUND20);
    expect(mit.punkte).toEqual(ohne.punkte);
    expect(mit.basis).toBe(ohne.basis);
    expect(mit.score).toBe(ohne.score);
    const an = berechne({ futter: { ...T13, zutaten: "Rinderknorpel, Wasser" }, tier: HUND20 }, { abzugAktiv: true }) as ErgebnisOk;
    expect(an.score).toBe(ohne.score - 4);
  });
  it("Leeres oder fehlendes Zutatenfeld ergibt dasselbe Ergebnis", () => {
    expect(rechne({ ...T13, zutaten: "" }, HUND20).score).toBe(rechne(T13, HUND20).score);
    expect(rechne({ ...T13, zutaten: null }, HUND20).score).toBe(rechne(T13, HUND20).score);
  });
});
