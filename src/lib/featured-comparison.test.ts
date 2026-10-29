import { describe, expect, it } from "vitest";
import { FEATURED_COMPARISON, FEATURED_COMPARISONS, comparisonPath, showsWinnerSeal } from "./featured-comparison";

describe("Startseiten-Kästen Testsieger", () => {
  it("zeigt die Vergleiche neuester zuerst", () => {
    expect(FEATURED_COMPARISONS.map((c) => c.slug)).toEqual([
      "monoprotein-katzenfutter-test-2026",
      "veganes-katzenfutter-test-oktober-2026",
      "veganes-hundefutter-test-oktober-2026",
      "gelenk-test-hund-oktober-2026",
      "nassfutter-test-rind-hund-oktober-2026",
    ]);
    expect(FEATURED_COMPARISON?.slug).toBe("monoprotein-katzenfutter-test-2026");
    const gelenk = FEATURED_COMPARISONS.find((c) => c.slug === "gelenk-test-hund-oktober-2026");
    expect(gelenk?.summary).toBe(
      "Vier Gelenk-Ergänzungsfutter für Hunde im Vergleich. Cadoc liegt mit 64 von 100 Punkten (Gelb) vorn, die drei anderen Produkte sind Rot.",
    );
  });

  it("gibt VUTTER Gelb einen Pokal und Rot keinen", () => {
    const katze = FEATURED_COMPARISONS.find((c) => c.slug === "veganes-katzenfutter-test-oktober-2026");
    const hund = FEATURED_COMPARISONS.find((c) => c.slug === "veganes-hundefutter-test-oktober-2026");
    expect(katze?.winner).toBeUndefined();
    expect(katze?.score).toBeUndefined();
    expect(katze?.imageAltFallback).not.toMatch(/pokal/i);
    expect(showsWinnerSeal(katze!)).toBe(false);
    expect(showsWinnerSeal({ winner: "AMI Cat", score: 59 })).toBe(false);
    const mono = FEATURED_COMPARISONS.find((c) => c.slug === "monoprotein-katzenfutter-test-2026");
    expect(mono?.winner).toBe("GranataPet DeliCatessen Huhn PUR");
    expect(mono?.score).toBe(74);
    expect(mono?.month).toBe(10);
    expect(mono?.year).toBe(2026);
    expect(mono?.imageAltFallback).toMatch(/Pokal Testsieger/);
    expect(showsWinnerSeal(mono!)).toBe(true);
    expect(hund?.winner).toBe("VUTTER Nassfutter Wie Ente");
    expect(hund?.score).toBe(75);
    expect(showsWinnerSeal(hund!)).toBe(true);
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
      if (c.score != null) {
        expect(c.score).toBeGreaterThanOrEqual(0);
        expect(c.score).toBeLessThanOrEqual(100);
        expect(c.winner).toBeTruthy();
      } else {
        expect(c.winner).toBeUndefined();
      }
      expect(c.month).toBeGreaterThanOrEqual(1);
      expect(c.month).toBeLessThanOrEqual(12);
    }
  });
});
