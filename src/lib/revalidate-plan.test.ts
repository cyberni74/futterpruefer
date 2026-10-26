import { describe, expect, it } from "vitest";
import { isSafePath, parseRevalidateRequest, revalidationPlan } from "./revalidate-plan";

const paths = (p: ReturnType<typeof revalidationPlan>) => p.map((t) => (t.type ? `${t.path} [${t.type}]` : t.path));

describe("revalidationPlan", () => {
  it("nimmt für Blogbeiträge die genaue Seite, /blog, Startseite, Sitemap und RSS", () => {
    expect(paths(revalidationPlan("blog", ["pfotenbalsam-selber-machen-hund"]))).toEqual(["/", "/sitemap.xml", "/rss.xml", "/blog", "/blog/pfotenbalsam-selber-machen-hund"]);
  });

  it("nimmt für Tests /tests, Kategorie, genaue Seite und Marken, sobald die Kategorie bekannt ist", () => {
    const p = paths(revalidationPlan("review", ["leonardo-adult-gf-poultry-test"], ["alleinfuttermittel-katze"]));
    for (const expected of ["/", "/sitemap.xml", "/tests", "/marken", "/alleinfuttermittel-katze", "/alleinfuttermittel-katze/leonardo-adult-gf-poultry-test", "/[kategorie]/[slug] [page]"]) expect(p).toContain(expected);
    expect(p).not.toContain("/blog");
  });

  it("verwendet ohne Kategorie nur das Muster für alle Tests und erzeugt keine doppelten Einträge", () => {
    const p = paths(revalidationPlan("review", ["x-test", "x-test"]));
    expect(p).toContain("/[kategorie]/[slug] [page]");
    expect(p.some((x) => x.endsWith("/x-test"))).toBe(false);
    expect(new Set(p).size).toBe(p.length);
  });

  it("ignoriert ungültige Slugs", () => {
    expect(paths(revalidationPlan("blog", ["../etc", "A B", null, undefined, ""]))).toEqual(["/", "/sitemap.xml", "/rss.xml", "/blog"]);
  });
});

describe("isSafePath", () => {
  it("erlaubt Seitenpfade, aber kein Admin, keine API, keine Query", () => {
    for (const ok of ["/", "/blog", "/blog/x-y", "/marken/animonda"]) expect(isSafePath(ok)).toBe(true);
    for (const bad of ["", "blog", "/admin", "/admin/tests", "/api/revalidate", "/blog?x=1", "/a//b", "/../x", "/a b", "/x#y", `/${"a".repeat(200)}`]) expect(isSafePath(bad)).toBe(false);
  });
});

describe("parseRevalidateRequest", () => {
  it("akzeptiert all, kind mit slug(s) und paths", () => {
    expect(parseRevalidateRequest({ all: true })).toMatchObject({ ok: true, all: true });
    expect(parseRevalidateRequest({ kind: "blog", slug: "a-b" })).toMatchObject({ ok: true, kind: "blog", slugs: ["a-b"] });
    expect(parseRevalidateRequest({ kind: "review", slugs: ["a", "b"], category: "alleinfuttermittel-hund" })).toMatchObject({ ok: true, slugs: ["a", "b"], category: "alleinfuttermittel-hund" });
    expect(parseRevalidateRequest({ paths: ["/tests", "/blog"] })).toMatchObject({ ok: true, paths: ["/tests", "/blog"] });
  });

  it("lehnt leere, falsche oder zu große Anfragen ab", () => {
    for (const bad of [null, [], "x", {}, { kind: "ticker" }, { slug: "a" }, { kind: "blog", slug: "A B" }, { kind: "blog", slugs: Array.from({ length: 21 }, (_, i) => `s${i}`) }, { paths: ["/admin"] }, { kind: "review", slug: "a", category: "A B" }, { all: false }]) expect(parseRevalidateRequest(bad)).toMatchObject({ ok: false });
  });
});
