import { describe, expect, it } from "vitest";
import { FEATURED_COMPARISON, FEATURED_COMPARISONS, comparisonPath } from "./featured-comparison";

describe("Startseiten-Kästen Testsieger", () => {
  it("zeigt Gelenk-Test (neuester) vor Nassfutter-Test", () => {
    expect(FEATURED_COMPARISONS.map((c) => c.slug)).toEqual([
      "gelenk-test-hund-oktober-2026",
      "nassfutter-test-rind-hund-oktober-2026",
    ]);
    expect(FEATURED_COMPARISON?.slug).toBe("gelenk-test-hund-oktober-2026");
  });

  it("verlinkt auf unseren Vergleichstest, nicht auf Amazon", () => {
    for (const c of FEATURED_COMPARISONS) {
      expect(comparisonPath(c)).toBe(`/blog/${c.slug}`);
      expect(comparisonPath(c)).not.toMatch(/amazon|tag=/i);
    }
  });

  it("hat eindeutige Slugs", () => {
    const slugs = FEATURED_COMPARISONS.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("nutzt keine gesperrten Wörter und keine Wirkversprechen", () => {
    const text = JSON.stringify(FEATURED_COMPARISONS);
    expect(text).not.toMatch(/unabhängig/i);
    expect(text).not.toMatch(/zulässig/i);
    expect(text).not.toMatch(/betrug|rechtlich angreifbar/i);
    expect(text).not.toMatch(/regenerat|heilt|lindert|wirkt|schmerz/i);
    expect(text).not.toContain("&amp;");
  });

  it("hat gültige Punkte und Monat", () => {
    for (const c of FEATURED_COMPARISONS) {
      expect(c.score).toBeGreaterThanOrEqual(0);
      expect(c.score).toBeLessThanOrEqual(100);
      expect(c.month).toBeGreaterThanOrEqual(1);
      expect(c.month).toBeLessThanOrEqual(12);
    }
  });
});
