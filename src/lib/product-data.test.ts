import { describe, expect, it } from "vitest";
import { CLAIM_BADGE_CLASS, CLAIM_LABEL, claimStageSummary, consWithClaims, dryMatter, matchLexikon, misleadingClaims, objectedClaims, parseAnalysis, parseClaims, readingMinutes, splitComposition, suggestedDeclarationDeduction, type Claim, type LexRef } from "./product-data";

function claim(claimText: string, rating: Claim["rating"]): Claim {
  return { claim: claimText, rating, reason: "", legal: "", imageUrl: "" };
}

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
  it("lässt nur sichere Foto-URLs zu", () => {
    const c = parseClaims([
      { claim: "a", rating: "ZULAESSIG", imageUrl: "javascript:alert(1)" },
      { claim: "b", rating: "ZULAESSIG", imageUrl: "/uploads/x.webp" },
      { claim: "c", rating: "ZULAESSIG", imageUrl: "http://x.de/a.jpg" },
      { claim: "d", rating: "ZULAESSIG", imageUrl: "https://xwpsp3svpsdhnsdw.public.blob.vercel-storage.com/bilder/a.webp" },
      { claim: "e", rating: "ZULAESSIG", imageUrl: "https://cotopvhmsqztjtdsdnoc.supabase.co/storage/v1/object/public/bilder/a.webp" },
      { claim: "f", rating: "ZULAESSIG", imageUrl: "https://evil.example/a.webp" },
    ]);
    expect(c.map((x) => x.imageUrl)).toEqual([
      "",
      "/uploads/x.webp",
      "",
      "https://xwpsp3svpsdhnsdw.public.blob.vercel-storage.com/bilder/a.webp",
      "https://cotopvhmsqztjtdsdnoc.supabase.co/storage/v1/object/public/bilder/a.webp",
      "",
    ]);
  });
  it("Abzugsvorschlag und Contra-Übernahme", () => {
    const c = parseClaims(raw);
    expect(misleadingClaims(c)).toHaveLength(1);
    expect(suggestedDeclarationDeduction(c)).toBe(4);
    expect(suggestedDeclarationDeduction(parseClaims(Array(9).fill({ claim: "a", rating: "UNZULAESSIG" })))).toBe(15);
    expect(consWithClaims(["Teuer"], c)).toEqual(["Teuer", "Halten wir für irreführend: „stärkt das Immunsystem“"]);
    expect(consWithClaims(null, [])).toEqual([]);
    expect(consWithClaims([], [claim("Datenfeld „Diättyp des Tierfutters: Roh“", "UNZULAESSIG")])).toEqual([
      "Halten wir für irreführend: „Datenfeld ‚Diättyp des Tierfutters: Roh‘“",
    ]);
  });
  it("Unbelegt und Plausibel sind eigene Stufen und zählen nicht als ohne Einwand", () => {
    const c = parseClaims([
      { claim: "getreidefrei", rating: "ZULAESSIG" },
      { claim: "Premium", rating: "UNBELEGT", reason: "Anpreisung" },
      { claim: "regional", rating: "PLAUSIBEL", reason: "Herkunft genannt" },
      { claim: "superfood", rating: "FRAGWUERDIG" },
      { claim: "heilt", rating: "UNZULAESSIG" },
    ]);
    expect(c.map((x) => x.rating)).toEqual(["ZULAESSIG", "UNBELEGT", "PLAUSIBEL", "FRAGWUERDIG", "UNZULAESSIG"]);
    expect(CLAIM_LABEL.UNBELEGT).toBe("Unbelegt");
    expect(CLAIM_LABEL.PLAUSIBEL).toBe("Plausibel");
    expect(CLAIM_BADGE_CLASS.UNBELEGT).toBe("bg-bg-soft text-muted");
    expect(CLAIM_BADGE_CLASS.PLAUSIBEL).toBe("bg-brand-soft text-brand");
    expect(CLAIM_BADGE_CLASS.ZULAESSIG).toBe("bg-good-soft text-good");
    expect(CLAIM_BADGE_CLASS.UNBELEGT).not.toContain("good");
    expect(CLAIM_BADGE_CLASS.PLAUSIBEL).not.toContain("good");
    const viele: Claim[] = [
      ...Array.from({ length: 9 }, (_, i) => claim("a" + i, "ZULAESSIG")),
      ...Array.from({ length: 2 }, (_, i) => claim("u" + i, "UNBELEGT")),
      ...Array.from({ length: 2 }, (_, i) => claim("p" + i, "PLAUSIBEL")),
    ];
    expect(claimStageSummary(viele)).toBe("9 ohne Einwand, 2 plausibel, 2 unbelegt");
    expect(claimStageSummary(viele)).not.toMatch(/13 ohne Einwand|11 ohne Einwand/);
    expect(claimStageSummary(c)).toBe("1 ohne Einwand, 1 plausibel, 1 unbelegt, 1 fragwürdig, 1 irreführend");
    expect(objectedClaims(c).map((x) => x.rating)).toEqual(["FRAGWUERDIG", "UNZULAESSIG"]);
    expect(suggestedDeclarationDeduction(c)).toBe(4);
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
  it("lässt Dezimalkommas in Zusatzstoffen ganz", () => {
    expect(splitComposition("Vitamin E 150 mg, Vitamin C 245 mg; Jod 2,5 mg, Selen 0,05 mg.")).toEqual([
      "Vitamin E 150 mg",
      "Vitamin C 245 mg",
      "Jod 2,5 mg",
      "Selen 0,05 mg",
    ]);
    expect(splitComposition("Jod 2, 5 mg; Selen 0;05 mg")).toEqual(["Jod 2, 5 mg", "Selen 0;05 mg"]);
    expect(splitComposition("Meeres-Zooplankton (Krill) (2,5 %); Fischmehl (2,5 %)")).toEqual([
      "Meeres-Zooplankton (Krill) (2,5 %)",
      "Fischmehl (2,5 %)",
    ]);
    expect(splitComposition("72,5 % Rind, Huhn")).toEqual(["72,5 % Rind", "Huhn"]);
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
