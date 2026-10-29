import { describe, expect, it } from "vitest";
import { showsBedenklichBadge } from "./bedenklich-badge";

describe("Bedenklich-Badge", () => {
  it("klassisch: unter 10 Punkten, auch bei 0 und null", () => {
    expect(showsBedenklichBadge({ layout: "", scoreHarmful: 9 })).toBe(true);
    expect(showsBedenklichBadge({ layout: "", scoreHarmful: 0 })).toBe(true);
    expect(showsBedenklichBadge({ scoreHarmful: null })).toBe(true);
    expect(showsBedenklichBadge({ layout: "", scoreHarmful: 10 })).toBe(false);
    expect(showsBedenklichBadge({ layout: "", scoreHarmful: 19 })).toBe(false);
  });

  it("V2 ohne Warnsignal: kein Badge, auch wenn scoreHarmful 0 ist", () => {
    expect(showsBedenklichBadge({ layout: "TESTVORLAGE_V2", scoreHarmful: 0, efSicherheit: "OK", layoutData: {} })).toBe(false);
    expect(showsBedenklichBadge({ layout: "TESTVORLAGE_V2", scoreHarmful: 0, efSicherheit: "OK", layoutData: { sicherheit: { stufe: "OK", text: "Hinweis ohne Warnstufe" } } })).toBe(false);
    expect(showsBedenklichBadge({ layout: "TESTVORLAGE_V2", scoreHarmful: 0 })).toBe(false);
  });

  it("V2 mit explizitem Warnsignal", () => {
    expect(showsBedenklichBadge({ layout: "TESTVORLAGE_V2", scoreHarmful: 0, efSicherheit: "MITTEL" })).toBe(true);
    expect(showsBedenklichBadge({ layout: "TESTVORLAGE_V2", scoreHarmful: 20, efSicherheit: "SCHWER" })).toBe(true);
    expect(showsBedenklichBadge({ layout: "TESTVORLAGE_V2", scoreHarmful: 0, layoutData: { sicherheit: { stufe: "KRITISCH", text: "Schwermetalle" } } })).toBe(true);
    expect(showsBedenklichBadge({ layout: "TESTVORLAGE_V2", scoreHarmful: 0, layoutData: { sicherheit: { stufe: "HINWEIS" } } })).toBe(true);
  });
});
