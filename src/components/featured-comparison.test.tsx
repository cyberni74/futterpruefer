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
  it("zeigt bei VUTTER Gelb den Pokal und die Punktzahl", () => {
    const html = htmlFor("veganes-hundefutter-test-oktober-2026");
    expect(html).toContain('aria-label="Testsieger Veganes Hundefutter im Test, Oktober 2026"');
    expect(html).toContain("VUTTER Nassfutter Wie Ente");
    expect(html).toContain('aria-label="75 von 100 Punkten"');
    expect(html).toContain('href="/blog/veganes-hundefutter-test-oktober-2026"');
  });

  it("zeigt bei lauter Rot keinen Pokal und keine Punktzahl", () => {
    const html = htmlFor("veganes-katzenfutter-test-oktober-2026");
    expect(html).toContain("Kein Testsieger");
    expect(html).toContain("Vergleichstest · Veganes Katzenfutter im Test, Oktober 2026");
    expect(html).not.toContain('role="img"');
    expect(html).not.toContain("von 100 Punkten");
    expect(html).toContain("AMI Cat (59)");
    expect(html).toContain("alle Rot");
    expect(html).toContain('href="/blog/veganes-katzenfutter-test-oktober-2026"');
  });
});
