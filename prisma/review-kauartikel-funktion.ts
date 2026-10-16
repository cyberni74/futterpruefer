/** Fünf Tests funktioneller Kauartikel großer Hersteller (Okt. 2026). Der Seed legt sie nur an, wenn der Slug fehlt; Änderungen im Admin bleiben erhalten. Bewertung ausschließlich anhand veröffentlichter Herstellerangaben, abgerufen am 16.10.2026. Bilder: Hersteller (Produktseiten bzw. Hersteller-Shop). */
const D = "16.10.2026";
const a = (u: string, l: string) => `<a href="${u}">${l}</a>`;
type Claim = { claim: string; rating: "ZULAESSIG" | "FRAGWUERDIG" | "UNZULAESSIG"; legal: string; reason: string; imageUrl: string };
const c = (claim: string, rating: Claim["rating"], legal: string, reason: string): Claim => ({ claim, rating, legal, reason, imageUrl: "" });
const VOHC = "https://vohc.org/accepted-products/";
const METHODE = (quelle: string) => `<h2>Wie wir getestet haben</h2>
<p>Wir haben den Kauartikel weder im Labor analysiert noch an Hunden erprobt. Grundlage sind die Angaben auf ${quelle} (abgerufen am ${D}), ergänzt durch Händlerangaben, die wir ausdrücklich als solche kennzeichnen, und die öffentliche Liste des Veterinary Oral Health Council (${a(VOHC, "VOHC")}). Bewertet wird nach unserem 100-Punkte-Schema und nach den Regeln der Futtermittelkennzeichnung (VO (EG) 767/2009) und des Wettbewerbsrechts (UWG). Die Einstufung der Werbeaussagen ist unsere begründete Einschätzung, keine rechtsverbindliche Feststellung. Bild: Hersteller.</p>`;
const FOOT = `<p><em>Hinweis:</em> Alle Zitate stammen von den genannten Seiten (Stand ${D}). Preise und Texte können sich ändern. Hersteller können uns Belege zukommen lassen.</p>`;
const ZAHN = `<p>Ein Kauartikel ersetzt nach den Leitlinien der Tierzahnmedizin weder das Zähneputzen noch die Kontrolle in der Tierarztpraxis. Bei Zahnstein, Zahnfleischbluten oder anhaltendem Mundgeruch gehört der Hund in die Praxis.</p>`;
const BASE = { categorySlug: "ergaenzungsfuttermittel-hund", gallery: [] as string[], publishedDaysAgo: 0, imageMarker: "Bild: Hersteller", priceDate: "2026-10-16T10:00:00Z", testedAt: "2026-10-16T08:00:00Z" };

const PED = "https://www.pedigree.de/hundefutter/zahnpflege-kauartikel-fur-hunde/pedigree-dentastix-daily-fresh-mittelgrosse-hunde-28-stuck";
const PED_FN = "https://www.fressnapf.de/p/pedigree-zahnpflege-dentastix-fresh-multipack-28-stueck-fuer-mittelgrosse-hunde-1072796/";
const PED_ZP = "https://www.zooplus.de/shop/hunde/hundesnacks/pedigree/pedigree_dentastix/1366715";
const PUR = "https://www.purina.de/hund/hundefutter/produkt-dentalife-daily-medium";
const PUR_FN = "https://www.fressnapf.de/p/dentalife-zahnpflege-snacks-multipack-medium-42-stueck-1345230/";
const PUR_ZP = "https://www.zooplus.de/shop/hunde/hundesnacks/purina/973799";
const WHZ = "https://whimzees.eu/de-de/Produkt/toothbrush/";
const WHZ_FN = "https://www.fressnapf.de/p/whimzees-zahnpflegesnacks-zahnbuerste-hund-adult-m-1183867/";
const GRN = "https://www.jameswellbeloved.de/p/greenies-medium-dogs-treat-original/16570658/";
const GRN_UK = "https://www.greenies.co.uk/dog/original-adult-medium-dog-dental-treats-regular";
const HD = "https://happydog.de/hundefutter/nahrungsergaenzung/happy-dog-care-snack-calm-relax";
const LGD = "https://www.justiz.nrw.de/nrwe/lgs/duesseldorf/lg_duesseldorf/j2024/37_O_54_23_Urteil_20240220.html";

export const KAUARTIKEL_FUNKTION_TESTS = [
  // 1) Pedigree Dentastix Daily Fresh Medium
  {
    ...BASE,
    brand: "Pedigree",
    slug: "pedigree-dentastix-daily-fresh-medium-test",
    title: "Pedigree Dentastix Daily Fresh Medium im Test: 50/100 Punkte",
    productName: "Dentastix Daily Fresh für mittelgroße Hunde (10–25 kg)",
    keyword: "Dentastix Fresh",
    priceClass: "GUENSTIG" as const,
    pricePerKg: 9.71,
    packageSize: "720 g (28 Sticks)",
    price: 6.99,
    pricePerDay: 0.25 as number | null,
    image: "pedigree-dentastix-daily-fresh-medium-packshot-hersteller.webp",
    imageAlt: "Packung Pedigree Dentastix Daily Fresh für mittelgroße Hunde, 28 Stück (Bild: Hersteller)",
    contentImage: "pedigree-dentastix-daily-fresh-medium-sticks-hersteller.webp",
    contentImageAlt: "Ausschnitt der Packung mit grünen Dentastix-Fresh-Sticks in X-Form (Bild: Hersteller)",
    composition:
      "Getreide*, pflanzliche Nebenerzeugnisse (u.a. entkoffeinierter Grüner Tee-Extrakt 0,2 %), Mineralstoffe (u.a. Natrium Tripolyphosphat 2,4 %), Fleisch und tierische Nebenerzeugnisse*, Öle und Fette (u.a. Eukalyptusöl 0,03 %). *Natürliche Zutaten. Zusatzstoffe je kg: Konservierungsstoffe und Farbstoffe; Vitamin E 60 mg, Zink (Zinksulfat Heptahydrat) 228 mg; Huhn Geschmack 18,1 mg.",
    analysis: [
      { name: "Rohprotein", value: 7.5 },
      { name: "Rohfett", value: 1.3 },
      { name: "Rohasche", value: 5.7 },
      { name: "Rohfaser", value: 0.2 },
      { name: "Feuchtigkeit", value: 16.5 },
    ],
    scores: { scoreRaw: 9, scoreHarmful: 14, scoreNutrients: 10, scoreDeclaration: 6, scoreNeeds: 8, scoreValue: 3 },
    verdict:
      "Günstiger Zahnpflege-Stick mit deklariertem Wirkstoff (Natriumtripolyphosphat 2,4 %) und VOHC-Siegel für den britischen Fresh-Artikel. Abzüge: Rezeptur nur in Sammelbegriffen, kein Fleischanteil beziffert, Konservierungs- und Farbstoffe ohne Namen, sechs fragwürdige Werbeaussagen.",
    teaser: "Günstig, Wirkstoff deklariert, Rezeptur im Nebel. 50 Punkte.",
    pros: [
      "Zahnpflege-Wirkstoff Natriumtripolyphosphat (2,4 %) mit Menge deklariert; VOHC-Siegel für „Dentastix Fresh“ (UK) gegen Plaque und Zahnstein",
      "Fettarm (1,3 %), Feuchte und Energie (299 kcal/100 g) deklariert, klare Fütterungsempfehlung (1 Stick/Tag, 10–25 kg)",
      "Günstig: rund 0,25 € pro Tag (6,99 € für 28 Sticks, Fressnapf, Stand 16.10.2026)",
    ],
    cons: [
      "Nur Sammelbegriffe; Getreide an erster Stelle, kein Fleischanteil beziffert",
      "„Konservierungsstoffe und Farbstoffe“ ohne Namen, obwohl die Seite „frei von künstlichen Farb- und Aromastoffen“ wirbt",
      "Sechs fragwürdige Werbeaussagen; Händlerangaben weichen beim Wirkstoff und bei den Zusatzstoffen ab",
    ],
    claims: [
      c("… die wissenschaftlich erwiesen dazu beitragen, die Bildung von Zahnstein bei täglicher Fütterung um bis zu 80% zu reduzieren.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1; UWG § 5 Abs. 2 Nr. 1", "Die Richtung ist belegt: Die VOHC führt „Dentastix Fresh PEDIGREE UK“ mit Siegel für Plaque und Zahnstein (2024). Die Studie hinter „bis zu 80 %“ nennt die Seite nicht; „bis zu“ beschreibt einen Bestwert, keinen Durchschnitt."),
      c("… eine einzigartige Wirkstoffmischung aus Grüntee-Extrakt und patentiertem Eukalyptusöl, die nachweislich helfen, den Atem zu erfrischen.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1; UWG § 5", "„Nachweislich“ behauptet einen Beleg, der auf der Seite fehlt. Patent und Studie werden nicht genannt. Eukalyptusöl ist mit 0,03 % deklariert."),
      c("Reduziert die Zahnsteinbildung um bis zu 80% und unterstützt die Zahnfleischgesundheit", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1", "Für die Zahnfleischgesundheit nennt die Seite keinen Beleg; das VOHC-Siegel betrifft Plaque und Zahnstein, nicht das Zahnfleisch."),
      c("Reinigt schwer erreichbare Zähne", "FRAGWUERDIG", "UWG § 5", "Plausibel durch Form und Kauen, aber ohne Angabe, welche Zähne in welcher Untersuchung erreicht wurden."),
      c("DENTASTIX™ wurden zusammen mit Tierärzten und Ernährungsspezialisten entwickelt", "FRAGWUERDIG", "UWG § 5; FEDIAF-Kodex", "Wer beteiligt war und auf welcher Grundlage, bleibt offen. Solche Aussagen über Dritte sind ohne Angaben nicht nachprüfbar."),
      c("Sie sind lecker, fettarm und frei von künstlichen Farb- und Aromastoffen …", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Fettarm trifft zu (1,3 %). Die Zusatzstoffliste nennt aber pauschal „Konservierungsstoffe und Farbstoffe“ ohne Namen; ob diese natürlich oder künstlich sind, lässt sich nicht prüfen."),
      c("… und haben keinen Zuckerzusatz.", "ZULAESSIG", "VO (EG) 767/2009 Art. 11", "Zucker ist in der Zusammensetzung nicht genannt."),
    ],
    metaTitle: "Pedigree Dentastix Daily Fresh Medium im Test: 50/100 Punkte",
    metaDescription: "Pedigree Dentastix Daily Fresh im Test: Zusammensetzung, Wirkstoff, VOHC-Siegel, Werbeaussagen und Preis pro Tag. 50 von 100 Punkten nach unserem Schema.",
    keywords: ["Dentastix Fresh Test", "Pedigree Dentastix Daily Fresh", "Zahnpflegesnack Hund", "Kauartikel Zahnpflege Hund", "Natriumtripolyphosphat Hund"],
    bodyHtml: `<p>„Um bis zu 80 %“ soll ein grüner Stick in X-Form die Zahnsteinbildung senken, dazu verspricht Pedigree für <strong>Dentastix Daily Fresh</strong> frischen Atem dank „patentiertem Eukalyptusöl“ (${a(PED, "pedigree.de")}, abgerufen am ${D}). Der Eukalyptus macht 0,03 % aus. Wir haben nachgesehen, was sonst im Stick steckt.</p>
${METHODE(a(PED, "pedigree.de"))}
<h2>Die Rezeptur bleibt im Sammelbegriff</h2>
<p>Die Zusammensetzung beginnt mit „Getreide“, gefolgt von pflanzlichen Nebenerzeugnissen, Mineralstoffen, „Fleisch und tierischen Nebenerzeugnissen“ sowie Ölen und Fetten. Welches Getreide, welches Tier? Nicht deklariert. Anders als bei der Sorte ${a("/ergaenzungsfuttermittel-hund/pedigree-dentastix-daily-oral-care-medium-im-test", "Dentastix Daily Oral Care")} fehlt hier sogar eine Prozentangabe für das Tierische. Für einen Kauartikel, der vor allem mechanisch arbeiten soll, ist eine stärkehaltige Grundmasse erklärbar. Nach unserem rezepturbasierten Bewertungsschema reicht das nur für 9 von 30 Punkten.</p>
<h2>Der Wirkstoff steht drauf, die Farbe nicht</h2>
<p>Positiv: Natriumtripolyphosphat ist mit 2,4 % beziffert. Der Stoff bindet Calcium im Speichel und kann so bremsen, dass weicher Belag zu Zahnstein verhärtet. Grüntee-Extrakt (entkoffeiniert, 0,2 %) und Eukalyptusöl sind ebenfalls mit Menge genannt. Weniger auskunftsfreudig ist die Zusatzstoffliste: Dort stehen pauschal „Konservierungsstoffe und Farbstoffe“. Auf derselben Seite heißt es, die Sticks seien „frei von künstlichen Farb- und Aromastoffen“. Das mag zutreffen. Prüfen lässt es sich ohne Namen nicht. Dazu kommt ein Aroma („Huhn Geschmack“, 18,1 mg/kg).</p>
<h2>Ein Snack mit Kalorien, wenig Fett</h2>
<p>Bei 16,5 % Feuchtigkeit entsprechen 7,5 % Protein und 1,3 % Fett rund 9 % Protein und 1,6 % Fett in der Trockensubstanz (eigene Berechnung). Der Rest ist überwiegend Stärke. 28 Sticks wiegen 720 g, ein Stick also gut 25 g und rund 77 kcal (eigene Berechnung aus 299 kcal/100 g). Für einen 10-kg-Hund ist das ein spürbarer Teil der Tagesration; Pedigree verweist nicht ausdrücklich darauf, die Hauptmahlzeit anzupassen. Calcium, Phosphor und Natrium sind nicht angegeben, obwohl das Phosphat ein Natrium-Phosphor-Salz ist.</p>
<h2>„Bis zu 80 %“: ein Bestwert ohne Fußnote</h2>
<p>Zahnstein-Aussagen sind bei Futtermitteln grundsätzlich erlaubt, wenn sie belegt sind. Ein Beleg existiert hier immerhin für die Richtung: Die VOHC führt „Dentastix Fresh PEDIGREE UK“ seit 2024 mit Siegel für Plaque und Zahnstein. Die Studie zu „bis zu 80 %“, zum „patentierten“ Eukalyptusöl und zur „Zahnfleischgesundheit“ nennt die deutsche Seite aber nicht. Auch „zusammen mit Tierärzten entwickelt“ bleibt ohne Namen. Wir stufen sechs Aussagen als fragwürdig ein, keine als unzulässig. Wer Händlerseiten danebenlegt, findet abweichende Zahlen: zooplus.de nennt 2,3 % Natriumtripolyphosphat und 1.365 mg Vitamin E je kg (${a(PED_ZP, "zooplus.de")}, Händlerangabe, abgerufen am ${D}). Welche Fassung im Regal liegt, verrät erst die Packung.</p>
<h2>Preis: Zahnpflege für ein Viertel Euro</h2>
<p>Fressnapf verlangt 6,99 € für 28 Sticks, das sind 9,71 €/kg und rund 0,25 € pro Tag (${a(PED_FN, "fressnapf.de")}, Stand ${D}). Für einen Kauartikel mit deklariertem Wirkstoff und Siegel ist das nach unserer Einschätzung günstig.</p>
${ZAHN}
<p><strong>Unser Gesamtergebnis: 50 von 100 Punkten</strong>, Ampel Rot nach unserem rezepturbasierten Bewertungsschema; über die Zahnpflegewirkung im Einzelfall sagt die Note nichts. <strong>Strenge Wertung:</strong> Jede fragwürdige Werbeaussage kostet einen Punkt bei der Deklaration, jede unzulässige drei; hier sind es 6 fragwürdige und 0 unzulässige Aussagen. Weitere Abzüge gibt es für Sammelbegriffe und unbenannte Zusatzstoffe. Der frische Atem ist mit 0,03 % Eukalyptus deklariert, die übrigen 99,97 % bleiben weitgehend Sammelbegriff.</p>
${FOOT}`,
    conclusionHtml: `<p>Dentastix Daily Fresh ist ein günstiger Zahnpflege-Stick mit deklariertem Wirkstoff und VOHC-Siegel für den britischen Artikel. Die Rezeptur bleibt nach unserer Einschätzung zu vage, und mehrere Werbeversprechen gehen über das öffentlich Belegte hinaus. Ein Stick am Tag kann das Putzen ergänzen, ersetzt es aber nicht.</p>`,
  },
  // 2) Purina DentaLife Daily Medium
  {
    ...BASE,
    brand: "Purina",
    slug: "purina-dentalife-daily-medium-test",
    title: "Purina DentaLife Daily Medium im Test: 57/100 Punkte",
    productName: "DentaLife Daily Medium (12–25 kg)",
    keyword: "Dentalife Hund",
    priceClass: "GUENSTIG" as const,
    pricePerKg: 9.54,
    packageSize: "Multipack 42 Sticks",
    price: 9.22,
    pricePerDay: 0.22 as number | null,
    image: "purina-dentalife-daily-medium-packshot-hersteller.webp",
    imageAlt: "Beutel Purina DentaLife Daily Oral Care Medium, 5 Sticks (Bild: Hersteller)",
    contentImage: "purina-dentalife-daily-medium-rueckseite-hersteller.webp",
    contentImageAlt: "Rückseite des Beutels Purina DentaLife Daily Medium mit Deklaration (Bild: Hersteller)",
    composition:
      "Getreide (60 % extrudiertes Maismehl, 5 % Weizenmehl), Glycerol, Mineralstoffe, Hefe, Fleisch und tierische Nebenerzeugnisse (1,2 %*), Öle und Fette. *Entspricht 4 % rehydrierten Fleisch und tierischen Nebenerzeugnissen (4 % Huhn). Zusatzstoffe je kg: Vitamin A 8.500 IE, Vitamin D3 570 IE, Vitamin E 60 IE; Calciumjodat, wasserfrei (I: 2,2 mg), Mangansulfat-Monohydrat (Mn: 12,5 mg), Zinksulfat-Monohydrat (Zn: 280 mg), Natriumselenit (Se: 0,31 mg). Antioxidantien.",
    analysis: [
      { name: "Rohprotein", value: 7 },
      { name: "Rohfett", value: 2.5 },
      { name: "Rohasche", value: 4.5 },
      { name: "Rohfaser", value: 0.7 },
      { name: "Feuchtigkeit", value: 14.5 },
      { name: "Calcium", value: 1.1 },
    ],
    scores: { scoreRaw: 11, scoreHarmful: 15, scoreNutrients: 10, scoreDeclaration: 9, scoreNeeds: 8, scoreValue: 4 },
    verdict:
      "Ein Maisstick mit nachvollziehbarer Hauptzutat und einem Zahnstein-Versprechen, das ein VOHC-Siegel (europäische Größen, 2017) deckt. Abzüge: 4 % Huhn, unbenannte Antioxidantien, kein Brennwert, abweichende Händlerangaben, drei fragwürdige Gesundheitsaussagen.",
    teaser: "Zahnstein-Aussage belegt, Rezeptur aus Mais. 57 Punkte.",
    pros: [
      "Zahnstein-Aussage durch VOHC-Siegel gedeckt (Purina DentaLife, European Sizes, 2017)",
      "Hauptzutat mit Menge benannt (60 % Maismehl, 5 % Weizenmehl), Huhn beziffert (4 %), fettarm (2,5 %)",
      "Günstig: rund 0,22 € pro Tag im Multipack (9,22 € für 42 Sticks, Fressnapf, Stand 16.10.2026)",
    ],
    cons: [
      "Zu zwei Dritteln Maismehl; tierischer Anteil nur 4 % Huhn (rehydriert)",
      "„Antioxidantien“ ohne Namen, kein Brennwert angegeben; Zink, Jod und Selen weichen auf Händlerseiten deutlich ab",
      "„Gesunder Kauartikel“, „für starke Zähne“, „neueste Innovation“ ohne Beleg",
    ],
    claims: [
      c("Wissenschaftlich erwiesen, Zahnsteinbildung zu reduzieren.", "ZULAESSIG", "VO (EG) 767/2009 Art. 13 Abs. 1", "Die VOHC führt „Purina DentaLife Daily Oral Care Dog Treats, European Sizes“ mit Siegel für Zahnstein (2017). Damit ist die Aussage für uns belegt; die Studie selbst nennt die Seite nicht."),
      c("GESUNDE INHALTSSTOFFE. … PURINA® DENTALIFE® ist ein gesunder Kauartikel für Ihren Hund.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "„Gesund“ ist ein pauschales Gesundheitsversprechen. Begründet wird es mit „ohne Zuckerzusatz, fettarm, aus Mais und Weizen“, was für sich keine gesundheitliche Wirkung belegt."),
      c("Vitamin D & Calcium für starke Zähne", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1", "Bei erwachsenen Hunden mit bedarfsdeckendem Alleinfutter ist ein Nutzen eines Snacks für „starke Zähne“ nicht belegt; einen Nachweis nennt die Seite nicht."),
      c("Die PURINA® DENTALIFE® Kauartikel … gelten als neueste Innovation für die Erhaltung der Mundgesundheit Ihres Hundes.", "FRAGWUERDIG", "UWG § 5", "Spitzenstellungs- und Neuheitsbehauptung ohne Bezug: Wer sie so einschätzt und seit wann, bleibt offen. Das Produkt ist seit Jahren am Markt."),
      c("Ohne Zuckerzusatz, fettarm", "ZULAESSIG", "VO (EG) 767/2009 Art. 11", "Zucker ist nicht in der Zusammensetzung; 2,5 % Rohfett sind niedrig."),
      c("… ohne Zusatz künstlicher Geschmacks- oder Farbstoffe.", "ZULAESSIG", "VO (EG) 767/2009 Art. 11", "In der Deklaration sind keine Aroma- oder Farbstoffe ausgewiesen."),
    ],
    metaTitle: "Purina DentaLife Daily Medium im Test: 57/100 Punkte",
    metaDescription: "Purina DentaLife Daily Medium im Test: Maismehl, 4 % Huhn, VOHC-Siegel gegen Zahnstein, Werbeaussagen und Preis pro Tag. 57 von 100 Punkten nach unserem Schema.",
    keywords: ["Dentalife Test", "Purina Dentalife Medium", "Zahnpflegesnack Hund", "Kauartikel Zahnstein Hund", "Dentalife Erfahrungen"],
    bodyHtml: `<p>„Wissenschaftlich erwiesen, Zahnsteinbildung zu reduzieren“: Mit diesem Satz bewirbt Purina den Kaustick <strong>DentaLife Daily Medium</strong> (${a(PUR, "purina.de")}, abgerufen am ${D}). Seltener Fall: Diesmal gibt es dazu ein öffentliches Siegel. Der Rest der Seite verdient einen zweiten Blick.</p>
${METHODE(a(PUR, "purina.de"))}
<h2>Ein Maisstick mit Hühnchen-Gruß</h2>
<p>Die Zusammensetzung nennt Getreide mit „60 % extrudiertem Maismehl“ und „5 % Weizenmehl“, danach Glycerol, Mineralstoffe, Hefe, „Fleisch und tierische Nebenerzeugnisse (1,2 %)“ sowie Öle und Fette. Das ist ehrlicher als manche Konkurrenz: Die Hauptzutat hat Namen und Menge. Das Huhn kommt rehydriert auf 4 %, getrocknet auf 1,2 %. Ein Stick ist also im Kern Maismehl in Form gebracht. Für einen Kauartikel, der mechanisch wirken soll, ist das erklärbar. Nach unserem rezepturbasierten Bewertungsschema ergibt das 11 von 30 Punkten.</p>
<h2>Das Siegel deckt den Zahnstein, nicht die Gesundheit</h2>
<p>Die VOHC listet „Purina DentaLife Daily Oral Care Dog Treats, European Sizes“ seit 2017 mit Siegel für Zahnstein (${a(VOHC, "vohc.org")}). Das Hauptversprechen ist damit belegt, das schreiben wir gern. Daneben stehen Sätze ohne Beleg: ein „gesunder Kauartikel“, „Vitamin D &amp; Calcium für starke Zähne“, „neueste Innovation“. Ein Stick mit 1,1 % Calcium macht aus einem erwachsenen Hund kein Zahnwunder. Wir stufen drei Aussagen als fragwürdig ein, keine als unzulässig.</p>
<h2>Nährwerte: wenig Fett, kein Brennwert</h2>
<p>Bei 14,5 % Feuchtigkeit entsprechen 7 % Protein rund 8 % in der Trockensubstanz (eigene Berechnung). Fett liegt bei 2,5 %, der Rest ist überwiegend Stärke. Wie viele Kalorien ein Stick hat, steht auf der Herstellerseite nicht. Für einen Snack, der täglich gegeben werden soll, fehlt damit die wichtigste Zahl zur Rationsplanung. Die „Antioxidantien“ in der Zusatzstoffliste tragen keinen Namen.</p>
<h2>Drei Seiten, drei Rezepturen?</h2>
<p>Purina nennt je kg 280 mg Zink, 2,2 mg Jod und 0,31 mg Selen. Zooplus führt für denselben Artikel 100 mg Zink, 1,4 mg Jod und 0,14 mg Selen sowie 1,1 % Huhn (${a(PUR_ZP, "zooplus.de")}, Händlerangabe, abgerufen am ${D}). Kleinigkeit am Rande: Der Seitentitel bei Purina lautet „DENTALIFE Medium für große Hunde“, die Fütterungsempfehlung gilt für 12 bis 25 kg. Verlässlich ist am Ende das Etikett auf der Packung, die man in der Hand hält.</p>
<h2>Preis: günstig im Multipack</h2>
<p>Fressnapf verlangt 9,22 € für 42 Sticks (9,54 €/kg), das sind rund 0,22 € pro Tag (${a(PUR_FN, "fressnapf.de")}, Stand ${D}; eigene Berechnung). Nach unserer Einschätzung ist das für einen Kauartikel mit belegter Zahnstein-Aussage günstig.</p>
${ZAHN}
<p><strong>Unser Gesamtergebnis: 57 von 100 Punkten</strong>, Ampel Rot nach unserem rezepturbasierten Bewertungsschema; über die Zahnpflegewirkung im Einzelfall sagt die Note nichts. <strong>Strenge Wertung:</strong> Jede fragwürdige Werbeaussage kostet einen Punkt bei der Deklaration, jede unzulässige drei; hier sind es 3 fragwürdige und 0 unzulässige Aussagen. Weitere Abzüge gibt es für die unbenannten Antioxidantien, den fehlenden Brennwert und die abweichenden Händlerangaben. Das Siegel gilt dem Zahnstein. Für „gesund“ gibt es keins.</p>
${FOOT}`,
    conclusionHtml: `<p>DentaLife hat, was vielen Zahnsnacks fehlt: ein öffentliches Siegel für die Kernaussage. Die Rezeptur ist schlicht Maismehl mit wenig Huhn, der Brennwert fehlt, und einige Gesundheitsversprechen gehen nach unserer Einschätzung zu weit. Als günstige Ergänzung zum Putzen taugt der Stick.</p>`,
  },
  // 3) Whimzees Zahnbürste M
  {
    ...BASE,
    brand: "Whimzees",
    slug: "whimzees-zahnbuerste-m-test",
    title: "Whimzees Zahnbürste M im Test: 55/100 Punkte",
    productName: "Toothbrush (Zahnbürste) Größe M",
    keyword: "Whimzees Zahnbürste",
    priceClass: "MITTEL" as const,
    pricePerKg: 25.53,
    packageSize: "360 g (12 Stück)",
    price: 9.19,
    pricePerDay: 0.77 as number | null,
    image: "whimzees-zahnbuerste-m-kauartikel-hersteller.webp",
    imageAlt: "Whimzees Toothbrush, Kauartikel in Zahnbürstenform (Bild: Hersteller)",
    contentImage: "whimzees-zahnbuerste-m-hund-hersteller.webp",
    contentImageAlt: "Australian Shepherd bekommt einen Whimzees Toothbrush M gereicht (Bild: Hersteller)",
    composition:
      "Kartoffelstärke, Glycerin, Zellulosepulver, Lecithin, Hefe, Malzextrakt, Süßlupinenmehl, Farbstoff Annatto-Extrakt, Alfalfa-Extrakt",
    analysis: [
      { name: "Rohprotein", value: 1.1 },
      { name: "Rohfett", value: 2 },
      { name: "Rohasche", value: 2.4 },
      { name: "Rohfaser", value: 7.2 },
      { name: "Feuchtigkeit", value: 12 },
    ],
    scores: { scoreRaw: 13, scoreHarmful: 17, scoreNutrients: 8, scoreDeclaration: 7, scoreNeeds: 8, scoreValue: 2 },
    verdict:
      "Vegetarischer Kauartikel aus Kartoffelstärke mit vollständig einzeln benannten Zutaten und VOHC-Siegel (Plaque, Zahnstein). Abzüge: kaum Protein, sechs fragwürdige Werbeaussagen (u. a. „hält den Tierzahnarzt fern“, „reich an Vitaminen“, „getreidefrei“ trotz Malzextrakt), abweichende Deklarationen, hoher Preis.",
    teaser: "Ehrliche Zutatenliste, kühne Werbung. 55 Punkte.",
    pros: [
      "Alle Zutaten einzeln benannt, keine Sammelbegriffe; ohne Fleisch und ohne Konservierungsstoffe",
      "VOHC-Siegel für Plaque und Zahnstein („Wellness Whimzees Toothbrush Dental Dog Treats, all sizes“, 2019)",
      "Kaloriengehalt je Größe angegeben (M: 87 kcal), Mindestalter (9 Monate) und Mindestgewicht genannt",
    ],
    cons: [
      "„Hält den Tierzahnarzt fern“, „reich an Vitaminen und Antioxidantien“ und „hypoallergen“ ohne Beleg; Vitamine sind nicht deklariert",
      "„Getreidefrei“ trotz Malzextrakt, dessen Herkunft nicht angegeben ist",
      "Hersteller und Händler nennen abweichende Zutaten (Annatto vs. Paprika, Sojalecithin, Calciumcarbonat); rund 0,77 € pro Tag",
    ],
    claims: [
      c("Die Rillen und Erhöhungen auf unserem täglichen Zahnpflege-Kausnack tragen dazu bei, Plaque und Zahnstein effektiver denn je zu beseitigen.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1; UWG § 5", "Die VOHC-Anerkennung (2019) belegt eine Verringerung von Plaque und Zahnstein. „Effektiver denn je“ ist ein Vergleich ohne Bezugsgröße, „beseitigen“ geht über „verringern“ hinaus."),
      c("Eine Zahnbürste zum Kauen pro Tag hält den Tierzahnarzt fern", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 3; UWG § 5", "Der Satz legt nahe, der Snack mache Kontrollen oder Behandlungen in der Tierarztpraxis entbehrlich. Dafür gibt es keinen Beleg."),
      c("Fettarm und reich an Vitaminen und Antioxidantien …", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1", "Fettarm trifft zu (2 %). Vitamine oder Antioxidantien sind in Zusammensetzung und Zusatzstoffen nicht deklariert."),
      c("… sowie Ballaststoffen zur Förderung einer regelmäßigen und gesunden Verdauung.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1", "7,2 % Rohfaser sind deklariert. Dass ein 30-g-Snack die Verdauung messbar fördert, ist nicht belegt."),
      c("Hypoallergen", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11; VO (EU) 2020/354", "Der Begriff ist für Futtermittel nicht definiert und suggeriert eine Eignung bei Allergien. Süßlupine ist ein bekanntes Allergen; Händler nennen zusätzlich Sojalecithin."),
      c("Getreidefreie Rezeptur", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1", "Malzextrakt wird üblicherweise aus Getreide (meist Gerste) gewonnen. Die Herkunft ist nicht angegeben; ohne sie ist „getreidefrei“ nicht nachprüfbar."),
      c("Ohne künstliche Zutaten, Farb-, Aroma- oder Konservierungsstoffe, ohne Gentechnik, Gluten oder Fleisch.", "ZULAESSIG", "VO (EG) 767/2009 Art. 11", "Passt zur Zutatenliste: Annatto- und Alfalfa-Extrakt sind natürliche Farbgeber, Konservierungsstoffe und Fleisch fehlen. Glutenfreiheit setzen wir mangels Gegenangabe voraus."),
    ],
    metaTitle: "Whimzees Zahnbürste M im Test: 55/100 Punkte",
    metaDescription: "Whimzees Toothbrush (Zahnbürste) M im Test: vegetarischer Kauartikel aus Kartoffelstärke, VOHC-Siegel, Werbeaussagen und Preis pro Tag. 55 von 100 Punkten nach unserem Schema.",
    keywords: ["Whimzees Zahnbürste Test", "Whimzees Toothbrush", "vegetarischer Kauartikel Hund", "Zahnpflegesnack Hund ohne Fleisch", "Whimzees Erfahrungen"],
    bodyHtml: `<p>„Eine Zahnbürste zum Kauen pro Tag hält den Tierzahnarzt fern“, verspricht Whimzees für seinen Kausnack <strong>Toothbrush</strong> (${a(WHZ, "whimzees.eu")}, abgerufen am ${D}). Das Stück sieht tatsächlich aus wie eine Zahnbürste, nur ohne Borsten. Ob der Satz hält, was die Form verspricht, haben wir anhand der Deklaration geprüft.</p>
${METHODE(a(WHZ, "whimzees.eu"))}
<h2>Eine Zutatenliste ohne Nebel</h2>
<p>Kartoffelstärke, Glycerin, Zellulosepulver, Lecithin, Hefe, Malzextrakt, Süßlupinenmehl, Annatto- und Alfalfa-Extrakt: Jede Zutat hat einen Namen. Keine „pflanzlichen Nebenerzeugnisse“, kein „Fleisch und tierische Nebenerzeugnisse“. Das verdient ein ausdrückliches Lob. Mengen fehlen allerdings. Und was dort steht, ist im Kern Stärke mit Feuchthaltemittel und Faser. Ein Zahnpflegeartikel, kein Nahrungsmittel. Nach unserem rezepturbasierten Bewertungsschema ergibt das 13 von 30 Punkten.</p>
<h2>Kaum Protein, dafür Kalorien</h2>
<p>1,1 % Rohprotein, 2 % Fett, 7,2 % Rohfaser, 12 % Feuchtigkeit. Ernährungsphysiologisch liefert der Snack also vor allem Energie aus Stärke. Whimzees nennt sie vorbildlich je Größe: 87 kcal für ein M-Stück. Bei 360 g für 12 Stück wiegt eines rund 30 g, das sind knapp 290 kcal je 100 g (eigene Berechnung). „Reich an Vitaminen und Antioxidantien“ steht auf derselben Seite. Deklariert ist davon nichts. Lob, wo es hingehört: Konservierungsstoffe fehlen, die Farbe stammt aus Pflanzenextrakten.</p>
<h2>Das Siegel stimmt, die Werbung übertreibt</h2>
<p>Die VOHC führt „Wellness Whimzees Toothbrush Dental Dog Treats, all sizes“ seit 2019 mit Siegel für Plaque und Zahnstein (${a(VOHC, "vohc.org")}). Die Grundaussage ist damit belegt. Die Werbung legt trotzdem nach: Plaque und Zahnstein würden „effektiver denn je“ „beseitigt“, und der Tierzahnarzt bleibe fern. Das halten wir für überzogen. „Hypoallergen“ ist für Futtermittel nicht definiert, und Süßlupine ist ein bekanntes Allergen. „Getreidefrei“ steht neben Malzextrakt, der üblicherweise aus Gerste gewonnen wird; die Herkunft nennt Whimzees nicht. Wir stufen sechs Aussagen als fragwürdig ein, keine als unzulässig.</p>
<h2>Eine Zahnbürste, mehrere Etiketten</h2>
<p>Fressnapf listet für die Größe M Calciumcarbonat, Paprikaextrakt (0,25 %) und Sojalecithin (30,2 g/kg) statt Annatto (${a(WHZ_FN, "fressnapf.de")}, Händlerangabe, abgerufen am ${D}). Andere Händler nennen abweichende Fettwerte. Möglich sind verschiedene Rezepturstände. Wer Soja oder Lupine meiden muss, sollte die Packung lesen, bevor der Hund kaut.</p>
<h2>Preis: Zahnpflege mit Aufpreis</h2>
<p>9,19 € für 12 Stück bei Fressnapf ergeben 25,53 €/kg und rund 0,77 € pro Tag (${a(WHZ_FN, "fressnapf.de")}, Stand ${D}; eigene Berechnung). Das ist gut das Dreifache eines Dentastix-Sticks.</p>
${ZAHN}
<p><strong>Unser Gesamtergebnis: 55 von 100 Punkten</strong>, Ampel Rot nach unserem rezepturbasierten Bewertungsschema; über die Zahnpflegewirkung im Einzelfall sagt die Note nichts. <strong>Strenge Wertung:</strong> Jede fragwürdige Werbeaussage kostet einen Punkt bei der Deklaration, jede unzulässige drei; hier sind es 6 fragwürdige und 0 unzulässige Aussagen. Weitere Abzüge gibt es für die abweichenden Deklarationen und den Preis. Die Zahnbürste ist ehrlich gebaut. Den Tierzahnarzt hält sie nach unserer Einschätzung trotzdem nicht fern.</p>
${FOOT}`,
    conclusionHtml: `<p>Whimzees deklariert offener als die meisten Konkurrenten und hat ein Siegel für Plaque und Zahnstein. Die Werbung verspricht nach unserer Einschätzung mehr, als Zutatenliste und Siegel tragen, und der Snack ist teuer. Für Hunde, die kein Fleisch vertragen, kann er eine Option sein, wenn Lupine und Soja kein Problem sind.</p>`,
  },
  // 4) Greenies Original Regular
  {
    ...BASE,
    brand: "Greenies",
    slug: "greenies-original-regular-test",
    title: "Greenies Original Regular im Test: 54/100 Punkte",
    productName: "Original Regular (Medium, 12–22 kg)",
    keyword: "Greenies Hund",
    priceClass: "PREMIUM" as const,
    pricePerKg: 34.65,
    packageSize: "170 g (6 Stück)",
    price: 5.89,
    pricePerDay: 0.98 as number | null,
    image: "greenies-original-regular-packshot-hersteller.webp",
    imageAlt: "Beutel Greenies Original Dental Treats Medium 12–22 kg, 6 Stück (Bild: Hersteller)",
    contentImage: "greenies-original-regular-deklaration-hersteller.webp",
    contentImageAlt: "Greenies Zahnpflege-Snack mit deutscher Zusammensetzung und analytischen Bestandteilen (Bild: Hersteller)",
    composition:
      "Getreide (u.a. Weizenmehl 4 %*), pflanzliche Nebenerzeugnisse (u.a. Kurkumaextrakt 0,1 %*), Fleisch und tierische Nebenerzeugnisse, Mineralstoffe, Hefen, Früchte (u.a. Saft aus getrockneter Wassermelone* 0,16 %, entspricht Wassermelonensaft 1,3 %, und Saft aus getrockneter Jenipapo* 0,02 %, entspricht Jenipaposaft 0,16 %), Zucker, Öle und Fette. *Natürliche Zutaten. Zusatzstoffe je kg: Vitamin A 8.950 IE, Vitamin D3 1.510 IE, Kupfer 14,3 mg, Jod 2,2 mg, Eisen 132 mg, Mangan 19,0 mg, Zink 143 mg.",
    analysis: [
      { name: "Rohprotein", value: 34 },
      { name: "Rohfett", value: 6 },
      { name: "Rohasche", value: 6 },
      { name: "Rohfaser", value: 4 },
    ],
    scores: { scoreRaw: 11, scoreHarmful: 13, scoreNutrients: 12, scoreDeclaration: 9, scoreNeeds: 8, scoreValue: 1 },
    verdict:
      "Der Klassiker mit dem ältesten VOHC-Siegel der Kauartikel (Plaque, Zahnstein, 2007) und hohem Proteingehalt. Abzüge: Sammelbegriffe, zugesetzter Zucker ohne Menge, keine Feuchtigkeitsangabe, zwei fragwürdige Werbeaussagen und ein hoher Preis von knapp 1 € pro Tag.",
    teaser: "Siegel seit 2007, Zucker inklusive, teuer. 54 Punkte.",
    pros: [
      "VOHC-Siegel für Plaque und Zahnstein (Canine Greenies, fünf Größen, seit 2007)",
      "Hoher Proteingehalt (34 %); Energie angegeben (319 kcal/100 g), Mindestalter und Gewichtsklasse genannt",
      "Hinweise zur Sicherheit: passende Größe wählen, Hund beim Kauen beobachten, Packung innerhalb von 4 Wochen verbrauchen",
    ],
    cons: [
      "Sammelbegriffe; Proteinquelle nicht erkennbar; „Zucker“ als Zutat ohne Mengenangabe",
      "Feuchtigkeit nicht deklariert; „von Tierärzten weiterentwickelt“ und „frischer Atem“ ohne Beleg",
      "Teuer: 5,89 € für 6 Stück, knapp 1 € pro Tag (34,65 €/kg)",
    ],
    claims: [
      c("Helps reduce plaque & tartar build up (Packung)", "ZULAESSIG", "VO (EG) 767/2009 Art. 13 Abs. 1; FEDIAF 5.2.5.4", "Die VOHC führt Canine Greenies in fünf Größen seit 2007 mit Siegel für Plaque und Zahnstein. Die Aussage ist damit belegt."),
      c("Inzwischen wurde das ursprüngliche Rezept … von Tierärzten weiterentwickelt, um die ultimative Zusammensetzung für gesunde und gleichzeitig wirksame Zahnpflege Kausnacks zu finden.", "FRAGWUERDIG", "UWG § 5; FEDIAF-Kodex", "Wer beteiligt war, bleibt offen; „ultimative Zusammensetzung“ ist eine Spitzenstellungsbehauptung ohne Bezug. Auf der Packung steht dazu „Developed with Vets“."),
      c("… designed to help keep your dog's teeth clean and promote fresh breath.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1", "Saubere Zähne deckt das Siegel ab. Für frischen Atem nennt der Hersteller keinen Beleg."),
      c("Made with Natural Ingredients* (Packung)", "ZULAESSIG", "VO (EG) 767/2009 Art. 11; FEDIAF-Kodex", "Das Sternchen ist aufgelöst: In der Zusammensetzung sind die natürlichen Zutaten markiert. Vitamine und Spurenelemente sind als Zusatzstoffe getrennt ausgewiesen."),
    ],
    metaTitle: "Greenies Original Regular im Test: 54/100 Punkte",
    metaDescription: "Greenies Original Regular (Medium) im Test: VOHC-Siegel, 34 % Protein, Zucker in der Rezeptur, Werbeaussagen und Preis pro Tag. 54 von 100 Punkten nach unserem Schema.",
    keywords: ["Greenies Test", "Greenies Original Regular", "Greenies Zahnpflege", "Zahnpflegesnack Hund", "Greenies Erfahrungen"],
    bodyHtml: `<p>„Ein bisschen Mundgeruch und viel Liebe … das war der Anfang von GREENIES“, erzählt Mars im eigenen Shop über den grünen Zahnbürsten-Knochen <strong>Greenies Original Regular</strong> (${a(GRN, "jameswellbeloved.de")}, abgerufen am ${D}). Aus der Liebe ist inzwischen ein Siegel geworden, aus dem Mundgeruch ein Werbeversprechen. Wir haben beides geprüft.</p>
${METHODE(`${a(GRN, "jameswellbeloved.de")} (Shop der Mars-Marke Wellbeloved) und ${a(GRN_UK, "greenies.co.uk")}`)}
<h2>Viel Protein, wenig Auskunft</h2>
<p>Die Zusammensetzung beginnt mit „Getreide (u.a. Weizenmehl 4 %)“, danach pflanzliche Nebenerzeugnisse, Fleisch und tierische Nebenerzeugnisse, Mineralstoffe, Hefen, Früchte, Zucker sowie Öle und Fette. 34 % Rohprotein sind für einen Kausnack ungewöhnlich viel. Woher sie kommen, verrät die Liste nicht. Die US-Fassung nennt Weizengluten und Gelatine, die deutsche schweigt dazu. Wassermelonen- und Jenipaposaft sind beziffert, in Mengen unter 0,2 %. Nach unserem rezepturbasierten Bewertungsschema ergibt das 11 von 30 Punkten.</p>
<h2>Zucker steht drin, nur nicht wie viel</h2>
<p>„Zucker“ ist als Zutat deklariert, ohne Menge. Für einen Snack, der täglich ins Maul soll, halten wir das für einen klaren Minuspunkt. Kurkumaextrakt (0,1 %) und Fruchtsäfte färben, sie sind als Zutat benannt. Vitamine und Spurenelemente sind mit Mengen und Verbindungen angegeben, das ist sorgfältig. Die Feuchtigkeit fehlt in der deutschen Deklaration, damit ist keine Umrechnung auf Trockensubstanz möglich.</p>
<h2>Ein Siegel seit 2007</h2>
<p>Die VOHC führt „Canine Greenies“ in fünf Größen seit 2007 mit Siegel für Plaque und Zahnstein (${a(VOHC, "vohc.org")}). Die Kernaussage „hilft, Plaque und Zahnstein zu reduzieren“ ist damit belegt, das sagen wir gern. Für „frischen Atem“ gibt es kein Siegel und keinen genannten Beleg. Auch „von Tierärzten weiterentwickelt“ zur „ultimativen Zusammensetzung“ bleibt ohne Namen. Wir stufen zwei Aussagen als fragwürdig ein, keine als unzulässig. Das Bild zeigt die britische Packung; die deutsche Deklaration stammt aus dem Mars-Shop.</p>
<h2>90 Kalorien pro Knochen</h2>
<p>6 Stück wiegen 170 g, ein Knochen also gut 28 g und rund 90 kcal (eigene Berechnung aus 319 kcal/100 g). Für einen 15-kg-Hund sind das grob zehn Prozent des Tagesbedarfs (eigene Schätzung). Die Hauptmahlzeit sollte entsprechend kleiner werden. Lob für die Sicherheitshinweise: passende Größe wählen, beim Kauen beobachten, nicht für Welpen unter sechs Monaten.</p>
<h2>Preis: das Siegel kostet</h2>
<p>5,89 € für 6 Stück ergeben 34,65 €/kg und knapp 1 € pro Tag (${a(GRN, "jameswellbeloved.de")}, Stand ${D}, zum Abrufzeitpunkt ausverkauft; eigene Berechnung). Das ist rund das Vierfache eines Dentastix-Sticks.</p>
${ZAHN}
<p><strong>Unser Gesamtergebnis: 54 von 100 Punkten</strong>, Ampel Rot nach unserem rezepturbasierten Bewertungsschema; über die Zahnpflegewirkung im Einzelfall sagt die Note nichts. <strong>Strenge Wertung:</strong> Jede fragwürdige Werbeaussage kostet einen Punkt bei der Deklaration, jede unzulässige drei; hier sind es 2 fragwürdige und 0 unzulässige Aussagen. Weitere Abzüge gibt es für Sammelbegriffe, den Zucker ohne Menge, die fehlende Feuchtigkeitsangabe und den Preis. Die Geschichte begann mit Mundgeruch. Belegt ist bis heute der Zahnstein.</p>
${FOOT}`,
    conclusionHtml: `<p>Greenies hat eines der ältesten Siegel für Plaque und Zahnstein und viel Protein. Dagegen stehen nach unserer Einschätzung eine vage Rezeptur mit Zucker, fehlende Feuchtigkeitsangabe und ein hoher Preis. Wer das Siegel will, bekommt es, zahlt dafür aber fast einen Euro am Tag.</p>`,
  },
  // 5) Happy Dog Care Snack Calm & Relax
  {
    ...BASE,
    brand: "Happy Dog",
    slug: "happy-dog-care-snack-calm-relax-test",
    title: "Happy Dog Care Snack Calm & Relax im Test: 66/100 Punkte",
    productName: "Care Snack Calm & Relax",
    keyword: "Beruhigungssnack Hund",
    priceClass: "PREMIUM" as const,
    pricePerKg: 37.9,
    packageSize: "100 g Soft-Drops",
    price: 3.79,
    pricePerDay: null as number | null,
    image: "happy-dog-care-snack-calm-relax-packshot-hersteller.webp",
    imageAlt: "Beutel Happy Dog Care Snack Calm & Relax, 100 g (Bild: Hersteller)",
    contentImage: "happy-dog-care-snack-calm-relax-rueckseite-hersteller.webp",
    contentImageAlt: "Rückseite des Beutels Happy Dog Care Snack Calm & Relax mit Deklaration (Bild: Hersteller)",
    composition:
      "Pflanzliche Nebenerzeugnisse* (u.a. 2 % Hanfmehl), Kartoffel*, Entenprotein*, hydrolisiertes Milchprotein* (3 %), Sonnenblumenöl, hydrolisiertes Protein*, Magnesiumoxid (0,4 %), Natriumchlorid, Hefe* (extrahiert). *getrocknet. Zusatzstoffe je kg: Vitamin D3 (3a671) 620 I.E., Vitamin E (3a700i) 490 mg; Eisen (3b103) 50 mg, Kupfer (3b405) 10 mg, Zink (3b603) 60 mg, Mangan (3b502) 11 mg, Jod (3b202) 1,2 mg, Selen (3b801) 0,2 mg; DL-Methionin (3c301) 2.400 mg, L-Tryptophan (3c440) 5.000 mg; Antioxidationsmittel: Tocopherol-Extrakte aus pflanzlichen Ölen 1b306(i).",
    analysis: [
      { name: "Rohprotein", value: 17.5 },
      { name: "Rohfett", value: 4.5 },
      { name: "Rohasche", value: 7.5 },
      { name: "Rohfaser", value: 2.5 },
      { name: "Magnesium", value: 0.3 },
    ],
    scores: { scoreRaw: 18, scoreHarmful: 18, scoreNutrients: 12, scoreDeclaration: 10, scoreNeeds: 6, scoreValue: 2 },
    verdict:
      "Sauber deklarierter Funktionssnack mit Ente, Kartoffel, Hanfmehl, L-Tryptophan und Magnesium; alle Zusatzstoffe mit Kennnummer und Menge, Antioxidans natürlich. Abzüge: Beruhigungswirkung für Gewitter, Silvester und Tierarzt ohne Beleg, Sammelbegriff am Listenanfang, kein Stückgewicht, hoher Kilopreis.",
    teaser: "Vorbildliche Zusatzstoffliste, unbelegte Ruhe. 66 Punkte.",
    pros: [
      "Alle Zusatzstoffe mit Kennnummer und Menge, darunter L-Tryptophan (5.000 mg/kg) und Magnesium (0,3 %); natürliches Antioxidans (Tocopherole)",
      "Tierisches Protein benannt (Ente, hydrolysiertes Milchprotein 3 %); ohne Zuckerzusatz, ohne künstliche Aroma-, Farb- und Konservierungsstoffe",
      "Dosierung nach Körpergewicht (2 Drops je 5 kg) und klarer Hinweis „für ausgewachsene Hunde“",
    ],
    cons: [
      "Beruhigende Wirkung „bei Gewittern, an Silvester oder bei einem anstehenden Tierarztbesuch“ ohne Beleg",
      "„Pflanzliche Nebenerzeugnisse“ als Sammelbegriff an erster Stelle; „getreidefrei“ damit nicht nachprüfbar",
      "Kein Stückgewicht, keine Feuchte, kein Brennwert; 37,90 €/kg (UVP 3,79 € je 100 g)",
    ],
    claims: [
      c("Die getreidefreie Rezeptur … mit wertvollem Hanf, L-Tryptophan und Magnesium sorgt für kleine Wohlfühlmomente in herausfordernden Situationen, wie z.B. bei Gewittern, an Silvester oder bei einem anstehenden Tierarztbesuch.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1, Art. 13 Abs. 1; LG Düsseldorf 37 O 54/23", "Die Aussage verspricht eine beruhigende Wirkung in konkreten Stresssituationen. Einen Wirkungsnachweis für das Produkt nennt Happy Dog nicht. Das LG Düsseldorf hat Anti-Stress-Aussagen ohne wissenschaftliche Absicherung als irreführend eingestuft."),
      c("Getreidefreie Rezeptur", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1", "An erster Stelle stehen „pflanzliche Nebenerzeugnisse“ als Sammelbegriff. Ob darin Getreide-Nebenerzeugnisse stecken, lässt sich der Deklaration nicht entnehmen."),
      c("Die weichen Drops dieses funktionellen Hundesnacks sind einfach in der Handhabung und perfekt zu dosieren.", "FRAGWUERDIG", "UWG § 5", "Dosiert wird nach Stück (2 Drops je 5 kg); das Gewicht eines Drops ist nicht angegeben. Wie viel L-Tryptophan ein Hund pro Tag erhält, lässt sich daher nicht berechnen."),
      c("Für sensible Hunde", "ZULAESSIG", "VO (EG) 767/2009 Art. 11", "Allgemeine Zielgruppenangabe ohne Krankheitsbezug."),
      c("Mit Hanf, L-Tryptophan & Magnesium", "ZULAESSIG", "VO (EG) 767/2009 Art. 17", "Alle drei Bestandteile sind deklariert, Hanfmehl (2 %), L-Tryptophan (5.000 mg/kg) und Magnesiumoxid (0,4 %) mit Mengen."),
      c("Hergestellt in Deutschland mit einer Rezeptur ohne den Zusatz von Zucker und ohne künstliche Aroma-, Farb- und Konservierungsstoffe.", "ZULAESSIG", "VO (EG) 767/2009 Art. 11", "Passt zur Deklaration: Zucker, Aroma- und Farbstoffe fehlen; als Antioxidans dienen Tocopherol-Extrakte."),
    ],
    metaTitle: "Happy Dog Care Snack Calm & Relax im Test: 66/100 Punkte",
    metaDescription: "Happy Dog Care Snack Calm & Relax im Test: Hanf, L-Tryptophan, Magnesium, Werbeaussagen zur Beruhigung und Kilopreis. 66 von 100 Punkten nach unserem Schema.",
    keywords: ["Happy Dog Calm & Relax Test", "Beruhigungssnack Hund", "L-Tryptophan Hund", "Silvester Hund Snack", "Happy Dog Care Snack"],
    bodyHtml: `<p>Gewitter, Silvester, Tierarzt: Für genau diese Momente verspricht Happy Dog mit dem <strong>Care Snack Calm &amp; Relax</strong> „kleine Wohlfühlmomente“ (${a(HD, "happydog.de")}, abgerufen am ${D}). Im Beutel stecken weiche Drops mit Hanf, L-Tryptophan und Magnesium. Wir haben geprüft, was davon deklariert und was davon belegt ist.</p>
${METHODE(a(HD, "happydog.de"))}
<h2>Die Zusatzstoffliste ist ein Vorbild</h2>
<p>Jeder Zusatzstoff steht mit Kennnummer und Menge da: Vitamin D3 und E, sechs Spurenelemente, DL-Methionin (2.400 mg/kg) und L-Tryptophan (5.000 mg/kg). Als Antioxidans dienen Tocopherol-Extrakte aus pflanzlichen Ölen. So sieht eine Deklaration aus, mit der man rechnen kann. Ein Gramm Drops enthält demnach 5 mg L-Tryptophan und 3 mg Magnesium (eigene Berechnung). Das ist ausdrücklich zu loben.</p>
<h2>Vorne ein Sammelbegriff, dahinter Ente</h2>
<p>An erster Stelle stehen „pflanzliche Nebenerzeugnisse“, darin 2 % Hanfmehl. Was der Rest ist? Nicht deklariert. Danach folgen Kartoffel, Entenprotein, 3 % hydrolysiertes Milchprotein, Sonnenblumenöl und ein weiteres „hydrolisiertes Protein“ ohne Herkunft. Tierisches Protein ist damit benannt, wenn auch ohne Menge. 17,5 % Rohprotein sind für einen Snack ordentlich. Nach unserem rezepturbasierten Bewertungsschema ergibt das 18 von 30 Punkten. „Getreidefrei“ steht auf der Seite. Mit einem Sammelbegriff an der Spitze lässt sich das aber nicht nachprüfen.</p>
<h2>Ruhe auf Rezept? Nicht deklariert</h2>
<p>Happy Dog nennt konkrete Stresssituationen und verspricht dafür Wohlbefinden. Einen Wirkungsnachweis für das Produkt nennt die Seite nicht. Das LG Düsseldorf hat Anti-Stress-Aussagen für Ergänzungsfutter ohne wissenschaftliche Absicherung als irreführend eingestuft (${a(LGD, "Urteil 37 O 54/23")}). Die Zutaten sind deklariert, die Wirkung ist es nicht. Wir stufen drei Aussagen als fragwürdig ein, keine als unzulässig. Wer einen Hund mit starker Geräuschangst hat, sollte das vor Silvester in der Tierarztpraxis besprechen; ein Snack ersetzt kein Training und keine Behandlung.</p>
<h2>Dosieren nach Stück, ohne Stückgewicht</h2>
<p>Empfohlen sind 2 Drops je 5 kg Körpergewicht, für einen 20-kg-Hund also 8 Drops. Wie viel ein Drop wiegt, steht nirgends. Damit lässt sich weder die Tagesmenge an L-Tryptophan berechnen noch der Preis pro Tag. „Perfekt zu dosieren“ heißt es trotzdem. Feuchtigkeit und Brennwert fehlen ebenfalls.</p>
<h2>Preis: Wohlbefinden zum Kilopreis</h2>
<p>Die UVP liegt bei 3,79 € für 100 g, das sind 37,90 €/kg (${a(HD, "happydog.de")}, Stand ${D}; zum Abrufzeitpunkt im Angebot für 1,89 €). Ohne Stückgewicht können wir die Tageskosten nicht seriös angeben.</p>
<p><strong>Unser Gesamtergebnis: 66 von 100 Punkten</strong>, Ampel Gelb nach unserem rezepturbasierten Bewertungsschema; über die Wirkung im Einzelfall sagt die Note nichts. <strong>Strenge Wertung:</strong> Jede fragwürdige Werbeaussage kostet einen Punkt bei der Deklaration, jede unzulässige drei; hier sind es 3 fragwürdige und 0 unzulässige Aussagen. Weitere Abzüge gibt es für fehlendes Stückgewicht, fehlende Feuchte und den Kilopreis. Die Zusatzstoffe sind auf das Milligramm genau angegeben, die Ruhe nicht.</p>
${FOOT}`,
    conclusionHtml: `<p>Calm &amp; Relax ist sauberer deklariert als die meisten Funktionssnacks: Zusatzstoffe mit Menge, natürliches Antioxidans, benannte tierische Zutaten. Die versprochene Ruhe in Stressmomenten ist nach unserer Einschätzung nicht belegt, und ohne Stückgewicht bleibt die Dosis unklar. Als Belohnung für ausgewachsene Hunde in Ordnung; bei echter Angst ist die Tierarztpraxis gefragt.</p>`,
  },
];
