/**
 * Fünf Produkt-Tests vom 17.10.2026, nur als Entwurf.
 * Grundlage: Amazon-Produktseiten (Abruf 17.10.2026). Bilder: Hotlinks auf m.media-amazon.com, nicht heruntergeladen.
 * freigegeben bleibt false, bis die Rechtsprüfung durch ist.
 * Nach Freigabe sofort veröffentlichen, ohne gestaffelte Termine.
 * Teilnoten: Skala der Tests vom 16.10. (CRITERIA). Ein Feld für „Transparenz / Herstellerunterlagen“ speichert die Datenbank nicht.
 */
const D = "17.10.2026";
const TAG = "cyberni7400-21";

type Claim = { claim: string; rating: "ZULAESSIG" | "FRAGWUERDIG" | "UNZULAESSIG"; legal: string; reason: string; imageUrl: string };
type Scores = { scoreRaw: number; scoreHarmful: number; scoreNutrients: number; scoreDeclaration: number; scoreNeeds: number; scoreValue: number };

const c = (claim: string, rating: Claim["rating"], legal: string, reason: string): Claim => ({ claim, rating, legal, reason, imageUrl: "" });
const amz = (asin: string) => `https://www.amazon.de/dp/${asin}?tag=${TAG}`;
/** Belegquellen ohne Partnertag. Kauf- und Bildlinks bleiben bei amz(). */
const src = (asin: string) => `https://www.amazon.de/dp/${asin}`;
const pic = (id: string) => `https://m.media-amazon.com/images/I/${id}._AC_SL1500_.jpg`;
const a = (href: string, label: string) => `<a href="${href}">${label}</a>`;

const METHODE = (asin: string) => `<h2 id="wie-wir-getestet-haben">Wie wir getestet haben</h2>
<p>Wir haben das Futter weder im Labor analysiert noch an Tieren erprobt. Grundlage sind die Angaben auf der Amazon-Produktseite (${a(src(asin), "amazon.de")}, abgerufen am ${D}), ergänzt nur dort, wo etwas fehlt, und dann mit Quelle und Datum. Bewertet wird nach unserem 100-Punkte-Schema und nach den Regeln der Futtermittelkennzeichnung (VO (EG) 767/2009) und des Wettbewerbsrechts (UWG). Die Einstufung der Werbeaussagen ist unsere begründete Einschätzung, keine rechtsverbindliche Feststellung. Bild: Amazon-Produktseite. Unsere Note gilt für die Rezeptur, die dieses Listing am ${D} zeigt. Welche Packung ein Händler ausliefert, können wir nicht prüfen.</p>
<div class="fp-box fp-info space-y-2 rounded-2xl border border-border bg-bg-soft p-5"><p class="text-sm font-extrabold text-brand-strong">ℹ️ Methodik dieser fünf Tests</p><p>Die Note setzt sich aus sechs Teilnoten zusammen: Rohstoffe 30, Schadstoffe 20, Nährstoffe 20, Deklaration 15, Bedarf 10, Preis-Leistung 5 Punkte. Ab 80 Punkten Grün, ab 60 Gelb, darunter Rot. Die Schadstoff-Teilnote beruht auf Zusammensetzung und Deklaration, nicht auf eigenen Laborwerten.</p></div>`;

const FOOT = `<p><em>Hinweis:</em> Alle Zitate stammen von den genannten Seiten (Stand ${D}). Preise und Texte können sich ändern. Hersteller können uns Belege zukommen lassen.</p>`;
const STRENG = (f: number, u: number) => `<strong>Strenge Wertung:</strong> Jede fragwürdige Werbeaussage kostet einen Punkt bei der Deklaration, jede von uns als irreführend eingestufte drei; hier sind es ${f} fragwürdige und ${u} als irreführend eingestufte Aussagen.`;

const figure = (id: string, alt: string, asin: string) => `<figure><a href="${amz(asin)}" rel="sponsored nofollow noopener"><img src="${pic(id)}" alt="${alt}"></a><figcaption>Bild: Amazon-Produktseite (Stand ${D}) · Werbung: Bild verlinkt zu Amazon*</figcaption></figure>`;
/** Ohne Kauflink, solange Amazon kein Angebot zeigt. */
const figurePlain = (id: string, alt: string) => `<figure><img src="${pic(id)}" alt="${alt}"><figcaption>Bild: Amazon-Produktseite (Stand ${D})</figcaption></figure>`;
const cta = (asin: string, name: string) => `<div class="cta-box fp-box fp-cta space-y-2 rounded-2xl border border-accent bg-surface p-5 shadow-card"><p><a href="${amz(asin)}" rel="sponsored nofollow noopener"><strong>Werbung: ${name} bei Amazon ansehen*</strong></a></p><p class="text-xs text-muted">*Werbung/Affiliate-Link: Kaufen Sie darüber, erhalten wir eine Provision. Der Preis ändert sich für Sie nicht. Als Amazon-Partner verdiene ich an qualifizierten Verkäufen.</p></div>`;
const quellen = (items: string) => `<div class="fp-box fp-quellen space-y-2 rounded-2xl border border-border bg-bg-soft p-5 text-sm"><h2 id="quellen">Quellen (abgerufen am ${D})</h2><ol>${items}</ol></div>`;

const BASE = { gallery: [] as string[], freigegeben: false as const, priceDate: "2026-10-17T09:00:00.000Z", testedAt: "2026-10-17T08:00:00.000Z" };

export const DAILY_OKT17_TESTS = [
  {
    ...BASE,
    categorySlug: "alleinfuttermittel-hund",
    brand: "MERA",
    slug: "mera-essential-brocken-test",
    title: "MERA Essential Brocken im Test",
    productName: "Essential Brocken, Trockenfutter für Hunde, 2 × 2 kg",
    keyword: "MERA Essential Brocken",
    priceClass: "GUENSTIG" as const,
    pricePerKg: 3.69,
    packageSize: "2 × 2 kg (4 kg)",
    price: 14.75,
    pricePerDay: 1.0 as number | null,
    imageUrl: pic("71eQZ66ZiTL"),
    imageAlt: "Vorderseite des Sacks MERA Essential Brocken, Trockenfutter für Hunde, 2 kg",
    contentImageUrl: pic("719RYfY5KCL"),
    contentImageAlt: "Große Kroketten von MERA Essential Brocken in einer Hand",
    composition:
      "Getreide, Fleisch und tierische Nebenerzeugnisse (u. a. 14 % vom Geflügel), Öle und Fette (u. a. 0,2 % Sonnenblumenöl), pflanzliche Nebenerzeugnisse, Mineralstoffe (Calciumcarbonat, Natriumchlorid, Kaliumchlorid), Saaten (1 % Leinsamen), Hefen (0,2 % Bierhefe, getrocknet). Zusatzstoffe je kg: Vitamin A 12.000 IE, Vitamin D3 1.200 IE, Vitamin E 100 mg, Kupfer 12,5 mg, Zink 100 mg plus 60 mg als Chelat, Eisen 200 mg, Mangan 30 mg, Jod 1,5 mg, Selen 0,35 mg. Technologisch: Antioxidationsmittel. Laut Amazon-Listing, Bestandteile, 17.10.2026.",
    analysis: [
      { name: "Protein", value: 21 },
      { name: "Fettgehalt", value: 9 },
      { name: "Rohfaser", value: 2.5 },
      { name: "Rohasche", value: 7 },
      { name: "Calcium", value: 1.35 },
      { name: "Phosphor", value: 0.8 },
      { name: "Natrium", value: 0.4 },
    ],
    scores: { scoreRaw: 11, scoreHarmful: 14, scoreNutrients: 15, scoreDeclaration: 10, scoreNeeds: 7, scoreValue: 4 } satisfies Scores,
    verdict:
      "Günstiges Trockenfutter mit offener Vitamin- und Spurenelementliste. Abzüge nach unserem Schema: Getreide steht vorn, Geflügel nur 14 Prozent im Sammelbegriff, das Antioxidans hat keinen Namen, und mehrere Listing-Sätze sind nicht nachprüfbar.",
    teaser: "Getreide vorn, Geflügel nur 14 Prozent. Antioxidans ohne Namen. 61 Punkte.",
    pros: [
      "Vitamine A, D3 und E sowie Kupfer, Zink, Eisen, Mangan, Jod und Selen mit Mengen genannt",
      "Calcium 1,35 Prozent, Phosphor 0,8 Prozent und Natrium 0,4 Prozent stehen in der Analytik",
      "Amazon-Preis am 17.10.2026: 14,75 Euro für 4 kg, angegeben 3,69 Euro je kg",
    ],
    cons: [
      "Zusammensetzung beginnt mit Getreide; Geflügel nur 14 Prozent innerhalb von Fleisch und tierischen Nebenerzeugnissen",
      "Technologischer Zusatzstoff nur als Antioxidationsmittel, ohne Stoffname; Feuchtigkeit nicht deklariert",
      "Fünf fragwürdige Listing-Sätze, darunter Lebensmittelqualität und Omega-3/6 ohne Prozent in der Analytik",
    ],
    claims: [
      c("ideal für ausgewachsene Tiere aller Hunderassen … bereits von tausenden Hunden geliebt", "FRAGWUERDIG", "Art. 13 Abs. 1 VO (EG) 767/2009; § 5 UWG", "Nach unserer Einschätzung ist „von tausenden Hunden geliebt“ eine Mengenangabe ohne Beleg auf der Produktseite. „Ideal“ ist eine Anpreisung. Beides ist im Listing nicht nachprüfbar."),
      c("mit Omega-3 und Omega-6 für gesunde Haut und ein glänzendes Fell", "FRAGWUERDIG", "Art. 13 Abs. 1 VO (EG) 767/2009", "Die Funktion für Haut und Fell ist eine allgemein anerkannte Angabe. Leinsamen (1 %) und Sonnenblumenöl (0,2 %) stehen in der Liste. Die Gehalte an Omega-3 und Omega-6 fehlen in den analytischen Bestandteilen. Deshalb ist der Satz in dieser Form aus unserer Sicht nicht ohne Weiteres nachprüfbar."),
      c("Hochwertige Zutaten in optimaler Zusammensetzung … mit allen wichtigen Nährstoffen", "FRAGWUERDIG", "Art. 13 Abs. 1 VO (EG) 767/2009; § 5 UWG", "„Optimal“ und „allen wichtigen“ sind Absolutformeln. Das Listing zeigt keine Untersuchung, an der sich das prüfen ließe."),
      c("verzichten … auf … Farb-, Aroma- und Konservierungsstoffe, gentechnisch veränderte Zutaten, Zucker, Soja und Vitamin K3", "FRAGWUERDIG", "Art. 11 Abs. 1 b, Art. 13 Abs. 1 VO (EG) 767/2009", "Farb-, Aroma- und Konservierungsstoffe, Zucker, Soja und Vitamin K3 sind in der abgedruckten Deklaration nicht genannt. Technologisch steht nur „Antioxidationsmittel“, ohne Namen. „Ohne Gentechnik“ ist aus unserer Sicht nicht belegt. Wir sagen deshalb: nicht deklariert, nicht „nicht enthalten“."),
      c("aus erstklassigen, möglichst regionalen Rohstoffen in Deutschland hergestellt … in Lebensmittelqualität", "FRAGWUERDIG", "Art. 11 Abs. 1 a VO (EG) 767/2009; § 5 UWG", "„Lebensmittelqualität“ ist im Futtermittelrecht nicht definiert. Das Listing erklärt nicht, was damit gemeint ist. „Made in Germany“ und „möglichst regional“ sind ohne Herkunft der Tiere nicht nachprüfbar. Was damit gemeint ist, lässt sich anhand des Listings nicht prüfen."),
    ],
    metaTitle: "MERA Essential Brocken im Test",
    metaDescription: "MERA Essential Brocken im Test: Getreide vorn, 14 Prozent Geflügel, Vitamine mit Mengen, Antioxidans ohne Namen. 61 von 100 Punkten.",
    keywords: ["MERA Essential Brocken Test", "MERA Hundefutter", "Essential Brocken", "Trockenfutter Hund Test", "MERA Brocken Zusammensetzung"],
    bodyHtml: `<p>„Mit Omega-3 und Omega-6 für gesunde Haut und ein glänzendes Fell“: So wirbt das Amazon-Listing am ${D} für <strong>MERA Essential Brocken</strong>. Die Zusammensetzung beginnt mit Getreide. Benanntes Geflügel steht bei 14 Prozent, eingepackt in „Fleisch und tierische Nebenerzeugnisse“.</p>
<div class="fp-box fp-kurz space-y-3 rounded-3xl border-2 border-brand bg-brand-soft p-5"><p class="text-sm font-extrabold text-brand-strong">📌 Das Wichtigste in Kürze</p><ul>
<li>Getreide steht an erster Stelle. Geflügel ist mit 14 Prozent genannt, die übrigen Fleischanteile nicht.</li>
<li>Vitamine und Spurenelemente sind mit Mengen deklariert. Das Antioxidans hat keinen Namen. Die Feuchtigkeit fehlt.</li>
<li>Amazon-Preis am ${D}, Verkäufer Amazon: 14,75 Euro für 2 × 2 kg, angegeben 3,69 Euro je kg.</li>
<li>Nach unserem rezepturbasierten Bewertungsschema: 61 von 100 Punkten, Ampel Gelb.</li>
</ul></div>
${METHODE("B0GDW3WHPL")}
<h2 id="getreide-vor-dem-gefluegel">Getreide steht vor dem Geflügel</h2>
<p>Die Liste liest sich wie ein Vorratsschrank: Getreide, dann Fleisch und tierische Nebenerzeugnisse, „u. a. 14 % vom Geflügel“, Öle und Fette mit 0,2 Prozent Sonnenblumenöl, pflanzliche Nebenerzeugnisse ohne Sorte, Mineralstoffe, 1 Prozent Leinsamen, 0,2 Prozent Bierhefe. Vierzehn Prozent benanntes Geflügel in einem Sack, der nach Brocken klingt: Das ist nach unserer Einschätzung wenig Fleisch mit Namen. Nach unserem rezepturbasierten Bewertungsschema geben wir 11 von 30 Punkten bei den Rohstoffen.</p>
${figure("719RYfY5KCL", "Große Kroketten von MERA Essential Brocken, in einer Hand gehalten", "B0GDW3WHPL")}
<div class="fp-box fp-merk space-y-2 rounded-2xl border-l-4 border-mid bg-mid-soft p-5"><p class="font-extrabold">💡 So steht es auf dem Etikett</p><ul>
<li>Fleischsorte mit Prozent: nur Geflügel, 14 Prozent, innerhalb des Sammelbegriffs.</li>
<li>Getreideart: nicht genannt. Pflanzliche Nebenerzeugnisse: nicht aufgeschlüsselt.</li>
<li>Das Wort Alleinfuttermittel steht im abgedruckten Bestandteile-Text nicht.</li>
</ul></div>
<h2 id="vitamine-mit-zahl-antioxidans-ohne">Vitamine mit Zahl, Antioxidans ohne</h2>
<p>Protein 21 Prozent, Fett 9 Prozent, Rohfaser 2,5 Prozent, Rohasche 7 Prozent. Calcium 1,35 Prozent, Phosphor 0,8 Prozent, Natrium 0,4 Prozent. Vitamin A 12.000 IE, Vitamin D3 1.200 IE, Vitamin E 100 mg je kg, dazu die üblichen Spurenelemente mit Menge. Wer Zahlen sucht, findet sie hier. Das verdient Lob.</p>
<p>Die Feuchtigkeit fehlt. Eine Umrechnung auf die Trockenmasse machen wir deshalb nicht. Unter den technologischen Zusatzstoffen steht nur „Antioxidationsmittel“. Ob das Tocopherole sind oder ein anderer Stoff, sagt das Listing nicht. Wir schreiben: nicht benannt, nicht „bedenklich erwiesen“.</p>
${figure("71xmTLGWQdL", "Grafik des Amazon-Listings mit Zusammensetzung und analytischen Bestandteilen von MERA Essential Brocken", "B0GDW3WHPL")}
<div class="fp-table rounded-2xl border border-border p-4"><table><thead><tr><th>Bestandteil</th><th>Laut Amazon-Listing</th><th>Trockenmasse</th></tr></thead><tbody>
<tr><td>Protein</td><td>21 %</td><td>nicht gerechnet</td></tr>
<tr><td>Fett</td><td>9 %</td><td>nicht gerechnet</td></tr>
<tr><td>Rohfaser</td><td>2,5 %</td><td>nicht gerechnet</td></tr>
<tr><td>Rohasche</td><td>7 %</td><td>nicht gerechnet</td></tr>
</tbody></table></div>
<p class="text-sm text-muted">Feuchtigkeit ist nicht deklariert. Ohne sie rechnen wir nicht auf die Trockenmasse um.</p>
<h2 id="lebensmittelqualitaet-ohne-erklaerung">„Lebensmittelqualität“ ohne Erklärung</h2>
<p>Das Listing verspricht Haut und Fell über Omega-3 und Omega-6, „optimale Zusammensetzung“, den Verzicht auf Farb-, Aroma- und Konservierungsstoffe, auf Gentechnik, Zucker, Soja und Vitamin K3, und dazu Herstellung in Deutschland „in Lebensmittelqualität“. Die Öle sind da, die Omega-Prozente nicht. Zucker, Soja und Vitamin K3 sind nicht deklariert. Das ist ein anderer Satz als „laborgeprüft frei davon“.</p>
<p>Fünf Sätze stufen wir als fragwürdig ein, keinen halten wir für irreführend. Die Fell-Richtung wäre der übliche Werberahmen, wenn die Fettsäuren in der Analytik stünden. ${STRENG(5, 0)}</p>
<h2 id="preis-pro-tag">Ein Euro am Tag für 20 Kilogramm</h2>
<p>Amazon nannte am ${D} 14,75 Euro für 2 × 2 kg, Verkäufer Amazon, und 3,69 Euro je kg. Die Fütterungsgrafik in der Galerie nennt für 20 kg Körpergewicht 270 g am Tag, für 10 kg 160 g (eigene Abschrift dieser Grafik). 0,27 kg mal 3,69 Euro sind 0,996 Euro, gerundet 1,00 Euro am Tag für einen 20-kg-Hund (eigene Berechnung). Für die Rezeptur ist das nach unserer Einschätzung ein niedriger Preis. Die Preis-Leistung bekommt 4 von 5 Punkten, nicht weil das Rezept stark ist, sondern weil der Sack wenig kostet.</p>
${figure("61-lKQqMEAL", "Fütterungstabelle von MERA Essential Brocken, Tagesration nach Körpergewicht", "B0GDW3WHPL")}
<div class="fp-box fp-tierschutz space-y-2 rounded-2xl border-l-4 border-good bg-good-soft p-5"><p class="text-sm font-extrabold text-brand-strong">🐾 Tierschutz</p><p>Herkunft und Haltung des Geflügels sind nicht deklariert. „Möglichst regional“ und Herstellung in Deutschland stehen im Listing, ohne Angabe, wo die Tiere gelebt haben (Amazon-Listing, ${D}).</p></div>
<div class="fp-box fp-fazit space-y-3 rounded-3xl border-2 border-brand bg-surface p-5 shadow-card"><h2 id="fazit">Fazit</h2><p>MERA Essential Brocken ist nach unserer Einschätzung ein günstiges, vitaminreich deklariertes Trockenfutter mit schwacher Fleischkennzeichnung. 61 von 100 Punkten, Gelb nach unserem rezepturbasierten Bewertungsschema. Das Antioxidans ohne Namen und die „Lebensmittelqualität“ ohne Erklärung kosten die Punkte, nicht ein Laborwert, den wir nicht haben.</p></div>
${cta("B0GDW3WHPL", "MERA Essential Brocken")}
${quellen(`<li>Amazon-Produktseite MERA Essential Brocken, ASIN B0GDW3WHPL, Bestandteile, Werbetexte und Preis (Verkäufer Amazon), ${a(src("B0GDW3WHPL"), "amazon.de")}, ${D}.</li><li>Amazon-Galerie derselben ASIN: Packshot, Kroketten, Fütterungstabelle (10 kg 160 g, 20 kg 270 g), Zusammensetzungsgrafik, eigene Sichtung ${D}.</li>`)}
${FOOT}`,
    conclusionHtml: `<p>MERA Essential Brocken bleibt nach unserer Einschätzung ein preiswertes Trockenfutter mit klarer Vitaminliste und unklarer Fleisch- und Getreideherkunft. Gelb, 61 von 100 Punkten, nach unserem rezepturbasierten Bewertungsschema. Die Note gilt für das Amazon-Listing vom ${D}.</p>`,
  },

  {
    ...BASE,
    categorySlug: "alleinfuttermittel-hund",
    brand: "by Amazon",
    slug: "by-amazon-pastete-mit-wild-test",
    title: "by Amazon Pastete mit Wild im Test",
    productName: "Pastete mit Wild, Nassfutter für Hunde, 20 × 300 g",
    keyword: "by Amazon Pastete Wild",
    priceClass: "GUENSTIG" as const,
    pricePerKg: 1.92,
    packageSize: "20 × 300 g (6 kg)",
    price: 11.5,
    pricePerDay: 1.15 as number | null,
    imageUrl: pic("61vAEaH4H+L"),
    imageAlt: "Schale by Amazon Pastete mit Wild, 300 g, Vorderseite",
    contentImageUrl: pic("710jcpem4WL"),
    contentImageAlt: "Schale by Amazon Pastete mit Wild, Produktansicht aus der Amazon-Galerie",
    composition:
      "Fleisch und tierische Nebenerzeugnisse 62 % (davon 4 % Wild), Mineralstoffe. Zusatzstoffe je kg laut englischem Listing-Text: Vitamin D3 150 IE, Biotin 50 µg, Zink 26 mg, Vitamin E 15 mg, Mangan 1,7 mg, Kupfer 1 mg, Jod 0,4 mg. Die deutsche Galerie-Grafik nennt Biotin 50 mg. Analytische Bestandteile: Feuchtigkeit 81 %, Protein 10 %, Fett 5 %, anorganische Stoffe 2 %, Rohfaser 0,4 %, Energie 89 kcal je 100 g. Calcium, Phosphor und Vitamin A sind nicht deklariert. Laut Amazon-Listing, 17.10.2026.",
    analysis: [
      { name: "Feuchtigkeit", value: 81 },
      { name: "Protein", value: 10 },
      { name: "Fettgehalt", value: 5 },
      { name: "Rohasche", value: 2 },
      { name: "Rohfaser", value: 0.4 },
    ],
    scores: { scoreRaw: 15, scoreHarmful: 17, scoreNutrients: 12, scoreDeclaration: 8, scoreNeeds: 8, scoreValue: 5 } satisfies Scores,
    verdict:
      "Günstige Pastete mit 62 Prozent Fleisch und tierischen Nebenerzeugnissen, davon 4 Prozent Wild. Abzüge: Calcium, Phosphor und Vitamin A sind nicht angegeben, die Biotin-Einheit widerspricht sich, und mehrere Listing-Sätze zu Tierärzten, Knochen und Muskeln sind nicht belegt.",
    teaser: "Vier Prozent Wild, 62 Prozent Sammelbegriff. Biotin widerspricht sich. 65 Punkte.",
    pros: [
      "62 Prozent Fleisch und tierische Nebenerzeugnisse, davon 4 Prozent Wild, kurz deklariert",
      "Schalenrückseite in der Galerie: Alleinfuttermittel für ausgewachsene Hunde, Pastete mit Wild",
      "Amazon-Preis am 17.10.2026: 11,50 Euro für 6 kg, angegeben 1,92 Euro je kg",
    ],
    cons: [
      "Nur 4 Prozent Wild benannt; die übrigen 58 Prozentpunkte ohne Tierart",
      "Calcium, Phosphor und Vitamin A nicht deklariert; Biotin 50 µg im Text, 50 mg in der deutschen Grafik",
      "Vier fragwürdige Listing-Sätze, darunter „von Tierärzten überprüft“ ohne Namen",
    ],
    claims: [
      c("Dieses Produkt war zuvor ein Lifelong-Produkt. … genau die gleichen Formulierungen, Größe und Qualität", "ZULAESSIG", "Art. 11 VO (EG) 767/2009", "Das ist ein Hinweis des Listings auf einen Markenwechsel. Eine ältere Lifelong-Deklaration haben wir nicht daneben gelegt. Einen Widerspruch in der heutigen Liste sehen wir nicht. Den Satz behandeln wir als Listing-Hinweis, nicht als von uns geprüfte Identität."),
      c("Portion mit Wild", "ZULAESSIG", "Art. 17 Abs. 2 a VO (EG) 767/2009; FEDIAF-Kodex Anhang 5", "„Mit Wild“ ist durch 4 Prozent Wild gedeckt. Die Schwelle von 4 Prozent ist damit erreicht. Welche Wildart, sagt das Listing nicht. Nach dem FEDIAF-Kodex (Anhang 5) sind für „mit“ mindestens 4 Prozent üblich; deklariert sind 4 Prozent Wild."),
      c("Ohne Zusatz von künstlichen Aromen, Farbstoffen, Konservierungsstoffen oder Antioxidantien", "FRAGWUERDIG", "Art. 11 Abs. 1 b VO (EG) 767/2009", "In der Zusatzstoffliste stehen diese Stoffe nicht. Für eine sterilisierte Pastete ist der Verzicht auf Konservierungsstoffe aus unserer Sicht oft eine Eigenschaft, die vergleichbare Produkte ebenfalls haben. Wir sagen: nicht deklariert, nicht laborgeprüft abwesend."),
      c("Von Tierernährungswissenschaftlern entwickelt und von Tierärzten überprüft", "FRAGWUERDIG", "Art. 13 Abs. 1 VO (EG) 767/2009; § 5 UWG", "Die Schalenrückseite in der Galerie nennt „Mit Tierernährungswissenschaftlern entwickelt“. Namen, Datum oder ein Prüfbericht stehen dort nicht. „Von Tierärzten überprüft“ bleibt aus unserer Sicht eine Tatsachenbehauptung ohne nachprüfbare Personen."),
      c("Mit Vitamin D3 zur Stärkung von sowohl Knochen als auch Zähnen", "FRAGWUERDIG", "Art. 13 Abs. 1 VO (EG) 767/2009", "Vitamin D3 ist mit 150 IE je kg genannt. „Stärkung“ geht über den Erhalt einer normalen Funktion hinaus. Calcium und Phosphor sind nicht deklariert. Einen Beleg zeigt das Listing nicht."),
      c("mit Vitamin E zur Aufrechterhaltung eines gesunden Immunsystems", "ZULAESSIG", "Art. 13 Abs. 1 und 2 VO (EG) 767/2009", "Vitamin E ist mit 15 mg je kg genannt. Die Formulierung bleibt beim Erhalt einer normalen Funktion und entspricht dem üblichen Werberahmen für Vitamin E. Die Menge ist klein; einen eigenen Wirksamkeitsbeleg verlangt diese allgemeine Angabe aus unserer Sicht nicht."),
      c("Mit hochwertigen Proteinen zur Unterstützung starker Muskeln", "FRAGWUERDIG", "Art. 13 Abs. 1 VO (EG) 767/2009", "Protein ist mit 10 Prozent im Nassfutter genannt, in der Trockenmasse rund 53 Prozent (eigene Umrechnung). „Starke Muskeln“ ist daraus nicht belegt. Das Listing zeigt keine Untersuchung."),
    ],
    metaTitle: "by Amazon Pastete mit Wild im Test",
    metaDescription: "by Amazon Pastete mit Wild im Test: 4 Prozent Wild, Biotin-Widerspruch, Calcium nicht angegeben. 65 von 100 Punkten nach unserem Schema.",
    keywords: ["by Amazon Pastete Wild Test", "Lifelong Hundefutter", "Pastete mit Wild", "Nassfutter Hund Test", "by Amazon Hundefutter"],
    bodyHtml: `<p>„Portion mit Wild“, zuvor Lifelong, jetzt by Amazon: Das Listing vom ${D} verspricht dieselbe Rezeptur in neuer Marke. In der Liste stehen 62 Prozent Fleisch und tierische Nebenerzeugnisse, davon 4 Prozent Wild. Die deutsche Grafik schreibt Biotin „50 MG“, der englische Text „50µg“.</p>
<div class="fp-box fp-kurz space-y-3 rounded-3xl border-2 border-brand bg-brand-soft p-5"><p class="text-sm font-extrabold text-brand-strong">📌 Das Wichtigste in Kürze</p><ul>
<li>4 Prozent Wild reichen für die Worte „mit Wild“. Der Rest des Fleischblocks hat keine Tierart.</li>
<li>Die Schalenrückseite in der Galerie nennt ein Alleinfuttermittel für ausgewachsene Hunde. Calcium, Phosphor und Vitamin A sind in der Deklaration nicht angegeben (bei Heimtierfutter keine Pflichtangabe).</li>
<li>Amazon-Preis am ${D}, Verkäufer Amazon: 11,50 Euro für 20 × 300 g, angegeben 1,92 Euro je kg.</li>
<li>65 von 100 Punkten, Ampel Gelb, nach unserem rezepturbasierten Bewertungsschema.</li>
</ul></div>
${METHODE("B0DFHMFDHQ")}
<h2 id="vier-prozent-wild">Vier Prozent Wild, der Rest ohne Namen</h2>
<p>Die Schale in der Galerie trägt „Pastete mit Wild“ und, auf der Rückseite, „Alleinfuttermittel für ausgewachsene Hunde“. Das ist eine klare Kategorie. Die Zutatenzeile ist kürzer als das Versprechen: 62 Prozent Fleisch und tierische Nebenerzeugnisse, in der Klammer 4 Prozent Wild, dazu Mineralstoffe. Welche Wildart, welches andere Tier, welcher Anteil Muskel oder Nebenerzeugnis: nicht deklariert. Nach unserem Schema 15 von 30 Punkten bei den Rohstoffen. „Mit Wild“ ist zulässig. Es ist nur ein schmaler Streifen im Namen.</p>
${figure("81UC1HWysaL", "Rückseite der Schale by Amazon Pastete mit Wild mit dem Hinweis Alleinfuttermittel für ausgewachsene Hunde", "B0DFHMFDHQ")}
<div class="fp-box fp-merk space-y-2 rounded-2xl border-l-4 border-mid bg-mid-soft p-5"><p class="font-extrabold">💡 So steht es auf dem Etikett</p><ul>
<li>Englisch im Listing: Biotin 50 µg. Deutsche Grafik derselben Galerie: Biotin 50 mg.</li>
<li>Vitamin A, Calcium und Phosphor: nicht deklariert.</li>
<li>Energie: 89 kcal je 100 g.</li>
</ul></div>
<h2 id="biotin-faktor-tausend">Biotin, Faktor tausend</h2>
<p>Feuchtigkeit 81 Prozent, Protein 10 Prozent, Fett 5 Prozent, Rohasche 2 Prozent, Rohfaser 0,4 Prozent. In der Trockenmasse sind das rund 53 Prozent Protein und 26 Prozent Fett (eigene Umrechnung, Teiler 19). Für eine Pastete ist das ein kräftiges Profil. Vitamin D3 150 IE, Vitamin E 15 mg, Zink 26 mg, dazu kleine Mengen Mangan, Kupfer und Jod. Vitamin A ist nicht angegeben. Calcium und Phosphor sind nicht angegeben. Bei einem Produkt, dessen Schale „Alleinfuttermittel“ sagt, ist das nach unserer Einschätzung eine Lücke in der Deklaration. Vorgeschrieben ist die Angabe bei Heimtierfutter nicht; für unsere Bewertung fehlt sie trotzdem.</p>
<div class="fp-box fp-warn space-y-2 rounded-2xl border-l-4 border-bad bg-bad-soft p-5"><p class="text-sm font-extrabold text-brand-strong">⚠️ Zwei Biotin-Zahlen</p><p>Im englischen Bestandteile-Text steht Biotin 50 µg, in der deutschen Inhaltsstoff-Grafik „BIOTIN 50 MG“ (Amazon-Listing und Galerie, ${D}). Der Faktor ist 1.000. Welche Zahl stimmt, entscheiden wir nicht. [1]</p></div>
${figure("71dvFNEvWEL", "Deutsche Inhaltsstoff-Grafik der by Amazon Pastete mit Wild, darin Biotin 50 mg", "B0DFHMFDHQ")}
<div class="fp-table rounded-2xl border border-border p-4"><table><thead><tr><th>Bestandteil</th><th>Nass, laut Listing</th><th>Trockenmasse, eigene Umrechnung</th></tr></thead><tbody>
<tr><td>Protein</td><td>10 %</td><td>52,6 %</td></tr>
<tr><td>Fett</td><td>5 %</td><td>26,3 %</td></tr>
<tr><td>Rohfaser</td><td>0,4 %</td><td>2,1 %</td></tr>
<tr><td>Rohasche</td><td>2 %</td><td>10,5 %</td></tr>
</tbody></table></div>
<p class="text-sm text-muted">Eigene Umrechnung: Wert ÷ (100 − 81) × 100. Gerundet auf eine Nachkommastelle.</p>
<h2 id="tieraerzte-ohne-namen">Tierärzte ohne Namen</h2>
<p>Das Listing nennt Tierernährungswissenschaftler und „von Tierärzten überprüft“, Vitamin D3 zur „Stärkung“ von Knochen und Zähnen, Vitamin E für ein gesundes Immunsystem und Proteine für „starke Muskeln“. Die Vitamin-E-Zeile bleibt im Erhaltungsrahmen und ist mit 15 mg je kg beziffert. Die übrigen drei Sätze stufen wir als fragwürdig ein, dazu den pauschalen Verzicht auf Konservierungsstoffe. ${STRENG(4, 0)} Drei weitere Deklarationspunkte ziehen wir ab, weil Calcium, Phosphor und Vitamin A nicht angegeben sind und die Biotin-Einheit sich widerspricht. Zusammen 8 von 15.</p>
<h2 id="fuenfzehn-euro-nicht">Zwei Schalen, ein Euro fünfzehn</h2>
<p>Amazon nannte am ${D} 11,50 Euro für 20 Schalen à 300 g, Verkäufer Amazon, 1,92 Euro je kg, daneben „Statt: 14,58 Euro“ (Angabe von Amazon). Die Fütterungsgrafik staffelt nach Gewichtsbereichen. Für 10 bis 15 kg stehen 2 bis 3 Schalen am Tag (eigene Abschrift). Untere Angabe, 2 Schalen, sind 600 g. Mal 1,92 Euro je kg sind 1,15 Euro am Tag (eigene Berechnung). Für Nassfutter ist das nach unserer Einschätzung sehr günstig. Preis-Leistung: 5 von 5, bei der genannten Rezeptur.</p>
${figure("71rFNsfy7DL", "Tägliche Fütterungsempfehlung der by Amazon Pastete mit Wild nach Gewicht des Hundes", "B0DFHMFDHQ")}
<div class="fp-box fp-tierschutz space-y-2 rounded-2xl border-l-4 border-good bg-good-soft p-5"><p class="text-sm font-extrabold text-brand-strong">🐾 Tierschutz</p><p>Wildart, Herkunft und Haltung sind nicht deklariert. Vier Prozent Wild stehen in der Klammer, der übrige Fleischblock ohne Tierart (Amazon-Listing, ${D}).</p></div>
<div class="fp-box fp-fazit space-y-3 rounded-3xl border-2 border-brand bg-surface p-5 shadow-card"><h2 id="fazit">Fazit</h2><p>Die Pastete mit Wild ist nach unserer Einschätzung ein günstiges Nassfutter mit kurzer Liste und einer Lücke in der Deklaration: Calcium, Phosphor und Vitamin A sind nicht angegeben. Vorgeschrieben ist das bei Hundefutter nicht. Ob die Pastete als Alleinfutter den Bedarf deckt, können wir aus diesen Angaben deshalb nicht prüfen. 65 von 100 Punkten, Gelb. Die Biotin-Frage lassen wir offen, sie gehört dem Listing.</p></div>
${cta("B0DFHMFDHQ", "by Amazon Pastete mit Wild")}
${quellen(`<li>Amazon-Produktseite by Amazon Pastete mit Wild, ASIN B0DFHMFDHQ, Bestandteile, Werbetexte und Preis (Verkäufer Amazon), ${a(src("B0DFHMFDHQ"), "amazon.de")}, ${D}. [1]</li><li>Amazon-Galerie derselben ASIN: Schalenrückseite mit „Alleinfuttermittel für ausgewachsene Hunde“, deutsche Inhaltsstoff-Grafik (Biotin 50 mg), Fütterungstabelle, eigene Sichtung ${D}.</li>`)}
${FOOT}`,
    conclusionHtml: `<p>by Amazon Pastete mit Wild ist nach unserer Einschätzung eine günstige, knapp benannte Pastete. Vier Prozent Wild tragen den Namen, die fehlenden Mineralstoffangaben tragen den Abzug. Gelb, 65 von 100 Punkten. Die Note gilt für das Listing vom ${D}, einschließlich des Biotin-Widerspruchs zwischen Text und Grafik.</p>`,
  },

  {
    ...BASE,
    categorySlug: "alleinfuttermittel-hund",
    brand: "Brit",
    slug: "brit-premium-sensitive-lamm-test",
    title: "Brit Premium Sensitive Lamm im Test",
    productName: "Premium by Nature Sensitive mit Lamm, Trockenfutter für Hunde, 15 kg",
    keyword: "Brit Premium Sensitive Lamm",
    priceClass: "GUENSTIG" as const,
    pricePerKg: null as number | null,
    packageSize: "15 kg",
    price: null as number | null,
    pricePerDay: null as number | null,
    imageUrl: pic("71jc18eadiL"),
    imageAlt: "Sack Brit Premium by Nature Sensitive Lamb and Rice, 15 kg, Vorderseite",
    contentImageUrl: pic("61kqpKhXyEL"),
    contentImageAlt: "Krokette von Brit Premium Sensitive Lamm neben einem Lineal, ungefähre Größe",
    composition:
      "Alleinfuttermittel für Hunde. Dehydriertes Lammfleisch 35 %, Reis, Hühnerfett, Reiskleie, getrocknetes Apfelmark, Lachsöl 2 %, hydrolysierte Hühnerleber, Bierhefe, Kollagen, Glucosamin 210 mg/kg, Chondroitinsulfat 150 mg/kg, Mannan-Oligosaccharide 120 mg/kg, Fructooligosaccharide 90 mg/kg, Yucca schidigera 90 mg/kg, Kamille 80 mg/kg, Glykosaminoglykane 50 mg/kg, Blaubeeren 50 mg/kg, Gewürznelke, Zitrusfrüchte, Rosmarin und Kurkuma je 40 mg/kg. Analytik: Rohprotein 26 %, Rohfett 13 %, Feuchtigkeit 10 %, Rohasche 7 %, Rohfaser 3 %, Calcium 1,6 %, Phosphor 1,1 %, Natrium 0,2 %, Omega-3 0,2 %, Omega-6 1,5 %, Energie 3.660 kcal/kg. Zusatzstoffe mit Kennziffern, darunter Vitamin A 15.000 IE, Vitamin D3 1.000 IE, Vitamin E 400 mg, Biotin 0,5 mg, Cholinchlorid 1.800 mg. Natürliche Antioxidantien: Tocopherolextrakte, Ascorbylpalmitat, Rosmarinextrakt. Laut Amazon-Listing, 17.10.2026. Hafer steht in dieser Liste nicht.",
    analysis: [
      { name: "Rohprotein", value: 26 },
      { name: "Rohfett", value: 13 },
      { name: "Feuchtigkeit", value: 10 },
      { name: "Rohasche", value: 7 },
      { name: "Rohfaser", value: 3 },
      { name: "Calcium", value: 1.6 },
      { name: "Phosphor", value: 1.1 },
      { name: "Natrium", value: 0.2 },
      { name: "Omega-3-Fettsäuren", value: 0.2 },
      { name: "Omega-6-Fettsäuren", value: 1.5 },
    ],
    scores: { scoreRaw: 22, scoreHarmful: 18, scoreNutrients: 17, scoreDeclaration: 4, scoreNeeds: 8, scoreValue: 4 } satisfies Scores,
    verdict:
      "Offen deklariertes Alleinfutter mit 35 Prozent dehydriertem Lamm, voller Analytik und benannten Antioxidantien. Abzüge vor allem für Werbesätze zu Unverträglichkeiten, Gelenken und „ohne künstliche Zusatzstoffe“, und weil ein Galeriebild Hafer zeigt, die Zusammensetzung aber nicht.",
    teaser: "35 Prozent Lamm, volle Analytik, viele Wirkversprechen. 73 Punkte.",
    pros: [
      "Dehydriertes Lammfleisch mit 35 Prozent an erster Stelle; Lachsöl 2 Prozent; ohne Weizen in der Liste",
      "Calcium, Phosphor, Natrium, Omega-3 und Omega-6 sowie Vitamine und Spurenelemente mit Mengen",
      "Antioxidantien benannt: Tocopherolextrakte, Ascorbylpalmitat, Rosmarinextrakt",
    ],
    cons: [
      "Galeriebild nennt Hafer als Getreidequelle, die Zusammensetzung nennt keinen Hafer",
      "Neben Lamm: Hühnerfett und hydrolysierte Hühnerleber, also weitere tierische Zutaten",
      "Ein Listing-Satz zu Futtermittelunverträglichkeiten, den wir für irreführend halten, plus acht fragwürdige Sätze",
    ],
    claims: [
      c("weizenfreie Rezeptur / ohne Weizen", "ZULAESSIG", "Art. 13 Abs. 1 VO (EG) 767/2009", "In der Zusammensetzung steht Reis, keine Weizenposition. Die Angabe deckt sich mit der Liste vom 17.10.2026. Sie sagt nichts über Spuren aus der Herstellung."),
      c("ideal für Hunde mit … Futtermittelunverträglichkeiten", "UNZULAESSIG", "Art. 13 Abs. 3 b VO (EG) 767/2009; VO (EU) 2020/354", "„Futtermittelunverträglichkeiten“ spricht nach unserer Einschätzung einen besonderen Ernährungszweck an. Das Listing kennzeichnet das Futter nicht als Diätfuttermittel und nennt nicht den Hinweis, vor der Verwendung tierärztlichen Rat einzuholen. Wir halten diese Aussage für irreführend."),
      c("ideal für Hunde mit sensibler Verdauung", "FRAGWUERDIG", "Art. 13 Abs. 1 VO (EG) 767/2009", "Eine Verdaulichkeit nennt das Listing nicht. Ohne diese Zahl ist die Aussage aus unserer Sicht nicht nachprüfbar."),
      c("Lachsöl sorgt für gesunde Haut und glänzendes Fell", "ZULAESSIG", "Art. 13 Abs. 1 VO (EG) 767/2009", "Lachsöl ist mit 2 Prozent genannt, Omega-3 mit 0,2 Prozent und Omega-6 mit 1,5 Prozent. Die Fell- und Hautfunktion bleibt im üblichen Werberahmen."),
      c("Kollagen, Glucosamin und Chondroitin … unterstützen die Gelenke und Beweglichkeit", "FRAGWUERDIG", "Art. 13 Abs. 1 VO (EG) 767/2009", "Glucosamin steht mit 210 mg/kg, Chondroitinsulfat mit 150 mg/kg. Bei 170 g am Tag für einen 15-kg-Hund sind das 36 mg Glucosamin (eigene Berechnung). Einen Beleg, dass diese Menge Gelenke unterstützt, zeigt das Listing nicht."),
      c("Präbiotika (MOS & FOS) tragen zu einer ausgewogenen Darmflora und optimaler Nährstoffaufnahme bei", "FRAGWUERDIG", "Art. 13 Abs. 1 VO (EG) 767/2009", "MOS 120 mg/kg und FOS 90 mg/kg sind genannt. „Optimale Nährstoffaufnahme“ ist daraus nicht belegt."),
      c("Kräuter und Früchte dienen als … Entspannungshilfe", "FRAGWUERDIG", "Art. 13 Abs. 1 VO (EG) 767/2009", "Kamille steht mit 80 mg/kg, andere Pflanzen mit 40 bis 50 mg/kg. „Entspannungshilfe“ ist eine Funktion ohne Beleg auf der Seite. Eine Krankheit nennt der Satz nicht."),
      c("ohne künstliche Zusatzstoffe", "FRAGWUERDIG", "Art. 11 Abs. 1 a VO (EG) 767/2009", "„Künstlich“ ist nicht definiert. Die Zusatzstoffliste nennt chemisch bezeichnete Vitamine und Spurenelemente, zum Beispiel Vitamin A (3a672a) und Vitamin E (3a700). Der übliche Zusatz „mit zugesetzten Vitaminen und Mineralstoffen“ fehlt in diesem Satz. Wir halten ihn deshalb für erklärungsbedürftig, nicht für eine feststehende Falschaussage."),
      c("ohne Gentechnik", "FRAGWUERDIG", "Art. 11 Abs. 1 VO (EG) 767/2009", "Einen Beleg oder ein Siegel zeigt das Listing nicht. Solche Freiheitsangaben sind aus unserer Sicht ohne Nachweis nicht einzuordnen."),
      c("Natürlich & gut verträglich", "FRAGWUERDIG", "Art. 11 Abs. 1 a VO (EG) 767/2009", "Bei zugesetzten Vitaminen lässt der übliche Kennzeichnungsrahmen „natürlich“ nur mit dem Hinweis auf diese Zusätze zu. Der Satz auf dem Listing hat diesen Hinweis nicht."),
      c("Hafer als natürliche, glutenfreie Getreidequelle (Galeriebild)", "FRAGWUERDIG", "Art. 11 Abs. 1 a VO (EG) 767/2009", "Ein Galeriebild nennt Hafer als Getreidequelle. Die Zusammensetzung im selben Listing nennt Reis und Reiskleie, keinen Hafer. Den Widerspruch schreiben wir dem Listing zu, nicht einer von uns vermuteten Absicht. Ob Hafer glutenfrei ist, hängt von Sorte und Verarbeitung ab; das Bild sagt dazu nichts."),
    ],
    metaTitle: "Brit Premium Sensitive Lamm im Test",
    metaDescription: "Brit Premium Sensitive Lamm im Test: 35 Prozent Lamm, Hafer auf dem Bild, nicht in der Liste. 73 von 100 Punkten nach unserem Schema.",
    keywords: ["Brit Premium Sensitive Lamm Test", "Brit Lamm Reis", "Brit Sensitive Hund", "Trockenfutter Lamm Test", "Brit Premium by Nature"],
    bodyHtml: `<p>„35 % leicht verdauliches Lamm“ und „Futtermittelunverträglichkeiten“: So wirbt das Amazon-Listing am ${D} für <strong>Brit Premium Sensitive Lamm</strong>. In der Zusammensetzung steht dehydriertes Lammfleisch mit 35 Prozent, danach Reis. Auf einem Galeriebild steht außerdem Hafer. In der Liste steht er nicht.</p>
<div class="fp-box fp-kurz space-y-3 rounded-3xl border-2 border-brand bg-brand-soft p-5"><p class="text-sm font-extrabold text-brand-strong">📌 Das Wichtigste in Kürze</p><ul>
<li>Alleinfuttermittel, 35 Prozent dehydriertes Lamm, Reis, Lachsöl 2 Prozent. Analytik mit Mineralstoffen und Omega-Fettsäuren.</li>
<li>Das Galeriebild nennt Hafer, die Zusammensetzung nicht. Hühnerfett und Hühnerleber stehen neben dem Lamm.</li>
<li>Kein Amazon-Angebot am ${D} sichtbar. zooplus.de zeigte 53,49 Euro für 15 kg (Händlerangabe).</li>
<li>73 von 100 Punkten, Gelb. Der Abzug sitzt bei den Werbesätzen, nicht bei der Rohstoffliste.</li>
</ul></div>
${METHODE("B07H8GHGLZ")}
<h2 id="lamm-mit-prozent">Lamm mit Prozent, Hafer nur auf dem Bild</h2>
<p>Dehydriertes Lammfleisch 35 Prozent steht vorn. Das ist eine klare Ansage, und dehydriert heißt: das Wasser ist schon draußen, der Anteil im Sack ist nicht mit Frischfleisch zu verwechseln. Danach Reis, Hühnerfett, Reiskleie, Apfelmark, Lachsöl 2 Prozent, hydrolysierte Hühnerleber. Es ist also keine Ein-Tier-Rezeptur, auch wenn der Sack nach Lamm aussieht. Nach unserem Schema 22 von 30 Punkten bei den Rohstoffen. Das ist Lob, mit einer Grenze.</p>
${figurePlain("61Af4yIqseL", "Grafik Brit Premium Sensitive zur Hauptproteinquelle, auf der Hafer zu sehen ist")}
${figurePlain("71W6SvuucrL", "Grafik Brit Premium by Nature, die Hafer als glutenfreie Getreidequelle und Lachsöl für Haut und Fell nennt")}
<div class="fp-box fp-merk space-y-2 rounded-2xl border-l-4 border-mid bg-mid-soft p-5"><p class="font-extrabold">💡 So steht es auf dem Etikett</p><ul>
<li>Zusammensetzung: kein Hafer. Galerie: „Hafer. Als natürliche, glutenfreie Getreidequelle für die Verdauung.“</li>
<li>Glucosamin 210 mg/kg, Chondroitinsulfat 150 mg/kg, Kollagen ohne Prozent.</li>
<li>Energie: 3.660 kcal/kg. Feuchtigkeit: 10 Prozent.</li>
</ul></div>
<h2 id="die-analytik-traegt">Die Analytik trägt</h2>
<p>Rohprotein 26 Prozent, Fett 13 Prozent, Rohfaser 3 Prozent, Rohasche 7 Prozent, Feuchtigkeit 10 Prozent. In der Trockenmasse sind das 28,9 Prozent Protein und 14,4 Prozent Fett (eigene Umrechnung). Calcium 1,6 Prozent, Phosphor 1,1 Prozent, Verhältnis etwa 1,5 zu 1. Omega-3 0,2 Prozent, Omega-6 1,5 Prozent. Vitamine A, D3 und E, Biotin, Cholin und die Spurenelemente haben Kennziffern und Mengen. Die Antioxidantien heißen Tocopherole, Ascorbylpalmitat und Rosmarin, nicht „Antioxidationsmittel“ als Platzhalter. Das ist die starke Seite dieses Sacks.</p>
<div class="fp-table rounded-2xl border border-border p-4"><table><thead><tr><th>Bestandteil</th><th>Laut Listing</th><th>Trockenmasse, eigene Umrechnung</th></tr></thead><tbody>
<tr><td>Rohprotein</td><td>26,0 %</td><td>28,9 %</td></tr>
<tr><td>Rohfett</td><td>13,0 %</td><td>14,4 %</td></tr>
<tr><td>Rohfaser</td><td>3,0 %</td><td>3,3 %</td></tr>
<tr><td>Rohasche</td><td>7,0 %</td><td>7,8 %</td></tr>
<tr><td>Calcium</td><td>1,6 %</td><td>1,8 %</td></tr>
<tr><td>Phosphor</td><td>1,1 %</td><td>1,2 %</td></tr>
</tbody></table></div>
<p class="text-sm text-muted">Eigene Umrechnung mit 10 Prozent Feuchtigkeit: Wert ÷ 90 × 100.</p>
<h2 id="unvertraeglichkeiten-und-36-milligramm">Unverträglichkeiten und 36 Milligramm</h2>
<p>Weizenfreiheit deckt sich mit der Liste. Haut und Fell über Lachsöl ebenfalls, die Mengen stehen da. Den Hinweis auf „Futtermittelunverträglichkeiten“ halten wir für irreführend: Im Listing ist das Futter nicht als Diätfuttermittel gekennzeichnet, und der Hinweis auf tierärztlichen Rat fehlt. Gelenke, sensible Verdauung, Präbiotika, Entspannungshilfe, „ohne künstliche Zusatzstoffe“, „ohne Gentechnik“, „natürlich“ und der Hafer auf dem Bild bleiben aus unserer Sicht fragwürdig. ${STRENG(8, 1)} Die Deklaration landet bei 4 von 15. Das Rezept ist besser als sein Werbetext.</p>
<h2 id="preis-beim-haendler">Der Preis steht beim Händler</h2>
<p>Am ${D} zeigte Amazon für unseren Abruf kein Angebot. zooplus.de führte denselben Namen, 15 kg, für 53,49 Euro, also 3,57 Euro je kg (Händlerangabe, ${a("https://www.zooplus.de/shop/hunde/hundefutter_trockenfutter/brit_care/brit_premium/472449", "zooplus.de")}). Die Fütterungsempfehlung dort nennt für 15 kg Körpergewicht 170 g am Tag. Das sind 0,61 Euro (eigene Berechnung, 0,17 kg × 3,57 Euro). Die Zusammensetzung bei zooplus stimmt mit dem Amazon-Text überein, einschließlich 35 Prozent Lamm und 210 mg Glucosamin. Ob jede Charge identisch ist, sehen wir dem Preis nicht an.</p>
<p>Ein Amazon-Angebot war am ${D} nicht sichtbar. Deshalb verlinken wir hier nicht auf Amazon.</p>
<div class="fp-box fp-tierschutz space-y-2 rounded-2xl border-l-4 border-good bg-good-soft p-5"><p class="text-sm font-extrabold text-brand-strong">🐾 Tierschutz</p><p>Herkunft und Haltung des Lamms sind nicht deklariert. Zum Lachsöl nennt das Listing keine Fangmethode (Amazon-Listing, ${D}).</p></div>
<div class="fp-box fp-fazit space-y-3 rounded-3xl border-2 border-brand bg-surface p-5 shadow-card"><h2 id="fazit">Fazit</h2><p>Brit Premium Sensitive Lamm ist nach unserer Einschätzung ein sorgfältig analysiertes Lamm-Reis-Futter mit einem Werbetext, der weiter geht als die Liste. 73 von 100 Punkten, Gelb. Die Note gilt für die Rezeptur im Amazon-Listing vom ${D}.</p></div>
${quellen(`<li>Amazon-Produktseite Brit Premium Sensitive Lamm, ASIN B07H8GHGLZ, Zusammensetzung, Analytik, Werbetexte; kein Angebot sichtbar, ${a(src("B07H8GHGLZ"), "amazon.de")}, ${D}.</li><li>Amazon-Galerie derselben ASIN: Sack, Krokette, Grafik mit Hafer, Inhaltsstoffe, eigene Sichtung ${D}.</li><li>zooplus.de, Brit Premium by Nature Sensitive Lamm, 15 kg, 53,49 Euro (3,57 Euro/kg), Fütterung 15 kg: 170 g, Zusammensetzung wortgleich zur Amazon-Liste, ${a("https://www.zooplus.de/shop/hunde/hundefutter_trockenfutter/brit_care/brit_premium/472449", "zooplus.de")}, ${D}.</li>`)}
${FOOT}`,
    conclusionHtml: `<p>Brit Premium Sensitive Lamm überzeugt nach unserer Einschätzung bei Lammanteil, Mineralstoffen und benannten Antioxidantien. Die Note fällt auf Gelb, 73 von 100, weil Listing und Galerie mehr versprechen, als die Liste trägt: Unverträglichkeiten, Gelenke, und Hafer, der in der Zusammensetzung fehlt.</p>`,
  },

  {
    ...BASE,
    categorySlug: "alleinfuttermittel-katze",
    brand: "Schesir",
    slug: "schesir-cat-adult-maintenance-fisch-test",
    title: "Schesir Cat Adult Maintenance Fisch im Test",
    productName: "Cat Adult Maintenance mit Fisch, Trockenfutter für Katzen, 2 × 1,5 kg",
    keyword: "Schesir Maintenance Fisch",
    priceClass: "MITTEL" as const,
    pricePerKg: 8.5,
    packageSize: "2 × 1,5 kg (3 kg)",
    price: 25.51,
    pricePerDay: null as number | null,
    imageUrl: pic("71XJVcAyoHL"),
    imageAlt: "Beutel Schesir Cat Adult Maintenance mit Fisch, Vorderseite der Amazon-Galerie",
    contentImageUrl: pic("71GeIomr61L"),
    contentImageAlt: "Beutel Schesir Adult mit Fisch, reich an Fisch, eine tierische Proteinquelle als erste Zutat laut Aufdruck",
    composition:
      "Dehydratisierter Hochseefisch 25 Prozent, Reis, Gerste, gereinigtes Tierfett, Kartoffeleiweiß, Maiskleber, Rübenschnitzel, Bierhefe 1 Prozent, Leinsaat, Erbsenmehl, Sonnenblumenöl, Fructooligosaccharide 1 Prozent, Zichorienpülpe 1 Prozent, Natriumpyrophosphat, Kaliumchlorid, Mohave-Palmlilie 0,1 Prozent, getrocknete Gewürzpflanzen 0,03 Prozent (Weintraube, Citrus, Gewürznelken, Gelbwurz, Rosmarin). Analytik: Rohprotein 33 Prozent, Rohfett 17 Prozent, Rohfaser 2,2 Prozent, Rohasche 6,1 Prozent, Calcium 0,86 Prozent, Phosphor 0,84 Prozent, Magnesium 0,09 Prozent, Natrium 0,4 Prozent, Kalium 0,6 Prozent, Feuchte 10 Prozent, Omega-6 2,9 Prozent, Omega-3 0,9 Prozent, Energie 3.800 kcal/kg. Zusatzstoffe je kg unter anderem Taurin 2.500 mg, Vitamin E 370 mg, Vitamin C 200 mg, Biotin 0,28 mg. Laut Amazon-Produktbeschreibung, 17.10.2026.",
    analysis: [
      { name: "Rohprotein", value: 33 },
      { name: "Rohfett", value: 17 },
      { name: "Rohfaser", value: 2.2 },
      { name: "Rohasche", value: 6.1 },
      { name: "Calcium", value: 0.86 },
      { name: "Phosphor", value: 0.84 },
      { name: "Magnesium", value: 0.09 },
      { name: "Natrium", value: 0.4 },
      { name: "Kalium", value: 0.6 },
      { name: "Feuchtigkeit", value: 10 },
      { name: "Omega-6-Fettsäuren", value: 2.9 },
      { name: "Omega-3-Fettsäuren", value: 0.9 },
    ],
    scores: { scoreRaw: 16, scoreHarmful: 17, scoreNutrients: 16, scoreDeclaration: 6, scoreNeeds: 7, scoreValue: 3 } satisfies Scores,
    verdict:
      "Trockenfutter mit 25 Prozent dehydratisiertem Hochseefisch, voller Katzen-Analytik und Taurin. Abzüge: Getreide und unbenanntes Tierfett folgen, das Listing wirbt mit einer einzigen tierischen Proteinquelle und mit Allergien, und Amazon nennt den Artikeltyp Nassfutter.",
    teaser: "25 Prozent Fisch, dazu unbenanntes Tierfett. Amazon sagt Nassfutter. 65 Punkte.",
    pros: [
      "Dehydratisierter Hochseefisch mit 25 Prozent an erster Stelle; Taurin 2.500 mg/kg",
      "Calcium, Phosphor, Magnesium, Omega-3, Omega-6 und eine lange Vitaminliste mit Mengen",
      "Energie 3.800 kcal/kg und Feuchte 10 Prozent sind genannt",
    ],
    cons: [
      "Nach dem Fisch: Reis, Gerste, gereinigtes Tierfett ohne Tierart, Maiskleber",
      "Amazon-Artikeltyp lautet Nassfutter, das Produkt ist Trockenfutter",
      "Listing-Satz zu Allergien, den wir für irreführend halten; Monoprotein neben unbenanntem Tierfett",
    ],
    claims: [
      c("eine einzige tierische Proteinquelle / Monoprotein-Quelle", "FRAGWUERDIG", "Art. 11 Abs. 1 a VO (EG) 767/2009", "Fisch steht mit 25 Prozent vorn. Danach folgt „gereinigtes Tierfett“ ohne Tierart. Ob das Fett vom Fisch stammt oder eine weitere tierische Quelle ist, sagt das Listing nicht. Wir halten die Monoprotein-Aussage deshalb für nicht belegt, nicht für widerlegt."),
      c("erhöhte Verträglichkeit bei von Allergien geplagten Katzen", "UNZULAESSIG", "Art. 13 Abs. 3 a und 3 b VO (EG) 767/2009; VO (EU) 2020/354", "Der Satz spricht Katzen mit Allergien an. Das Listing kennzeichnet das Futter nicht als Diätfuttermittel für eine Ausgangserzeugnis- oder Nährstoffintoleranz und nennt nicht den Hinweis auf tierärztlichen Rat. Wir halten die Aussage für irreführend."),
      c("Dieses hypoallergene Trockenfutter", "FRAGWUERDIG", "Art. 11 Abs. 1 b VO (EG) 767/2009", "„Hypoallergen“ ist für normales Futter nicht definiert. Neben Fisch stehen pflanzliche Proteine und unbenanntes Tierfett. Einen Diät-Hinweis sehen wir nicht."),
      c("Haut- und Fellgesundheit werden unterstützt durch Bierhefe, Biotin, Omega-3- und Omega-6-Fettsäuren", "ZULAESSIG", "Art. 13 Abs. 1 VO (EG) 767/2009", "Bierhefe 1 Prozent, Biotin 0,28 mg/kg, Omega-6 2,9 Prozent und Omega-3 0,9 Prozent sind genannt. Die Funktion für Haut und Fell bleibt im üblichen Rahmen."),
      c("Antioxidantien aus Gewürzpflanzen helfen dem Organismus dabei, freie Radikale zu bekämpfen", "FRAGWUERDIG", "Art. 13 Abs. 1 VO (EG) 767/2009", "Die Gewürzpflanzen stehen mit 0,03 Prozent. „Freie Radikale bekämpfen“ ist eine Funktion ohne Beleg auf der Seite und bei dieser Menge aus unserer Sicht nicht einzuordnen."),
      c("wurde vom tiermedizinischen Institut der Universität Bologna geprüft und empfohlen", "FRAGWUERDIG", "§ 5 UWG; Art. 13 Abs. 1 VO (EG) 767/2009", "Das Listing nennt eine Universität, aber keinen Bericht, kein Datum und keine Fragestellung. Ohne diese Angaben ist die Empfehlung aus unserer Sicht nicht nachprüfbar. Wir unterstellen nicht, dass der Satz erfunden ist."),
      c("aus Herstellung ohne Tierversuche", "FRAGWUERDIG", "§ 5 UWG", "Der Satz steht im Listing. Einen Beleg, ein Zertifikat oder eine Erläuterung zeigt die Produktseite nicht. Wir geben ihn als Listing-Angabe wieder, nicht als geprüfte Tatsache."),
      c("Amazon-Artikeltyp: Nassfutter für erwachsene Katzen", "FRAGWUERDIG", "Art. 11 Abs. 1 a VO (EG) 767/2009", "Titel, Beutel und Deklaration beschreiben Trockenfutter, Feuchte 10 Prozent. Der Artikeltyp „Nassfutter“ passt dazu nicht. Wer das Attribut gesetzt hat, sehen wir dem Listing nicht an. Wir halten es für geeignet, die Erwartung an die Ware zu verschieben."),
    ],
    metaTitle: "Schesir Cat Adult Maintenance Fisch im Test",
    metaDescription: "Schesir Maintenance Fisch im Test: 25 Prozent Fisch, Tierfett ohne Art, Amazon sagt Nassfutter. 65 von 100 Punkten nach unserem Schema.",
    keywords: ["Schesir Maintenance Fisch Test", "Schesir Trockenfutter Katze", "Schesir Monoprotein", "Katzenfutter Fisch Test", "Schesir Adult Fisch"],
    bodyHtml: `<p>„Eine einzige tierische Proteinquelle“ und „hypoallergen“: So beschreibt das Amazon-Listing am ${D} <strong>Schesir Cat Adult Maintenance Fisch</strong>. In der Liste steht dehydratisierter Hochseefisch mit 25 Prozent. Danach kommen Reis, Gerste und „gereinigtes Tierfett“. Der Artikeltyp bei Amazon lautet Nassfutter.</p>
<div class="fp-box fp-kurz space-y-3 rounded-3xl border-2 border-brand bg-brand-soft p-5"><p class="text-sm font-extrabold text-brand-strong">📌 Das Wichtigste in Kürze</p><ul>
<li>Trockenfutter, 25 Prozent dehydratisierter Hochseefisch, Taurin 2.500 mg/kg, ausführliche Analytik.</li>
<li>„Gereinigtes Tierfett“ ist nicht als Fisch benannt. Monoprotein lässt sich daran nicht festmachen.</li>
<li>Amazon-Preis am ${D}, Verkäufer Amazon: 25,51 Euro für 2 × 1,5 kg, angegeben 8,50 Euro je kg. Eine Tagesration rechnen wir nicht, die Tabelle auf dem Rückseitenfoto ist nicht zuverlässig ablesbar.</li>
<li>65 von 100 Punkten, Gelb.</li>
</ul></div>
${METHODE("B0F131GJJW")}
<h2 id="fisch-dann-getreide-dann-fett">Fisch, dann Getreide, dann Fett</h2>
<p>Dehydratisierter Hochseefisch 25 Prozent steht vorn. Das ist ein benannter Anteil, und dehydratisiert heißt wieder: ohne das Wasser der Frischware. Reis und Gerste folgen, dann gereinigtes Tierfett ohne Tierart, Kartoffeleiweiß, Maiskleber, Rübenschnitzel, 1 Prozent Bierhefe, Leinsaat, Erbsenmehl, Sonnenblumenöl, 1 Prozent Fructooligosaccharide, 1 Prozent Zichorienpülpe. Für eine Katze ist das viel Pflanze hinter einem Fisch, der den Beutel prägt. Nach unserem Schema 16 von 30 Punkten bei den Rohstoffen. Den Fischanteil loben wir. Die Getreidezeile auch, weil sie wenigstens dasteht.</p>
${figure("71GeIomr61L", "Beutel Schesir Adult mit Fisch, Aufdruck zu einer tierischen Proteinquelle", "B0F131GJJW")}
<div class="fp-box fp-merk space-y-2 rounded-2xl border-l-4 border-mid bg-mid-soft p-5"><p class="font-extrabold">💡 So steht es auf dem Etikett</p><ul>
<li>Fisch 25 Prozent. Tierfett: ohne Art und ohne Prozent.</li>
<li>Artikeltyp bei Amazon: „Nassfutter“. Feuchte in der Analytik: 10 Prozent.</li>
<li>Auf der Packungsrückseite in der Galerie ist englisch „Complete and balanced dry food for adult cats“ lesbar.</li>
</ul></div>
<h2 id="taurin-steht-der-artikeltyp-nicht">Taurin steht, der Artikeltyp nicht</h2>
<p>Rohprotein 33 Prozent, Fett 17 Prozent, Rohfaser 2,2 Prozent, Rohasche 6,1 Prozent, Feuchte 10 Prozent. In der Trockenmasse sind das 36,7 Prozent Protein und 18,9 Prozent Fett (eigene Umrechnung). Calcium 0,86 Prozent, Phosphor 0,84 Prozent, Verhältnis etwa 1,02. Magnesium 0,09 Prozent. Omega-6 2,9 Prozent, Omega-3 0,9 Prozent. Taurin 2.500 mg/kg, dazu Vitamine bis Biotin 0,28 mg und die Spurenelemente mit Mengen. Energie 3.800 kcal/kg. Für ein Katzentrockenfutter ist das eine Analytik, die man lesen kann. Das Calcium-Phosphor-Verhältnis ist eng. Das ist eine Verhältniszahl, kein Befund an einem Tier.</p>
<div class="fp-table rounded-2xl border border-border p-4"><table><thead><tr><th>Bestandteil</th><th>Laut Listing</th><th>Trockenmasse, eigene Umrechnung</th></tr></thead><tbody>
<tr><td>Rohprotein</td><td>33 %</td><td>36,7 %</td></tr>
<tr><td>Rohfett</td><td>17 %</td><td>18,9 %</td></tr>
<tr><td>Rohfaser</td><td>2,2 %</td><td>2,4 %</td></tr>
<tr><td>Rohasche</td><td>6,1 %</td><td>6,8 %</td></tr>
<tr><td>Calcium</td><td>0,86 %</td><td>0,96 %</td></tr>
<tr><td>Phosphor</td><td>0,84 %</td><td>0,93 %</td></tr>
</tbody></table></div>
<p class="text-sm text-muted">Eigene Umrechnung mit 10 Prozent Feuchte: Wert ÷ 90 × 100.</p>
${figure("81VNKwae6GL", "Packungsrückseite Schesir Dry Line mit Fisch, mehrsprachige Deklaration in der Amazon-Galerie", "B0F131GJJW")}
<h2 id="monoprotein-und-allergien">Monoprotein, Allergien, Bologna</h2>
<p>Eine einzige tierische Proteinquelle wäre ein sachlicher Satz, wenn außer dem Fisch kein weiteres tierisches Erzeugnis in der Liste stünde. „Gereinigtes Tierfett“ steht da, ohne Art. Wir stufen Monoprotein und „hypoallergen“ als fragwürdig ein. Den Satz zur „erhöhten Verträglichkeit bei von Allergien geplagten Katzen“ halten wir für irreführend: Er spricht Katzen mit Allergien an. Als Diätfuttermittel ist das Futter im Listing nicht gekennzeichnet, und der Hinweis auf tierärztlichen Rat fehlt. Haut und Fell mit Bierhefe, Biotin und den Omega-Zahlen sind zulässig. „Freie Radikale“, die Universität Bologna und „ohne Tierversuche“ bleiben ohne Beleg auf der Seite fragwürdig. Den Artikeltyp Nassfutter ebenfalls. ${STRENG(6, 1)}</p>
<p>Die Herstellerseite zu „Adult Fish 1,5 kg“ beschreibt eine andere Rezeptur, mit 35 Prozent Protein und frischem Fisch (schesir.com, ${D}). Deren Hinweise übertragen wir nicht. Den Status als Alleinfutter stützen wir auf die englische Zeile des Galerie-Rückseitenfotos, nicht auf diese Herstellerseite. Eine Tagesration in Gramm haben wir auf dem Foto nicht zuverlässig abgelesen. Den Preis je Tag lassen wir deshalb leer.</p>
<div class="fp-box fp-tierschutz space-y-2 rounded-2xl border-l-4 border-good bg-good-soft p-5"><p class="text-sm font-extrabold text-brand-strong">🐾 Tierschutz</p><p>Fischart über „Hochseefisch“ hinaus und die Fangmethode sind nicht deklariert. „Aus Herstellung ohne Tierversuche“ steht im Amazon-Listing; einen Beleg zeigt die Produktseite nicht (${D}).</p></div>
<div class="fp-box fp-fazit space-y-3 rounded-3xl border-2 border-brand bg-surface p-5 shadow-card"><h2 id="fazit">Fazit</h2><p>Schesir Maintenance Fisch ist nach unserer Einschätzung ein analytisch offenes Trockenfutter, dessen Fischanteil echt beziffert ist und dessen Monoprotein-Satz am Tierfett hängen bleibt. 65 von 100 Punkten, Gelb. Amazon nennt es Nassfutter. Die Packung, die wir in der Galerie sehen, ist ein Beutel.</p></div>
${cta("B0F131GJJW", "Schesir Cat Adult Maintenance Fisch")}
${quellen(`<li>Amazon-Produktseite Schesir Cat Adult Maintenance Fisch, ASIN B0F131GJJW, Produktbeschreibung, Werbetexte, Artikeltyp, Preis (Verkäufer Amazon), ${a(src("B0F131GJJW"), "amazon.de")}, ${D}.</li><li>Amazon-Galerie derselben ASIN: Beutel, Packungsrückseite mit englisch „Complete and balanced dry food for adult cats“, eigene Sichtung ${D}. Bild 7 der Galerie (andere, rote Packung) haben wir nicht verwendet.</li><li>schesir.com, „Adult Fish 1,5 kg“, andere Rezeptur (35 Prozent Protein, frischer Fisch), nicht als Beleg für dieses Listing verwendet, ${a("https://www.schesir.com/en/products/animal-monoprotein-formula-fish-1-5kg", "schesir.com")}, ${D}.</li>`)}
${FOOT}`,
    conclusionHtml: `<p>Schesir Cat Adult Maintenance Fisch deklariert nach unserer Einschätzung Fisch, Taurin und Mineralstoffe offen und wirbt zugleich mit einer Ein-Protein-Geschichte, die das Tierfett nicht hergibt. Gelb, 65 von 100 Punkten. Die Note gilt für das Amazon-Listing vom ${D}, nicht für die abweichende Rezeptur auf der Herstellerseite mit 35 Prozent Protein.</p>`,
  },

  {
    ...BASE,
    categorySlug: "alleinfuttermittel-katze",
    brand: "Bozita",
    slug: "bozita-haeppchen-gelee-makrele-test",
    title: "Bozita Häppchen in Gelee mit Makrele im Test",
    productName: "Häppchen in Gelee mit Makrele, Nassfutter für Katzen, 12 × 370 g",
    keyword: "Bozita Häppchen Makrele",
    priceClass: "GUENSTIG" as const,
    pricePerKg: 3.36,
    packageSize: "12 × 370 g (4,44 kg)",
    price: 14.93,
    pricePerDay: 0.94 as number | null,
    imageUrl: pic("81nCwWXOHqL"),
    imageAlt: "Mehrfachpackung Bozita Tetra Häppchen in Gelee mit Makrele, Vorderseite",
    contentImageUrl: pic("71K5K+islYL"),
    contentImageAlt: "Bozita Häppchen in Gelee mit Makrele, Napf und Zutatenzeile aus der Amazon-Galerie",
    composition:
      "Huhn, Makrele (7,2 % im Stück), Schwein, Rind, Calciumcarbonat, Hefe (β-1,3/1,6-Glucan 0,01 %). Mit Sternchen als natürliche Inhaltsstoffe gekennzeichnet: Huhn, Makrele, Schwein, Rind, Hefe. Analytik: Protein 7,5 %, Fett 5 %, Rohfaser 0,5 %, Rohasche 2 % (davon Calcium 0,35 %, Phosphor 0,3 %, Magnesium 0,02 %), Feuchtigkeit 83 %, umsetzbare Energie 330 kJ/100 g. Zusatzstoffe je kg: Vitamin A 2.000 IE, Vitamin D3 200 IE, Vitamin E 12 mg, Taurin 770 mg, Kupfer 2 mg, Mangan 1,4 mg, Zink 14 mg, Jod 0,1 mg. Laut Amazon-Listing, 17.10.2026. Ein Galeriebild nennt Makrele 7,5 Prozent im Häppchen und 55 Prozent Häppchen im Produkt.",
    analysis: [
      { name: "Protein", value: 7.5 },
      { name: "Fettgehalt", value: 5 },
      { name: "Rohfaser", value: 0.5 },
      { name: "Rohasche", value: 2 },
      { name: "Calcium", value: 0.35 },
      { name: "Phosphor", value: 0.3 },
      { name: "Magnesium", value: 0.02 },
      { name: "Feuchtigkeit", value: 83 },
    ],
    scores: { scoreRaw: 18, scoreHarmful: 18, scoreNutrients: 15, scoreDeclaration: 7, scoreNeeds: 8, scoreValue: 4 } satisfies Scores,
    verdict:
      "Getreidefreies Nassfutter mit vier Tierarten, davon nur die Makrele mit Prozent. Analytik und Taurin sind vorhanden. Abzüge für den Namens-Widerspruch Huhn vor Makrele, für 7,2 gegen 7,5 Prozent und für mehrere nicht belegte Werbesätze zu Nachhaltigkeit und Verdauung.",
    teaser: "Vier Fleischarten, nur die Makrele trägt eine Prozentzahl. 70 Punkte.",
    pros: [
      "Getreide und Weizen stehen nicht in der Zusammensetzung; Makrele mit Prozentangabe (7,2 Prozent im Stück)",
      "Calcium, Phosphor, Magnesium und Taurin 770 mg/kg sind genannt; Feuchtigkeit 83 Prozent",
      "Amazon-Attribut: Alleinfuttermittel. Preis am 17.10.2026: 14,93 Euro für 4,44 kg",
    ],
    cons: [
      "Huhn steht vor der Makrele, ohne Prozent; Schwein und Rind ebenfalls ohne Menge",
      "Text sagt 7,2 Prozent Makrele im Stück, ein Galeriebild 7,5 Prozent im Häppchen",
      "Acht fragwürdige Listing- und Galerie-Sätze, darunter Nachhaltigkeit und gesunde Verdauung",
    ],
    claims: [
      c("getreidefreie und weizenfreie Katzenfutter-Häppchen", "ZULAESSIG", "Art. 11 Abs. 1 a VO (EG) 767/2009", "In der Zusammensetzung stehen Huhn, Makrele, Schwein, Rind, Calciumcarbonat und Hefe. Getreide ist dort nicht genannt. Die Angabe deckt sich mit dieser Liste."),
      c("mit Makrele: 7,2 % im Stück (Text) bzw. 7,5 % im Häppchen (Galerie)", "FRAGWUERDIG", "Art. 17 Abs. 2 a, Art. 11 Abs. 1 a VO (EG) 767/2009; FEDIAF-Kodex Anhang 5", "Beide Zahlen beziehen sich auf die Stücke, nicht auf das ganze Produkt. Laut Galeriebild machen die Häppchen 55 Prozent des Produkts aus. Aufs ganze Produkt gerechnet sind das rund 4,0 Prozent Makrele bei 7,2 Prozent im Stück und rund 4,1 Prozent bei 7,5 Prozent (eigene Berechnung). Für „mit“ sind nach dem FEDIAF-Kodex (Anhang 5) mindestens 4 Prozent üblich. Ob die Schwelle erreicht ist, hängt davon ab, welche der beiden Amazon-Zahlen stimmt. Das können wir dem Listing nicht entnehmen."),
      c("Häppchen mit hohem Fleischanteil", "FRAGWUERDIG", "Art. 17 Abs. 2 a VO (EG) 767/2009", "„Hoch“ verlangt üblicherweise eine nachvollziehbare Menge. Beziffert ist nur die Makrele. Huhn, Schwein und Rind stehen ohne Prozent. Ein Galeriebild nennt „55 % Häppchen im Produkt“. Häppchen sind nicht dasselbe wie Fleischanteil."),
      c("ideal geeignet für sensible Samtpfoten, die eine gesunde Verdauung benötigen", "FRAGWUERDIG", "Art. 13 Abs. 1 VO (EG) 767/2009", "Eine Verdaulichkeit ist nicht genannt. Hefe mit 0,01 Prozent Beta-Glucan trägt den Satz nicht. „Sensibel“ benennt keine Krankheit, bleibt aber ohne Rezepturbeleg unscharf."),
      c("7,5 % Eiweiß und 5 % Fett bietet … die ideale Balance", "FRAGWUERDIG", "Art. 13 Abs. 1 VO (EG) 767/2009", "7,5 Prozent Protein und 5 Prozent Fett stehen so in der Analytik, bezogen auf das Nassfutter mit 83 Prozent Feuchtigkeit. Die Zahlen stimmen mit der Liste überein. „Ideale Balance“ ist eine Wertung ohne Maßstab. In der Trockenmasse sind es rund 44 Prozent Protein und 29 Prozent Fett (eigene Umrechnung)."),
      c("nachhaltigen Bozita Katzennassfutters / nachhaltig", "FRAGWUERDIG", "Art. 13 Abs. 1 VO (EG) 767/2009; § 5 UWG", "„Nachhaltig“ ist ohne Kriterium nicht nachprüfbar. Die Galerie nennt Ökostrom und schwedische Bauern. Belege, Zertifikate oder Anteile fehlen auf der Produktseite."),
      c("ausschließlich nicht gentechnisch veränderten Rohstoffen", "FRAGWUERDIG", "Art. 11 Abs. 1 VO (EG) 767/2009", "Einen Beleg oder ein Siegel zeigt das Listing nicht. Die Freiheitsangabe bleibt aus unserer Sicht unauditiert."),
      c("ohne künstliche Zusätze", "FRAGWUERDIG", "Art. 11 Abs. 1 a VO (EG) 767/2009", "Farb-, Aroma- und Konservierungsstoffe sind nicht deklariert. Vitamine und Spurenelemente sind es. „Ohne künstliche Zusätze“ ohne den Hinweis auf zugesetzte Vitamine und Mineralstoffe halten wir für erklärungsbedürftig."),
      c("Deutlich höhere Tierwohlstandards … Zutaten von schwedischen Bauern (Galerie)", "FRAGWUERDIG", "Art. 11 Abs. 1 a VO (EG) 767/2009; § 5 UWG", "Das steht auf einem Galeriebild, nicht in der Zusammensetzung. Huhn, Makrele, Schwein und Rind haben dort keine Herkunft. Wir geben den Satz als Bildtext wieder und prüfen ihn nicht als erwiesene Haltung."),
    ],
    metaTitle: "Bozita Häppchen in Gelee mit Makrele im Test",
    metaDescription: "Bozita Häppchen mit Makrele im Test: Huhn zuerst, Makrele 7,2 Prozent, Galerie sagt 7,5. 70 von 100 Punkten nach unserem Schema.",
    keywords: ["Bozita Makrele Test", "Bozita Häppchen Gelee", "Bozita Katzenfutter", "Nassfutter Katze Makrele", "Bozita Tetra Test"],
    bodyHtml: `<p>„Häppchen in Gelee mit Makrele“, 7,2 Prozent „im Stück“: So steht es im Amazon-Text vom ${D} für <strong>Bozita</strong>. Die Zusammensetzung beginnt mit Huhn. Ein Galeriebild schreibt 7,5 Prozent Makrele im Häppchen. Zwei Zahlen, ein Name.</p>
<div class="fp-box fp-kurz space-y-3 rounded-3xl border-2 border-brand bg-brand-soft p-5"><p class="text-sm font-extrabold text-brand-strong">📌 Das Wichtigste in Kürze</p><ul>
<li>Vier Tierarten, nur die Makrele mit Prozent. Getreide ist nicht deklariert.</li>
<li>Text 7,2 Prozent, Galerie 7,5 Prozent. Huhn steht ohne Menge an erster Stelle.</li>
<li>Amazon-Preis am ${D}, Verkäufer Amazon: 14,93 Euro für 12 × 370 g, angegeben 3,36 Euro je kg.</li>
<li>70 von 100 Punkten, Gelb, nach unserem rezepturbasierten Bewertungsschema.</li>
</ul></div>
${METHODE("B0GDVGCMDF")}
<h2 id="huhn-vor-der-makrele">Huhn vor der Makrele</h2>
<p>Die Zeile ist kurz, und Kürze kann eine Tugend sein: Huhn, Makrele 7,2 Prozent im Stück, Schwein, Rind, Calciumcarbonat, Hefe mit 0,01 Prozent Beta-Glucan. Sternchen markieren „natürliche Inhaltsstoffe“. Getreide fehlt, Zucker fehlt. Das ist nach unserer Einschätzung eine lesbare Nassfutter-Liste. Was fehlt, sind die Prozente für Huhn, Schwein und Rind. Der Name verspricht Makrele. Die Reihenfolge verspricht Huhn. Die 7,2 Prozent beziehen sich auf die Stücke. Aufs ganze Produkt gerechnet sind es rund 4 Prozent (eigene Berechnung mit den 55 Prozent Häppchen aus der Galerie), also knapp an der für „mit“ üblichen Schwelle. Nach unserem Schema 18 von 30 Punkten bei den Rohstoffen.</p>
${figure("71K5K+islYL", "Bozita Häppchen in Gelee mit Makrele, Napf und Zutatenzeile mit 7,5 Prozent Makrele", "B0GDVGCMDF")}
<div class="fp-box fp-merk space-y-2 rounded-2xl border-l-4 border-mid bg-mid-soft p-5"><p class="font-extrabold">💡 So steht es auf dem Etikett</p><ul>
<li>Bestandteile-Text: Makrele 7,2 Prozent im Stück. Galerie: „7,5 % im Häppchen“ und „55 % Häppchen im Produkt“.</li>
<li>Amazon-Attribut: Alleinfuttermittel. Energie: 330 kJ je 100 g.</li>
<li>Eisen und Selen: nicht deklariert. Taurin: 770 mg/kg.</li>
</ul></div>
<h2 id="sieben-komma-fuenf-im-napf">7,5 Prozent im Napf, 44 in der Trockenmasse</h2>
<p>Protein 7,5 Prozent und Fett 5 Prozent klingen mager, bis man die 83 Prozent Wasser abzieht. In der Trockenmasse sind das rund 44 Prozent Protein und 29 Prozent Fett (eigene Umrechnung, Teiler 17). Calcium 0,35 Prozent, Phosphor 0,3 Prozent, Magnesium 0,02 Prozent. Das Verhältnis Calcium zu Phosphor liegt bei etwa 1,2. Vitamin A, D3 und E, Taurin, Kupfer, Mangan, Zink und Jod sind beziffert. Eisen und Selen nicht. 330 kJ je 100 g sind rund 79 kcal (eigene Umrechnung, Teiler 4,184). Die Nährstoffseite ist damit brauchbar und nicht vollständig. 15 von 20 Punkten.</p>
<div class="fp-table rounded-2xl border border-border p-4"><table><thead><tr><th>Bestandteil</th><th>Nass, laut Listing</th><th>Trockenmasse, eigene Umrechnung</th></tr></thead><tbody>
<tr><td>Protein</td><td>7,5 %</td><td>44,1 %</td></tr>
<tr><td>Fett</td><td>5 %</td><td>29,4 %</td></tr>
<tr><td>Rohfaser</td><td>0,5 %</td><td>2,9 %</td></tr>
<tr><td>Rohasche</td><td>2 %</td><td>11,8 %</td></tr>
<tr><td>Calcium</td><td>0,35 %</td><td>2,1 %</td></tr>
<tr><td>Phosphor</td><td>0,3 %</td><td>1,8 %</td></tr>
</tbody></table></div>
<p class="text-sm text-muted">Eigene Umrechnung: Wert ÷ (100 − 83) × 100. Gerundet auf eine Nachkommastelle.</p>
<h2 id="nachhaltig-steht-ohne-mass">„Nachhaltig“ steht ohne Maß</h2>
<p>Getreidefrei deckt sich mit der Liste. „Mit Makrele“ liegt mit rund 4 Prozent im ganzen Produkt knapp an der Schwelle. Der Rest des Werbetextes ist weicher: hoher Fleischanteil ohne Summe, gesunde Verdauung ohne Verdaulichkeit, ideale Balance als Wort über zwei korrekten Nass-Prozenten, nachhaltig, ohne Gentechnik, ohne künstliche Zusätze. Acht Sätze stufen wir als fragwürdig ein, keinen halten wir für irreführend. ${STRENG(8, 0)} Die Deklaration liegt bei 7 von 15.</p>
<h2 id="vier-euro-nicht-ganz">Nicht ganz ein Euro am Tag</h2>
<p>Amazon nannte am ${D} 14,93 Euro für 12 × 370 g, also 4,44 kg, Verkäufer Amazon, 3,36 Euro je kg. Die Fütterungsgrafik nennt für eine 4-kg-Katze 280 g am Tag, für 2 kg 180 g (eigene Abschrift). 0,28 kg mal 3,36 Euro sind 0,94 Euro am Tag (eigene Berechnung). Für Nassfutter mit vier benannten Tierarten, wenn auch ohne Mengen, ist das nach unserer Einschätzung ein niedriger Preis. 4 von 5 Punkten bei der Preis-Leistung.</p>
${figure("61tz+jjK8-L", "Fütterungsempfehlung Bozita Häppchen mit Makrele, Tagesbedarf nach Gewicht der Katze", "B0GDVGCMDF")}
${figure("71CkQomLZtL", "Galeriebild Bozita mit Aussagen zu Tierwohlstandards, schwedischen Bauern und Strom aus erneuerbaren Quellen", "B0GDVGCMDF")}
<div class="fp-box fp-tierschutz space-y-2 rounded-2xl border-l-4 border-good bg-good-soft p-5"><p class="text-sm font-extrabold text-brand-strong">🐾 Tierschutz</p><p>Auf einem Galeriebild steht: „Deutlich höhere Tierwohlstandards in der Nutztierhaltung durch strenge Tierschutzgesetze“ und „Alle Produkte beinhalten Zutaten von schwedischen Bauern, die wir kennen und denen wir vertrauen“ (Amazon-Galerie, ${D}). Die Zusammensetzung nennt für Huhn, Makrele, Schwein und Rind keine Herkunft und für die Makrele keine Fangmethode. Den Bildtext geben wir wieder. Einen Beleg, etwa eine Herkunftsangabe oder ein Zertifikat, zeigt die Produktseite nicht.</p></div>
<div class="fp-box fp-fazit space-y-3 rounded-3xl border-2 border-brand bg-surface p-5 shadow-card"><h2 id="fazit">Fazit</h2><p>Bozita Häppchen mit Makrele ist nach unserer Einschätzung ein kurzes, getreidefreies Nassfutter, das die Makrele in den Namen stellt und das Huhn an den Anfang der Liste. 70 von 100 Punkten, Gelb. 7,2 oder 7,5 Prozent: Das sollte auf der Packung eine Zahl sein, nicht zwei.</p></div>
${cta("B0GDVGCMDF", "Bozita Häppchen in Gelee mit Makrele")}
${quellen(`<li>Amazon-Produktseite Bozita Tetra mit Makrele, ASIN B0GDVGCMDF, Bestandteile, Werbetexte, Attribut Alleinfuttermittel, Preis (Verkäufer Amazon), ${a(src("B0GDVGCMDF"), "amazon.de")}, ${D}.</li><li>Amazon-Galerie derselben ASIN: Napf-Bild mit 7,5 Prozent und 55 Prozent Häppchen, Fütterungstabelle (4 kg: 280 g), Bild zu Tierwohl und schwedischen Bauern, eigene Sichtung ${D}.</li>`)}
${FOOT}`,
    conclusionHtml: `<p>Bozita Häppchen in Gelee mit Makrele ist nach unserer Einschätzung ein transparent kurzes Nassfutter mit einer schiefen Überschrift: Die Makrele ist beziffert, das Huhn davor nicht. Gelb, 70 von 100 Punkten. Die Note gilt für das Listing vom ${D}, einschließlich der zweiten Prozentzahl auf dem Galeriebild.</p>`,
  },
];
