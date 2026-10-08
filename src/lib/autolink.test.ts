import { describe, expect, it } from "vitest";
import { autolinkUrls, shortUrl } from "./autolink";

describe("autolinkUrls", () => {
  it("verlinkt Text-URLs gekürzt, ohne Satzzeichen am Ende", () => {
    const out = autolinkUrls("<p>18. Öko-Test: https://www.oekotest.de/freizeit-technik/Hundefutter-im-Test-Mit-welchem-Trockenfutter_14968_1.html.</p>");
    expect(out).toContain('href="https://www.oekotest.de/freizeit-technik/Hundefutter-im-Test-Mit-welchem-Trockenfutter_14968_1.html"');
    expect(out).toContain(">oekotest.d…</a>.</p>");
    expect(out).toContain('rel="noopener nofollow"');
  });
  it("lässt Code und normale Linktexte unverändert", () => {
    const html = '<p><a href="https://a.de/x">Öko-Test</a> <code>https://b.de/y/sehr/lang</code></p>';
    expect(autolinkUrls(html)).toBe(html);
  });
  it("kürzt Links, deren Text eine lange URL ist", () => {
    expect(autolinkUrls('<p><a href="https://www.test.de/Trockenfutter-Hund">https://www.test.de/Trockenfutter-Hund</a></p>')).toBe('<p><a href="https://www.test.de/Trockenfutter-Hund">test.de/Tr…</a></p>');
  });
  it("ist idempotent", () => {
    const once = autolinkUrls("<p>Quelle: https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32009R0767</p>");
    expect(autolinkUrls(once)).toBe(once);
    expect(once).toContain(">eur-lex.eu…</a>");
  });
  it("Zeilenumbrüche im Text werden zu <br>, Leerraum zwischen Blöcken nicht", () => {
    expect(autolinkUrls("<p>Quellen\r\n1. Eins\r\n2. Zwei</p>\r\n<p>X</p>")).toBe("<p>Quellen<br>1. Eins<br>2. Zwei</p>\r\n<p>X</p>");
  });
  it("behält &amp; in URLs", () => {
    expect(autolinkUrls("<p>https://x.de/?a=1&amp;b=2</p>")).toContain('href="https://x.de/?a=1&amp;b=2"');
    expect(shortUrl("https://x.de/?a=1&amp;b=2")).toBe("x.de/?a=1&…");
    expect(shortUrl("https://kurz.de")).toBe("kurz.de");
  });
  it("null-sicher", () => expect(autolinkUrls(null)).toBe(""));
});
