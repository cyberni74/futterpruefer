/** Fünf Produkt-Tests vom 16.10.2026. Bewertung ausschließlich anhand veröffentlichter Hersteller- bzw. Händlerangaben (Abruf 16.10.2026). Bilder: Hersteller (Produktseiten bzw. Hersteller-Shop; Purina-Packshots über Fressnapf-Händlerfotos vom Hersteller). */
const D = "16.10.2026";
const a = (u: string, l: string) => `<a href="${u}">${l}</a>`;
type Claim = { claim: string; rating: "ZULAESSIG" | "FRAGWUERDIG" | "UNZULAESSIG"; legal: string; reason: string; imageUrl: string };
const c = (claim: string, rating: Claim["rating"], legal: string, reason: string): Claim => ({ claim, rating, legal, reason, imageUrl: "" });
const METHODE = (quelle: string) => `<h2>Wie wir getestet haben</h2>
<p>Wir haben das Futter weder im Labor analysiert noch an Tieren erprobt. Grundlage sind die Angaben auf ${quelle} (abgerufen am ${D}), ergänzt durch Händlerangaben, die wir ausdrücklich als solche kennzeichnen. Bewertet wird nach unserem 100-Punkte-Schema und nach den Regeln der Futtermittelkennzeichnung (VO (EG) 767/2009) und des Wettbewerbsrechts (UWG). Die Einstufung der Werbeaussagen ist unsere begründete Einschätzung, keine rechtsverbindliche Feststellung. Bild: Hersteller.</p>`;
const FOOT = `<p><em>Hinweis:</em> Alle Zitate stammen von den genannten Seiten (Stand ${D}). Preise und Texte können sich ändern. Hersteller können uns Belege zukommen lassen.</p>`;
const STRENG = (f: number, u: number) => `<strong>Strenge Wertung:</strong> Jede fragwürdige Werbeaussage kostet einen Punkt bei der Deklaration, jede unzulässige drei; hier sind es ${f} fragwürdige und ${u} unzulässige Aussagen.`;
const BASE_K = { categorySlug: "alleinfuttermittel-katze", gallery: [] as string[], publishedDaysAgo: 0, imageMarker: "Bild: Hersteller", priceDate: "2026-10-16T10:00:00Z", testedAt: "2026-10-16T08:00:00Z" };
const BASE_H = { ...BASE_K, categorySlug: "alleinfuttermittel-hund" };
const BASE_EK = { ...BASE_K, categorySlug: "ergaenzungsfuttermittel-katze" };

const HI = "https://www.hillspet.de/dog-food/science-plan-adult-medium-chicken-dry";
const HI_FN = "https://www.fressnapf.de/p/hills-science-plan-trockenfutter-hund-medium-adult-mit-huhn-14-kg-1325145/";
const LE = "https://www.leonardo-catfood.de/leonardo-adult-gf-poultry";
const AP = "https://applaws.com/uk/products/chicken-breast-in-broth-2/";
const AP_Z = "https://www.zooplus.de/shop/katzen/katzenfutter_dose/applaws_katzenfutter/applaws_katzenfutter_dose/53724";
const RI = "https://www.rinti.de/produkt/kennerfleisch-dose-rind-400g";
const RI_Z = "https://www.zooplus.de/shop/hunde/hundefutter_nassfutter/rinti/rinti_dose/404467";
const PU = "https://www.purina.de/hund/hundefutter/produkt-pro-plan-optibalance-adult-medium-huhn";
const PU_FN = "https://www.fressnapf.de/p/pro-plan-adult-medium-everyday-nutrition-huhn-14-kg-1206427/";

export const DAILY_OKT16_TESTS = [
  // 1) Hill's Science Plan Medium Adult mit Huhn
  {
    ...BASE_H,
    brand: "Hill's Science Plan",
    slug: "hills-science-plan-medium-adult-huhn-test",
    title: "Hill's Science Plan Medium Adult mit Huhn im Test: 69/100 Punkte",
    productName: "Science Plan Medium Adult mit Huhn, Trockenfutter für Hunde, 14 kg",
    keyword: "Hill's Science Plan Medium Adult Huhn",
    priceClass: "MITTEL" as const,
    pricePerKg: 4.82,
    packageSize: "14 kg (auch 2,5 kg)",
    price: 67.49,
    pricePerDay: 1.37 as number | null,
    image: "hills-science-plan-medium-adult-huhn-packshot-hersteller.webp",
    imageAlt: "Sack Hill's Science Plan Medium Adult mit Huhn (Bild: Hersteller)",
    contentImage: "hills-science-plan-medium-adult-huhn-pelletgroesse-hersteller.webp",
    contentImageAlt: "Pelletgröße Hill's Science Plan Medium Adult, 12,5 mm (Bild: Hersteller)",
    composition:
      "Weizen, Mais, Hühner- und Truthahnmehl (Huhn 9%; Geflügel gesamt 14%), Bruchreis, tierische Fette, Proteinhydrolysat, Maisproteinmehl, Pflanzenöl, Mineralstoffe, Rübentrockenschnitzel, Leinsamen, Haferkleie, Fructooligosaccharide. ActivBiome+ Multi Benefit Präbiotikamischung (0,6 %): Haferkleie, Fructooligosaccharide. Ernährungsphysiologische Zusatzstoffe je kg: Eisen 84,5 mg, Jod 2,8 mg, Kupfer 9,1 mg, Mangan 8,7 mg, Zink 140 mg, Selen 0,1 mg; mit natürlichem Antioxidans.",
    analysis: [
      { name: "Protein", value: 21.5 },
      { name: "Fettgehalt", value: 14.9 },
      { name: "Rohfaser", value: 1.5 },
      { name: "Rohasche", value: 4.6 },
      { name: "Omega-6-Fettsäuren", value: 3.4 },
      { name: "Calcium", value: 0.69 },
      { name: "Phosphor", value: 0.61 },
      { name: "Natrium", value: 0.26 },
      { name: "Kalium", value: 0.69 },
      { name: "Magnesium", value: 0.08 },
    ],
    scores: { scoreRaw: 12, scoreHarmful: 17, scoreNutrients: 18, scoreDeclaration: 11, scoreNeeds: 8, scoreValue: 3 },
    verdict:
      "Vollständig mineralisiertes und vitaminiertes Alleinfutter für mittelgroße Adult-Hunde, mit ausführlicher Analytik. Abzüge: Weizen und Mais stehen vor dem Fleisch, benanntes Huhn nur 9 %, mehrere werbliche Gesundheitsversprechen zur ActivBiome+-Mischung.",
    teaser: "Viel Getreide, volle Mineralstoffliste. 69 Punkte.",
    pros: [
      "Calcium, Phosphor, Natrium, Kalium, Magnesium sowie Vitamine A, D3, E und C beziffert; Energie 372 kcal/100 g",
      "Spurenelemente Eisen, Jod, Kupfer, Mangan, Zink und Selen vollständig deklariert",
      "Klare Fütterungstabelle für Adult-Hunde 1–6 Jahre; Pelletgröße angegeben",
    ],
    cons: [
      "Weizen und Mais vor dem Fleisch; benanntes Huhn nur 9 %, Geflügel gesamt 14 %",
      "„Hühner- und Truthahnmehl“ als Sammelbegriff; Proteinhydrolysat und Maisproteinmehl ohne Mengen",
      "Vier fragwürdige Werbeaussagen („100 % gesund und ausgewogen“, ActivBiome+-Nutzen, „wissenschaftlich fundiert“, „leicht verdaulich“)",
    ],
    claims: [
      c("zu 100% gesunde und ausgewogene Ernährung", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1; UWG § 5", "„100 % gesund“ ist absolut und auf der Seite nicht nachprüfbar belegt. „Ausgewogen“ entspricht dem Anspruch eines Alleinfutters, die Absolute bleibt erklärungsbedürftig."),
      c("ActivBiome+ Multi-Benefit-Technologie … unterstützt die Verdauung, das Immunsystem und die Gesundheit der Organe", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1", "Die Präbiotikamischung (0,6 %) ist deklariert. Aussagen zu Immunsystem und Organgesundheit gehen über eine reine Zusammensetzungsangabe hinaus und sind auf der Seite nicht mit nachprüfbaren Belegen verknüpft."),
      c("Fördert ein schönes Fell und eine schöne Haut mit Omega-6-Fettsäuren und Vitamin E", "ZULAESSIG", "VO (EG) 767/2009 Art. 13", "Omega-6 (3,4 %) und Vitamin E (587 mg/kg) sind in der Analytik bzw. den Zusatzstoffen genannt; die Aussage bleibt im üblichen Werberahmen für Haut und Fell."),
      c("Wissenschaftlich fundierte Ernährung für ein langes, gesundes Leben", "FRAGWUERDIG", "UWG § 5; VO (EG) 767/2009 Art. 13", "„Wissenschaftlich fundiert“ und „langes, gesundes Leben“ sind auf der Produktseite nicht konkret belegt."),
      c("Leicht verdauliche Inhaltsstoffe und Ballaststoffe für eine gesunde Verdauung", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1", "„Leicht verdaulich“ und „gesunde Verdauung“ sind Wertungen ohne nachprüfbare Messwerte auf der Seite."),
    ],
    metaTitle: "Hill's Science Plan Medium Adult mit Huhn im Test: 69/100 Punkte",
    metaDescription: "Hill's Science Plan Medium Adult Huhn im Test: Zusammensetzung, Mineralstoffe, ActivBiome+-Werbeaussagen und Preis. 69 von 100 Punkten nach unserem Schema.",
    keywords: ["Hill's Science Plan Test", "Hill's Medium Adult Huhn", "Hundetrockenfutter Test", "Science Plan Medium", "Hill's Hundefutter Erfahrungen"],
    bodyHtml: `<p>„Zu 100 % gesunde und ausgewogene Ernährung“ und dazu ActivBiome+ für Verdauung, Immunsystem und Organe: So stellt Hill’s das Trockenfutter <strong>Science Plan Medium Adult mit Huhn</strong> vor (${a(HI, "hillspet.de")}, abgerufen am ${D}). Der Name verspricht Wissenschaft. Die Zutatenliste beginnt mit Weizen.</p>
${METHODE(a(HI, "hillspet.de"))}
<h2>Huhn steht weit hinten in der Reihe</h2>
<p>Die Zusammensetzung startet mit Weizen und Mais, erst dann folgt „Hühner- und Truthahnmehl (Huhn 9 %; Geflügel gesamt 14 %)“. Neun Prozent benanntes Huhn in einem Beutel, der nach Huhn klingt: Das ist nach unserer Einschätzung wenig. Der Rest der Proteinrechnung kommt aus Truthahnmehl, Proteinhydrolysat und Maisproteinmehl – Mengen dafür fehlen. Nach unserem rezepturbasierten Bewertungsschema gibt es dafür 12 von 30 Punkten bei den Rohstoffen.</p>
<h2>Die Mineralstoffliste ist das eigentliche Plus</h2>
<p>Protein 21,5 %, Fett 14,9 %, Rohfaser 1,5 %, Rohasche 4,6 %: solide Alleinfutterwerte. Dazu Calcium 0,69 %, Phosphor 0,61 %, Natrium, Kalium, Magnesium, Omega-6 3,4 % und Energie 372 kcal/100 g. Vitamine A, D3, E und C sowie Eisen, Jod, Kupfer, Mangan, Zink und Selen sind beziffert. Wer Zahlen sucht, findet sie hier. Das verdient Lob.</p>
<h2>ActivBiome+: 0,6 Prozent und große Worte</h2>
<p>Die Präbiotikamischung aus Haferkleie und Fructooligosacchariden steht mit 0,6 % in der Liste. Auf der Seite werden daraus Vorteile für Verdauung, Immunsystem und Organgesundheit. Die Mischung ist nachlesbar, die Reichweite der Versprechen nicht. Wir stufen ActivBiome+-Nutzen, „100 % gesund“, „wissenschaftlich fundiert“ und „leicht verdaulich“ als fragwürdig ein. Zulässig bleibt die Fell-Aussage mit Omega-6 und Vitamin E.</p>
<h2>Preis: Mittelklasse für Getreidekost</h2>
<p>Bei Fressnapf kostet der 14-kg-Sack 67,49 €, also 4,82 €/kg (${a(HI_FN, "fressnapf.de")}, Stand ${D}; Händlerangabe). Hill’s empfiehlt für 20 kg 285 g am Tag. Das sind rund 1,37 € pro Tag (eigene Berechnung). Für ein getreidereiches Adult-Futter ist das nach unserer Einschätzung eher hoch.</p>
<p><strong>Unser Gesamtergebnis: 69 von 100 Punkten</strong>, Ampel Gelb nach unserem rezepturbasierten Bewertungsschema. ${STRENG(4, 0)} Die Analytik ist vorbildlich, die Fleischkennzeichnung mager. Wer „Huhn“ im Titel liest, sollte die 9 % im Kleingedruckten mitlesen.</p>
${FOOT}`,
    conclusionHtml: `<p>Hill’s Science Plan Medium Adult mit Huhn ist nach unserer Einschätzung ein gründlich mineralisiertes Alleinfutter mit schwacher Fleischkennzeichnung und starken Werbeformeln rund um ActivBiome+. Die Zahlen stimmen, der Huhn-Anteil bleibt klein. Gelb nach unserem Schema.</p>`,
  },

  // 2) Leonardo Adult GF Poultry
  {
    ...BASE_K,
    brand: "Leonardo",
    slug: "leonardo-adult-gf-poultry-test",
    title: "Leonardo Adult GF Poultry im Test: 80/100 Punkte",
    productName: "Adult GF Poultry, getreidefreies Trockenfutter für Katzen, 300 g",
    keyword: "Leonardo Adult GF Poultry",
    priceClass: "PREMIUM" as const,
    pricePerKg: 17.3,
    packageSize: "300 g (auch größere Gebinde)",
    price: 5.19,
    pricePerDay: 0.87 as number | null,
    image: "leonardo-adult-gf-poultry-packshot-hersteller.webp",
    imageAlt: "Beutel Leonardo Adult GF Poultry, 300 g (Bild: Hersteller)",
    contentImage: "leonardo-adult-gf-poultry-composing-hersteller.webp",
    contentImageAlt: "Leonardo Adult GF Poultry Packungen verschiedener Größen (Bild: Hersteller)",
    composition:
      "Frisches Geflügelfleisch (30 %); Geflügelprotein, aschearm getrocknet (22 %); Amaranth (15 %); Kartoffelstärke; Erbsenmehl; Geflügelfett; Geflügelleber hydrolysiert; Meeres-Zooplankton (Krill) (2,5 %); Fischmehl aus Meeresfischen (2,5 %); Bierhefe, inaktiviert (2,5 %); Ei getrocknet; Traubenkernexpeller; Chiasaat (1,3 %); Johannisbrotschrot; Natriumchlorid; Kaliumchlorid; Dicalciumphosphat; Chicoree Inulin. Ernährungsphysiologische Zusatzstoffe je kg: Vitamin A 15.000 IE, Vitamin D3 1.500 IE, Vitamin E 150 mg, Vitamin C 245 mg, Taurin 1.400 mg; Kupfer 15 mg, Eisen 200 mg, Mangan 50 mg, Zink 125 mg, Jod 2,5 mg, Selen 0,05 mg. Technologisch: Lecithin 2.000 mg, Tocopherol-Extrakte 80 mg.",
    analysis: [
      { name: "Protein", value: 32 },
      { name: "Fettgehalt", value: 18 },
      { name: "Rohasche", value: 8.2 },
      { name: "Rohfaser", value: 2.8 },
      { name: "Feuchtigkeit", value: 10 },
      { name: "Calcium", value: 1.0 },
      { name: "Phosphor", value: 0.7 },
      { name: "Natrium", value: 0.4 },
    ],
    scores: { scoreRaw: 23, scoreHarmful: 18, scoreNutrients: 17, scoreDeclaration: 10, scoreNeeds: 9, scoreValue: 3 },
    verdict:
      "Getreidefreies Katzen-Trockenfutter mit 30 % frischem Geflügelfleisch und 22 % getrocknetem Geflügelprotein, offener Mineralstoff- und Taurinangabe. Abzüge: mehrere unverträglichkeits- und abwehrbezogene Werbeaussagen (Superfoods, Stay-Clean, Provital, PH-Control) ohne nachprüfbare Belege auf der Seite.",
    teaser: "Frischfleisch mit Prozenten, Werbung mit Superlativen. 80 Punkte.",
    pros: [
      "30 % frisches Geflügelfleisch und 22 % getrocknetes Geflügelprotein beziffert; ohne Getreide (Amaranth statt)",
      "Taurin 1.400 mg/kg, Vitamine A/D3/E/C und Spurenelemente vollständig; Calcium 1 %, Phosphor 0,7 %",
      "Anteil tierisches Eiweiß am Gesamteiweiß mit 80 % angegeben; Made in Germany",
    ],
    cons: [
      "Kartoffelstärke und Erbsenmehl ohne Mengenangabe; Amaranth 15 % ist kein Fleisch",
      "Fünf fragwürdige Werbeaussagen (Superfoods, Unverträglichkeiten/sensibel, Stay-Clean, PH-Control, Provital Abwehrkräfte)",
      "Premiumpreis: 17,30 €/kg im Hersteller-Shop (300 g für 5,19 €)",
    ],
    claims: [
      c("Mit Superfoods wie Amaranth", "FRAGWUERDIG", "UWG § 5", "„Superfood“ ist kein futtermittelrechtlich definierter Begriff und wird auf der Seite nicht belegt."),
      c("Ideal bei Futtermittelunverträglichkeiten / Auch für sensible Katzen geeignet", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1; UWG § 5", "Getreidefreiheit ist nachvollziehbar. „Ideal bei Unverträglichkeiten“ und „sensibel“ ohne Angabe konkreter Allergene oder Ausschlussdiagnostik sind zu weit gefasst."),
      c("STAY-CLEAN™ Zur Plaque Reduktion", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1", "Eine zahnmedizinische Wirkung (Plaque-Reduktion) ist auf der Produktseite nicht mit nachprüfbaren Belegen hinterlegt."),
      c("PH-CONTROL Optimiert den pH-Wert des Harns", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1", "Eine Aussage zur Optimierung des Harn-pH geht über die reine Nährstoffkennzeichnung hinaus und ist auf der Seite nicht belegt."),
      c("PROVITAL Stärkt die Abwehrkräfte mit Beta-Glucanen aus Bierhefe", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1", "Bierhefe ist deklariert. „Stärkt die Abwehrkräfte“ ist eine Gesundheitsaussage ohne nachprüfbaren Beleg auf der Seite."),
      c("Rezeptur mit Amaranth statt Getreide / ohne Getreide", "ZULAESSIG", "VO (EG) 767/2009 Art. 11", "In der Zusammensetzung ist kein Getreide genannt; Amaranth steht mit 15 %."),
    ],
    metaTitle: "Leonardo Adult GF Poultry im Test: 80/100 Punkte",
    metaDescription: "Leonardo Adult GF Poultry im Test: frisches Geflügel, Amaranth, Taurin, Werbeaussagen Stay-Clean und Provital. 80 von 100 Punkten nach unserem Schema.",
    keywords: ["Leonardo Adult GF Poultry Test", "Leonardo getreidefrei", "Katzenfutter ohne Getreide", "Leonardo Trockenfutter Test", "Leonardo Erfahrungen"],
    bodyHtml: `<p>„Mit extra frischem Geflügel“ und „ideal bei Futtermittelunverträglichkeiten“: Leonardo bewirbt <strong>Adult GF Poultry</strong> als getreidefreie Lösung für sensible Katzen (${a(LE, "leonardo-catfood.de")}, abgerufen am ${D}). Frisches Fleisch mit Prozentangabe – das lesen wir gern. Die „Superfoods“ und die Plaque-Versprechen lesen wir genauer.</p>
${METHODE(a(LE, "leonardo-catfood.de"))}
<h2>Dreißig Prozent frisch, zweiundzwanzig getrocknet</h2>
<p>Ganz vorn: frisches Geflügelfleisch 30 %, dazu aschearmes getrocknetes Geflügelprotein 22 %. Das sind nach unserer Einschätzung klare Ansagen. Amaranth folgt mit 15 %, dann Kartoffelstärke und Erbsenmehl ohne Mengen. Krill, Fischmehl und Bierhefe stehen jeweils bei 2,5 %, Chiasaat bei 1,3 %. Nach unserem rezepturbasierten Bewertungsschema: 23 von 30 Punkten bei den Rohstoffen.</p>
<h2>Taurin und Mineralstoffe stehen auf der Liste</h2>
<p>Protein 32 %, Fett 18 %, Rohasche 8,2 %, Feuchte 10 %, Calcium 1 %, Phosphor 0,7 %, Natrium 0,4 %. Taurin ist mit 1.400 mg/kg deklariert, dazu die üblichen Vitamine und Spurenelemente. Der Hersteller nennt 80 % tierisches Eiweiß am Gesamteiweiß. Für ein Trockenfutter ist das ein stimmiges Profil.</p>
<h2>Stay-Clean, PH-Control, Provital: drei Stempel, wenig Fußnoten</h2>
<p>Auf der Seite stehen Plaque-Reduktion, optimierter Harn-pH und gestärkte Abwehrkräfte neben „Superfoods“ und der Eignung bei Unverträglichkeiten. Getreidefreiheit ist durch die Zutatenliste gedeckt. Die übrigen fünf Aussagen stufen wir als fragwürdig ein: Sie klingen nach Klinik, liefern aber keine nachprüfbaren Belege auf der Produktseite.</p>
<h2>Preis: Premium im kleinen Beutel</h2>
<p>Im Hersteller-Shop kostet die 300-g-Packung 5,19 €, also 17,30 €/kg (${a(LE, "leonardo-catfood.de")}, Stand ${D}). Für eine 4-kg-Wohnungskatze nennt Leonardo etwa 50 g. Das sind rund 0,87 € pro Tag (eigene Berechnung). Teuer pro Kilo, vergleichsweise moderat pro Tag.</p>
<p><strong>Unser Gesamtergebnis: 80 von 100 Punkten</strong>, Ampel Grün nach unserem rezepturbasierten Bewertungsschema. ${STRENG(5, 0)} Die Deklaration des Fleisches überzeugt, die Werbestempel weniger.</p>
${FOOT}`,
    conclusionHtml: `<p>Leonardo Adult GF Poultry ist nach unserer Einschätzung ein offen deklariertes, getreidefreies Katzentrockenfutter mit hohem, beziffertem Geflügelanteil und vollständiger Taurin- und Mineralstoffangabe. Abzüge kosten vor allem unverträglichkeits- und abwehrbezogene Werbeaussagen. Grün nach unserem Schema – mit Vorbehalt bei den Stempelversprechen.</p>`,
  },

  // 3) Applaws Hähnchenbrust in Brühe 156g
  {
    ...BASE_EK,
    brand: "Applaws",
    slug: "applaws-haehnchenbrust-in-bruehe-156g-test",
    title: "Applaws Hähnchenbrust in Brühe 156 g im Test: 73/100 Punkte",
    productName: "Hähnchenbrust in Brühe, Ergänzungsfuttermittel für Katzen, 156 g Dose",
    keyword: "Applaws Hähnchenbrust Brühe",
    priceClass: "PREMIUM" as const,
    pricePerKg: 13.88,
    packageSize: "6 × 156 g (Dosen)",
    price: 12.99,
    pricePerDay: 2.17 as number | null,
    image: "applaws-haehnchenbrust-bruehe-156g-packshot-hersteller.webp",
    imageAlt: "Dose Applaws Chicken Breast in Broth, 156 g (Bild: Hersteller)",
    contentImage: "applaws-haehnchenbrust-bruehe-156g-teller-hersteller.webp",
    contentImageAlt: "Applaws Hähnchenbrust in Brühe auf dem Teller (Bild: Hersteller)",
    composition:
      "Hühnchenbrust (75 %), Hühnerbrühe, Reis. Laut Hersteller keine Zusatzstoffe. Ergänzungsfuttermittel für ausgewachsene Katzen. (DE-Händler zooplus.de, Abruf 16.10.2026; UK-Herstellerseite nennt zusätzlich Brühe 24 % und Reis 1 % sowie Analyse Protein 16 %, Feuchte 80 %, 129,2 kcal/Dose.)",
    analysis: [
      { name: "Rohprotein", value: 14.0 },
      { name: "Rohfett", value: 1.0 },
      { name: "Rohfaser", value: 1.0 },
      { name: "Rohasche", value: 2.0 },
      { name: "Feuchtigkeit", value: 82.0 },
    ],
    scores: { scoreRaw: 26, scoreHarmful: 18, scoreNutrients: 8, scoreDeclaration: 14, scoreNeeds: 5, scoreValue: 2 },
    verdict:
      "Sehr klar deklariertes Ergänzungsfutter mit 75 % benannter Hähnchenbrust, ohne Zusatzstoffe. Abzüge: nur Ergänzung (keine Alleinfutter-Versorgung), DE-Analyse ohne Energieangabe, „100 % natural“ bei erhitzter Dose erklärungsbedürftig, hoher Kilopreis.",
    teaser: "Brust mit Namen, Dose ohne Alleinfutter-Anspruch. 73 Punkte.",
    pros: [
      "Hühnchenbrust mit 75 % beziffert; kurze Zutatenliste ohne Zusatzstoffe",
      "Als Ergänzungsfuttermittel klar gekennzeichnet; Fütterungshinweis mit Tagesmengen",
      "Transparente UK-Angaben zu Brühe/Reis und Energie (129,2 kcal/Dose) auf der Herstellerseite",
    ],
    cons: [
      "Ergänzungsfuttermittel: deckt den Nährstoffbedarf allein nicht; Hauptmahlzeit nötig",
      "DE-Händleranalyse (Protein 14 %, Feuchte 82 %) weicht von der UK-Herstellerangabe ab",
      "„100 % natural“ in der Dose ist erklärungsbedürftig; 13,88 €/kg im Multipack",
    ],
    claims: [
      c("100% Natural Ingredients / 100% natural complementary pet food", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Die Dose wird industriell hergestellt und erhitzt. Was „100 % natural“ hier genau ausschließt, erklärt die Seite nicht ausreichend."),
      c("contains nothing more than the ingredients listed / Contains no additives", "ZULAESSIG", "VO (EG) 767/2009 Art. 11", "Zusammensetzung nennt nur Brust, Brühe und Reis; Zusatzstoffe sind laut Hersteller nicht enthalten."),
      c("High Quality Protein", "ZULAESSIG", "VO (EG) 767/2009 Art. 11", "75 % Hähnchenbrust als Proteinquelle ist durch die Deklaration gedeckt; „high quality“ bleibt werblich, aber an die Zutat gebunden."),
      c("Ideal zur Ergänzung zum täglichen Trockenfutter", "ZULAESSIG", "VO (EG) 767/2009 Art. 11, Art. 17", "Als Ergänzungsfuttermittel deklariert; die Aussage entspricht dem Produkttyp (Händlertext zooplus, Stand 16.10.2026)."),
    ],
    metaTitle: "Applaws Hähnchenbrust in Brühe 156 g im Test: 73/100 Punkte",
    metaDescription: "Applaws Hähnchenbrust in Brühe im Test: 75 % Brust, Ergänzungsfutter, Analyse DE vs. UK, Preis. 73 von 100 Punkten nach unserem Schema.",
    keywords: ["Applaws Test", "Applaws Hähnchenbrust Brühe", "Katzennassfutter Ergänzung", "Applaws 156g", "Applaws Erfahrungen"],
    bodyHtml: `<p>„100 % natural“ und „nothing more than the ingredients listed“: Applaws wirbt für die Dose <strong>Chicken Breast in Broth</strong> mit einer Zutatenliste, die auf eine Handbreit Text passt (${a(AP, "applaws.com")}, abgerufen am ${D}). Drei Zutaten. Kein Alleinfutter. Das ist die kurze Version.</p>
${METHODE(`${a(AP, "applaws.com")} und ${a(AP_Z, "zooplus.de")}`)}
<h2>Fünfundsiebzig Prozent Brust, Punkt</h2>
<p>Die DE-Händlerangabe lautet: Hühnchenbrust 75 %, Hühnerbrühe, Reis. Die UK-Herstellerseite beziffert Brühe mit 24 % und Reis mit 1 %. Beides zusammen erklärt die Dose. Ohne Farbstoffe, ohne Vitaminpaket, ohne Sammelbegriff „tierische Nebenerzeugnisse“. Nach unserem rezepturbasierten Bewertungsschema: 26 von 30 Punkten bei den Rohstoffen – für ein Ergänzungsfutter stark.</p>
<h2>Ergänzung heißt: allein reicht es nicht</h2>
<p>Auf zooplus.de stehen Protein 14 %, Fett 1 %, Rohfaser 1 %, Rohasche 2 %, Feuchte 82 % (Händlerangabe, Stand ${D}). Die UK-Seite nennt Protein 16 %, Feuchte 80 % und 129,2 kcal je Dose. Die Abweichung markieren wir; wir werten nach der DE-Händleranalyse und weisen auf die UK-Zahlen hin. Vitamine und Spurenelemente fehlen – bei einem Ergänzungsfuttermittel zulässig, für die alleinige Fütterung ungeeignet.</p>
<h2>„Natural“ in der Konserve</h2>
<p>„Contains no additives“ und „nothing more than the ingredients listed“ sind durch die Liste gedeckt. „100 % natural“ in einer sterilisierten Dose bleibt erklärungsbedürftig. Wir stufen nur diese Absolute als fragwürdig ein.</p>
<h2>Preis: Premium für die Zwischenmahlzeit</h2>
<p>Bei zooplus kostet das 6×156-g-Pack 12,99 €, also 13,88 €/kg (${a(AP_Z, "zooplus.de")}, Stand ${D}; Händlerangabe). Empfohlen wird bis zu einer Dose täglich je nach Größe. Das sind bis rund 2,17 € pro Tag (eigene Berechnung, 1 Dose). Als tägliche Hauptmahlzeit zu teuer und unvollständig; als Ergänzung nachvollziehbar teuer.</p>
<p><strong>Unser Gesamtergebnis: 73 von 100 Punkten</strong>, Ampel Gelb nach unserem rezepturbasierten Bewertungsschema. ${STRENG(1, 0)} Die Zutatenliste ist vorbildlich kurz. Der Produkttyp ist Ergänzung – und das muss auf dem Napfplan stehen.</p>
${FOOT}`,
    conclusionHtml: `<p>Applaws Hähnchenbrust in Brühe ist nach unserer Einschätzung ein transparent deklariertes Ergänzungsfutter mit hohem, benanntem Brustanteil und ohne Zusatzstoffe. Es ersetzt kein Alleinfutter. Abzüge gibt es für den Ergänzungs-Status, die abweichenden DE-/UK-Analysen und das Wort „natural“. Gelb nach unserem Schema.</p>`,
  },

  // 4) Rinti Kennerfleisch Rind 400g
  {
    ...BASE_H,
    brand: "Rinti",
    slug: "rinti-kennerfleisch-rind-400g-test",
    title: "Rinti Kennerfleisch Rind 400 g im Test: 75/100 Punkte",
    productName: "Kennerfleisch Rind, Nassfutter für Hunde, 400 g Dose",
    keyword: "Rinti Kennerfleisch Rind",
    priceClass: "GUENSTIG" as const,
    pricePerKg: 4.23,
    packageSize: "400 g (Dose), auch Multipacks",
    price: 1.69,
    pricePerDay: 3.38 as number | null,
    image: "rinti-kennerfleisch-rind-400g-packshot-hersteller.webp",
    imageAlt: "Dose Rinti Kennerfleisch mit Rind, 400 g (Bild: Hersteller)",
    contentImage: "rinti-kennerfleisch-rind-400g-seite-hersteller.webp",
    contentImageAlt: "Rinti Kennerfleisch Rind Dose, Seitenansicht (Bild: Hersteller)",
    composition:
      "70 % Fleisch und tierische Nebenerzeugnisse (u. a. 35 % Rind), Mineralstoffe, Flachsöl (0,2 %), Rübenfaser (0,2 %), Rote Bete (getrocknet). Laut Hersteller: Innereien wie Leber, Lunge, Herz, Euter, Nieren, Pansen, Magen u. a. Ernährungsphysiologische Zusatzstoffe je kg: Vitamin D3 300 IE, Vitamin E 40 mg, Zink 30 mg, Mangan 2 mg, Kupfer 3 mg.",
    analysis: [
      { name: "Rohprotein", value: 11 },
      { name: "Fettgehalt", value: 8 },
      { name: "Rohfaser", value: 0.6 },
      { name: "Rohasche", value: 2.5 },
      { name: "Feuchtegehalt", value: 77 },
      { name: "Calcium", value: 0.3 },
      { name: "Phosphor", value: 0.25 },
    ],
    scores: { scoreRaw: 20, scoreHarmful: 17, scoreNutrients: 14, scoreDeclaration: 12, scoreNeeds: 8, scoreValue: 4 },
    verdict:
      "Fleischbetontes Alleinfutter mit 70 % Fleisch/Nebenerzeugnissen und 35 % benanntem Rind, getreidefrei, mit Ca/P und Energieangabe. Abzüge: Sammelbegriff Nebenerzeugnisse, knappe Zusatzstoffliste, fragwürdige Aussagen zu Omega-3/Abwehr und „ohne Kohlenhydrate“.",
    teaser: "Siebzig Prozent Fleischbegriff, fünfunddreißig Prozent Rind. 75 Punkte.",
    pros: [
      "70 % Fleisch und tierische Nebenerzeugnisse, davon 35 % Rind benannt; Flachsöl und Rübenfaser beziffert",
      "Ohne Getreide; Calcium 0,3 %, Phosphor 0,25 %, Energie 115 kcal/100 g angegeben",
      "Günstig: 1,69 € je 400-g-Dose (4,23 €/kg) bei zooplus, Stand 16.10.2026",
    ],
    cons: [
      "„Tierische Nebenerzeugnisse“ als Sammelbegriff; einzelne Innereien nicht mengenmäßig aufgeschlüsselt",
      "Nur Vitamin D3, E, Zink, Mangan und Kupfer als Zusatzstoffe auf der Herstellerseite; Vitamin A und Jod dort nicht deklariert",
      "Drei fragwürdige Werbeaussagen (Omega-3 für Abwehr/Zellschutz, Rübenfasern „regulieren“, „ohne Kohlenhydrate“)",
    ],
    claims: [
      c("Getreidefrei", "ZULAESSIG", "VO (EG) 767/2009 Art. 11", "In der Zusammensetzung ist kein Getreide genannt."),
      c("Hoher Fleischanteil: mit 70% Fleisch und Innereien", "ZULAESSIG", "VO (EG) 767/2009 Art. 11", "Durch die Deklaration gedeckt: 70 % Fleisch und tierische Nebenerzeugnisse."),
      c("ohne Kohlenhydrate", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Rübenfaser und getrocknete Rote Bete sind pflanzliche Kohlenhydratquellen. „Ohne Kohlenhydrate“ ist daher missverständlich."),
      c("Mit Omega 3 Fettsäuren: … zur Unterstützung der Abwehrkräfte und des Zellschutzes", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1", "Flachsöl (0,2 %) ist deklariert. Aussagen zu Abwehrkräften und Zellschutz sind auf der Seite nicht nachprüfbar belegt."),
      c("Mit Rübenfasern: … die sich regulierend auf die Verdauung auswirken", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1", "Rübenfaser (0,2 %) ist genannt. „Regulierend auf die Verdauung“ ist eine Wirkaussage ohne Beleg auf der Produktseite."),
      c("ohne Soja, ohne Farb- und Konservierungsstoffe", "ZULAESSIG", "VO (EG) 767/2009 Art. 11", "In Zusammensetzung und Zusatzstoffliste sind weder Soja noch Farb- oder Konservierungsstoffe genannt."),
    ],
    metaTitle: "Rinti Kennerfleisch Rind 400 g im Test: 75/100 Punkte",
    metaDescription: "Rinti Kennerfleisch Rind im Test: 70 % Fleischanteil, Getreidefreiheit, Omega-3-Werbeaussagen und Preis. 75 von 100 Punkten nach unserem Schema.",
    keywords: ["Rinti Kennerfleisch Test", "Rinti Rind Dose", "Hundenassfutter Test", "Rinti getreidefrei", "Kennerfleisch Erfahrungen"],
    bodyHtml: `<p>„Hoher Fleischanteil“ und „ohne Kohlenhydrate“: Rinti wirbt für <strong>Kennerfleisch Rind</strong> mit 70 % Fleisch und Innereien (${a(RI, "rinti.de")}, abgerufen am ${D}). Getreidefrei steht auf der Dose. Ob „ohne Kohlenhydrate“ zur Rübenfaser passt, ist die spannendere Frage.</p>
${METHODE(a(RI, "rinti.de"))}
<h2>Siebzig Prozent mit Sammelbegriff</h2>
<p>Die Zusammensetzung nennt „70 % Fleisch und tierische Nebenerzeugnisse (u. a. 35 % Rind)“, dazu Mineralstoffe, 0,2 % Flachsöl, 0,2 % Rübenfaser und getrocknete Rote Bete. Der Hersteller erklärt, welche Innereien gemeint sein können. Mengen je Innerei fehlen. Nach unserem rezepturbasierten Bewertungsschema: 20 von 30 Punkten – ehrlich benanntes Rind, aber Sammelbegriff.</p>
<h2>Calcium steht, viele Vitamine nicht</h2>
<p>Protein 11 %, Fett 8 %, Feuchte 77 %, Calcium 0,3 %, Phosphor 0,25 %, 115 kcal/100 g. Zusatzstoffe auf der Herstellerseite: Vitamin D3, Vitamin E, Zink, Mangan, Kupfer. Vitamin A und Jod fehlen dort. Leber kann Vitamin A liefern – beziffert ist es nicht.</p>
<h2>Omega-3 für die Abwehr? 0,2 Prozent Flachsöl</h2>
<p>Getreidefreiheit und „ohne Soja, ohne Farb- und Konservierungsstoffe“ sind durch die Liste gedeckt. „Ohne Kohlenhydrate“ stolpert über Rübenfaser und Rote Bete. Omega-3 für Abwehrkräfte und Zellschutz sowie die „regulierende“ Verdauung durch Rübenfasern stufen wir als fragwürdig ein.</p>
<h2>Preis: viel Dose, wenig Euro</h2>
<p>Bei zooplus kostet die 400-g-Dose 1,69 €, also 4,23 €/kg (${a(RI_Z, "zooplus.de")}, Stand ${D}; Händlerangabe). Rinti empfiehlt für 20 kg etwa 800 g am Tag. Das sind rund 3,38 € pro Tag (eigene Berechnung). Pro Kilo günstig, als reine Nassfütterung spürbar im Monat.</p>
<p><strong>Unser Gesamtergebnis: 75 von 100 Punkten</strong>, Ampel Gelb nach unserem rezepturbasierten Bewertungsschema. ${STRENG(3, 0)} Fleischanteil und Preis überzeugen, die Absolute „ohne Kohlenhydrate“ und die Abwehr-Rhetorik weniger.</p>
${FOOT}`,
    conclusionHtml: `<p>Rinti Kennerfleisch Rind ist nach unserer Einschätzung ein günstiges, getreidefreies Alleinfutter mit hohem Fleisch-/Innerei-Anteil und benanntem Rind. Abzüge gibt es für den Sammelbegriff, die knappe Vitaminliste und drei fragwürdige Werbeaussagen. Gelb nach unserem Schema – solide Basis, keine Glanzformel.</p>`,
  },

  // 5) Purina PRO PLAN Medium Adult Everyday Nutrition Huhn
  {
    ...BASE_H,
    brand: "Purina PRO PLAN",
    slug: "purina-pro-plan-medium-adult-everyday-nutrition-huhn-test",
    title: "Purina PRO PLAN Medium Adult Everyday Nutrition Huhn im Test: 69/100 Punkte",
    productName: "PRO PLAN Medium Adult Everyday Nutrition reich an Huhn, Trockenfutter, 14 kg",
    keyword: "PRO PLAN Medium Adult Huhn",
    priceClass: "GUENSTIG" as const,
    pricePerKg: 3.57,
    packageSize: "14 kg (auch 3 kg)",
    price: 49.99,
    pricePerDay: 0.95 as number | null,
    image: "purina-pro-plan-medium-adult-huhn-packshot-hersteller.webp",
    imageAlt: "Sack Purina PRO PLAN Medium Adult Everyday Nutrition Huhn, 14 kg (Bild: Hersteller)",
    contentImage: "purina-pro-plan-medium-adult-huhn-huhn-nr1-hersteller.webp",
    contentImageAlt: "Purina PRO PLAN Hinweis Huhn als Zutat Nr. 1 (Bild: Hersteller)",
    composition:
      "Hochwertiges Huhn (20 %) (einschl. Rücken und Brust), Weizen, getrocknetes Geflügelprotein, Mais, Reis (9 %), tierische Fette, getrocknete Rübenschnitzel, Autolysat, Sojamehl, Maisproteinmehl, Weizengluten, Mineralstoffe, Trockenei, Fischöl. Ernährungsphysiologische Zusatzstoffe: Vit A 28.000 IE/kg, Vit D3 910 IE/kg, Vit E 550 IE/kg, Vit C 140 mg/kg; Fe 150, I 2,3, Cu 16, Mn 56, Zn 140, Se 0,16 mg/kg. Technologisch: Tocopherol-Extrakte 38 mg/kg.",
    analysis: [
      { name: "Protein", value: 26.0 },
      { name: "Fettgehalt", value: 16.0 },
      { name: "Rohasche", value: 7.5 },
      { name: "Rohfaser", value: 2.0 },
    ],
    scores: { scoreRaw: 16, scoreHarmful: 16, scoreNutrients: 13, scoreDeclaration: 12, scoreNeeds: 8, scoreValue: 4 },
    verdict:
      "Alleinfutter mit Huhn als Zutat Nr. 1 (20 %, Rücken und Brust), vollständiger Vitamin- und Spurenelementliste und günstigem Kilopreis. Abzüge: viel Getreide und Soja, keine Ca/P-Angabe in der Analytik, fragwürdige Aussagen zu Gelenken, Zahnpflege und Nährstoffaufnahme.",
    teaser: "Huhn vorn, Getreide dicht dahinter. 69 Punkte.",
    pros: [
      "Huhn mit 20 % als erste Zutat benannt (Rücken und Brust); Reis mit 9 % beziffert",
      "Vitamine A, D3, E, C und Spurenelemente Eisen bis Selen vollständig deklariert; ohne Zusatz von Farbstoffen",
      "Günstig: 49,99 € / 14 kg (3,57 €/kg) bei Fressnapf, Stand 16.10.2026",
    ],
    cons: [
      "Weizen, Mais, Sojamehl und Weizengluten in der Rezeptur; getrocknetes Geflügelprotein ohne Mengenangabe",
      "Calcium und Phosphor in der analytischen Deklaration nicht angegeben",
      "Drei fragwürdige Werbeaussagen (Gelenke, Zahnpflege, ausgezeichnete Nährstoffaufnahme)",
    ],
    claims: [
      c("Huhn als Zutat Nr. 1", "ZULAESSIG", "VO (EG) 767/2009 Art. 11", "Durch die Zusammensetzung gedeckt: hochwertiges Huhn (20 %) steht an erster Stelle."),
      c("Hilft, das Fell … wunderschön glänzend zu halten", "ZULAESSIG", "VO (EG) 767/2009 Art. 13", "Fischöl und Vitamin E sind deklariert; die Fell-Aussage bleibt im üblichen Werberahmen ohne Krankheitsbezug."),
      c("Eine Kombination aus entscheidenden Nährstoffen hilft, die Gesundheit der Gelenke … zu unterstützen", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1", "Welche Nährstoffe die Gelenkaussage tragen sollen, ist auf der Seite nicht spezifiziert und nicht belegt."),
      c("speziell als Zahnpflege für Hunde konzipiert", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1; UWG § 5", "Eine zahnmedizinische Wirkung ist auf der Produktseite nicht nachprüfbar belegt."),
      c("Ausgezeichnete Nährstoffaufnahme zur Deckung des Bedarfs", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1", "„Ausgezeichnete Nährstoffaufnahme“ ist eine Wertung ohne Messwerte auf der Seite; die Bedarfsdeckung entspricht dem Alleinfutter-Anspruch, die Absolute nicht."),
      c("Ohne Zusatz von Farbstoffen", "ZULAESSIG", "VO (EG) 767/2009 Art. 11", "In der Zusatzstoffliste sind keine Farbstoffe genannt."),
    ],
    metaTitle: "Purina PRO PLAN Medium Adult Everyday Nutrition Huhn im Test: 69/100 Punkte",
    metaDescription: "PRO PLAN Medium Adult Huhn im Test: 20 % Huhn, Getreideanteil, Gelenk-/Zahn-Werbeaussagen und Preis. 69 von 100 Punkten nach unserem Schema.",
    keywords: ["PRO PLAN Medium Adult Test", "Purina Pro Plan Huhn", "Hundetrockenfutter Test", "Everyday Nutrition", "PRO PLAN Erfahrungen"],
    bodyHtml: `<p>„Huhn als Zutat Nr. 1“ und dazu Unterstützung für Fell, Gelenke und Zähne: Purina stellt <strong>PRO PLAN Medium Adult Everyday Nutrition reich an Huhn</strong> als Alltagsration für mittelgroße Hunde vor (${a(PU, "purina.de")}, abgerufen am ${D}). Nummer eins ist Huhn. Nummer zwei ist Weizen.</p>
${METHODE(a(PU, "purina.de"))}
<h2>Zwanzig Prozent Huhn, dann das Getreidefeld</h2>
<p>„Hochwertiges Huhn (20 %) (einschl. Rücken und Brust)“ steht vorn – das ist klarer als manches „mit Huhn“-Etikett. Danach folgen Weizen, getrocknetes Geflügelprotein, Mais, Reis (9 %), Fette, Rübenschnitzel, Autolysat, Sojamehl, Maisproteinmehl und Weizengluten. Nach unserem rezepturbasierten Bewertungsschema: 16 von 30 Punkten. Besser als viele Mehlmischungen, aber kein Frischfleisch-Fest.</p>
<h2>Vitamine ja, Calcium-Zahlen nein</h2>
<p>Protein 26 %, Fett 16 %, Rohasche 7,5 %, Rohfaser 2,0 %. Die Vitamin- und Spurenelementliste ist lang und beziffert. Calcium und Phosphor fehlen in der analytischen Deklaration auf der Herstellerseite. Für ein Adult-Alleinfutter ist das nach unserer Einschätzung eine Lücke.</p>
<h2>Zähne und Gelenke ohne Belegfußnote</h2>
<p>„Huhn Nr. 1“, Fellglanz und „ohne Farbstoffe“ sind durch Zutaten bzw. Zusatzstoffliste gedeckt oder im üblichen Werberahmen. Gelenkgesundheit, Zahnpflege und „ausgezeichnete Nährstoffaufnahme“ stufen wir als fragwürdig ein: große Worte, kleine Fußnoten.</p>
<h2>Preis: Alltagsration mit kleinem Ticket</h2>
<p>Bei Fressnapf kostet der 14-kg-Sack 49,99 €, also 3,57 €/kg (${a(PU_FN, "fressnapf.de")}, Stand ${D}; Händlerangabe). Purina empfiehlt für 20 kg und bis zu einer Stunde Aktivität 265 g am Tag. Das sind rund 0,95 € pro Tag (eigene Berechnung). Nach unserer Einschätzung günstig für ein Marken-Alleinfutter.</p>
<p><strong>Unser Gesamtergebnis: 69 von 100 Punkten</strong>, Ampel Gelb nach unserem rezepturbasierten Bewertungsschema. ${STRENG(3, 0)} Huhn vorn ist ein Plus. Getreide, fehlende Ca/P-Werte und die Zahn-/Gelenk-Rhetorik halten die Ampel auf Gelb.</p>
${FOOT}`,
    conclusionHtml: `<p>Purina PRO PLAN Medium Adult Everyday Nutrition Huhn ist nach unserer Einschätzung ein preislich attraktives Alleinfutter mit benanntem Huhn als erster Zutat und vollständiger Vitaminliste. Für Grün fehlen Calcium-/Phosphorangaben und eine zurückhaltendere Werbung zu Gelenken und Zähnen. Gelb nach unserem Schema.</p>`,
  },
];
