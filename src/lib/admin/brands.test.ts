import { describe, expect, it } from "vitest";
import { canonicalBrand, uniqueBrands } from "./brand-names";

describe("Marken", () => {
  it("fasst Schreibweisen zusammen und sortiert", () => {
    expect(uniqueBrands(["Nordrudel", "bellwerk", "Bellwerk", " Ähre ", null, "", "Zeus"])).toEqual(["Ähre", "bellwerk", "Nordrudel", "Zeus"]);
  });
  it("übernimmt vorhandene Schreibweise", () => {
    expect(canonicalBrand("  BELLWERK ", ["Bellwerk"])).toBe("Bellwerk");
    expect(canonicalBrand("Neue  Marke", ["Bellwerk"])).toBe("Neue Marke");
  });
});
