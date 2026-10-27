import { absoluteUrl, OPERATOR, SITE } from "@/lib/site";
import { contentAuthor } from "@/lib/attribution";

/** Stand der Rechenbasis und der Seitentexte. */
export const STAND_ISO = "2026-10-26";
export const STAND_TEXT = "26.10.2026";

export type SeitenKey = "hub" | "hund" | "katze";

/** Metas nach Konzept 7.4. */
export const META: Record<SeitenKey, { path: string; title: string; description: string; h1: string; ogTitel: string }> = {
  hub: {
    path: "/futterrechner",
    title: "Futterrechner Hund & Katze: Futter prüfen | Futterprüfer",
    description: "Futterrechner für Hund und Katze: Analysewerte vom Etikett eintippen, Note nach FEDIAF und Tagesmenge sehen. Ohne Anmeldung, nichts gespeichert.",
    h1: "Futterrechner für Hund und Katze",
    ogTitel: "Futterrechner für Hund und Katze",
  },
  hund: {
    path: "/futterrechner/hund",
    title: "Futterrechner Hund: Hundefutter prüfen & Menge berechnen",
    description: "Hundefutter-Rechner: Rohprotein, Rohfett & Co. eintippen und Nährwert-Note, kcal und Futtermenge pro Tag sehen. Nach FEDIAF, für Welpen bis Senioren.",
    h1: "Futterrechner Hund: Hundefutter prüfen und Tagesmenge berechnen",
    ogTitel: "Futterrechner Hund",
  },
  katze: {
    path: "/futterrechner/katze",
    title: "Futterrechner Katze: Katzenfutter prüfen & Menge berechnen",
    description: "Katzenfutter-Rechner: Analysewerte eintippen, Nährwert-Note nach FEDIAF, kcal und Futtermenge pro Tag sehen. Für Kitten, Wohnungskatzen und Freigänger.",
    h1: "Futterrechner Katze: Katzenfutter prüfen und Tagesmenge berechnen",
    ogTitel: "Futterrechner Katze",
  },
};

export type Frage = { frage: string; antwort: string };

export const FAQ_HUND: Frage[] = [
  { frage: "Wie viel Futter braucht mein Hund am Tag?", antwort: "Das hängt von Gewicht, Alter, Aktivität und Kastration ab. Der Rechner nimmt den Energiebedarf nach FEDIAF (Faktor × Gewicht hoch 0,75) und teilt ihn durch die Energie Ihres Futters. Ein Hund mit 20 kg und normaler Aktivität kommt so auf rund 1.040 kcal am Tag. Das ist ein Startwert mit 10 % Spanne: Wiegen Sie Ihren Hund alle zwei bis vier Wochen und passen Sie die Menge an." },
  { frage: "Wie berechne ich die Kalorien im Hundefutter?", antwort: "Auf der Packung stehen meist nur die analytischen Bestandteile. Der Rechner schätzt daraus die umsetzbare Energie (ME) mit dem Vierschrittverfahren des NRC (2006): Bruttoenergie aus Protein, Fett und Kohlenhydraten, dann die Verdaulichkeit abziehen. Nennt der Hersteller die Energie, hat dieser Wert Vorrang." },
  { frage: "Wie viel Rohprotein sollte Hundefutter haben?", antwort: "FEDIAF nennt für erwachsene Hunde mindestens 45 g Rohprotein je 1000 kcal, bei geringem Energiebedarf 52,1 g, für Welpen 50 bis 62,5 g. Wichtig ist der Bezug auf die Energie, nicht der Prozentwert auf der Packung. Mehr Protein ist nicht automatisch besser." },
  { frage: "Wie mache ich Nass- und Trockenfutter vergleichbar?", antwort: "Rechnen Sie auf die Trockenmasse um: Wert ÷ (100 − Feuchte) × 100. Noch fairer ist der Vergleich je 1000 kcal. Genau das macht der Rechner automatisch." },
  { frage: "Was ist ein gutes Calcium-Phosphor-Verhältnis?", antwort: "Für erwachsene Hunde nennt FEDIAF 1 : 1 bis 2 : 1, für Welpen 1 : 1 bis 1,6 : 1 beziehungsweise 1,8 : 1. Das Verhältnis ist nur prüfbar, wenn Calcium und Phosphor auf dem Etikett stehen. Viele Hersteller nennen die Werte auf Nachfrage." },
  { frage: "Warum bekommt Ergänzungsfutter keine Note?", antwort: "Ergänzungsfutter deckt allein nicht den ganzen Bedarf. Eine Note nach Alleinfutter-Maßstäben wäre deshalb nicht aussagekräftig. Für Snacks zeigt der Rechner stattdessen die Energie und ein Leckerli-Budget von höchstens 10 % des Tagesbedarfs." },
  { frage: "Ist „sehr gut“ im Rechner dasselbe wie ein gutes Testergebnis?", antwort: "Nein. Der Rechner bewertet nur die Nährwerte, die Sie eingeben. Zutaten, Rohstoffqualität, Zusatzstoffe und Deklaration kann er nicht prüfen. Das tun unsere Tests nach der 100-Punkte-Methodik." },
  { frage: "Werden meine Eingaben gespeichert?", antwort: "Nein. Alles wird in Ihrem Browser berechnet. Es gibt keinen Server-Aufruf mit Ihren Werten, keine Datenbank und keine Cookies für den Rechner. Beim Teilen stehen die Werte im Teil der Adresse nach dem #, der nicht an unseren Server übertragen wird." },
];

export const FAQ_KATZE: Frage[] = [
  { frage: "Wie viel Futter braucht eine Katze am Tag?", antwort: "Eine kastrierte Wohnungskatze mit 4,5 kg braucht nach FEDIAF rund 206 kcal am Tag (Faktor 75 × Gewicht hoch 0,67). Je nach Energie des Futters sind das etwa 215 g Nassfutter. Das ist ein Startwert: Wiegen Sie Ihre Katze alle zwei bis vier Wochen und passen Sie die Menge an." },
  { frage: "Wie viele Kalorien braucht eine kastrierte Katze?", antwort: "FEDIAF nennt für kastrierte Katzen und Wohnungskatzen den Faktor 75 (Spanne 52 bis 75), für unkastrierte Freigänger 100. Der Rechner nimmt 75 und zeigt eine Spanne von ±10 %." },
  { frage: "Wie viel Rohprotein sollte Katzenfutter haben?", antwort: "FEDIAF nennt mindestens 62,5 g je 1000 kcal für unkastrierte Freigänger, 83,3 g für kastrierte Katzen und Wohnungskatzen und 70 g für Kitten. Wer weniger frisst, braucht mehr Eiweiß pro Kalorie." },
  { frage: "Wie viel Taurin braucht eine Katze?", antwort: "Für Nassfutter nennt FEDIAF 0,20 bis 0,27 % der Trockenmasse, für Trockenfutter 0,10 bis 0,13 %. Auf der Packung steht meist nur die zugesetzte Menge unter „Zusatzstoffe je kg“, nicht der Gesamtgehalt. Der Rechner prüft Taurin nur, wenn Sie den Wert eingeben." },
  { frage: "Wie viel frisst ein Kitten?", antwort: "Ein Kitten braucht je kg Körpergewicht deutlich mehr Energie als eine erwachsene Katze: bis 4 Monate das 2,0- bis 2,5-Fache von 100 × Gewicht hoch 0,67, danach weniger. Ein Kitten mit 2,5 kg und 5 Monaten kommt auf rund 346 kcal am Tag." },
  { frage: "Warum Nassfutter auf die Trockenmasse umrechnen?", antwort: "Nassfutter enthält 75 bis 85 % Wasser. Auf der Packung wirken die Werte darum niedrig. In der Trockenmasse, und noch besser je 1000 kcal, lassen sich Nass- und Trockenfutter fair vergleichen." },
  { frage: "Was sagt die Note und was nicht?", antwort: "Die Note bewertet nur die eingegebenen Nährwerte gegen die FEDIAF-Mindestwerte. Sie sagt nichts über Rohstoffe, Zusatzstoffe, Schadstoffe oder Deklaration. Gute Werte machen noch kein gutes Futter." },
  { frage: "Werden meine Eingaben gespeichert?", antwort: "Nein. Alles wird in Ihrem Browser berechnet. Es gibt keinen Server-Aufruf mit Ihren Werten, keine Datenbank und keine Cookies für den Rechner." },
];

export const FAQ_HUB: Frage[] = [
  { frage: "Was macht der Futterrechner?", antwort: "Er rechnet die analytischen Bestandteile vom Etikett auf Trockenmasse und Energie um, vergleicht Protein, Fett sowie Calcium und Phosphor je 1000 kcal mit den FEDIAF-Mindestwerten und nennt eine Nährwert-Note und die Tagesmenge als Startwert." },
  { frage: "Ist die Note ein Testurteil?", antwort: "Nein. Sie bewertet nur Nährwerte. Zutaten, Rohstoffqualität und Zusatzstoffe prüfen unsere Tests nach der 100-Punkte-Methodik." },
  { frage: "Werden meine Eingaben gespeichert?", antwort: "Nein. Alles wird in Ihrem Browser berechnet, nichts gespeichert und nichts an uns übertragen." },
];

const faqSchema = (list: Frage[]) => ({
  "@type": "FAQPage",
  mainEntity: list.map((f) => ({ "@type": "Question", name: f.frage, acceptedAnswer: { "@type": "Answer", text: f.antwort } })),
});

/** WebApplication + FAQPage. Keine Bewertungen (kein aggregateRating, kein review). BreadcrumbList kommt aus <Breadcrumbs>. */
export function futterrechnerJsonLd(key: SeitenKey, faq: Frage[]) {
  const m = META[key];
  const url = absoluteUrl(m.path);
  const name = key === "hub" ? "Futterrechner für Hund und Katze" : key === "hund" ? "Futterrechner Hund" : "Futterrechner Katze";
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name,
      url,
      description: m.description,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      inLanguage: "de",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: 0, priceCurrency: "EUR" },
      author: contentAuthor(),
      publisher: { "@type": "Organization", name: OPERATOR.name, url: SITE.url },
      dateModified: STAND_ISO,
    },
    { "@context": "https://schema.org", ...faqSchema(faq) },
  ];
}

export const QUELLEN: Array<{ text: string; href: string }> = [
  { text: "FEDIAF Nutritional Guidelines for Complete and Complementary Pet Food for Cats and Dogs, September 2025", href: "https://europeanpetfood.org/wp-content/uploads/2025/09/FEDIAF-Nutritional-Guidelines_2025-ONLINE.pdf" },
  { text: "National Research Council (2006): Nutrient Requirements of Dogs and Cats, National Academies Press", href: "https://nap.nationalacademies.org/catalog/10668/nutrient-requirements-of-dogs-and-cats" },
  { text: "Verordnung (EG) Nr. 767/2009 über das Inverkehrbringen und die Verwendung von Futtermitteln", href: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32009R0767" },
  { text: "AAHA (2021): Nutrition and Weight Management Guidelines for Dogs and Cats", href: "https://www.aaha.org/wp-content/uploads/2021/06/new-2021-aaha-nutrition-and-weight-management-guidelines-with-ref.pdf" },
  { text: "Kazimierska K., Biel W., Witkowicz R. (2020): Mineral Composition of Cereal and Cereal-Free Dry Dog Foods versus Nutritional Guidelines. Molecules 25: 5173", href: "https://doi.org/10.3390/molecules25215173" },
];
