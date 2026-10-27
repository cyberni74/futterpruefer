import { afterEach, describe, expect, it, vi } from "vitest";
import { beispielDaten } from "./fixtures";
import {
  AMAZON_TAG, TESTVORLAGE_V2, baueAbschnitte, faqItems, kaufLink, parseLayoutData, pruefeSumme, pruefeVorVeroeffentlichung, resolveLayout, sperrwoerter, summeKriterien, type LayoutData,
} from "./schema";

const gueltig = (n: 5 | 6 = 5) => {
  const { data, totalScore } = beispielDaten(n);
  return { data: parseLayoutData(data).ok ? (parseLayoutData(data) as { ok: true; data: LayoutData }).data : data, totalScore };
};

afterEach(() => vi.restoreAllMocks());

describe("layoutData-Schema", () => {
  it("alle Blöcke sind optional: ein leeres Objekt ist gültig", () => {
    expect(parseLayoutData({}).ok).toBe(true);
  });
  it("die Beispieldaten (5 und 6 Kriterien) sind gültig", () => {
    expect(parseLayoutData(beispielDaten(5).data).ok).toBe(true);
    expect(parseLayoutData(beispielDaten(6).data).ok).toBe(true);
  });
  it("Punkte über dem Maximum, negative und gebrochene Punkte werden abgelehnt", () => {
    const d = beispielDaten(5).data;
    expect(parseLayoutData({ ...d, kriterien: [{ name: "A", punkte: 21, max: 20 }] }).ok).toBe(false);
    expect(parseLayoutData({ ...d, kriterien: [{ name: "A", punkte: -1, max: 20 }] }).ok).toBe(false);
    expect(parseLayoutData({ ...d, kriterien: [{ name: "A", punkte: 1.5, max: 20 }] }).ok).toBe(false);
  });
  it("ungültige Evidenz-Einstufung, Quellen-URL und ASIN werden abgelehnt", () => {
    expect(parseLayoutData({ evidenz: [{ aussage: "A", status: "VIELLEICHT" }] }).ok).toBe(false);
    expect(parseLayoutData({ quellen: [{ titel: "A", url: "javascript:alert(1)" }] }).ok).toBe(false);
    expect(parseLayoutData({ asin: "zu-kurz" }).ok).toBe(false);
    expect(parseLayoutData({ asin: "b0abcdef12" }).ok).toBe(true);
  });
  it("unbekannte Schlüssel werden verworfen", () => {
    const r = parseLayoutData({ unbekannt: 1, pros: ["A"] });
    expect(r.ok && "unbekannt" in r.data).toBe(false);
  });
  it("Fehlermeldung nennt den Pfad", () => {
    const r = parseLayoutData({ kriterien: [{ name: "A", punkte: 5, max: 0 }] });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("kriterien.0.max");
  });
});

describe("Summe der Kriterien = Gesamtwertung", () => {
  it("pruefeSumme meldet eine Abweichung", () => {
    const { data, totalScore } = gueltig(5);
    expect(pruefeSumme(data, totalScore)).toBeNull();
    expect(pruefeSumme(data, totalScore + 1)?.message).toContain("weicht");
  });
  it("resolveLayout: klassisch (layout leer) → null, ohne Warnung", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(resolveLayout({ layout: "", layoutData: gueltig().data, totalScore: 87 })).toBeNull();
    expect(resolveLayout({ layout: null, layoutData: null, totalScore: 0 })).toBeNull();
    expect(err).not.toHaveBeenCalled();
  });
  it("resolveLayout: gültig → Daten", () => {
    const { data, totalScore } = gueltig();
    expect(resolveLayout({ layout: TESTVORLAGE_V2, layoutData: data, totalScore })).not.toBeNull();
  });
  it("resolveLayout: ungültige Daten oder Summe weicht ab → null und Fehler im Log (kein Absturz)", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    const { data, totalScore } = gueltig();
    expect(resolveLayout({ slug: "x", layout: TESTVORLAGE_V2, layoutData: { kriterien: "kaputt" }, totalScore })).toBeNull();
    expect(resolveLayout({ slug: "x", layout: TESTVORLAGE_V2, layoutData: data, totalScore: totalScore + 3 })).toBeNull();
    expect(err).toHaveBeenCalledTimes(2);
  });
  it("summeKriterien addiert die Punkte", () => {
    expect(summeKriterien(beispielDaten(6).data)).toBe(83);
    expect(summeKriterien(beispielDaten(5).data)).toBe(87);
  });
});

describe("Abschnitte und Nummerierung", () => {
  it("IDs sind eindeutig und stabil, Nummern laufen durch", () => {
    const a = baueAbschnitte(gueltig().data);
    expect(new Set(a.map((x) => x.id)).size).toBe(a.length);
    expect(a.map((x) => x.nummer)).toEqual(a.map((_, i) => i + 1));
    expect(a[0]).toMatchObject({ id: "urteil", art: "urteil" });
    expect(a.at(-1)).toMatchObject({ id: "quellen" });
  });
  it("gleiche Kapitelüberschriften bekommen unterschiedliche IDs", () => {
    const a = baueAbschnitte({ kapitel: [{ titel: "Dosierung" }, { titel: "Dosierung" }] });
    expect(a.map((x) => x.id)).toEqual(["dosierung", "dosierung-2"]);
  });
  it("ein in einem Kapitel eingebundener Block erscheint nicht zusätzlich als eigener Abschnitt", () => {
    const d: LayoutData = { zutaten: [{ name: "A" }], kapitel: [{ titel: "Zutaten", block: "zutaten" }] };
    expect(baueAbschnitte(d).filter((x) => x.art === "block")).toHaveLength(0);
    expect(baueAbschnitte({ zutaten: [{ name: "A" }] }).filter((x) => x.art === "block")).toHaveLength(1);
  });
});

describe("FAQ und Kauflink", () => {
  it("faqItems liefert Fragen und Antworten 1:1", () => {
    expect(faqItems({ faq: [{ frage: " F? ", antwort: " A " }] })).toEqual([{ question: "F?", answer: "A" }]);
    expect(faqItems({})).toEqual([]);
  });
  it("ASIN → Amazon-Link mit Partner-Tag; ohne ASIN und URL kein Link", () => {
    expect(kaufLink({ asin: "B000000000" })).toBe(`https://www.amazon.de/dp/B000000000?tag=${AMAZON_TAG}`);
    expect(kaufLink({})).toBeNull();
  });
});

describe("Prüfung vor dem Veröffentlichen", () => {
  const ctx = { bewertungsart: "ERGAENZUNGSFUTTER" as const, totalScore: 87 };
  it("vollständige Beispieldaten bestehen", () => {
    expect(pruefeVorVeroeffentlichung(gueltig(5).data, ctx)).toEqual([]);
    expect(pruefeVorVeroeffentlichung(gueltig(6).data, { bewertungsart: "ALLEINFUTTER", totalScore: 83 })).toEqual([]);
  });
  it("Pflichtfelder fehlen → Meldungen", () => {
    const msgs = pruefeVorVeroeffentlichung({}, ctx).map((i) => i.path);
    expect(msgs).toEqual(expect.arrayContaining(["hero.titel", "hero.untertitel", "hero.gesamturteil", "kriterien", "kapitel", "pros", "cons", "fazit", "faq", "quellen"]));
  });
  it("Anzahl der Kriterien: Ergänzungsfutter 5, Alleinfutter 6", () => {
    expect(pruefeVorVeroeffentlichung(gueltig(6).data, { bewertungsart: "ERGAENZUNGSFUTTER", totalScore: 83 }).some((i) => i.path === "kriterien")).toBe(true);
    expect(pruefeVorVeroeffentlichung(gueltig(5).data, { bewertungsart: "ALLEINFUTTER", totalScore: 87 }).some((i) => i.path === "kriterien")).toBe(true);
  });
  it("falsche Summe wird gemeldet", () => {
    expect(pruefeVorVeroeffentlichung(gueltig(5).data, { ...ctx, totalScore: 90 }).some((i) => i.message.includes("weicht"))).toBe(true);
  });
  it("Amazon-Link ohne Tag wird gemeldet, mit Tag nicht", () => {
    const d = gueltig(5).data;
    const ohne = pruefeVorVeroeffentlichung({ ...d, asin: undefined, kaufUrl: "https://www.amazon.de/dp/B000000000" }, ctx);
    expect(ohne.some((i) => i.path === "kaufUrl")).toBe(true);
    const mit = pruefeVorVeroeffentlichung({ ...d, asin: undefined, kaufUrl: `https://www.amazon.de/dp/B000000000?tag=${AMAZON_TAG}` }, ctx);
    expect(mit.some((i) => i.path === "kaufUrl")).toBe(false);
  });
  it("Sperrliste: zulässig, unzulässig, Betrug und „unabhängig“ in Bezug auf uns", () => {
    expect(sperrwoerter("Das ist zulässig.")).toEqual(["zulässig"]);
    expect(sperrwoerter("Eine unzulässige Aussage")).toEqual(["unzulässig"]);
    expect(sperrwoerter("Das ist Betrug")).toEqual(["betrug"]);
    expect(sperrwoerter("Wir sind unabhängig und testen ehrlich")).toEqual(["unabhängig (in Bezug auf uns)"]);
    expect(sperrwoerter("Futterprüfer ist ein unabhängiges Team")).toHaveLength(1);
    expect(sperrwoerter("Eine unabhängige Studie der Universität")).toEqual([]);
    expect(sperrwoerter("<p>Alles <strong>gut</strong></p>")).toEqual([]);
  });
  it("Sperrwörter in jedem Textfeld werden mit Pfad gemeldet, auch im Rich-Text", () => {
    const d = gueltig(5).data;
    const issues = pruefeVorVeroeffentlichung({ ...d, fazit: { html: "<p>Das ist Betrug</p>" }, faq: [{ frage: "Ist es zulässig?", antwort: "Ja" }] }, ctx);
    expect(issues.map((i) => i.path)).toEqual(expect.arrayContaining(["layoutData.fazit.html", "layoutData.faq[0].frage"]));
  });
});
