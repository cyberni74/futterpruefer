import { describe, expect, it } from "vitest";
import { futterartVon, passendeTests, type TestKandidat } from "./test-auswahl";

const k = (o: Partial<TestKandidat>): TestKandidat => ({
  slug: "x", title: "Futter", brand: "Marke", productName: "Produkt", totalScore: 75, analysis: [],
  category: { slug: "alleinfuttermittel-hund", shortName: "Alleinfutter Hund", animal: "HUND" }, ...o,
});

describe("passende Tests", () => {
  it("erkennt die Futterart an der Feuchtigkeit", () => {
    expect(futterartVon(k({ analysis: [{ name: "Feuchtigkeit", value: 76 }] }))).toBe("nass");
    expect(futterartVon(k({ analysis: [{ name: "Feuchte", value: 9 }] }))).toBe("trocken");
    expect(futterartVon(k({ title: "Neutrales Futter" }))).toBeNull();
  });
  it("filtert Tierart, Futterart, Mindestpunkte und Ausschlussliste", () => {
    const trocken = [{ name: "Feuchte", value: 9 }];
    const list = [
      k({ slug: "a", totalScore: 82, analysis: trocken }),
      k({ slug: "b", totalScore: 70, analysis: trocken }),
      k({ slug: "rot", totalScore: 50, analysis: trocken }),
      k({ slug: "canina", brand: "Canina", totalScore: 90, analysis: trocken }),
      k({ slug: "katze", totalScore: 90, analysis: trocken, category: { slug: "k", shortName: "K", animal: "KATZE" } }),
      k({ slug: "nass", totalScore: 90, analysis: [{ name: "Feuchtigkeit", value: 78 }] }),
    ];
    expect(passendeTests(list, "hund", "trocken").map((r) => r.slug)).toEqual(["a", "b"]);
  });
});
