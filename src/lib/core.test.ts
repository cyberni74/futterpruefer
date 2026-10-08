import { describe, expect, it } from "vitest";
import { clampScore, harmfulFailed, MAX_TOTAL, ratingFor, totalScore } from "./scoring";
import { slugify } from "./slug";
import { sanitize, stripHtml } from "./sanitize";
import { formatDate } from "./site";

describe("scoring", () => {
  it("Maximum ist 100", () => expect(MAX_TOTAL).toBe(100));
  it("summiert und begrenzt pro Kriterium", () => {
    expect(totalScore({ scoreRaw: 99, scoreHarmful: 20, scoreNutrients: 20, scoreDeclaration: 15, scoreNeeds: 10, scoreValue: 5 })).toBe(100);
    expect(totalScore({ scoreRaw: -5, scoreHarmful: 10 })).toBe(10);
  });
  it("behandelt null/undefined/NaN", () => {
    expect(totalScore(null)).toBe(0);
    expect(totalScore(undefined)).toBe(0);
    expect(clampScore("scoreRaw", "abc")).toBe(0);
    expect(clampScore("scoreValue", 4.6)).toBe(5);
  });
  it("Ampel-Schwellen", () => {
    expect(ratingFor(100)).toBe("gut");
    expect(ratingFor(80)).toBe("gut");
    expect(ratingFor(79)).toBe("mittel");
    expect(ratingFor(60)).toBe("mittel");
    expect(ratingFor(59)).toBe("schlecht");
    expect(ratingFor(0)).toBe("schlecht");
    expect(ratingFor(null)).toBe("schlecht");
  });
  it("Schadstoff-Warnsignal unter 50 %", () => {
    expect(harmfulFailed(9)).toBe(true);
    expect(harmfulFailed(10)).toBe(false);
    expect(harmfulFailed(null)).toBe(true);
  });
});

describe("slugify", () => {
  it("Umlaute und ß", () => expect(slugify("Größe & Müsli für Hündinnen")).toBe("groesse-und-muesli-fuer-huendinnen"));
  it("leer/null", () => {
    expect(slugify(null)).toBe("");
    expect(slugify("  ---  ")).toBe("");
  });
  it("Akzente und Länge", () => {
    expect(slugify("Crème Brûlée")).toBe("creme-brulee");
    expect(slugify("a".repeat(200)).length).toBe(80);
  });
});

describe("sanitize", () => {
  it("entfernt Skripte und Event-Handler", () => {
    const out = sanitize('<p onclick="x()">Hi<script>alert(1)</script></p><img src="javascript:alert(1)">');
    expect(out).not.toMatch(/script|onclick|javascript/);
    expect(out).toContain("<p>Hi</p>");
  });
  it("externe Links bekommen rel/target", () => {
    expect(sanitize('<a href="https://x.de">x</a>')).toContain('rel="noopener noreferrer nofollow"');
  });
  it("h1 wird zu h2", () => expect(sanitize("<h1>T</h1>")).toBe("<h2>T</h2>"));
  it("stripHtml", () => expect(stripHtml("<p>a <b>b</b></p>\n<p>c</p>")).toBe("a b c"));
  it("null-sicher", () => expect(sanitize(null)).toBe(""));
});

describe("formatDate", () => {
  it("formatiert deutsch", () => expect(formatDate(new Date("2026-10-08T10:00:00Z"))).toBe("08. Oktober 2026"));
  it("ungültig/leer", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate("kein-datum")).toBe("");
  });
});
