/** Drei Tests der Marke Wolfsblut (Okt. 2026): Wide Plain, Dark Forest, Cold River. Der Seed legt sie nur an, wenn der Slug fehlt; Änderungen im Admin bleiben erhalten. */
const a = (u: string, l: string) => `<a href="${u}">${l}</a>`;
type Rating = "ZULAESSIG" | "FRAGWUERDIG" | "UNZULAESSIG";
type Claim = { claim: string; rating: Rating; legal: string; reason: string; imageUrl: string };
const c = (claim: string, rating: Rating, legal: string, reason: string): Claim => ({ claim, rating, legal, reason, imageUrl: "" });
const CHECKED = "abgerufen am 10.10.2026";

const METHODE = (url: string, produkt: string) => `<h2>Wie wir getestet haben</h2>
<p>Wir haben das Futter nicht im Labor analysiert und nicht an Hunden erprobt. Grundlage sind die Angaben von Wolfsblut (${a(url, "Produktseite")}, ${CHECKED}), die wir nach unserem 100-Punkte-Schema und nach den Regeln der Futtermittelkennzeichnung (VO (EG) 767/2009) und des Wettbewerbsrechts (UWG) prüfen. Die Einstufung der Werbeaussagen ist unsere begründete Einschätzung und keine rechtsverbindliche Feststellung. Wolfsblut gehört zur Healthfood24 GmbH (Tschaikowskistraße 17, 04105 Leipzig, Amtsgericht Leipzig, HRB 26287) und seit 2020 zur AlphaPet-Gruppe. Getestet haben wir ${produkt}. Die Bilder sind neutrale Illustrationen, keine Herstellerfotos. Die Sorte „Wild Duck Adult“ haben wir bereits getestet (${a("/alleinfuttermittel-hund/wolfsblut-wild-duck-adult", "Test lesen")}).</p>`;

const GEMEINSAM_STRENG = (fr: number, unz: number) => ` <strong>Strenge Wertung:</strong> Jede fragwürdige Werbeaussage kostet einen Punkt bei der Deklaration, jede unzulässige drei, höchstens 15; hier sind es ${fr} fragwürdige und ${unz} unzulässige Aussagen. Unbenannte oder fehlende Angaben (Feuchte, Energie, Calcium, Phosphor, Natrium, Antioxidantien) wirken sich in Nährstoff- und Schadstoffnote aus.`;

const PREIS = (o: { sorte: string; einmal: string; abo: string; kgEinmal: string; kgAboErst: string; kgAboDanach: string; tag: string; kg: string; extra: string }) => `<h2>Preis pro Tag, Abo und Rückgabe</h2>
<p>${o.sorte} kostet im 12,5-kg-Sack ${o.einmal}, das sind ${o.kgEinmal} je Kilogramm. Im Futter-Abo steht der Sack für ${o.abo} im Shop („20 % sparen“, ${o.kgAboErst} je Kilogramm). Der 20-%-Rabatt gilt laut ${a("https://www.wolfsblut.com/regelmaessige-lieferungen/", "Abo-Seite")} nur für die erste Lieferung, danach „mindestens 10 %“. Damit liegt der Kilopreis in den Folgelieferungen bei rund ${o.kgAboDanach} (eigene Berechnung). Ein Hund von 20 kg bekommt nach der Fütterungstabelle ${o.kg} am Tag, das sind rund ${o.tag} (Einmalkauf, eigene Berechnung). ${o.extra}</p>
<ul>
<li><strong>Abo:</strong> keine Mindestlaufzeit, Kündigung bis drei Werktage vor der nächsten Lieferung, Rabatt nicht mit Gutscheinen kombinierbar. Die Preise im Abo „schwanken aufgrund von Lieferantenkonditionen sowie vorübergehenden Aktionen“.</li>
<li><strong>Rückgabe:</strong> „erweiterte Rückgabefrist“ von 50 Tagen, nur für ungeöffnete Futtermittel (${a("https://www.wolfsblut.com/versand", "Versandseite")}). Die AGB nennen insgesamt 64 Tage und verlangen, dass bis zum Mindesthaltbarkeitsdatum noch mindestens drei Monate bleiben. Retouren sind nur innerhalb Deutschlands und aus Österreich kostenfrei.</li>
<li><strong>Versand:</strong> in Deutschland kostenlos ab 19 € Bestellwert, darunter 3,90 €.</li>
</ul>`;

const STIMMEN = `<h2>Was Käufer berichten</h2>
<p>Auf den Produktseiten von wolfsblut.com ist der Tab „Bewertungen“ im Seitenquelltext leer; produktbezogene Sterne konnten wir nicht auslesen. Für den Shop insgesamt nennt ${a("https://www.trustedshops.de/bewertung/info_X8D5D2BD3A9A89920320A1832F6995110.html", "Trusted Shops")} 4,73 Sterne (Stand 10.10.2026; die Seite nennt an einer Stelle 12.515, im Titel 2.093 Bewertungen). Bewertungen dort betreffen vor allem Lieferung und Preis, nicht einzelne Sorten. Beispiele (verifizierte Käufer): „Er verträgt es super. Ich nutze das Futterabo, was eine richtige prima Sache ist.“ (08.09.2026). „Futter super ehrlich, aber die Lieferzeiten beim Futterabo gehen gar nicht.“ (20.09.2026). „Ich finde es nur verwunderlich, dass ich das normale Futter über meinen Hundefriseur viel billiger (ohne Aktion) bekommen, als hier mit Aktion.“ (28.07.2026). Mehrere Käufer berichten von eingerissenen Säcken; einer schreibt am 21.08.2026: „Er ist an der Linie aufgerissen und der halbe Inhalt des Trockenfuttersacks hat sich über den Boden verteilt.“ Das Portal ${a("https://www.hundeo.com/hundefutter/marken/wolfsblut", "hundeo")} (mit Affiliate-Provision, bezogen auf die Marke allgemein) nennt als Kritik, dass manche Hunde Süßkartoffeln nicht vertragen (Blähungen) und der Fettgehalt „für manche Hunde zu niedrig“ sei, lobt aber die Akzeptanz: „die meisten Hunde fressen es sofort“. Produktspezifische Berichte zu dieser Sorte haben wir kaum gefunden.</p>
<p>Zur Marke: Stiftung Warentest hat im Heft 8/2025 Hundetrockenfutter getestet, Wolfsblut war mit „Jack Rabbit Adult – Kaninchen mit Kartoffeln“ vertreten; die Note liegt hinter der Bezahlschranke. Die hier getestete Sorte war nicht dabei. Öko-Test haben wir nicht gefunden. Rückrufe bei Wolfsblut: Das österreichische BAES meldete am 18.11.2022 einen freiwilligen Rückruf von „Wolfsblut Atlantic Tuna, 500 g“ wegen erhöhter Bleiwerte und am 26.01.2023 eine weitere Warnung zu 2- und 15-kg-Säcken derselben Sorte. Im Oktober 2025 rief Healthfood24 laut Meldung ${a("https://www.produktwarnung.eu/2025/10/22/update-rueckruf-kunststoffsplitter-in-wolfsblut-hundetrockenfutter-moeglich/35767", "Produktwarnung.eu")} „Wide Plain Adult Large“ (12,5 kg, MHD 26.06.2028) zurück, weil nicht auszuschließen war, dass sich Kunststoffsplitter in der Charge befinden. Beide Fälle betreffen andere Produkte als die hier getesteten. Eine Gesamtbewertung der Marke leiten wir daraus nicht ab.</p>`;

const FOOT = `<p><em>Hinweis:</em> Alle Zitate stammen von den genannten Seiten (Stand 10.10.2026). Preise und Texte können sich ändern. Bei Allergien, Verdauungsproblemen oder Erkrankungen ersetzt kein Futter die Beratung der Tierarztpraxis.</p>`;

const GEMEINSAME_CLAIMS = (hypo: boolean): Claim[] => [
  c("Hundeernährung nach dem Vorbild des Wolfes", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Hunde sind Allesfresser-Kulturfolger des Wolfs mit anderer Verdauung; der Slogan ist Marketing. Die Rezeptur selbst enthält Süßkartoffeln, Erbsen und Kräuter, die im „Beuteschema“ des Wolfs nicht vorkommen."),
  c("Ohne Getreide, da es im Beuteschema des Urahns des Hundes nicht vorkommt und zudem zu den häufigsten Allergieauslösern bei Hunden zählt", "FRAGWUERDIG", "UWG § 5", "Eine Quelle für die Behauptung zu den „häufigsten Allergieauslösern“ nennt die Seite nicht. Das Futter enthält stattdessen Hülsenfrüchte und Süßkartoffeln, die ebenfalls Unverträglichkeiten auslösen können."),
  c("Mit Tierärzten entwickelt", "FRAGWUERDIG", "UWG § 5", "Weder Namen noch Qualifikation noch Umfang der Beteiligung werden genannt."),
  c("Das Trockenfutter von Wolfsblut ist damit einzigartig. …mit den neuesten wissenschaftlichen Erkenntnissen über richtige Hundeernährung.", "FRAGWUERDIG", "UWG § 5", "„Einzigartig“ und „neueste wissenschaftliche Erkenntnisse“ werden nicht belegt; die Seite nennt keine Studie."),
  c("Mit Prebiotika aus Topinambur", "ZULAESSIG", "VO (EG) 767/2009 Art. 11 Abs. 1", "Topinambur steht in der Zusammensetzung (Menge nicht angegeben); die Eigenschaft von Inulin als Präbiotikum ist allgemein bekannt."),
  c("Ohne Mais, Gluten, Soja, Geschmacksverstärkern & künstlichen Zusätzen (ausgenommen Vitamine & Mineralstoffe)", "ZULAESSIG", "VO (EG) 767/2009 Art. 11 Abs. 1", "Passt zur Zusammensetzung. Allerdings enthält das Futter synthetische Zusatzstoffe wie DL-Methionin, Taurin und Vitaminverbindungen; die Einschränkung in Klammern deckt das nur teilweise ab."),
  c("Alleinfuttermittel für ausgewachsene Hunde", "ZULAESSIG", "VO (EG) 767/2009 Art. 17", "Futtermittelart und Zusatzstoffe stehen mit Mengen; Feuchte, Energie, Calcium, Phosphor und Natrium stehen nicht auf der Produktseite. Die Nährstoffgehalte haben wir nicht gegen die FEDIAF-Werte geprüft."),
  c("Eigenschaftsfilter „Made in Germany“, daneben Über-uns-Seite: „Wir produzieren in der EU nach dem Lebensmittelstandard (IFS).“", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Ein Produktionsbetrieb oder -ort wird nicht genannt; auf den Produktseiten fehlt ein Hersteller-Block. „Made in Germany“ und „in der EU produziert“ sind nicht dasselbe."),
  ...(hypo ? [c("Badge „Hypoallergen“ und Eigenschaft „Allergiker geeignet“", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 3; UWG § 5", "Das Futter enthält zwei Fleischsorten (Wild und Lamm), Erbsen, Süßkartoffeln und viele Kräuter. „Hypoallergen“ ist ein Wirkversprechen für Allergiker ohne Beleg; ob ein Hund vertragen wird, entscheidet die Tierarztpraxis."), c("Eigenschaftsliste: „Allergiker geeignet · Ernährungssensibel“", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 3", "Eine Eignung für Hunde mit Allergie ist nur bei Diätfuttermitteln zulässig; die Seite bezeichnet das Futter als Alleinfuttermittel.")] : []),
];

type Def = {
  slug: string; produkt: string; sorte: string; keyword: string; url: string; fleisch: string;
  image: string; imageAlt: string; contentImage: string; contentImageAlt: string; composition: string;
  analysis: { name: string; value: number }[]; scores: { scoreRaw: number; scoreHarmful: number; scoreNutrients: number; scoreNeeds: number; scoreValue: number };
  pricePerKg: number; price: number; pricePerDay: number; daysAgo: number; hypo: boolean; special: Claim[];
  pros: string[]; cons: string[]; verdictCore: string; teaserCore: string; conclusion: string; body: string; keywords: string[]; descCore: string;
};

function build(d: Def) {
  const claims = [...d.special, ...GEMEINSAME_CLAIMS(d.hypo)];
  const fr = claims.filter((x) => x.rating === "FRAGWUERDIG").length;
  const unz = claims.filter((x) => x.rating === "UNZULAESSIG").length;
  const decl = Math.max(0, 15 - fr - 3 * unz);
  const scores = { ...d.scores, scoreDeclaration: decl };
  const total = Object.values(scores).reduce((s, v) => s + v, 0);
  const ampel = total >= 80 ? "Grün" : total >= 60 ? "Gelb" : "Rot";
  const ampelWort = total >= 80 ? "grünen" : total >= 60 ? "gelben" : "roten";
  const title = `Wolfsblut ${d.sorte} im Test: ${total}/100 Punkte`;
  return {
    categorySlug: "alleinfuttermittel-hund", brand: "Wolfsblut", slug: d.slug, title, productName: d.produkt, keyword: d.keyword,
    priceClass: "PREMIUM" as const, pricePerKg: d.pricePerKg, packageSize: "12,5 kg Trockenfutter", price: d.price, pricePerDay: d.pricePerDay,
    image: d.image, imageAlt: d.imageAlt, contentImage: d.contentImage, contentImageAlt: d.contentImageAlt, gallery: [] as string[],
    composition: d.composition, analysis: d.analysis, scores, claims,
    verdict: `${d.verdictCore} ${total} Punkte, Ampel ${ampel}.`,
    teaser: `${d.teaserCore} ${total} Punkte.`,
    pros: d.pros, cons: d.cons,
    metaTitle: title, metaDescription: `Wolfsblut ${d.sorte} Trockenfutter für Hunde im Test: ${d.descCore} Preis pro Tag, Werbeaussagen-Check. ${total} von 100 Punkten.`,
    keywords: d.keywords, publishedDaysAgo: d.daysAgo,
    bodyHtml: `${d.body.replace("@@TOTAL@@", `<p><strong>Unser Gesamtergebnis: ${total} von 100 Punkten.</strong> Nach unserem Bewertungsschema liegt ${d.sorte} im ${ampelWort} Bereich.${GEMEINSAM_STRENG(fr, unz)}</p>`)}\n${FOOT}`,
    conclusionHtml: d.conclusion,
  };
}

const NACHTEIL_FEHLT = "Auf der Produktseite stehen weder Feuchte noch Energiegehalt noch Calcium, Phosphor und Natrium; ohne Calcium-Phosphor-Verhältnis lässt sich die Bedarfsdeckung nicht prüfen";

export const WOLFSBLUT_TESTS = [
  build({
    slug: "wolfsblut-wide-plain-adult-pferd-test", produkt: "Wide Plain Adult (Pferd mit Süßkartoffeln)", sorte: "Wide Plain Adult", keyword: "Pferd Trockenfutter Hund getreidefrei",
    url: "https://www.wolfsblut.com/wolfsblut-adult-wolfsblut-wide-plain-pferdefleisch-und-susskartoffel-trockenfutter-12-5-kg.html", fleisch: "Pferd",
    image: "wolfsblut-wide-plain-pferd-trockenfutter-hund.webp", imageAlt: "Hund vor einem leeren Napf, Illustration", contentImage: "wolfsblut-wide-plain-pferd-futtermenge-hund.webp", contentImageAlt: "Futter wird für einen Hund abgewogen, Illustration",
    composition: "Pferd 40 % (frisches Pferd 31 %, getrocknetes Pferd 9 %), Süßkartoffeln 18 %, Erbsen, Pferdefett 8 %, Erbsenprotein, Kürbis, Kichererbsen, Pastinaken, Gemüsebrühe, Erbsenfaser, Fenchel, Mineralstoffe, Topinambur, Leinsamen, Thymian, Majoran, Oregano, Petersilie 0,1 %, Salbei, Tomaten, Brennnessel, Weißdorn, Löwenzahn, Ginseng, Mannan-Oligosaccharide (MOS), Fructo-Oligosaccharide (FOS), Hagebutten, Schwarze Johannisbeeren, Brombeeren, Holunderbeeren, Yucca Schidigera Extrakt, Himbeeren, Heidelbeeren 0,01 %, Aroniabeeren 0,01 %",
    analysis: [{ name: "Rohprotein", value: 26 }, { name: "Rohfett", value: 17 }, { name: "Rohasche", value: 9.5 }, { name: "Rohfaser", value: 3.5 }],
    scores: { scoreRaw: 23, scoreHarmful: 15, scoreNutrients: 13, scoreNeeds: 6, scoreValue: 2 },
    pricePerKg: 6.8, price: 84.99, pricePerDay: 1.6, daysAgo: 1.8, hypo: false,
    special: [
      c("Alles auf einen Blick: Frisches und gut bekömmliches Pferd als Hauptbestandteil", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Pferd macht 40 % aus, davon 31 % „frisch“. Frischfleisch wird vor dem Trocknen gewogen; im fertigen Futter ist sein Anteil deutlich geringer. Dahinter folgen Erbsen, Erbsenprotein, Kichererbsen und Erbsenfaser: vier Hülsenfrucht-Zutaten. „Gut bekömmlich“ wird nicht belegt."),
      c("Mit wertvollen Superfoods wie Brombeeren, Himbeeren, Löwenzahn und Ginseng", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "„Superfood“ ist kein geschützter Begriff. Himbeeren, Heidelbeeren und Aroniabeeren stehen mit 0,01 % in der Liste, Petersilie mit 0,1 %; für Brombeeren, Löwenzahn und Ginseng nennt die Seite keine Mengen."),
      c("Eigenschaftsliste: „Allergiker geeignet · Ernährungssensibel · Getreidefrei · Glutenfrei · Hoher Fleischanteil“", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 3; UWG § 5", "Eine Eignung für Allergiker ist nur bei Diätfuttermitteln zulässig. Die Zusammensetzung enthält Erbsenprotein, Kichererbsen, Leinsamen und Süßkartoffeln, auf die Hunde reagieren können. Im Seitendatenfeld stehen außerdem „Hypoallergen“ und „Monoprotein“ (auf der Seite nicht sichtbar), obwohl neben Pferd weitere Proteinquellen enthalten sind."),
      c("Süßkartoffeln: … eine der nährstoffreichsten Gemüsesorten und liefern Antioxidantien, Beta-Carotin, Vitamine (B6, E), Mineralien (Magnesium, Calcium) und Proteine.", "FRAGWUERDIG", "UWG § 5", "Allgemeine Aussage ohne Quelle; gekochte und extrudierte Süßkartoffel liefert im Hundefutter vor allem Stärke."),
      c("Heidelbeeren … Antioxidantien, insbesondere Anthocyanen, die Zellschutz bieten können", "FRAGWUERDIG", "UWG § 5", "Heidelbeeren stehen mit 0,01 % in der Liste. Bei dieser Menge ist ein „Zellschutz“ nicht zu erwarten."),
    ],
    pros: [
      "Hoher Pferdeanteil (40 %, davon 31 % frisch) als erste Zutat mit Prozentangaben; ohne Getreide, Mais, Soja und Gluten; Taurin 1.000 mg/kg, L-Carnitin und alle Zusatzstoffe mit Menge",
      "Rohprotein 26 %; eine Fütterungstabelle von 1 bis über 45 kg (190 bis 280 g für 15 bis 25 kg); 50 Tage Rückgabefrist für ungeöffnete Säcke",
      "Rezeptur gut erkennbar; Pferd als eher seltene Fleischsorte für Hunde, die sonst Rind oder Huhn nicht vertragen (Einzelfall, Tierarztpraxis fragen)",
    ],
    cons: [
      "Vier Hülsenfrucht-Zutaten (Erbsen, Erbsenprotein, Kichererbsen, Erbsenfaser) und Süßkartoffeln 18 % machen einen großen Teil des Pflanzenanteils aus; Rohfett 17 % ist kalorienreich",
      NACHTEIL_FEHLT,
      "Werbung mit „Allergiker geeignet“, „Superfoods“ in Spurenmengen (0,01 %), „einzigartig“ und „Vorbild des Wolfes“; Abo-Rabatt 20 % nur auf die erste Lieferung",
    ],
    verdictCore: "Ein fleischreiches, getreidefreies Pferdefutter mit offener Zutatenliste und Mengen bei den wichtigen Zutaten. Abzüge: viele Hülsenfrüchte, fehlende Angaben zu Feuchte, Energie und Mineralstoffen, Superfood-Werbung mit 0,01-%-Mengen, Allergiker-Versprechen und Preis.",
    teaserCore: "Pferd 40 %, offen deklariert – aber vier Hülsenfrüchte, viel Superfood-Werbung.",
    conclusion: `<p>Wide Plain ist eine solide, fleischreiche Rezeptur für Hunde, die Pferd gut vertragen. Der Wert liegt im Pferdeanteil, nicht in den Superfoods. Wer wegen einer Allergie wechselt, sollte vorher mit der Tierarztpraxis sprechen: Erbsen, Kichererbsen und Süßkartoffeln machen „Allergiker geeignet“ nicht selbstverständlich.</p>`,
    keywords: ["Wolfsblut Wide Plain", "Wolfsblut Pferd Test", "Pferd Trockenfutter Hund", "Wolfsblut Erfahrungen", "getreidefreies Hundefutter Pferd"], descCore: "40 % Pferd, getreidefrei, vier Hülsenfrucht-Zutaten, Allergiker-Versprechen.",
    body: `<p>„Frisches und gut bekömmliches Pferd als Hauptbestandteil“: So wirbt Wolfsblut für das <strong>Wide Plain Adult</strong> (Pferd mit Süßkartoffeln, ${CHECKED}). Wir prüfen Rezeptur und Werbung.</p>
${METHODE("https://www.wolfsblut.com/wolfsblut-adult-wolfsblut-wide-plain-pferdefleisch-und-susskartoffel-trockenfutter-12-5-kg.html", "den 12,5-kg-Sack Wide Plain Adult")}

<h2>Zusammensetzung: viel Pferd, viele Erbsen</h2>
<p>Wide Plain ist ein „Alleinfuttermittel für ausgewachsene Hunde“. Die Liste beginnt mit <strong>Pferd 40 %</strong> (frisches Pferd 31 %, getrocknetes Pferd 9 %), dann Süßkartoffeln 18 %, Erbsen, Pferdefett 8 %, Erbsenprotein, Kürbis, Kichererbsen, Pastinaken, Gemüsebrühe, Erbsenfaser, Fenchel und weitere Zutaten; danach folgt eine lange Reihe von Kräutern und Beeren, fast alle ohne Mengenangabe, einige mit 0,01 %. Das Pferd ist die tierische Basis. Frischfleisch wird vor dem Trocknen gewogen, im fertigen Futter bleibt weniger. Dahinter stecken vier Hülsenfrucht-Zutaten (Erbsen, Erbsenprotein, Kichererbsen, Erbsenfaser). Sie liefern Protein und Fasern, sind aber für manche Hunde schlecht verträglich.</p>
<p><strong>Analytische Bestandteile:</strong> Rohprotein 26 %, Rohfett 17 %, Rohasche 9,5 %, Rohfaser 3,5 %. <strong>Zusatzstoffe je kg:</strong> Vitamin A 21.871 IE, D3 1.471 IE, E 710 mg, Jod 0,96 mg, Eisen 95 mg, Zink 150 mg, Mangan 36 mg, Kupfer 15 mg, Selen 0,15 mg, DL-Methionin 2.126 mg, L-Carnitin 82 mg, Taurin 1.000 mg. Feuchte, Energie, Calcium, Phosphor und Natrium stehen nicht auf der Produktseite; Antioxidantien oder Konservierungsmittel werden nicht genannt, bei 17 % Rohfett wäre eine Angabe zur Haltbarmachung zu erwarten.</p>

<h2>Fütterung</h2>
<p>Laut Tabelle: 1–5 kg: 30–80 g, 5–15 kg: 80–190 g, 15–25 kg: 190–280 g, 25–35 kg: 280–360 g, 35–45 kg: 360–430 g, über 45 kg: ab 430 g am Tag. Die Menge „dient nur der Orientierung“ und ist an Alter, Rasse und Beanspruchung anzupassen. Wegen der 17 % Fett sollte bei weniger aktiven Hunden das Gewicht im Blick bleiben.</p>

<h2>Werbung: Superfoods in Spurenmengen, Allergiker, Wolf</h2>
<p>Die Seite wirbt mit „wertvollen Superfoods wie Brombeeren, Himbeeren, Löwenzahn und Ginseng“. Himbeeren, Heidelbeeren und Aroniabeeren stehen mit je 0,01 % in der Liste. In einer Tagesration von 235 g (20-kg-Hund) sind das wenige Milligramm. Dazu kommen die Eigenschaften „Allergiker geeignet · Ernährungssensibel“ (im Seitendatenfeld außerdem „Hypoallergen“ und „Monoprotein“, die auf der Seite nicht sichtbar sind). Das Futter enthält neben Pferd auch Erbsenprotein, Kichererbsen und Leinsamen. Wir halten das für fragwürdig.</p>
<p>„Hundeernährung nach dem Vorbild des Wolfes“ und „im Beuteschema des Urahns … nicht vorkommt“ sind Marketing. Eine Quelle für die Aussage, Getreide zähle „zu den häufigsten Allergieauslösern“, nennt die Seite nicht, und im Futter stehen Süßkartoffeln und Hülsenfrüchte statt Beute. „Mit Tierärzten entwickelt“ und „neueste wissenschaftliche Erkenntnisse“ werden ohne Namen und Studien behauptet.</p>

${PREIS({ sorte: "Wide Plain", einmal: "84,99 €", abo: "67,99 €", kgEinmal: "6,80 €", kgAboErst: "5,44 €", kgAboDanach: "6,12 €", tag: "1,60 €", kg: "etwa 235 g", extra: "Für einen 40-kg-Hund (360 bis 430 g) liegen die Kosten bei rund 2,70 €." })}

${STIMMEN}

@@TOTAL@@
<p>Anerkannt haben wir den hohen Pferdeanteil, die Zutatenliste mit Mengen für die Hauptzutaten, Taurin und L-Carnitin und die klare Fütterungstabelle. Punkte kosten die Hülsenfrucht-Menge, fehlende Angaben zu Feuchte, Energie und Mineralstoffen, die Superfood- und Allergiker-Werbung und der Preis.</p>`,
  }),
  build({
    slug: "wolfsblut-dark-forest-adult-wild-test", produkt: "Dark Forest Adult (Wild mit Süßkartoffeln)", sorte: "Dark Forest Adult", keyword: "Wild Trockenfutter Hund hypoallergen",
    url: "https://www.wolfsblut.com/wolfsblut-adult-dark-forest-wild-und-susskartoffel-trockenfutter-12-5-kg.html", fleisch: "Wild",
    image: "wolfsblut-dark-forest-wild-trockenfutter-hund.webp", imageAlt: "Hund schnuppert an seinem Napf, Illustration", contentImage: "wolfsblut-dark-forest-wild-getreidefrei-hund.webp", contentImageAlt: "Schale mit Getreide neben einem Hundenapf, Illustration",
    composition: "Frisches Wild 30 %, Süßkartoffeln 24 %, Erbsen, getrocknetes Lamm 7 %, Kürbis, Pastinaken, Lammfett, Lammfond, Erbsenfasern, Fenchel, Mineralstoffe, Topinambur, Spirulina, Thymian 0,1 %, Majoran, Oregano, Petersilie, Salbei, Tomaten, Brennnessel, Weißdorn, Löwenzahn, Ginseng 0,05 %, Mannan-Oligosaccharide (MOS), Fructo-Oligosaccharide (FOS), Hagebutten, Schwarze Johannisbeeren, Brombeeren, Holunderbeeren, Yucca Schidigera Extrakt, Himbeeren 0,01 %, Heidelbeeren 0,01 %, Aroniabeeren",
    analysis: [{ name: "Rohprotein", value: 20 }, { name: "Rohfett", value: 10 }, { name: "Rohasche", value: 9 }, { name: "Rohfaser", value: 3.5 }],
    scores: { scoreRaw: 22, scoreHarmful: 16, scoreNutrients: 12, scoreNeeds: 5, scoreValue: 2 },
    pricePerKg: 6.0, price: 74.99, pricePerDay: 1.56, daysAgo: 10.8, hypo: true,
    special: [
      c("Frisches und gut bekömmliches Wild als Hauptbestandteil", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "„Frisches Wild“ steht mit 30 % vorn, wird aber vor dem Trocknen gewogen. Das Futter enthält zusätzlich getrocknetes Lamm (7 %), Lammfett und Lammfond, also eine zweite Fleischsorte. „Gut bekömmlich“ wird nicht belegt."),
      c("Wildfleisch enthält die wertvollen … Spurenelemente Selen, Eisen und Zink. Wildfleisch ist zudem mager und cholesterinarm.", "FRAGWUERDIG", "UWG § 5", "Allgemeine Aussage über rohes Wildfleisch ohne Quelle, nicht über das fertige Futter. Das Futter hat 10 % Rohfett, davon ein Teil Lammfett."),
      c("Mit wertvollen Superfoods wie Süßkartoffeln, Heidelbeeren, Aroniabeeren sowie Löwenzahn, Topinambur und Ginseng", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Heidelbeeren und Himbeeren stehen mit 0,01 %, Ginseng mit 0,05 % in der Liste. „Superfood“ ist kein geschützter Begriff."),
      c("Süßkartoffeln: Sie sind laut der amerikanischen Gesundheitsbehörde CSPI eines der nährstoffreichsten Gemüse", "FRAGWUERDIG", "UWG § 5", "CSPI (Center for Science in the Public Interest) ist keine Gesundheitsbehörde, sondern eine US-Verbraucherorganisation. Die Quelle wird weder genannt noch verlinkt, die Aussage ist daher nicht nachprüfbar."),
      c("Ginseng: Im asiatischen Raum fungiert er als Heilpflanze", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 3; UWG § 5", "Der Hinweis auf eine Heilpflanze weckt Arzneimittelassoziationen; Ginseng steht mit 0,05 % in der Liste."),
      c("Ein Geschmacksklassiker, der sehr gern gefressen wird", "ZULAESSIG", "VO (EG) 767/2009 Art. 11 Abs. 1", "Beschreibt die Akzeptanz, ohne Gesundheitswirkung; durch Käuferberichte und Branchenportale nicht widerlegt."),
    ],
    pros: [
      "Frisches Wild 30 % als erste Zutat und getrocknetes Lamm 7 % mit Prozentangaben; ohne Getreide, Mais, Soja und Gluten; Taurin und L-Carnitin ausgewiesen",
      "Preis 74,99 € für 12,5 kg (6,00 €/kg), rund 1,56 € am Tag für einen 20-kg-Hund; Fütterungstabelle und 50 Tage Rückgabefrist für ungeöffnete Säcke",
      "Wild als wenig verbreitete Fleischsorte mit Lamm als zweiter Quelle; Fenchel, Topinambur und Prebiotika (MOS, FOS) als plausible Zutaten",
    ],
    cons: [
      "Badge „Hypoallergen“ und „Allergiker geeignet“ bei zwei Fleischsorten (Wild, Lamm), Erbsen, Erbsenfasern und Süßkartoffeln 24 %",
      NACHTEIL_FEHLT + "; Rohprotein nur 20 %",
      "Spurenmengen als „Superfoods“ (0,01 %), „CSPI als Gesundheitsbehörde“ ohne Quelle, „Heilpflanze“ Ginseng; Abo-Rabatt 20 % nur auf die erste Lieferung",
    ],
    verdictCore: "Ein getreidefreies Wildfutter mit offener Liste und fairem Preis pro Tag. Abzüge: „Hypoallergen“ trotz zwei Fleischsorten, Hülsenfrüchten und Süßkartoffeln, niedriger Proteingehalt (20 %) bei fehlenden Angaben zu Feuchte, Energie und Mineralstoffen sowie Superfood- und Heilpflanzen-Werbung.",
    teaserCore: "Wild 30 %, getreidefrei, fairer Preis – aber „hypoallergen“ trotz Lamm und Erbsen.",
    conclusion: `<p>Dark Forest ist ein ordentlich deklariertes Wildfutter mit moderatem Preis pro Tag. „Hypoallergen“ trägt die Rezeptur nicht: Wild und Lamm, Erbsen und Süßkartoffeln sind mehrere mögliche Auslöser. Bei Futterallergie gehört die Auswahl in die Hände der Tierarztpraxis, nicht auf ein Badge.</p>`,
    keywords: ["Wolfsblut Dark Forest", "Wolfsblut Wild Test", "Wild Trockenfutter Hund", "hypoallergen Hundefutter", "Wolfsblut Erfahrungen"], descCore: "30 % Wild, Lamm, „hypoallergen“ trotz zwei Fleischsorten und Hülsenfrüchten.",
    body: `<p>„Hypoallergen“, „Allergiker geeignet“, „frisches und gut bekömmliches Wild als Hauptbestandteil“: So steht es auf der Produktseite von <strong>Dark Forest Adult</strong> (${CHECKED}). Die Zutatenliste nennt neben Wild auch Lamm. Wir prüfen, was zusammenpasst.</p>
${METHODE("https://www.wolfsblut.com/wolfsblut-adult-dark-forest-wild-und-susskartoffel-trockenfutter-12-5-kg.html", "den 12,5-kg-Sack Dark Forest Adult")}

<h2>Zusammensetzung: Wild, Lamm, Süßkartoffel</h2>
<p>Dark Forest ist (laut Datenfeld der Seite) ein „Alleinfuttermittel für ausgewachsene Hunde“; im sichtbaren Text steht „Trockenfutter mit Wild und Süßkartoffel“. Die Zutaten: <strong>Frisches Wild 30 %</strong>, Süßkartoffeln 24 %, Erbsen, <strong>getrocknetes Lamm 7 %</strong>, Kürbis, Pastinaken, Lammfett, Lammfond, Erbsenfasern, Fenchel, Mineralstoffe, Topinambur, Spirulina und viele Kräuter und Beeren, überwiegend ohne Mengen. Damit sind es zwei Fleischsorten (Wild und Lamm) und mehrere pflanzliche Hauptzutaten: Süßkartoffeln, Erbsen, Erbsenfasern.</p>
<p><strong>Analytische Bestandteile:</strong> Rohprotein 20 %, Rohfett 10 %, Rohasche 9 %, Rohfaser 3,5 %. Die Zusatzstoffe entsprechen denen der anderen Sorten (u. a. Vitamin A 21.871 IE, D3 1.471 IE, E 710 mg, Zink 150 mg, DL-Methionin 2.126 mg, L-Carnitin 82 mg, Taurin 1.000 mg je kg). Feuchte, Energie, Calcium, Phosphor und Natrium sowie Antioxidantien nennt die Seite nicht. Rohprotein 20 % ist für ein Futter mit 30 % frischem Wild niedrig: Der Frischfleischanteil wird vor dem Trocknen gewogen.</p>

<h2>Fütterung</h2>
<p>1–5 kg: 30–90 g, 5–15 kg: 90–210 g, 15–25 kg: 210–310 g, 25–35 kg: 310–400 g, 35–45 kg: 400–480 g, über 45 kg: ab 480 g am Tag. Die Mengen sind laut Seite Orientierungswerte.</p>

<h2>„Hypoallergen“: Was die Zutatenliste dazu sagt</h2>
<p>Auf der Produktseite steht ein Badge „Hypoallergen“, in der Eigenschaftsliste „Allergiker geeignet · Ernährungssensibel“. Hypoallergen bedeutet bei Futter üblicherweise: wenige, selten verwendete Proteinquellen, keine Zutaten, die häufige Allergene sind. Dark Forest enthält zwei Fleischsorten (Wild, Lamm), außerdem Erbsen, Erbsenfasern und Süßkartoffeln. Ob ein Hund Wild oder Lamm verträgt, hängt vom Einzeltier ab. Eine Eignung für „Allergiker“ bezieht sich auf ein Krankheitsbild; sie ist bei Futtermitteln nur für Diätfuttermittel mit besonderem Ernährungszweck vorgesehen (VO (EG) 767/2009 Art. 13 Abs. 3). Das Futter ist als Alleinfuttermittel gekennzeichnet. Wir stufen die Aussage als fragwürdig ein.</p>

<h2>Weitere Werbeaussagen</h2>
<p>Die Seite schreibt: „Süßkartoffeln: Sie sind laut der amerikanischen Gesundheitsbehörde CSPI eines der nährstoffreichsten Gemüse.“ CSPI steht nach unserem Wissen für das Center for Science in the Public Interest, eine US-Verbraucherorganisation, keine Behörde. Eine Quelle nennt die Seite nicht. Ginseng wird als „Heilpflanze“ im asiatischen Raum beschrieben. Superfoods wie Himbeeren und Heidelbeeren stehen mit 0,01 % in der Liste.</p>

${PREIS({ sorte: "Dark Forest", einmal: "74,99 €", abo: "59,99 €", kgEinmal: "6,00 €", kgAboErst: "4,80 €", kgAboDanach: "5,40 €", tag: "1,56 €", kg: "etwa 260 g", extra: "Für einen 40-kg-Hund (400 bis 480 g) sind es rund 2,60 €." })}

${STIMMEN}

@@TOTAL@@
<p>Anerkannt haben wir das Wild als erste Zutat, den fairen Preis pro Tag und die Zutatenliste mit Mengen für die Hauptzutaten. Punkte kosten das Badge „Hypoallergen“, die fehlenden Angaben, der niedrige Proteingehalt und die Werbung mit Superfoods und Heilpflanzen.</p>`,
  }),
  build({
    slug: "wolfsblut-cold-river-adult-forelle-test", produkt: "Cold River Adult (Forelle mit Süßkartoffeln)", sorte: "Cold River Adult", keyword: "Forelle Trockenfutter Hund getreidefrei",
    url: "https://www.wolfsblut.com/wolfsblut-adult-cold-river-forelle-und-susskartoffel-trockenfutter-12-5-kg.html", fleisch: "Forelle",
    image: "wolfsblut-cold-river-forelle-trockenfutter-hund.webp", imageAlt: "Hund wartet vor einem Napf mit neuem Futter, Illustration", contentImage: "wolfsblut-cold-river-forelle-kroketten-hund.webp", contentImageAlt: "Nahaufnahme von Trockenfutter-Kroketten, Illustration",
    composition: "Fisch 38 % (frische Forelle 25 %, getrockneter Lachs 6,5 %, getrocknete Forelle 6,5 %), Süßkartoffeln 32 %, Kartoffeln, Lachsöl, Lachsfond, Mineralstoffe, Fenchel, Kichererbsen, Kürbis, Pastinaken, Meeresalgen 0,3 %, Topinambur, Thymian, Majoran, Oregano, Petersilie, Salbei 0,1 %, Tomaten, Brennnessel, Weißdorn, Löwenzahn 0,04 %, Ginseng, Mannan-Oligosaccharide (MOS), Fructo-Oligosaccharide (FOS), Spirulina, Yucca Schidigera Extrakt",
    analysis: [{ name: "Rohprotein", value: 18.5 }, { name: "Rohfett", value: 9.5 }, { name: "Rohasche", value: 8.5 }, { name: "Rohfaser", value: 3 }],
    scores: { scoreRaw: 21, scoreHarmful: 15, scoreNutrients: 12, scoreNeeds: 6, scoreValue: 2 },
    pricePerKg: 6.0, price: 74.99, pricePerDay: 1.53, daysAgo: 12.4, hypo: false,
    special: [
      c("Frische und gut bekömmliche Forelle als Hauptbestandteil", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Fisch macht 38 % aus (frische Forelle 25 %). Die Süßkartoffeln (32 %) und Kartoffeln zusammen sind der größte Einzelanteil; „Hauptbestandteil“ ist die Forelle nur in der Fleischkategorie."),
      c("Forelle und Lachs enthalten einen hohen Anteil an Omega-3-Fettsäuren, verfügen über viel Eisen, Magnesium und Kalium, sind reich an Vitamin B6 und Protein", "ZULAESSIG", "VO (EG) 767/2009 Art. 11 Abs. 1", "Allgemeine Aussage über Fisch; passt zu Lachsöl und Fischanteil in der Zusammensetzung. Eine Angabe zum Omega-3-Gehalt des Futters fehlt."),
      c("Mit wertvollen Superfoods wie Süßkartoffeln, Kichererbsen, Fenchel sowie Topinambur, Ginseng und Spirulina", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Süßkartoffeln, Kichererbsen und Kartoffeln sind Stärkelieferanten, keine Superfoods im Sinne einer belegten Wirkung. Mengen für Ginseng, Spirulina und Topinambur nennt die Seite nicht."),
      c("Eigenschaftsliste: „Ohne künstliche Zusatzstoffe“", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Das Futter enthält DL-Methionin, Taurin, Zink- und Kupferverbindungen und Vitamin E als all-rac-alpha-Tocopherylacetat, also synthetisch hergestellte Zusatzstoffe. Die Einschränkung „ausgenommen Vitamine & Mineralstoffe“ steht an anderer Stelle, nicht bei dieser Eigenschaft."),
      c("Spirulina: Die Algen sind reich an hochwertigen Proteinen und haben einen hohen Gehalt an Vitamin B12 und Eisen.", "FRAGWUERDIG", "UWG § 5", "Für diesen Anteil gibt die Liste keine Menge an; die Aussage beschreibt Spirulina allgemein, nicht den Beitrag im Futter."),
      c("Ein Geschmacksklassiker, der sehr gern gefressen wird", "ZULAESSIG", "VO (EG) 767/2009 Art. 11 Abs. 1", "Beschreibt die Akzeptanz ohne Gesundheitswirkung."),
    ],
    pros: [
      "Fisch 38 % (frische Forelle 25 %, Lachs 6,5 %, Forelle 6,5 %) mit Prozentangaben; Lachsöl und Meeresalgen als Omega-3-Quellen; ohne Getreide, Mais, Soja und Gluten",
      "Preis 74,99 € für 12,5 kg (6,00 €/kg), rund 1,53 € am Tag für einen 20-kg-Hund; Fütterungstabelle und 50 Tage Rückgabefrist für ungeöffnete Säcke",
      "Eine Sorte ohne Geflügel und Rind für Hunde, die diese Proteine meiden sollen (Einzelfall, Tierarztpraxis fragen); Taurin und L-Carnitin ausgewiesen",
    ],
    cons: [
      "Süßkartoffeln 32 % plus Kartoffeln sind größer als der Fischanteil von 38 % zusammen mit dem Rest; Rohprotein nur 18,5 % – der niedrigste Wert der drei Sorten",
      NACHTEIL_FEHLT,
      "„Ohne künstliche Zusatzstoffe“ trotz DL-Methionin und synthetischer Vitamine; Superfood-Werbung für Stärkelieferanten; im Sortiment gab es 2022/2023 Bleirückrufe bei Fischfutter („Atlantic Tuna“)",
    ],
    verdictCore: "Ein fischreiches, getreidefreies Futter mit offener Liste und fairem Preis pro Tag. Abzüge: viel Süßkartoffel und Kartoffel, niedrigster Proteingehalt der drei Sorten (18,5 %), „ohne künstliche Zusatzstoffe“ trotz DL-Methionin, fehlende Angaben zu Feuchte, Energie, Omega-3 und Mineralstoffen.",
    teaserCore: "Fisch 38 %, fairer Preis – aber viel Süßkartoffel, nur 18,5 % Protein.",
    conclusion: `<p>Cold River ist eine brauchbare Fischvariante für Hunde, die Geflügel und Rind meiden sollen. Die Rezeptur hat viel Stärke und wenig Protein; „ohne künstliche Zusatzstoffe“ stimmt nicht wörtlich. Wer sich für Fischfutter entscheidet, sollte die Rückrufhistorie der Marke bei Fisch (Blei bei „Atlantic Tuna“) im Blick behalten und Schwermetalle bei Fischfutter aufmerksam verfolgen.</p>`,
    keywords: ["Wolfsblut Cold River", "Wolfsblut Forelle Test", "Forelle Trockenfutter Hund", "getreidefreies Hundefutter Fisch", "Wolfsblut Erfahrungen"], descCore: "38 % Fisch, 32 % Süßkartoffeln, nur 18,5 % Rohprotein, „ohne künstliche Zusatzstoffe“.",
    body: `<p>„Ohne künstliche Zusatzstoffe“, „Frische und gut bekömmliche Forelle als Hauptbestandteil“: So steht es auf der Produktseite von <strong>Cold River Adult</strong> (${CHECKED}). Wir prüfen Rezeptur und Werbung.</p>
${METHODE("https://www.wolfsblut.com/wolfsblut-adult-cold-river-forelle-und-susskartoffel-trockenfutter-12-5-kg.html", "den 12,5-kg-Sack Cold River Adult")}

<h2>Zusammensetzung: Fisch und viel Süßkartoffel</h2>
<p>Cold River ist ein „Alleinfuttermittel für ausgewachsene Hunde“. Zutaten: <strong>Fisch 38 %</strong> (frische Forelle 25 %, getrockneter Lachs 6,5 %, getrocknete Forelle 6,5 %), <strong>Süßkartoffeln 32 %</strong>, Kartoffeln, Lachsöl, Lachsfond, Mineralstoffe, Fenchel, Kichererbsen, Kürbis, Pastinaken, Meeresalgen 0,3 % und viele Kräuter, Beeren und Algen, überwiegend ohne Mengen. Süßkartoffeln und Kartoffeln liefern zusammen vermutlich mehr als ein Drittel des Futters.</p>
<p><strong>Analytische Bestandteile:</strong> Rohprotein 18,5 %, Rohfett 9,5 %, Rohasche 8,5 %, Rohfaser 3 %. Zusatzstoffe je kg wie bei den anderen Sorten (u. a. Vitamin A 21.871 IE, D3 1.471 IE, E 710 mg, Zink 150 mg, DL-Methionin 2.126 mg, L-Carnitin 82 mg, Taurin 1.000 mg). Feuchte, Energie, Calcium, Phosphor, Natrium und der Omega-3-Gehalt fehlen auf der Produktseite; Antioxidantien nennt sie nicht.</p>

<h2>Fütterung</h2>
<p>1–5 kg: 30–90 g, 5–15 kg: 90–210 g, 15–25 kg: 210–300 g, 25–35 kg: 300–390 g, 35–45 kg: 390–470 g, über 45 kg: ab 470 g am Tag, als Orientierung.</p>

<h2>„Ohne künstliche Zusatzstoffe“?</h2>
<p>In der Eigenschaftsliste steht „Ohne künstliche Zusatzstoffe“, bei den Werbepunkten „Ohne Mais, Gluten, Soja, Geschmacksverstärkern &amp; künstlichen Zusätzen (ausgenommen Vitamine &amp; Mineralstoffe)“. Das Futter enthält aber DL-Methionin (2.126 mg je kg), Taurin und Vitamin E als all-rac-alpha-Tocopherylacetat, dazu Zink- und Kupferverbindungen. Das sind Zusatzstoffe, die technisch hergestellt werden. Die Einschränkung in Klammern deckt Vitamine und Mineralstoffe ab, nicht Aminosäuren. Wir stufen die Aussage in der Eigenschaftsliste als fragwürdig ein.</p>

<h2>Fisch, Blei und Rückrufe der Marke</h2>
<p>Cold River ist ein Fischfutter. Fisch kann Schwermetalle enthalten, deshalb sind Rückrufe bei Fischfutter wichtig. Wolfsblut hatte 2022 und 2023 Rückrufe bei „Atlantic Tuna“ wegen erhöhter Bleiwerte (siehe unten). Für Cold River selbst haben wir keinen Rückruf gefunden. Angaben zu Schwermetallwerten macht die Produktseite nicht.</p>

${PREIS({ sorte: "Cold River", einmal: "74,99 €", abo: "59,99 €", kgEinmal: "6,00 €", kgAboErst: "4,80 €", kgAboDanach: "5,40 €", tag: "1,53 €", kg: "etwa 255 g", extra: "Für einen 40-kg-Hund (390 bis 470 g) sind es rund 2,60 €." })}

${STIMMEN}

@@TOTAL@@
<p>Anerkannt haben wir den hohen Fischanteil, die Omega-3-Quellen, den fairen Preis pro Tag und die Zutatenliste mit Mengen für die Hauptzutaten. Punkte kosten die Stärkemenge, den niedrigen Proteingehalt, die fehlenden Angaben und die Eigenschaft „ohne künstliche Zusatzstoffe“.</p>`,
  }),
];
