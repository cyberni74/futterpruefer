import { describe, expect, it } from "vitest";
import { beispielDaten } from "@/components/testvorlage-v2/fixtures";
import { pruefeScoreSummen, type ScoreRow } from "./score-sum-check";

const basis: ScoreRow = { slug: "t", layout: "", layoutData: null, totalScore: 0, scoreRaw: 0, scoreHarmful: 0, scoreNutrients: 0, scoreDeclaration: 0, scoreNeeds: 0, scoreValue: 0 };

describe("pruefeScoreSummen (nur lesend)", () => {
  it("klassisch: Summe der Teilnoten gegen totalScore", () => {
    const ok = { ...basis, scoreRaw: 20, scoreHarmful: 10, scoreNutrients: 10, scoreDeclaration: 5, scoreNeeds: 5, scoreValue: 2, totalScore: 52 };
    expect(pruefeScoreSummen([ok])).toEqual([]);
    expect(pruefeScoreSummen([{ ...ok, totalScore: 60 }])).toEqual([{ slug: "t", schema: "teilnoten", gespeichert: 60, summe: 52 }]);
  });
  it("klassisch ohne Teilnoten wird nicht gemeldet", () => {
    expect(pruefeScoreSummen([{ ...basis, totalScore: 40 }])).toEqual([]);
  });
  it("V2: Summe der Kriterien gegen totalScore", () => {
    const { data, totalScore } = beispielDaten(5);
    const row: ScoreRow = { ...basis, slug: "v", layout: "TESTVORLAGE_V2", layoutData: data, totalScore };
    expect(pruefeScoreSummen([row])).toEqual([]);
    const falsch = pruefeScoreSummen([{ ...row, totalScore: totalScore + 3 }]);
    expect(falsch).toEqual([{ slug: "v", schema: "kriterien", gespeichert: totalScore + 3, summe: totalScore }]);
  });
});
