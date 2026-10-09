/** Test „Bugbell BellyVital“ (Okt. 2026). Der Seed legt ihn nur an, wenn der Slug fehlt; Änderungen im Admin bleiben erhalten. */
const SRC = "Produktseite bugbell.de, abgerufen am 09.10.2026";
const a = (u: string, l: string) => `<a href="${u}">${l}</a>`;
type Claim = { claim: string; rating: "ZULAESSIG" | "FRAGWUERDIG" | "UNZULAESSIG"; legal: string; reason: string; imageUrl: string };
const c = (claim: string, rating: Claim["rating"], legal: string, reason: string): Claim => ({ claim, rating, legal, reason, imageUrl: "" });

export const BUGBELL_TESTS = [
  {
    categorySlug: "alleinfuttermittel-hund",
    brand: "Bugbell",
    slug: "bugbell-bellyvital-trockenfutter-test",
    title: "Bugbell BellyVital Trockenfutter im Test: 55/100 Punkte",
    productName: "BellyVital Trockenfutter",
    keyword: "Insekten Trockenfutter Hund",
    priceClass: "PREMIUM" as const,
    pricePerKg: 12.71,
    packageSize: "7 kg Trockenfutter",
    price: 89.0,
    pricePerDay: 4.19,
    image: "bugbell-bellyvital-trockenfutter-hund-napf.webp",
    imageAlt: "Napf mit Trockenfutter für Hunde, Illustration",
    contentImage: "bugbell-bellyvital-hund-kroketten-insektenprotein.webp",
    contentImageAlt: "Nahaufnahme von Trockenfutter-Kroketten, Illustration",
    gallery: [] as string[],
    composition:
      "Insektenprotein (Hermetia illucens) 19 %, Quinoa 18,5 %, Tapiokastärke 16,3 %, Kürbis 14 %, Apfelfaser 13,5 %, Protein vom Bakterium (Methylococcus capsulatus) 10 %, Mineralstoffe 3 %, Erbsenprotein hydrolysiert 1,8 %, Heidelbeeren 1 %, Sonnenblumenöl 0,9 %, Kokosöl 0,25 %, Kurkuma 0,15 %, Flohsamenschalen 0,15 %, Löwenzahn 0,1 %, ß-Glucane 0,1 %, Fructo-Oligosaccharide 0,1 %, Mannan-Oligosaccharide 0,08 %, Mariendistelsamen 0,08 %",
    analysis: [
      { name: "Rohprotein", value: 23 },
      { name: "Rohfett", value: 7 },
      { name: "Rohasche", value: 6.7 },
      { name: "Rohfaser", value: 7 },
      { name: "Calcium", value: 1 },
      { name: "Phosphor", value: 0.9 },
      { name: "Natrium", value: 0.9 },
      { name: "Kalium", value: 0.7 },
    ],
    scores: { scoreRaw: 21, scoreHarmful: 13, scoreNutrients: 15, scoreDeclaration: 0, scoreNeeds: 5, scoreValue: 1 },
    verdict:
      "Ein offen deklariertes Insekten-Alleinfutter mit Prozentangaben, Energiegehalt und Taurin, von Käufern gelobt. Starke Abzüge bei der Werbung: „Monoprotein“ trotz drei Proteinquellen, Eignung bei Pankreatitis und Lebererkrankungen, Magendrehung, „lindern“ von Beschwerden. Dazu hoher Natriumgehalt, unbenanntes Antioxidans, Preis. 55 Punkte, Ampel Rot.",
    teaser: "Offene Zutatenliste, aber „Monoprotein“ trotz Insekten-, Bakterien- und Erbsenprotein. 55 Punkte.",
    pros: [
      "Vollständige Zusammensetzung mit Prozentwerten, Analyse ohne Feuchte, aber mit Energiegehalt (317 kcal/100 g), Vitaminen, Spurenelementen und Taurin; Alleinfuttermittel nach FEDIAF",
      "Insektenprotein 19 % als Hauptproteinquelle; Rohproteinverdaulichkeit der Larven laut Hersteller ≥ 80 %; ohne Zuckerzusatz und Farbstoffe",
      "Sehr gute Käuferbewertungen (4,9 bei 67 Bewertungen auf der Produktseite) und IHK-Gründungspreis 2026",
    ],
    cons: [
      "„Monoprotein-Rezeptur“ steht neben Insektenprotein (19 %), Bakterienprotein (10 %) und Erbsenprotein (1,8 %); „100 % offen deklariert“, aber „Natürliches Antioxidationsmittel“ ohne Namen und keine Feuchte",
      "Natrium 0,9 %; die Seite warnt selbst vor erhöhtem Elektrolytgehalt bei Nieren- und Herzschwäche; Tapiokastärke 16,3 % und Apfelfaser 13,5 % als große Füllstoffanteile",
      "Werbung mit Pankreatitis, Lebererkrankungen, Magendrehung und „Entzündungen“, obwohl kein Diätfuttermittel; rund 4,19 € am Tag für einen 20-kg-Hund",
    ],
    claims: [
      c("Monoprotein-Rezeptur mit Prä- & Probiotika", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Die Zusammensetzung nennt drei Proteinquellen: Insektenprotein (19 %), Protein vom Bakterium Methylococcus capsulatus (10 %) und hydrolysiertes Erbsenprotein (1,8 %). „Monoprotein“ ist damit nur bei enger Auslegung (eine tierische Quelle) richtig, für Hunde mit Unverträglichkeit aber irreführend."),
      c("Fettarmes Trockenfutter für sensible Hunde", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "„Fettarm“ ist für Heimtierfutter nicht definiert. Rohfett 7 % bei 317 kcal/100 g; ein Vergleichsmaßstab wird nicht genannt. Wer das wegen einer Bauchspeicheldrüsenerkrankung wählt, sollte die Tierarztpraxis fragen."),
      c("Unterstützt die normale Verdauung und Darmflora*", "ZULAESSIG", "VO (EG) 767/2009 Art. 13 Abs. 1", "Zurückhaltend formuliert, mit Sternchen-Hinweis; Flohsamen, Heidelbeere, FOS/MOS und Probiotika sind plausible Zutaten."),
      c("Die besonders fettarme Zusammensetzung eignet sich ideal für Hunde mit empfindlicher Bauchspeicheldrüse, Neigung zu Sodbrennen oder wiederkehrenden Analdrüsenproblemen. Auch bei beginnender Leberverfettung oder bestehenden Lebererkrankungen kann eine angepasste, leicht verdauliche Ernährung mit reduziertem Fettanteil sinnvoll sein.*", "UNZULAESSIG", "VO (EG) 767/2009 Art. 13 Abs. 3", "Die Aussage nennt Bauchspeicheldrüsen-, Leber- und Analdrüsenprobleme als Einsatzgebiet. Die Eignung eines Futters für eine Krankheit ist nur bei Diätfuttermitteln mit besonderem Ernährungszweck zulässig; die Seite stellt selbst klar, das Produkt sei „kein Diätfuttermittel im rechtlichen Sinne“. Der Hinweis relativiert, aber hebt den Gesamteindruck nicht auf."),
      c("Aktuelle Studien zeigen klar: gezielte Ernährungsstrategien können die Darmflora und Verdauung von Hunden und Katzen wirksam unterstützen", "FRAGWUERDIG", "UWG § 5", "Im Text stehen weder Autoren noch Jahr noch Zeitschrift. Die Seite verweist auf zwei PDF-Downloads („Report Magen-und-Darm Gesundheit“, „Dissertation Bakterienprotein“), die wir nicht geprüft haben. Allgemeine Studien belegen die Wirkung dieses Futters nicht."),
      c("Prä- und Probiotika in Kombination mit Mariendistel und Omega-3 führten bei Hunden mit Stoffwechselbelastung zu besseren Leberwerten, niedrigerem Blutzucker und weniger Entzündung.", "FRAGWUERDIG", "UWG § 5", "Das Produkt enthält Mariendistel nur zu 0,08 % und keine erkennbare Omega-3-Quelle (Sonnenblumen- und Kokosöl). Die zitierte Kombination ist auf dieses Futter nicht übertragbar."),
      c("FeedKind Pet® ist eine sichere, gut verdauliche und nachhaltige Proteinquelle für Hunde.", "FRAGWUERDIG", "UWG § 5", "Als Beleg dient eine sechsmonatige Studie mit Beagles, deren Quelle nicht genannt wird. „Sicher“ ist absolut formuliert, und die Zutatenliste nennt den Handelsnamen nicht. Wir konnten die Studie nicht prüfen."),
      c("Alle untersuchten Faserquellen, Pflanzenstoffe, Probiotika und neuen Proteinquellen waren gut verträglich und frei von schädlichen Nebenwirkungen.", "FRAGWUERDIG", "UWG § 5", "Absolute Formulierung ohne Quelle. Verträglichkeit ist individuell; dieselbe Seite warnt vor erhöhtem Elektrolytgehalt bei Nieren- und Herzschwäche."),
      c("Klinische Vorteile: … Reduzierte Entzündung im Magen-Darm-Trakt und im Stoffwechsel; Stärkung der Abwehrkräfte über antioxidative und entzündungshemmende Postbiotika", "UNZULAESSIG", "VO (EG) 767/2009 Art. 13 Abs. 3", "„Klinische Vorteile“ und „Reduzierte Entzündung“ beschreiben Wirkungen auf Krankheitsprozesse. Studien zu einzelnen Stoffen tragen das für dieses Futter nicht."),
      c("Unser BellyVital Trockenfutter enthält ballaststoffreiche Zutaten, die … fütterungsbedingter Gasbildung entgegenwirken können – einer der Hauptfaktoren für eine Magendrehung beim Hund.", "UNZULAESSIG", "VO (EG) 767/2009 Art. 13 Abs. 3", "Die Aussage stellt eine Verbindung zur Vorbeugung einer lebensbedrohlichen Erkrankung (Magendrehung) her. Die Ursachen der Magendrehung sind vielfältig; ein Beleg wird nicht genannt."),
      c("Probiotika für Hunde können helfen, das Gleichgewicht im Darm wiederherzustellen und Verdauungsbeschwerden zu lindern.", "UNZULAESSIG", "VO (EG) 767/2009 Art. 13 Abs. 3", "„Beschwerden lindern“ ist eine Behandlungsaussage. Dass die Seite an anderer Stelle sagt, die Produkte seien „nicht zur Behandlung, Linderung oder Vorbeugung von Krankheiten bestimmt“, widerspricht dem."),
      c("BellyVital enthält Flohsamenschalen, die den Kot fester machen und so zur natürlichen Entleerung der Analdrüsen beitragen können.", "FRAGWUERDIG", "UWG § 5", "Flohsamenschalen machen im Futter nur 0,15 % aus. Eine Wirkung auf die Analdrüsen wird nicht belegt."),
      c("Funktionstabelle: Verdauung & Darmflora unterstützt bei „Durchfall, Verstopfung, Erbrechen, Gras und Kot fressen, Sodbrennen“", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 3; UWG § 5", "Die Aufzählung von Beschwerden bei „unterstützt bei“ nähert sich einer Behandlungsaussage. Erbrechen und Durchfall sind Anlass für die Tierarztpraxis, nicht für einen Futterwechsel."),
      c("Mariendistel kann zur Unterstützung der Leberfunktion beitragen, indem sie Giftstoffe aus dem Körper eliminiert", "FRAGWUERDIG", "UWG § 5", "„Giftstoffe eliminieren“ ist ein Entgiftungsversprechen ohne Beleg; Mariendistelsamen machen 0,08 % der Rezeptur aus."),
      c("100% offen deklariert, damit du genau weißt, was drin ist", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 17; UWG § 5", "Die Liste nennt Prozentwerte, aber das Antioxidationsmittel nur als „Natürliches Antioxidationsmittel“, ohne Namen; die Feuchte fehlt in den analytischen Bestandteilen; der Rest zu 100 % wird als „Wasser sowie Vitaminen und Spurenelementen“ zusammengefasst."),
      c("Produziert in Deutschland; Regional und beste Qualität", "FRAGWUERDIG", "UWG § 5", "Hersteller und Produktionsstätte stehen nicht auf der Produktseite. „Regional“ ist für ein Futter aus Insektenprotein, Bakterienprotein und Quinoa nicht erklärt."),
      c("BugBell - Insekten Hundefutter | hypoallergen & gesund (Titel der Startseite)", "FRAGWUERDIG", "UWG § 5", "„Hypoallergen“ ist ein Wirkversprechen für Allergiker. Die Produktseite von BellyVital verwendet das Wort nicht; die Zutatenliste enthält Erbsenprotein und Quinoa, auf die Hunde ebenfalls reagieren können."),
      c("Alleinfuttermittel nach FEDIAF Richtlinie: Das Futter dient als Vollnahrung für erwachsene Hunde und deckt den Tagesbedarf aller notwendigen Nährwerte", "ZULAESSIG", "VO (EG) 767/2009 Art. 11, 17", "Die Futtermittelart ist angegeben, die Tabelle zur Fütterung und der Energiegehalt sind vorhanden. Eine Prüfung der Nährstoffgehalte gegen die FEDIAF-Werte haben wir nicht vorgenommen."),
    ],
    metaTitle: "Bugbell BellyVital Trockenfutter im Test: 55/100 Punkte",
    metaDescription: "Bugbell BellyVital Insekten-Trockenfutter für Hunde im Test: Zusammensetzung, Werbeaussagen-Check (Monoprotein, Pankreatitis, Magendrehung), Preis pro Tag. 55 von 100 Punkten.",
    keywords: ["Bugbell BellyVital", "Bugbell Test", "Insekten Hundefutter Test", "Trockenfutter Darm Hund", "Insektenprotein Hund", "Bugbell Erfahrungen"],
    publishedDaysAgo: 7.62,
    bodyHtml: `<p>„Monoprotein-Rezeptur mit Prä- &amp; Probiotika“: So wirbt Bugbell für das <strong>Trockenfutter BellyVital</strong> (${SRC}). Die Zutatenliste nennt allerdings drei verschiedene Proteinquellen. Wir prüfen, was das Etikett wirklich hergibt.</p>

<h2>Wie wir getestet haben</h2>
<p>Wir haben das Produkt nicht im Labor analysiert und nicht an Hunden erprobt. Grundlage sind die Angaben von Bugbell (${SRC}), die wir nach unserem 100-Punkte-Schema und nach den Regeln der Futtermittelkennzeichnung (VO (EG) 767/2009) und des Wettbewerbsrechts (UWG) prüfen. Die Einstufung der Werbeaussagen ist unsere begründete Einschätzung und keine rechtsverbindliche Feststellung. Hersteller ist laut Impressum die BugBell GmbH, Am Allerhang 6, 27283 Verden (Amtsgericht Walsrode, HRB 209086). Die Bilder in diesem Test sind neutrale Illustrationen, keine Herstellerfotos. Gewählt haben wir BellyVital, weil es im Shop als Bestseller geführt wird (Sortierung nach Bestsellern, 09.10.2026).</p>

<h2>Zusammensetzung: viel Stärke und Faser, wenig Wirkstoff</h2>
<p>BellyVital ist ein „Alleinfuttermittel für ausgewachsene Hunde – ab 1 Jahr“, extrudiert, also ein klassisches Trockenfutter. Die Zutaten stehen mit Prozentwerten da: Insektenprotein (Hermetia illucens, Larven der Schwarzen Soldatenfliege) 19 %, Quinoa 18,5 %, Tapiokastärke 16,3 %, Kürbis 14 %, Apfelfaser 13,5 %, Protein vom Bakterium Methylococcus capsulatus 10 %, Mineralstoffe 3 %, hydrolysiertes Erbsenprotein 1,8 %, Heidelbeeren 1 %, danach Öle und Kräuter in Mengen unter 1 %. Die Funktionszutaten, mit denen die Seite wirbt, sind klein: Flohsamenschalen 0,15 %, Mariendistelsamen 0,08 %, Löwenzahn 0,1 %, FOS 0,1 %, MOS 0,08 %.</p>
<p><strong>Analytische Bestandteile:</strong> Rohprotein 23 %, Rohfett 7 %, Rohasche 6,7 %, Rohfaser 7 %, Calcium 1 %, Phosphor 0,9 %, Natrium 0,9 %, Kalium 0,7 %. Energiegehalt 317 kcal/100 g. Die Feuchte steht nicht dabei; der Rest zu 100 % wird als „Wasser sowie Vitaminen und Spurenelementen“ beschrieben. <strong>Zusatzstoffe je kg:</strong> Vitamin A 20.000 I.E., Vitamin D3 1.500 I.E., Vitamin E 200 I.E., Taurin 500 mg, Eisen, Zink, Kupfer, Mangan, Jod, Selen sowie die Probiotika Bacillus velezensis (1,5 x 10^9 KBE) und Enterococcus faecium (3 x 10^9 KBE); als technologischer Zusatzstoff steht „Natürliches Antioxidationsmittel“ ohne Namen.</p>

<h2>„Monoprotein“? Drei Proteinquellen</h2>
<p>Monoprotein-Futter wird gewählt, um Hunde mit Unverträglichkeiten nur einer Proteinquelle auszusetzen. In BellyVital stehen Insektenprotein (19 %), Bakterienprotein (10 %) und hydrolysiertes Erbsenprotein (1,8 %). Man kann argumentieren, dass nur Insekten eine <em>tierische</em> Quelle sind. Für Hunde mit Erbsen-, Insekten- oder Quinoa-Problemen ist die Aussage trotzdem missverständlich. Das gilt umso mehr, als der Titel der Startseite das Futter „hypoallergen“ nennt.</p>

<h2>Natrium und Elektrolyte: die Seite warnt selbst</h2>
<p>Die Produktseite enthält einen Hinweis: „ACHTUNG: Erhöhter Elektrolytgehalt, besonders beachten bei Niereninsuffizienz und/oder Herzinsuffizienz“. Der Natriumgehalt liegt bei 0,9 %, Kalium bei 0,7 %. Das ist ehrlich, aber im Widerspruch zur Zielgruppe: Das Futter wird auch für Hunde mit Erkrankungen beworben, bei denen genau diese Werte eine Rolle spielen können (Leber, Bauchspeicheldrüse). Wer einen kranken Hund hat, sollte das Futter nur nach Rücksprache mit der Tierarztpraxis wählen.</p>

<h2>Was die Werbung verspricht: Krankheitsbilder im Kleingedruckten</h2>
<p>Die Produktseite wirbt mit „Fettarmes Trockenfutter für sensible Hunde“. In der Beschreibung steht, das Futter eigne sich „ideal für Hunde mit empfindlicher Bauchspeicheldrüse“ und könne „bei beginnender Leberverfettung oder bestehenden Lebererkrankungen“ sinnvoll sein. Darunter steht der Hinweis, das Produkt sei „kein Diätfuttermittel im rechtlichen Sinne“. Beides zusammen passt nicht: Nur Diätfuttermittel mit besonderem Ernährungszweck dürfen für Krankheitsbilder empfohlen werden. Hinzu kommen Sätze im Text am Seitenende: Das Futter könne „fütterungsbedingter Gasbildung entgegenwirken – einer der Hauptfaktoren für eine Magendrehung“, Probiotika könnten „Verdauungsbeschwerden zu lindern“, und in der Funktionstabelle steht das Futter „bei Durchfall, Verstopfung, Erbrechen, Gras und Kot fressen, Sodbrennen“. Gleichzeitig behauptet derselbe Text, die Produkte seien „nicht zur Behandlung, Linderung oder Vorbeugung von Krankheiten bestimmt“. Das ist ein Widerspruch, den wir bei der Deklaration abziehen.</p>
<p>Zum Rohfett: 7 % klingt wenig, aber „fettarm“ ist für Heimtierfutter nicht definiert, und die Seite nennt keinen Vergleichsmaßstab. Bei 317 kcal/100 g stammen rechnerisch rund 20 % der Energie aus Fett (eigene Berechnung).</p>

<h2>Studien: viele Worte, keine Quellen im Text</h2>
<p>Der Abschnitt „Studien zu den funktionalen Zutaten“ beginnt mit „Aktuelle Studien zeigen klar“ und listet Ergebnisse zu Probiotika, Mariendistel, Omega-3 und dem Bakterienprotein FeedKind Pet®. Im Fließtext stehen weder Autoren noch Jahr noch Zeitschrift. Die Seite verlinkt zwei PDFs (einen „Report Magen-und-Darm Gesundheit“ und eine „Dissertation Bakterienprotein“), die wir nicht geprüft haben. Zwei Punkte fallen auf: Die Kombination aus Probiotika, Mariendistel und Omega-3 wird als Beleg genannt, doch das Futter enthält keine erkennbare Omega-3-Quelle und nur 0,08 % Mariendistelsamen. Und die Sicherheit des Bakterienproteins stützt sich auf eine sechsmonatige Studie mit Beagles, deren Quelle nicht genannt wird.</p>

<h2>Preis pro Tag, Abo und Garantie</h2>
<p>Das Futter kostet im Einmalkauf 11,99 € für 800 g (14,99 € je Kilogramm), 54,99 € für 4 kg (13,75 €/kg) und 89,00 € für 7 kg (12,71 €/kg). Nach der Fütterungstabelle erhält ein 20-kg-Hund mit mittlerer Aktivität (3 bis 7 Jahre) 330 g am Tag: Das sind rund 4,19 € bei der 7-kg-Packung und 4,95 € bei der 800-g-Packung (eigene Berechnung). Ein 10-kg-Hund kommt auf rund 2,48 €.</p>
<ul>
<li><strong>Sparplan (Abo):</strong> „15% Rabatt auf die ersten drei Lieferungen, danach dauerhaft 20% sparen“. Jederzeit kündbar, aber „Bei einer Kündigung verlierst du deinen Rabattstatus“. Mindestens ein Artikel muss im Sparplan bleiben (${a("https://bugbell.de/pages/sparplan-bei-bugbell", "Sparplan-Seite")}).</li>
<li><strong>Garantie:</strong> „30 Tage Geld-Zurück bei Erstbestellungen*“, laut ${a("https://bugbell.de/pages/widerrufsrecht", "Bedingungen")} nur für die erste Bestellung eines neuen Kunden bis zu einem Wert von 50 €, Rücksendekosten trägt der Käufer.</li>
<li><strong>Versand:</strong> 4,90 €, kostenlos ab 49 € (Deutschland).</li>
</ul>

<h2>Was Käufer berichten</h2>
<p>Die Bewertungen sind überwiegend sehr gut: 4,9 Sterne bei 67 Bewertungen auf der Produktseite (Plattform Judge.me, vom Hersteller betrieben und beantwortet), im gesamten Shop 4,8 bei 2.066 Bewertungen. Bei zooplus hat BellyVital 22 Bewertungen (21 mal fünf, einmal vier Sterne). Eine Käuferin schreibt dort am 12.02.2026: „Das Futter hat eine tolle Rezeptur und wir super vertragen. Es gibt nur einen Punkt Abzug, da es sehr teuer ist.“ (${a("https://www.zooplus.de/feedback/shop/hunde/hundefutter_trockenfutter/bugbell/2149736", "zooplus")}). Auf bugbell.de berichtet eine Käuferin am 20.07.2026: „Ihre Lipasewerte sind mit Belly Vital wieder im Normbereich.“ Das ist ein Einzelfall bei einem kranken Hund, ohne Kontrollbedingungen; ob andere Faktoren (Tierarzt, Medikamente, Futterumstellung) mitwirkten, steht nicht dabei. Eine andere Rückmeldung: „Erst fand unser Hund es nicht so schmackhaft! Jetzt mittlerweile frisst sie es! Aber nur mit etwas Nassfutter hinzugefügt!“ Kritik betrifft vor allem den Preis, die Akzeptanz bei manchen Hunden und, laut der KI-Zusammenfassung der Bewertungsplattform, die Größe der Kroketten bei großen Rassen.</p>
<p>Zum Unternehmen: Bugbell erhielt im April 2026 den IHK-Gründungspreis der IHK Elbe-Weser (Pressemitteilung vom 24.04.2026). Im Insekten-Hundefutter-Test der Stiftung Warentest vom 29.06.2023 war Bugbell nicht vertreten. Eine Rückrufmeldung zu Bugbell haben wir bei unserer Suche nicht gefunden; das ist keine Garantie, dass es keine gibt.</p>

<p><strong>Unser Gesamtergebnis: 55 von 100 Punkten.</strong> Nach unserem Bewertungsschema liegt BellyVital im roten Bereich. <strong>Strenge Wertung:</strong> Jede fragwürdige Werbeaussage kostet einen Punkt bei der Deklaration, jede unzulässige drei, höchstens 15; hier sind es 12 fragwürdige und 4 unzulässige Aussagen, damit ist die Deklaration ausgeschöpft. Anerkannt haben wir die Prozentangaben, den Energiegehalt, das Taurin und die ehrliche Elektrolytwarnung. Punkte kosten die Widersprüche („Monoprotein“, „100 % offen deklariert“, „kein Diätfuttermittel“ gegenüber Eignung für Krankheiten), die Werbung mit Krankheitsbildern, der hohe Natriumgehalt, das unbenannte Antioxidationsmittel und der Preis. Die Note sagt nichts über die Verträglichkeit bei Ihrem Hund; viele Käufer berichten Gutes.</p>
<p><em>Hinweis:</em> Alle Zitate stammen von den genannten Seiten (Stand 09.10.2026). Preise und Texte können sich ändern.</p>`,
    conclusionHtml: `<p>BellyVital ist ein offen deklariertes Insekten-Alleinfutter, das bei vielen Käufern gut ankommt. Die Rezeptur ist solide, die Werbung dagegen geht deutlich zu weit: Krankheitsbilder, „Monoprotein“ und Studien ohne Quellen im Text. Bei Erkrankungen (Bauchspeicheldrüse, Leber, Nieren, Herz) ersetzt kein Trockenfutter die Beratung der Tierarztpraxis, und der hohe Natriumgehalt spricht gegen die Wahl ohne Rücksprache.</p>`,
  },
];
