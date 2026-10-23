import { describe, expect, it } from "vitest";
import { sitemapEntries } from "./sitemap-entries";

const at = (iso: string) => new Date(iso);

describe("sitemapEntries", () => {
  it("setzt lastmod aus den echten updatedAt-Werten, nicht aus der Build-Zeit", () => {
    const entries = sitemapEntries({
      categories: [{ slug: "alleinfuttermittel-hund" }, { slug: "leer" }],
      reviews: [
        { slug: "alpha", updatedAt: at("2026-10-02T10:00:00.000Z"), categorySlug: "alleinfuttermittel-hund" },
        { slug: "beta", updatedAt: at("2026-10-09T10:00:00.000Z"), categorySlug: "alleinfuttermittel-hund" },
      ],
      posts: [{ slug: "ratgeber", updatedAt: at("2026-10-04T10:00:00.000Z") }],
      lexikon: [{ slug: "taurin", updatedAt: at("2026-09-01T10:00:00.000Z") }],
      glossary: [{ slug: "trockensubstanz", updatedAt: at("2026-08-01T10:00:00.000Z") }],
    });
    const byPath = Object.fromEntries(entries.map((entry) => [entry.path, entry.lastModified?.toISOString()]));
    expect(byPath["/tests"]).toBe("2026-10-09T10:00:00.000Z");
    expect(byPath["/blog"]).toBe("2026-10-04T10:00:00.000Z");
    expect(byPath["/lexikon"]).toBe("2026-09-01T10:00:00.000Z");
    expect(byPath["/glossar"]).toBe("2026-08-01T10:00:00.000Z");
    expect(byPath["/"]).toBe("2026-10-09T10:00:00.000Z");
    // Einzeltests: lastmod ist der neuere Wert aus Inhalt und Vorlagenänderung.
    expect(byPath["/alleinfuttermittel-hund"]).toBe("2026-10-23T12:00:00.000Z");
    expect(byPath["/alleinfuttermittel-hund/beta"]).toBe("2026-10-23T12:00:00.000Z");
    expect(byPath["/blog/ratgeber"]).toBe("2026-10-04T10:00:00.000Z");
    expect(byPath["/methodik"]).toBeUndefined();
    expect(byPath["/methodik/ergaenzungsfutter"]).toBe("2026-10-17T00:00:00.000Z");
    expect(byPath["/leer"]).toBeUndefined();
  });
});
