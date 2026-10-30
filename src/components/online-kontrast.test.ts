import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(__dirname, "../app/globals.css"), "utf-8");
const wert = (block: string, name: string) => new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`).exec(block)?.[1] ?? "";
const luminanz = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const kontrast = (a: string, b: string) => { const [x, y] = [luminanz(a), luminanz(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const hell = css.slice(css.indexOf("\n:root"), css.indexOf("\n.dark {"));
const dunkel = css.slice(css.indexOf("\n.dark {"));

describe("Gäste-online-Zeile: Lesbarkeit", () => {
  it("Text auf der Menüleiste hat mindestens 4,5:1 Kontrast (hell und dunkel)", () => {
    expect(kontrast(wert(hell, "--fg-muted"), wert(hell, "--surface"))).toBeGreaterThanOrEqual(4.5);
    expect(kontrast(wert(dunkel, "--fg-muted"), wert(dunkel, "--surface"))).toBeGreaterThanOrEqual(4.5);
    expect(kontrast(wert(hell, "--fg"), wert(hell, "--surface"))).toBeGreaterThanOrEqual(4.5);
    expect(kontrast(wert(dunkel, "--fg"), wert(dunkel, "--surface"))).toBeGreaterThanOrEqual(4.5);
  });
  it("die mobile Zeile ist 12 px groß (text-xs), nicht kleiner", () => {
    const quelle = readFileSync(join(__dirname, "online-counter.tsx"), "utf-8");
    expect(quelle).toContain("text-xs md:hidden");
    expect(quelle).not.toContain("text-[11px]");
  });
});
