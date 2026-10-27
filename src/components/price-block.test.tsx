import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { PriceBlock } from "./price-block";

const date = new Date("2026-10-16T10:00:00Z");

describe("Preisblock", () => {
  it("nennt Quelle und Stand, wenn beides vorliegt", () => {
    const html = renderToStaticMarkup(<PriceBlock price={5.19} packageSize="300 g" pricePerKg={17.3} pricePerDay={0.87} priceDate={date} priceSource="Amazon" />);
    expect(html).toContain("Preis bei Amazon, Stand 16. Oktober 2026.");
    expect(html).toContain("Preise können je nach Händler abweichen.");
    expect(html).not.toContain("Preisstand:");
  });
  it("bleibt beim Preisstand, wenn keine Quelle vorliegt", () => {
    const html = renderToStaticMarkup(<PriceBlock price={5.19} pricePerKg={null} pricePerDay={null} priceDate={date} />);
    expect(html).toContain("Preisstand: 16. Oktober 2026.");
    expect(html).not.toContain("Preis bei");
  });
  it("nennt nur die Quelle, wenn kein Datum vorliegt", () => {
    const html = renderToStaticMarkup(<PriceBlock price={5.19} pricePerKg={null} pricePerDay={null} priceDate={null} priceSource="Hersteller-Shop" />);
    expect(html).toContain("Preis bei Hersteller-Shop.");
    expect(html).not.toContain("Stand");
  });
});
