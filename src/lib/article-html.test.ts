import { describe, expect, it } from "vitest";
import { criterionForHeading, enhanceArticle } from "./article-html";

describe("enhanceArticle", () => {
  it("vergibt eindeutige Anker und baut das Inhaltsverzeichnis", () => {
    const { html, toc } = enhanceArticle("<h2>Fazit</h2><p>a</p><h2 class=\"x\" id=\"alt\">Fazit</h2><h3>Unter</h3>");
    expect(toc).toEqual([{ id: "fazit", text: "Fazit" }, { id: "fazit-2", text: "Fazit" }]);
    expect(html).toContain('<h2 id="fazit">Fazit</h2>');
    expect(html).toContain('<h2 id="fazit-2" class="x">Fazit</h2>');
    expect(html).toContain("<h3>Unter</h3>");
  });
  it("Mini-Balken nach Kriterien-Überschriften", () => {
    const { html } = enhanceArticle("<h2>Rohstoffqualität im Detail</h2><h2>Schadstoffe &amp; Bedenkliches</h2><h2>Sonstiges</h2>", { scoreRaw: 27, scoreHarmful: 8 });
    expect(html).toContain('aria-label="Rohstoffqualität: 27 von 30 Punkten"');
    expect(html).toContain("crit-gut");
    expect(html).toContain('aria-label="Schadstoffe & Bedenkliches: 8 von 20 Punkten"');
    expect(html).toContain("crit-schlecht");
    expect(html.match(/crit-bar /g)?.length).toBe(2);
  });
  it("ohne Punkte keine Balken, leer bleibt leer", () => {
    expect(enhanceArticle("<h2>Nährstoffprofil</h2>").html).not.toContain("crit-bar");
    expect(enhanceArticle("")).toEqual({ html: "", toc: [] });
  });
  it("erkennt Kurznamen", () => {
    expect(criterionForHeading("Preis-Leistung: lohnt es sich?")?.key).toBe("scoreValue");
    expect(criterionForHeading("Deklaration")?.key).toBe("scoreDeclaration");
    expect(criterionForHeading("Allgemeines")).toBeNull();
  });
});
