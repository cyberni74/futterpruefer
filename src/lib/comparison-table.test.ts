import { describe, expect, it } from "vitest";
import {
  affiliateAmazonUrl,
  comparisonIdForBlogSlug,
  documentedPricePerDay,
  dosePerKgLabel,
  formatNote,
  publishedComparisonRows,
  purposeForReview,
  rowAmazonCtaUrl,
  rowNote,
  rowRating,
  splitFirstVtTable,
} from "./comparison-table";
import { noteFuerPunkte } from "./scoring";

describe("comparison-table helpers", () => {
  it("rechnet die Note nach Notenschlüssel V3", () => {
    expect(formatNote(noteFuerPunkte(100))).toBe("1,0");
    expect(rowNote({ score: 59 })).toBe(noteFuerPunkte(59));
    expect(formatNote(rowNote({ score: 59 }))).toMatch(/^\d,\d$/);
  });

  it("zeigt den Amazon-CTA nur bei Grün und Gelb, immer mit Partner-Tag", () => {
    const url = affiliateAmazonUrl("B07Z669DGV");
    expect(url).toContain("tag=cyberni7400-21");
    expect(rowAmazonCtaUrl({ name: "Cadoc", href: "/x", score: 59, amazonUrl: url })).toBe(url);
    expect(rowAmazonCtaUrl({ name: "Grün", href: "/x", score: 80, amazonUrl: url })).toBe(url);
    expect(rowAmazonCtaUrl({ name: "Rot", href: "/x", score: 50, amazonUrl: url })).toBeNull();
    expect(rowRating({ score: 28 })).toBe("schlecht");
  });

  it("nennt die Dosis je kg nur bei belegter Tagesmenge (10-kg-Konvention)", () => {
    expect(dosePerKgLabel([])).toBeNull();
    expect(dosePerKgLabel([{ name: "Grünlippmuschel", mengeMgProTagesdosis: 1500 }])).toBe("Grünlippmuschel 150 mg/kg");
    expect(dosePerKgLabel([{ name: "Grünlippmuschel", mengeMgProTagesdosis: null }])).toBeNull();
    expect(documentedPricePerDay([null, 0, 0.05])).toBe(0.05);
    expect(documentedPricePerDay([null, 0])).toBeNull();
  });

  it("ordnet Tests einem Zweck zu und hält Kauartikel aus Haut & Fell raus", () => {
    expect(purposeForReview({ slug: "veddelholzer-gelenktabletten-hund-test" })).toBe("gelenke");
    expect(purposeForReview({ slug: "tierliebhaber-premium-lachsoel" })).toBe("haut_fell_oel");
    expect(purposeForReview({ slug: "tierliebhaber-hirschohren-mit-fell" })).toBe("snacks_kauartikel");
    expect(purposeForReview({ slug: "kunto-gras-kotfresser-drops-hund-test" })).toBe("kotfressen");
    expect(purposeForReview({ slug: "symbiopet-dog-probiotika-hund-test" })).toBe("verdauung");
    expect(purposeForReview({ slug: "proden-plaqueoff-pulver-hund-test" })).toBe("zaehne");
    expect(purposeForReview({ slug: "mammaly-relax-time-test" })).toBe("nerven");
    expect(purposeForReview({ slug: "hundpur-z-protect-hund-test" })).toBe("weitere");
  });

  it("liefert die veröffentlichten Vergleichszeilen ohne Amazon an Rot-Produkten", () => {
    const gelenk = publishedComparisonRows("gelenktabletten-hund-vergleich");
    expect(gelenk).toHaveLength(4);
    expect(gelenk[0]?.score).toBe(59);
    expect(rowAmazonCtaUrl(gelenk[0]!)).toContain("B07Z669DGV");
    expect(rowAmazonCtaUrl(gelenk[1]!)).toBeNull();
    expect(comparisonIdForBlogSlug("gelenk-test-hund-oktober-2026")).toBe("gelenktabletten-hund-vergleich");
    const lachs = publishedComparisonRows("lachsoel-hund-vergleich");
    expect(lachs[0]?.name).toContain("Scheidler");
    expect(rowAmazonCtaUrl(lachs[0]!)).toContain("B00DDNWJ1Y");
    expect(rowAmazonCtaUrl(lachs[4]!)).toBeNull();
  });

  it("schneidet die erste vt-table aus dem Beitragskörper", () => {
    const html = '<p>Intro</p><table class="vt-table"><tr><td>A</td></tr></table><p>Rest</p><table class="vt-table"><tr><td>B</td></tr></table>';
    expect(splitFirstVtTable(html)).toEqual({ before: "<p>Intro</p>", after: '<p>Rest</p><table class="vt-table"><tr><td>B</td></tr></table>' });
    expect(splitFirstVtTable("<p>ohne Tabelle</p>")).toBeNull();
  });
});
