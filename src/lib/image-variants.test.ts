import { describe, expect, it } from "vitest";
import { isVariantName, responsiveImage, variantName } from "./image-variants";

const SUPA = "https://cotopvhmsqztjtdsdnoc.supabase.co/storage/v1/object/public/bilder/alter-hund-abc123.webp";

describe("variantName", () => {
  it("hängt die Breite vor die Endung", () => {
    expect(variantName("alter-hund-abc123.webp", 400)).toBe("alter-hund-abc123-400.webp");
    expect(isVariantName("alter-hund-abc123-800.webp")).toBe(true);
    expect(isVariantName("alter-hund-abc123.webp")).toBe(false);
  });
});

describe("responsiveImage", () => {
  it("liefert für Amazon mehrere Größenstufen und eine 500-px-Standardgröße", () => {
    const r = responsiveImage("https://m.media-amazon.com/images/I/abc._AC_SL1500_.jpg");
    expect(r.src).toBe("https://m.media-amazon.com/images/I/abc._AC_SL500_.jpg");
    expect(r.srcSet).toBe(
      "https://m.media-amazon.com/images/I/abc._AC_SL300_.jpg 300w, https://m.media-amazon.com/images/I/abc._AC_SL500_.jpg 500w, https://m.media-amazon.com/images/I/abc._AC_SL800_.jpg 800w, https://m.media-amazon.com/images/I/abc._AC_SL1000_.jpg 1000w",
    );
  });

  it("nutzt lokale Varianten aus dem Manifest, sonst nur die eine URL", () => {
    const hero = responsiveImage("/brand/drei-hunde-auf-blumenwiese-hundefutter-test.webp");
    expect(hero.srcSet).toContain("-400.webp 400w");
    expect(hero.srcSet).toContain("hundefutter-test.webp 640w");
    expect(responsiveImage("/tests/unbekannt.webp")).toEqual({ src: "/tests/unbekannt.webp" });
  });

  it("setzt für Supabase-Bilder erst nach dem Bereit-Flag ein srcset (hier: Flag aus)", () => {
    expect(responsiveImage(SUPA)).toEqual({ src: SUPA });
  });

  it("lässt fremde Hosts und ungültige Angaben unverändert", () => {
    expect(responsiveImage("https://example.com/a.webp")).toEqual({ src: "https://example.com/a.webp" });
    expect(responsiveImage("kein-link")).toEqual({ src: "kein-link" });
  });
});
