import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AMAZON_PRICE_CTA, PriceBlock } from "./price-block";

const date = new Date("2026-10-16T10:00:00Z");
const amazon = "https://www.amazon.de/dp/B000000000?tag=cyberni7400-21";

describe("Preisblock", () => {
  it("nennt Amazon mit kurzem Datum und dem Änderungshinweis", () => {
    const html = renderToStaticMarkup(<PriceBlock price={5.19} packageSize="300 g" pricePerKg={17.3} pricePerDay={0.87} priceDate={date} priceSource="Amazon" />);
    expect(html).toContain("Preis bei Amazon, Stand 16.10.2026.");
    expect(html).toContain("Preise können sich seitdem geändert haben.");
    expect(html).not.toContain("Oktober");
    expect(html).not.toContain("Preisstand:");
  });
  it("sagt Preis im Hersteller-Shop", () => {
    const html = renderToStaticMarkup(<PriceBlock price={5.19} pricePerKg={null} pricePerDay={null} priceDate={date} priceSource="Hersteller-Shop" />);
    expect(html).toContain("Preis im Hersteller-Shop, Stand 16.10.2026.");
    expect(html).toContain("Preise können je nach Händler abweichen.");
    expect(html).not.toContain("Preis bei Hersteller-Shop");
  });
  it("bleibt beim Stand, wenn keine Quelle vorliegt", () => {
    const html = renderToStaticMarkup(<PriceBlock price={5.19} pricePerKg={null} pricePerDay={null} priceDate={date} />);
    expect(html).toContain("Stand 16.10.2026.");
    expect(html).not.toContain("Preis bei");
    expect(html).not.toContain("Oktober");
  });
  it("zeigt ohne Datum keinen Preis, nur den Amazon-Button", () => {
    const html = renderToStaticMarkup(<PriceBlock price={5.19} pricePerKg={17.3} pricePerDay={0.87} priceDate={null} priceSource="Amazon" amazonUrl={amazon} />);
    expect(html).toContain(AMAZON_PRICE_CTA);
    expect(html).toContain(`href="${amazon}"`);
    expect(html).toContain('rel="sponsored nofollow noopener"');
    expect(html).toContain("tag=cyberni7400-21");
    expect(html).toContain("Affiliate-Link");
    expect(html).not.toMatch(/€|5,19|17,30/);
  });
  it("entfällt ohne Datum und ohne Link", () => {
    expect(renderToStaticMarkup(<PriceBlock price={5.19} pricePerKg={null} pricePerDay={null} priceDate={null} priceSource="Hersteller-Shop" />)).toBe("");
  });
});
