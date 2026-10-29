import { describe, expect, it } from "vitest";
import { contentImageCaption } from "./content-caption";

describe("Bildunterschrift Inhalt", () => {
  it("nutzt den Alt-Text und erfindet bei leerem Text keine Unterschrift", () => {
    expect(contentImageCaption("Doppelherz Chew, Werbegrafik")).toBe("Doppelherz Chew, Werbegrafik");
    expect(contentImageCaption("  Tabletten in der Dose  ")).toBe("Tabletten in der Dose");
    expect(contentImageCaption("")).toBeNull();
    expect(contentImageCaption("   ")).toBeNull();
    expect(contentImageCaption(null)).toBeNull();
  });
});
