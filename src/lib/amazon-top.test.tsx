import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AFFILIATE_HINWEIS_OBEN, topAmazonUrl } from "./amazon-asin";
import { AmazonTopCta } from "@/components/price-block";
import { TestvorlageV2 } from "@/components/testvorlage-v2/TestvorlageV2";
import { AFFILIATE_HINWEIS } from "@/components/testvorlage-v2/Sources";
import { beispielDaten } from "@/components/testvorlage-v2/fixtures";

const URL_OK = "https://www.amazon.de/dp/B0TESTASIN?tag=cyberni7400-21";
const v2 = (score: number, asin?: string) => {
  const { data } = beispielDaten(5);
  return renderToStaticMarkup(<TestvorlageV2 data={{ ...data, asin, kaufUrl: undefined }} totalScore={score} ampelLabel="Test" />);
};

describe("topAmazonUrl (D4)", () => {
  it("nutzt nur die ASIN mit Partner-Tag", () => {
    expect(topAmazonUrl({ asin: "b0testasin" })).toBe(URL_OK);
  });
  it("genau eine ASIN aus Produktlinks reicht", () => {
    expect(topAmazonUrl({ html: '<a href="https://www.amazon.de/Name/dp/B0TESTASIN/ref=x?tag=fremd-21">x</a>' })).toBe(URL_OK);
  });
  it("mehrere ASINs, Suchlinks, Kurzlinks oder nichts: kein Button", () => {
    expect(topAmazonUrl({ html: '<a href="https://www.amazon.de/dp/B0TESTASIN">a</a><a href="https://www.amazon.de/dp/B0OTHERASI">b</a>' })).toBeNull();
    expect(topAmazonUrl({ html: '<a href="https://www.amazon.de/s?k=futter">s</a>' })).toBeNull();
    expect(topAmazonUrl({ html: '<a href="https://amzn.to/abc">k</a>' })).toBeNull();
    expect(topAmazonUrl({ asin: "zu-kurz" })).toBeNull();
    expect(topAmazonUrl({})).toBeNull();
  });
});

describe("AmazonTopCta klassisch (D1, D2, D5)", () => {
  it("ab 60 Punkten: Entdecken-Text, D1-Hinweis, kein Rot-Satz", () => {
    const h = renderToStaticMarkup(<AmazonTopCta url={URL_OK} rot={false} />);
    expect(h).toContain("Jetzt bei Amazon entdecken*");
    expect(h).toContain(AFFILIATE_HINWEIS_OBEN);
    expect(h).toContain('rel="sponsored nofollow noopener"');
    expect(h).toContain(`href="${URL_OK}"`);
    expect(h).not.toContain("Rot;");
    expect(h).not.toMatch(/Testsieger|Bestseller|beste/i);
  });
  it("unter 60 Punkten: Preis-Text und Rot-Satz am Button, ohne Trophäe", () => {
    const h = renderToStaticMarkup(<AmazonTopCta url={URL_OK} rot />);
    expect(h).toContain("Aktuellen Preis bei Amazon ansehen*");
    expect(h).toContain("Unsere Bewertung für dieses Produkt ist Rot; der Link ist keine Kaufempfehlung.");
    expect(h).toContain(AFFILIATE_HINWEIS_OBEN);
    expect(h).not.toMatch(/Testsieger|Trophy|Award|Produkt des Monats/i);
    expect(h).not.toMatch(/€|EUR/);
  });
});

describe("V2 (D1–D3)", () => {
  it.each([[59, true], [60, false], [85, false]] as const)("%s Punkte: Button direkt nach dem Hero", (score, rot) => {
    const h = v2(score, "B0TESTASIN");
    const hero = h.indexOf('class="score-card"');
    const top = h.indexOf("data-amazon-top");
    expect(hero).toBeGreaterThan(-1);
    expect(top).toBeGreaterThan(hero);
    expect(top).toBeLessThan(h.indexOf(`class="layout"`));
    const block = h.slice(top, h.indexOf("</div>", top));
    expect(block).toContain(AFFILIATE_HINWEIS_OBEN);
    expect(block).toContain(rot ? "Aktuellen Preis bei Amazon ansehen*" : "Jetzt bei Amazon entdecken*");
    expect(block.includes("keine Kaufempfehlung")).toBe(rot);
  });
  it("die übrigen Buttons behalten den alten Hinweis", () => {
    const h = v2(85, "B0TESTASIN");
    expect((h.match(/data-amazon-top/g) ?? []).length).toBe(1);
    expect(h).toContain(AFFILIATE_HINWEIS);
  });
  it("ohne ASIN: kein oberer Button", () => {
    expect(v2(85)).not.toContain("data-amazon-top");
  });
});

describe("AmazonTopCta ohne oben (nach Fazit, ganz unten)", () => {
  it("alter Hinweis, keine Top-Markierung, Punkte-Regel gleich", () => {
    const g = renderToStaticMarkup(<AmazonTopCta url={URL_OK} rot={false} oben={false} />);
    expect(g).toContain(AFFILIATE_HINWEIS);
    expect(g).not.toContain(AFFILIATE_HINWEIS_OBEN);
    expect(g).not.toContain("data-amazon-top");
    expect(g).toContain("Jetzt bei Amazon entdecken*");
    const r = renderToStaticMarkup(<AmazonTopCta url={URL_OK} rot oben={false} />);
    expect(r).toContain("Aktuellen Preis bei Amazon ansehen*");
    expect(r).toContain("keine Kaufempfehlung");
  });
});
