import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { suggestedDeclarationDeduction } from "./product-data";
import { CRITERIA, HARMFUL_FAIL_RATIO, RATING_THRESHOLDS } from "./scoring";
import { FOOTER_CLAIM, SITE } from "./site";
import { HOME_DESCRIPTION, HOME_FAQ, HOME_GUIDES, HOME_H1, INTRO, METHODIK_NOTE, OG_DESCRIPTION, homeJsonLd, homeTitle, introPlain, linkedAnswer } from "./home-seo";

const INTRO_TEXT = [
  "Welches Hundefutter und welches Katzenfutter ist wirklich gut? Futterprüfer bewertet Trockenfutter, Nassfutter und Snacks für Hunde und Katzen nach einem festen 100-Punkte-Schema. Grundlage jedes Tests sind die veröffentlichten Herstellerangaben: Zusammensetzung, analytische Bestandteile, Zusatzstoffe, Fütterungsempfehlung und Preis. Eigene Laboranalysen gehören nicht zum Test, dafür legen wir jeden Bewertungsschritt offen.",
  "Sechs Kriterien mit fester Gewichtung bestimmen die Gesamtnote: Rohstoffqualität (30 Punkte), Schadstoffe & Bedenkliches (20; bewertet anhand der deklarierten Zutaten und Zusatzstoffe), Nährstoffprofil (20), Deklaration & Transparenz (15), Bedarfsdeckung (10) und Preis-Leistung (5). Zusätzlich prüfen wir die Werbeaussagen auf der Verpackung nach dem Futtermittelrecht. So sehen Sie auf einen Blick, ob ein Alleinfuttermittel laut Deklaration die üblichen Nährstoffempfehlungen für Hund oder Katze erfüllt, welche Inhaltsstoffe wir kritisch sehen und wo das Marketing mehr verspricht, als die Deklaration hergibt. Hersteller können Produkte einreichen, auf die Note hat das keinen Einfluss. Begriffe wie offene Deklaration, Taurin oder getreidefrei erklären unser Fachblog und das Futter-Lexikon.",
].join("\n\n");

describe("Startseiten-Title", () => {
  const now = new Date("2026-10-08T12:00:00Z");

  it("übernimmt das Jahr des neuesten Test-Updates, wenn es im laufenden Jahr liegt", () => {
    expect(homeTitle(new Date("2026-10-08T14:10:14Z"), now)).toBe("Hundefutter- & Katzenfutter-Test 2026 | Futterprüfer");
  });

  it("nutzt die Berliner Jahresgrenze, nicht UTC", () => {
    expect(homeTitle(new Date("2025-12-31T23:30:00Z"), now)).toBe("Hundefutter- & Katzenfutter-Test 2026 | Futterprüfer");
    expect(homeTitle(new Date("2025-12-31T22:30:00Z"), now)).toBe("Hundefutter Test & Katzenfutter Test | Futterprüfer");
  });

  it("lässt das Jahr weg, wenn kein Test aus dem laufenden Jahr stammt", () => {
    expect(homeTitle(new Date("2025-06-01T12:00:00Z"), now)).toBe("Hundefutter Test & Katzenfutter Test | Futterprüfer");
    expect(homeTitle(null, now)).toBe("Hundefutter Test & Katzenfutter Test | Futterprüfer");
  });
});

describe("Startseiten-Text", () => {
  it("entspricht Intro, FAQ und Meta aus dem Rechtscheck", () => {
    expect(introPlain()).toBe(INTRO_TEXT);
    expect(HOME_DESCRIPTION).toBe(
      "Hundefutter und Katzenfutter im Test: Rohstoffe, bedenkliche Zusatzstoffe, Nährstoffe und Deklaration nach 100-Punkte-Schema bewertet – transparent erklärt.",
    );
    expect(HOME_FAQ[2].a).toContain("für die tägliche Ration ausreicht");
    expect(HOME_FAQ[3].q).toBe("Werden Trockenfutter und Nassfutter getestet?");
    expect(HOME_FAQ[3].a).toContain("innerhalb einer Kategorie");
    expect(HOME_FAQ[4].a).toContain("im Onlineshop");
    expect(HOME_FAQ[4].a).toContain("nicht zulässig oder nicht ausreichend belegt");
  });

  it("nennt in Meta, H1 und Footer weder Schadstoffe noch Fachtest noch unabhängig", () => {
    for (const text of [HOME_DESCRIPTION, SITE.description, OG_DESCRIPTION, HOME_H1, FOOTER_CLAIM, METHODIK_NOTE]) {
      expect(text).not.toMatch(/Schadstoff|Fachtest|Fachbewertung|unabhängig/i);
    }
  });

  it("Gewichte, Ampel und Werbeaussagen-Abzug folgen dem Code", () => {
    const intro = introPlain();
    for (const criterion of CRITERIA) {
      expect(intro).toContain(criterion.label);
      expect(intro).toContain(String(criterion.max));
    }
    const harmful = CRITERIA.find((c) => c.key === "scoreHarmful")!;
    expect(intro).toContain(`${harmful.label} (${harmful.max}; bewertet anhand der deklarierten Zutaten und Zusatzstoffe)`);
    expect(HOME_FAQ[1].a).toContain(`Ab ${RATING_THRESHOLDS.gut} Punkten`);
    expect(HOME_FAQ[1].a).toContain(`von ${RATING_THRESHOLDS.mittel} bis ${RATING_THRESHOLDS.gut - 1} Punkten`);
    expect(HOME_FAQ[1].a).toContain(`unter ${RATING_THRESHOLDS.mittel} Punkten`);
    expect(harmful.max * HARMFUL_FAIL_RATIO).toBe(10);
    expect(HOME_FAQ[1].a).toContain("weniger als die Hälfte");

    const declaration = CRITERIA.find((c) => c.key === "scoreDeclaration")!;
    expect(HOME_FAQ[4].a).toContain(`„${declaration.label}“`);
    const methodik = readFileSync(path.join(process.cwd(), "src/app/(site)/methodik/page.tsx"), "utf8");
    expect(methodik).toContain("Abzügen bei „Deklaration &amp; Transparenz“");
    expect(suggestedDeclarationDeduction([{ claim: "heilt", rating: "UNZULAESSIG", reason: "Heilaussage", legal: "Art. 13", imageUrl: "" }])).toBe(3);
  });
});

describe("JSON-LD", () => {
  const data = homeJsonLd("Hundefutter- & Katzenfutter-Test 2026 | Futterprüfer", [
    { title: "Josera Festival", slug: "josera-festival", category: { slug: "alleinfuttermittel-hund" } },
  ]);

  it("verknüpft Organization, WebSite, WebPage, ItemList und FAQPage über @id", () => {
    const graph = data["@graph"] as Record<string, unknown>[];
    const byType = Object.fromEntries(graph.map((node) => [node["@type"], node]));
    const base = `${SITE.url}/`;
    expect(byType.Organization["@id"]).toBe(`${base}#organization`);
    expect(byType.WebSite.publisher).toEqual({ "@id": `${base}#organization` });
    expect(byType.WebPage.isPartOf).toEqual({ "@id": `${base}#website` });
    expect(byType.WebPage.about).toEqual({ "@id": `${base}#organization` });
    expect(byType.WebPage.name).toBe("Hundefutter- & Katzenfutter-Test 2026 | Futterprüfer");
    expect(byType.Organization.description).toBe(HOME_DESCRIPTION);
    expect(JSON.stringify(graph)).not.toMatch(/"@type":\s*"Review"|"@type":\s*"AggregateRating"/);
  });

  it("FAQPage-Text ist 1:1 der sichtbare Antworttext", () => {
    const graph = data["@graph"] as { "@type": string; mainEntity?: { name: string; acceptedAnswer: { text: string } }[] }[];
    const faq = graph.find((node) => node["@type"] === "FAQPage")!;
    expect(faq.mainEntity?.map((item) => item.name)).toEqual(HOME_FAQ.map((item) => item.q));
    expect(faq.mainEntity?.map((item) => item.acceptedAnswer.text)).toEqual(HOME_FAQ.map((item) => item.a));
  });

  it("ItemList verlinkt die Tests ohne Note im Schema-Typ", () => {
    const graph = data["@graph"] as { "@type": string; numberOfItems?: number; itemListElement?: { url: string; name: string; position: number }[] }[];
    const list = graph.find((node) => node["@type"] === "ItemList")!;
    expect(list.numberOfItems).toBe(1);
    expect(list.itemListElement?.[0]).toMatchObject({
      position: 1,
      name: "Josera Festival",
      url: `${SITE.url}/alleinfuttermittel-hund/josera-festival`,
    });
  });

  it("lässt die ItemList weg, wenn keine Tests da sind", () => {
    const empty = homeJsonLd("Hundefutter Test & Katzenfutter Test | Futterprüfer", []);
    const graph = empty["@graph"] as { "@type": string }[];
    expect(graph.some((node) => node["@type"] === "ItemList")).toBe(false);
    expect(graph.some((node) => node["@type"] === "FAQPage")).toBe(true);
  });
});

describe("Fachblog-Links", () => {
  const published = [
    "/blog/futterdeklaration-richtig-lesen",
    "/blog/alleinfuttermittel-ergaenzungsfuttermittel",
    "/blog/getreidefreies-hundefutter-sinnvoll",
    "/blog/taurin-katze",
    "/blog/zucker-im-hundefutter-katzenfutter",
  ];

  it("verlinkt nur die fünf veröffentlichten Artikel und lässt den Wortlaut gleich", () => {
    expect(HOME_GUIDES.map((guide) => guide.href)).toEqual(published);
    const hrefs = [
      ...INTRO.flatMap((paragraph) => paragraph.map((part) => part.href)),
      ...HOME_FAQ.flatMap((item) => [...item.links.map(([, href]) => href), ...(item.anchors ?? []).map((anchor) => anchor.href)]),
      ...HOME_GUIDES.map((guide) => guide.href),
    ].filter(Boolean);
    for (const href of hrefs) {
      expect(href).not.toMatch(/^\/team/);
      if (String(href).startsWith("/blog/") && href !== "/blog") expect(published).toContain(href);
    }
    const deklaration = INTRO[1].find((part) => part.text === "offene Deklaration");
    const getreide = INTRO[1].find((part) => part.text === "getreidefrei");
    const taurin = INTRO[1].find((part) => part.text === "Taurin");
    expect(deklaration?.href).toBe("/blog/futterdeklaration-richtig-lesen");
    expect(getreide?.href).toBe("/blog/getreidefreies-hundefutter-sinnvoll");
    expect(taurin?.href).toBe("/lexikon/taurin");
    expect(introPlain()).toBe(INTRO_TEXT);
  });

  it("setzt FAQ-Anker nur um bestehende Wörter und behält den Antworttext", () => {
    const faq = HOME_FAQ[2];
    const parts = linkedAnswer(faq.a, faq.anchors);
    expect(parts.map((part) => part.text).join("")).toBe(faq.a);
    expect(parts.filter((part) => part.href).map((part) => part.text)).toEqual(["Alleinfuttermittel", "Ergänzungsfuttermittel"]);
    expect(new Set(parts.map((part) => part.href).filter(Boolean))).toEqual(new Set(["/blog/alleinfuttermittel-ergaenzungsfuttermittel"]));
    expect(linkedAnswer("ohne Anker").map((part) => part.text).join("")).toBe("ohne Anker");
  });
});

describe("bezahlte Einreichung", () => {
  it("bietet die Herstellerseite keine bezahlte Prüfung an", () => {
    const src = readFileSync(path.join(process.cwd(), "src/app/(site)/fuer-hersteller/page.tsx"), "utf8");
    expect(src).toContain("Eine Einreichung kauft keine Note");
    expect(src).not.toMatch(/kostenpflicht|Checkout|Stripe|PayPal|Kaufpreis/i);
  });
});
