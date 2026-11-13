import { describe, expect, it } from "vitest";
import { splitHeroCaption } from "./hero-caption";

describe("splitHeroCaption", () => {
  it("lässt Beiträge ohne Titelbild-Unterschrift unverändert", () => {
    const html = "<p>Text</p>";
    expect(splitHeroCaption(html)).toEqual({ caption: null, body: html });
    expect(splitHeroCaption(null)).toEqual({ caption: null, body: "" });
  });

  it("nimmt die Unterschrift aus dem Fließtext", () => {
    const r = splitHeroCaption('<p class="fp-titelbild-unterschrift">Titelbild: Symbolbild, KI-generiert.</p>\n<p>Text</p>');
    expect(r.caption).toBe("Titelbild: Symbolbild, KI-generiert.");
    expect(r.body).toBe("<p>Text</p>");
  });

  it("behält Links in der Unterschrift", () => {
    const r = splitHeroCaption('<p>Intro</p><p class="fp-titelbild-unterschrift">Foto: CSIRO (<a href="https://commons.wikimedia.org/wiki/File:X.jpg">X</a>)</p>');
    expect(r.caption).toContain('<a href="https://commons.wikimedia.org/wiki/File:X.jpg">X</a>');
    expect(r.body).toBe("<p>Intro</p>");
  });

  it("ignoriert leere Unterschriften", () => {
    expect(splitHeroCaption('<p class="fp-titelbild-unterschrift"> </p><p>T</p>')).toEqual({ caption: null, body: "<p>T</p>" });
  });
});
