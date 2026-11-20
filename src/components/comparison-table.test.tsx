import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AMAZON_CTA } from "./testvorlage-v2/Sources";
import { ComparisonTable } from "./comparison-table";
import { affiliateAmazonUrl, publishedComparisonRows } from "@/lib/comparison-table";

describe("ComparisonTable", () => {
  it("setzt Punkte, Ampel, Note V3 und den Affiliate-CTA nur bei Gelb/Grün", () => {
    const html = renderToStaticMarkup(
      <ComparisonTable
        showPlace
        rows={publishedComparisonRows("gelenktabletten-hund-vergleich")}
        caption="Vier Gelenkmittel im Vergleich"
      />,
    );
    expect(html).toContain("Cadoc Grünlippmuschel Pulver");
    expect(html).toContain("59");
    expect(html).toContain("Gelb");
    expect(html).toContain("Rot");
    expect(html).toContain("Grünlippmuschel 150 mg/kg");
    expect(html).toContain("0,05");
    expect(html).toContain(AMAZON_CTA);
    expect(html).toContain("tag=cyberni7400-21");
    expect(html).toContain('rel="sponsored nofollow noopener"');
    expect(html).toContain("B07Z669DGV");
    expect(html).not.toContain("B01MRAVDQ7");
    expect(html).not.toContain("aggregateRating");
    expect(html).not.toContain("reviewCount");
  });

  it("lässt Preis und Dosis weg, wenn sie nicht belegt sind, und verlinkt Rot nicht zu Amazon", () => {
    const html = renderToStaticMarkup(
      <ComparisonTable
        rows={[
          { name: "Rot-Produkt", href: "/tests/rot", score: 18, amazonUrl: affiliateAmazonUrl("B0TEST1234") },
          { name: "Gelb-Produkt", href: "/tests/gelb", score: 59 },
        ]}
      />,
    );
    expect(html).not.toContain("Dosis je kg");
    expect(html).not.toContain("Preis / Tag");
    expect(html).not.toContain("amazon.de");
    expect(html).not.toContain(AMAZON_CTA);
    expect(html).toContain("/tests/rot");
    expect(html).toContain("/tests/gelb");
  });
});
