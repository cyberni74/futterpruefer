import { describe, expect, it } from "vitest";
import { fitsAnimal, mentionedAnimals, subjectAnimal } from "./animals";

describe("mentionedAnimals", () => {
  it("erkennt Hund und Katze auch in Komposita", () => {
    expect(mentionedAnimals("Hundefutter im Napf")).toEqual(["HUND"]);
    expect(mentionedAnimals("Katzenfutter und Taurin")).toEqual(["KATZE"]);
    expect(mentionedAnimals("Zucker im Hunde- und Katzenfutter")).toEqual(["HUND", "KATZE"]);
    expect(mentionedAnimals("Deklaration lesen")).toEqual([]);
  });
});

describe("subjectAnimal", () => {
  it("nimmt die Art aus Titel und Auszug, auch wenn ein Tag die andere nennt", () => {
    expect(subjectAnimal(
      "Taurin bei Katzen: Warum es lebenswichtig ist",
      "Katzen können Taurin nur begrenzt selbst bilden.",
      ["taurin katze", "hundefutter für katzen"],
    )).toBe("KATZE");
    expect(subjectAnimal(
      "Getreidefreies Hundefutter: Sinnvoll oder nur Marketing?",
      "Ist getreidefreies Hundefutter gesünder?",
      ["getreidefreies hundefutter", "getreidefreies katzenfutter"],
    )).toBe("HUND");
  });

  it("filtert nicht, wenn Titel und Auszug beide Arten nennen", () => {
    expect(subjectAnimal(
      "Fleischanteil in Hundefutter und Katzenfutter",
      "Für Hund und Katze gelten andere Grenzen.",
      ["hund"],
    )).toBeNull();
  });

  it("fällt auf einen eindeutigen Tag zurück", () => {
    expect(subjectAnimal("Etikett lesen", "So prüfen Sie die Deklaration.", ["welpenfutter"])).toBe("HUND");
    expect(subjectAnimal("Etikett lesen", "So prüfen Sie die Deklaration.", ["hund", "katze"])).toBeNull();
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
