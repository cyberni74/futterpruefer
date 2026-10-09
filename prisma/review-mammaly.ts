/** Vier Tests der Marke mammaly (Okt. 2026). Der Seed legt sie nur an, wenn der Slug fehlt; Änderungen im Admin bleiben erhalten. Bewertung ausschließlich anhand veröffentlichter Herstellerangaben (Produktseiten, abgerufen am 09.10.2026). */
const SRC = "Produktseite mammaly.de, abgerufen am 09.10.2026";
const a = (u: string, l: string) => `<a href="${u}">${l}</a>`;

const KOSTEN = (p: string, tag: string) => `<h2>Preis pro Tag, Abo und Garantie</h2>
<p>Die 350-g-Dose (rund 120 Snacks) kostet im Einmalkauf 49,99 €, das sind 142,83 € pro Kilogramm; im Spar-Abo (20 % Rabatt) 39,99 €, also 114,26 € pro Kilogramm. Bei der Fütterungsempfehlung (bis 10 kg 2 Snacks, 10 bis 25 kg 4 Snacks, ab 25 kg 8 Snacks am Tag) reicht eine Dose für einen 20-kg-Hund etwa 30 Tage. Das sind rund 1,67 € am Tag im Einmalkauf und 1,33 € im Abo (eigene Berechnung). Für einen Hund über 25 kg verdoppelt sich das auf bis zu 3,33 € am Tag. ${p}</p>
<p>Auf den mammaly-Seiten stehen mehrere Angaben, die einander widersprechen. Das gilt es vor einem Kauf zu wissen:</p>
<ul>
<li><strong>Abo-Rabatt:</strong> „20% Rabatt“ auf der Produktseite, „bis zu 25%“ im Abschnitt „Warum ein Spar-Abo?“ und „dauerhaft 25% Rabatt“ auf der ${a("https://www.mammaly.de/pages/spar-abo", "Spar-Abo-Seite")}.</li>
<li><strong>Kostenloser Versand:</strong> Die ${a("https://www.mammaly.de/pages/versand", "Versandseite")} nennt in der Tabelle „Ab 59,00€“, im Seitentitel aber „ab 49€“. Im Abo ist der Versand laut Produktseite gratis, im Einmalkauf kostet er 5,90 €.</li>
<li><strong>Geld-zurück-Garantie:</strong> Die Produktseite spricht von „90 Tage“, die AGB (Ziffer 4.3) von einer „30 Tage Geld-ZurückGarantie“. Die Garantie gilt laut Produktseite „pro Artikel nur einmal“, Rückgaben nur bei Kauf direkt auf mammaly.de. Das gesetzliche Widerrufsrecht beträgt 14 Tage; für versiegelte Ware, deren Versiegelung entfernt wurde, ist es aus Gründen des Gesundheitsschutzes ausgeschlossen (AGB 4.4.2).</li>
<li><strong>Kündigung:</strong> „Keine Mindestlaufzeit - jederzeit Lieferdatum ändern, pausieren oder kündigen.“ Mit der Kündigung entfallen die Abo-Vorteile.</li>
</ul>
<p>Erfahrungsberichte zum Bestellvorgang sind uneinheitlich. Auf ${a("https://www.trustedshops.de/bewertung/mammaly-de", "Trusted Shops")} (Profil laut Seite nicht vom Unternehmen beansprucht, am 09.10.2026 nur zwei Einzelbewertungen sichtbar) schreibt ein Nutzer am 13.08.2026: „Wie andere angemerkt haben, ist die default Bestellung ein Abo, man muss etwas aufpassen, wenn man einmalig bestellen will.“ Ein weiterer Beitrag vom 25.04.2026 nennt das Bestellverfahren „Absolut unseriös“. Das sind Erfahrungen einzelner Nutzer, keine Feststellung. Wie die Auswahl „Spar-Abo“ oder „Einmalkauf“ auf der Produktseite voreingestellt ist, haben wir nicht im Browser geprüft. Behördliche oder gerichtliche Verfahren gegen mammaly haben wir bei unserer Suche nicht gefunden; das ist keine Garantie, dass es keine gibt.</p>`;

const METHODE = `<h2>Wie wir getestet haben</h2>
<p>Wir haben das Produkt nicht im Labor analysiert und nicht an Hunden erprobt. Grundlage sind die Angaben von mammaly (${SRC}), die wir nach unserem 100-Punkte-Schema und nach den Regeln der Futtermittelkennzeichnung (VO (EG) 767/2009) und des Wettbewerbsrechts (UWG) prüfen. Die Einstufung der Werbeaussagen ist unsere begründete Einschätzung und keine rechtsverbindliche Feststellung. Mammaly ist die Marke der Peturo GmbH in Berlin (Impressum: Geschäftsführer Stanislav Nazarenus, Amtsgericht Charlottenburg, HRB 256286 B). Bilder in diesem Test sind neutrale Illustrationen, keine Herstellerfotos.</p>`;

const STUDIEN = (t: string) => `<h2>Was die Studien belegen, und was nicht</h2>
<p>${t}</p>`;

const FOOT = `<p><em>Hinweis:</em> Alle Zitate stammen von der Produktseite des Herstellers (Stand 09.10.2026). Preise und Texte können sich ändern. Eine unabhängige Prüfung durch Stiftung Warentest, Öko-Test oder eine Verbraucherzentrale haben wir für mammaly-Produkte nicht gefunden; die Seite nennt eine DLG-Auszeichnung („DLG-prämierte Qualität“), deren Prüfgrundlage auf den Produktseiten nicht erläutert wird.</p>`;

type Claim = { claim: string; rating: "ZULAESSIG" | "FRAGWUERDIG" | "UNZULAESSIG"; legal: string; reason: string; imageUrl: string };
const c = (claim: string, rating: Claim["rating"], legal: string, reason: string): Claim => ({ claim, rating, legal, reason, imageUrl: "" });

const COMMON = {
  categorySlug: "ergaenzungsfuttermittel-hund",
  brand: "mammaly",
  priceClass: "PREMIUM" as const,
  pricePerKg: 142.83,
  packageSize: "350 g Soft-Snacks (ca. 120 Stück)",
  price: 49.99,
  pricePerDay: 1.67,
};

export const MAMMALY_TESTS = [
  {
    ...COMMON,
    slug: "mammaly-lucky-belly-test",
    title: "mammaly Lucky Belly im Test: 62/100 Punkte",
    productName: "Lucky Belly",
    keyword: "Darmsnack Hund Probiotika",
    image: "mammaly-lucky-belly-hund-darm-ergaenzung.webp",
    imageAlt: "Hund liegt entspannt neben einem Napf, Thema Darmgesundheit (Illustration)",
    contentImage: "mammaly-lucky-belly-hund-darmgesundheit-tierarzt.webp",
    contentImageAlt: "Tierärztin untersucht den Bauch eines Hundes (Illustration)",
    gallery: [] as string[],
    composition:
      "Pflanzliches Glycerin, Reismehl, hydrolysierte Hühnerleber gemahlen 10,5 %, Karotte gemahlen, Zichorienwurzel gemahlen (Fibrofos™ 60) 4,5 %, Flohsamenschalen gemahlen 4,0 %, Alge (DHAgold™) 3 %, Leinsamen gemahlen 2,8 %, Kamillenblüten gemahlen 2,5 %, Fenchel gemahlen 2,5 %, Hefenerzeugnisse (BIOLEX® MB40) 2 %, Geflügelfett, Naturmoor getrocknet, Kümmel gemahlen 0,5 %",
    analysis: [
      { name: "Rohprotein", value: 12.4 },
      { name: "Rohfett", value: 6 },
      { name: "Rohasche", value: 4.3 },
      { name: "Rohfaser", value: 1.8 },
      { name: "Feuchtigkeit", value: 27.3 },
    ],
    scores: { scoreRaw: 20, scoreHarmful: 15, scoreNutrients: 13, scoreDeclaration: 7, scoreNeeds: 6, scoreValue: 1 },
    verdict:
      "Eine ordentlich deklarierte Darm-Ergänzung mit vielen Zutaten samt Prozentangaben. Abzüge: unbenanntes „Konservierungsmittel“, fehlende Mengen bei den ersten Zutaten, Wirkaussagen, die sich auf Zutaten und eine Kundenumfrage statt auf das Produkt stützen, und ein Preis von 142,83 € je Kilogramm. 62 Punkte, Ampel Gelb.",
    teaser: "Offene Zutatenliste, aber 143 € je kg und Werbung mit Kundenumfrage statt Studie. 62 Punkte.",
    pros: [
      "Zusammensetzung mit Prozentangaben für 10 von 14 Zutaten, vollständige Analyse inklusive Feuchtigkeit (27,3 %)",
      "Zuckerfrei, ohne Farbstoffe; Zusatzstoffe mit Mengen (Vitamin E 2169 mg/kg, Bacillus velezensis 3,4 x 10^10 KBE/kg)",
      "Eine Dose reicht bei den meisten Hunden einen Monat; Abo jederzeit kündbar, 90 Tage Geld-zurück laut Produktseite",
    ],
    cons: [
      "Technologischer Zusatzstoff „Konservierungsmittel“ ohne Namen; Glycerin und Reismehl stehen vorn, ohne Menge",
      "Wirkaussagen („einzigartig“, 95 % Zufriedenheit, „DLG-prämierte Qualität“) stützen sich auf eine eigene Kundenumfrage und Studien zu einzelnen Zutaten, nicht auf das Produkt",
      "142,83 € je Kilogramm, bis zu 3,33 € am Tag; Widersprüche bei Rabatt, Versandgrenze und Garantiedauer auf der Seite",
    ],
    claims: [
      c("Tägliche Ergänzungssnacks mit Prä- & Probiotika, Flohsamen und Fenchel – 95% Kundenzufriedenheit.*", "FRAGWUERDIG", "UWG § 5; VO (EG) 767/2009 Art. 11 Abs. 1", "Die Zufriedenheit stammt aus einer von mammaly beauftragten Kundenbefragung (278 Teilnehmer, Juni/Juli 2024). Auf der Spar-Abo-Seite steht für „95%“ dagegen eine Befragung mit n = 466. Zufriedenheit ist keine Wirksamkeit; die Zahl ist selbst erhoben und nicht überprüfbar."),
      c("einzigartig – mit natürlichen Magen-Darm-Bakterien für eine stabile Verdauung", "FRAGWUERDIG", "UWG § 5", "„Einzigartig“ wird nicht belegt. Probiotische Bacillus-Stämme (hier Bacillus velezensis, zugelassen als Zusatzstoff 4b1820) und Prebiotika gibt es in vielen Ergänzungsfuttermitteln."),
      c("87% unserer Kunden sagen, dass sich die Kotkonsistenz ihres Hundes verbessert hat, seit er Lucky Belly bekommt.", "FRAGWUERDIG", "UWG § 5", "Selbstauskunft von Kunden in einer eigenen Umfrage, ohne Vergleichsgruppe. Eine Besserung nach der Gabe kann auch von selbst oder durch eine gleichzeitige Futteränderung kommen. Die Aussage ist als Umfrageergebnis gekennzeichnet, nicht als Beleg einer Wirkung."),
      c("Nach 3 Monaten berichten über 80% unserer Kunden von sichtbaren Verbesserungen bei ihren Hunden.", "FRAGWUERDIG", "UWG § 5", "Auf dieser Produktseite ohne Quelle, auf der Spar-Abo-Seite aus einer Befragung. Bei Kunden, die nach drei Monaten noch dabei sind, ist die Zustimmung naturgemäß hoch; wer unzufrieden war, ist nicht mehr in der Gruppe."),
      c("Flohsamenschalen unterstützen die Verdauung", "ZULAESSIG", "VO (EG) 767/2009 Art. 13 Abs. 1", "Zurückhaltende Aussage zu einer allgemein bekannten Eigenschaft von löslichen Ballaststoffen."),
      c("Die in den Lucky Belly Verdauungs-Snacks enthaltenen Flohsamenschalen können die Darmschleimhaut schützen und die Kotkonsistenz verbessern.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1; UWG § 5", "Das „können“ ist vorsichtig, die Wirkung wird aber auf das Produkt bezogen. Die genannte Studie (Alves et al. 2021) untersuchte 22 Polizeihunde mit chronischem Durchfall und 4 Esslöffel Psyllium am Tag; im Snack stecken 4,0 % Flohsamenschalen, also deutlich weniger."),
      c("Allergikerfreundliche Rezeptur: Die Rezeptur wurde mit speziell hydrolysierter Hühnerleber entwickelt, die aufgrund des Hydrolyseprozesses auch für Hunde mit Hühnerallergie geeignet ist.", "FRAGWUERDIG", "UWG § 5", "Hydrolysierte Proteine werden in Diäten für Allergiker verwendet, doch die Eignung ist vom Einzelfall und vom Grad der Hydrolyse abhängig. Die Zutatenliste enthält außerdem Geflügelfett. Eine allgemeine Eignung „auch für Hunde mit Hühnerallergie“ ist nicht belegt."),
      c("Lucky Belly ist für Hunde aller Altersgruppen geeignet.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1", "Das Etikett nennt „ab 6 Monaten“, die FAQ „aller Altersgruppen“. Beides zugleich stimmt nicht."),
      c("Über 25.000+ 5-Sterne-Bewertungen", "FRAGWUERDIG", "UWG § 5", "Markenbanner ohne Plattform und Datum. Die Produktseite nennt 4,6 Sterne bei 10.824 Bewertungen, ebenfalls ohne Plattform. Die Zahlen lassen sich nicht überprüfen."),
      c("DLG-prämierte Qualität", "FRAGWUERDIG", "UWG § 5", "Die DLG-Prüfung ist verlinkt („Pruefbescheid“), die Prüfkriterien erklärt die Seite nicht. Eine DLG-Auszeichnung bestätigt nach eigener Beschreibung Qualität der Herstellung, nicht die beworbene Wirkung auf die Verdauung."),
    ],
    metaTitle: "mammaly Lucky Belly im Test: 62/100 Punkte",
    metaDescription: "mammaly Lucky Belly Darmsnack für Hunde im Test: Zusammensetzung, Analyse, Werbeaussagen-Check, Preis pro Tag und Abo. 62 von 100 Punkten.",
    keywords: ["mammaly Lucky Belly", "Lucky Belly Test", "Darmsnack Hund", "mammaly Erfahrungen", "Probiotika Hund Snack", "Flohsamenschalen Hund"],
    publishedDaysAgo: 8.31,
    bodyHtml: `<p>„Tägliche Ergänzungssnacks mit Prä- &amp; Probiotika, Flohsamen und Fenchel – 95% Kundenzufriedenheit.“ Mit diesem Satz beginnt die Produktseite von <strong>Lucky Belly</strong> (${SRC}). Ein Hund hat dazu keine Meinung, die 95 % kommen aus einer Kundenbefragung. Wir prüfen, was das Etikett wirklich hergibt.</p>
${METHODE}

<h2>Zusammensetzung: viel Kraut, wenig Fleisch</h2>
<p>Lucky Belly ist ein „Ergänzungsfuttermittel für Hunde ab 6 Monaten“, kein Alleinfutter. Es ersetzt also keine Mahlzeit. Die Zutatenliste ist ungewöhnlich ausführlich: Pflanzliches Glycerin, Reismehl, hydrolysierte Hühnerleber (10,5 %), Karotte, Zichorienwurzel (4,5 %), Flohsamenschalen (4,0 %), Alge (3 %), Leinsamen (2,8 %), Kamille und Fenchel (je 2,5 %), Hefeerzeugnisse (2 %), Geflügelfett, Naturmoor, Kümmel (0,5 %). Die Mengen der beiden ersten Zutaten, Glycerin und Reismehl, nennt die Seite nicht. Das Glycerin hält die Snacks weich, Reismehl ist die Grundmasse.</p>
<p><strong>Zusatzstoffe je kg:</strong> Vitamin E 2169 mg, der Darmflora-Stabilisator Bacillus velezensis (4b1820) mit 3,4 x 10^10 KBE, und als technologischer Zusatzstoff „Konservierungsmittel“. Welches Konservierungsmittel, bleibt offen. Das ist der größte Kritikpunkt an der sonst offenen Liste, denn laut Futtermittelrecht müssen zugesetzte Zusatzstoffe mit Funktionsgruppe angegeben werden; der konkrete Stoff gehört in die Deklaration.</p>
<p><strong>Analytische Bestandteile:</strong> Rohprotein 12,4 %, Rohfett 6 %, Rohasche 4,3 %, Rohfaser 1,8 %, Feuchtigkeit 27,3 %.</p>

<h2>Was die Wirkaussagen tragen</h2>
<p>Die Seite arbeitet mit drei Arten von Belegen. Erstens eine eigene Kundenumfrage: „87% unserer Kunden sagen, dass sich die Kotkonsistenz ihres Hundes verbessert hat“. Die Umfrage hatte 278 Teilnehmer (Produktseite) oder 466 (Spar-Abo-Seite), je nach Seite. Es gab keine Vergleichsgruppe. Zweitens Studien zu einzelnen Zutaten: Übersichtsarbeiten zu Präbiotika, eine Studie mit 22 Polizeihunden zu Psyllium (Flohsamen), ein Herstellerartikel zu Ballaststoffen. Drittens ein Zitat einer Tierärztin. Eine Studie mit dem fertigen Produkt nennt die Seite nicht.</p>
<p>Das ist nicht unseriös, aber es ist kein Wirksamkeitsnachweis. Dass Flohsamen bei Hunden mit chronischem Durchfall helfen können, zeigt die genannte Studie. Dort bekamen die Hunde allerdings vier Esslöffel am Tag, im Snack stecken 4 % Flohsamenschalen in einer Tagesration von wenigen Gramm.</p>
${STUDIEN("Die auf der Seite verlinkten Quellen sind echte Veröffentlichungen, aber sie beantworten nicht die Frage, ob Lucky Belly bei Ihrem Hund wirkt. Übersichtsarbeiten fassen Wirkungen von Präbiotika allgemein zusammen. Die Studie zu Omega-3 (Costantini et al. 2017) ist nach ihrem Titel nicht hundespezifisch. Zu Fenchel, Kümmel und Kamille nennt die Seite keine Studie. Gerade bei Magen-Darm-Beschwerden gilt: Hält Durchfall oder Erbrechen länger als zwei Tage an, gehört der Hund in die Tierarztpraxis.")}

<h2>Widersprüche auf der Seite</h2>
<p>Zwei Aussagen fallen auf. Die FAQ sagt „für Hunde aller Altersgruppen geeignet“, das Etikett „ab 6 Monaten“. Und „allergikerfreundlich“ gilt laut Seite „auch für Hunde mit Hühnerallergie“, während die Rezeptur hydrolysierte Hühnerleber und Geflügelfett enthält. Hydrolysierte Proteine sind in der Futtermittelallergie üblich, ob sie im Einzelfall vertragen werden, entscheidet die Tierarztpraxis.</p>

${KOSTEN("Rechnet man nur die Zutaten, ist der Preis hoch. Eine kleine Packung Flohsamenschalen und ein probiotisches Präparat kosten zusammen deutlich weniger. Dafür ist die Kombination als Snack praktisch, und Hunde nehmen die weichen Snacks laut Seite gern. Die Seite räumt selbst ein, dass der Preis eine Hürde ist: Kundenbewertungen auf der Produktseite sagen „Einzig der Preis ist ein Manko.“", "lucky")}

<p><strong>Unser Gesamtergebnis: 62 von 100 Punkten.</strong> Nach unserem Bewertungsschema liegt Lucky Belly im gelben Bereich, knapp über der roten Grenze. <strong>Strenge Wertung:</strong> Jede fragwürdige Werbeaussage kostet einen Punkt bei der Deklaration, belegbare Widersprüche zusätzlich. Unbenannte Zusatzstoffe senken die Schadstoffnote, Wirkstoffmengen von unter einem Gramm pro Tag die Rohstoffnote, wenn die Werbung eine spürbare Wirkung verspricht. Wir erkennen die offene Zutatenliste, die vollständige Analyse und die Verzichtserklärung (keine Farbstoffe, kein Zucker) an. Punkte kosten das unbenannte Konservierungsmittel, die fehlenden Mengen der ersten Zutaten, Wirkaussagen ohne Studie am Produkt, die inneren Widersprüche und der Preis.</p>
${FOOT}`,
    conclusionHtml: `<p>Lucky Belly ist eine ordentlich deklarierte Ergänzung für Hunde mit empfindlichem Magen-Darm-Trakt, aber nicht der Wundersnack, den die Seite zeichnet. Die Zutaten sind plausibel, belegt ist die Wirkung des fertigen Produkts nicht. Wer es probiert, sollte das mit dem Futter konstant halten und nach vier bis sechs Wochen ehrlich prüfen, ob sich Kot und Bauchgeräusche verändert haben. Bei anhaltenden Beschwerden führt der Weg zur Tierärztin.</p>`,
  },
  {
    ...COMMON,
    slug: "mammaly-fresh-smile-test",
    title: "mammaly Fresh Smile im Test: 61/100 Punkte",
    productName: "Fresh Smile",
    keyword: "Zahnpflege Snack Hund",
    image: "mammaly-fresh-smile-hund-zahnpflege-snacks.webp",
    imageAlt: "Schale mit kleinen Ergänzungsfutter-Snacks auf einem Holztisch, Hund im Hintergrund (Illustration)",
    contentImage: "mammaly-fresh-smile-hund-kauen-aufsicht.webp",
    contentImageAlt: "Hund kaut unter Aufsicht einer Halterin (Illustration)",
    gallery: [] as string[],
    composition:
      "Reismehl, pflanzliches Glycerin, hydrolysierte Hühnerleber gemahlen 8,7 %, Petersilie gemahlen 6 %, Alge gemahlen (Ascophyllum nodosum) 5 %, Geflügelfett, Naturmoor getrocknet, Karotte gemahlen, Pfefferminzblätter gemahlen 2 %, Natriumhexametaphosphat (Prayphos™) 1,7 %, Algenöl (Veramaris®) 1,3 %, Zichorienwurzel gemahlen (Fibrofos™ 60) 0,7 %, Hefenerzeugnisse (BIOLEX® MB40) 0,6 %",
    analysis: [
      { name: "Rohprotein", value: 9.3 },
      { name: "Rohfett", value: 6.3 },
      { name: "Rohasche", value: 6.6 },
      { name: "Rohfaser", value: 1.7 },
      { name: "Feuchtigkeit", value: 29.3 },
    ],
    scores: { scoreRaw: 19, scoreHarmful: 15, scoreNutrients: 12, scoreDeclaration: 8, scoreNeeds: 6, scoreValue: 1 },
    verdict:
      "Eine weiche Zahnpflege-Ergänzung mit nachvollziehbarem Wirkstoffansatz (Hexametaphosphat, Seealge). Abzüge: Werbeaussagen zu Plaque und Zahnstein mit selbst erhobenen Zahlen, widersprüchliche Teilnehmerzahlen der Umfrage, unbenanntes Konservierungsmittel und ein hoher Preis. 61 Punkte, Ampel Gelb.",
    teaser: "Wirkstoffe plausibel, aber „reguliert Plaque“ ohne Studie am Produkt und 143 € je kg. 61 Punkte.",
    pros: [
      "Vollständige Zusammensetzung mit Prozentangaben für 8 von 12 Zutaten und vollständige Analyse inklusive Feuchtigkeit (29,3 %)",
      "Natriumhexametaphosphat ist in Studien an Hunden zur Hemmung von Zahnsteinbildung untersucht; Seealge als Zutat hat eine Übersichtsarbeit",
      "Die FAQ räumt ein, dass das Produkt keine tierärztliche Zahnreinigung ersetzt",
    ],
    cons: [
      "„Konservierungsmittel“ als technologischer Zusatzstoff ohne Namen; Mengen der ersten Zutaten fehlen",
      "Werbeaussagen („reguliert Plaque und Zahnstein“, „hemmt Zahnstein“) stützen sich auf Studien zu Einzelstoffen und eine Umfrage mit 68 oder 72 Teilnehmern",
      "142,83 € je Kilogramm; wirksamer Mundhygiene-Effekt bei Weichsnacks ohne Kauwirkung nicht belegt",
    ],
    claims: [
      c("verleiht einen frischen Atem und reduziert Maulgeruch", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1; UWG § 5", "Pfefferminze, Petersilie und Eukalyptusöl können den Atem erfrischen. Ob das Produkt Maulgeruch dauerhaft „reduziert“, wird nur über Kundenumfrage und Einzelbeispiele gestützt. Ursache von Maulgeruch kann eine Zahn- oder Magenerkrankung sein, die tierärztlich abgeklärt gehört."),
      c("reguliert Plaque und Zahnstein", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1, 3; UWG § 5", "Eine Zahnstein-Hemmung wird für Hexametaphosphat in Studien beschrieben (Stookey 1995, Pinto 2008), dort jedoch in anderen Darreichungen und Dosen. Der Satz „reguliert“ geht über ein vorsichtiges „kann beitragen“ hinaus. Für Zahnstein, der als Erkrankungsfolge gilt, ist eine Heilaussage unzulässig; die Formulierung bewegt sich nah an dieser Grenze."),
      c("82% unserer Kunden sagen, dass sich der Atem ihres Hundes verbessert hat, seit er Fresh Smile bekommt.", "FRAGWUERDIG", "UWG § 5", "Selbstauskunft aus einer eigenen Umfrage. Die Teilnehmerzahl wird auf derselben Seite mit 72 und mit 68 angegeben; Vergleichsgruppe fehlt."),
      c("Über 78 % der Hunde über 3 Jahre haben Zahnprobleme.", "FRAGWUERDIG", "UWG § 5", "Kennzahl ohne Quelle. Die Häufigkeit von Zahnerkrankungen bei Hunden ist hoch, die konkrete Zahl wird nicht belegt."),
      c("Natriumhexametaphosphat … bindet das Kalzium im Speichel und verhindert die Bildung von Zahnstein.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 3; UWG § 5", "„Verhindert“ ist absolut formuliert. Die Studien zeigen eine Verringerung der Zahnsteinbildung, kein vollständiges Verhindern. Für das Produkt selbst gibt es keine veröffentlichte Studie."),
      c("Das enthaltene Natriumsalz kann überschüssige Mineralien im Speichel binden und so die Neubildung von Zahnstein hemmen.", "ZULAESSIG", "VO (EG) 767/2009 Art. 13 Abs. 1", "Vorsichtig formuliert („kann“) und von den zitierten Studien zu Natriumhexametaphosphat gedeckt, soweit es um Neubildung geht."),
      c("Nach wenigen Tagen zeigt sich eine Verbesserung des Maulgeruchs, und erste Veränderungen bei Zahnbelägen sind nach 2-3 Wochen sichtbar.", "FRAGWUERDIG", "UWG § 5", "Zeitangaben stammen aus Einzelbeispielen („Bailey“, „Sophie“) ohne Quelle. Die FAQ nennt dagegen 3 bis 6 Wochen, bei vollständiger Wirkung bis zu 12 Wochen."),
      c("Es ersetzt jedoch keine medizinische Zahnreinigung und regelmäßige tierärztliche Kontrollen sind weiterhin notwendig.", "ZULAESSIG", "UWG § 5", "Ehrlicher Hinweis, der die Aussagen an anderer Stelle relativiert."),
    ],
    metaTitle: "mammaly Fresh Smile im Test: 61/100 Punkte",
    metaDescription: "mammaly Fresh Smile Zahnpflege-Snacks für Hunde im Test: Zutaten, Werbeaussagen zu Plaque und Zahnstein, Preis pro Tag. 61 von 100 Punkten.",
    keywords: ["mammaly Fresh Smile", "Fresh Smile Test", "Zahnpflege Snack Hund", "Zahnstein Hund Snack", "Natriumhexametaphosphat Hund", "mammaly Erfahrungen"],
    publishedDaysAgo: 6.77,
    bodyHtml: `<p>„Einfach. Lecker. Studienbasiert.“ So wirbt die Produktseite von <strong>Fresh Smile</strong> (${SRC}). „Studienbasiert“ ist ein starkes Wort, wir schauen nach, worauf es sich stützt.</p>
${METHODE}

<h2>Zusammensetzung: Wirkstoffe aus der Zahnpflege</h2>
<p>Fresh Smile ist ein „Ergänzungsfuttermittel für Hunde ab 6 Monaten“. Die Rezeptur: Reismehl, Glycerin, hydrolysierte Hühnerleber (8,7 %), Petersilie (6 %), Alge Ascophyllum nodosum (5 %), Geflügelfett, Naturmoor, Karotte, Pfefferminzblätter (2 %), Natriumhexametaphosphat (1,7 %), Algenöl (1,3 %), Zichorienwurzel (0,7 %), Hefeerzeugnisse (0,6 %). Zusatzstoffe je kg: Zink 540 mg (als Zinpro®), Eukalyptusöl 0,1 g, Bacillus velezensis 3,4 x 10^10 KBE, dazu ein „Konservierungsmittel“ ohne Namen. Analyse: Rohprotein 9,3 %, Rohfett 6,3 %, Rohasche 6,6 %, Rohfaser 1,7 %, Feuchtigkeit 29,3 %.</p>
<p>Der wirksame Kern ist Natriumhexametaphosphat. Der Stoff bindet im Speichel Calcium und kann so die Neubildung von Zahnstein hemmen; dazu gibt es Studien an Hunden, die auf der Seite verlinkt sind (Stookey et al. 1995, Pinto et al. 2008). Auch zur Seealge Ascophyllum nodosum nennt die Seite eine Übersichtsarbeit (Gawor et al. 2023). Das sind keine erfundenen Belege.</p>

<h2>Das Problem: weiche Snacks, harte Versprechen</h2>
<p>Zahnpflege-Produkte wirken nach unserer Kenntnis vor allem über zwei Wege: mechanisch (Kauen reibt Beläge ab) und chemisch (Wirkstoffe im Speichel). Fresh Smile ist ein weicher Snack, der kaum Abrieb leistet. Die chemische Wirkung hängt davon ab, wie lange der Stoff im Maul bleibt und in welcher Menge. Eine Studie mit dem fertigen Snack nennt die Seite nicht; die zitierten Arbeiten betreffen andere Darreichungen. Trotzdem lauten die Hauptaussagen „reguliert Plaque und Zahnstein“ und „verhindert die Bildung von Zahnstein“.</p>
<p>Als Beleg dient eine Kundenumfrage: „82% unserer Kunden sagen, dass sich der Atem ihres Hundes verbessert hat“, „64% … Zahnbelag … verringert“. Die Teilnehmerzahl steht auf derselben Seite mal mit 72, mal mit 68. Auch bei den Zeitangaben wird es vage: Einzelbeispiele sprechen von 2 bis 3 Wochen, die FAQ von 3 bis 6 Wochen und bis zu 12 Wochen bis zur vollständigen Wirkung.</p>
${STUDIEN("Gut belegt ist, dass Natriumhexametaphosphat die Zahnsteinbildung hemmen kann. Nicht belegt ist, dass diese Menge in einem Weichsnack bei Ihrem Hund sichtbar Zahnstein abbaut. Der Hersteller räumt selbst ein, dass Fresh Smile „keine medizinische Zahnreinigung“ ersetzt. Das ist der ehrlichste Satz der Seite.")}

${KOSTEN("Für Zahnpflege gibt es günstigere Wege: regelmäßiges Zähneputzen mit Hundezahnpasta, Kauartikel mit nachgewiesener Wirkung (z. B. mit dem Siegel des Veterinary Oral Health Council) und die tierärztliche Zahnkontrolle.", "fresh")}

<p><strong>Unser Gesamtergebnis: 61 von 100 Punkten.</strong> Nach unserem Bewertungsschema liegt Fresh Smile im gelben Bereich, knapp über der roten Grenze. <strong>Strenge Wertung:</strong> Jede fragwürdige Werbeaussage kostet einen Punkt bei der Deklaration, belegbare Widersprüche zusätzlich. Unbenannte Zusatzstoffe senken die Schadstoffnote, Wirkstoffmengen von unter einem Gramm pro Tag die Rohstoffnote, wenn die Werbung eine spürbare Wirkung verspricht. Positiv: offene Zutatenliste, plausible Wirkstoffe, der ehrliche Hinweis auf die Tierarztpraxis. Punkte kosten das unbenannte Konservierungsmittel, die absoluten Formulierungen („reguliert“, „verhindert“), die selbst erhobenen Umfragedaten mit schwankender Teilnehmerzahl, fehlende Studien am fertigen Produkt und der hohe Preis.</p>
${FOOT}`,
    conclusionHtml: `<p>Fresh Smile ist eine plausible Ergänzung zur Zahnpflege, aber kein Ersatz für Zähneputzen und tierärztliche Kontrolle. Die Wirkstoffe sind für Zahnstein-Hemmung beschrieben, die starken Formulierungen der Seite („reguliert“, „verhindert“) tragen die Belege nicht. Wer es probiert, sollte nach drei Monaten die Zähne von der Tierärztin ansehen lassen.</p>`,
  },
  {
    ...COMMON,
    slug: "mammaly-relax-time-test",
    title: "mammaly Relax Time im Test: 53/100 Punkte",
    productName: "Relax Time",
    keyword: "Beruhigung Snack Hund",
    image: "mammaly-relax-time-hund-entspannung.webp",
    imageAlt: "Hund schläft ruhig in einem Hundebett im Wohnzimmer (Illustration)",
    contentImage: "mammaly-relax-time-hund-kraeuter-baldrian-melisse.webp",
    contentImageAlt: "Getrocknete Kräuter in Holzschalen neben einer neutralen Dose (Illustration)",
    gallery: [] as string[],
    composition:
      "Reismehl, pflanzliches Glycerin, hydrolysierte Hühnerleber gemahlen 10 %, Bierhefe, Melissenblätter gemahlen 5 %, Hefenerzeugnisse (BIOLEX® MB40) 2,2 %, Geflügelfett, Algenöl (Veramaris®), Zichorienwurzel gemahlen (Fibrofos™ 60) 1,4 %, Kaseinat 0,7 %, Baldrianwurzel gemahlen 0,4 %",
    analysis: [
      { name: "Rohprotein", value: 16.6 },
      { name: "Rohfett", value: 5.4 },
      { name: "Rohasche", value: 4.4 },
      { name: "Rohfaser", value: 0.5 },
      { name: "Feuchtigkeit", value: 25.4 },
    ],
    scores: { scoreRaw: 17, scoreHarmful: 15, scoreNutrients: 11, scoreDeclaration: 5, scoreNeeds: 4, scoreValue: 1 },
    verdict:
      "Eine Entspannungs-Ergänzung mit L-Tryptophan, Melisse und Baldrian. Abzüge: Verhaltens- und Angstaussagen („bei Angst und Stress“, „Reizbarkeit und Aggression“) ohne Studie am Produkt, das Etikett widerspricht der Allergen-FAQ (Kaseinat), fehlende Mengen, unbenanntes Konservierungsmittel, Preis. 53 Punkte, Ampel Rot.",
    teaser: "„Frei von Milchprodukten“ – aber Kaseinat in der Zutatenliste. Dazu Angst-Versprechen. 53 Punkte.",
    pros: [
      "Vollständige Analyse inklusive Feuchtigkeit (25,4 %); L-Tryptophan als Zusatzstoff mit Menge (43.100 mg/kg)",
      "Zuckerfrei, ohne Farbstoffe; Zutaten der Kräuterbasis mit Prozentangaben (Melisse 5 %, Baldrian 0,4 %)",
      "Abo jederzeit kündbar, Garantie laut Produktseite 90 Tage",
    ],
    cons: [
      "FAQ behauptet „frei von … Milchprodukten“, die Zusammensetzung nennt aber Kaseinat (Milchprotein) 0,7 %",
      "Aussagen zu Angst, Stress und Aggression stützen sich auf Studien zu Diäten und Einzelzutaten, nicht auf das Produkt; zu Baldrian oder Melisse nennt die Seite keine Studie",
      "Ohne Mengenangabe: Bierhefe, Geflügelfett, Algenöl; „Konservierungsmittel“ ohne Namen; 142,83 € je Kilogramm",
    ],
    claims: [
      c("beruhigt und entspannt bei Angst und Stress", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1, 3; UWG § 5", "Angst ist bei Hunden ein Verhaltensproblem, das tierärztlich oder verhaltenstherapeutisch abgeklärt gehört. Ein Ergänzungsfuttermittel darf nicht den Eindruck erwecken, eine Störung zu behandeln. Die Aussage „beruhigt“ ist ohne Beleg am Produkt formuliert."),
      c("unterstützt emotionale Ausgeglichenheit bei Reizbarkeit und Aggression", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 3; UWG § 5", "Aggression kann Schmerz oder Erkrankung als Ursache haben. Der Zusammenhang mit einem Snack wird nicht belegt; die zitierte Studie (DeNapoli et al. 2000) untersuchte Eiweißgehalt und Tryptophan im Alleinfutter."),
      c("84% unserer Kunden sagen, dass ihr Hund ausgeglichener wirkt, seit er Relax Time bekommt.", "FRAGWUERDIG", "UWG § 5", "Selbstauskunft aus einer eigenen Umfrage (68 Teilnehmer laut Produktseite, n = 466 laut Spar-Abo-Seite) ohne Vergleichsgruppe. Stressbezogene Ergebnisse unterliegen besonders stark dem Erwartungseffekt der Halter."),
      c("Baldrian kann direkt auf das zentrale Nervensystem wirken und Entspannung fördern.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1; UWG § 5", "„Kann“ ist vorsichtig, doch im Snack stecken 0,4 % Baldrianwurzel. Die Seite nennt keine Studie zu Baldrian beim Hund; für die Wirkung bei der angegebenen Menge gibt es keinen Beleg."),
      c("Relax Time ist frei von gängigen Allergenen wie Soja, Weizen und Milchprodukten.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Die Zusammensetzung nennt „Kaseinat 0,7%“; Kaseinat ist ein Protein aus Milch. Ob man das als „Milchprodukt“ bezeichnet, ist Auslegung, für Hunde mit Milcheiweißallergie ist der Widerspruch relevant. Aussage und Zutatenliste passen nicht zusammen."),
      c("Ja, Relax Time ist für Hunde aller Altersgruppen geeignet.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1", "Das Etikett nennt „ab 6 Monaten“."),
      c("Nach 4-6 Wochen reagiert Milo viel gelassener auf stressige Situationen.", "FRAGWUERDIG", "UWG § 5", "Einzelbeispiel ohne Quelle, das als Wirkbeleg dargestellt wird."),
      c("für herausfordernden Situationen wie Alleinebleiben, Autofahrten und Silvester", "FRAGWUERDIG", "UWG § 5", "Für diese Anlässe nennt die Seite keine Daten. Bei Silvester-Angst ist tierärztlicher Rat angezeigt; ein Snack allein ersetzt kein Training und keine Medikation."),
    ],
    metaTitle: "mammaly Relax Time im Test: 53/100 Punkte",
    metaDescription: "mammaly Relax Time Entspannungs-Snacks für Hunde im Test: Zutaten, Kaseinat-Widerspruch, Werbeaussagen zu Angst und Stress, Preis. 53 von 100 Punkten.",
    keywords: ["mammaly Relax Time", "Relax Time Test", "Beruhigung Hund Snack", "L-Tryptophan Hund", "Baldrian Hund", "mammaly Erfahrungen"],
    publishedDaysAgo: 3.57,
    bodyHtml: `<p>„Beruhigt und entspannt bei Angst und Stress“: Auf der Produktseite von <strong>Relax Time</strong> (${SRC}) steht das gleich in der Überschrift. Wir prüfen, was die Zutaten dazu hergeben.</p>
${METHODE}

<h2>Zusammensetzung: Melisse, Tryptophan, wenig Baldrian</h2>
<p>Relax Time ist ein „Ergänzungsfuttermittel für Hunde ab 6 Monaten“. Zutaten: Reismehl, Glycerin, hydrolysierte Hühnerleber (10 %), Bierhefe, Melissenblätter (5 %), Hefeerzeugnisse (2,2 %), Geflügelfett, Algenöl, Zichorienwurzel (1,4 %), <strong>Kaseinat (0,7 %)</strong>, Baldrianwurzel (0,4 %). Zusatzstoffe je kg: L-Tryptophan 43.100 mg, Beta-Carotin 300 mg, Vitamin E 9 mg, Bacillus velezensis 3,4 x 10^10 KBE, „Konservierungsmittel“ ohne Namen. Analyse: Rohprotein 16,6 %, Rohfett 5,4 %, Rohasche 4,4 %, Rohfaser 0,5 %, Feuchtigkeit 25,4 %.</p>
<p>Die Tagesmenge für einen 20-kg-Hund sind vier Snacks, etwa 11,7 g. Darin stecken rechnerisch rund 500 mg L-Tryptophan, ungefähr 25 mg je Kilogramm Körpergewicht (eigene Berechnung). Die zitierten Studien lassen sich damit nicht vergleichen: Kato et al. (2012) untersuchten ein Diätfutter, das nach Fachliteratur neben L-Tryptophan auch Alpha-Casozepin enthielt, die Wirkung lässt sich also nicht dem Tryptophan allein zuordnen; DeNapoli et al. (2000) arbeiteten mit elf Hunden mit Dominanzaggression. Laut einer Zusammenfassung von ${a("https://veterinaryevidence.org/index.php/ve/article/view/686", "Veterinary Evidence")} fanden Bosch et al. (2009) keinen signifikanten Einfluss von Tryptophan auf ängstliches Verhalten (Sekundärquelle). Die genauen Tagesmengen der Studien haben wir nicht überprüft. Baldrian macht 0,4 % aus, in der Tagesportion unter 50 Milligramm. Dass solche Mengen Hunde in Stresssituationen spürbar beruhigen, zeigt keine der auf der Seite verlinkten Studien.</p>

<h2>Ein Widerspruch, der Hunde mit Allergie betrifft</h2>
<p>Die FAQ sagt: „Relax Time ist frei von gängigen Allergenen wie Soja, Weizen und Milchprodukten.“ In der Zusammensetzung steht „Kaseinat 0,7%“. Kaseinat ist das Hauptprotein der Milch. Man kann streiten, ob ein Milchprotein ein „Milchprodukt“ ist. Für einen Hund mit Milcheiweißallergie ist die Aussage trotzdem gefährlich, und für ein Produkt, das „allergikerfreundlich“ bewirbt, ist sie ein deutlicher Fehler.</p>

<h2>Angst, Stress, Aggression: heikle Versprechen</h2>
<p>Die Produktseite verspricht Unterstützung bei „Angst und Stress“, bei „Reizbarkeit und Aggression“ und in Situationen wie „Alleinebleiben, Autofahrten und Silvester“. Futtermittel dürfen keine Krankheiten verhüten, lindern oder heilen (VO (EG) 767/2009, Art. 13 Abs. 3). Angst und Aggression sind keine Ernährungsfragen, sie haben oft medizinische oder Haltungs-Ursachen. Wir halten die Formulierungen deshalb für fragwürdig. Besonders das Wort „Aggression“ weckt Erwartungen, die ein Snack nicht erfüllen kann.</p>
<p>Als Beleg dienen wieder die eigene Umfrage („84% … ausgeglichener“) und Studien zu Tryptophan und Diäten, unter anderem von Anzola (2013) und Kato et al. (2012). Das sind Arbeiten zu Futterumstellungen in Tierheimen und bei ängstlichen Hunden, nicht zu diesem Produkt. Eine Studie zu Baldrian oder Melisse beim Hund nennt die Seite nicht.</p>
${STUDIEN("Einzelne Zutaten wie Tryptophan sind im Zusammenhang mit Verhalten beschrieben. Das berechtigt aber nicht zur Aussage, dieser Snack beruhige Hunde bei Angst. Auch auf der Seite eingebundene Bewertungen sind gemischt: „Es scheint irgendwas zu bewirken, aber es ist nur ein minimaler Unterschied … ziemlich teuer ist.“ und „noch kann ich leider keine Wirkung feststellen“.")}

${KOSTEN("Bei Angst vor Silvester oder Trennungsstress ist eine verhaltenstherapeutische Beratung wirksamer als jeder Snack und oft günstiger.", "relax")}

<p><strong>Unser Gesamtergebnis: 53 von 100 Punkten.</strong> Nach unserem Bewertungsschema liegt Relax Time im roten Bereich. <strong>Strenge Wertung:</strong> Jede fragwürdige Werbeaussage kostet einen Punkt bei der Deklaration, belegbare Widersprüche zusätzlich. Unbenannte Zusatzstoffe senken die Schadstoffnote, Wirkstoffmengen von unter einem Gramm pro Tag die Rohstoffnote, wenn die Werbung eine spürbare Wirkung verspricht. Hier kommt ein belegbarer Widerspruch dazu (Kaseinat gegen „frei von Milchprodukten“), der zusätzlich Punkte bei Deklaration und Bedarf kostet. Für die vollständige Analyse, die Mengenangabe beim Tryptophan und die kräuterbasierte Rezeptur gibt es Anerkennung. Deutlich kosten die Wirkversprechen zu Angst und Aggression, der Widerspruch bei Milchprodukten, die fehlenden Mengen und der Preis.</p>
${FOOT}`,
    conclusionHtml: `<p>Relax Time kann als Teil eines Plans für entspanntere Hunde dienen, ersetzt aber weder Training noch tierärztliche Abklärung. Wer ein Milcheiweiß-Problem bei seinem Hund hat, sollte wegen des Kaseinats die Finger davon lassen. Bei Angst, Aggression oder Silvester-Panik hilft zuerst die Tierarztpraxis oder eine Verhaltenstherapeutin.</p>`,
  },
  {
    ...COMMON,
    slug: "mammaly-active-hips-test",
    title: "mammaly Active Hips im Test: 63/100 Punkte",
    productName: "Active Hips",
    keyword: "Gelenk Snack Hund",
    image: "mammaly-active-hips-hund-gelenke-tierarzt.webp",
    imageAlt: "Tierärztin tastet die Hüfte eines älteren Hundes ab (Illustration)",
    contentImage: "mammaly-active-hips-aelterer-hund-bewegung.webp",
    contentImageAlt: "Älterer Hund steigt eine Treppe hinauf (Illustration)",
    gallery: [] as string[],
    composition:
      "Reismehl, pflanzliches Glycerin, hydrolysierte Hühnerleber gemahlen 8 %, Grünlippmuschelmehl 6 %, Algenöl (Veramaris®) 4 %, Algen gemahlen (DHAgold™) 4 %, Methylsulfonylmethan (MSM) 3,5 %, Naturmoor getrocknet, Glucosamin 2 %, Zichorienwurzel gemahlen (Fibrofos™ 60) 0,9 %, Hefenerzeugnisse (BIOLEX® MB40) 0,6 %",
    analysis: [
      { name: "Rohprotein", value: 13.3 },
      { name: "Rohfett", value: 5.4 },
      { name: "Rohasche", value: 3.3 },
      { name: "Rohfaser", value: 0.5 },
      { name: "Feuchtigkeit", value: 30.2 },
    ],
    scores: { scoreRaw: 21, scoreHarmful: 15, scoreNutrients: 13, scoreDeclaration: 7, scoreNeeds: 6, scoreValue: 1 },
    verdict:
      "Eine Gelenk-Ergänzung mit Grünlippmuschel, MSM, Glucosamin und Omega-3, alle mit Prozentangaben. Abzüge: Studien betreffen Extrakte oder Kombinationen mit Chondroitin, das nicht enthalten ist; das Wort „nachweislich“; unbenanntes Konservierungsmittel; Preis. 63 Punkte, Ampel Gelb.",
    teaser: "Wirkstoffe mit Mengen, aber „nachweislich“ stützt sich auf Studien zu anderen Stoffen. 63 Punkte.",
    pros: [
      "Gelenkrelevante Zutaten mit Mengen: Grünlippmuschelmehl 6 %, MSM 3,5 %, Glucosamin 2 %, Algenöl 4 %, Algen 4 %",
      "Vollständige Analyse inklusive Feuchtigkeit (30,2 %); Vitamin C 10.000 mg/kg und L-Carnitin 5.200 mg/kg ausgewiesen",
      "Haftungsfußnote auf der Seite: Die Eigenschaften beziehen sich auf die jeweiligen Inhaltsstoffe, „nicht auf ein pauschales Wirkversprechen für das Gesamtprodukt“",
    ],
    cons: [
      "Studien betreffen Grünlippmuschel-Extrakt und die Kombination Glucosamin mit Chondroitinsulfat; im Produkt steckt Mehl und kein Chondroitin",
      "Satz „… können nachweislich dazu beitragen, die Flexibilität … zu erhalten“ ohne Studie am Produkt",
      "„Konservierungsmittel“ ohne Namen; 142,83 € je Kilogramm, bei Hunden ab 25 kg 3,33 € am Tag",
    ],
    claims: [
      c("81% unserer Kunden sagen, dass sich die Bewegungsfreude ihres Hundes nach 3 Monaten mit Active Hips verbessert hat.*", "FRAGWUERDIG", "UWG § 5", "Selbstauskunft aus einer von mammaly beauftragten Umfrage mit 160 Teilnehmern (Produktseite) oder n = 466 (Spar-Abo-Seite). Ohne Vergleichsgruppe; bei Gelenkbeschwerden spielt der Erwartungseffekt der Halter eine große Rolle."),
      c("Die Nährstoffe in Active Hips können nachweislich dazu beitragen, die Flexibilität deines Hundes zu erhalten und ihn lange fit zu halten", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1, 3; UWG § 5", "„Nachweislich“ behauptet einen Beleg. Die zitierten Studien (Pollard 2006: Grünlippmuschel-Extrakt, 81 Hunde, 56 Tage; McCarthy 2007: Glucosamin plus Chondroitinsulfat, 70 Tage) betreffen andere Stoffe und Darreichungen. Für das Produkt gibt es keine Studie."),
      c("Grünlippmuschel und Glucosamin können die Flexibilität und Bewegungsfreiheit unterstützen", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1", "Vorsichtig formuliert. Die Studienlage zu Glucosamin allein ist gemischt; die Seite zitiert nur eine Studie mit der Kombination Glucosamin plus Chondroitin, die dieses Produkt nicht enthält."),
      c("MSM kann die Funktion von Gelenken und Bändern fördern", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1; UWG § 5", "Die genannte Quelle ist ein deutschsprachiger Übersichtstext zu MSM beim Menschen („Untersuchungen deuten darauf hin …“). Für Hunde nennt die Seite keine Studie."),
      c("80% unserer Kunden beobachten weniger Anzeichen von Gelenkauffälligkeiten, seit ihr Hund Active Hips bekommt.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 3; UWG § 5", "„Gelenkauffälligkeiten“ sind Krankheitszeichen. Ein Ergänzungsfuttermittel darf nicht den Eindruck erwecken, solche zu lindern. Umfrage ohne Vergleichsgruppe."),
      c("Durch das hydrolysierte Hühnerlebermehl ist Active Hips besonders gut verträglich für Futtermittelallergiker.", "FRAGWUERDIG", "UWG § 5", "Allgemeine Eignung für Allergiker ist nicht belegt; die Zutatenliste enthält zudem Geflügelfett. Bei Allergien entscheidet die Tierarztpraxis."),
      c("Alle Hunde ab dem 6. Lebensmonat können von den Active Hips Gelenk-Snacks profitieren – insbesondere größere Rassen.", "FRAGWUERDIG", "UWG § 5", "Ein Nutzen für gesunde junge Hunde wird nicht belegt, und für wachsende Hunde größerer Rassen nennt die Seite keine Eignung. Rat der Tierarztpraxis einholen."),
      c("Die beschriebenen Eigenschaften beziehen sich auf die jeweils genannten Inhaltsstoffe und deren wissenschaftlich untersuchte Eigenschaften – nicht auf ein pauschales Wirkversprechen für das Gesamtprodukt.", "ZULAESSIG", "UWG § 5", "Ehrliche Fußnote, die die Werbeaussagen deutlich relativiert. Sie steht allerdings klein unter den Aussagen und widerspricht dem Wort „nachweislich“."),
    ],
    metaTitle: "mammaly Active Hips im Test: 63/100 Punkte",
    metaDescription: "mammaly Active Hips Gelenk-Snacks für Hunde im Test: Grünlippmuschel, MSM, Glucosamin, Werbeaussagen-Check, Preis. 63 von 100 Punkten.",
    keywords: ["mammaly Active Hips", "Active Hips Test", "Gelenk Snack Hund", "Grünlippmuschel Hund", "MSM Hund", "Glucosamin Hund", "mammaly Erfahrungen"],
    publishedDaysAgo: 2.2,
    bodyHtml: `<p>„Die Nährstoffe in Active Hips können nachweislich dazu beitragen, die Flexibilität deines Hundes zu erhalten.“ Das steht so auf der Produktseite von <strong>Active Hips</strong> (${SRC}). Wir schauen, was „nachweislich“ hier trägt.</p>
${METHODE}

<h2>Zusammensetzung: Wirkstoffe mit Mengen</h2>
<p>Active Hips ist ein „Ergänzungsfuttermittel für Hunde ab 6 Monaten“. Die Zutatenliste ist offen: Reismehl, Glycerin, hydrolysierte Hühnerleber (8 %), Grünlippmuschelmehl (6 %), Algenöl (4 %), Algen (4 %), MSM (3,5 %), Naturmoor, Glucosamin (2 %), Zichorienwurzel (0,9 %), Hefeerzeugnisse (0,6 %). Zusatzstoffe je kg: Vitamin C 10.000 mg, L-Carnitin 5.200 mg, Vitamin E 1.700 mg, Bacillus velezensis 3,4 x 10^10 KBE und ein „Konservierungsmittel“ ohne Namen. Analyse: Rohprotein 13,3 %, Rohfett 5,4 %, Rohasche 3,3 %, Rohfaser 0,5 %, Feuchtigkeit 30,2 %.</p>
<p>Bei den gelenkrelevanten Zutaten ist die Liste ehrlich: Man sieht, wie viel Muschelmehl, MSM und Glucosamin enthalten sind. Für einen 20-kg-Hund (4 Snacks, etwa 11,7 g am Tag) sind das rechnerisch rund 700 mg Muschelmehl, 400 mg MSM und 230 mg Glucosamin täglich (eigene Berechnung). Welche Tagesmengen die zitierten Studien eingesetzt haben, nennt die Seite nicht, und die Originalarbeiten haben wir nicht eingesehen; ein Mengenvergleich ist uns daher nicht möglich. Fest steht: Die Tagesportion enthält jeweils weniger als ein Gramm der Wirkstoffe.</p>

<h2>„Nachweislich“: Was die Studien wirklich zeigen</h2>
<p>Die Seite verweist auf vier Studien. Die Studie zur Grünlippmuschel (Pollard et al. 2006) war doppelblind und placebokontrolliert mit 81 Hunden über 56 Tage, getestet wurde ein <em>Extrakt</em>, im Produkt steckt <em>Mehl</em>. Die Studie zu Glucosamin (McCarthy et al. 2007) untersuchte die Kombination mit <em>Chondroitinsulfat</em> über 70 Tage; Chondroitin steht nicht in der Zusammensetzung. Die Omega-3-Quellen (Roush 2010, Bauer 2011) betreffen eine angereicherte Diät und eine Übersicht. Für MSM verweist die Seite auf einen deutschen Übersichtstext zum Menschen. Eine Studie mit Active Hips gibt es nach den Angaben der Seite nicht.</p>
<p>Die Fußnote der Seite schränkt das selbst ein: „Die beschriebenen Eigenschaften beziehen sich auf die jeweils genannten Inhaltsstoffe und deren wissenschaftlich untersuchte Eigenschaften – nicht auf ein pauschales Wirkversprechen für das Gesamtprodukt.“ Damit widerspricht die Fußnote dem Wort „nachweislich“ direkt darüber. Wir bewerten die Fußnote als ehrlich, den Satz darüber als fragwürdig.</p>
${STUDIEN("Gelenkprodukte beim Hund haben eine gemischte Studienlage: Einzelne Studien zeigen Verbesserungen bei Hunden mit Arthrose, andere nicht, und die Wirkung hängt von Stoff, Dosis und Dauer ab. Das gilt für Muschelextrakt und Glucosamin ebenso wie für Omega-3. Wirklich belegt ist, dass Gewichtskontrolle, Bewegung und eine tierärztliche Diagnose bei Gelenkproblemen am meisten bringen. Ein Snack ist allenfalls eine Ergänzung.")}

<h2>Für wen taugt das Produkt?</h2>
<p>Die Seite empfiehlt Active Hips für „alle Hunde ab dem 6. Lebensmonat … insbesondere größere Rassen“. Ob zusätzliche Wirkstoffe für wachsende Hunde großer Rassen sinnvoll sind, belegt die Seite nicht. Wir raten, vor der Gabe an junge Hunde die Tierarztpraxis zu fragen. Sinnvoller ist der Einsatz bei älteren Hunden oder bei Hunden mit diagnostizierten Gelenkproblemen, immer neben tierärztlicher Behandlung.</p>

${KOSTEN("Eine Alternative ist, die einzelnen Wirkstoffe in Pulverform zu kaufen. Das ist oft deutlich günstiger, aber unpraktischer. Bei Gelenkproblemen sind Gewichtsreduktion, angepasste Bewegung und die Behandlung durch die Tierarztpraxis wirksamer als jede Ergänzung.", "hips")}

<p><strong>Unser Gesamtergebnis: 63 von 100 Punkten.</strong> Nach unserem Bewertungsschema liegt Active Hips im gelben Bereich, knapp über der roten Grenze. <strong>Strenge Wertung:</strong> Jede fragwürdige Werbeaussage kostet einen Punkt bei der Deklaration, belegbare Widersprüche zusätzlich. Unbenannte Zusatzstoffe senken die Schadstoffnote, Wirkstoffmengen von unter einem Gramm pro Tag die Rohstoffnote, wenn die Werbung eine spürbare Wirkung verspricht. Positiv: offene Zutatenliste mit Mengen, ehrliche Fußnote. Punkte kosten das Wort „nachweislich“, Studien zu anderen Stoffen und Darreichungen, das unbenannte Konservierungsmittel und der Preis.</p>
${FOOT}`,
    conclusionHtml: `<p>Active Hips ist eine offen deklarierte Gelenk-Ergänzung, deren Werbung mehr verspricht, als die zitierten Studien hergeben. Bei älteren Hunden kann ein Versuch über drei Monate sinnvoll sein, immer begleitend zur tierärztlichen Behandlung. Wer sparen will, kauft die Wirkstoffe einzeln und setzt auf Gewichtskontrolle.</p>`,
  },
];
