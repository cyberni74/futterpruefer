import { describe, expect, it } from "vitest";
import { linkify, type LinkTerm } from "./linkify";

const t = (id: string, patterns: string[], title = "Info"): LinkTerm => ({ id, patterns, href: `/lexikon/${id}`, title, className: "lex" });

describe("linkify", () => {
  it("verlinkt das erste Vorkommen nur einmal, auch über mehrere Abschnitte", () => {
    const terms = [t("taurin", ["Taurin"])];
    const used = new Set<string>();
    const first = linkify("<p>Taurin steht hier.</p>", terms, used);
    const second = linkify("<p>Taurin steht noch einmal.</p>", terms, used);
    expect(first.match(/<a /g)?.length).toBe(1);
    expect(second).not.toContain("<a ");
  });
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
  it("nicht in Überschriften, Links, Code oder Buttons", () => {
    const html = '<h2>Taurin</h2><p><a href="/x">Taurin</a> <code>Taurin</code> <button>Taurin</button></p><p>Taurin hier</p>';
    const out = linkify(html, [t("taurin", ["Taurin"])]);
    expect(out).toContain("<h2>Taurin</h2>");
    expect(out).toContain('<a href="/x">Taurin</a>');
    expect(out).toContain("<code>Taurin</code>");
    expect(out).toContain("<button>Taurin</button>");
    expect(out).toContain('<p><a href="/lexikon/taurin" class="lex" title="Info">Taurin</a> hier</p>');
  });
  it("verlinkt bei gleichem Wort das Lexikon, nicht das später übergebene Glossar", () => {
    const lex = t("taurin", ["Taurin"]);
    const gloss = { ...t("gl", ["Taurin"]), href: "/glossar#taurin", id: "gl" };
    const out = linkify("<p>Taurin fehlt oft.</p>", [lex, gloss]);
    expect(out).toContain('href="/lexikon/taurin"');
    expect(out).not.toContain("/glossar#");
    expect(out.match(/<a /g)?.length).toBe(1);
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
  it("verlinkt nicht in Zitaten, Anführungen und Aussage-Zellen", () => {
    const term = t("zucker", ["Zucker"], "Im Lexikon: Zucker");
    const quote = linkify("<blockquote><p>Zucker ist süß.</p></blockquote><p>Zucker danach.</p>", [term]);
    expect(quote).toContain("<blockquote><p>Zucker ist süß.</p></blockquote>");
    expect(quote).toContain("<p><a href=\"/lexikon/zucker\"");
    const inline = linkify("<p><q>Zucker</q> und Zucker.</p>", [term]);
    expect(inline).toContain("<q>Zucker</q>");
    expect(inline.match(/<a /g)?.length).toBe(1);
    const table = linkify(
      '<table><tr><td data-label="Aussage">ohne Zucker</td><td data-label="Begründung">Zucker bleibt.</td></tr></table>',
      [term],
    );
    expect(table).toContain('data-label="Aussage">ohne Zucker</td>');
    expect(table).toContain('>Zucker</a> bleibt');
  });
  it("setzt an „ohne Zucker“ keinen Bedenklichkeits-Punkt", () => {
    const term = t("zucker", ["Zucker"], "Im Lexikon: Zucker");
    term.className = "lex-link lex-bedenklich";
    const out = linkify("<p>Das Futter ist ohne Zucker zusammengesetzt.</p>", [term]);
    expect(out).toContain('class="lex-link lex-ohne-marker"');
    expect(out).not.toContain("lex-bedenklich");
    expect(out).toContain('title="Im Lexikon: Zucker"');
  });
  it("null-sicher und ohne Begriffe unverändert", () => {
    expect(linkify(null, [])).toBe("");
    expect(linkify("<p>x</p>", [])).toBe("<p>x</p>");
    expect(linkify("<p>ab</p>", [t("ab", ["ab"])])).toBe("<p>ab</p>");
  });
});
