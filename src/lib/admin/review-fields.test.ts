import { describe, expect, it } from "vitest";
import { reviewFormToRaw, reviewSchema } from "./schemas";

const base: Record<string, string> = {
  title: "Testfutter Rind", slug: "testfutter-rind", brand: "Test", productName: "Rind", keyword: "", categoryId: "c1", priceClass: "MITTEL", pricePerKg: "",
  imageUrl: "/uploads/v.webp", imageAlt: "Verpackung", imageBlur: "", contentImageUrl: "/uploads/i.webp", contentImageAlt: "Inhalt", contentImageBlur: "", scoreRaw: "20", scoreHarmful: "15", scoreNutrients: "15", scoreDeclaration: "10", scoreNeeds: "8", scoreValue: "4",
  verdict: "Ein solides Futter mit klarer Deklaration.", harmfulReason: "", composition: "Rind (60 %), Reis", analysis: "", packageSize: "400 g", price: "3,90", pricePerDay: "", priceDate: "2026-10-01", testedAt: "",
  claims: "", bodyHtml: "<p>x</p>", metaTitle: "", metaDescription: "", keywords: "", publishMode: "now", scheduledAt: "",
};
const form = (over: Record<string, string> = {}, lists: Record<string, string[]> = { pros: ["a", "b"], cons: ["c", "d"] }) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries({ ...base, ...over })) fd.set(k, v);
  for (const [k, vs] of Object.entries(lists)) vs.forEach((v) => fd.append(k, v));
  return reviewSchema.safeParse(reviewFormToRaw(fd));
};
const paths = (r: ReturnType<typeof form>) => (r.success ? [] : r.error.issues.map((i) => String(i.path[0])));

describe("Testartikel-Formular", () => {
  it("akzeptiert vollständige Produktdaten", () => {
    const r = form({ analysis: JSON.stringify([{ name: "Rohprotein", value: 10.5 }]), claims: JSON.stringify([{ claim: "getreidefrei", rating: "ZULAESSIG", reason: "" }]) });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.price).toBe(3.9);
      expect(r.data.pricePerDay).toBeNull();
      expect(r.data.priceDate?.toISOString().slice(0, 10)).toBe("2026-10-01");
      expect(r.data.testedAt).toBeNull();
      expect(r.data.analysis).toEqual([{ name: "Rohprotein", value: 10.5 }]);
      expect(r.data.claims[0].rating).toBe("ZULAESSIG");
    }
  });
  it("Warnbegründung ist Pflicht bei Schadstoffen < 10", () => {
    expect(paths(form({ scoreHarmful: "8" }))).toContain("harmfulReason");
    expect(form({ scoreHarmful: "8", harmfulReason: "Enthält Zucker und BHA." }).success).toBe(true);
    expect(form({ scoreHarmful: "8", publishMode: "draft" }).success).toBe(true);
  });
  it("Veröffentlichen verlangt Verpackungs- und Inhaltsbild", () => {
    const r = form({ imageUrl: "", contentImageUrl: "" });
    expect(r.success).toBe(false);
    const paths = r.success ? [] : r.error.issues.map((i) => i.path[0]);
    expect(paths).toEqual(expect.arrayContaining(["imageUrl", "contentImageUrl"]));
    expect(form({ imageUrl: "", contentImageUrl: "", publishMode: "draft" }).success).toBe(true);
    expect(form({ contentImageAlt: "" }).success).toBe(false);
  });
  it("rote/gelbe Werbeaussagen brauchen eine Begründung", () => {
    expect(paths(form({ claims: JSON.stringify([{ claim: "heilt alles", rating: "UNZULAESSIG", reason: "" }]) }))).toContain("claims");
  });
  it("ungültige Werte werden abgelehnt", () => {
    expect(paths(form({ price: "abc" }))).toContain("price");
    expect(paths(form({ priceDate: "01.10.2026" }))).toContain("priceDate");
    expect(paths(form({ claims: "{kaputt" }))).toContain("claims");
  });
});
