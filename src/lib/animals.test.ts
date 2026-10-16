import { describe, expect, it } from "vitest";
import { fitsAnimal, mentionedAnimals } from "./animals";

describe("mentionedAnimals", () => {
  it("erkennt Hund und Katze auch in Komposita", () => {
    expect(mentionedAnimals("Hundefutter im Napf")).toEqual(["HUND"]);
    expect(mentionedAnimals("Katzenfutter und Taurin")).toEqual(["KATZE"]);
    expect(mentionedAnimals("Zucker im Hunde- und Katzenfutter")).toEqual(["HUND", "KATZE"]);
    expect(mentionedAnimals("Deklaration lesen")).toEqual([]);
  });
});

describe("fitsAnimal", () => {
  it("lässt allgemeine Texte zu und sperrt die andere Tierart", () => {
    expect(fitsAnimal("Zucker im Futter", "HUND")).toBe(true);
    expect(fitsAnimal("Zucker im Hunde- und Katzenfutter", "KATZE")).toBe(true);
    expect(fitsAnimal("Nur für Katzen", "HUND")).toBe(false);
    expect(fitsAnimal("Welpenfutter", "HUND")).toBe(true);
  });
});
