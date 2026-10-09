/** Test „Medidog Ulmenrinden Paste“ (Okt. 2026). Der Seed legt ihn nur an, wenn der Slug fehlt; Änderungen im Admin bleiben erhalten. */
const SRC = "Etikett (Herstellerfoto) und Produktseite bei Shop Apotheke, Verkauf durch Heimtierland24, abgerufen am 09.10.2026";

export const MEDIDOG_TEST = {
  slug: "medidog-ulmenrinden-paste",
  categorySlug: "ergaenzungsfuttermittel-hund",
  title: "Medidog Ulmenrinden Paste im Test: 82/100 Punkte",
  brand: "Medidog",
  productName: "Ulmenrinden Paste",
  keyword: "Ulmenrinde Paste Hund",
  priceClass: "PREMIUM" as const,
  pricePerKg: 49.9,
  packageSize: "500 g Paste",
  price: 24.95,
  pricePerDay: 0.6,
  image: "medidog-ulmenrinden-paste-hund-dose.webp",
  imageAlt: "Dose Medidog Ulmenrinden Paste Magen & Darm mit Etikett (Herstellerfoto)",
  contentImage: "medidog-ulmenrinden-paste-hund-paste-in-schale.webp",
  contentImageAlt: "Dunkle Ulmenrinden Paste in einer weißen Schale (Herstellerfoto)",
  gallery: ["medidog-ulmenrinden-paste-hund-etikett-pflichtangaben.webp", "medidog-ulmenrinden-paste-hund-fuetterungsempfehlung.webp"],
  composition: "Pflanzliche Nebenerzeugnisse, amerikanische Rotulmenrinde*, Hefehydrolysat*, Sonnenblumenöl; *getrocknet",
  analysis: [
    { name: "Rohprotein", value: 3 },
    { name: "Rohfett", value: 1 },
    { name: "Rohfaser", value: 10 },
    { name: "Rohasche", value: 7 },
  ],
  scores: { scoreRaw: 25, scoreHarmful: 19, scoreNutrients: 15, scoreDeclaration: 11, scoreNeeds: 9, scoreValue: 3 },
  verdict:
    "Eine schlicht deklarierte, vegane Funktionspaste: Etikett vollständig, Rezeptur kurz, Zusatzstoff mit Menge, Etikettaussage zurückhaltend. Abzüge: unbenannte pflanzliche Nebenerzeugnisse ohne Prozentangabe, Shop-Werbung mit Kotfressen und Durchfall, keine Feuchte und Energie, Preis. Mit 82 Punkten Grün, also empfehlenswert.",
  teaser: "Kurze vegane Rezeptur, komplettes Etikett – aber was sind „pflanzliche Nebenerzeugnisse“? 82 Punkte.",
  pros: [
    "Vollständiges Etikett: Futtermittelart „Ergänzungsfuttermittel für Hunde“, Zusammensetzung, Analyse, Zusatzstoff mit Menge, Fütterung, Lagerung und Haltbarkeit nach Anbruch (mind. 8 Monate)",
    "Kurze, vegane Rezeptur ohne Zucker, Farbstoffe oder Konservierungsstoffe; einziger Zusatzstoff ist das Bindemittel Klinoptilolith (50.000 mg je kg)",
    "Zurückhaltende Etikettaussage („Unterstützung einer normalen Verdauungsfunktion“) und klare Dosierung nach Körpergewicht bis 60 kg",
  ],
  cons: [
    "Erste Zutat „pflanzliche Nebenerzeugnisse“ ohne Angabe der Pflanzen und ohne Prozentangaben; der Anteil der Rotulmenrinde bleibt unbekannt",
    "Shop-Texte werben mit „Kotfressen vorbeugen“, „Darmsanierung“ und „Durchfall“; der Shop-Feed führt die Paste als „Alleinfutter“, das Etikett als Ergänzungsfuttermittel",
    "Keine Angabe zu Feuchtigkeit und Energie; 49,90 € je Kilogramm, rund 0,60 € am Tag für einen 20-kg-Hund",
  ],
  claims: [
    { claim: "Die MEDIDOG Ulmenrinden Paste dient zur Unterstützung einer normalen Verdauungsfunktion.", rating: "ZULAESSIG", legal: "VO (EG) 767/2009 Art. 11 Abs. 1, Art. 13 Abs. 1", reason: "Die Aussage steht auf dem Etikett, beschreibt eine normale Körperfunktion und nennt keine Krankheit. Sie ist zurückhaltend formuliert („dient zur Unterstützung“). Einen Beleg nennt der Hersteller nicht; die schleimbildende Wirkung von Ulmenrinde ist aber allgemein bekannt." , imageUrl: "" },
    { claim: "Paste leicht anwendbar, sofort verzehrfertig", rating: "ZULAESSIG", legal: "VO (EG) 767/2009 Art. 11 Abs. 1", reason: "Praktische Eigenschaft der Darreichungsform. Die Paste kann laut Etikett pur oder unter das Futter gemischt gegeben werden; die Angabe stimmt mit der Fütterungsempfehlung überein.", imageUrl: "" },
    { claim: "Vegan", rating: "ZULAESSIG", legal: "VO (EG) 767/2009 Art. 11 Abs. 1", reason: "Alle deklarierten Zutaten sind pflanzlich oder Hefe: pflanzliche Nebenerzeugnisse, Rotulmenrinde, Hefehydrolysat, Sonnenblumenöl. Der Zusatzstoff Klinoptilolith ist mineralisch.", imageUrl: "" },
    { claim: "Harmonisierend", rating: "FRAGWUERDIG", legal: "VO (EG) 767/2009 Art. 11 Abs. 1, Art. 13 Abs. 1; UWG § 5", reason: "Was „harmonisieren“ soll, wird nicht erklärt. Der Begriff ist unscharf und lässt sich als Wirkversprechen für Magen und Darm verstehen, für das kein Beleg genannt wird.", imageUrl: "" },
    { claim: "Die Ulmenrinden Paste trägt dazu bei, die Darmfunktion gesund zu erhalten und hilft, dem unerwünschten Kotfressen vorzubeugen. (Shop-Text)", rating: "FRAGWUERDIG", legal: "VO (EG) 767/2009 Art. 13 Abs. 1, 3; UWG § 5", reason: "Dieser Text steht auf der Produktseite des Händlers, nicht auf dem Etikett. „Hilft vorzubeugen“ verspricht eine Wirkung auf ein Verhalten, ohne Beleg. Wir halten die Aussage für fragwürdig, nicht für eine Krankheitsaussage.", imageUrl: "" },
    { claim: "Ulmenrinde enthält natürliche Schleim- und Bitterstoffe, die appetitanregend wirken und eine positive Wirkung auf die Verdauung haben können. (Shop-Text)", rating: "FRAGWUERDIG", legal: "VO (EG) 767/2009 Art. 13 Abs. 1; UWG § 5", reason: "Das „können“ ist zurückhaltend, aber „appetitanregend“ und „positive Wirkung auf die Verdauung“ sind Wirkaussagen ohne genannte Quelle.", imageUrl: "" },
    { claim: "Schlagworte der Produktseite: „Darmsanierung, Darmaufbau, Durchfall, Hund Durchfall“ (Shop-Text)", rating: "FRAGWUERDIG", legal: "VO (EG) 767/2009 Art. 13 Abs. 3; UWG § 5", reason: "Als Schlagworte neben dem Produkt können „Durchfall“ und „Darmsanierung“ als Hinweis auf die Behandlung von Beschwerden verstanden werden; das ist Arzneimitteln vorbehalten. Auf dem Etikett stehen diese Begriffe nicht. Nach unserer Einschätzung gehören sie so nicht neben ein Futtermittel.", imageUrl: "" },
  ],
  metaTitle: "Medidog Ulmenrinden Paste im Test: 82/100 Punkte",
  metaDescription: "Medidog Ulmenrinden Paste für Hunde im Test: vegane Funktionspaste mit komplettem Etikett, aber unbenannten Nebenerzeugnissen. 82 von 100 Punkten.",
  keywords: ["Medidog Ulmenrinden Paste", "Ulmenrinde Hund", "Ulmenrinde Paste Hund", "Rotulmenrinde Hund", "Ergänzungsfuttermittel Magen Darm Hund", "Klinoptilolith Hund"],
  bodyHtml: `<p>„Die MEDIDOG Ulmenrinden Paste dient zur Unterstützung einer normalen Verdauungsfunktion“: So steht es auf dem Etikett der <strong>Ulmenrinden Paste</strong> von Medidog (${SRC}). Das ist ein zurückhaltender Satz, und er prägt das Bild des ganzen Produkts. Wir haben die Paste nach unserem 100-Punkte-Schema geprüft, ausschließlich anhand der veröffentlichten Angaben; eine eigene Laboranalyse gibt es nicht.</p>

<h2>Vegan, kurz, ohne Zucker</h2>
<p>Das Etikett nennt die Futtermittelart ausdrücklich: „Ergänzungsfuttermittel für Hunde“. Die Paste ersetzt also kein Futter, sondern ergänzt die Ration. Dazu stehen Zusammensetzung, analytische Bestandteile, Fütterungsempfehlung, Lagerhinweis und Haltbarkeit nach Anbruch (mindestens 8 Monate) auf der Dose. Das ist für ein Ergänzungsfutter ein vollständiges Etikett. Zucker, Farbstoffe und Konservierungsstoffe sind nicht deklariert, die Zutaten sind pflanzlich oder Hefe.</p>
<p><strong>Zusammensetzung (Etikett, 500 g Paste):</strong> Pflanzliche Nebenerzeugnisse, amerikanische Rotulmenrinde*, Hefehydrolysat*, Sonnenblumenöl; *getrocknet</p>
<p><strong>Analytische Bestandteile:</strong> Rohprotein 3 %, Rohfett 1 %, Rohasche 7 %, Rohfaser 10 %; Feuchtigkeit nicht angegeben. <strong>Zusatzstoffe je kg:</strong> Bindemittel Klinoptilolith (Zeolith) 50.000 mg, das sind 5 %.</p>

<h2>Die offene Frage: pflanzliche Nebenerzeugnisse</h2>
<p>Zutaten stehen in absteigender Reihenfolge ihres Gewichtsanteils. Ganz vorn steht hier eine Sammelbezeichnung: „pflanzliche Nebenerzeugnisse“. Welche Pflanzen das sind und wie viel davon in der Dose steckt, verrät die Deklaration nicht, ebenso wenig den Anteil der Rotulmenrinde, die dem Produkt den Namen gibt. Prozentangaben fehlen bei allen Zutaten. Das ist unser Hauptabzug bei der Deklaration. Eine Sammelbezeichnung ist erlaubt, schlecht ist sie nicht, aber wer wissen will, was er gibt, wird nicht ganz satt. Die geringen Protein- und Fettwerte (3 % und 1 %) passen zu einer Funktionspaste, die nicht ernähren, sondern ergänzen soll; der Rohfaseranteil von 10 % liegt auffällig hoch. Der Rohaschewert von 7 % dürfte zum Teil vom mineralischen Zeolith stammen (unsere Einschätzung).</p>

<h2>Fütterung: ein Teelöffel pro 10 kg</h2>
<p>Laut Etikett wird über den Tag verteilt pro 10 kg Körpergewicht 1 Teelöffel (etwa 6 g) gegeben, pur oder unter das Futter gemischt; ausreichend Wasser soll bereitstehen. Auf der Dose steht die Staffel bis 60 kg: 10 kg ein Teelöffel, 20 kg zwei, 30 kg drei, 40 kg vier, 50 kg fünf, 60 kg sechs. Das ist eine klare, nachvollziehbare Dosierung. Die Paste wird auf die Tagesration angerechnet; bei Erkrankungen oder Medikamenten sollte vorher die Tierarztpraxis gefragt werden.</p>

<h2>Was das Etikett verspricht und was der Shop</h2>
<p>Auf dem Etikett stehen „Paste leicht anwendbar“, „Harmonisierend“, „Sofort verzehrfertig“ und der Satz zur normalen Verdauungsfunktion. Das ist maßvoll; nur „harmonisierend“ bleibt unscharf. Schärfer wird es im Shop: Dort steht, die Paste helfe, „dem unerwünschten Kotfressen vorzubeugen“, Ulmenrinde wirke „appetitanregend“, und als Schlagworte erscheinen „Darmsanierung“ und „Durchfall“. Die Texte stammen vom Händler, nicht vom Etikett, und der Shop-Feed führt die Paste außerdem als „Alleinfutter“, obwohl das Etikett sie korrekt als Ergänzungsfuttermittel kennzeichnet. Wir haben beides getrennt bewertet und führen die Shop-Texte im Werbeaussagen-Check ausdrücklich als solche auf. Ein Futtermittel darf nicht mit der Behandlung von Krankheiten werben; Durchfall ist ein Symptom, das in die Tierarztpraxis gehört.</p>

<h2>Preis pro Tag</h2>
<p>Die 500-g-Dose kostete am 09.10.2026 bei Shop Apotheke (Verkauf durch Heimtierland24) 24,95 €, zuvor 25,95 €. Das sind 49,90 € pro Kilogramm. Für einen 10-kg-Hund fallen rund 0,30 € am Tag an, für einen 20-kg-Hund rund 0,60 € (eigene Berechnung); eine Dose reicht für einen 20-kg-Hund gut 40 Tage und ist nach Anbruch mindestens 8 Monate haltbar.</p>

<p><strong>Unser Gesamtergebnis: 82 von 100 Punkten.</strong> Nach unserem Bewertungsschema ist die Medidog Ulmenrinden Paste empfehlenswert (Ampel Grün). Das vollständige Etikett, die kurze vegane Rezeptur ohne Zucker, Farb- und Konservierungsstoffe, die zurückhaltende Aussage zur Verdauung und die klare Dosierung erkennen wir ausdrücklich an. Punkte kosten die unbenannten pflanzlichen Nebenerzeugnisse ohne Prozentangaben, fehlende Angaben zu Feuchte und Energie, die Shop-Werbung mit Kotfressen und Durchfall sowie der Preis.</p>

<p>Bilder: Herstellerfotos (mit Genehmigung verwendet).</p>`,
  conclusionHtml: `<p>Die Medidog Ulmenrinden Paste ist eine ehrlich gekennzeichnete, vegane Ergänzung für Hunde, deren Besitzer die Verdauung unterstützen möchten. Sie überzeugt durch ein vollständiges Etikett und eine kurze Rezeptur. Offen bleibt, was genau in den „pflanzlichen Nebenerzeugnissen“ steckt. Bei anhaltendem Durchfall, Erbrechen oder Gewichtsverlust ersetzt keine Paste den Besuch in der Tierarztpraxis.</p>`,
};
