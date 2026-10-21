/**
 * Zwei Tests der Marke Happy Dog (Okt. 2026): Sensible Africa (Strauß) und Sensible India (vegetarisch).
 * Nur als Entwurf: freigegeben bleibt false, bis die Rechtsprüfung durch ist (wie bei den Tests vom 17.10.).
 * Quellen: happydog.de (Africa, Abruf 21.10.2026), happydog.at (India, Zusammensetzung und Analyse; deutsche Produktseite nicht gefunden).
 */
const a = (u: string, l: string) => `<a href="${u}">${l}</a>`;
type Rating = "ZULAESSIG" | "FRAGWUERDIG" | "UNZULAESSIG";
type Claim = { claim: string; rating: Rating; legal: string; reason: string; imageUrl: string };
const c = (claim: string, rating: Rating, legal: string, reason: string): Claim => ({ claim, rating, legal, reason, imageUrl: "" });
const CHECKED = "abgerufen am 21.10.2026";
const SHOP_DE = "https://happydog.de";
const SHOP_AT = "https://happydog.at";

type Def = {
  slug: string; sorte: string; produkt: string; keyword: string; url: string;
  composition: string; analysis: { name: string; value: number }[];
  scores: { scoreRaw: number; scoreHarmful: number; scoreNutrients: number; scoreNeeds: number; scoreValue: number };
  claims: Claim[]; pricePerKg: number; price: number; pricePerDay: number | null; priceText: string;
  pros: string[]; cons: string[]; teaserCore: string; verdictCore: string; descCore: string;
  bodyCore: string; conclusion: string;
};
const PRICE_DATE = "2026-10-21T09:00:00.000Z";
const TESTED_AT = "2026-10-16T08:00:00.000Z";

const GEMEINSAM = (fr: number, unz: number) => ` <strong>Strenge Wertung:</strong> Jede fragwürdige Werbeaussage kostet einen Punkt bei der Deklaration, jede unzulässige drei, höchstens 15; hier sind es ${fr} fragwürdige und ${unz} unzulässige Aussagen.`;

const MARKE = `<h2>Die Marke Happy Dog</h2>
<p>Happy Dog ist eine Marke der Interquell GmbH (Angabe auf der Produktseite, ${a(`${SHOP_DE}/probiertasche/happy-dog-probiertasche-sensible-india`, "happydog.de")}). Im Frühjahr 2024 rief das Unternehmen mehrere Trockenfutter wegen Salmonellen zurück (Sorten Puppy, Sensible France und Junior; Quelle: ${a("https://www.lgl.bayern.de/lebensmittel/ueberwachung/lebensmittelwarnungen/doc/happy_dog_heimtierfuttermittel.pdf", "LGL Bayern")}). Diese Sorten sind nicht Gegenstand dieses Tests. Ein Rückruf von Snacks aus November 2025 betrifft ein anderes Produkt; eine Stiftung-Warentest-Prüfung wies dort Salmonellen nach (${a("https://www.test.de/Produktrueckruf-Hundesnacks-koennen-Salmonellen-enthalten-6265997-0/", "test.de")}).</p>`;

const METHODE = (url: string, produkt: string) => `<h2>Wie wir getestet haben</h2>
<p>Wir haben das Futter nicht im Labor analysiert und nicht an Hunden erprobt. Grundlage sind die Angaben von Happy Dog (${a(url, produkt)}, ${CHECKED}). Wir bewerten nach unserem 100-Punkte-Schema und nach den Regeln der Futtermittelkennzeichnung (VO (EG) 767/2009) und des Wettbewerbsrechts (UWG). Die Einstufung der Werbeaussagen ist unsere begründete Einschätzung und keine rechtsverbindliche Feststellung. Die Bilder sind neutrale Illustrationen, keine Herstellerfotos.</p>`;

const KAUF = (d: Def) => `<h2>Preis, Fütterung und Bezug</h2>
<p>${d.priceText}</p>`;

const STIMMEN = `<h2>Was Käufer berichten</h2>
<p>Bewertungen auf den Produktseiten haben wir nicht ausgewertet, weil sie im abgerufenen Quelltext nicht enthalten waren. Eigene Anwenderberichte liegen uns nicht vor. Auszeichnungen, die Happy Dog nennt, sind Herstellerangaben und keine von uns geprüften Testergebnisse.</p>`;

const FOOT = `<p><em>Hinweis:</em> Alle Zitate stammen von den genannten Seiten (Stand 21.10.2026). Preise und Texte können sich ändern. Bei Futtermittelunverträglichkeit oder Allergien klärt die Tierarztpraxis die Ursache ab; kein Futter ersetzt diese Abklärung.</p>`;

function build(d: Def) {
  const fr = d.claims.filter((x) => x.rating === "FRAGWUERDIG").length;
  const unz = d.claims.filter((x) => x.rating === "UNZULAESSIG").length;
  const decl = Math.max(0, 15 - fr - 3 * unz);
  const scores = { ...d.scores, scoreDeclaration: decl };
  const total = Object.values(scores).reduce((s, v) => s + v, 0);
  const ampel = total >= 80 ? "Grün" : total >= 60 ? "Gelb" : "Rot";
  const ampelWort = total >= 80 ? "grünen" : total >= 60 ? "gelben" : "roten";
  const title = `Happy Dog ${d.sorte} im Test: ${total}/100 Punkte`;
  return {
    categorySlug: "alleinfuttermittel-hund", brand: "Happy Dog", slug: d.slug, title, productName: d.produkt, keyword: d.keyword,
    priceClass: "PREMIUM" as const, pricePerKg: d.pricePerKg, packageSize: "300 g Trockenfutter", price: d.price, pricePerDay: d.pricePerDay,
    imageAlt: "Hund vor einem Napf mit Trockenfutter, Illustration",
    contentImageAlt: "Hund vor einem Napf mit Trockenfutter, Illustration",
    gallery: [] as string[],
    composition: d.composition, analysis: d.analysis, scores, claims: d.claims,
    verdict: `${d.verdictCore} ${total} Punkte, Ampel ${ampel}.`,
    teaser: `${d.teaserCore} ${total} Punkte.`,
    pros: d.pros, cons: d.cons,
    metaTitle: title,
    metaDescription: `Happy Dog ${d.sorte} im Test: ${d.descCore} Werbeaussagen-Check, Zusammensetzung, Preis. ${total} von 100 Punkten.`,
    keywords: [`Happy Dog ${d.sorte}`, "Happy Dog Test", d.keyword],
    priceDate: PRICE_DATE, testedAt: TESTED_AT, freigegeben: false as const,
    imageUrl: `/tests/happy-dog-sensible-illustration.webp`, contentImageUrl: `/tests/happy-dog-sensible-illustration.webp`,
    bodyHtml: `<p>${d.bodyCore.split("|")[0]}</p>
${METHODE(d.url, "Produktseite des Herstellers")}
<h2>Zusammensetzung</h2>
<p>${d.composition}</p>
<p><strong>Analytische Bestandteile:</strong> ${d.analysis.map((x) => `${x.name} ${String(x.value).replace(".", ",")} %`).join(", ")}.</p>
${d.bodyCore.split("|")[1] ?? ""}
<h2>Werbeaussagen im Check</h2>
<p>Wir haben die Aussagen der Produktseite einzeln eingestuft (Liste in der Tabelle des Tests). ${d.bodyCore.split("|")[2] ?? ""}</p>
${KAUF(d)}
${MARKE}
${STIMMEN}
<p><strong>Unser Gesamtergebnis: ${total} von 100 Punkten.</strong> Nach unserem Bewertungsschema liegt ${d.sorte} im ${ampelWort} Bereich.${GEMEINSAM(fr, unz)}</p>
${FOOT}`,
    conclusionHtml: `<p>${d.conclusion}</p>`,
  };
}

export const HAPPYDOG_TESTS = [
  build({
    slug: "happy-dog-sensible-africa-test", sorte: "Sensible Africa", produkt: "Happy Dog Sensible Africa (Strauß und Kartoffel)",
    keyword: "Happy Dog Africa Strauß Trockenfutter", url: `${SHOP_DE}/hundefutter/trockenfutter/happy-dog-sensible-africa-60300`, 
    composition: "Kartoffel*, Straußenprotein* (15 %), Kartoffelprotein*, Öle und Fette, Rübenmelasseschnitzel* (entzuckert), hydrolisiertes Protein, Apfeltrester*, Natriumchlorid, Hefe* (extrahiert); *) getrocknet",
    analysis: [{ name: "Rohprotein", value: 20 }, { name: "Rohfett", value: 10 }, { name: "Rohfaser", value: 3 }, { name: "Rohasche", value: 7.5 }, { name: "Calcium", value: 1.2 }, { name: "Phosphor", value: 0.8 }],
    scores: { scoreRaw: 16, scoreHarmful: 12, scoreNutrients: 15, scoreNeeds: 7, scoreValue: 2 },
    claims: [
      c("Exotischer Strauß als einzige tierische Proteinquelle", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Die Zusammensetzung nennt Straußenprotein (15 %). Zusätzlich stehen „hydrolisiertes Protein“ ohne Tierart und „Öle und Fette“ ohne Herkunft in der Liste. Ob Strauß die einzige tierische Quelle ist, lässt sich daraus nicht sicher ableiten."),
      c("Monoprotein", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Der Begriff setzt voraus, dass nur eine tierische Eiweißquelle enthalten ist. Wegen des hydrolisierten Proteins ohne Tierart ist die Angabe nicht belegt."),
      c("Tierärztlich empfohlen bei Futtermittelunverträglichkeit", "UNZULAESSIG", "VO (EG) 767/2009 Art. 13 Abs. 3; UWG § 5", "Die Aussage verbindet das Futter mit einer Erkrankung (Unverträglichkeit) und einer tierärztlichen Empfehlung. Beides ist auf der Seite nicht belegt: kein Name, keine Studie, kein Zeitraum."),
      c("Ideale Ernährung für Hunde mit Allergien und Futtermittelunverträglichkeiten", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 3", "Eine Eignung für Hunde mit Allergien ist eine krankheitsbezogene Aussage. Ein Nachweis fehlt, und ein Futter kann Allergien nicht verhindern oder behandeln."),
      c("Wertvolle Omega-3- und Omega-6-Fettsäuren für gesunde Haut und ein glänzendes Fell", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Die Analyse nennt Omega-3 0,4 % und Omega-6 4,0 %. Der Zusammenhang mit Haut und Fell ist allgemein plausibel, wird aber nicht belegt, und es fehlt eine Angabe zur Menge, die den Effekt auslöst."),
      c("Optimale Verträglichkeit durch Strauß als seltene, exklusive Proteinquelle", "FRAGWUERDIG", "UWG § 5", "„Optimale Verträglichkeit“ ist eine Wirkaussage ohne Beleg. „Exklusiv“ ist keine Eigenschaft des Futters, sondern eine Marketingangabe."),
      c("Kartoffeln enthalten kein Gluten", "ZULAESSIG", "VO (EG) 767/2009 Art. 11 Abs. 1", "Die Aussage ist sachlich richtig, Kartoffeln sind glutenfrei. Sie steht im Text ohne Behauptung über Wirkung."),
      c("Getreidefreie Vollnahrung, ab 11 kg, für ausgewachsene Hunde", "ZULAESSIG", "VO (EG) 767/2009 Art. 11 Abs. 1", "Die Zusammensetzung enthält kein Getreide. Die Fütterungstabelle nennt Mengen ab 11 kg. Die Bezeichnung „Alleinfuttermittel“ steht auf der Produktseite nicht; das Etikett haben wir nicht geprüft."),
    ],
    pricePerKg: 9.3, price: 2.79, pricePerDay: 2.42,
    priceText: "Die 300-g-Packung kostet laut Shop einmalig 2,79 € (9,30 € je kg); in der Einstiegsaktion 1,39 €. Im Abo steht die Packung auf 1,32 €. Die Fütterungstabelle nennt für einen 20-kg-Hund im Normalbedarf 260 g am Tag; zum Normalpreis sind das rund 2,42 € Tageskosten. Größere Gebinde (1, 4 und 12,5 kg) bietet der Shop an; deren Preise haben wir nicht erfasst.",
    pros: [
      "Kurze Zusammensetzung mit Kartoffel als Hauptbestandteil und einem Strauß-Anteil von 15 %, kein Getreide, offen deklarierte Zusatzstoffe mit Mengen (Taurin 500 mg/kg, Vitamin D3 900 I.E./kg)",
      "Nährstoffwerte im üblichen Bereich: Rohprotein 20 %, Fett 10 %, Calcium 1,2 % und Phosphor 0,8 %, also ein Verhältnis von etwa 1,5 zu 1",
      "Fütterungstabelle nach Gewicht und Bewegung; 300-g-Packung zum Ausprobieren",
    ],
    cons: [
      "Die Aussagen „Monoprotein“ und „einzige tierische Proteinquelle“ widersprechen dem „hydrolisierten Protein“ ohne Tierart in der Liste",
      "„Tierärztlich empfohlen“ und die Eignung „für Hunde mit Allergien“ sind krankheitsbezogen und nicht belegt",
      "Kein Hinweis auf Schadstoffprüfungen, keine Feuchte- und Energieangabe; 9,30 € je kg (Einmalkauf) ist ein hoher Preis",
    ],
    teaserCore: "Strauß und Kartoffel, getreidefrei – aber „Monoprotein“ trotz Protein ohne Tierart.",
    verdictCore: "Getreidefreies Trockenfutter mit Strauß und Kartoffel und üblichen Nährwerten. Abzüge: Monoprotein- und Allergieaussagen nicht belegt, eine tierärztliche Empfehlung wird ohne Nachweis behauptet, hoher Preis.",
    descCore: "Strauß und Kartoffel, getreidefrei, 9,30 € je kg.",
    bodyCore: "Happy Dog bewirbt Sensible Africa als Vollnahrung mit Strauß für ernährungssensible Hunde.|<p>Die Liste beginnt mit Kartoffel und Straußenprotein, ein Getreideanteil fehlt. Auffällig ist das „hydrolisierte Protein“ ohne Angabe der Tierart: Es passt nicht zur Aussage „Monoprotein“.</p>|<p>Die Wirkaussagen auf der Produktseite, zu Allergien, Unverträglichkeiten und Verdauung, sind nicht belegt; die Aussage „tierärztlich empfohlen“ ist ohne Quelle.</p>",
    conclusion: "Sensible Africa ist ein getreidefreies Trockenfutter mit Strauß und Kartoffel, das in der Nährstoffbilanz unauffällig ist. Wer es bei Unverträglichkeiten einsetzen will, sollte die Zutatenliste auf der Packung und die Tierarztpraxis einbeziehen, nicht die Produktseite.",
  }),
  build({
    slug: "happy-dog-sensible-india-test", sorte: "Sensible India", produkt: "Happy Dog Sensible India (vegetarisch, Reis und Erbsen)",
    keyword: "Happy Dog India vegetarisch Trockenfutter", url: `${SHOP_AT}/hundefutter/trockenfutter/happy-dog-sensible-india`, 
    composition: "Reis 43 %, Reisprotein, Erbsenflocken 8 %, Öle und Fette, Hefehydrolysat, Lignocellulose, Rübentrockenschnitzel, Hefe, Monocalciumphosphat, Apfeltrester, Calciumcarbonat, Natriumchlorid, Trockenvollei, Chicoréepulver, Cranberries 0,1 %, Kokos 0,1 %, Magnesiumoxid, Kurkuma 0,05 %",
    analysis: [{ name: "Rohprotein", value: 24 }, { name: "Rohfett", value: 10 }, { name: "Rohfaser", value: 5 }, { name: "Rohasche", value: 6 }, { name: "Calcium", value: 1.15 }, { name: "Phosphor", value: 0.7 }],
    scores: { scoreRaw: 16, scoreHarmful: 12, scoreNutrients: 16, scoreNeeds: 8, scoreValue: 2 },
    claims: [
      c("Vegetarisches Trockenfutter mit Reis, Erbsen und Kurkuma", "ZULAESSIG", "VO (EG) 767/2009 Art. 11 Abs. 1", "Die Zusammensetzung enthält kein Fleisch und keinen Fisch. Trockenvollei ist vegetarisch zulässig. Die Angabe passt zur Liste."),
      c("Keinen Weizen, weizenfrei", "ZULAESSIG", "VO (EG) 767/2009 Art. 11 Abs. 1", "In der Zusammensetzung steht kein Weizen. Die Angabe stimmt."),
      c("Leicht verdaulicher Reis, besonders leicht bekömmlich, magenfreundlich", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Bekömmlichkeit ist eine Wirkaussage ohne Studie oder Verträglichkeitsprüfung. Reis ist als Zutat gut verträglich; das Futter ist deshalb nicht automatisch magenfreundlich."),
      c("Kurkuma unterstützt die Verdauung", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1; UWG § 5", "Der Kurkuma-Anteil beträgt 0,05 %. Eine verdauungsfördernde Wirkung in dieser Menge ist nicht belegt."),
      c("Omega-3- und Omega-6-Fettsäuren unterstützen glänzendes Fell und intakte Haut; Kokosnuss unterstützt Haut und Fell", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Kokos ist mit 0,1 % enthalten. Ein messbarer Effekt auf Haut und Fell ist nicht belegt. Die Analyse nennt Omega-3 nicht."),
      c("Auch Hunde mit Futtermittelunverträglichkeiten kommen voll auf ihre Kosten", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 3; UWG § 5", "Die Aussage zielt auf eine Krankheitsgruppe. Ein Verträglichkeitsnachweis fehlt."),
      c("Zweifach ausgezeichnet: FutterTester.de (9,3 von 10) und pet Produkt 2021/2022", "FRAGWUERDIG", "UWG § 5", "Die Auszeichnungen nennt der Hersteller selbst. Wir haben sie nicht nachgeprüft, und ein Test mit 9,3 von 10 Punkten ist nicht unser Verfahren."),
      c("Von Ernährungswissenschaftlern als Alleinfuttermittel entwickelt", "FRAGWUERDIG", "UWG § 5", "Namen, Qualifikation und Umfang der Beteiligung fehlen. Die Kennzeichnung „Alleinfuttermittel für ausgewachsene, normalaktive Hunde ab 11 kg“ steht dagegen auf der Seite."),
      c("Mit der rein pflanzlichen Rezeptur wird der Nährstoffbedarf vollständig abgedeckt", "UNZULAESSIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "„Rein pflanzlich“ ist falsch: Die Zusammensetzung nennt Trockenvollei, also ein tierisches Produkt. Die Aussage täuscht über die Zusammensetzung. Eine vegetarische Angabe ist dagegen zulässig."),
    ],
    pricePerKg: 8.77, price: 2.63, pricePerDay: null,
    priceText: "Auf happydog.at kostet die 300-g-Packung 2,63 € (8,77 € je kg), in der Einstiegsaktion 1,31 €. Einen Preis für den deutschen Shop haben wir nicht gefunden; dort ist nur die Probiertasche mit 3 × 300 g gelistet. Eine Tagesmenge haben wir nicht ermittelt, deshalb nennen wir keine Tageskosten.",
    pros: [
      "Vegetarisch und weizenfrei, mit Reis (43 %) als Hauptbestandteil und Erbsen (8 %); Kurkuma, Kokos und Cranberries sind genannt",
      "Nährstoffwerte gut: Rohprotein 24 %, Fett 10 %, Calcium 1,15 % und Phosphor 0,7 %, also ein Verhältnis von etwa 1,6 zu 1; Taurin 2000 mg/kg und L-Carnitin ausgewiesen",
      "Zusatzstoffe mit Mengen ausgewiesen (Vitamin A, Vitamin D3, Vitamin B12, Taurin, Spurenelemente, DL-Methionin)",
    ],
    cons: [
      "Die Aussage „rein pflanzlich“ widerspricht dem Trockenvollei in der Liste und ist deshalb unzulässig",
      "Füllstoffe: Lignocellulose, Rübentrockenschnitzel und Apfeltrester machen die Rezeptur weniger wertvoll",
      "Verdauungs-, Haut- und Fell-Aussagen sowie Auszeichnungen sind nicht belegt; die Sorte gibt es im deutschen Shop nur als Probiertasche",
    ],
    teaserCore: "Vegetarisch, Reis und Erbsen, weizenfrei – aber „rein pflanzlich“ trotz Trockenvollei.",
    verdictCore: "Vegetarisches Trockenfutter mit Reis, Erbsen und guten Nährwerten. Abzüge: Die Aussage „rein pflanzlich“ ist falsch, mehrere Wirk- und Auszeichnungsaussagen sind nicht belegt, Füllstoffe in der Liste.",
    descCore: "Vegetarisch mit Reis und Erbsen, weizenfrei, Kurkuma.",
    bodyCore: "Happy Dog bewirbt Sensible India als vegetarisches Trockenfutter mit Reis, Erbsen und Kurkuma für sensible Hunde.|<p>Die Liste beginnt mit Reis (43 %) und Erbsenflocken (8 %). Trockenvollei ist ein tierisches Produkt. Damit ist die Aussage „rein pflanzlich“ unzulässig, auch wenn „vegetarisch“ stimmt.</p><p>Die Herkunft der Angaben: Eine deutsche Produktseite zu dieser Sorte haben wir nicht gefunden; die deutsche Probiertasche mit 3 × 300 g beschreibt dieselbe Rezeptur. Zusammensetzung und analytische Bestandteile stammen deshalb von der österreichischen Produktseite.</p>|<p>Die Wirkaussagen zu Verdauung, Haut, Fell und Unverträglichkeiten sind nicht belegt. Die Auszeichnungen nennt der Hersteller selbst.</p>",
    conclusion: "Sensible India ist ein vegetarisches Trockenfutter mit Reis und Erbsen, nährstofflich solide, aber mit Füllstoffen und mehreren unbelegten Aussagen. Die Bezeichnung „rein pflanzlich“ sollten Sie nicht übernehmen; sie ist falsch.",
  }),
];
