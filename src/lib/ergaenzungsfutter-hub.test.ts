import { describe, expect, it } from "vitest";
import { EF_HUB_DESCRIPTION, EF_HUB_FAQ, EF_HUB_H1, EF_HUB_TITLE, hubFaqJsonLd, hubItemListJsonLd } from "./ergaenzungsfutter-hub";

const FORBIDDEN = /unabhängig|heilt|lindert|Schmerz|Arthrose|Krankheit bekämpfen|Testsieger über alle|100 % natürlich/i;

describe("Ergänzungsfutter-Hub Texte", () => {
  it("hat Suchsprache, Jahr und eine Description bis 155 Zeichen", () => {
    expect(EF_HUB_TITLE).toContain("Ergänzungsfutter Hund Test 2026");
    expect(EF_HUB_H1.toLocaleLowerCase("de")).toContain("ergänzungsfutter");
    expect(EF_HUB_DESCRIPTION.length).toBeLessThanOrEqual(155);
    expect(EF_HUB_DESCRIPTION).toContain("Ergänzungsfutter Hund Test 2026");
    expect(EF_HUB_DESCRIPTION).toContain("20.11.2026");
    expect(EF_HUB_FAQ.length).toBeGreaterThanOrEqual(6);
    expect(EF_HUB_FAQ.length).toBeLessThanOrEqual(8);
  });

  it("vermeidet Heilaussagen, Unabhängigkeits-Inszenierung und einen Gesamt-Testsieger", () => {
    const text = [EF_HUB_TITLE, EF_HUB_H1, EF_HUB_DESCRIPTION, ...EF_HUB_FAQ.map((f) => f.question + f.answer)].join("\n");
    expect(text).not.toMatch(FORBIDDEN);
    expect(EF_HUB_DESCRIPTION.toLowerCase()).toContain("ohne gesamt-testsieger");
  });

  it("baut FAQPage und ItemList ohne Amazon-Bewertungen", () => {
    const faq = hubFaqJsonLd();
    expect(faq?.["@type"]).toBe("FAQPage");
    expect(JSON.stringify(faq)).not.toMatch(/aggregateRating|reviewCount|amazon/i);
    const list = hubItemListJsonLd([{ name: "Testprodukt", href: "/ergaenzungsfuttermittel-hund/demo" }]);
    expect(list?.["@type"]).toBe("ItemList");
    expect(JSON.stringify(list)).not.toMatch(/aggregateRating|reviewCount/);
  });
});
