import { describe, expect, it } from "vitest";
import { DEFAULT_AUTHOR } from "./authors";
import { absoluteUrl } from "./site";
import { productReviewJsonLd, productSnippetIssues, reviewHeadline, skuFromAsin } from "./review-schema";

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
    expect(data).not.toHaveProperty("offers");
    expect(data).not.toHaveProperty("sku");
  });

  it("setzt Beschreibung und Packungspreis, aber keine Amazon-Wertung und keine GTIN", () => {
    const data = sample({
      description: "Kurz und bequem dosierbar.",
      price: 12.9,
      url: "https://futterpruefer.de/ergaenzungsfuttermittel-hund/medidog-ulmenrinden-paste",
      asin: "B07KCS7YX1",
    });
    expect(data.description).toBe("Kurz und bequem dosierbar.");
    expect(data.sku).toBe("B07KCS7YX1");
    expect(data).not.toHaveProperty("gtin");
    expect(data.offers).toEqual({
      "@type": "Offer",
      price: 12.9,
      priceCurrency: "EUR",
      url: "https://futterpruefer.de/ergaenzungsfuttermittel-hund/medidog-ulmenrinden-paste",
    });
    expect(data.offers).not.toHaveProperty("availability");
    expect(JSON.stringify(data)).not.toMatch(/starRating|ratingCount|amazon/i);
    expect(productSnippetIssues(data)).toEqual([]);
  });

  it("lässt eine einzelne Pro-Aussage weg, weil Google zwei Aussagen verlangt", () => {
    const data = sample({ pros: ["Nur eine"], cons: [] });
    expect(data.review.positiveNotes).toBeUndefined();
    expect(data.review.negativeNotes).toBeUndefined();
    expect(skuFromAsin("keine-asin")).toBeUndefined();
    expect(skuFromAsin("  b07kcs7yx1 ")).toBe("B07KCS7YX1");
  });
});
