import { describe, expect, it } from "vitest";
import { caRegel } from "./fediaf";
import { berechne } from "./index";
import { mengenRisiko, risikenFuer, RISIKEN, QUELLEN, type RisikoAuswahl } from "./risiken";
import type { ErgebnisOk, FutterInput, Spalte, TierInput } from "./types";

type Daten = Parameters<typeof risikenFuer>[0];
const futterH: FutterInput = { typ: "trocken", p: 25, f: 14, fa: 2.5, a: 7, m: 10 };
const futterNass: FutterInput = { typ: "nass", p: 11, f: 5.5, fa: 0.4, a: 2, m: 80, taurinMgKg: 1000 };
const hundAdult: TierInput = { art: "hund", gewicht: 20, phase: "adult", alter: "adult", aktiv: "normal" };
const hundWenig: TierInput = { art: "hund", gewicht: 20, phase: "adult", alter: "adult", aktiv: "wenig" };
const welpe: TierInput = { art: "hund", gewicht: 12, phase: "welpe", wochen: 17, endgewicht: 30 };
const katze: TierInput = { art: "katze", gewicht: 4, phase: "adult", aktiv: "wohnung", kastriert: true };
const kitten: TierInput = { art: "katze", gewicht: 2.5, phase: "kitten", monate: 5 };

const basis = (spalte: Spalte): Daten => ({ spalte, rp: 1.5, rf: 2, capr: null, taurin: null, aTs: 7, faTs: 3, feuchte: 10 });
const ids = (r: RisikoAuswahl, g: keyof RisikoAuswahl) => (r[g] ?? []).map((t) => t.id);
const arts = (r: RisikoAuswahl, g: keyof RisikoAuswahl) => (r[g] ?? []).map((t) => t.art);

/** Calcium/Phosphor-Block mit den FEDIAF-Regeln der Spalte. */
function mitCa(art: "hund" | "katze", spalte: Spalte, ratio: number, caTs: number, pTs: number, endgewicht: number | null = 30): Daten {
  return { ...basis(spalte), capr: { ratio, caTs, pTs, regel: caRegel(art, spalte, endgewicht, 20) } };
}

describe("Risiko-Texte", () => {
  it("29 Texte mit Risiko, Lösung und Quelle; 16 Quellen mit URL", () => {
    expect(Object.keys(RISIKEN)).toHaveLength(29);
    for (const r of Object.values(RISIKEN)) {
      expect(r.risiko.length).toBeGreaterThan(40);
      expect(r.loesung.length).toBeGreaterThan(0);
      expect(r.quellen.length).toBeGreaterThan(0);
      for (const q of r.quellen) expect(QUELLEN[q.id].url).toMatch(/^https?:\/\//);
    }
    expect(Object.keys(QUELLEN)).toHaveLength(16);
  });
  it("Texte wortgleich: Kealy (A2) und Taurin (A1)", () => {
    expect(RISIKEN["R-MENGE-HUND"].risiko).toContain("48 Labrador Retrievern");
    expect(RISIKEN["R-MENGE-HUND"].risiko).toContain("im Median 1,8 Jahre länger (13,0 statt 11,2 Jahre)");
    expect(RISIKEN["R-T-KATZE"].risiko).toContain("ein Wert unter dem Mindestwert heißt deshalb nicht sicher");
    expect(RISIKEN["R-T-KATZE-NASS"].risiko).toContain("zwei- bis zweieinhalbmal so hoch");
  });
  it("Lösungstexte verlinken nur eigene Seiten", () => {
    for (const r of Object.values(RISIKEN)) for (const t of r.loesung) if (typeof t !== "string") expect(t.href).toMatch(/^\/[a-z-]/);
  });
});

describe("Trigger Protein und Fett an der Schwelle", () => {
  const faelle: Array<[string, Spalte, "hund" | "katze", string]> = [
    ["R-P-HUND-ADULT", "adult110", "hund", "R-P-HUND-ADULT"],
    ["R-P-HUND-GERING", "adult95", "hund", "R-P-HUND-GERING"],
    ["R-P-WELPE", "wachstum_frueh", "hund", "R-P-WELPE"],
    ["R-P-WELPE", "wachstum_spaet", "hund", "R-P-WELPE"],
    ["R-P-KATZE-ADULT", "adult100", "katze", "R-P-KATZE-ADULT"],
    ["R-P-KATZE-ADULT", "adult75", "katze", "R-P-KATZE-ADULT"],
    ["R-P-KITTEN", "wachstum", "katze", "R-P-KITTEN"],
  ];
  const tier = (art: "hund" | "katze", spalte: Spalte): TierInput =>
    art === "hund" ? (spalte.startsWith("wachstum") ? welpe : hundAdult) : spalte === "wachstum" ? kitten : katze;
  it.each(faelle)("%s bei %s", (id, spalte, art) => {
    const t = { futter: futterH, tier: tier(art, spalte) };
    expect(ids(risikenFuer({ ...basis(spalte), rp: 1 }, t), "protein")).toEqual([]);
    expect(ids(risikenFuer({ ...basis(spalte), rp: 0.9999 }, t), "protein")).toEqual([id]);
    expect(arts(risikenFuer({ ...basis(spalte), rp: 0.9 }, t), "protein")).toEqual(["warn"]);
    expect(arts(risikenFuer({ ...basis(spalte), rp: 0.8999 }, t), "protein")).toEqual(["bad"]);
  });
  it.each([
    ["R-F-HUND", "adult110", hundAdult],
    ["R-F-HUND", "adult95", hundWenig],
    ["R-F-WELPE", "wachstum_spaet", welpe],
    ["R-F-KATZE", "adult75", katze],
    ["R-F-KATZE", "wachstum", kitten],
  ] as Array<[string, Spalte, TierInput]>)("%s bei %s", (id, spalte, tier) => {
    const t = { futter: futterH, tier };
    expect(ids(risikenFuer({ ...basis(spalte), rf: 1 }, t), "fett")).toEqual([]);
    expect(ids(risikenFuer({ ...basis(spalte), rf: 0.9999 }, t), "fett")).toEqual([id]);
    expect(arts(risikenFuer({ ...basis(spalte), rf: 0.9 }, t), "fett")).toEqual(["warn"]);
    expect(arts(risikenFuer({ ...basis(spalte), rf: 0.89 }, t), "fett")).toEqual(["bad"]);
  });
  it("zu viel Protein oder Fett löst nichts aus", () => {
    expect(risikenFuer({ ...basis("adult110"), rp: 5, rf: 5 }, { futter: futterH, tier: hundAdult })).toEqual({});
  });
});

describe("Trigger Taurin", () => {
  const e = (ts: number, min: number, feuchte: number): Daten => ({ ...basis("adult75"), taurin: { ts, min }, feuchte });
  it("R-T-KATZE (Trockenfutter) an der Schwelle", () => {
    const t = { futter: { ...futterH, taurinMgKg: 1000 }, tier: katze };
    expect(ids(risikenFuer(e(0.13, 0.13, 8), t), "taurin")).toEqual([]);
    expect(ids(risikenFuer(e(0.1299, 0.13, 8), t), "taurin")).toEqual(["R-T-KATZE"]);
    expect(arts(risikenFuer(e(0.1299, 0.13, 8), t), "taurin")).toEqual(["bad"]);
  });
  it("R-T-KATZE-NASS", () => {
    const t = { futter: futterNass, tier: katze };
    expect(ids(risikenFuer(e(0.27, 0.27, 80), t), "taurin")).toEqual([]);
    expect(ids(risikenFuer(e(0.2699, 0.27, 80), t), "taurin")).toEqual(["R-T-KATZE-NASS"]);
  });
  it("ohne Taurin-Angabe keine Box", () => {
    expect(ids(risikenFuer(e(0.01, 0.13, 8), { futter: futterH, tier: katze }), "taurin")).toEqual([]);
  });
});

describe("Trigger Calcium und Phosphor (Priorität, höchstens 2)", () => {
  const th = { futter: futterH, tier: hundAdult };
  const tw = { futter: futterH, tier: welpe };
  const tk = { futter: futterH, tier: katze };
  const tkit = { futter: futterH, tier: kitten };
  it("R-CA-HOCH-HUND und R-CA-HOCH-WELPE an der Obergrenze", () => {
    expect(ids(risikenFuer(mitCa("hund", "adult110", 1.4, 2.5, 1.2), th), "ca")).toEqual([]);
    expect(ids(risikenFuer(mitCa("hund", "adult110", 1.4, 2.51, 1.2), th), "ca")).toEqual(["R-CA-HOCH-HUND"]);
    expect(arts(risikenFuer(mitCa("hund", "adult110", 1.4, 2.51, 1.2), th), "ca")).toEqual(["bad"]);
    expect(ids(risikenFuer(mitCa("hund", "wachstum_spaet", 1.4, 1.8, 1.3), tw), "ca")).toEqual([]);
    expect(ids(risikenFuer(mitCa("hund", "wachstum_spaet", 1.4, 1.81, 1.3), tw), "ca")).toEqual(["R-CA-HOCH-WELPE"]);
  });
  it("R-CA-NIEDRIG-WELPE, -HUND, -KATZE an der Untergrenze", () => {
    expect(ids(risikenFuer(mitCa("hund", "wachstum_spaet", 1.3, 1.0, 0.8), tw), "ca")).toEqual([]);
    expect(ids(risikenFuer(mitCa("hund", "wachstum_spaet", 1.3, 0.99, 0.8), tw), "ca")).toEqual(["R-CA-NIEDRIG-WELPE"]);
    expect(ids(risikenFuer(mitCa("hund", "adult110", 1.4, 0.5, 0.4), th), "ca")).toEqual([]);
    expect(ids(risikenFuer(mitCa("hund", "adult110", 1.4, 0.49, 0.4), th), "ca")).toEqual(["R-CA-NIEDRIG-HUND"]);
    expect(arts(risikenFuer(mitCa("hund", "adult110", 1.4, 0.49, 0.4), th), "ca")).toEqual(["warn"]);
    expect(ids(risikenFuer(mitCa("katze", "adult75", 1.4, 0.53, 0.4), tk), "ca")).toEqual([]);
    expect(ids(risikenFuer(mitCa("katze", "adult75", 1.4, 0.52, 0.4), tk), "ca")).toEqual(["R-CA-NIEDRIG-KATZE"]);
    expect(arts(risikenFuer(mitCa("katze", "wachstum", 1.2, 0.9, 0.84), tkit), "ca")).toEqual(["bad"]);
  });
  it("R-CAP-NIEDRIG-* bei Verhältnis unter 1 : 1 (gelb nahe, rot weit)", () => {
    expect(ids(risikenFuer(mitCa("hund", "wachstum_spaet", 1, 1.2, 1.2), tw), "ca")).toEqual([]);
    expect(ids(risikenFuer(mitCa("hund", "wachstum_spaet", 0.95, 1.2, 1.2), tw), "ca")).toEqual(["R-CAP-NIEDRIG-WELPE"]);
    expect(arts(risikenFuer(mitCa("hund", "wachstum_spaet", 0.95, 1.2, 1.2), tw), "ca")).toEqual(["warn"]);
    expect(arts(risikenFuer(mitCa("hund", "wachstum_spaet", 0.8, 1.2, 1.2), tw), "ca")).toEqual(["bad"]);
    expect(ids(risikenFuer(mitCa("hund", "adult110", 0.95, 1, 1), th), "ca")).toEqual(["R-CAP-NIEDRIG-HUND"]);
    expect(ids(risikenFuer(mitCa("katze", "adult75", 0.95, 1, 1), tk), "ca")).toEqual(["R-CAP-NIEDRIG-KATZE"]);
  });
  it("R-CAP-HOCH-WELPE und R-CAP-HOCH bei Verhältnis über dem Maximum", () => {
    expect(ids(risikenFuer(mitCa("hund", "wachstum_spaet", 1.6, 1.4, 0.9), tw), "ca")).toEqual([]);
    expect(ids(risikenFuer(mitCa("hund", "wachstum_spaet", 1.65, 1.4, 0.9), tw), "ca")).toEqual(["R-CAP-HOCH-WELPE"]);
    expect(arts(risikenFuer(mitCa("hund", "wachstum_spaet", 1.65, 1.4, 0.9), tw), "ca")).toEqual(["warn"]);
    expect(ids(risikenFuer(mitCa("hund", "adult110", 2.05, 1.5, 0.8), th), "ca")).toEqual(["R-CAP-HOCH"]);
    expect(ids(risikenFuer(mitCa("katze", "adult75", 2.05, 0.6, 0.35), tk), "ca")).toEqual(["R-CAP-HOCH"]);
    expect(ids(risikenFuer(mitCa("katze", "wachstum", 1.6, 1.2, 0.84), tkit), "ca")).toEqual(["R-CAP-HOCH"]);
    expect(arts(risikenFuer(mitCa("hund", "adult110", 3, 1.5, 0.5), th), "ca")).toEqual(["bad"]);
  });
  it("R-PH-NIEDRIG und R-PH-HOCH-HUND an den Grenzen", () => {
    expect(ids(risikenFuer(mitCa("hund", "adult110", 1.4, 1, 0.4), th), "ca")).toEqual([]);
    expect(ids(risikenFuer(mitCa("hund", "adult110", 1.4, 1, 0.39), th), "ca")).toEqual(["R-PH-NIEDRIG"]);
    expect(arts(risikenFuer(mitCa("hund", "adult110", 1.4, 1, 0.39), th), "ca")).toEqual(["warn"]);
    expect(arts(risikenFuer(mitCa("hund", "wachstum_spaet", 1.3, 1.2, 0.69), tw), "ca")).toEqual(["bad"]);
    expect(ids(risikenFuer(mitCa("hund", "adult110", 1.4, 1.2, 1.6), th), "ca")).toEqual([]);
    expect(ids(risikenFuer(mitCa("hund", "adult110", 1.4, 1.2, 1.61), th), "ca")).toEqual(["R-PH-HOCH-HUND"]);
    expect(arts(risikenFuer(mitCa("hund", "adult110", 1.4, 1.2, 1.61), th), "ca")).toEqual(["warn"]);
  });
  it("Priorität: Ca hoch vor Ca niedrig vor Ca:P vor P, höchstens 2 Boxen", () => {
    const r = risikenFuer(mitCa("hund", "adult110", 3, 2.6, 0.2), th);
    expect(ids(r, "ca")).toEqual(["R-CA-HOCH-HUND", "R-CAP-HOCH"]);
    const r2 = risikenFuer(mitCa("hund", "adult110", 0.7, 0.3, 0.3), th);
    expect(ids(r2, "ca")).toEqual(["R-CA-NIEDRIG-HUND", "R-CAP-NIEDRIG-HUND"]);
  });
  it("ohne Ca/P keine Box", () => {
    expect(ids(risikenFuer(basis("adult110"), th), "ca")).toEqual([]);
  });
});

describe("Trigger Rohasche, Rohfaser, Menge", () => {
  const th = { futter: futterH, tier: hundAdult };
  it("R-ASCHE-HOCH / R-ASCHE-NIEDRIG an der Bandgrenze", () => {
    expect(ids(risikenFuer({ ...basis("adult110"), aTs: 12 }, th), "asche")).toEqual([]);
    expect(ids(risikenFuer({ ...basis("adult110"), aTs: 12.01 }, th), "asche")).toEqual(["R-ASCHE-HOCH"]);
    expect(ids(risikenFuer({ ...basis("adult110"), aTs: 3 }, th), "asche")).toEqual([]);
    expect(ids(risikenFuer({ ...basis("adult110"), aTs: 2.99 }, th), "asche")).toEqual(["R-ASCHE-NIEDRIG"]);
    expect(arts(risikenFuer({ ...basis("adult110"), aTs: 2.99 }, th), "asche")).toEqual(["warn"]);
  });
  it("R-FASER-HUND nur beim Hund über 8 % TS", () => {
    expect(ids(risikenFuer({ ...basis("adult110"), faTs: 8 }, th), "faser")).toEqual([]);
    expect(ids(risikenFuer({ ...basis("adult110"), faTs: 8.01 }, th), "faser")).toEqual(["R-FASER-HUND"]);
    expect(ids(risikenFuer({ ...basis("adult75"), faTs: 9 }, { futter: futterH, tier: katze }), "faser")).toEqual([]);
  });
  it("Mengen-Boxen je Tier, Leckerli im Ergänzungsfutter-Modus", () => {
    expect(mengenRisiko({ menge: 281 }, { tier: hundAdult })).toBe("R-MENGE-HUND");
    expect(mengenRisiko({ menge: 336 }, { tier: welpe })).toBe("R-MENGE-WELPE");
    expect(mengenRisiko({ menge: null }, { tier: welpe })).toBe("R-MENGE-WELPE");
    expect(mengenRisiko({ menge: 85 }, { tier: kitten })).toBe("R-MENGE-KATZE");
    expect(mengenRisiko({ menge: 215 }, { tier: katze })).toBe("R-MENGE-KATZE");
    const r = berechne({ futter: { ...futterH, m: 18 }, tier: katze, ergaenzung: true });
    expect(r.status === "ergaenzung" && r.leckerliRisiko).toBe("R-LECKERLI");
  });
});

describe("Einbindung in bewerte()", () => {
  it("Snapshot T1: keine Risiko-Box, nur die Mengen-Box", () => {
    const r = berechne({ futter: { ...futterH, ca: 1.3, ph: 0.95 }, tier: hundAdult }) as ErgebnisOk;
    expect(r.gruende.filter((g) => g.risiken?.length)).toEqual([]);
    expect(r.mengeRisiko).toBe("R-MENGE-HUND");
  });
  it("Snapshot Welpe mit Calcium 2,0 % TS: R-CA-HOCH-WELPE, Grund rot", () => {
    const r = berechne({ futter: { typ: "trocken", p: 28, f: 17, fa: 2.5, a: 7.5, m: 10, ca: 1.8, ph: 1.0 }, tier: welpe }) as ErgebnisOk;
    const ca = r.gruende.find((g) => g.id === "ca")!;
    expect(ca.art).toBe("bad");
    expect(ca.risiken?.[0]).toBe("R-CA-HOCH-WELPE");
    expect(r.deckel).toContain("mangelhaft");
    expect(r.mengeRisiko).toBe("R-MENGE-WELPE");
  });
  it("T7: Protein knapp (gelb) und Calcium über Höchstwert (rot) tragen Risiken", () => {
    const r = berechne({
      futter: { typ: "trocken", p: 15, f: 4.5, fa: 4, a: 9.5, m: 10, ca: 2.4, ph: 0.8 },
      tier: { art: "hund", gewicht: 15, phase: "adult", alter: "adult", aktiv: "wenig" },
    }) as ErgebnisOk;
    const p = r.gruende.find((g) => g.id === "protein")!;
    expect(p.risiken).toEqual(["R-P-HUND-GERING"]);
    expect(p.risikoStufen).toEqual(["warn"]);
    const ca = r.gruende.find((g) => g.id === "ca")!;
    expect(ca.risiken).toContain("R-CA-HOCH-HUND");
    expect(ca.art).toBe("bad");
  });
  it("Ca:P zu niedrig bekommt den passenden Text (Korrektur Abschnitt 6.1)", () => {
    const r = berechne({ futter: { ...futterH, ca: 0.9, ph: 1.0 }, tier: hundAdult }) as ErgebnisOk;
    const ca = r.gruende.find((g) => g.id === "ca")!;
    expect(ca.text).toContain("mindestens 1,0 : 1");
    expect(ca.text).not.toContain("höchstens");
  });
  it("Calcium unter Minimum und Phosphor außerhalb haben eigene Texte (6.2)", () => {
    const niedrig = berechne({ futter: { ...futterH, ca: 0.3, ph: 0.25 }, tier: hundAdult }) as ErgebnisOk;
    expect(niedrig.gruende.find((g) => g.id === "ca")!.titel).toBe("Calcium");
    const ph = berechne({ futter: { ...futterH, ca: 0.5, ph: 0.3 }, tier: hundAdult }) as ErgebnisOk;
    expect(ph.gruende.find((g) => g.id === "ca")!.titel).toBe("Phosphor");
  });
});
