import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReviewCardData } from "@/lib/queries";
import { BLOG_CARD_NEUTRAL_IMAGE, RELATED_REVIEW_EXCLUDE } from "@/lib/content";
import { ReviewCard } from "./review-card";

vi.mock("@/lib/db", () => ({ prisma: {} }));

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

describe("ReviewCard Bildquelle und neutrale Fläche", () => {
  const withImage = card({ imageUrl: "https://example.com/pack.jpg", imageAlt: "Packung" });
  it("zeigt die Bildquelle unter dem Bild, wenn sie übergeben wird", () => {
    const h = renderToStaticMarkup(<ReviewCard review={withImage} imageCredit="Bild: Hersteller" />);
    expect(h).toContain("Bild: Hersteller");
    expect(h.indexOf("Bild: Hersteller")).toBeGreaterThan(h.indexOf("<img"));
  });
  it("ohne imageCredit keine Bildquelle", () => {
    expect(renderToStaticMarkup(<ReviewCard review={withImage} />)).not.toContain("Bild: Hersteller");
  });
  it("neutralImage: kein Packungsbild, keine Bildquelle", () => {
    const h = renderToStaticMarkup(<ReviewCard review={withImage} imageCredit="Bild: Hersteller" neutralImage />);
    expect(h).not.toContain("pack.jpg");
    expect(h).not.toContain("Bild: Hersteller");
    expect(h).toContain("Produkttitel");
  });
});

describe("Bildquelle in Blog-Karten (Regel der Seite)", () => {
  const credit = (r: Pick<ReviewCardData, "imageUrl" | "imageAlt">) => (r.imageUrl && !/symbolbild|ki-generiert/i.test(r.imageAlt ?? "") ? "Bild: Hersteller" : undefined);
  it("KI-Bild ohne Credit", () => {
    const ki = card({ imageUrl: "https://example.com/ki.jpg", imageAlt: "Trockenfutter, KI-generiertes Symbolbild" });
    expect(credit(ki)).toBeUndefined();
    expect(renderToStaticMarkup(<ReviewCard review={ki} imageCredit={credit(ki)} />)).not.toContain("Bild: Hersteller");
    const foto = card({ imageUrl: "https://example.com/pack.jpg", imageAlt: "Packung" });
    expect(renderToStaticMarkup(<ReviewCard review={foto} imageCredit={credit(foto)} />)).toContain("Bild: Hersteller");
  });
  it("ohne Bild keine Bildquelle", () => {
    expect(credit(card({ imageUrl: null }))).toBeUndefined();
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
  it("Medidog erscheint nicht unter „Fleischherkunft und Tierhaltung“", () => {
    expect(RELATED_REVIEW_EXCLUDE["fleischherkunft-tierhaltung-tierfutter"]).toEqual(["medidog-ulmenrinden-paste"]);
  });
  it("Medidog erscheint nicht unter „Was dürfen Hunde nicht essen“", () => {
    expect(RELATED_REVIEW_EXCLUDE["was-duerfen-hunde-nicht-essen"]).toEqual(["medidog-ulmenrinden-paste"]);
  });
});
