import { describe, expect, it } from "vitest";
import {
  BLOG_SLUG_CANONICAL,
  BLOG_SLUG_REDIRECTS,
  blogPath,
  blogSlugLookupKeys,
  canonicalBlogSlug,
  databaseBlogSlug,
} from "./blog-slug-aliases";

describe("blog-slug-aliases", () => {
  it("setzt Gelenk- und Lachsöl-Vergleiche auf evergreen Canonicals", () => {
    expect(canonicalBlogSlug("gelenk-test-hund-oktober-2026")).toBe("gelenktabletten-hund-vergleich");
    expect(canonicalBlogSlug("lachsoel-test-hund-oktober-2026")).toBe("lachsoel-hund-vergleich");
    expect(canonicalBlogSlug("kotfresser-drops-test")).toBe("kotfresser-drops-test");
    expect(databaseBlogSlug("gelenktabletten-hund-vergleich")).toBe("gelenk-test-hund-oktober-2026");
    expect(blogPath("gelenk-test-hund-oktober-2026")).toBe("/blog/gelenktabletten-hund-vergleich");
    expect(blogPath("gelenktabletten-hund-vergleich")).toBe("/blog/gelenktabletten-hund-vergleich");
  });

  it("liefert Lookup-Schlüssel für alt und neu", () => {
    expect(blogSlugLookupKeys("gelenktabletten-hund-vergleich").sort()).toEqual(
      ["gelenk-test-hund-oktober-2026", "gelenktabletten-hund-vergleich"].sort(),
    );
  });

  it("hat 301-Paare ohne Konflikt mit sich selbst", () => {
    expect(BLOG_SLUG_REDIRECTS).toEqual([
      { source: "/blog/gelenk-test-hund-oktober-2026", destination: "/blog/gelenktabletten-hund-vergleich" },
      { source: "/blog/lachsoel-test-hund-oktober-2026", destination: "/blog/lachsoel-hund-vergleich" },
    ]);
    for (const rule of BLOG_SLUG_REDIRECTS) {
      expect(rule.source).not.toBe(rule.destination);
      expect(Object.values(BLOG_SLUG_CANONICAL)).toContain(rule.destination.replace("/blog/", ""));
    }
  });
});
