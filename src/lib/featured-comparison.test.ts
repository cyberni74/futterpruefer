import { describe, expect, it } from "vitest";
import { FEATURED_COMPARISON, comparisonPath } from "./featured-comparison";

describe("Startseiten-Kasten Testsieger", () => {
  it("verlinkt auf unseren Vergleichstest, nicht auf Amazon", () => {
    expect(FEATURED_COMPARISON).not.toBeNull();
    const c = FEATURED_COMPARISON!;
    expect(comparisonPath(c)).toBe("/blog/nassfutter-test-rind-hund-oktober-2026");
    expect(comparisonPath(c)).not.toMatch(/amazon|tag=/i);
  });

  it("nutzt keine gesperrten Wörter", () => {
    const text = JSON.stringify(FEATURED_COMPARISON);
    expect(text).not.toMatch(/unabhängig/i);
    expect(text).not.toMatch(/zulässig/i);
    expect(text).not.toContain("&amp;");
  });

  it("hat gültige Punkte und Monat", () => {
    const c = FEATURED_COMPARISON!;
    expect(c.score).toBeGreaterThanOrEqual(0);
    expect(c.score).toBeLessThanOrEqual(100);
    expect(c.month).toBeGreaterThanOrEqual(1);
    expect(c.month).toBeLessThanOrEqual(12);
  });
});
