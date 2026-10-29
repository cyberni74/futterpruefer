import { describe, expect, it } from "vitest";
import { classicCriteriaApply, criterionFailed, showsComparisonWinner } from "./compare-display";

describe("Vergleich Testsieger", () => {
  it("nur ab 60 Punkten und nie bei Rot", () => {
    expect(showsComparisonWinner(27, 27)).toBe(false);
    expect(showsComparisonWinner(59, 59)).toBe(false);
    expect(showsComparisonWinner(60, 60)).toBe(true);
    expect(showsComparisonWinner(82, 82)).toBe(true);
    expect(showsComparisonWinner(74, 74, 2)).toBe(false);
    expect(showsComparisonWinner(74, 74, 1)).toBe(true);
    expect(showsComparisonWinner(27, 82)).toBe(false);
    expect(showsComparisonWinner(82, 82)).toBe(true);
    expect(showsComparisonWinner(70, 82)).toBe(false);
  });
});

const filled = { layout: "", scoreRaw: 10, scoreNutrients: 11, scoreDeclaration: 6, scoreNeeds: 7, scoreValue: 2 };
const leer = { layout: "", scoreRaw: 0, scoreHarmful: 0, scoreNutrients: 0, scoreDeclaration: 0, scoreNeeds: 0, scoreValue: 0 };

describe("Vergleich Kriterien", () => {
  it("V2: Alleinfutter-Kriterien gelten nicht und ohne Warn-Icon", () => {
    expect(classicCriteriaApply({ ...filled, layout: "TESTVORLAGE_V2", scoreHarmful: 4 })).toBe(false);
    expect(criterionFailed({ layout: "TESTVORLAGE_V2", scoreHarmful: 0 }, "scoreHarmful", 0)).toBe(false);
  });

  it("ohne gesetzte Teilnoten: kein 0/x und kein Warn-Icon", () => {
    expect(classicCriteriaApply(leer)).toBe(false);
    expect(classicCriteriaApply({ layout: null, scoreHarmful: 0 })).toBe(false);
    expect(criterionFailed(leer, "scoreHarmful", 0)).toBe(false);
  });

  it("klassisch mit Teilnoten: 0/20 und 9/20 sind durchgefallen, 16/20 nicht", () => {
    expect(classicCriteriaApply({ ...filled, scoreHarmful: 9 })).toBe(true);
    expect(criterionFailed({ ...filled, scoreHarmful: 0 }, "scoreHarmful", 0)).toBe(true);
    expect(criterionFailed({ ...filled, scoreHarmful: 9 }, "scoreHarmful", 9)).toBe(true);
    expect(criterionFailed({ ...filled, scoreHarmful: 16 }, "scoreHarmful", 16)).toBe(false);
    expect(criterionFailed({ ...filled, scoreHarmful: 9 }, "scoreRaw", 0)).toBe(false);
  });
});
