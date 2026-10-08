import { describe, expect, it } from "vitest";
import { consWithClaims, dryMatter, matchLexikon, misleadingClaims, parseAnalysis, parseClaims, readingMinutes, splitComposition, suggestedDeclarationDeduction, type LexRef } from "./product-data";

describe("Werbeaussagen", () => {
  const raw = [
    { claim: "getreidefrei", rating: "ZULAESSIG", reason: "korrekt" },
    { claim: "stärkt das Immunsystem", rating: "UNZULAESSIG", reason: "Heilversprechen", legal: "VO (EG) 767/2009 Art. 13" },
    { claim: "wie in der Natur", rating: "FRAGWUERDIG" },
    { claim: "", rating: "UNZULAESSIG" },
    { claim: "x", rating: "FALSCH" },
    null,
  ];
  it("parst robust und verwirft Ungültiges", () => {
    const c = parseClaims(raw);
    expect(c).toHaveLength(3);
    expect(c[2].reason).toBe("");
    expect(parseClaims(null)).toEqual([]);
    expect(parseClaims("kaputt")).toEqual([]);
  });
  it("Abzugsvorschlag und Contra-Übernahme", () => {
    const c = parseClaims(raw);
    expect(misleadingClaims(c)).toHaveLength(1);
    expect(suggestedDeclarationDeduction(c)).toBe(4);
    expect(suggestedDeclarationDeduction(parseClaims(Array(9).fill({ claim: "a", rating: "UNZULAESSIG" })))).toBe(15);
    expect(consWithClaims(["Teuer"], c)).toEqual(["Teuer", "Irreführende Werbeaussage: „stärkt das Immunsystem“"]);
    expect(consWithClaims(null, [])).toEqual([]);
  });
});

describe("Analyse", () => {
  const rows = parseAnalysis([{ name: "Rohprotein", value: 10 }, { name: "Rohfett", value: "6,0" }, { name: "Feuchtigkeit", value: 80 }, { name: "", value: 1 }, { name: "x", value: 200 }]);
  it("parst Werte inkl. Komma", () => {
    expect(rows).toEqual([{ name: "Rohprotein", value: 10 }, { name: "Rohfett", value: 6 }, { name: "Feuchtigkeit", value: 80 }]);
    expect(parseAnalysis(undefined)).toEqual([]);
  });
  it("rechnet Trockensubstanz", () => {
    expect(dryMatter(rows)).toEqual([{ name: "Rohprotein", value: 50 }, { name: "Rohfett", value: 30 }]);
    expect(dryMatter([{ name: "Rohprotein", value: 10 }])).toBeNull();
    expect(dryMatter([{ name: "Feuchte", value: 100 }])).toBeNull();
  });
});

describe("Zusammensetzung", () => {
  it("trennt außerhalb von Klammern", () => {
    expect(splitComposition("Fleisch (60 % Rind, Huhn), Reis, Mineralstoffe; Taurin.")).toEqual(["Fleisch (60 % Rind, Huhn)", "Reis", "Mineralstoffe", "Taurin"]);
    expect(splitComposition(null)).toEqual([]);
    expect(splitComposition(" , ,")).toEqual([]);
  });
  it("findet Lexikon-Einträge als ganze Wörter, längster gewinnt", () => {
    const lex: LexRef[] = [
      { slug: "zucker", name: "Zucker", synonyms: [], concern: "BEDENKLICH", shortDescription: "" },
      { slug: "tne", name: "Tierische Nebenerzeugnisse", synonyms: [], concern: "EINGESCHRAENKT", shortDescription: "" },
      { slug: "ne", name: "Nebenerzeugnisse", synonyms: [], concern: "UNBEDENKLICH", shortDescription: "" },
    ];
    expect(matchLexikon("Zucker", lex)?.slug).toBe("zucker");
    expect(matchLexikon("Rohrzucker", lex)).toBeNull();
    expect(matchLexikon("Fleisch und tierische Nebenerzeugnisse (4 % Huhn)", lex)?.slug).toBe("tne");
  });
});

describe("Lesezeit", () => {
  it("mindestens 1 Minute", () => {
    expect(readingMinutes("")).toBe(1);
    expect(readingMinutes("<p>" + "wort ".repeat(1000) + "</p>")).toBe(5);
    expect(readingMinutes(null, undefined)).toBe(1);
  });
});
