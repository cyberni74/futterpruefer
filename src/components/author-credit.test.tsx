import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AuthorCredit } from "./author-credit";
import { authorPath, AUTHORS, DEFAULT_AUTHOR } from "@/lib/authors";

describe("AuthorCredit", () => {
  it("zeigt den Namen und verlinkt den sichtbaren Team-Anker", () => {
    const html = renderToStaticMarkup(<AuthorCredit />);
    expect(html).toContain(`>${DEFAULT_AUTHOR.name}<`);
    expect(html).toContain(`href="${authorPath()}"`);
    expect(html).not.toContain("Von ");
    expect(html).not.toContain("Futterprüfer");
  });

  it("verlinkt Matthias Schröter auf seinen Team-Anker", () => {
    const matthias = AUTHORS[1];
    expect(matthias.slug).toBe("matthias-schroeter");
    const html = renderToStaticMarkup(<AuthorCredit slug="matthias-schroeter" />);
    expect(html).toContain(">Matthias Schröter<");
    expect(html).toContain(`href="${authorPath(matthias)}"`);
    expect(html).toContain('href="/team#matthias-schroeter"');
    expect(html).not.toContain("sameAs");
    expect(html).not.toContain("Sebastian Kraft");
  });

  it("gibt bei unbekanntem Slug den Standardautor aus", () => {
    const html = renderToStaticMarkup(<AuthorCredit slug="erfundene-person" />);
    expect(html).toContain(DEFAULT_AUTHOR.name);
    expect(html).not.toContain("erfundene-person");
  });
});
