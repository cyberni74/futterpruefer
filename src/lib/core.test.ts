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

describe("hyphenateCategory", () => {
  it("setzt weiche Trennstellen und lässt Text sonst unverändert", async () => {
    const { hyphenateCategory } = await import("./urls");
    expect(hyphenateCategory("Ergänzungsfuttermittel Katze")).toBe("Ergänzungs­futter­mittel Katze");
    expect(hyphenateCategory("Ergänzungsfuttermittel Katze").replace(/­/g, "")).toBe("Ergänzungsfuttermittel Katze");
    expect(hyphenateCategory(null)).toBe("");
  });
});

describe("team", () => {
  it("Initialen ohne Titel, eindeutige Slugs", async () => {
    const { TEAM, initials } = await import("./team");
    expect(initials("Dr. L.")).toBe("L");
    expect(initials("M. W.")).toBe("MW");
    expect(new Set(TEAM.map((m) => m.slug)).size).toBe(TEAM.length);
  });
});

describe("isIndexable", () => {
  it("nur echte Domain wird indexiert", async () => {
    const { isIndexable } = await import("./site");
    expect(isIndexable("https://futterpruefer-x.vercel.app", undefined)).toBe(false);
    expect(isIndexable("http://localhost:3000", undefined)).toBe(false);
    expect(isIndexable("https://futterpruefer.de", undefined)).toBe(true);
    expect(isIndexable("https://futterpruefer.de", "1")).toBe(false);
  });
});

describe("Produkt des Monats (Testsieger)", () => {
  it("wählt je Monat die höchste Wertung, manuell überschreibt, Zukunft zählt nicht", async () => {
    const { buildMonthlyWinners, currentPom } = await import("./pom");
    const d = (s: string) => new Date(s);
    const R = (id: string, at: string, score: number) => ({ id, publishedAt: d(at), totalScore: score });
    const reviews = [R("a", "2026-09-03", 70), R("b", "2026-09-20", 85), R("c", "2026-10-02", 90), R("d", "2026-10-05", 90), R("e", "2026-11-02", 99)];
    const now = d("2026-10-09");
    const items = buildMonthlyWinners(reviews, [], now);
    expect(items.map((i) => [i.year, i.month, i.review.id, i.auto])).toEqual([[2026, 10, "d", true], [2026, 9, "b", true]]);
    expect(items[0].reason).toContain("Testsieger im Oktober 2026: 90 von 100");
    const manual = [{ id: "m", year: 2026, month: 10, reason: "x", review: reviews[0] }, { id: "f", year: 2027, month: 1, reason: "y", review: reviews[0] }];
    const withManual = buildMonthlyWinners(reviews, manual, now);
    expect(withManual[0]).toMatchObject({ review: { id: "a" }, auto: false, reason: "x" });
    expect(withManual).toHaveLength(2);
    expect(currentPom(withManual, now)?.month).toBe(10);
    expect(currentPom(buildMonthlyWinners([], [], now), now)).toBeNull();
    expect(currentPom(buildMonthlyWinners([R("z", "2026-08-01", 60)], [], now), now)?.month).toBe(8);
  });
});
