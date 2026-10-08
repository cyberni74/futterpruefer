import { describe, expect, it } from "vitest";
import { autolinkUrls, shortUrl } from "./autolink";

describe("autolinkUrls", () => {
  it("verlinkt Text-URLs gekürzt, ohne Satzzeichen am Ende", () => {
    const out = autolinkUrls("<p>18. Öko-Test: https://www.oekotest.de/freizeit-technik/Hundefutter-im-Test-Mit-welchem-Trockenfutter_14968_1.html.</p>");
    expect(out).toContain('href="https://www.oekotest.de/freizeit-technik/Hundefutter-im-Test-Mit-welchem-Trockenfutter_14968_1.html"');
    expect(out).toContain(">oekotest.de/freizeit-technik/Hundefutter-im-Tes…</a>.</p>");
    expect(out).toContain('rel="noopener nofollow"');
  });
  it("lässt bestehende Links und Code unverändert", () => {
    const html = '<p><a href="https://a.de/x">https://a.de/x</a> <code>https://b.de/y</code></p>';
    expect(autolinkUrls(html)).toBe(html);
  });
  it("Zeilenumbrüche im Text werden zu <br>, Leerraum zwischen Blöcken nicht", () => {
    expect(autolinkUrls("<p>Quellen\r\n1. Eins\r\n2. Zwei</p>\r\n<p>X</p>")).toBe("<p>Quellen<br>1. Eins<br>2. Zwei</p>\r\n<p>X</p>");
  });
  it("behält &amp; in URLs", () => {
    expect(autolinkUrls("<p>https://x.de/?a=1&amp;b=2</p>")).toContain('href="https://x.de/?a=1&amp;b=2"');
    expect(shortUrl("https://x.de/?a=1&amp;b=2")).toBe("x.de/?a=1&b=2");
  });
  it("null-sicher", () => expect(autolinkUrls(null)).toBe(""));
});
