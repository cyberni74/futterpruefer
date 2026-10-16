import { describe, expect, it } from "vitest";
import { DEFAULT_AUTHOR } from "./authors";
import { absoluteUrl } from "./site";
import { productReviewJsonLd, reviewHeadline } from "./review-schema";

const updatedAt = new Date("2026-10-09T08:15:00.000Z");

function sample(over: Partial<Parameters<typeof productReviewJsonLd>[0]> = {}) {
  return productReviewJsonLd({
    brand: "Medidog",
    productName: "Ulmenrinden Paste",
    categoryName: "Ergänzungsfuttermittel Hund",
    totalScore: 56,
    verdict: "Kurz und bequem dosierbar.",
    publishedAt: new Date("2026-10-06T07:00:00.000Z"),
    updatedAt,
    authorSlug: null,
    images: ["/uploads/paste.webp"],
    pros: ["Ohne Zeolith"],
    cons: ["Feuchte fehlt"],
    ...over,
  });
}

describe("reviewHeadline", () => {
  it("hängt „im Test“ nur einmal an", () => {
    expect(reviewHeadline("Medidog Ulmenrinden Paste")).toBe("Medidog Ulmenrinden Paste im Test");
    expect(reviewHeadline("Snack im Test")).toBe("Snack im Test");
    expect(reviewHeadline("Medidog Ulmenrinden Paste im Test: 56/100 Punkte")).toBe(
      "Medidog Ulmenrinden Paste im Test: 56/100 Punkte",
    );
  });
});

describe("productReviewJsonLd", () => {
  it("nennt das Produkt einmal und bewertet es als Person auf der Skala 0–100", () => {
    const data = sample();
    const json = JSON.stringify(data);
    expect(json).not.toContain("im Test im Test");
    expect(json).not.toContain("Punkte im Test");
    expect(data["@type"]).toBe("Product");
    expect(data.name).toBe("Medidog Ulmenrinden Paste");
    expect(data.brand).toEqual({ "@type": "Brand", name: "Medidog" });
    expect(data.image?.[0]).toBe(absoluteUrl("/uploads/paste.webp"));
    expect(data.review.name).toBe("Medidog Ulmenrinden Paste im Test");
    expect(data.review.author).toMatchObject({ "@type": "Person", name: DEFAULT_AUTHOR.name });
    expect(data.review.author["@type"]).not.toBe("Organization");
    expect(data.review.reviewRating).toEqual({ "@type": "Rating", ratingValue: 56, bestRating: 100, worstRating: 0 });
    expect(data.review).not.toHaveProperty("itemReviewed");
    expect(json).not.toContain("AggregateRating");
    expect(json).not.toContain("aggregateRating");
  });

  it("verdoppelt „im Test“ nicht, wenn der Produktname es schon trägt", () => {
    const data = sample({ brand: "Felix", productName: "Felix So gut wie es aussieht im Test" });
    expect(data.name).toBe("Felix So gut wie es aussieht im Test");
    expect(data.review.name).toBe("Felix So gut wie es aussieht im Test");
    expect(JSON.stringify(data)).not.toContain("im Test im Test");
  });

  it("lässt AggregateRating und Organization als bewertete Sache weg", () => {
    const data = sample({ totalScore: 0, images: [], pros: [], cons: [], verdict: "" });
    expect(data.review.reviewRating.ratingValue).toBe(0);
    expect(data.review.reviewRating.worstRating).toBe(0);
    expect(data.review.reviewRating.bestRating).toBe(100);
    expect(data).not.toHaveProperty("aggregateRating");
    expect(data.image).toBeUndefined();
    expect(data.review.reviewBody).toBeUndefined();
    expect(data.review.positiveNotes).toBeUndefined();
    expect(data["@type"]).not.toBe("Organization");
  });
});
