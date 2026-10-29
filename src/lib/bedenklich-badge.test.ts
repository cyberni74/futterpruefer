import { describe, expect, it } from "vitest";
import { showsBedenklichBadge } from "./bedenklich-badge";

const filled = { scoreRaw: 10, scoreNutrients: 11, scoreDeclaration: 6, scoreNeeds: 7, scoreValue: 2 };

describe("Bedenklich-Badge", () => {
  it("klassisch mit gesetzten Teilnoten: unter 10 Punkten, auch bei echter 0", () => {
    expect(showsBedenklichBadge({ layout: "", ...filled, scoreHarmful: 9 })).toBe(true);
    expect(showsBedenklichBadge({ layout: "", ...filled, scoreHarmful: 0 })).toBe(true);
    expect(showsBedenklichBadge({ ...filled, scoreHarmful: null })).toBe(true);
    expect(showsBedenklichBadge({ layout: "", ...filled, scoreHarmful: 10 })).toBe(false);
    expect(showsBedenklichBadge({ layout: "", ...filled, scoreHarmful: 19 })).toBe(false);
  });

  it("ohne gesetzte Teilnoten (alles 0): kein Badge, außer bei explizitem Warnsignal", () => {
    const leer = { layout: "", scoreRaw: 0, scoreHarmful: 0, scoreNutrients: 0, scoreDeclaration: 0, scoreNeeds: 0, scoreValue: 0, efSicherheit: "OK" };
    expect(showsBedenklichBadge(leer)).toBe(false);
    expect(showsBedenklichBadge({ ...leer, efSicherheit: "MITTEL" })).toBe(true);
    expect(showsBedenklichBadge({ ...leer, layoutData: { sicherheit: { stufe: "KRITISCH" } } })).toBe(true);
    expect(showsBedenklichBadge({ ...leer, layoutData: { sicherheit: { stufe: "HINWEIS" } } })).toBe(true);
  });

  it("V2 ohne Warnsignal: kein Badge, auch wenn scoreHarmful 0 ist", () => {
    expect(showsBedenklichBadge({ layout: "TESTVORLAGE_V2", scoreHarmful: 0, efSicherheit: "OK", layoutData: {} })).toBe(false);
    expect(showsBedenklichBadge({ layout: "TESTVORLAGE_V2", scoreHarmful: 0, efSicherheit: "OK", layoutData: { sicherheit: { stufe: "OK", text: "Hinweis ohne Warnstufe" } } })).toBe(false);
    expect(showsBedenklichBadge({ layout: "TESTVORLAGE_V2", scoreHarmful: 0 })).toBe(false);
    expect(showsBedenklichBadge({ layout: "TESTVORLAGE_V2", scoreRaw: 10, scoreHarmful: 4, efSicherheit: "OK" })).toBe(false);
  });

  it("V2 mit explizitem Warnsignal", () => {
    expect(showsBedenklichBadge({ layout: "TESTVORLAGE_V2", scoreHarmful: 0, efSicherheit: "MITTEL" })).toBe(true);
    expect(showsBedenklichBadge({ layout: "TESTVORLAGE_V2", scoreHarmful: 20, efSicherheit: "SCHWER" })).toBe(true);
    expect(showsBedenklichBadge({ layout: "TESTVORLAGE_V2", scoreHarmful: 0, layoutData: { sicherheit: { stufe: "KRITISCH", text: "Schwermetalle" } } })).toBe(true);
    expect(showsBedenklichBadge({ layout: "TESTVORLAGE_V2", scoreHarmful: 0, layoutData: { sicherheit: { stufe: "HINWEIS" } } })).toBe(true);
  });
});
