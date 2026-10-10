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
    syncMarker: 'id="sicherheit"',
    title: "Medidog Dental Fresh & Clean im Test: 60/100 Punkte",
    productName: "Dental Fresh & Clean",
    keyword: "Dentalspray Hund",
    priceClass: "PREMIUM" as const,
    pricePerKg: 99.8,
    packageSize: "250 ml Spray",
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
    scores: { scoreRaw: 17, scoreHarmful: 13, scoreNutrients: 10, scoreDeclaration: 11, scoreNeeds: 6, scoreValue: 3 },
    verdict:
      "Ein Dentalspray aus 98 % Wasser mit zehn benannten Kräutern, Ölsaatenextrakt, Alkohol (Weingeist), Calciumchlorid und Minzöl. Einfach anzuwenden und mit geringen Tageskosten. Abzüge: keine Mengen, kein Wirkungsnachweis für Plaque oder Zahnstein, vier fragwürdige Werbeaussagen, widersprüchliche Anwendungsangaben, keine Dosierung nach Gewicht.",
    teaser: "Einfach anzuwenden, aber ohne Beleg für die Wirkung. 60 Punkte.",
    pros: [
      "Einfache Anwendung: 1x täglich in die Lefzen sprühen, bei Bedarf 2x; alternativ ins Trinkwasser, wenn der Hund das Sprühen nicht toleriert",
      "Alle zehn Kräuter einzeln benannt; keine Farbstoffe oder Konservierungsstoffe ausgewiesen",
      "Geringe Tageskosten: 24,95 € für 250 ml, selbst bei 1 ml am Tag (Annahme) rund 10 Cent",
    ],
    cons: [
      "Kein Beleg für Wirkung auf Plaque oder Zahnstein; „effektive Unterstützung“ und „hilft, die Zähne zu reinigen“ bleiben unbelegt",
      "Weingeist (Alkohol) ohne Mengenangabe; Mengen von Kräutersaft, Ölsaatenextrakt (Sammelbezeichnung) und Minzöl fehlen",
      "Anwendungsangaben widersprechen sich (1–2 Pumpstöße täglich laut Shop, 10–15 Sprühstöße 2–3x pro Woche laut Portal); keine Dosierung nach Gewicht",
    ],
    claims: [
      c("… ist nicht nur lecker im Geschmack, sondern auch eine effektive Unterstützung für die Zahngesundheit deines Tieres.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "„Effektiv“ ist eine Wirkaussage. Ein Wirksamkeitsnachweis (Studie, VOHC-Anerkennung) wird nicht genannt. Auf der eingesehenen VOHC-Liste fanden wir das Produkt nicht."),
      c("Der erfrischende Geschmack hilft dabei, die Zähne zu reinigen.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Dass ein Geschmack Zähne reinigt, ist nicht belegt. Eine reinigende Wirkung entsteht in der Regel mechanisch (Putzen, Kauen) oder durch geprüfte Wirkstoffe."),
      c("Mit diesem Zahnpflegespray kannst du die Maulhygiene deines Haustiers ganz einfach und bequem verbessern.", "FRAGWUERDIG", "UWG § 5", "„Verbessern“ ist eine Erfolgsaussage ohne Beleg. Einfach und bequem ist die Anwendung dagegen nachvollziehbar."),
      c("USP / Key Facts: Zahnpflege, Mundhygiene, Mundgeruch", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 3; UWG § 5", "Mundgeruch ist ein Krankheitszeichen (zum Beispiel bei Zahnerkrankung). Wer ihn als Anwendungsgebiet nennt, erweckt den Eindruck einer Behandlung. Bei anhaltendem Mundgeruch ist die Tierarztpraxis zuständig."),
      c("Anwendung: 1x täglich in die Lefzen sprühen, bei Bedarf 2x täglich. Alternativ ins Trinkwasser.", "ZULAESSIG", "VO (EG) 767/2009 Art. 11 Abs. 1", "Sachliche Anwendungsangabe, die zur Darreichungsform passt. Eine Dosierung nach Körpergewicht oder Menge je Pumpstoß fehlt."),
      c("Die Anwendung ist sparsam und unkompliziert, da nur ein bis zwei Pumpstöße erforderlich sind.", "ZULAESSIG", "UWG § 5", "Die Anzahl der Pumpstöße ist angegeben, und bei 250 ml Inhalt ist der Verbrauch plausibel gering. Die Menge je Pumpstoß fehlt."),
    ],
    metaTitle: "Medidog Dental Fresh & Clean im Test: 60/100 Punkte",
    metaDescription: "Medidog Dental Fresh & Clean Dentalspray für Hunde im Test: Kräuterauszug mit Alkohol, einfache Anwendung, aber kein Wirkungsbeleg. Sicherheit, Studienlage, Preis, 60 von 100 Punkten.",
    keywords: ["Medidog Dental Fresh & Clean Test", "Dentalspray Hund", "Zahnpflege Hund Spray", "Zahnstein Hund", "Medidog Erfahrungen", "Aquadent Alternative"],
    publishedDaysAgo: 14.3,
    bodyHtml: `<p>„Eine effektive Unterstützung für die Zahngesundheit“: So beschreibt der Händler das Dentalspray <strong>Medidog Dental Fresh &amp; Clean</strong> (${SRC}). Das Spray besteht zu 98 % aus Wasser und kostet 24,95 € für 250 ml. Wir prüfen Zusammensetzung, Anwendung, Werbung, Sicherheit und Studienlage und fragen, was ein Halter von einem solchen Spray erwarten darf.</p>

<h2>Das Wichtigste in Kürze</h2>
<ul>
<li>Das Spray ist ein Wasserauszug aus zehn Kräutern mit Ölsaatenextrakt, Alkohol (Weingeist), Calciumchlorid und Minzöl. Mengen nennt die Shopseite nicht.</li>
<li>Die Anwendung ist einfach: Lefzen oder Trinknapf. Die Angaben dazu widersprechen sich aber zwischen Shop und Vergleichsportalen.</li>
<li>Für Wirkung auf Plaque oder Zahnstein haben wir keinen Beleg gefunden, weder eine Studie noch eine VOHC-Anerkennung.</li>
<li>Vergleichsportale beschreiben die Zusammensetzung teils anders (Xylit, Meeresalgen). Xylit ist für Hunde gefährlich; prüfen Sie daher immer das Etikett der Packung, die Sie kaufen.</li>
<li>Der Preis ist mit rund 10 Cent je Milliliter hoch, die Tageskosten aber gering, weil nur wenig Spray gebraucht wird.</li>
</ul>

<h2>Wie wir getestet haben</h2>
<p>Wir haben das Spray nicht im Labor analysiert und nicht an Hunden erprobt. Grundlage sind die Angaben auf der Produktseite von ${a(URL_SA, "Shop-Apotheke")} (${SRC}), ergänzt durch Angaben weiterer Händler und Vergleichsportale, die wir ausdrücklich als solche kennzeichnen. Wir prüfen sie nach unserem 100-Punkte-Schema und nach den Regeln der Futtermittelkennzeichnung (VO (EG) 767/2009) und des Wettbewerbsrechts (UWG). Die Einstufung der Werbeaussagen ist unsere begründete Einschätzung und keine rechtsverbindliche Feststellung. Als Hersteller nennt die Shopseite „MEDIDOG“; eine verantwortliche Person in der EU ist dort nicht angegeben. Bei unserem Test der ${a("/ergaenzungsfuttermittel-hund/medidog-ulmenrinden-paste", "Medidog Ulmenrinden Paste")} nannten wir die Bionic Nature GmbH als Hersteller; ob sie auch dieses Spray herstellt, geht aus den Angaben der Händler nicht hervor. Die Bilder sind neutrale Illustrationen, keine Herstellerfotos.</p>

<h2>Zusammensetzung: ein Kräuterauszug in Wasser</h2>
<p>Die Zusammensetzung laut Shopseite: gereinigtes Wasser, Extrakt aus Ölsaaten, Kräutersaft (aus Holunderblüten, Wasserdorst, Majoran, Fenchel, Schlüsselblumenblüten, isländisches Moos, Hagebutten, Lindenblüten, Pfefferminze, Spitzwegerich), Weingeist, Kalziumchlorid und Minzöl. Die Reihenfolge entspricht bei Futtermitteln üblicherweise dem Gewichtsanteil, Wasser steht also vorn. Die Kräuter sind vollständig und einzeln benannt, das ist für ein Ergänzungsprodukt vorbildlich. Nicht genannt sind dagegen die Mengen der einzelnen Bestandteile. Ein Kräuterauszug mit 10 Pflanzen kann viel oder sehr wenig von jeder Pflanze enthalten, das lässt sich der Liste nicht entnehmen.</p>
<p>„Extrakt aus Ölsaaten“ ist eine Sammelbezeichnung. Welche Ölsaaten gemeint sind (Raps, Sonnenblume, Lein, Sesam, …) und ob jemand darauf allergisch reagieren könnte, erfahren Sie nicht. Das Futtermittelrecht erlaubt solche Sammelbezeichnungen in bestimmten Fällen, für Halter allergischer Hunde sind sie trotzdem unbefriedigend. Zusatzstoffe (Vitamine, Konservierungsstoffe, Aromen) sind auf der Shopseite nicht ausgewiesen.</p>

<h2>Analytische Bestandteile: Wasser mit Spuren</h2>
<p>Rohprotein, Rohfett, Rohasche und Rohfaser liegen jeweils unter 1 %, die Feuchtigkeit bei 98 %. Das bestätigt, dass es sich nicht um ein Futter mit Nährwert handelt, sondern um ein Pflegeprodukt. Die Nährstoffwertung fällt deshalb neutral aus: Wir geben weder Pluspunkte noch Abzüge für Nährstoffe, die ein Zahnspray nicht liefern soll, und bewerten dafür die Angaben, die ein Halter braucht (Anwendung, Dosierung, Sicherheit).</p>

<h2 id="sicherheit">Sicherheit: Alkohol, Minzöl und Xylit</h2>
<p><strong>Weingeist</strong> ist Alkohol (Ethanol). In einem Auszug dient er als Lösungsmittel für die Pflanzenstoffe. Wie viel enthalten ist, nennt die Seite nicht. Bei ein bis zwei Pumpstößen ist die Menge sehr klein, ein Grund zur Sorge ergibt sich daraus nicht. Sie ist aber nicht beurteilbar, und wer sein Tier täglich damit behandelt, sollte es wissen. Für Hunde mit Lebererkrankungen und für sehr kleine Hunde sollten Sie vorher die Tierarztpraxis fragen.</p>
<p><strong>Minzöl</strong> (und Pfefferminze im Kräutersaft) sorgen für den frischen Geschmack. Auch hier fehlt die Menge. Ätherische Öle sollten Hunde nur in geringen Mengen bekommen; ob diese Menge gering ist, können wir nicht prüfen.</p>
<p><strong>Xylit:</strong> Mehrere Vergleichsportale führen in ihren Beschreibungen Xylit (Xylitol) auf, andere nennen Meeresalgen und Kokosöl. Beides steht nicht in der Zusammensetzung der Shopseite. Xylit ist für Hunde schon in kleinen Mengen gefährlich (Unterzuckerung, Leberschäden). Wir gehen davon aus, dass die Portalbeschreibungen fehlerhaft sind, weil sie auch bei der Anwendung und Dosierung von der Shopseite abweichen. Ausschließen können wir es für jede Charge nicht. Prüfen Sie deshalb die Zusammensetzung auf der Packung, die bei Ihnen ankommt, und füttern Sie das Spray bei Xylit-Angabe nicht.</p>

<h2>Anwendung und Dosierung: widersprüchliche Angaben</h2>
<p>Laut Shopseite: 1x täglich in die Lefzen sprühen, bei Bedarf 2x täglich; ein bis zwei Pumpstöße je Anwendung. Wenn der Hund das Sprühen nicht toleriert, lässt sich das Spray dem Wasser im Trinknapf zugeben. Das ist die Angabe, die wir für den Test zugrunde legen.</p>
<p>Das Vergleichsportal beste-testsieger.de beschreibt es ganz anders: 10 bis 15 Sprühstöße direkt auf Zähne und Zahnfleisch, danach 10 bis 15 Minuten nichts fressen oder trinken, anwenden „2-3 Mal pro Woche“. Eine Quelle dafür nennt das Portal nicht. Es schreibt außerdem, das Spray enthalte Xylit. Diese Seite ist ein Vergleichsportal mit Kaufverweis zu Amazon; wir halten die Anwendungsangaben dort für nicht verlässlich. Halter sollten sich an die Gebrauchsanweisung auf der Packung halten.</p>
<p>Was in beiden Fällen fehlt: eine Dosierung nach Körpergewicht, ein Hinweis zur Menge im Trinknapf und die Menge je Pumpstoß. Ob ein Chihuahua und ein Sennenhund dieselbe Menge bekommen sollen, bleibt offen. Praktisch beachten sollten Sie: Wird das Spray ins Trinkwasser gegeben, sprühen Sie nur in einen frisch gefüllten Napf und lassen dem Hund eine zweite Wasserquelle, falls er das aromatisierte Wasser verweigert.</p>

<h2>Die Werbung: Wirkung ohne Beleg</h2>
<p>Die Shopseite sagt, das Spray sei „nicht nur lecker im Geschmack, sondern auch eine effektive Unterstützung für die Zahngesundheit deines Tieres“ (wörtliches Zitat; das „du“ stammt vom Händler, nicht von uns). Der „erfrischende Geschmack hilft dabei, die Zähne zu reinigen“, und man könne die Maulhygiene „ganz einfach und bequem verbessern“. Als Schlagworte nennt die Seite „Zahnpflege, Mundhygiene, Mundgeruch“. Einen Wirksamkeitsnachweis nennt die Seite nicht.</p>
<p>Unsere Einstufung: Vier Aussagen sind fragwürdig, weil sie als Wirkversprechen formuliert sind, ohne dass Studie oder Anerkennung genannt wird. Besonders schwach ist „der Geschmack hilft, die Zähne zu reinigen“: Ein Geschmack reinigt nicht. Reinigend wirken in der Praxis Putzen und Kauen sowie geprüfte Wirkstoffe. Bei „Mundgeruch“ kommt hinzu, dass er ein Krankheitszeichen sein kann; die Behandlung gehört in die Tierarztpraxis. Zulässig sind die sachlichen Angaben zu Anwendung und Pumpstößen. Andere Händler und Portale gehen deutlich weiter und schreiben, das Spray verhindere Zahnstein, Zahnfleischentzündung und Karies. Das steht nicht auf der Seite von Shop-Apotheke; wir bewerten hier nur sie, weisen aber darauf hin, wie unterschiedlich dasselbe Produkt beworben wird.</p>

<h2>Was die Studienlage sagt</h2>
<p>Für das Medidog-Spray haben wir keine Studie gefunden. Auf der Liste des ${a("https://vohc.org/accepted-products/", "Veterinary Oral Health Council (VOHC)")}, die Produkte mit anerkannter Wirkung gegen Plaque oder Zahnstein führt, fanden wir es nicht. Das heißt nicht, dass es wirkungslos ist; es heißt, dass diese Quelle keine Anerkennung ausweist. Ein Vergleichsportal gibt an, dass ihm für Dentalsprays kein Test der Stiftung Warentest bekannt ist; auch wir haben keinen gefunden.</p>
<p>Zum Vergleich: Für den Trinkwasserzusatz Virbac C.E.T. Aquadent FR3SH wurde eine randomisierte Studie mit 40 Hunden veröffentlicht (${a("https://pmc.ncbi.nlm.nih.gov/articles/PMC10570843/", "Gawor et al. 2023")}). Nach einer professionellen Zahnreinigung erhielten 20 Hunde den Zusatz 30 Tage lang, 20 bildeten die Kontrollgruppe. Die Aquadent-Gruppe hatte am Ende einen um 47 % niedrigeren medianen Plaque-Score und einen um 24 % niedrigeren Zahnstein-Score. Die Studie sagt nichts über Medidog, und sie belegt nicht, dass ein Zusatz vorhandenen harten Zahnstein entfernt. Fachleitlinien betonen regelmäßige Zahnkontrollen und häusliche Pflege, vor allem das Zähneputzen (${a("https://www.aaha.org/resources/2019-aaha-dental-care-guidelines-for-dogs-and-cats/", "AAHA 2019")}, ${a("https://www.avma.org/resources-tools/pet-owners/petcare/pet-dental-care", "AVMA")}).</p>

<h2>Alternativen im Überblick</h2>
<table>
<thead><tr><th>Produkt</th><th>Form</th><th>Belegt?</th></tr></thead>
<tbody>
<tr><td>Medidog Dental Fresh &amp; Clean</td><td>Spray (Lefzen oder Trinknapf)</td><td>Keine Studie, nicht auf der VOHC-Liste gefunden</td></tr>
<tr><td>Virbac C.E.T. Aquadent FR3SH</td><td>Trinkwasserzusatz</td><td>Eine randomisierte Studie mit 40 Hunden (nach Zahnreinigung); auf der VOHC-Liste</td></tr>
<tr><td>ProDen PlaqueOff</td><td>Pulver zum Futter</td><td>Auf der VOHC-Liste (Plaque und Zahnstein)</td></tr>
<tr><td>Tierliebhaber Dentalspray</td><td>Spray</td><td>Kundenbefragung des Anbieters (170 Teilnehmende, Mai 2026), keine klinische Studie</td></tr>
<tr><td>noms+ Dentalspray</td><td>Spray auf die Zahnreihen</td><td>Kundenbefragungen als Selbstauskunft, keine klinische Studie</td></tr>
</tbody>
</table>
<p>Die Tabelle zeigt keinen Direktvergleich; die Produkte wurden nie gegeneinander getestet. Einen Snack zur Zahnpflege haben wir unter ${a("/ergaenzungsfuttermittel-hund/mammaly-fresh-smile-test", "mammaly Fresh Smile")} getestet.</p>

<h2>Preis und Tageskosten</h2>
<p>250 ml kosten 24,95 € (Shop-Apotheke, Stand 10.10.2026), das sind 9,98 € je 100 ml oder rund 0,10 € je Milliliter (eigene Berechnung). Dieselbe Packung wird auch bei anderen Händlern für 24,95 € geführt. Die Menge je Pumpstoß ist nicht angegeben. Selbst wenn wir großzügig 1 ml am Tag annehmen (eine Annahme, keine Herstellerangabe), wären das rund 10 Cent am Tag oder etwa 3 € im Monat. Für kleine Hunde mit ein bis zwei Pumpstößen liegt der Verbrauch vermutlich deutlich darunter. Der Preis je Liter ist hoch für ein Produkt aus 98 % Wasser, die Tageskosten sind aber gering. Auf der Shopseite fehlen Angaben zur Haltbarkeit nach dem Öffnen; ohne ausgewiesene Konservierung wäre sie für die Kosten und die Hygiene wichtig.</p>

<h2>Was Käufer berichten</h2>
<p>Auf der Shop-Apotheke-Seite gab es zum Abrufzeitpunkt keine Bewertungen (0), ebenso keine Erfahrungsberichte auf der Händlerseite von hundepark.berlin. Das Vergleichsportal beste-testsieger.de nennt 4,4 von 5 Sternen bei 63 Bewertungen und vergibt die Note 1,5; ein zweites Portal vergibt die Note 1,9. Woher diese Werte stammen, erklären die Portale nicht. Es handelt sich um Seiten mit Kaufverweisen, nicht um unabhängige Tests; wir werten sie nicht als Anwenderberichte. Unabhängige Berichte von Haltern zum Spray haben wir nicht gefunden. Wenn Sie es schon einmal eingesetzt haben, können Sie uns Ihre Erfahrung über das Kontaktformular schicken.</p>

<h2>Häufige Fragen</h2>
<p><strong>Entfernt das Spray vorhandenen Zahnstein?</strong> Dafür gibt es keinen Beleg. Harter Zahnstein wird in der Tierarztpraxis entfernt. Auch die Studie zum Trinkwasserzusatz Aquadent zeigt nur eine geringere Neubildung nach einer Zahnreinigung.</p>
<p><strong>Ersetzt es das Zähneputzen?</strong> Nein. Putzen gilt in den Leitlinien als wichtigste häusliche Maßnahme, sofern der Hund es toleriert.</p>
<p><strong>Hilft es gegen Mundgeruch?</strong> Frischer Minzgeschmack kann den Geruch kurzzeitig überdecken. Anhaltender Mundgeruch kann ein Zeichen für Zahn- oder andere Erkrankungen sein und gehört in die Tierarztpraxis.</p>
<p><strong>Für wen ist es geeignet?</strong> Laut Händler für Hunde; ab welchem Alter oder Gewicht, steht auf der Seite nicht. Bei Allergien auf Ölsaaten, Lebererkrankungen und Welpen sollten Sie vorher die Tierarztpraxis fragen.</p>

<p><strong>Unser Gesamtergebnis: 60 von 100 Punkten.</strong> Nach unserem Bewertungsschema liegt das Spray an der Grenze zwischen Gelb und Rot, noch im gelben Bereich. <strong>Strenge Wertung:</strong> Jede fragwürdige Werbeaussage kostet einen Punkt bei der Deklaration, jede unzulässige drei, höchstens 15; hier sind es 4 fragwürdige und 0 unzulässige Aussagen. Punkte kosten außerdem die fehlenden Mengenangaben, der Alkohol ohne Mengenangabe, die fehlende Wirkungsbelegung, die fehlende Dosierung nach Gewicht und der Literpreis. Positiv zählen die einfache Anwendung, die vollständig benannten Kräuter und die geringen Tageskosten.</p>
<p><em>Hinweis:</em> Alle Zitate stammen von den genannten Seiten (Stand 10.10.2026). Preise und Texte können sich ändern.</p>`,
    conclusionHtml: `<p>Das Medidog-Spray ist bequem anzuwenden und kostet am Tag wenig, ein Beleg für die Wirkung fehlt aber. Wer eine Zahnbürste einsetzen kann, putzt wirksamer. Prüfen Sie das Etikett auf Xylit, lassen Sie bei Vorerkrankungen vorher die Tierarztpraxis entscheiden und suchen Sie bei Zahnstein, Zahnfleischbluten oder anhaltendem Mundgeruch die Praxis auf; ein Spray ersetzt weder Untersuchung noch Zahnbehandlung.</p>`,
  },
];
