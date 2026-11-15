import { describe, expect, it } from "vitest";
import { formatScore, scoreForJsonLd, asScore } from "./scoring";

describe("formatScore", () => {
  it("lässt ganze Punktzahlen unverändert", () => {
    expect(formatScore(91)).toBe("91");
    expect(formatScore(60)).toBe("60");
    expect(formatScore(100)).toBe("100");
    expect(formatScore(0)).toBe("0");
  });

  it("zeigt eine Nachkommastelle mit Komma und rundet nicht auf 92", () => {
    expect(formatScore(91.8)).toBe("91,8");
    expect(formatScore(91.2)).toBe("91,2");
  });
});

describe("scoreForJsonLd", () => {
  it("liefert 91.8 als Zahl, nicht 92", () => {
    expect(scoreForJsonLd(91.8)).toBe(91.8);
    expect(scoreForJsonLd(91)).toBe(91);
  });
});

describe("asScore", () => {
  it("schneidet nicht auf ganze Punkte", () => {
    expect(asScore(91.8)).toBe(91.8);
  });
});
