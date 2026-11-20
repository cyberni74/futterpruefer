import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ErgaenzungsfutterHub } from "./ergaenzungsfutter-hub";
import { PRICE_PER_DAY_FOOTNOTE } from "@/lib/comparison-table";

const A3 =
  "Ergänzungsfuttermittel ergänzen eine Ration. Mit der Verhütung, Behandlung oder Heilung von Krankheiten dürfen sie nicht beworben werden (Art. 13 Abs. 3 VO (EG) Nr. 767/2009, mit eng begrenzten Ausnahmen). Wo eine Packung das trotzdem nahelegt, werten wir die Aussage ab; nach unserer Methodik schließt das Grün aus. Weicht eine Bewertung davon ab, etwa als Teamwertung, steht das auf der Testseite und auf der Methodik-Seite.";

const A4B =
  "Den Preis nennen wir als Betrag je Tagesdosis für einen Hund mit 10 kg zum Preisstand des Tests, wenn der Test ihn belegt.";

describe("Ergänzungsfutter-Hub Auflagen A3/A4", () => {
  it("setzt den neuen Kaufberatungs-Absatz und den Preisstand unter der Tabelle", () => {
    const html = renderToStaticMarkup(
      <ErgaenzungsfutterHub
        groups={{
          gelenke: [{ name: "Beispiel", href: "/x", score: 70, pricePerDay: 0.2, methodikVersion: "2" }],
        }}
        listing={<div>Liste</div>}
      />,
    );
    expect(html).toContain(A3);
    expect(html).not.toContain("nach unserer Lesart der Futtermittelvorschriften");
    expect(html).toContain(A4B);
    expect(html).toContain(PRICE_PER_DAY_FOOTNOTE);
  });
});
