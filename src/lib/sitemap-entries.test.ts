import { describe, expect, it } from "vitest";
import { STATIC_LASTMOD, sitemapEntries } from "./sitemap-entries";

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
    expect(byPath["/methodik"]).toBe(STATIC_LASTMOD["/methodik"].toISOString());
    expect(byPath["/futterrechner"]).toBe(STATIC_LASTMOD["/futterrechner"].toISOString());
    expect(byPath["/team"]).toBe(STATIC_LASTMOD["/team"].toISOString());
    expect(byPath["/datenschutz"]).toBe(STATIC_LASTMOD["/datenschutz"].toISOString());
    expect(byPath["/methodik/ergaenzungsfutter"]).toBe("2026-10-17T00:00:00.000Z");
    expect(byPath["/leer"]).toBe("2026-10-09T10:00:00.000Z");
    for (const entry of entries) expect(entry.lastModified, entry.path).toBeInstanceOf(Date);
  });

  it("enthält jeden veröffentlichten Test, Beitrag und Lexikon-Eintrag sowie die Futterrechner-Seiten", () => {
    const reviews = ["a", "b", "c"].map((slug, i) => ({ slug, updatedAt: at(`2026-10-0${i + 1}T10:00:00.000Z`), categorySlug: i < 2 ? "alleinfuttermittel-hund" : "alleinfuttermittel-katze" }));
    const posts = ["p1", "p2"].map((slug) => ({ slug, updatedAt: at("2026-10-04T10:00:00.000Z") }));
    const lexikon = ["l1", "l2"].map((slug) => ({ slug, updatedAt: at("2026-09-01T10:00:00.000Z") }));
    const paths = sitemapEntries({
      categories: [{ slug: "alleinfuttermittel-hund" }, { slug: "alleinfuttermittel-katze" }],
      reviews, posts, lexikon, glossary: [], brands: [
        { slug: "marke-x", updatedAt: at("2026-10-01T10:00:00.000Z"), count: 2 },
        { slug: "nur-eins", updatedAt: at("2026-10-01T10:00:00.000Z"), count: 1 },
      ],
    }).map((e) => e.path);
    for (const r of reviews) expect(paths).toContain(`/${r.categorySlug}/${r.slug}`);
    for (const p of posts) expect(paths).toContain(`/blog/${p.slug}`);
    for (const l of lexikon) expect(paths).toContain(`/lexikon/${l.slug}`);
    expect(paths).toContain("/marken/marke-x");
    expect(paths).not.toContain("/marken/nur-eins");
    for (const fixed of ["/futterrechner", "/futterrechner/hund", "/futterrechner/katze", "/methodik", "/methodik/ergaenzungsfutter", "/faq"]) expect(paths).toContain(fixed);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("ohne Datenbank bleiben die statischen Seiten inklusive Futterrechner erhalten", () => {
    const paths = sitemapEntries({ categories: [], reviews: [], posts: [], lexikon: [], glossary: [] }).map((e) => e.path);
    expect(paths).toEqual(expect.arrayContaining(["/futterrechner", "/futterrechner/hund", "/futterrechner/katze"]));
  });
});
