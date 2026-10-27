import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import MethodikPage from "../page";
import ErgaenzungsfutterMethodikPage, { ERGAENZUNG_FAQ } from "./page";

describe("Methodik Ergänzungsfutter", () => {
  const html = renderToStaticMarkup(<ErgaenzungsfutterMethodikPage />);

  it("übernimmt Stand, Erstveröffentlichung und die freigegebenen Kernsätze", () => {
    expect(html).toContain("Stand: 27.10.2026 · Verantwortlich: Redaktion Futterprüfer · Methodik-Version: ergaenzung-v1.1");
    expect(html).toContain("25.10.2026 – ergaenzung-v1.1:");
    expect(html).toContain("Omega-3-Quelle ohne Wirksamkeitsstudie beim Hund: −2 Punkte.");
    expect(html).toContain("Die mit v1.1 ergänzten Quellen wurden am 25.10.2026 aufgerufen.");
    expect(html).toContain("Studien zu Sicherheit und Aufnahme ins Blut (Dahms 2019) sowie zu Verdaulichkeit und Akzeptanz (Souza 2019), aber keine zur Wirkung auf Gelenke oder Haut.");
    expect(html).toContain("Änderungsprotokoll:");
    expect(html).toContain("<strong>27.10.2026:</strong> Geltungsbereich festgelegt (Abschnitt 1");
    expect(html).toContain("id=\"geltungsbereich\"");
    expect(html).toContain("Festgelegt am 27.10.2026.");
    expect(html).toContain("17.10.2026 – Erstveröffentlichung");
    expect(html).toContain("höchstens 59 Punkte (Rot)");
    expect(html).toContain("höchstens 39 Punkte");
    expect(html).toContain("310 mg × kg KG^0,75");
    expect(html).toContain("2,1 × 10⁹ KBE pro Tier und Tag");
    expect(html).toContain("href=\"/methodik\"");
    expect(html).toContain("PMID 16647870");
    expect(html).toContain("(nur Unterlagen, die der Hersteller von sich aus einreicht oder die öffentlich zugänglich sind; wir fragen Hersteller nicht an)");
    expect(html).not.toContain("auf unsere Anfrage hin");
  });

  it("veröffentlicht keine internen Abschnitte", () => {
    expect(html).not.toContain("Medidog");
    expect(html).not.toContain("Canina");
    expect(html).not.toContain("TJURE");
    expect(html).not.toContain("Beispielrechnung");
    expect(html).not.toContain("Admin-Formular");
    expect(html).not.toContain("Frewert");
    expect(html).not.toContain("SEO-");
  });

  it("spiegelt die sichtbaren FAQ-Antworten im FAQPage-JSON-LD", () => {
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]!));
    const faq = blocks.find((block) => block["@type"] === "FAQPage");
    expect(faq.mainEntity).toHaveLength(ERGAENZUNG_FAQ.length);
    for (const item of ERGAENZUNG_FAQ) {
      expect(html).toContain(item.question);
      expect(html).toContain(item.answer);
      const entity = faq.mainEntity.find((entry: { name: string }) => entry.name === item.question);
      expect(entity.acceptedAnswer.text).toBe(item.answer);
    }
    expect(blocks.some((block) => block["@type"] === "BreadcrumbList")).toBe(true);
  });

  it("verlinkt von der Alleinfutter-Methodik, ohne den Satz umzubauen", () => {
    const methodik = renderToStaticMarkup(<MethodikPage />);
    expect(methodik).toContain("getrennt nach Hunden und Katzen sowie nach Alleinfutter und ");
    expect(methodik).toContain("href=\"/methodik/ergaenzungsfutter\"");
    expect(methodik).toContain(">Ergänzungsfutter</a>");
  });
});
