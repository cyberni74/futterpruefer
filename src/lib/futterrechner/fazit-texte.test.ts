import { describe, expect, it } from "vitest";
import { ampelstufeFuer, FAZIT_FREIGEGEBEN, fazitFuer } from "./fazit-texte";

describe("Fazit-Texte (Platzhalter, nicht freigegeben)", () => {
  it("bleibt bis zur Freigabe ausgeschaltet", () => {
    expect(FAZIT_FREIGEGEBEN).toBe(false);
    expect(fazitFuer("hund", 95)).toBeNull();
  });
  it("Ampelstufen wie bei den Tests", () => {
    expect(ampelstufeFuer(80)).toBe("gruen");
    expect(ampelstufeFuer(79)).toBe("gelb");
    expect(ampelstufeFuer(60)).toBe("gelb");
    expect(ampelstufeFuer(59)).toBe("rot");
  });
  it("liefert mit Freigabe einen Text je Tierart und Stufe", () => {
    expect(fazitFuer("katze", 50, true)).toContain("Katze Rot");
  });
});
