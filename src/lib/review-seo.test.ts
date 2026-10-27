import { describe, expect, it } from "vitest";
import { amazonPriceUrl, directAnswer, keywordName, kurzGesagt, priceCite, priceSourceFromArticle, renameBodyFazit, reviewFaq, seoFazitHeading, withoutLeadingScore } from "./review-seo";
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
    expect(directAnswer(base)).toBe("Wie schneidet Testfutter Rind im Test ab? Nach unserem Bewertungsschema: nicht empfehlenswert. Testfutter Rind erreicht im Test vom 23.10.2026 45 von 100 Punkten, Ampel Rot.");
    expect(directAnswer(base)).not.toContain("Lohnt sich");
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
  it("benennt jede Body-H2 um, die mit Fazit beginnt (SEO-004)", () => {
    expect(renameBodyFazit('<h2 id="a">Fazit</h2>')).toBe('<h2 id="a">Unser Urteil im Detail</h2>');
    expect(renameBodyFazit("<h2>Fazit im Detail</h2>")).toBe("<h2>Unser Urteil im Detail</h2>");
    expect(renameBodyFazit("<h2><strong>Fazit:</strong> Zesty Paws im Test (Oktober 2026)</h2>")).toBe("<h2>Unser Urteil im Detail</h2>");
    expect(renameBodyFazit("<h2>Zusammensetzung</h2><h3>Fazit</h3><h2>Unser Fazit</h2>")).toBe("<h2>Zusammensetzung</h2><h3>Fazit</h3><h2>Unser Fazit</h2>");
  });
  it("nennt die Punktzahl in der FAQ-Antwort nur einmal (SEO-004)", () => {
    expect(withoutLeadingScore("22 von 100 Punkten, Rot (nicht empfehlenswert). Pluspunkt: Prozente.", 22)).toBe("Pluspunkt: Prozente.");
    expect(withoutLeadingScore("62/100, Gelb. Frischer Lachs vorn.", 62)).toBe("Frischer Lachs vorn.");
    expect(withoutLeadingScore("59 von 100 Punkten, Rot (nicht empfehlenswert), mit Warnsignal Sicherheit. Pluspunkt: x.", 59)).toBe("Mit Warnsignal Sicherheit. Pluspunkt: x.");
    expect(withoutLeadingScore("59 von 100 Punkten, Rot, einen Punkt unter Gelb. Bio-Huhn.", 59)).toBe("Einen Punkt unter Gelb. Bio-Huhn.");
    expect(withoutLeadingScore("30 % Muschelfleisch, 22 von 100 Punkten.", 22)).toBe("30 % Muschelfleisch, 22 von 100 Punkten.");
    expect(withoutLeadingScore("21 von 100 Punkten, Rot. x", 22)).toBe("21 von 100 Punkten, Rot. x");
    expect(withoutLeadingScore("Gute Rezeptur. 61 von 100 Punkten, Gelb: nach unserem Bewertungsschema mit Abstrichen.", 61)).toBe("Gute Rezeptur.");
    expect(withoutLeadingScore("Viel Getreide. Gesamt: 76/100, mit Abstrichen.", 76)).toBe("Viel Getreide.");
    expect(withoutLeadingScore("Unscharf deklariert. Mit 45 von 100 Punkten ist es nach unserem Schema nicht empfehlenswert.", 45)).toBe("Unscharf deklariert.");
    expect(withoutLeadingScore("Offen deklariert. 52/100 Punkte. Dazu kommt der Preis.", 52)).toBe("Offen deklariert. 52/100 Punkte. Dazu kommt der Preis.");
    expect(withoutLeadingScore("Kauartikel mit 60/100 Fleisch.", 60)).toBe("Kauartikel mit 60/100 Fleisch.");
    const faq = reviewFaq({ ...base, totalScore: 22, verdict: "22 von 100 Punkten, Rot (nicht empfehlenswert). Pluspunkt: Prozente." });
    expect(faq[0].answer.match(/22 von 100 Punkten/g)).toHaveLength(1);
    expect(faq[0].answer).toContain("Pluspunkt: Prozente.");
  });
  it("nennt die Preisquelle nur mit Datum", () => {
    expect(priceCite("Amazon", "23.10.2026")).toBe("Preis bei Amazon, Stand 23.10.2026");
    expect(priceCite("Hersteller-Shop", "16.10.2026")).toBe("Preis im Hersteller-Shop, Stand 16.10.2026");
    expect(priceCite("Amazon", "")).toBe("");
    expect(priceCite("Hersteller-Shop", "")).toBe("");
    expect(priceCite("", "23.10.2026")).toBe("Stand 23.10.2026");
    expect(priceCite("", "")).toBe("");
    const withAmazon = kurzGesagt({ ...base, priceSource: "Amazon" }).join(" ");
    expect(withAmazon).toContain("Preis bei Amazon, Stand 23.10.2026");
    expect(withAmazon).toContain("Preise können sich seitdem geändert haben.");
    expect(kurzGesagt(base).join(" ")).toContain("(Stand 23.10.2026)");
    expect(kurzGesagt(base).join(" ")).not.toContain("Preis bei");
    const faq = reviewFaq({ ...base, priceSource: "Hersteller-Shop" }).find((f) => f.question.startsWith("Was kostet"));
    expect(faq?.answer).toContain("Preis im Hersteller-Shop, Stand 23.10.2026");
    expect(faq?.answer).toContain("Preise können je nach Händler abweichen.");
    const amazonFaq = reviewFaq({ ...base, priceSource: "Amazon" }).find((f) => f.question.startsWith("Was kostet"));
    expect(amazonFaq?.answer).toContain("Preise können sich seitdem geändert haben.");
    const undatiert = { ...base, priceDate: null };
    expect(kurzGesagt(undatiert).join(" ")).not.toMatch(/€|Preis:/);
    expect(reviewFaq(undatiert).some((f) => f.question.startsWith("Was kostet"))).toBe(false);
  });
  it("baut den Amazon-Link nur aus ASIN oder Produktlink", () => {
    expect(amazonPriceUrl({ asin: "b000000000" })).toBe("https://www.amazon.de/dp/B000000000?tag=cyberni7400-21");
    expect(amazonPriceUrl({ html: '<a href="https://www.amazon.de/dp/B001J4G1LI">amazon.de</a>' })).toBe("https://www.amazon.de/dp/B001J4G1LI?tag=cyberni7400-21");
    expect(amazonPriceUrl({ kaufUrl: "https://www.amazon.de/dp/B07KCS7YX1?tag=anderer" })).toBe("https://www.amazon.de/dp/B07KCS7YX1?tag=cyberni7400-21");
    expect(amazonPriceUrl({ html: '<a href="https://www.leonardo-catfood.de/leonardo">Shop</a>' })).toBeNull();
    expect(amazonPriceUrl({})).toBeNull();
  });
  it("liest die Preisquelle nur aus einer ausdrücklichen Preisangabe", () => {
    expect(priceSourceFromArticle("<p>Im Hersteller-Shop kostet die 300-g-Packung 5,19 €.</p>")).toBe("Hersteller-Shop");
    expect(priceSourceFromArticle("<p>Bei Fressnapf kostet der Sack 67,49 €.</p>")).toBe("Fressnapf");
    expect(priceSourceFromArticle("<p>Bei zooplus kostet die Dose 1,69 €.</p>")).toBe("zooplus");
    expect(priceSourceFromArticle("<p>Auf happydog.at kostet die Packung 2,63 €.</p>")).toBe("happydog.at");
    expect(priceSourceFromArticle("<p>Amazon nannte am 17.10.2026 14,75 Euro für 4 kg.</p>")).toBe("Amazon");
    expect(priceSourceFromArticle("<li>Amazon-Preis am 17.10.2026: 14,75 Euro für 4 kg.</li>")).toBe("Amazon");
    expect(priceSourceFromArticle('<p><a href="https://www.amazon.de/dp/B000">bei Amazon ansehen</a></p>')).toBeNull();
    expect(priceSourceFromArticle("<p>Die Packung kostet laut Shop 2,79 €.</p>")).toBeNull();
    expect(priceSourceFromArticle("<p>Amazon zeigte kein Angebot.</p>")).toBeNull();
    expect(priceSourceFromArticle(null)).toBeNull();
  });
  it("ordnet Vergleichstests zu", () => {
    expect(comparisonForReview({ title: "Premium Lachsöl", categorySlug: "ergaenzungsfuttermittel-hund" })?.slug).toBe("lachsoel-test-hund-oktober-2026");
    expect(comparisonForReview({ title: "AniForte Algenöl", categorySlug: "ergaenzungsfuttermittel-hund" })?.slug).toBe("algenoel-test-hund-oktober-2026");
    expect(comparisonForReview({ title: "Gelenk-Pulver", categorySlug: "ergaenzungsfuttermittel-hund" })?.slug).toBe("gelenk-test-hund-oktober-2026");
    expect(comparisonForReview({ title: "Rinti Kennerfleisch Rind", categorySlug: "alleinfuttermittel-hund" })?.slug).toBe("nassfutter-test-rind-hund-oktober-2026");
    expect(comparisonForReview({ title: "Lachsöl", categorySlug: "ergaenzungsfuttermittel-katze" })).toBeNull();
    expect(comparisonForPost("lachsoel-hunde")?.slug).toBe("lachsoel-test-hund-oktober-2026");
  });
});
