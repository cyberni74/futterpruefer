import { describe, expect, it } from "vitest";
import { directAnswer, keywordName, kurzGesagt, renameBodyFazit, reviewFaq, seoFazitHeading } from "./review-seo";
import { comparisonForPost, comparisonForReview, isInComparison } from "./comparison-links";
import { faqPageJsonLd } from "./faq-schema";

const base = { name: "Testfutter Rind", totalScore: 45, testedAt: new Date("2026-10-23T10:00:00Z"), verdict: "Viel Werbung, wenig Angaben", pros: ["Rind an erster Stelle"], cons: ["Calcium fehlt"], claims: [{ claim: "heilt alles", rating: "UNZULAESSIG" as const, reason: "Krankheitsbezug", legal: "", imageUrl: "" }], price: 10, packageSize: "800 g", pricePerKg: 12.5, priceDate: new Date("2026-10-23T10:00:00Z"), composition: "Rind 60 %, Brühe, Mineralstoffe", ergaenzung: false };

describe("review-seo", () => {
  it("Fazit-H2 enthält Keyword und Monat", () => {
    expect(seoFazitHeading("Testfutter Rind", base.testedAt)).toBe("Fazit: Testfutter Rind im Test Oktober 2026");
  });
  it("Fazit-H2 nutzt das kurze Keyword", () => {
    expect(keywordName("Rinti Kennerfleisch Rind Test", "Rinti", "Rinti Kennerfleisch Rind, Nassfutter für Hunde, 400 g Dose")).toBe("Rinti Kennerfleisch Rind");
    expect(keywordName("Malzpaste Test", "GimCat", "GimCat Malt-Soft Paste Extra, 100 g")).toBe("GimCat Malt-Soft Paste Extra");
    expect(keywordName("", null, "Produkt X")).toBe("Produkt X");
  });
  it("erster Satz beantwortet die Frage mit Punkten und Ampel", () => {
    expect(directAnswer(base)).toContain("45 von 100 Punkten, Ampel Rot");
  });
  it("Kurz gesagt nennt Ampel, Plus, Minus, Irreführung, Preis", () => {
    const k = kurzGesagt(base).join(" ");
    expect(k).toContain("Ampel Rot");
    expect(k).toContain("Eine Werbeaussage halten wir für irreführend.");
    expect(k).toMatch(/12,50\s€ pro Kilogramm/);
  });
  it("FAQ hat mindestens 5 Fragen und ergibt FAQPage-Schema, keine Sperrwörter, keine Links", () => {
    const f = reviewFaq(base, { title: "X" });
    expect(f.length).toBeGreaterThanOrEqual(5);
    const ld = faqPageJsonLd(f)!;
    expect(ld.mainEntity).toHaveLength(f.length);
    const txt = JSON.stringify(f).toLowerCase();
    for (const w of ["zulässig", "unabhängig", "betrug", "rechtlich angreifbar", "tag=", "amazon.de"]) expect(txt).not.toContain(w);
  });
  it("Urteil: nur erster Buchstabe klein", () => {
    expect(directAnswer({ ...base, totalScore: 70 })).toContain("Nach unserem Bewertungsschema: mit Abstrichen.");
    expect(directAnswer(base)).toContain("Nach unserem Bewertungsschema: nicht empfehlenswert.");
  });
  it("Singular bei genau einer irreführenden Aussage, Plural ab zwei", () => {
    expect(reviewFaq(base).map((f) => f.question)).toContain("Welche Werbeaussage zu Testfutter Rind halten wir für irreführend?");
    const two = { ...base, claims: [...base.claims, { ...base.claims[0], claim: "macht jung" }] };
    expect(reviewFaq(two).map((f) => f.question)).toContain("Welche Werbeaussagen zu Testfutter Rind halten wir für irreführend?");
  });
  it("Vergleichstest-Frage: ähnliche Produkte, wenn das Produkt nicht im Vergleich steht", () => {
    const c = { title: "Nassfutter für Hunde im Test 2026: 7 Rind-Dosen im Vergleich" };
    const other = reviewFaq(base, c, false).at(-1)!;
    expect(other.question).toBe("Gibt es einen Vergleichstest zu ähnlichen Produkten?");
    expect(other.answer).toBe("Ja: Nassfutter für Hunde im Test 2026: 7 Rind-Dosen im Vergleich. Testfutter Rind selbst ist darin nicht enthalten. Der Link steht direkt über diesen Fragen.");
    expect(reviewFaq(base, c, true).at(-1)!.question).toBe("Gibt es einen Vergleichstest zu Testfutter Rind?");
    const nf = comparisonForReview({ title: "Rinti Kennerfleisch Rind", categorySlug: "alleinfuttermittel-hund" });
    expect(isInComparison(nf, "rinti-kennerfleisch-rind-400g-test")).toBe(true);
    expect(isInComparison(nf, "tierliebhaber-nassfutter-huhn-mit-gemuese")).toBe(false);
    expect(comparisonForReview({ title: "Gelenk-Pulver", categorySlug: "ergaenzungsfuttermittel-hund" })?.title).toBe("Gelenktabletten und Gelenkpulver für Hunde im Test 2026: 5 Gelenkmittel im Vergleich");
  });
  it("benennt schlichte Body-Fazit-H2 um", () => {
    expect(renameBodyFazit('<h2 id="a">Fazit</h2>')).toBe('<h2 id="a">Detailbewertung</h2>');
  });
  it("ordnet Vergleichstests zu", () => {
    expect(comparisonForReview({ title: "Premium Lachsöl", categorySlug: "ergaenzungsfuttermittel-hund" })?.slug).toBe("lachsoel-test-hund-oktober-2026");
    expect(comparisonForReview({ title: "Gelenk-Pulver", categorySlug: "ergaenzungsfuttermittel-hund" })?.slug).toBe("gelenk-test-hund-oktober-2026");
    expect(comparisonForReview({ title: "Rinti Kennerfleisch Rind", categorySlug: "alleinfuttermittel-hund" })?.slug).toBe("nassfutter-test-rind-hund-oktober-2026");
    expect(comparisonForReview({ title: "Lachsöl", categorySlug: "ergaenzungsfuttermittel-katze" })).toBeNull();
    expect(comparisonForPost("lachsoel-hunde")?.slug).toBe("lachsoel-test-hund-oktober-2026");
  });
});
