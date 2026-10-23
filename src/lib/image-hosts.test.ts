import { describe, expect, it } from "vitest";
import { amazonSizedUrl, isAllowedImageUrl, isAmazonHotlink } from "./image-hosts";

const BLOB = "https://xwpsp3svpsdhnsdw.public.blob.vercel-storage.com/bilder/rinti-abc123.webp";
const SUPABASE = "https://cotopvhmsqztjtdsdnoc.supabase.co/storage/v1/object/public/bilder/rinti-abc123.webp";

describe("isAllowedImageUrl", () => {
  it("erlaubt eigene Pfade, Blob und den öffentlichen Supabase-Bucket", () => {
    expect(isAllowedImageUrl("")).toBe(true);
    expect(isAllowedImageUrl("/uploads/x.webp")).toBe(true);
    expect(isAllowedImageUrl("/demo/pack.webp")).toBe(true);
    expect(isAllowedImageUrl(BLOB)).toBe(true);
    expect(isAllowedImageUrl(SUPABASE)).toBe(true);
  });

  it("lehnt andere Adressen ab", () => {
    expect(isAllowedImageUrl("javascript:alert(1)")).toBe(false);
    expect(isAllowedImageUrl("http://x.de/a.jpg")).toBe(false);
    expect(isAllowedImageUrl("https://evil.example/bild.webp")).toBe(false);
    expect(isAllowedImageUrl("https://cotopvhmsqztjtdsdnoc.supabase.co.evil.example/storage/v1/object/public/bilder/a.webp")).toBe(false);
    expect(isAllowedImageUrl("https://cotopvhmsqztjtdsdnoc.supabase.co/storage/v1/object/public/andere/a.webp")).toBe(false);
    expect(isAllowedImageUrl("https://cotopvhmsqztjtdsdnoc.supabase.co/storage/v1/object/bilder/a.webp")).toBe(false);
    expect(isAllowedImageUrl("https://public.blob.vercel-storage.com/a.webp")).toBe(false);
    expect(isAllowedImageUrl("https://user:pw@xwpsp3svpsdhnsdw.public.blob.vercel-storage.com/a.webp")).toBe(false);
    expect(isAllowedImageUrl("https://m.media-amazon.com/other/a.jpg")).toBe(false);
    expect(isAllowedImageUrl("https://evil.m.media-amazon.com.example/images/I/a.jpg")).toBe(false);
  });

  it("erlaubt Amazon-Galerie-Hotlinks nur unter /images/I/", () => {
    const src = "https://m.media-amazon.com/images/I/71F9cjXp+ZL._AC_SL1500_.jpg";
    expect(isAmazonHotlink(src)).toBe(true);
    expect(isAllowedImageUrl(src)).toBe(true);
    expect(isAmazonHotlink("https://m.media-amazon.com/images/G/other.jpg")).toBe(false);
  });
});

describe("amazonSizedUrl", () => {
  it("ersetzt die Größe im Dateinamen", () => {
    expect(amazonSizedUrl("https://m.media-amazon.com/images/I/abc._AC_SL1500_.jpg", 500)).toBe("https://m.media-amazon.com/images/I/abc._AC_SL500_.jpg");
  });
  it("ergänzt die Größe ohne Größenteil und lässt andere Hosts unverändert", () => {
    expect(amazonSizedUrl("https://m.media-amazon.com/images/I/abc.jpg", 1000)).toBe("https://m.media-amazon.com/images/I/abc._AC_SL1000_.jpg");
    expect(amazonSizedUrl("https://example.com/a._AC_SL1500_.jpg", 500)).toBe("https://example.com/a._AC_SL1500_.jpg");
  });
});
