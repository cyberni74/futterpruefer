import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MedienFigure } from "./MedienFigure";
import { kaufLink } from "./schema";

const img = <span data-bild="1" />;

describe("MedienFigure", () => {
  it("mit ASIN: Partnerlink mit rel, Tag, Label Werbung über dem Bild", () => {
    const url = kaufLink({ asin: "B0TESTASIN" }) as string;
    const h = renderToStaticMarkup(<MedienFigure kaufUrl={url} label="Beispiel" caption="Bild: Hersteller">{img}</MedienFigure>);
    expect(h).toContain('rel="sponsored nofollow noopener"');
    expect(h).toContain('target="_blank"');
    expect(h).toContain("https://www.amazon.de/dp/B0TESTASIN?tag=cyberni7400-21");
    expect(h).toContain('<span class="adlabel">Werbung</span>');
    expect(h.indexOf("adlabel")).toBeLessThan(h.indexOf("data-bild"));
    expect(h.indexOf("<a ")).toBeLessThan(h.indexOf("data-bild"));
    expect(h).toContain("<figcaption>Bild: Hersteller</figcaption>");
  });
  it("ohne ASIN: kein Link, kein Label, Unterschrift bleibt", () => {
    const h = renderToStaticMarkup(<MedienFigure kaufUrl={null} label="Beispiel" caption="Verpackung">{img}</MedienFigure>);
    expect(h).not.toContain("<a ");
    expect(h).not.toContain("Werbung");
    expect(h).toContain("<figcaption>Verpackung</figcaption>");
  });
  it("ohne Unterschrift keine figcaption", () => {
    expect(renderToStaticMarkup(<MedienFigure label="x">{img}</MedienFigure>)).not.toContain("figcaption");
  });
});
