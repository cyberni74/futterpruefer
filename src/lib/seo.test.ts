import { describe, expect, it } from "vitest";
import { productLabel, seoTitle } from "./seo";

describe("productLabel", () => {
  it("vermeidet die doppelte Marke", () => {
    expect(productLabel("Josera", "Josera Festival (Adult)")).toBe("Josera Festival (Adult)");
    expect(productLabel("BELCANDO", "BELCANDO Adult GF Beef")).toBe("BELCANDO Adult GF Beef");
    expect(productLabel("Happy Dog", "happy dog NaturCroq")).toBe("happy dog NaturCroq");
    expect(productLabel("Royal Canin", "Mini Adult")).toBe("Royal Canin Mini Adult");
    expect(productLabel("Bosch", "Boschfutter X")).toBe("Boschfutter X");
    expect(productLabel("", "Solo")).toBe("Solo");
    expect(productLabel(null, null)).toBe("");
  });
});

describe("seoTitle", () => {
  it("hängt die Marke nur an, wenn der Titel kurz genug bleibt, und doppelt sie nicht", () => {
    expect(seoTitle("Royal Canin Mini Adult im Test: 62/100")).toBe("Royal Canin Mini Adult im Test: 62/100 | Futterprüfer");
    expect(seoTitle("Belcando Adult im Test: 72/100 | Futterprüfer")).toBe("Belcando Adult im Test: 72/100 | Futterprüfer");
    const long = "Futterdeklaration richtig lesen: So verstehen Sie das Etikett";
    expect(seoTitle(long)).toBe(long);
    expect(seoTitle("Kurz – Futterprüfer")).toBe("Kurz | Futterprüfer");
  });
});
