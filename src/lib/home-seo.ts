import { absoluteUrl, SITE } from "@/lib/site";
import { reviewPath } from "@/lib/urls";

/**
 * Startseiten-Texte. „Unabhängig“ nicht verwenden (Entscheidung offen) – Formulierungen liegen hier.
 * „Keine gekauften Noten“ / „kein Einfluss“ bleiben, solange /fuer-hersteller keine bezahlte Prüfung anbietet.
 */

export const HOME_DESCRIPTION =
  "Hundefutter und Katzenfutter im Test: Rohstoffe, bedenkliche Zusatzstoffe, Nährstoffe und Deklaration nach 100-Punkte-Schema bewertet – transparent erklärt.";

export const OG_TITLE = `Hundefutter & Katzenfutter im Test – ${SITE.name}`;
export const OG_DESCRIPTION =
  "Trocken- und Nassfutter für Hund und Katze, bewertet nach sechs offengelegten Kriterien und 100 Punkten. Mit Werbeaussagen-Check und Futter-Lexikon.";

export const HOME_H1 = "Hundefutter und Katzenfutter im Test – transparent nach 100 Punkten bewertet";
export const FALLBACK_HERO = "Hunde- und Katzenfutter im Test";
export const METHODIK_NOTE =
  "Bewertet auf Basis der veröffentlichten Herstellerangaben, ohne eigene Laboranalyse. Keine gekauften Noten.";

const TITLE_WITHOUT_YEAR = `Hundefutter Test & Katzenfutter Test | ${SITE.name}`;

const BERLIN = "Europe/Berlin";

export function calendarYear(date: Date, timeZone = BERLIN): number {
  return Number(new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric" }).format(date));
}

/**
 * Jahr im Title nur, wenn ein veröffentlichter Test in diesem Kalenderjahr (Europe/Berlin) aktualisiert wurde.
 * Das Jahr stammt vom neuesten `updatedAt`, nicht von der Serveruhr allein.
 */
export function homeTitle(latestUpdate: Date | null, now = new Date()): string {
  if (!latestUpdate || Number.isNaN(latestUpdate.getTime())) return TITLE_WITHOUT_YEAR;
  const testYear = calendarYear(latestUpdate);
  if (testYear !== calendarYear(now)) return TITLE_WITHOUT_YEAR;
  return `Hundefutter- & Katzenfutter-Test ${testYear} | ${SITE.name}`;
}

export type TextPart = { text: string; href?: string; strong?: boolean };

export const INTRO: readonly (readonly TextPart[])[] = [
  [
    { text: "Welches Hundefutter und welches Katzenfutter ist wirklich gut? Futterprüfer bewertet " },
    { text: "Trockenfutter, Nassfutter", href: "/tests" },
    { text: " und Snacks für Hunde und Katzen nach einem festen " },
    { text: "100-Punkte-Schema", href: "/methodik" },
    {
      text: ". Grundlage jedes Tests sind die veröffentlichten Herstellerangaben: Zusammensetzung, analytische Bestandteile, Zusatzstoffe, Fütterungsempfehlung und Preis. Eigene Laboranalysen gehören nicht zum Test, dafür legen wir jeden Bewertungsschritt offen.",
    },
  ],
  [
    { text: "Sechs Kriterien mit fester Gewichtung bestimmen die Gesamtnote: " },
    {
      text: "Rohstoffqualität (30 Punkte), Schadstoffe & Bedenkliches (20; bewertet anhand der deklarierten Zutaten und Zusatzstoffe), Nährstoffprofil (20), Deklaration & Transparenz (15), Bedarfsdeckung (10) und Preis-Leistung (5)",
      strong: true,
    },
    { text: ". Zusätzlich prüfen wir die " },
    { text: "Werbeaussagen auf der Verpackung", href: "/methodik" },
    { text: " nach dem Futtermittelrecht. So sehen Sie auf einen Blick, ob ein " },
    { text: "Alleinfuttermittel", href: "/alleinfuttermittel-hund" },
    {
      text: " laut Deklaration die üblichen Nährstoffempfehlungen für Hund oder Katze erfüllt, welche Inhaltsstoffe wir kritisch sehen und wo das Marketing mehr verspricht, als die Deklaration hergibt. ",
    },
    { text: "Hersteller können Produkte einreichen", href: "/fuer-hersteller" },
    { text: ", auf die Note hat das keinen Einfluss. Begriffe wie offene Deklaration, " },
    { text: "Taurin", href: "/lexikon/taurin" },
    { text: " oder getreidefrei erklären unser " },
    { text: "Fachblog", href: "/blog" },
    { text: " und das " },
    { text: "Futter-Lexikon", href: "/lexikon" },
    { text: "." },
  ],
];

export function introPlain(parts: readonly (readonly TextPart[])[] = INTRO): string {
  return parts.map((paragraph) => paragraph.map((part) => part.text).join("")).join("\n\n");
}

export type HomeFaq = { q: string; a: string; links: readonly (readonly [label: string, href: string])[] };

export const HOME_FAQ: readonly HomeFaq[] = [
  {
    q: "Wie testet Futterprüfer Hunde- und Katzenfutter?",
    a: "Wir werten die veröffentlichten Herstellerangaben aus: Zusammensetzung, analytische Bestandteile, Zusatzstoffe, Fütterungsempfehlung und Preis. Jedes Produkt wird nach denselben sechs Kriterien mit maximal 100 Punkten bewertet. Eigene Laboranalysen führen wir nicht durch.",
    links: [["Zur Methodik", "/methodik"]],
  },
  {
    q: "Was bedeuten die Punkte und Farben?",
    a: "Ab 80 Punkten ist ein Futter grün und empfehlenswert, von 60 bis 79 Punkten gelb (mit Abstrichen), unter 60 Punkten rot (nicht empfehlenswert). Erreicht ein Produkt bei „Schadstoffe & Bedenkliches“ weniger als die Hälfte der Punkte, erscheint zusätzlich ein rotes Warnsignal.",
    links: [["Ampel und Warnsignal erklärt", "/methodik"]],
  },
  {
    q: "Was ist der Unterschied zwischen Alleinfuttermittel und Ergänzungsfuttermittel?",
    a: "Ein Alleinfuttermittel ist laut EU-Futtermittelrecht so zusammengesetzt, dass es für die tägliche Ration ausreicht. Ein Ergänzungsfuttermittel wie Snacks, Kauartikel oder Pasten reicht nur zusammen mit anderen Futtermitteln für die tägliche Ration. Wir bewerten beide Gruppen getrennt.",
    links: [
      ["Alleinfuttermittel Hund", "/alleinfuttermittel-hund"],
      ["Alleinfuttermittel Katze", "/alleinfuttermittel-katze"],
      ["Ergänzungsfuttermittel Hund", "/ergaenzungsfuttermittel-hund"],
      ["Ergänzungsfuttermittel Katze", "/ergaenzungsfuttermittel-katze"],
    ],
  },
  {
    q: "Werden Trockenfutter und Nassfutter getestet?",
    a: "Ja. Wir bewerten Trockenfutter, Nassfutter und Ergänzungsfutter für Hunde und Katzen nach demselben 100-Punkte-Schema. Vergleichbar sind die Ergebnisse jeweils innerhalb einer Kategorie, zum Beispiel Alleinfutter für Hunde untereinander.",
    links: [["Alle Futtertests", "/tests"]],
  },
  {
    q: "Werden Werbeaussagen auf der Verpackung geprüft?",
    a: "Ja. Wir prüfen Werbeaussagen auf der Verpackung und im Onlineshop nach dem Futtermittelrecht, vor allem nach Artikel 11 und 13 der Verordnung (EG) Nr. 767/2009. Danach darf Werbung nicht irreführen, und ein Futtermittel darf nicht damit beworben werden, dass es Krankheiten verhindert, behandelt oder heilt. Aussagen, die nach unserer Einschätzung nicht zulässig oder nicht ausreichend belegt sind, führen zu Abzügen bei „Deklaration & Transparenz“ und werden im Test einzeln erläutert.",
    links: [["So prüfen wir Werbeaussagen", "/methodik"]],
  },
];

type ListedReview = { title: string; slug: string; category: { slug: string } };

export function homeJsonLd(title: string, reviews: ListedReview[]): Record<string, unknown> {
  const base = absoluteUrl("/");
  const organizationId = `${base}#organization`;
  const websiteId = `${base}#website`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: SITE.name,
      alternateName: "Futterprüfer.de",
      url: base,
      logo: { "@type": "ImageObject", url: absoluteUrl("/brand/logo-round-512.png"), width: 512, height: 512 },
      description: HOME_DESCRIPTION,
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: SITE.name,
      alternateName: "Futterprüfer.de",
      url: base,
      inLanguage: "de-DE",
      publisher: { "@id": organizationId },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${absoluteUrl("/suche")}?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": `${base}#webpage`,
      url: base,
      name: title,
      inLanguage: "de-DE",
      isPartOf: { "@id": websiteId },
      about: { "@id": organizationId },
      primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl("/opengraph-image.png"), width: 1200, height: 630 },
    },
  ];
  if (reviews.length > 0) {
    graph.push({
      "@type": "ItemList",
      "@id": `${base}#neueste-tests`,
      name: "Neueste Futtertests für Hund und Katze",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: reviews.length,
      itemListElement: reviews.map((review, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(reviewPath(review)),
        name: review.title,
      })),
    });
  }
  graph.push({
    "@type": "FAQPage",
    "@id": `${base}#faq`,
    mainEntity: HOME_FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  });
  return { "@context": "https://schema.org", "@graph": graph };
}
