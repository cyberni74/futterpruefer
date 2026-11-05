import { describe, expect, it } from "vitest";
import { alleinfutterDeckelHinweis, formatDeckelHinweis } from "./deckel-hinweis";
import type { Scores } from "./scoring";

const voll = (over: Partial<Scores> = {}): Scores => ({
  scoreRaw: 26, scoreHarmful: 20, scoreNutrients: 17, scoreDeclaration: 12, scoreNeeds: 9, scoreValue: 4,
  ...over,
});

describe("Deckel-Hinweis Alleinfutter", () => {
  it("bleibt leer, wenn Summe und Gesamtwertung gleich sind", () => {
    const scores = voll();
    expect(alleinfutterDeckelHinweis(scores, 26 + 20 + 17 + 12 + 9 + 4)).toBe("");
    expect(scores.scoreDeclaration).toBe(12);
  });

  it("bleibt leer, wenn eine Schwelle unterschritten ist, die Summe aber schon darunter liegt", () => {
    const scores = voll({ scoreDeclaration: 0, scoreValue: 1 });
    const summe = 26 + 20 + 17 + 0 + 9 + 1;
    expect(summe).toBe(73);
    expect(alleinfutterDeckelHinweis(scores, 59)).toContain("gewertet 59");
    expect(alleinfutterDeckelHinweis(scores, summe)).toBe("");
  });

  it("MjAMjAM Möhrchen: Deklaration 2, Summe 75, gewertet 59", () => {
    const scores = voll({ scoreRaw: 26, scoreHarmful: 20, scoreNutrients: 17, scoreDeclaration: 2, scoreNeeds: 7, scoreValue: 3 });
    expect(alleinfutterDeckelHinweis(scores, 59)).toBe(
      "Deckel aktiv (Deklaration & Transparenz unter 6 von 15 Punkten: höchstens 59 Punkte (befriedigend).). Summe 75, gewertet 59.",
    );
    expect(scores.scoreDeclaration).toBe(2);
  });

  it("VEGDOG Nass, Leonardo Rind und Wolfsblut: nur die Deklarations-Obergrenze", () => {
    const vegdog = voll({ scoreRaw: 24, scoreHarmful: 18, scoreNutrients: 16, scoreDeclaration: 0, scoreNeeds: 9, scoreValue: 3 });
    const leonardo = voll({ scoreRaw: 26, scoreHarmful: 20, scoreNutrients: 12, scoreDeclaration: 1, scoreNeeds: 7, scoreValue: 1 });
    const wolfsblut = voll({ scoreRaw: 24, scoreHarmful: 15, scoreNutrients: 13, scoreDeclaration: 0, scoreNeeds: 7, scoreValue: 2 });
    for (const scores of [vegdog, leonardo, wolfsblut]) {
      const text = alleinfutterDeckelHinweis(scores, 59);
      expect(text).toContain("Deklaration & Transparenz unter 6 von 15 Punkten: höchstens 59 Punkte (befriedigend).");
      expect(text).toContain("gewertet 59.");
      expect(text).not.toContain("höchstens 50");
    }
    expect(alleinfutterDeckelHinweis(vegdog, 59)).toContain("Summe 70,");
    expect(alleinfutterDeckelHinweis(leonardo, 59)).toContain("Summe 67,");
    expect(alleinfutterDeckelHinweis(wolfsblut, 59)).toContain("Summe 61,");
  });

  it("Mera: Rohstoffqualität 11 löst höchstens 59 aus, Deklaration 10 nicht", () => {
    const scores = voll({ scoreRaw: 11, scoreHarmful: 14, scoreNutrients: 15, scoreDeclaration: 10, scoreNeeds: 7, scoreValue: 4 });
    expect(alleinfutterDeckelHinweis(scores, 59)).toBe(
      "Deckel aktiv (Rohstoffqualität unter 12 von 30 Punkten: höchstens 59 Punkte (befriedigend).). Summe 61, gewertet 59.",
    );
  });

  it("6 von 15 und 12 von 30 lösen die Obergrenze 59 nicht aus", () => {
    const scores = voll({ scoreRaw: 12, scoreDeclaration: 6, scoreValue: 0 });
    expect(alleinfutterDeckelHinweis(scores, 59)).toBe(
      "Deckel aktiv (Die Gesamtwertung weicht von der Summe der Teilwerte ab.). Summe 64, gewertet 59.",
    );
  });

  it("nennt jede passende Obergrenze, die niedrigste bestimmt die Wertung", () => {
    const scores = voll({ scoreHarmful: 8, scoreDeclaration: 3, scoreValue: 0 });
    const text = alleinfutterDeckelHinweis(scores, 50);
    expect(text).toContain("Schadstoffe & Bedenkliches unter 10 von 20 Punkten: höchstens 50 Punkte (ausreichend).");
    expect(text).toContain("Deklaration & Transparenz unter 6 von 15 Punkten: höchstens 59 Punkte (befriedigend).");
    expect(text).toContain(`Summe ${8 + 26 + 17 + 3 + 9 + 0}, gewertet 50.`);
  });

  it("behauptet keine Obergrenze 50, wenn die Gesamtwertung 59 ist", () => {
    const scores = voll({ scoreHarmful: 8 });
    const text = alleinfutterDeckelHinweis(scores, 59);
    expect(text).not.toContain("höchstens 50");
    expect(text).toContain("Die Gesamtwertung weicht von der Summe der Teilwerte ab.");
    expect(text).toContain("gewertet 59.");
  });

  it("Version 1 nennt die neuen Einzelregeln nicht", () => {
    const scores = voll({ scoreDeclaration: 0 });
    const text = alleinfutterDeckelHinweis(scores, 59, "1");
    expect(text).not.toContain("Deklaration");
    expect(text).toContain("Summe 76, gewertet 59.");
    expect(alleinfutterDeckelHinweis(scores, 76, "1")).toBe("");
  });

  it("die 23 Alleinfutter aus dem Live-Readback und Seiten ohne Deckel", () => {
    const gedeckelt: Array<[string, number[]]> = [
      ["brit", [22, 18, 17, 4, 8, 4]],
      ["edgard-lachs", [18, 19, 14, 0, 6, 3]],
      ["edgard-huhn", [19, 19, 17, 0, 7, 3]],
      ["happy-dog-india", [14, 15, 15, 3, 8, 5]],
      ["happy-dog-montana", [24, 20, 13, 5, 8, 2]],
      ["mera", [11, 14, 15, 10, 7, 4]],
      ["ofrieda", [20, 18, 14, 5, 8, 3]],
      ["pets-deli", [21, 17, 13, 1, 8, 2]],
      ["hunger", [18, 19, 18, 0, 8, 3]],
      ["vegdog", [24, 18, 16, 0, 9, 3]],
      ["wolfsblut-dark-forest", [22, 16, 12, 3, 5, 2]],
      ["wolfsblut-wide-plain", [23, 15, 13, 5, 6, 2]],
      ["wolfsblut-wild-duck", [24, 15, 13, 0, 7, 2]],
      ["wolfsblut-small", [22, 17, 13, 0, 8, 2]],
      ["animonda-carny", [24, 12, 13, 0, 8, 4]],
      ["granatapet", [26, 20, 16, 0, 8, 4]],
      ["happy-cat", [16, 20, 15, 3, 7, 4]],
      ["leonardo-huhn", [26, 20, 12, 3, 7, 1]],
      ["leonardo-rind", [26, 20, 12, 1, 7, 1]],
      ["mjamjam-kaenguru", [26, 20, 16, 0, 7, 3]],
      ["mjamjam-huhn-pur", [26, 20, 17, 1, 7, 3]],
      ["mjamjam-moehrchen", [26, 20, 17, 2, 7, 3]],
      ["better-cat", [25, 18, 15, 0, 6, 1]],
    ];
    expect(gedeckelt).toHaveLength(23);
    for (const [name, [raw, harmful, nutrients, declaration, needs, value]] of gedeckelt) {
      const scores = voll({ scoreRaw: raw, scoreHarmful: harmful, scoreNutrients: nutrients, scoreDeclaration: declaration, scoreNeeds: needs, scoreValue: value });
      const summe = raw + harmful + nutrients + declaration + needs + value;
      const text = alleinfutterDeckelHinweis(scores, 59);
      expect(summe, name).toBeGreaterThan(59);
      expect(text, name).toBe(
        `Deckel aktiv (${declaration < 6 ? "Deklaration & Transparenz unter 6 von 15 Punkten: höchstens 59 Punkte (befriedigend)." : ""}${raw < 12 && declaration < 6 ? " " : ""}${raw < 12 ? "Rohstoffqualität unter 12 von 30 Punkten: höchstens 59 Punkte (befriedigend)." : ""}). Summe ${summe}, gewertet 59.`,
      );
    }
    const ohne = [
      [18, 17, 14, 8, 9, 4, 70],
      [16, 16, 13, 4, 6, 4, 59],
      [15, 16, 11, 6, 7, 4, 59],
      [17, 16, 12, 4, 5, 4, 58],
      [13, 15, 15, 8, 8, 3, 62],
      [7, 6, 11, 4, 7, 3, 38],
      [24, 12, 12, 3, 7, 2, 60],
    ] as const;
    for (const [raw, harmful, nutrients, declaration, needs, value, total] of ohne) {
      const scores = voll({ scoreRaw: raw, scoreHarmful: harmful, scoreNutrients: nutrients, scoreDeclaration: declaration, scoreNeeds: needs, scoreValue: value });
      expect(alleinfutterDeckelHinweis(scores, total)).toBe("");
      expect(alleinfutterDeckelHinweis(scores, total, "1")).toBe("");
    }
  });

  it("formatiert Gründe wie der Ergänzungsfutter-Hinweis", () => {
    expect(formatDeckelHinweis(["Heilaussage: höchstens 67 Punkte."], 65, 65)).toBe("");
    expect(formatDeckelHinweis([], 65, 50)).toBe("");
    expect(formatDeckelHinweis(["Heilaussage: höchstens 67 Punkte."], 65, 50)).toBe(
      "Deckel aktiv (Heilaussage: höchstens 67 Punkte.). Summe 65, gewertet 50.",
    );
  });
});
