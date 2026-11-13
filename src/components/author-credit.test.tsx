import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AuthorCredit, BylineText } from "./author-credit";
import { authorPath, SCHROETER } from "@/lib/authors";

describe("AuthorCredit", () => {
  it("zeigt „Redaktion Futterprüfer“ und verlinkt /team ohne Anker", () => {
    const html = renderToStaticMarkup(<AuthorCredit />);
    expect(html).toContain(">Redaktion Futterprüfer<");
    expect(html).toContain('href="/team"');
    expect(html).toContain(`href="${authorPath()}"`);
    expect(html).not.toContain("#");
    expect(html).not.toContain("sebastian-kraft");
    expect(html).not.toContain("Sebastian Kraft");
    expect(html).not.toContain("Von ");
    const legacy = renderToStaticMarkup(<AuthorCredit slug="sebastian-kraft" />);
    expect(legacy).toBe(html);
  });

  it("verlinkt Matthias Schröter auf seinen Team-Anker", () => {
    const html = renderToStaticMarkup(<AuthorCredit slug="matthias-schroeter" />);
    expect(html).toContain(">Matthias Schröter<");
    expect(html).toContain(`href="${authorPath(SCHROETER)}"`);
    expect(html).toContain('href="/team#matthias-schroeter"');
    expect(html).not.toContain("sameAs");
    expect(html).not.toContain("Sebastian Kraft");
    expect(html).not.toContain("sebastian-kraft");
  });

  it("ersetzt die Prüfstand-Zeile und lässt den übrigen Satz stehen", () => {
    const html = renderToStaticMarkup(
      <BylineText text="Preise laut Hersteller/UVP mit Stand 11.11.2026; feste Amazon-Preise nennen wir nicht. Autor: Sebastian Kraft, Futterprüfer.de (Karpas Web Solutions Ltd.); Geschäftsbeziehungen: keine." />,
    );
    expect(html).toContain("Stand 11.11.2026");
    expect(html).toContain("Geschäftsbeziehungen: keine.");
    expect(html).toContain('href="/team"');
    expect(html).toContain(">Redaktion Futterprüfer<");
    expect(html).toContain("Von ");
    expect(html).not.toContain("Sebastian Kraft");
    expect(html).not.toContain("#");
  });

  it("gibt bei unbekanntem Slug die Redaktion aus", () => {
    const html = renderToStaticMarkup(<AuthorCredit slug="erfundene-person" />);
    expect(html).toContain(">Redaktion Futterprüfer<");
    expect(html).toContain('href="/team"');
    expect(html).not.toContain("erfundene-person");
    expect(html).not.toContain("#");
  });
});
