import { describe, expect, it } from "vitest";
import { isRotScore, stripAffiliateForRot } from "./rot-guard";

const CTA = '<div class="cta-amazon cta-box"><p class="cta-produkt">MjAMjAM</p><p><a class="cta-amazon-btn" href="https://www.amazon.de/dp/B07D4T5XVT?tag=cyberni7400-21" rel="sponsored nofollow noopener">Aktuellen Preis bei Amazon prüfen</a></p><p class="cta-hinweis">*Werbung/Affiliate-Link</p></div>';

describe("Rot-Regel", () => {
  it("gilt unter 60 Punkten", () => {
    expect(isRotScore(59)).toBe(true);
    expect(isRotScore(47)).toBe(true);
    expect(isRotScore(60)).toBe(false);
    expect(isRotScore(87)).toBe(false);
  });

  it("entfernt die .cta-amazon-Box vollständig", () => {
    const out = stripAffiliateForRot(`<p>Vorher</p>${CTA}<p>Nachher</p>`);
    expect(out).toBe("<p>Vorher</p><p>Nachher</p>");
    expect(out).not.toMatch(/amazon|tag=|sponsored|Werbung/i);
  });

  it("macht Partner-Links zu Text und lässt Quellen- und interne Links stehen", () => {
    const html = '<p>Kauf <a href="https://www.amazon.de/dp/B0X?tag=cyberni7400-21&amp;th=1" rel="sponsored">hier</a> oder <a href="https://amzn.to/abc">kurz</a>. Quelle: <a class="src-link" href="https://www.amazon.de/dp/B0X" rel="noopener noreferrer nofollow">amazon.de</a>, <a href="/methodik">Methodik</a>.</p>';
    const out = stripAffiliateForRot(html);
    expect(out).not.toMatch(/tag=|amzn\.to|sponsored/);
    expect(out).toContain("Kauf <span>hier</span> oder <span>kurz</span>");
    expect(out).toContain('<a class="src-link" href="https://www.amazon.de/dp/B0X" rel="noopener noreferrer nofollow">amazon.de</a>');
    expect(out).toContain('<a href="/methodik">Methodik</a>');
  });

  it("lässt HTML ohne Partner-Links unverändert", () => {
    const html = '<div class="fp-box fp-weiter"><p><strong>Besser bewertet:</strong> <a href="/x">Test</a> &amp; mehr</p></div>';
    expect(stripAffiliateForRot(html)).toBe(html);
  });
});
