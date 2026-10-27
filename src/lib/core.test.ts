import { describe, expect, it } from "vitest";
import { clampScore, CRITERIA, harmfulFailed, MAX_TOTAL, METHODOLOGY_STAND, PUBLISHED_CRITERIA, PUBLISHED_MAX_TOTAL, RATING_LABEL, ratingFor, totalScore } from "./scoring";
import { slugify } from "./slug";
import { sanitize, stripHtml } from "./sanitize";
import { formatDate } from "./site";

describe("scoring", () => {
  it("Maximum ist 100", () => expect(MAX_TOTAL).toBe(100));
  it("veröffentlicht 27/18/18/13/9/5/10 und rechnet gespeicherte Noten nicht um", () => {
    expect(METHODOLOGY_STAND).toBe("27.10.2026");
    expect(PUBLISHED_CRITERIA.map((criterion) => criterion.max)).toEqual(CRITERIA.map((criterion) => criterion.max));
    expect(PUBLISHED_CRITERIA.map((criterion) => criterion.key)).toEqual(CRITERIA.map((criterion) => criterion.key));
    expect(PUBLISHED_MAX_TOTAL).toBe(100);
    expect(CRITERIA.map((criterion) => criterion.max)).toEqual([30, 20, 20, 15, 10, 5]);
    expect(totalScore({ scoreRaw: 30, scoreHarmful: 20, scoreNutrients: 20, scoreDeclaration: 15, scoreNeeds: 10, scoreValue: 5 })).toBe(100);
    expect(clampScore("scoreRaw", 30)).toBe(30);
  });
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
    expect(RATING_LABEL.schlecht).toBe("Rot – keine Empfehlung");
    expect(RATING_LABEL.gut).toBe("Empfehlenswert");
    expect(RATING_LABEL.mittel).toBe("Mit Abstrichen");
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
  it("behält sponsored und nofollow an Affiliate-Links", () => {
    const out = sanitize('<a href="https://shop.example/p" rel="sponsored nofollow">zum Shop</a>');
    expect(out).toContain('rel="noopener noreferrer nofollow sponsored"');
    expect(out).toContain('target="_blank"');
  });
  it("setzt sponsored bei Amazon-Tag und bei amazon.de, nicht bei anderen Shops", () => {
    const tagOnly = sanitize('<a href="https://www.amazon.de/dp/B07KCS7YX1?tag=cyberni7400-21">Amazon</a>');
    expect(tagOnly).toContain('rel="noopener noreferrer nofollow sponsored"');
    const encoded = sanitize('<a href="https://www.amazon.de/dp/B07KCS7YX1?tag=cyberni7400-21&amp;th=1">Amazon</a>');
    expect(encoded).toContain("sponsored");
    const liveProduct = sanitize('<a href="https://www.amazon.de/dp/B07KCS7YX1">amazon.de</a>');
    const liveRank = sanitize('<a href="https://www.amazon.de/gp/bestsellers/pet-supplies/470653031">Bestseller</a>');
    expect(liveProduct).toContain('rel="noopener noreferrer nofollow sponsored"');
    expect(liveRank).toContain('rel="noopener noreferrer nofollow sponsored"');
    const shop = sanitize('<a href="https://www.fressnapf.de/p">Fressnapf</a>');
    expect(shop).toContain('rel="noopener noreferrer nofollow"');
    expect(shop).not.toContain("sponsored");
    const storage = sanitize('<a href="https://s3.amazonaws.com/bucket/bild.webp">Bild</a>');
    expect(storage).not.toContain("sponsored");
  });
  it("behält cta-box und Button-Klassen, entfernt Inline-Styles", () => {
    const out = sanitize('<div class="cta-box" style="border:1px solid red"><span class="werbung">Werbung</span><a class="button" href="https://www.amazon.de/dp/B07D4T5XVT?tag=cyberni7400-21" rel="sponsored nofollow">Zu Amazon</a></div>');
    expect(out).toContain('class="cta-box"');
    expect(out).toContain('class="werbung"');
    expect(out).toContain('class="button"');
    expect(out).not.toContain("style=");
    expect(out).toContain('rel="noopener noreferrer nofollow sponsored"');
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

describe("Urheberschaft", () => {
  it("nennt eine Person aus der Autorenliste und übernimmt keine freien Namen", async () => {
    const { contentAuthor } = await import("./attribution");
    const { DEFAULT_AUTHOR, authorPath } = await import("./authors");
    const { absoluteUrl, SITE } = await import("./site");
    const author = contentAuthor(null);
    const url = absoluteUrl(authorPath(DEFAULT_AUTHOR));
    expect(author).toEqual({
      "@type": "Person",
      "@id": url,
      name: DEFAULT_AUTHOR.name,
      url,
      jobTitle: DEFAULT_AUTHOR.jobTitle,
    });
    expect(author.name).toBe("Sebastian Kraft");
    expect(author.name).not.toMatch(/von |Futterprüfer/i);
    expect(author.url).toMatch(/^https:\/\/.+\/team#sebastian-kraft$/);
    expect(author).not.toHaveProperty("sameAs");
    expect(author.jobTitle).not.toBe(author.name);
    const unknown = contentAuthor("gespeicherter Name");
    expect(JSON.stringify(unknown)).not.toContain("gespeicherter Name");
    expect(unknown).toEqual(author);
    expect(contentAuthor(DEFAULT_AUTHOR.slug)).toEqual(author);
    expect(SITE.name).toBe("Futterprüfer");
  });
});

describe("resolveSiteUrl", () => {
  it("setzt ASCII-, www- und Produktionshosts auf die Punycode-Hauptdomain", async () => {
    const { resolveSiteUrl, CANONICAL_ORIGIN } = await import("./site");
    expect(CANONICAL_ORIGIN).toBe("https://xn--futterprfer-0hb.de");
    expect(resolveSiteUrl(undefined)).toBe(CANONICAL_ORIGIN);
    expect(resolveSiteUrl("")).toBe(CANONICAL_ORIGIN);
    expect(resolveSiteUrl("https://futterpruefer.de/")).toBe(CANONICAL_ORIGIN);
    expect(resolveSiteUrl("https://www.futterpruefer.de")).toBe(CANONICAL_ORIGIN);
    expect(resolveSiteUrl("https://xn--futterprfer-0hb.de")).toBe(CANONICAL_ORIGIN);
    expect(resolveSiteUrl("https://futterprüfer.de/")).toBe(CANONICAL_ORIGIN);
    expect(resolveSiteUrl("https://www.xn--futterprfer-0hb.de")).toBe(CANONICAL_ORIGIN);
    expect(resolveSiteUrl("https://futterpruefer.vercel.app")).toBe(CANONICAL_ORIGIN);
    expect(resolveSiteUrl("http://localhost:3001")).toBe("http://localhost:3001");
    expect(resolveSiteUrl("https://futterpruefer-git-feature.vercel.app")).toBe("https://futterpruefer-git-feature.vercel.app");
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

import { stripInvisible } from "./sanitize";
describe("stripInvisible", () => {
  it("entfernt Zero-Width, Variation Selector und Sonderleerzeichen", () => {
    expect(stripInvisible("a​b﻿c⁠d­e️")).toBe("abcde");
    expect(stripInvisible("24,95 € und 5 kg")).toBe("24,95 € und 5 kg");
    expect(stripInvisible("normal äöü ß")).toBe("normal äöü ß");
  });
});
