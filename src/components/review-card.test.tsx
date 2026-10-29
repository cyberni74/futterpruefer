import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReviewCardData } from "@/lib/queries";
import { ReviewCard } from "./review-card";

function card(over: Partial<ReviewCardData>): ReviewCardData {
  return {
    id: "id",
    slug: "slug",
    title: "Produkttitel",
    brand: "Marke",
    productName: "Produkt",
    keyword: "",
    teaser: "Teaser",
    imageUrl: null,
    imageAlt: "",
    imageBlur: null,
    totalScore: 92,
    scoreRaw: 0,
    scoreHarmful: 0,
    scoreNutrients: 0,
    scoreDeclaration: 0,
    scoreNeeds: 0,
    scoreValue: 0,
    layout: "",
    efSicherheit: "OK",
    layoutData: null,
    priceClass: "MITTEL",
    publishedAt: new Date("2026-10-27T12:00:00Z"),
    category: { slug: "ergaenzungsfuttermittel-hund", shortName: "Ergänzungsfuttermittel Hund", animal: "HUND" },
    ...over,
  };
}

describe("ReviewCard Bedenklich", () => {
  it("zeigt das Badge bei klassischen Tests unter 10 Schadstoff-Punkten, Kachel und Karte", () => {
    const review = card({ layout: "", scoreRaw: 10, scoreHarmful: 9, scoreNutrients: 11, totalScore: 45 });
    for (const variant of ["card", "tile"] as const) {
      const html = renderToStaticMarkup(<ReviewCard review={review} variant={variant} />);
      expect(html).toContain("Bedenklich");
    }
  });

  it("zeigt das Badge bei klassischen Tests ab 10 Punkten nicht", () => {
    const html = renderToStaticMarkup(<ReviewCard review={card({ layout: "", scoreRaw: 20, scoreHarmful: 15, totalScore: 82 })} />);
    expect(html).not.toContain("Bedenklich");
  });

  it("zeigt das Badge nicht, wenn alle sechs Teilnoten 0 sind und kein Warnsignal gesetzt ist", () => {
    const html = renderToStaticMarkup(<ReviewCard review={card({ layout: "", totalScore: 27, efSicherheit: "OK" })} />);
    expect(html).not.toContain("Bedenklich");
  });

  it("zeigt das Badge bei echten 0 Schadstoff-Punkten, sobald andere Teilnoten gesetzt sind", () => {
    const html = renderToStaticMarkup(<ReviewCard review={card({ layout: "", scoreRaw: 12, scoreHarmful: 0, totalScore: 40 })} />);
    expect(html).toContain("Bedenklich");
  });

  it("zeigt das Badge bei leeren Teilnoten, wenn die Sicherheit ein Warnsignal setzt", () => {
    const html = renderToStaticMarkup(<ReviewCard review={card({ layout: "", totalScore: 59, efSicherheit: "MITTEL" })} />);
    expect(html).toContain("Bedenklich");
  });

  it("zeigt das Badge bei V2 ohne Warnsignal nicht, auch bei scoreHarmful 0", () => {
    const review = card({ layout: "TESTVORLAGE_V2", scoreHarmful: 0, totalScore: 92, efSicherheit: "OK", layoutData: { sicherheit: { stufe: "OK", text: "Unbedenklich" } } });
    for (const variant of ["card", "tile"] as const) {
      const html = renderToStaticMarkup(<ReviewCard review={review} variant={variant} />);
      expect(html).not.toContain("Bedenklich");
      expect(html).toContain("92");
    }
  });

  it("zeigt das Badge bei V2, wenn ein Warnsignal gesetzt ist", () => {
    const html = renderToStaticMarkup(<ReviewCard review={card({ layout: "TESTVORLAGE_V2", scoreHarmful: 0, efSicherheit: "SCHWER", totalScore: 39 })} />);
    expect(html).toContain("Bedenklich");
  });
});
