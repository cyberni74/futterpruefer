/** Test „Medidog Dental Fresh & Clean“ (Okt. 2026). Der Seed legt ihn nur an, wenn der Slug fehlt; Änderungen im Admin bleiben erhalten. */
const SRC = "Shop-Apotheke, abgerufen am 10.10.2026";
const URL_SA = "https://www.shop-apotheke.com/tiergesundheit/upmR7ZWUY/medidog-dental-fresh-clean.htm";
const a = (u: string, l: string) => `<a href="${u}">${l}</a>`;
type Claim = { claim: string; rating: "ZULAESSIG" | "FRAGWUERDIG" | "UNZULAESSIG"; legal: string; reason: string; imageUrl: string };
const c = (claim: string, rating: Claim["rating"], legal: string, reason: string): Claim => ({ claim, rating, legal, reason, imageUrl: "" });

export const MEDIDOG_DENTAL_TESTS = [
  {
    categorySlug: "ergaenzungsfuttermittel-hund",
    brand: "Medidog",
    slug: "medidog-dental-fresh-clean-test",
    title: "Medidog Dental Fresh & Clean im Test: 58/100 Punkte",
    productName: "Dental Fresh & Clean",
    keyword: "Dentalspray Hund",
    priceClass: "PREMIUM" as const,
    pricePerKg: 998,
    packageSize: "25 ml Spray",
    price: 24.95,
    pricePerDay: null as number | null,
    image: "medidog-dental-fresh-clean-hund-zahnpflege-spray.webp",
    imageAlt: "Etikett eines Dentalsprays für Hunde, Illustration",
    contentImage: "medidog-dental-fresh-clean-hund-maul-anwendung.webp",
    contentImageAlt: "Hund wird beim Zähneputzen untersucht, Illustration",
    gallery: [] as string[],
    composition:
      "Gereinigtes Wasser, Extrakt aus Ölsaaten, Kräutersaft (aus Holunderblüten, Wasserdorst, Majoran, Fenchel, Schlüsselblumenblüten, isländisches Moos, Hagebutten, Lindenblüten, Pfefferminze, Spitzwegerich), Weingeist, Kalziumchlorid, Minzöl",
    analysis: [
      { name: "Rohprotein", value: 1 },
      { name: "Rohfett", value: 1 },
      { name: "Rohasche", value: 1 },
      { name: "Rohfaser", value: 1 },
      { name: "Feuchtigkeit", value: 98 },
    ],
    scores: { scoreRaw: 17, scoreHarmful: 13, scoreNutrients: 10, scoreDeclaration: 11, scoreNeeds: 6, scoreValue: 1 },
    verdict:
      "Ein Dentalspray aus 98 % Wasser mit Kräutersaft, Ölsaatenextrakt, Alkohol (Weingeist), Calciumchlorid und Minzöl. Die Anwendung ist einfach (Lefzen oder Trinknapf). Abzüge: keine Mengen der Kräuter, kein Wirkungsnachweis für Plaque oder Zahnstein, vier fragwürdige Werbeaussagen, kein Hinweis zur Futtermittelart auf der Shopseite und ein hoher Preis je Milliliter.",
    teaser: "Einfach anzuwenden, aber ohne Beleg für die Wirkung. 58 Punkte.",
    pros: [
      "Einfache Anwendung: 1x täglich in die Lefzen sprühen, bei Bedarf 2x; alternativ ins Trinkwasser, wenn der Hund das Sprühen nicht toleriert",
      "Kurze, offene Zutatenliste mit benannten Kräutern; keine Farbstoffe oder Konservierungsstoffe ausgewiesen",
      "Hilfreich für Halter, die keine Zahnbürste einsetzen können; der Vorteil liegt in der Anwendung, nicht in einer belegten Wirkung",
    ],
    cons: [
      "Kein Beleg für Wirkung auf Plaque oder Zahnstein; Aussagen wie „effektive Unterstützung“ und „hilft, die Zähne zu reinigen“ bleiben unbelegt",
      "Weingeist (Alkohol) in einem Spray, das direkt ins Maul gegeben wird; Mengen von Kräutersaft, Ölsaatenextrakt und Minzöl nicht genannt",
      "25,00 ml für 24,95 € (rund 998 € je Liter); Menge je Pumpstoß fehlt, Tageskosten lassen sich nicht berechnen",
    ],
    claims: [
      c("… ist nicht nur lecker im Geschmack, sondern auch eine effektive Unterstützung für die Zahngesundheit deines Tieres.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "„Effektiv“ ist eine Wirkaussage. Ein Wirksamkeitsnachweis (Studie, VOHC-Anerkennung) wird nicht genannt. Auf der eingesehenen VOHC-Liste fanden wir das Produkt nicht."),
      c("Der erfrischende Geschmack hilft dabei, die Zähne zu reinigen.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Dass ein Geschmack Zähne reinigt, ist nicht belegt. Eine reinigende Wirkung entsteht in der Regel mechanisch (Putzen, Kauen) oder durch geprüfte Wirkstoffe."),
      c("Mit diesem Zahnpflegespray kannst du die Maulhygiene deines Haustiers ganz einfach und bequem verbessern.", "FRAGWUERDIG", "UWG § 5", "„Verbessern“ ist eine Erfolgsaussage ohne Beleg. Einfach und bequem ist die Anwendung dagegen nachvollziehbar."),
      c("USP / Key Facts: Zahnpflege, Mundhygiene, Mundgeruch", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 3; UWG § 5", "Mundgeruch ist ein Krankheitszeichen (zum Beispiel bei Zahnerkrankung). Wer ihn als Anwendungsgebiet nennt, erweckt den Eindruck einer Behandlung. Bei anhaltendem Mundgeruch ist die Tierarztpraxis zuständig."),
      c("Anwendung: 1x täglich in die Lefzen sprühen, bei Bedarf 2x täglich. Alternativ ins Trinkwasser.", "ZULAESSIG", "VO (EG) 767/2009 Art. 11 Abs. 1", "Sachliche Anwendungsangabe, die zur Darreichungsform passt. Eine Dosierung nach Körpergewicht oder Menge je Pumpstoß fehlt."),
      c("Die Anwendung ist sparsam und unkompliziert, da nur ein bis zwei Pumpstöße erforderlich sind.", "ZULAESSIG", "UWG § 5", "Die Anzahl der Pumpstöße ist angegeben. „Sparsam“ lässt sich ohne Menge je Pumpstoß nicht nachrechnen (siehe Preis)."),
    ],
    metaTitle: "Medidog Dental Fresh & Clean im Test: 58/100 Punkte",
    metaDescription: "Medidog Dental Fresh & Clean Dentalspray für Hunde im Test: 98 % Wasser, Kräutersaft, Weingeist. Einfache Anwendung, aber kein Wirkungsbeleg. Werbeaussagen-Check, 58 von 100 Punkten.",
    keywords: ["Medidog Dental Fresh & Clean Test", "Dentalspray Hund", "Zahnpflege Hund Spray", "Zahnstein Hund", "Medidog Erfahrungen", "Aquadent Alternative"],
    publishedDaysAgo: 14.3,
    bodyHtml: `<p>„Eine effektive Unterstützung für die Zahngesundheit“: So beschreibt der Händler das Dentalspray <strong>Medidog Dental Fresh &amp; Clean</strong> (${SRC}). Wir prüfen Zusammensetzung, Anwendung und Werbung und fragen, welche Belege es für die Wirkung gibt.</p>

<h2>Wie wir getestet haben</h2>
<p>Wir haben das Spray nicht im Labor analysiert und nicht an Hunden erprobt. Grundlage sind die Angaben auf der Produktseite von ${a(URL_SA, "Shop-Apotheke")} (${SRC}), die wir nach unserem 100-Punkte-Schema und nach den Regeln der Futtermittelkennzeichnung (VO (EG) 767/2009) und des Wettbewerbsrechts (UWG) prüfen. Die Einstufung der Werbeaussagen ist unsere begründete Einschätzung und keine rechtsverbindliche Feststellung. Als Hersteller nennt die Shopseite „MEDIDOG“; eine verantwortliche Person in der EU ist dort nicht angegeben. Bei unserem Test der ${a("/ergaenzungsfuttermittel-hund/medidog-ulmenrinden-paste", "Medidog Ulmenrinden Paste")} nannten wir die Bionic Nature GmbH als Hersteller; ob sie auch dieses Spray herstellt, geht aus den Shopangaben nicht hervor. Die Bilder sind neutrale Illustrationen.</p>

<h2>Zusammensetzung: viel Wasser, wenig Information</h2>
<p>Die Zusammensetzung laut Shopseite: gereinigtes Wasser, Extrakt aus Ölsaaten, Kräutersaft (aus Holunderblüten, Wasserdorst, Majoran, Fenchel, Schlüsselblumenblüten, isländisches Moos, Hagebutten, Lindenblüten, Pfefferminze, Spitzwegerich), Weingeist, Kalziumchlorid und Minzöl. Die analytischen Bestandteile: Rohprotein, Rohfett, Rohasche und Rohfaser je unter 1 %, Feuchtigkeit 98 %. Das Spray besteht also fast nur aus Wasser.</p>
<p>Offen genannt sind die Kräuter. Nicht genannt sind ihre Mengen, ebenso wenig die von „Extrakt aus Ölsaaten“ (welche Ölsaaten, ist nicht angegeben), Kalziumchlorid und Minzöl. <strong>Weingeist</strong> ist Alkohol. Er kann als Träger für Kräuterauszüge dienen; wie viel enthalten ist, steht nicht auf der Seite. Zusatzstoffe sind nicht ausgewiesen, auch keine Konservierung. Ob das Spray ohne Konservierungsstoff lagerstabil ist, lässt sich aus den Angaben nicht beurteilen.</p>

<h2>Anwendung: einfach, aber ohne Dosierung nach Gewicht</h2>
<p>Laut Händler 1x täglich in die Lefzen sprühen, bei Bedarf 2x; wenn der Hund das Sprühen nicht toleriert, kann das Spray ins Wasser im Trinknapf gegeben werden. Je Anwendung sind „ein bis zwei Pumpstöße“ vorgesehen. Eine Dosierung nach Körpergewicht und die Menge je Pumpstoß fehlen. Das ist praktisch für Halter, die keine Zahnbürste einsetzen können, erschwert aber den Vergleich und die Berechnung der Tageskosten. Wie viel Spray ins Trinkwasser soll, bleibt offen.</p>

<h2>Die Werbung: Wirkung ohne Beleg</h2>
<p>Die Produktseite sagt, das Spray sei „eine effektive Unterstützung für die Zahngesundheit“, der „erfrischende Geschmack“ helfe, „die Zähne zu reinigen“, und man könne die Maulhygiene „ganz einfach und bequem verbessern“. Als Schlagworte nennt sie „Zahnpflege, Mundhygiene, Mundgeruch“. Einen Wirksamkeitsnachweis nennt die Seite nicht. Wir haben vier dieser Aussagen als fragwürdig eingestuft: Sie sind als Wirkversprechen formuliert, ohne dass Studie oder Anerkennung genannt wird. Bei „Mundgeruch“ kommt hinzu, dass er ein Krankheitszeichen sein kann; die Behandlung gehört in die Tierarztpraxis.</p>

<h2>Was die Studienlage sagt</h2>
<p>Für das Medidog-Spray haben wir keine Studie gefunden. Auf der Liste des ${a("https://vohc.org/accepted-products/", "Veterinary Oral Health Council (VOHC)")}, die Produkte mit anerkannter Wirkung gegen Plaque oder Zahnstein führt, fanden wir es nicht. Das heißt nicht, dass es wirkungslos ist; es heißt, dass diese Quelle keine Anerkennung ausweist. Zum Vergleich: Für den Trinkwasserzusatz Virbac C.E.T. Aquadent FR3SH wurde eine randomisierte Studie mit 40 Hunden veröffentlicht (${a("https://pmc.ncbi.nlm.nih.gov/articles/PMC10570843/", "Gawor et al. 2023")}). Nach einer professionellen Zahnreinigung hatten die 20 Hunde mit Aquadent nach 30 Tagen einen um 47 % niedrigeren medianen Plaque-Score und einen um 24 % niedrigeren Zahnstein-Score als die 20 Hunde der Kontrollgruppe. Die Studie sagt nichts über Medidog, und sie belegt nicht, dass ein Zusatz vorhandenen harten Zahnstein entfernt. Fachleitlinien betonen regelmäßige Zahnkontrollen und häusliche Pflege, vor allem das Zähneputzen (${a("https://www.aaha.org/resources/2019-aaha-dental-care-guidelines-for-dogs-and-cats/", "AAHA 2019")}).</p>

<h2>Preis</h2>
<p>25 ml kosten 24,95 € (Shop-Apotheke), das sind rund 998 € je Liter (eigene Berechnung). Es gibt laut Shopseite auch eine Variante mit 250 ml; deren Preis haben wir nicht erfasst. Weil die Menge je Pumpstoß nicht angegeben ist, können wir keine Tageskosten berechnen. Der Preis ist hoch für ein Produkt, das zu 98 % aus Wasser besteht, zumal ein Nutzen für Plaque oder Zahnstein nicht belegt ist.</p>

<h2>Was Käufer berichten</h2>
<p>Auf der Shop-Apotheke-Seite gab es zum Abrufzeitpunkt keine Bewertungen. Eigene Anwenderberichte haben wir für dieses Spray nicht ausgewertet; Aussagen von Haltern zum Geschmack oder zum Atem können wir daher nicht wiedergeben.</p>

<p><strong>Unser Gesamtergebnis: 58 von 100 Punkten.</strong> Nach unserem Bewertungsschema liegt das Spray im roten Bereich. <strong>Strenge Wertung:</strong> Jede fragwürdige Werbeaussage kostet einen Punkt bei der Deklaration, jede unzulässige drei, höchstens 15; hier sind es 4 fragwürdige und 0 unzulässige Aussagen. Punkte kosten außerdem die fehlenden Mengenangaben, der Alkohol, die fehlende Wirkungsbelegung, die fehlende Dosierung nach Gewicht und der Preis. Positiv zählen die einfache Anwendung und die offene Nennung der Kräuter.</p>
<p><em>Hinweis:</em> Alle Zitate stammen von den genannten Seiten (Stand 10.10.2026). Preise und Texte können sich ändern.</p>`,
    conclusionHtml: `<p>Das Medidog-Spray ist bequem anzuwenden, ein Beleg für die Wirkung fehlt aber. Wer eine Zahnbürste einsetzen kann, putzt wirksamer. Bei Zahnstein, Zahnfleischbluten oder anhaltendem Mundgeruch sollten Sie die Tierarztpraxis aufsuchen; ein Spray ersetzt weder Untersuchung noch Zahnbehandlung.</p>`,
  },
];
