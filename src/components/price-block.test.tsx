import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AMAZON_CTA, AMAZON_CTA_ROT, ROT_KEINE_KAUFEMPFEHLUNG } from "./testvorlage-v2/Sources";
import { AMAZON_PRICE_CTA, AmazonPriceCta, PriceBlock } from "./price-block";

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
  it("zeigt ohne Datum keinen Preis, nur den Amazon-Button (Gelb/Grün: entdecken)", () => {
    const html = renderToStaticMarkup(<PriceBlock price={5.19} pricePerKg={17.3} pricePerDay={0.87} priceDate={null} priceSource="Amazon" amazonUrl={amazon} />);
    expect(html).toContain(AMAZON_CTA);
    expect(html).not.toContain(AMAZON_CTA_ROT);
    expect(html).toContain(`href="${amazon}"`);
    expect(html).toContain('rel="sponsored nofollow noopener"');
    expect(html).toContain("tag=cyberni7400-21");
    expect(html).toContain("Affiliate-Link");
    expect(html).not.toContain(ROT_KEINE_KAUFEMPFEHLUNG);
    expect(html).not.toContain("keine Kaufempfehlung");
    expect(html).not.toMatch(/€|5,19|17,30/);
  });
  it("zeigt bei Rot den neutralen Preis-CTA und den Rot-Satz", () => {
    const html = renderToStaticMarkup(<PriceBlock price={null} pricePerKg={null} pricePerDay={null} priceDate={null} amazonUrl={amazon} rot />);
    expect(html).toContain(AMAZON_CTA_ROT);
    expect(html).toContain(AMAZON_PRICE_CTA);
    expect(html).toContain(ROT_KEINE_KAUFEMPFEHLUNG);
    expect(html).not.toContain(AMAZON_CTA);
  });
  it("AmazonPriceCta: Gelb entdecken ohne Rot-Satz, Rot ansehen mit Rot-Satz", () => {
    const gelb = renderToStaticMarkup(<AmazonPriceCta url={amazon} />);
    expect(gelb).toContain(AMAZON_CTA);
    expect(gelb).not.toContain(AMAZON_CTA_ROT);
    expect(gelb).not.toContain(ROT_KEINE_KAUFEMPFEHLUNG);
    expect(gelb).not.toContain("keine Kaufempfehlung");
    const rot = renderToStaticMarkup(<AmazonPriceCta url={amazon} rot />);
    expect(rot).toContain(AMAZON_CTA_ROT);
    expect(rot).not.toContain(AMAZON_CTA);
    expect(rot).toContain(ROT_KEINE_KAUFEMPFEHLUNG);
    expect(rot).toContain('class="rot-hinweis"');
  });
  it("datierten Preisblock lässt den Rot-Satz weg, weil kein Amazon-Button dasteht", () => {
    const html = renderToStaticMarkup(<PriceBlock price={5.19} pricePerKg={null} pricePerDay={null} priceDate={date} priceSource="Amazon" amazonUrl={amazon} rot />);
    expect(html).toContain("5,19");
    expect(html).not.toContain(AMAZON_CTA_ROT);
    expect(html).not.toContain(AMAZON_CTA);
    expect(html).not.toContain(ROT_KEINE_KAUFEMPFEHLUNG);
  });
  it("entfällt ohne Datum und ohne Link", () => {
    expect(renderToStaticMarkup(<PriceBlock price={5.19} pricePerKg={null} pricePerDay={null} priceDate={null} priceSource="Hersteller-Shop" />)).toBe("");
  });
});
