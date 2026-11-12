import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { FeaturedComparisonHero } from "./featured-comparison";
import { FEATURED_COMPARISONS } from "@/lib/featured-comparison";

const post = { imageUrl: "/bild.webp", imageAlt: "Titelbild des Vergleichs", imageBlur: null };

function htmlFor(slug: string) {
  const comparison = FEATURED_COMPARISONS.find((c) => c.slug === slug);
  if (!comparison) throw new Error(slug);
  return renderToStaticMarkup(<FeaturedComparisonHero comparison={{ ...comparison, post }} />);
}

describe("Startseiten-Kasten Vergleichstest", () => {
  it("zeigt bei Green Crunch Gelb den Pokal und die Punktzahl", () => {
    const html = htmlFor("veganes-hundefutter-test-oktober-2026");
    expect(html).toContain('aria-label="Testsieger Veganes Hundefutter im Test, Oktober 2026"');
    expect(html).toContain("VEGDOG Green Crunch");
    expect(html).toContain('aria-label="59 von 100 Punkten"');
    expect(html).toContain('href="/blog/veganes-hundefutter-test-oktober-2026"');
  });

  it("zeigt bei lauter Rot keinen Pokal und keine Punktzahl", () => {
    const html = htmlFor("veganes-katzenfutter-test-oktober-2026");
    expect(html).toContain("Kein Testsieger");
    expect(html).toContain("Vergleichstest · Veganes Katzenfutter im Test, Oktober 2026");
    expect(html).not.toContain('role="img"');
    expect(html).not.toContain("von 100 Punkten");
    expect(html).toContain("AMI Cat (60");
    expect(html).toContain("Keine Empfehlung.");
    expect(html).toContain('href="/blog/veganes-katzenfutter-test-oktober-2026"');
  });

  it("zeigt beim Monoprotein-Gleichstand 59 Punkte und die Labelzeile, keinen Testsieger", () => {
    const html = htmlFor("monoprotein-katzenfutter-test-2026");
    expect(html).toContain("59 von 100 Punkten");
    expect(html).toContain("Monoprotein-Katzenfutter im Test, Oktober 2026: drei Futter punktgleich auf Platz 1");
    expect(html).not.toContain("Kein Testsieger");
    expect(html).not.toContain("Testsieger ·");
    expect(html).not.toMatch(/aria-label="Testsieger/);
    expect(html).toContain("Vergleichstest · Oktober 2026");
    expect(html).toContain('aria-label="59 von 100 Punkten"');
    expect(html).toContain('href="/blog/monoprotein-katzenfutter-test-2026"');
  });
});
