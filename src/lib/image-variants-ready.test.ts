import { describe, expect, it, vi } from "vitest";

vi.mock("@/data/image-variants-ready.json", () => ({ default: { supabase: true } }));

describe("responsiveImage mit Bereit-Flag", () => {
  it("setzt für Supabase-Bilder -400/-800 und das Original ins srcset", async () => {
    const { responsiveImage } = await import("./image-variants");
    const base = "https://cotopvhmsqztjtdsdnoc.supabase.co/storage/v1/object/public/bilder";
    const r = responsiveImage(`${base}/alter-hund-abc123.webp`);
    expect(r.src).toBe(`${base}/alter-hund-abc123.webp`);
    expect(r.srcSet).toBe(`${base}/alter-hund-abc123-400.webp 400w, ${base}/alter-hund-abc123-800.webp 800w, ${base}/alter-hund-abc123.webp 1600w`);
  });

  it("macht aus einer Variante keine weitere Variante", async () => {
    const { responsiveImage } = await import("./image-variants");
    const url = "https://cotopvhmsqztjtdsdnoc.supabase.co/storage/v1/object/public/bilder/alter-hund-abc123-400.webp";
    expect(responsiveImage(url)).toEqual({ src: url });
  });
});
