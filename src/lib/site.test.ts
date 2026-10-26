import { describe, expect, it } from "vitest";
import { absoluteUrl, SITE } from "./site";

describe("absoluteUrl", () => {
  it("gibt die Startseite ohne Schrägstrich aus", () => {
    expect(absoluteUrl("/")).toBe(SITE.url);
    expect(absoluteUrl()).toBe(SITE.url);
    expect(absoluteUrl("")).toBe(SITE.url);
  });

  it("lässt Unterseiten, Hash und Query unverändert", () => {
    expect(absoluteUrl("/tests")).toBe(`${SITE.url}/tests`);
    expect(absoluteUrl("tests")).toBe(`${SITE.url}/tests`);
    expect(absoluteUrl("/#faq")).toBe(`${SITE.url}/#faq`);
    expect(absoluteUrl("/?q=a")).toBe(`${SITE.url}/?q=a`);
  });

  it("erzeugt nie einen doppelten Schrägstrich nach dem Protokoll", () => {
    for (const p of ["/", "", "/tests", "tests", "/blog/x", "/marken/y"]) expect(absoluteUrl(p).replace(/^https?:\/\//, "")).not.toContain("//");
  });
});
