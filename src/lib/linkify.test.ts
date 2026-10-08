import { describe, expect, it } from "vitest";
import { linkify, type LinkTerm } from "./linkify";

const t = (id: string, patterns: string[], title = "Info"): LinkTerm => ({ id, patterns, href: `/lexikon/${id}`, title, className: "lex" });

describe("linkify", () => {
  it("verlinkt nur das erste Vorkommen", () => {
    const out = linkify("<p>Taurin ist wichtig. Taurin fehlt oft.</p>", [t("taurin", ["Taurin"])]);
    expect(out.match(/<a /g)?.length).toBe(1);
    expect(out).toContain('<a href="/lexikon/taurin" class="lex" title="Info">Taurin</a> ist wichtig');
  });
  it("ignoriert Groß-/Kleinschreibung und behält Originaltext", () => {
    expect(linkify("<p>enthält zucker</p>", [t("zucker", ["Zucker"])])).toContain(">zucker</a>");
  });
  it("nur ganze Wörter (auch mit Umlauten)", () => {
    expect(linkify("<p>Zuckerrübe und Rohzucker</p>", [t("zucker", ["Zucker"])])).not.toContain("<a ");
    expect(linkify("<p>Rohfett und Fett, Fettsäure</p>", [t("fett", ["Fett"])])).toBe('<p>Rohfett und <a href="/lexikon/fett" class="lex" title="Info">Fett</a>, Fettsäure</p>');
    expect(linkify("<p>Süßkartoffel und Kartoffel</p>", [t("kartoffel", ["Kartoffel"])])).toContain('und <a href="/lexikon/kartoffel"');
  });
  it("nicht in Überschriften, Links, Code", () => {
    const html = '<h2>Taurin</h2><p><a href="/x">Taurin</a> <code>Taurin</code></p><p>Taurin hier</p>';
    const out = linkify(html, [t("taurin", ["Taurin"])]);
    expect(out).toContain("<h2>Taurin</h2>");
    expect(out).toContain('<a href="/x">Taurin</a>');
    expect(out).toContain("<code>Taurin</code>");
    expect(out).toContain('<p><a href="/lexikon/taurin" class="lex" title="Info">Taurin</a> hier</p>');
  });
  it("längere Begriffe haben Vorrang, Synonyme zählen zum selben Begriff", () => {
    const terms = [t("neben", ["Nebenerzeugnisse"]), t("tier-neben", ["Tierische Nebenerzeugnisse", "tierische NE"])];
    const out = linkify("<p>Tierische Nebenerzeugnisse sind … tierische NE ebenso.</p>", terms);
    expect(out).toContain('href="/lexikon/tier-neben"');
    expect(out).not.toContain('href="/lexikon/neben"');
    expect(out.match(/<a /g)?.length).toBe(1);
  });
  it("Sonderzeichen und Attribute werden escaped", () => {
    const out = linkify("<p>BHA &amp; BHT</p>", [t("bha", ["BHA & BHT"], 'Antioxidans "synthetisch"')]);
    expect(out).toContain('title="Antioxidans &quot;synthetisch&quot;"');
    expect(out).toContain(">BHA &amp; BHT</a>");
  });
  it("null-sicher und ohne Begriffe unverändert", () => {
    expect(linkify(null, [])).toBe("");
    expect(linkify("<p>x</p>", [])).toBe("<p>x</p>");
    expect(linkify("<p>ab</p>", [t("ab", ["ab"])])).toBe("<p>ab</p>");
  });
});
