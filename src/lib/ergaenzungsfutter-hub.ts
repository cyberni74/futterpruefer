import { faqPageJsonLd } from "@/lib/faq-schema";
import { HUB_PURPOSE_ORDER, type ComparisonTableRow, type HubPurposeId } from "@/lib/comparison-table";
import { SITE } from "@/lib/site";

/** Sichtbares Stand-Datum der Hub-Texte (Kalendertag, nicht umgerechnet). */
export const EF_HUB_UPDATED_ISO = "2026-11-20";
export const EF_HUB_UPDATED_LABEL = "20. November 2026";

export const EF_HUB_TITLE = "Ergänzungsfutter Hund Test 2026";
export const EF_HUB_H1 = "Ergänzungsfutter für Hunde im Test: nachgerechnet, nicht nach Werbespruch";
/** 155 Zeichen, Query plus Jahr, ohne Pseudo-Testsieger. */
export const EF_HUB_DESCRIPTION =
  "Ergänzungsfutter Hund Test 2026: Gelenk, Lachsöl, Kotfresser, Verdauung und Zähne nach Punkten, Dosis und Ampel – ohne Gesamt-Testsieger. Stand 20.11.2026.";

export const EF_HUB_AUTHOR = "Redaktion Futterprüfer";

export type HubPurposeCopy = {
  id: HubPurposeId;
  title: string;
  anchor: string;
  intro: string;
  links: { href: string; label: string }[];
};

export const EF_HUB_PURPOSES: HubPurposeCopy[] = [
  {
    id: "gelenke",
    title: "Gelenke",
    anchor: "gelenke",
    intro:
      "Hier stehen Ergänzungsfuttermittel, die mit Gelenken, Hüfte oder typischen Gelenkstoffen wie Grünlippmuschel werben. Ein Gesamtsieger über alle Zwecke ist das nicht. In einem eigenen Vergleich haben wir vier Gelenkmittel gegeneinander gestellt.",
    links: [
      { href: "/blog/gelenktabletten-hund-vergleich", label: "Gelenktabletten und Gelenkpulver im Vergleich" },
      { href: "/methodik/ergaenzungsfutter", label: "Methodik Ergänzungsfutter" },
    ],
  },
  {
    id: "haut_fell_oel",
    title: "Haut, Fell und Lachsöl",
    anchor: "haut-fell-lachsoel",
    intro:
      "Öle und Pasten, die Haut, Fell oder Omega-3 in den Vordergrund stellen. Ob genug EPA und DHA in der Tagesmenge steckt, steht im jeweiligen Test – nicht auf dem Etikett-Slogan. Unser Lachsöl-Vergleich rechnet fünf Öle nach.",
    links: [
      { href: "/blog/lachsoel-hund-vergleich", label: "Lachsöl für Hunde im Vergleich" },
      { href: "/lexikon/lachsoel", label: "Lexikon: Lachsöl" },
      { href: "/blog/lachsoel-hunde", label: "Ratgeber Lachsöl für Hunde" },
    ],
  },
  {
    id: "kotfressen",
    title: "Kotfressen und Grasfressen",
    anchor: "kotfressen",
    intro:
      "Drops und Snacks, die gegen Kot- oder Grasfressen angeboten werden. Dass ein Kraut auf der Zutatenliste steht, belegt noch keine Wirkung. Den direkten Vergleich der drei von uns geprüften Produkte gibt es im Kotfresser-Drops-Test.",
    links: [{ href: "/blog/kotfresser-drops-test", label: "Kotfresser-Drops im Vergleich" }],
  },
  {
    id: "verdauung",
    title: "Verdauung",
    anchor: "verdauung",
    intro:
      "Pasten, Pulver und Snacks, die mit Magen, Darm oder probiotischen Kulturen werben. Ergänzungsfuttermittel ersetzen keine tierärztliche Abklärung bei Durchfall oder Erbrechen. Wir prüfen Stamm, Menge und Träger – nicht das Bauchgefühl der Werbung.",
    links: [{ href: "/methodik/ergaenzungsfutter", label: "Worauf die Methodik bei Wirkstoffen achtet" }],
  },
  {
    id: "zaehne",
    title: "Zähne",
    anchor: "zaehne",
    intro:
      "Kausnacks, Pulver und Sprays, die Zahnstein oder Mundgeruch versprechen. Ein VOHC-Siegel ist ein prüfbarer Anhalt, eine Werbezeile nicht. Die einzelnen Tests zeigen, was belegt ist und was nur behauptet wird.",
    links: [],
  },
  {
    id: "nerven",
    title: "Unruhe und Nerven",
    anchor: "nerven",
    intro:
      "Tropfen, Snacks und Pulver, die mit Entspannung oder Nerven werben. Das ist keine Diagnose und kein Ersatz für den Tierarzt. In den Tests prüfen wir, welche Stoffe in welcher Menge deklariert sind – und welche Aussagen die Packung darüber hinaus macht.",
    links: [],
  },
  {
    id: "snacks_kauartikel",
    title: "Snacks und Kauartikel",
    anchor: "snacks-kauartikel",
    intro:
      "Leckerli, Ohren, Smoothies und ähnliche Ergänzungsfuttermittel ohne benannten Funktions-Wirkstoff. Sie ergänzen eine Ration, sie ersetzen sie nicht. Bewertet werden sie nach den Kriterien für solche Futter, nicht nach einem erfundenen Heilszweck.",
    links: [{ href: "/blog/alleinfuttermittel-ergaenzungsfuttermittel", label: "Alleinfuttermittel und Ergänzungsfuttermittel" }],
  },
  {
    id: "weitere",
    title: "Weitere getestete Ergänzungsfuttermittel",
    anchor: "weitere",
    intro:
      "Hier liegen Tests, die zu keinem der oben genannten Zwecke passen – etwa Mittel für Senioren, Analdrüsen oder die Atemwege. Sie werden nicht zu einem gemeinsamen Siegerfeld zusammengezogen.",
    links: [],
  },
];

export const EF_HUB_TOC = [
  { href: "#ueberblick", label: "Der Überblick" },
  ...EF_HUB_PURPOSES.map((p) => ({ href: `#${p.anchor}`, label: p.title })),
  { href: "#kaufberatung", label: "Kaufberatung" },
  { href: "#haeufige-fragen", label: "Häufige Fragen" },
  { href: "#testergebnisse", label: "Alle Tests" },
];

export const EF_HUB_FAQ: { question: string; answer: string }[] = [
  {
    question: "Was ist das beste Ergänzungsfutter für Hunde?",
    answer:
      "Das eine beste Ergänzungsfutter gibt es nicht. Es kommt auf den Zweck an, und ergänzt werden darf nur, was zur übrigen Ration passt. In unseren Tests gilt als empfehlenswert nur die Ampel Grün; Gelb heißt mit Abstrichen, Rot ist keine Empfehlung. Einen Gesamtsieger über Gelenk, Zähne, Öl und Snacks hinweg küren wir nicht.",
  },
  {
    question: "Braucht mein Hund Ergänzungsfutter?",
    answer:
      "Ein gesunder Hund, der ein passendes Alleinfuttermittel bekommt, braucht in der Regel kein zusätzliches Ergänzungsfuttermittel. Sinnvoll kann eine Ergänzung sein, wenn die Ration einen Stoff nicht liefert – etwa bei selbst zusammengestellter Fütterung – oder wenn ein Test eine nachvollziehbare Dosis zeigt. Bei Krankheit entscheidet die Tierärztin oder der Tierarzt, nicht die Packung.",
  },
  {
    question: "Was ist der Unterschied zwischen Alleinfuttermittel und Ergänzungsfuttermittel?",
    answer:
      "Nach der Verordnung (EG) Nr. 767/2009 ist ein Alleinfuttermittel dazu bestimmt, den täglichen Bedarf allein zu decken. Ein Ergänzungsfuttermittel deckt ihn allein nicht; es gehört zu einer Ration dazu. Viele Snacks und Funktionsprodukte sind rechtlich Ergänzungsfuttermittel, auch wenn die Werbung das klein schreibt.",
  },
  {
    question: "Wie testet ihr Ergänzungsfutter für Hunde?",
    answer:
      "Funktionelle Ergänzungsfuttermittel bewerten wir nach Wirkstoff und Dosis je Kilogramm Körpergewicht, nach Werbeaussagen, Trägerqualität und Transparenz. Snacks ohne benannten Wirkstoff bewerten wir nach den sechs Kriterien der allgemeinen Futter-Methodik. Die Ampel und die Note folgen unserem veröffentlichten Schlüssel. Die genaue Aufteilung steht auf der Methodik-Seite für Ergänzungsfutter.",
  },
  {
    question: "Helfen Gelenktabletten dem Hund?",
    answer:
      "Wir prüfen, ob die deklarierte Tagesmenge in die Nähe von Dosen aus Studien kommt – und ob die Werbung mehr verspricht, als ein Ergänzungsfuttermittel darf. Eine Heilung von Gelenkerkrankungen behaupten wir nicht, und Krankheiten behandelt der Tierarzt. Im Gelenk-Vergleich lag das beste Ergebnis bei 59 von 100 Punkten (Gelb).",
  },
  {
    question: "Ist Lachsöl als Ergänzungsfutter sinnvoll?",
    answer:
      "Lachsöl kann EPA und DHA liefern. Ob die Tagesmenge das hergibt, steht im Test, nicht im Wort „Premium“. In unserem Lachsöl-Vergleich lag das beste Ergebnis bei 52 von 100 Punkten (Gelb); vier weitere Öle waren Rot. Den Hintergrund erklärt der Ratgeber und der Lexikon-Eintrag zu Lachsöl.",
  },
  {
    question: "Helfen Kotfresser-Drops gegen Kotfressen?",
    answer:
      "Einen Beleg dafür, dass die von uns geprüften Drops Kotfressen abstellen, haben wir nicht gefunden. Wir bewerten Deklaration, Mengen und Werbung. Im Vergleich der drei Produkte lag ein Test vorn, weil die Rezeptur offenliegt – nicht weil eine Wirkung gegen Kotfressen nachgewiesen wäre.",
  },
  {
    question: "Woran erkenne ich ein seriöses Ergänzungsfuttermittel?",
    answer:
      "An prüfbaren Mengen, einer Tagesdosis je Kilogramm Körpergewicht und an Aussagen, die ein Ergänzungsfuttermittel darf. Fehlt die Wirkstoffmenge, bleibt die Dosis ein Ratewettbewerb. Heilversprechen und Diagnosen auf der Packung sind nach unserer Einschätzung ein Warnsignal, kein Qualitätsmerkmal.",
  },
];

export const EF_HUB_RELATED_LINKS: { href: string; label: string }[] = [
  { href: "/methodik/ergaenzungsfutter", label: "Methodik: So bewerten wir Ergänzungsfutter" },
  { href: "/methodik", label: "Allgemeine Methodik und Notenschlüssel" },
  { href: "/blog/ergaenzungsfutter-bewerten-hund-katze", label: "Ergänzungsfutter bewerten: Dosis, Studien, Träger" },
  { href: "/blog/hunde-nahrungsergaenzung", label: "Nahrungsergänzung für Hunde: was nötig ist" },
  { href: "/blog/alleinfuttermittel-ergaenzungsfuttermittel", label: "Alleinfuttermittel und Ergänzungsfuttermittel" },
  { href: "/blog/gelenktabletten-hund-vergleich", label: "Gelenktabletten-Vergleich" },
  { href: "/blog/lachsoel-hund-vergleich", label: "Lachsöl-Vergleich" },
  { href: "/blog/kotfresser-drops-test", label: "Kotfresser-Drops im Vergleich" },
  { href: "/lexikon/lachsoel", label: "Lexikon: Lachsöl" },
  { href: "/lexikon/bierhefe", label: "Lexikon: Bierhefe" },
  { href: "/tests", label: "Alle Tests" },
];

export function assertHubMeta() {
  return { title: EF_HUB_TITLE, description: EF_HUB_DESCRIPTION, descriptionLength: EF_HUB_DESCRIPTION.length };
}

export function hubItemListJsonLd(rows: { name: string; href: string }[]) {
  if (!rows.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ergänzungsfutter für Hunde im Test",
    itemListElement: rows.map((row, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: row.name,
      url: row.href.startsWith("http") ? row.href : `${SITE.url}${row.href}`,
    })),
  };
}

export function hubFaqJsonLd() {
  return faqPageJsonLd(EF_HUB_FAQ);
}

export function purposesWithRows(groups: Partial<Record<HubPurposeId, ComparisonTableRow[]>>): Array<HubPurposeCopy & { rows: ComparisonTableRow[] }> {
  return HUB_PURPOSE_ORDER.flatMap((id) => {
    const rows = groups[id] ?? [];
    const copy = EF_HUB_PURPOSES.find((p) => p.id === id);
    if (!copy || !rows.length) return [];
    return [{ ...copy, rows }];
  });
}
