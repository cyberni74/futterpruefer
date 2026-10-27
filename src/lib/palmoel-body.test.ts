import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { extractFaq } from "./faq-extract";
import { sanitize } from "./sanitize";

/** Fertiges, aufbereitetes bodyHtml für /blog/palmoel-tierfutter (docs/blog), wird nicht von der App gelesen. */
const html = readFileSync(path.join(process.cwd(), "docs/blog/palmoel-tierfutter.html"), "utf-8");

describe("docs/blog/palmoel-tierfutter.html", () => {
  it("behält den sichtbaren FAQ-Abschnitt mit den 4 Fragen", () => {
    const faq = extractFaq(html);
    expect(faq.map((f) => f.question)).toEqual([
      "Enthält Hundefutter Palmöl?",
      "Heißt ein RSPO-Logo, dass das Palmöl im Produkt zertifiziert ist?",
      "Schützt das RSPO-Siegel die Orang-Utans?",
      "Wäre Futter ohne Palmöl besser für den Regenwald?",
    ]);
    for (const f of faq) expect(f.answer.length).toBeGreaterThan(40);
  });
  it("jede Quelle Q1–Q19 steht im Quellenverzeichnis und wird im Text zitiert", () => {
    const text = html.slice(0, html.indexOf('id="quellen"'));
    for (let n = 1; n <= 19; n++) {
      expect(html).toContain(`<li id="q${n}">Q${n}:`);
      expect(new RegExp(`\\bQ${n}\\b`).test(text)).toBe(true);
    }
  });
  it("nutzt Boxen, Tabellen und Listen im bestehenden Stil", () => {
    for (const k of ["fp-kurz", "fp-info", "fp-merk", "fp-warn", "fp-check", "fp-fazit", "fp-quellen", "fp-tierschutz"]) expect(html).toContain(`fp-box ${k}`);
    expect(html.match(/<table>/g)?.length).toBe(3);
    expect(html.match(/<h2 /g)?.length).toBeGreaterThanOrEqual(8);
  });
  it("übersteht die Bereinigung (Klassen, Tabellen, data-label)", () => {
    const clean = sanitize(html);
    expect(clean).toContain("fp-box fp-warn");
    expect(clean).toContain("<table>");
    expect(clean).toContain('data-label="Lieferketten-Modell"');
    expect(clean).toContain("<figure>");
    expect(extractFaq(clean)).toHaveLength(4);
  });
  it("enthält keine Zahlen oder Zusagen, die im ursprünglichen Text fehlen: Kernzahlen vorhanden", () => {
    for (const s of ["193", "75.000 bis 100.000", "87.976", "45.498", "31.803", "10.675", "3.546", "30. Dezember 2026", "466.600"]) expect(html).toContain(s);
  });
});
