import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { AMAZON_CTA } from "./testvorlage-v2/Sources";
import { ComparisonTable } from "./comparison-table";
import {
  affiliateAmazonUrl,
  METHODIK_V1_NOTE_FOOTNOTE,
  PRICE_PER_DAY_FOOTNOTE,
  TEAMWERTUNG_FOOTNOTE,
  publishedComparisonRows,
} from "@/lib/comparison-table";

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
  it("setzt bei Methodik Version 1 in der Note einen Gedankenstrich und die Fußnote", () => {
    const html = renderToStaticMarkup(
      <ComparisonTable
        rows={[{ name: "V1-Produkt", href: "/tests/v1", score: 55, methodikVersion: "1" }]}
      />,
    );
    expect(html).toContain("Rot");
    expect(html).toContain(">–</td>");
    expect(html).not.toContain("3,6");
    expect(html).toContain(METHODIK_V1_NOTE_FOOTNOTE);
  });

  it("hängt Teamwertung an den Produktnamen und setzt die Fußnote", () => {
    const html = renderToStaticMarkup(
      <ComparisonTable
        rows={[
          {
            name: "MEDIDOG Haut- & Fellglück Paste 500 g",
            href: "/ergaenzungsfuttermittel-hund/medidog-haut-und-fellglueck-paste",
            score: 91.8,
            methodikVersion: "ergaenzung-v1.1",
            teamWertung: true,
          },
        ]}
      />,
    );
    expect(html).toContain("MEDIDOG Haut- &amp; Fellglück Paste 500 g (Teamwertung)");
    expect(html).toContain("91,8");
    expect(html).toContain("Grün");
    expect(html).toContain("1,3");
    expect(html).toContain(TEAMWERTUNG_FOOTNOTE);
    expect(html).not.toContain(METHODIK_V1_NOTE_FOOTNOTE);
  });

  it("setzt den Preisstand-Satz nur auf Hub-Tabellen mit Preis-Spalte", () => {
    const withPrice = renderToStaticMarkup(
      <ComparisonTable
        showPriceStand
        rows={[{ name: "Mit Preis", href: "/x", score: 70, pricePerDay: 0.2 }]}
      />,
    );
    expect(withPrice).toContain("Preis / Tag");
    expect(withPrice).toContain(PRICE_PER_DAY_FOOTNOTE);
    const withoutFlag = renderToStaticMarkup(
      <ComparisonTable rows={[{ name: "Mit Preis", href: "/x", score: 70, pricePerDay: 0.2 }]} />,
    );
    expect(withoutFlag).toContain("Preis / Tag");
    expect(withoutFlag).not.toContain(PRICE_PER_DAY_FOOTNOTE);
  });


  it("liefert am Handy Karten: data-label je Zelle, eigene Tabellenklasse, Caption als Block", () => {
    const html = renderToStaticMarkup(
      <ComparisonTable
        showPlace
        rows={publishedComparisonRows("gelenktabletten-hund-vergleich")}
        caption="Ergebnisse auf einen Blick"
      />,
    );
    expect(html).toContain('class="vt-table vt-table-cmp"');
    for (const label of ["Platz", "Produkt", "Punkte", "Ampel", "Note", "Dosis je kg", "Preis / Tag", "Angebot"]) {
      expect(html).toContain(`data-label="${label}"`);
    }
    expect(html).not.toContain("vt-row");
    const css = readFileSync(join(process.cwd(), "src/styles/vergleichstest.css"), "utf8");
    expect(css).toMatch(/table\.vt-table-cmp\.vt-table-cmp > caption \{ display: block;/);
    expect(css).toMatch(/table\.vt-table-cmp\.vt-table-cmp > thead \{ display: none;/);
    expect(css).toContain(".prose-fp .vt-table-box:not(:has(*)) { display: none; }");
  });
});
