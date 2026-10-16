import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AuthorCredit } from "./author-credit";
import { authorPath, DEFAULT_AUTHOR } from "@/lib/authors";

describe("AuthorCredit", () => {
  it("zeigt den Namen und verlinkt den sichtbaren Team-Anker", () => {
    const html = renderToStaticMarkup(<AuthorCredit />);
    expect(html).toContain(`>${DEFAULT_AUTHOR.name}<`);
    expect(html).toContain(`href="${authorPath()}"`);
    expect(html).not.toContain("Von ");
    expect(html).not.toContain("Futterprüfer");
  });

  it("gibt bei unbekanntem Slug den Standardautor aus", () => {
    const html = renderToStaticMarkup(<AuthorCredit slug="erfundene-person" />);
    expect(html).toContain(DEFAULT_AUTHOR.name);
    expect(html).not.toContain("erfundene-person");
  });
});
