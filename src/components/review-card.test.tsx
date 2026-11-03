import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { BLOG_CARD_NEUTRAL_IMAGE, RELATED_REVIEW_EXCLUDE } from "@/lib/content";
import type { ReviewCardData } from "@/lib/queries";
import { ReviewCard } from "./review-card";

vi.mock("@/lib/db", () => ({ prisma: {} }));

const review = {
  id: "r1", slug: "beispiel-test", title: "Beispiel im Test", brand: "Beispiel", productName: "Snack", keyword: "", teaser: "Kurztext",
  imageUrl: "https://example.com/pack.jpg", imageAlt: "Packung", imageBlur: null, totalScore: 70, scoreRaw: null, category: { shortName: "Ergänzungsfutter", slug: "ergaenzungsfuttermittel-hund", animal: "HUND" },
} as unknown as ReviewCardData;

describe("ReviewCard Bildquelle und neutrale Fläche", () => {
  it("zeigt die Bildquelle unter dem Bild, wenn sie übergeben wird", () => {
    const h = renderToStaticMarkup(<ReviewCard review={review} imageCredit="Bild: Hersteller" />);
    expect(h).toContain("Bild: Hersteller");
    expect(h.indexOf("Bild: Hersteller")).toBeGreaterThan(h.indexOf("<img") === -1 ? 0 : h.indexOf("<img"));
  });
  it("ohne imageCredit keine Bildquelle", () => {
    expect(renderToStaticMarkup(<ReviewCard review={review} />)).not.toContain("Bild: Hersteller");
  });
  it("neutralImage: kein Packungsbild, keine Bildquelle", () => {
    const h = renderToStaticMarkup(<ReviewCard review={review} imageCredit="Bild: Hersteller" neutralImage />);
    expect(h).not.toContain("example.com/pack.jpg");
    expect(h).not.toContain("pack.jpg");
    expect(h).not.toContain("Bild: Hersteller");
    expect(h).toContain("Beispiel im Test");
  });
});

describe("Blog-Karten: Steuerlisten", () => {
  it("Gras-/Kotfresser-Packungsbilder werden in Blog-Karten neutral dargestellt", () => {
    expect(BLOG_CARD_NEUTRAL_IMAGE.has("tierliebhaber-gras-kotfresser-drops-test")).toBe(true);
    expect(BLOG_CARD_NEUTRAL_IMAGE.has("aniforte-gras-kotfresser-snack-hund-test")).toBe(true);
  });
  it("Krill-Beitrag zeigt keine Gras-/Kotfresser-Tests", () => {
    expect(RELATED_REVIEW_EXCLUDE["krill-tierfutter-antarktis"]).toEqual(expect.arrayContaining(["tierliebhaber-gras-kotfresser-drops-test", "aniforte-gras-kotfresser-snack-hund-test"]));
  });
});
