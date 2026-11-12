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
      "Vier Gelenk-Ergänzungsfutter für Hunde im Vergleich. Cadoc liegt mit 59 von 100 Punkten (Gelb) vorn, die drei anderen Produkte sind Rot.",
    );
  });

  it("gibt Green Crunch Gelb einen Pokal und Rot keinen", () => {
    const katze = FEATURED_COMPARISONS.find((c) => c.slug === "veganes-katzenfutter-test-oktober-2026");
    const hund = FEATURED_COMPARISONS.find((c) => c.slug === "veganes-hundefutter-test-oktober-2026");
    expect(katze?.winner).toBeUndefined();
    expect(katze?.score).toBeUndefined();
    expect(katze?.imageAltFallback).not.toMatch(/pokal/i);
    expect(showsWinnerSeal(katze!)).toBe(false);
    expect(showsWinnerSeal({ winner: "AMI Cat", score: 50 })).toBe(false)
    expect(showsWinnerSeal({ winner: "AMI Cat", score: 51 })).toBe(true);
    const mono = FEATURED_COMPARISONS.find((c) => c.slug === "monoprotein-katzenfutter-test-2026");
    expect(mono?.winner).toBeUndefined();
    expect(mono?.score).toBe(59);
    expect(mono?.month).toBe(10);
    expect(mono?.year).toBe(2026);
    expect(mono?.testName).toBe(
      "Monoprotein-Katzenfutter im Test, Oktober 2026: drei Futter punktgleich auf Platz 1",
    );
    expect(mono?.imageAltFallback).toBe(
      "Monoprotein-Katzenfutter im Test, Oktober 2026: drei Futter punktgleich mit 59 von 100 Punkten, Gelb",
    );
    expect(mono?.imageAltFallback).not.toMatch(/pokal|testsieger/i);
    expect(showsWinnerSeal(mono!)).toBe(false);
    expect(hund?.winner).toBe("VEGDOG Green Crunch");
    expect(hund?.score).toBe(59);
    expect(hund?.summary).toContain("Alle drei liegen bei 59 von 100 Punkten (Gelb).");
    expect(hund?.summary).toContain("Beim Gleichstand entscheidet das Nährstoffprofil");
    const farmer = hund?.summary.indexOf("VEGDOG Farmer's Crunch") ?? -1;
    const vutter = hund?.summary.indexOf("VUTTER Nassfutter Wie Ente") ?? -1;
    expect(farmer).toBeGreaterThan(-1);
    expect(vutter).toBeGreaterThan(farmer);
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
        // Gleichstand: score ohne winner ist zulässig.
      }
      if (c.winner) {
        expect(c.score).toBeDefined();
      } else if (c.score == null) {
        expect(c.winner).toBeUndefined();
      }
      expect(c.month).toBeGreaterThanOrEqual(1);
      expect(c.month).toBeLessThanOrEqual(12);
    }
  });
});
