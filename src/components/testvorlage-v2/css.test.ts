import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(__dirname, "../../styles/testvorlage-v2.css"), "utf-8").replace(/\/\*[\s\S]*?\*\//g, "");

/** Alle Selektoren (auch in @media) aus dem CSS. */
function selektoren(text: string): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < text.length) {
    const j = text.indexOf("{", i);
    if (j < 0) break;
    const kopf = text.slice(i, j).trim();
    let tiefe = 1;
    let k = j + 1;
    while (tiefe && k < text.length) { if (text[k] === "{") tiefe++; else if (text[k] === "}") tiefe--; k++; }
    if (kopf.startsWith("@media")) out.push(...selektoren(text.slice(j + 1, k - 1)));
    else out.push(...kopf.split(",").map((x) => x.trim()));
    i = k;
  }
  return out;
}

describe("testvorlage-v2.css", () => {
  it("jede Regel steht unter .tv2 (nichts wirkt auf andere Seiten)", () => {
    const fremd = selektoren(css).filter((s) => !s.startsWith(".tv2"));
    expect(fremd).toEqual([]);
  });
  it("enthält die verbindlichen Design-Tokens", () => {
    for (const t of ["--fp-green-900:#173C2D", "--fp-green-800:#174A36", "--fp-green-700:#245840", "--fp-green-600:#17845F", "--fp-mint-400:#BDE7D0", "--fp-mint-100:#EAF7EE", "--fp-mint-050:#F5FBF6", "--fp-background:#F6F8F5", "--fp-surface:#FFFFFF", "--fp-border:#DCE8DE", "--fp-text:#173C2D", "--fp-text-muted:#64746B", "--fp-warning:#BB8C31", "--fp-danger:#B64C48", "--fp-radius-sm:10px", "--fp-radius-md:14px", "--fp-radius-lg:18px", "--fp-radius-xl:24px", "--fp-content-width:1250px"]) {
      expect(css).toContain(t);
    }
  });
  it("Raster: 235 px Sidebar, 28 px Abstand, einspaltig unter 1024 px, Mobil bis 767 px", () => {
    expect(css).toContain("grid-template-columns:235px minmax(0,1fr);gap:28px");
    expect(css).toContain("@media(max-width:1023px)");
    expect(css).toContain("@media(max-width:767px)");
    expect(css).not.toMatch(/max-width:1040px|max-width:720px/);
  });
  it("Tachometer: groß höchstens 300 px, klein 150 bis 170 px", () => {
    expect(css).toContain(".tv2 .gauge--large{max-width:300px");
    expect(css).toMatch(/\.tv2 \.gauge--small\{max-width:160px/);
  });
  it("kein stroke-dasharray, keine fremden Globals (html, body, *)", () => {
    expect(css).not.toContain("stroke-dasharray");
  });
  it("unter 768 px werden Tabellen ab drei Spalten zu Karten mit Spaltenname", () => {
    expect(css).toContain("@media(max-width:767px)");
    expect(css).toContain(".tv2 table:has(td[data-label]):has(tr > :nth-child(3)):not(:has(tr > :nth-child(5)))");
    expect(css).toContain("content:attr(data-label)");
    expect(css).toContain(".tv2 table.data:not(:has(tr > :nth-child(3))){display:table");
  });
});
