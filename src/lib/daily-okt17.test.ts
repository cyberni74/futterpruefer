import { describe, expect, it } from "vitest";
import { DAILY_OKT17_TESTS } from "../../prisma/review-daily-2026-10-17";
import { CRITERIA, totalScore } from "./scoring";
import { sanitize } from "./sanitize";

const AMAZON_IMG = "https://m.media-amazon.com/images/I/";
const TAG = "tag=cyberni7400-21";

describe("Entwürfe 17.10.2026", () => {
  it("enthält genau fünf Tests, alle freigegeben", () => {
    expect(DAILY_OKT17_TESTS).toHaveLength(5);
    expect(new Set(DAILY_OKT17_TESTS.map((t) => t.slug)).size).toBe(5);
    for (const t of DAILY_OKT17_TESTS) expect(t.freigegeben).toBe(true);
  });

  it("hält Teaser, Pro und Contra in den Längen", () => {
    for (const t of DAILY_OKT17_TESTS) {
      expect(t.teaser.length, t.slug).toBeLessThanOrEqual(100);
      expect(t.teaser.length, t.slug).toBeGreaterThan(0);
      for (const pro of t.pros) expect(pro.length, t.slug).toBeLessThanOrEqual(200);
      for (const con of t.cons) expect(con.length, t.slug).toBeLessThanOrEqual(200);
    }
  });

  it("rechnet die Teilnoten zur Gesamtpunktzahl und bleibt in den Maxima", () => {
    for (const t of DAILY_OKT17_TESTS) {
      for (const criterion of CRITERIA) {
        const value = t.scores[criterion.key];
        expect(value, `${t.slug} ${criterion.key}`).toBeGreaterThanOrEqual(0);
        expect(value, `${t.slug} ${criterion.key}`).toBeLessThanOrEqual(criterion.max);
      }
      const sum =
        t.scores.scoreRaw +
        t.scores.scoreHarmful +
        t.scores.scoreNutrients +
        t.scores.scoreDeclaration +
        t.scores.scoreNeeds +
        t.scores.scoreValue;
      expect(totalScore(t.scores), t.slug).toBe(sum);
    }
  });

  it("nennt weder unabhängig noch Pollmer und setzt keine Punktzahl in Titel oder Slug", () => {
    for (const t of DAILY_OKT17_TESTS) {
      const blob = [
        t.title,
        t.slug,
        t.teaser,
        t.verdict,
        t.bodyHtml,
        t.conclusionHtml,
        t.metaTitle,
        t.metaDescription,
        ...t.pros,
        ...t.cons,
        ...t.claims.map((claim) => `${claim.claim} ${claim.reason} ${claim.legal}`),
      ].join("\n");
      expect(blob, t.slug).not.toMatch(/unabhängig/i);
      expect(blob, t.slug).not.toMatch(/pollmer/i);
      expect(t.title, t.slug).not.toMatch(/\d+\s*Punkte|\/\s*100|\d+\s*von\s*100/i);
      expect(t.slug, t.slug).not.toMatch(/\d+/);
    }
  });

  it("verlinkt Bilder als Amazon-Hotlinks; Kauflinks mit Partner-Tag, Belegquellen ohne", () => {
    const blob = DAILY_OKT17_TESTS.map((t) => `${t.bodyHtml}\n${t.conclusionHtml}`).join("\n");
    expect(blob).not.toContain("Unterlagen haben wir nicht angefordert");
    expect(blob).not.toContain("Datenbankfeld");
    expect(blob).toContain("Die Schadstoff-Teilnote beruht auf Zusammensetzung und Deklaration, nicht auf eigenen Laborwerten.");
    for (const t of DAILY_OKT17_TESTS) {
      expect(t.imageUrl, t.slug).toMatch(new RegExp(`^${AMAZON_IMG}`));
      expect(t.contentImageUrl, t.slug).toMatch(new RegExp(`^${AMAZON_IMG}`));
      const imgs = [...t.bodyHtml.matchAll(/<img\s+src="([^"]+)"/g)].map((m) => m[1]);
      expect(imgs.length, t.slug).toBeGreaterThanOrEqual(2);
      for (const src of imgs) expect(src, t.slug).toMatch(new RegExp(`^${AMAZON_IMG}`));
      const html = `${t.bodyHtml}\n${t.conclusionHtml}`;
      const hrefs = [...html.matchAll(/href="(https:\/\/www\.amazon\.de[^"]+)"/g)].map((m) => m[1]);
      const affiliate = hrefs.filter((href) => href.includes(TAG));
      const sources = hrefs.filter((href) => !href.includes(TAG));
      expect(sources.length, t.slug).toBeGreaterThan(0);
      for (const href of sources) expect(href, t.slug).toMatch(/^https:\/\/www\.amazon\.de\/dp\/[A-Z0-9]+$/);
      if (t.slug === "brit-premium-sensitive-lamm-test") {
        expect(affiliate, t.slug).toEqual([]);
        expect(html, t.slug).not.toContain("bei Amazon ansehen");
        expect(html, t.slug).toContain("Bild: Amazon-Produktseite (Stand 17.10.2026)");
        expect(html, t.slug).not.toContain("Werbung: Bild verlinkt zu Amazon");
        expect(t.price, t.slug).toBeNull();
        expect(t.pricePerKg, t.slug).toBeNull();
        expect(t.pricePerDay, t.slug).toBeNull();
        expect(t.claims.filter((claim) => claim.rating === "FRAGWUERDIG"), t.slug).toHaveLength(8);
        expect(t.claims.filter((claim) => claim.rating === "UNZULAESSIG"), t.slug).toHaveLength(1);
      } else {
        expect(affiliate.length, t.slug).toBeGreaterThan(0);
        for (const href of affiliate) expect(href, t.slug).toContain(TAG);
      }
    }
    const schesir = DAILY_OKT17_TESTS.find((t) => t.slug === "schesir-cat-adult-maintenance-fisch-test");
    expect(schesir?.scores.scoreDeclaration).toBe(6);
    expect(schesir?.teaser).toContain("65 Punkte");
    expect(schesir?.bodyHtml).toContain("65 von 100 Punkten");
    expect(schesir?.bodyHtml).not.toContain("64 von 100");
    const bozita = DAILY_OKT17_TESTS.find((t) => t.slug === "bozita-haeppchen-gelee-makrele-test");
    expect(bozita?.claims.filter((claim) => claim.rating === "FRAGWUERDIG")).toHaveLength(8);
    expect(bozita?.claims.some((claim) => claim.claim.startsWith("mit Makrele:"))).toBe(true);
  });

  it("lässt Amazon-Galeriebilder im Sanitizer stehen", () => {
    const src = "https://m.media-amazon.com/images/I/71F9cjXp+ZL._AC_SL1500_.jpg";
    const html = `<figure><a href="https://www.amazon.de/dp/B0TEST?tag=cyberni7400-21" rel="sponsored nofollow noopener"><img src="${src}" alt="Packung"></a><figcaption>Bild: Amazon-Produktseite</figcaption></figure>`;
    const clean = sanitize(html);
    expect(clean).toContain(src);
    expect(clean).toContain("tag=cyberni7400-21");
    expect(clean).toContain("figcaption");
  });
});
