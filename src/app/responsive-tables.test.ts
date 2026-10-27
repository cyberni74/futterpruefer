import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(__dirname, "globals.css"), "utf8");

describe("Tabellen unter md", () => {
  it("Kartenlayout gilt bis 767 px und bricht die Zeile nicht in die Höhe", () => {
    expect(css).toContain("@media (max-width: 767px)");
    expect(css).toContain(".prose-fp table:has(tr > :nth-child(3)):not(:has(tr > :nth-child(5))):not(.vt-table):not(:has(tr.vt-row)) tr { display: block; height: auto; min-height: 0; grid-template-columns: none; }");
    expect(css).toContain(".prose-fp .overflow-x-auto:has(> table:not(.vt-table)):not(:has(> table tr > :nth-child(5))) { overflow-x: visible; overflow-y: visible; max-width: 100%; }");
    expect(css).toContain(".prose-fp table:has(td[data-label]):has(tr > :nth-child(3)):not(:has(tr > :nth-child(5))):not(:has(tr.vt-row)) td:first-child::before { display: block; }");
  });
});
