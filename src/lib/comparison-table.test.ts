import { describe, expect, it } from "vitest";
import {
  affiliateAmazonUrl,
  comparisonIdForBlogSlug,
  documentedPricePerDay,
  dosePerKgLabel,
  formatNote,
  isTeamWertungSlug,
  productNameWithTeamWertung,
  publishedComparisonRows,
  purposeForReview,
  reviewToComparisonRow,
  rowAmazonCtaUrl,
  rowNote,
  rowNoteLabel,
  rowRating,
  splitFirstVtTable,
  METHODIK_V1_NOTE_FOOTNOTE,
  PRICE_PER_DAY_FOOTNOTE,
  TEAMWERTUNG_FOOTNOTE,
} from "./comparison-table";
import { isMethodikV1, noteFuerPunkte } from "./scoring";

describe("comparison-table helpers", () => {
  it("rechnet die Note nach Notenschlüssel V3", () => {
    expect(formatNote(noteFuerPunkte(100))).toBe("1,0");
    expect(rowNote({ score: 59 })).toBe(noteFuerPunkte(59));
    expect(formatNote(rowNote({ score: 59 }))).toMatch(/^\d,\d$/);
  });

  it("zeigt den Amazon-CTA nur bei Grün und Gelb, immer mit Partner-Tag", () => {
    const url = affiliateAmazonUrl("B07Z669DGV");
    expect(url).toContain("tag=cyberni7400-21");
    expect(rowAmazonCtaUrl({ name: "Cadoc", href: "/x", score: 59, amazonUrl: url })).toBe(url);
    expect(rowAmazonCtaUrl({ name: "Grün", href: "/x", score: 80, amazonUrl: url })).toBe(url);
    expect(rowAmazonCtaUrl({ name: "Rot", href: "/x", score: 50, amazonUrl: url })).toBeNull();
    expect(rowRating({ score: 28 })).toBe("schlecht");
  });

  it("nennt die Dosis je kg nur bei belegter Tagesmenge (10-kg-Konvention)", () => {
    expect(dosePerKgLabel([])).toBeNull();
    expect(dosePerKgLabel([{ name: "Grünlippmuschel", mengeMgProTagesdosis: 1500 }])).toBe("Grünlippmuschel 150 mg/kg");
    expect(dosePerKgLabel([{ name: "Grünlippmuschel", mengeMgProTagesdosis: null }])).toBeNull();
    expect(documentedPricePerDay([null, 0, 0.05])).toBe(0.05);
    expect(documentedPricePerDay([null, 0])).toBeNull();
  });

  it("ordnet Tests einem Zweck zu und hält Kauartikel aus Haut & Fell raus", () => {
    expect(purposeForReview({ slug: "veddelholzer-gelenktabletten-hund-test" })).toBe("gelenke");
    expect(purposeForReview({ slug: "tierliebhaber-premium-lachsoel" })).toBe("haut_fell_oel");
    expect(purposeForReview({ slug: "tierliebhaber-hirschohren-mit-fell" })).toBe("snacks_kauartikel");
    expect(purposeForReview({ slug: "kunto-gras-kotfresser-drops-hund-test" })).toBe("kotfressen");
    expect(purposeForReview({ slug: "symbiopet-dog-probiotika-hund-test" })).toBe("verdauung");
    expect(purposeForReview({ slug: "proden-plaqueoff-pulver-hund-test" })).toBe("zaehne");
    expect(purposeForReview({ slug: "mammaly-relax-time-test" })).toBe("nerven");
    expect(purposeForReview({ slug: "hundpur-z-protect-hund-test" })).toBe("weitere");
  });

  it("liefert die veröffentlichten Vergleichszeilen ohne Amazon an Rot-Produkten", () => {
    const gelenk = publishedComparisonRows("gelenktabletten-hund-vergleich");
    expect(gelenk).toHaveLength(4);
    expect(gelenk[0]?.score).toBe(59);
    expect(rowAmazonCtaUrl(gelenk[0]!)).toContain("B07Z669DGV");
    expect(rowAmazonCtaUrl(gelenk[1]!)).toBeNull();
    expect(comparisonIdForBlogSlug("gelenk-test-hund-oktober-2026")).toBe("gelenktabletten-hund-vergleich");
    const lachs = publishedComparisonRows("lachsoel-hund-vergleich");
    expect(lachs[0]?.name).toContain("Scheidler");
    expect(rowAmazonCtaUrl(lachs[0]!)).toContain("B00DDNWJ1Y");
    expect(rowAmazonCtaUrl(lachs[4]!)).toBeNull();
  });

  it("schneidet die erste vt-table aus dem Beitragskörper", () => {
    const html = '<p>Intro</p><table class="vt-table"><tr><td>A</td></tr></table><p>Rest</p><table class="vt-table"><tr><td>B</td></tr></table>';
    expect(splitFirstVtTable(html)).toEqual({ before: "<p>Intro</p>", after: '<p>Rest</p><table class="vt-table"><tr><td>B</td></tr></table>' });
    expect(splitFirstVtTable("<p>ohne Tabelle</p>")).toBeNull();
  });

  it("schließt die vt-table-box im vorangehenden Fragment, damit das SSR-HTML hydrierbar bleibt", () => {
    const html =
      '<h2 id="vergleich">Gelenkmittel für Hunde: alle vier im Vergleich</h2>\n' +
      '<div class="fp-box vt-table-box">\n' +
      '<table class="vt-table"><thead><tr><th>Produkt</th></tr></thead><tbody><tr><td>Cadoc</td></tr></tbody></table>\n' +
      '<p>Preise: Amazon.de am 23.10.2026, Einmalkauf, Lieferadresse Berlin (Q2, Q3, Q5, Q8).</p>\n' +
      '</div>\n' +
      '<div class="fp-box vt-method"><h2 id="methode">Wie wir getestet haben</h2></div>';
    const parts = splitFirstVtTable(html);
    expect(parts).not.toBeNull();
    expect(parts!.before).toBe(
      '<h2 id="vergleich">Gelenkmittel für Hunde: alle vier im Vergleich</h2>\n' +
        '<div class="fp-box vt-table-box">\n</div>',
    );
    expect(parts!.after).toBe(
      '\n<p>Preise: Amazon.de am 23.10.2026, Einmalkauf, Lieferadresse Berlin (Q2, Q3, Q5, Q8).</p>\n\n' +
        '<div class="fp-box vt-method"><h2 id="methode">Wie wir getestet haben</h2></div>',
    );
    expect(parts!.before).not.toMatch(/<div[^>]*vt-table-box[^>]*>\s*$/);
    expect(parts!.after.startsWith("\n</div>")).toBe(false);
    const divBalance = (html: string) =>
      (html.match(/<div\b[^>]*>/gi)?.length ?? 0) - (html.match(/<\/div>/gi)?.length ?? 0);
    expect(divBalance(parts!.before)).toBe(0);
    expect(divBalance(parts!.after)).toBe(0);
  });
  it("zeigt bei Methodik Version 1 keine Note, bei 55 Punkten Ampel Rot", () => {
    const row = { name: "V1", href: "/x", score: 55, methodikVersion: "1" };
    expect(isMethodikV1(row.methodikVersion)).toBe(true);
    expect(rowRating(row)).toBe("schlecht");
    expect(rowNoteLabel(row)).toBe("–");
    expect(rowNoteLabel(row)).not.toBe(formatNote(noteFuerPunkte(55)));
    expect(METHODIK_V1_NOTE_FOOTNOTE).toBe(
      "Note ‚–‘: Test nach Methodik Version 1 (Bewertungsstand 27.10.2026); dafür vergeben wir keine Note. Maßgeblich ist die Testseite.",
    );
  });

  it("kennzeichnet die MEDIDOG-Teamwertung am Namen", () => {
    expect(isTeamWertungSlug("medidog-haut-und-fellglueck-paste")).toBe(true);
    expect(isTeamWertungSlug("veddelholzer-gelenktabletten-hund-test")).toBe(false);
    expect(productNameWithTeamWertung("MEDIDOG Haut- & Fellglück Paste 500 g", true)).toBe(
      "MEDIDOG Haut- & Fellglück Paste 500 g (Teamwertung)",
    );
    expect(productNameWithTeamWertung("MEDIDOG Haut- & Fellglück Paste 500 g (Teamwertung)", true)).toBe(
      "MEDIDOG Haut- & Fellglück Paste 500 g (Teamwertung)",
    );
    const row = reviewToComparisonRow({
      slug: "medidog-haut-und-fellglueck-paste",
      title: "MEDIDOG",
      brand: "MEDIDOG",
      productName: "Haut- & Fellglück Paste 500 g",
      totalScore: 91.8,
      methodikVersion: "ergaenzung-v1.1",
      category: { slug: "ergaenzungsfuttermittel-hund" },
    });
    expect(row.teamWertung).toBe(true);
    expect(rowNoteLabel(row)).toBe(formatNote(noteFuerPunkte(91.8)));
    expect(TEAMWERTUNG_FOOTNOTE).toBe(
      "Teamwertung: Gesamtwertung nach Entscheidung des Herausgebers, außerhalb unserer Methodik für Ergänzungsfutter. Nach der Methodik ergäben sich 28 von 100 Punkten; Einzelheiten auf der Testseite und auf der Methodik-Seite.",
    );
    expect(PRICE_PER_DAY_FOOTNOTE).toBe(
      "Preis / Tag: Tagesdosis für einen Hund mit 10 kg, berechnet zum Preisstand des jeweiligen Tests; heutige Preise können abweichen.",
    );
  });

});
