import { describe, expect, it } from "vitest";
import { reviewFormToRaw, reviewSchema } from "./schemas";

function form(extra: Record<string, string | string[]>) {
  const fd = new FormData();
  const base: Record<string, string> = {
    title: "Beispielprodukt A im Test", slug: "beispielprodukt-a", brand: "Beispielmarke", productName: "Beispielprodukt A", keyword: "", categoryId: "cat1", priceClass: "MITTEL", pricePerKg: "",
    imageUrl: "/uploads/a.webp", imageAlt: "Verpackung", contentImageUrl: "/uploads/b.webp", contentImageAlt: "Inhalt", publishMode: "now", scheduledAt: "",
  };
  for (const [k, v] of Object.entries({ ...base, ...extra })) for (const x of Array.isArray(v) ? v : [v]) fd.append(k, x);
  return fd;
}

describe("reviewSchema mit layout", () => {
  it("klassisch: Fazit, Pro und Contra bleiben Pflicht beim Veröffentlichen (unverändert)", () => {
    const r = reviewSchema.safeParse(reviewFormToRaw(form({ layout: "" })));
    expect(r.success).toBe(false);
    const paths = !r.success ? r.error.issues.map((i) => i.path.join(".")) : [];
    expect(paths).toEqual(expect.arrayContaining(["verdict", "pros", "cons"]));
  });
  it("TESTVORLAGE_V2: diese Pflichten entfallen (die Vorlage prüft ihre Inhalte selbst)", () => {
    const r = reviewSchema.safeParse(reviewFormToRaw(form({ layout: "TESTVORLAGE_V2" })));
    const paths = !r.success ? r.error.issues.map((i) => i.path.join(".")) : [];
    expect(paths).not.toContain("verdict");
    expect(paths).not.toContain("pros");
    expect(paths).not.toContain("cons");
    expect(paths).not.toContain("harmfulReason");
  });
  it("Bilder bleiben auch bei der Vorlage Pflicht", () => {
    const r = reviewSchema.safeParse(reviewFormToRaw(form({ layout: "TESTVORLAGE_V2", imageUrl: "", contentImageUrl: "" })));
    const paths = !r.success ? r.error.issues.map((i) => i.path.join(".")) : [];
    expect(paths).toEqual(expect.arrayContaining(["imageUrl", "contentImageUrl"]));
  });
});
