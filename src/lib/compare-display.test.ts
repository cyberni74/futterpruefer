import { describe, expect, it } from "vitest";
import { classicCriteriaApply, criterionFailed, showsComparisonWinner } from "./compare-display";

describe("Vergleich Testsieger", () => {
  it("nur ab 60 Punkten und nie bei Rot", () => {
    expect(showsComparisonWinner(27, 27)).toBe(false);
    expect(showsComparisonWinner(59, 59)).toBe(false);
    expect(showsComparisonWinner(60, 60)).toBe(true);
    expect(showsComparisonWinner(82, 82)).toBe(true);
    expect(showsComparisonWinner(27, 82)).toBe(false);
    expect(showsComparisonWinner(82, 82)).toBe(true);
    expect(showsComparisonWinner(70, 82)).toBe(false);
  });
});

describe("Vergleich Kriterien", () => {
  it("V2: Alleinfutter-Kriterien gelten nicht und ohne Warn-Icon", () => {
    expect(classicCriteriaApply("TESTVORLAGE_V2")).toBe(false);
    expect(criterionFailed("TESTVORLAGE_V2", "scoreHarmful", 0)).toBe(false);
  });

  it("klassisch bleibt: 0/20 ist durchgefallen, 16/20 nicht", () => {
    expect(classicCriteriaApply("")).toBe(true);
    expect(classicCriteriaApply(null)).toBe(true);
    expect(criterionFailed("", "scoreHarmful", 0)).toBe(true);
    expect(criterionFailed("", "scoreHarmful", 9)).toBe(true);
    expect(criterionFailed("", "scoreHarmful", 16)).toBe(false);
    expect(criterionFailed("", "scoreRaw", 0)).toBe(false);
  });
});
