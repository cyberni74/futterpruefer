import { describe, expect, it } from "vitest";
import { sanitize } from "./sanitize";
import {
  bodyRepeatsAssessment,
  bodyRepeatsLead,
  isLegacyLexikonBody,
  lexikonArticleJsonLd,
  lexikonDefinedTerm,
  lexikonDocumentTitle,
  lexikonFaqJsonLd,
  lexikonHeadline,
  lexikonHero,
  lexikonImagesOutsideBody,
  lexikonMetaDescription,
  lexikonVisibleFaqs,
  parseLexikonFaqs,
  parseLexikonImages,
  promoteLeadImage,
} from "./lexikon-article";

const SEED = "<p>Aminosulfonsäure, die Katzen nur unzureichend selbst bilden.</p><h2>Einschätzung</h2><p>Für Katzen lebensnotwendig. Ein Zusatz in Katzenfutter ist sinnvoll.</p>";

const LONG = `<h2 id="kurzantwort">Kurzantwort</h2>
<p>Tierische Nebenerzeugnisse sind eine Etikettenkategorie.</p>
<figure><img src="https://cotopvhmsqztjtdsdnoc.supabase.co/storage/v1/object/public/bilder/was-sind-tierische-nebenerzeugnisse.webp" alt="Symbolbild: Zerlegeraum" loading="lazy"><figcaption>Am Anfang steht der Schlachthof.</figcaption></figure>
<table><thead><tr><th>Bestandteil</th><th>Protein</th></tr></thead><tbody><tr><td>Rinderleber</td><td>20,4 g</td></tr></tbody></table>
<h2 id="faq">Häufige Fragen zu tierischen Nebenerzeugnissen</h2>
<h3>Was sind tierische Nebenerzeugnisse?</h3>
<p>Tierische Nebenerzeugnisse sind Teil der Etikettenkategorie „Fleisch und tierische Nebenerzeugnisse“.</p>
<h3>Ist das dasselbe wie tierische Nebenprodukte?</h3>
<p>Nein. „Tierische Nebenprodukte“ ist ein Begriff aus dem Hygienerecht.</p>
<h2 id="quellen">Quellen</h2>`;

const HERO = "https://cotopvhmsqztjtdsdnoc.supabase.co/storage/v1/object/public/bilder/was-sind-tierische-nebenerzeugnisse.webp";

describe("Lexikon-Altbestand", () => {
  it("erkennt den Seed-Kurztext und leere Bodies", () => {
    expect(isLegacyLexikonBody(SEED)).toBe(true);
    expect(isLegacyLexikonBody("")).toBe(true);
    expect(isLegacyLexikonBody(null)).toBe(true);
    expect(isLegacyLexikonBody("<h2>Fachliche Einschätzung</h2><p>Kurz.</p>")).toBe(true);
  });

  it("lässt einen langen Artikel mit Tabelle, Bild und eigener Gliederung stehen", () => {
    expect(isLegacyLexikonBody(LONG)).toBe(false);
    expect(isLegacyLexikonBody("<h2>Wirkung</h2><p>Ein eigener Absatz, der nicht die Einschätzung wiederholt.</p>")).toBe(false);
  });

  it("wiederholt die Einschätzung nicht, wenn der Artikel sie schon enthält", () => {
    const assessment = "Innereien können sehr hochwertig sein. Problematisch ist die fehlende Transparenz.";
    expect(bodyRepeatsAssessment(`<p>${assessment}</p>`, assessment)).toBe(true);
    expect(bodyRepeatsAssessment("<p>Ganz anderer Text über etwas anderes, der lang genug ist für den Vergleich.</p>", assessment)).toBe(false);
    expect(bodyRepeatsLead(`<p>${"Etikettenkategorie für Fleisch und Erzeugnisse aus der Verarbeitung von Tierkörpern."}</p>`, "Etikettenkategorie für Fleisch und Erzeugnisse aus der Verarbeitung von Tierkörpern.")).toBe(true);
  });
});

describe("Lexikon-SEO und H1", () => {
  it("fällt auf das bisherige Titelmuster und die Kurzbeschreibung zurück", () => {
    expect(lexikonDocumentTitle({ name: "Taurin", concern: "UNBEDENKLICH", metaTitle: "" })).toBe("Taurin im Tierfutter: Unbedenklich?");
    expect(lexikonDocumentTitle({ name: "Taurin", concern: "UNBEDENKLICH", metaTitle: "  Taurin im Katzenfutter  " })).toBe("Taurin im Katzenfutter");
    expect(lexikonHeadline({ headline: "", name: "Taurin" })).toBe("Taurin");
    expect(lexikonHeadline({ headline: " Tierische Nebenerzeugnisse im Hunde- und Katzenfutter ", name: "Tierische Nebenerzeugnisse" })).toBe(
      "Tierische Nebenerzeugnisse im Hunde- und Katzenfutter",
    );
    const kurz = "Aminosulfonsäure, die Katzen nur unzureichend selbst bilden – sie muss mit der Nahrung zugeführt werden.";
    expect(lexikonMetaDescription({ metaDescription: "", shortDescription: kurz })).toContain(kurz);
    expect(lexikonMetaDescription({ metaDescription: "Eigene Meta-Beschreibung mit genug Zeichen, damit sie unverändert bleibt und nicht aufgefüllt wird.", shortDescription: kurz })).toBe(
      "Eigene Meta-Beschreibung mit genug Zeichen, damit sie unverändert bleibt und nicht aufgefüllt wird.",
    );
  });
});

describe("Lexikon-Bilder", () => {
  it("lässt leere und unerlaubte URLs weg und nimmt höchstens fünf", () => {
    const images = parseLexikonImages([
      { url: "", alt: "leer", caption: "" },
      { url: "javascript:alert(1)", alt: "böse", caption: "" },
      { url: HERO, alt: "Symbolbild: Zerlegeraum", caption: "Am Anfang steht der Schlachthof." },
      { url: "/uploads/napf.webp", alt: "Napf", caption: "" },
    ]);
    expect(images).toEqual([
      { url: HERO, alt: "Symbolbild: Zerlegeraum", caption: "Am Anfang steht der Schlachthof." },
      { url: "/uploads/napf.webp", alt: "Napf", caption: "" },
    ]);
    expect(lexikonHero(images)?.url).toBe(HERO);
    expect(lexikonHero([])).toBeNull();
  });

  it("gibt kein img für Bilder aus, die schon im Artikeltext stehen", () => {
    const images = parseLexikonImages([
      { url: HERO, alt: "Symbolbild: Zerlegeraum", caption: "Caption" },
      { url: "/uploads/napf.webp", alt: "Napf", caption: "Credit" },
    ]);
    const rendered = sanitize(LONG);
    expect(lexikonImagesOutsideBody(images, rendered).map((image) => image.url)).toEqual(["/uploads/napf.webp"]);
  });

  it("hebt nur das erste Bild im Text an, ohne loading=lazy", () => {
    const html = promoteLeadImage(sanitize(LONG));
    expect(html).toContain('fetchpriority="high"');
    expect(html.match(/fetchpriority="high"/g)).toHaveLength(1);
    expect(html).not.toMatch(/<img[^>]*fetchpriority="high"[^>]*loading="lazy"/);
    expect(html).toContain("<figcaption>Am Anfang steht der Schlachthof.</figcaption>");
    expect(html).toContain('data-label="Bestandteil"');
  });

  it("lässt ein Bild weiter unten im Text lazy", () => {
    const late = `<p>${"Wort ".repeat(800)}</p><img src="/uploads/spaet.webp" alt="spät" loading="lazy">`;
    expect(promoteLeadImage(late)).toBe(late);
  });
});

describe("Lexikon-JSON-LD", () => {
  const at = new Date("2026-11-12T12:00:00.000Z");

  it("ergänzt DefinedTerm um Synonyme und lässt alternateName weg, wenn keine da sind", () => {
    expect(lexikonDefinedTerm({ name: "Taurin", synonyms: ["Taurine"], shortDescription: "Aminosäure.", slug: "taurin" }).alternateName).toEqual(["Taurine"]);
    expect(lexikonDefinedTerm({ name: "Zucker", synonyms: [], shortDescription: "Süß.", slug: "zucker" })).not.toHaveProperty("alternateName");
  });

  it("liefert Article mit dateModified und datePublished", () => {
    const data = lexikonArticleJsonLd({
      name: "Taurin",
      slug: "taurin",
      headline: "Taurin",
      description: "Aminosäure.",
      images: [],
      publishedAt: null,
      createdAt: at,
      updatedAt: at,
    });
    expect(data["@type"]).toBe("Article");
    expect(data.datePublished).toBe(at.toISOString());
    expect(data.dateModified).toBe(at.toISOString());
    expect(data.headline).toBe("Taurin");
    expect(data).not.toHaveProperty("image");
  });

  it("FAQPage aus dem sichtbaren Body ist wortgleich, gespeicherte Paare ersetzen ihn nicht", () => {
    const rendered = sanitize(LONG);
    const stored = [{ question: "Andere Frage?", answer: "Andere Antwort, die nicht sichtbar ist." }];
    const visible = lexikonVisibleFaqs(true, rendered, stored);
    expect(visible.source).toBe("body");
    expect(visible.items.map((item) => item.question)).toEqual(["Was sind tierische Nebenerzeugnisse?", "Ist das dasselbe wie tierische Nebenprodukte?"]);
    const ld = lexikonFaqJsonLd(visible.items);
    expect(ld?.["@type"]).toBe("FAQPage");
    expect(ld?.mainEntity[0].acceptedAnswer.text).toBe(visible.items[0].answer);
    expect(ld?.mainEntity[0].name).toBe(visible.items[0].question);
  });

  it("nutzt die gepflegten Paare, wenn der Artikeltext keine FAQ zeigt, und sonst nichts", () => {
    const stored = parseLexikonFaqs([{ question: "Was ist Taurin?", answer: "Eine Aminosulfonsäure." }, { question: "", answer: "" }]);
    const visible = lexikonVisibleFaqs(false, SEED, stored);
    expect(visible).toEqual({ source: "field", items: [{ question: "Was ist Taurin?", answer: "Eine Aminosulfonsäure." }] });
    expect(lexikonFaqJsonLd(visible.items)?.mainEntity[0].acceptedAnswer.text).toBe("Eine Aminosulfonsäure.");
    expect(lexikonVisibleFaqs(true, "<p>Kein FAQ-Abschnitt.</p>", []).source).toBe("none");
    expect(lexikonFaqJsonLd([])).toBeNull();
  });
});
