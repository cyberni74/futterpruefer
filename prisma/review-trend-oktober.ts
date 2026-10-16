/** Fünf Tests von Futtermitteln, die im Oktober 2026 in Deutschland besonders gefragt sind (Amazon.de-Bestsellerlisten, Bestseller-Auswertung September 2026). Der Seed legt sie nur an, wenn der Slug fehlt; Änderungen im Admin bleiben erhalten. Bewertung ausschließlich anhand veröffentlichter Herstellerangaben, abgerufen am 16.10.2026. Bilder: Hersteller (Produktseiten bzw. Hersteller-Shop). */
const D = "16.10.2026";
const a = (u: string, l: string) => `<a href="${u}">${l}</a>`;
type Claim = { claim: string; rating: "ZULAESSIG" | "FRAGWUERDIG" | "UNZULAESSIG"; legal: string; reason: string; imageUrl: string };
const c = (claim: string, rating: Claim["rating"], legal: string, reason: string): Claim => ({ claim, rating, legal, reason, imageUrl: "" });
const METHODE = (quelle: string) => `<h2>Wie wir getestet haben</h2>
<p>Wir haben das Futter weder im Labor analysiert noch an Tieren erprobt. Grundlage sind die Angaben auf ${quelle} (abgerufen am ${D}), ergänzt durch Händlerangaben, die wir ausdrücklich als solche kennzeichnen. Bewertet wird nach unserem 100-Punkte-Schema und nach den Regeln der Futtermittelkennzeichnung (VO (EG) 767/2009) und des Wettbewerbsrechts (UWG). Die Einstufung der Werbeaussagen ist unsere begründete Einschätzung, keine rechtsverbindliche Feststellung. Bild: Hersteller.</p>`;
const TREND = `<p>Warum gerade dieses Produkt? Es gehört im Oktober 2026 zu den meistverkauften Tierfuttern auf Amazon.de und steht damit bei vielen Haltern im Napf. Wir haben nachgesehen, ob die Beliebtheit auch in der Deklaration steht.</p>`;
const FOOT = `<p><em>Hinweis:</em> Alle Zitate stammen von den genannten Seiten (Stand ${D}). Preise und Texte können sich ändern. Hersteller können uns Belege zukommen lassen.</p>`;
const STRENG = (f: number, u: number) => `<strong>Strenge Wertung:</strong> Jede fragwürdige Werbeaussage kostet einen Punkt bei der Deklaration, jede unzulässige drei; hier sind es ${f} fragwürdige und ${u} unzulässige Aussagen.`;
const BASE_K = { categorySlug: "alleinfuttermittel-katze", gallery: [] as string[], publishedDaysAgo: 0, imageMarker: "Bild: Hersteller", priceDate: "2026-10-16T10:00:00Z", testedAt: "2026-10-16T08:00:00Z" };
const BASE_H = { ...BASE_K, categorySlug: "alleinfuttermittel-hund" };
const BASE_EK = { ...BASE_K, categorySlug: "ergaenzungsfuttermittel-katze" };

const MJ = "https://www.mjamjam-petfood.de/Saftiges-Huhn-an-leckeren-Moehrchen-400g/11041";
const MJ_6 = "https://www.mjamjam-petfood.de/Saftiges-Huhn-an-leckeren-Moehrchen-6-x-400g/110416";
const GC = "https://animonda.de/product/grancarno-adult-rind-entenherzen/82747-0";
const SH = "https://www.sheba.de/nassfutter-katzen/katzenfutter-in-sosse/filets/sheba-filets-thunfisch-msc-huhn-60g";
const SH_MU = "https://www.mueller.de/p/sheba-schale-filets-huhn-mit-thunfisch-msc-2798862/";
const SH_FN = "https://www.fressnapf.de/p/sheba-filets-nassfutter-katze-thunfisch-und-huhn-16x60-g-1407303/";
const WH = "https://www.whiskas.de/katzenfutter/nassfutter/classic/whiskas-1-geflugel-auswahl-4-varietaten-gelee-12-40-80-x-85g";
const WH_FN = "https://www.fressnapf.de/p/whiskas-mega-pack-1-gefluegel-auswahl-in-gelee-40-x-85g-1417306/";
const GO = "https://www.purina.de/katze/katzenfutter/produkt-gourmet-gold-feine-komposition-rind-huhn";
const GO_FN = "https://www.fressnapf.de/p/gourmet-gold-feine-komposition-rind-und-huhn-12x85-g-1101317/";

export const TREND_OKT_TESTS = [
  // 1) MjAMjAM Saftiges Huhn an leckeren Möhrchen
  {
    ...BASE_K,
    brand: "MjAMjAM",
    slug: "mjamjam-saftiges-huhn-an-leckeren-moehrchen-test",
    title: "MjAMjAM Saftiges Huhn an leckeren Möhrchen im Test: 87/100 Punkte",
    productName: "Saftiges Huhn an leckeren Möhrchen, Nassfutter für Katzen, 400 g",
    keyword: "MjAMjAM Huhn Möhrchen",
    priceClass: "MITTEL" as const,
    pricePerKg: 7.23,
    packageSize: "400 g (Dose), auch 6 × 400 g",
    price: 2.89,
    pricePerDay: 2.17 as number | null,
    image: "mjamjam-saftiges-huhn-moehrchen-packshot-hersteller.webp",
    imageAlt: "Dose MjAMjAM Saftiges Huhn an leckeren Möhrchen, 400 g (Bild: Hersteller)",
    contentImage: "mjamjam-saftiges-huhn-moehrchen-katze-hersteller.webp",
    contentImageAlt: "Katze liegt neben einer Dose MjAMjAM Huhn an Möhrchen (Bild: Hersteller)",
    composition:
      "Hühnerfleisch, -leber, -herzen 72,5 %, Fleischbrühe 22,4 %, Möhrchen 4 %, Mineralstoffe 1 %, Katzenminze 0,1 %. Ernährungsphysiologische Zusatzstoffe je kg: Vitamin D3 200 IE, Vitamin E 50 mg, Taurin 1.500 mg, Jod (Calciumjodat, wasserfrei) 0,2 mg, Mangan (Mangan(II)-sulfat, Monohydrat) 2 mg, Zink (Zinksulfat, Monohydrat) 20 mg.",
    analysis: [
      { name: "Rohprotein", value: 12.0 },
      { name: "Fettgehalt", value: 6.0 },
      { name: "Rohasche", value: 1.8 },
      { name: "Rohfaser", value: 0.4 },
      { name: "Feuchtigkeit", value: 78.0 },
      { name: "Calcium", value: 0.3 },
      { name: "Phosphor", value: 0.25 },
    ],
    scores: { scoreRaw: 25, scoreHarmful: 19, scoreNutrients: 18, scoreDeclaration: 13, scoreNeeds: 9, scoreValue: 3 },
    verdict:
      "Offen deklariertes Nassfutter mit 72,5 % benannten Hühnerteilen, ohne Getreide und Zucker, mit vollständigen Mineralstoffangaben. Kleine Abzüge: Vitamin A nicht als Zusatzstoff deklariert, „naturbelassen“ ist bei einem erhitzten und vitaminierten Futter erklärungsbedürftig, Preis pro Tag im oberen Mittelfeld.",
    teaser: "Huhn, Brühe, Möhrchen, offen beziffert. 87 Punkte.",
    pros: [
      "Offene Deklaration: 72,5 % Hühnerfleisch, -leber und -herzen, Brühe, Möhrchen und Katzenminze jeweils mit Prozentangabe",
      "Ohne Getreide und ohne Zucker; Calcium, Phosphor, Kalium, Natrium und Energie (99 kcal/100 g) angegeben",
      "Taurin (1.500 mg/kg), Vitamin D3, Vitamin E, Jod, Mangan und Zink deklariert",
    ],
    cons: [
      "Vitamin A nicht als Zusatzstoff deklariert; die Versorgung hängt an der Leber im Rezept",
      "„Naturbelassen“ ist für ein erhitztes, mit Zusatzstoffen ergänztes Dosenfutter erklärungsbedürftig",
      "Rund 2,17 € pro Tag für eine 4-kg-Katze (eigene Berechnung, 300 g/Tag)",
    ],
    claims: [
      c("Hoher Fleischanteil", "ZULAESSIG", "VO (EG) 767/2009 Art. 11", "Durch die Deklaration gedeckt: 72,5 % Hühnerfleisch, -leber und -herzen."),
      c("Ohne Getreide und Gluten", "ZULAESSIG", "VO (EG) 767/2009 Art. 11", "In der Zusammensetzung ist kein Getreide genannt."),
      c("Naturbelassen", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Das Futter wird in der Dose erhitzt und mit Vitaminen, Taurin und Spurenelementen ergänzt. Was „naturbelassen“ hier genau heißen soll, erklärt die Seite nicht."),
      c("… ergibt eine vollwertige und genussvolle Mahlzeit, die ihn zugleich mit allen wichtigen Vitaminen und Mineralien versorgt.", "ZULAESSIG", "VO (EG) 767/2009 Art. 11, Art. 17", "Als Alleinfuttermittel deklariert; die Aussage entspricht dem Anspruch eines Alleinfutters."),
    ],
    metaTitle: "MjAMjAM Saftiges Huhn an leckeren Möhrchen im Test: 87/100 Punkte",
    metaDescription: "MjAMjAM Huhn an Möhrchen im Test: Zusammensetzung, Nährstoffe, Werbeaussagen und Preis pro Tag. 87 von 100 Punkten nach unserem Schema.",
    keywords: ["MjAMjAM Test", "MjAMjAM Huhn Möhrchen", "Katzennassfutter Test", "Katzenfutter ohne Getreide", "MjAMjAM Erfahrungen"],
    bodyHtml: `<p>„Hoher Fleischanteil, naturbelassen, ohne Getreide und Gluten“: So stellt MjAMjAM die Dose <strong>Saftiges Huhn an leckeren Möhrchen</strong> vor (${a(MJ, "mjamjam-petfood.de")}, abgerufen am ${D}). Das Produkt führt im Oktober 2026 die Amazon.de-Bestsellerliste für Heimtierbedarf an. Eine Dose, die so viele kaufen, verdient einen Blick aufs Etikett.</p>
${TREND}
${METHODE(a(MJ, "mjamjam-petfood.de"))}
<h2>Hier steht drauf, was drin ist</h2>
<p>Die Zusammensetzung nennt „Hühnerfleisch, -leber, -herzen 72,5 %“, dazu 22,4 % Fleischbrühe, 4 % Möhrchen, 1 % Mineralstoffe und 0,1 % Katzenminze. Das ergibt 100 Prozent. Kein Sammelbegriff, kein Rätselraten. So sieht eine offene Deklaration aus, und das verdient Lob. Nach unserem rezepturbasierten Bewertungsschema gibt es dafür 25 von 30 Punkten; Abzüge gibt es nur, weil Muskelfleisch und Innereien nicht einzeln beziffert sind.</p>
<h2>Die Katzenminze ist Gewürz, nicht Programm</h2>
<p>0,1 % Katzenminze sind ein Hauch, auf 400 g knapp ein halbes Gramm (eigene Berechnung). Die Möhrchen liefern etwas Faser und Farbe. Die eigentliche Arbeit macht das Huhn. Bei 78 % Feuchtigkeit entsprechen 12 % Protein und 6 % Fett rund 55 % Protein und 27 % Fett in der Trockensubstanz (eigene Berechnung). Für einen Fleischfresser ist das ein stimmiges Profil.</p>
<h2>Die Zusatzstoffe: fast komplett</h2>
<p>Taurin ist mit 1.500 mg/kg deklariert, dazu Vitamin D3, Vitamin E, Jod, Mangan und Zink. Calcium (0,30 %) und Phosphor (0,25 %) stehen ebenfalls auf der Seite, ein Verhältnis von 1,2 zu 1 (eigene Berechnung). Vitamin A fehlt als Zusatzstoff. Das kann aufgehen, denn Leber ist reich daran, nur beziffert ist der Gehalt nicht. Wer prüfen will, muss beim Hersteller fragen.</p>
<h2>„Naturbelassen“ in der Dose</h2>
<p>Ein Futter, das erhitzt, verschlossen und mit Vitaminen ergänzt wird, ist im Wortsinn nicht mehr ganz Natur. „Naturbelassen“ heißt hier wohl: ohne Getreide, Zucker und Geschmacksstoffe. Das sagt die Seite aber nicht. Wir stufen die Aussage als fragwürdig ein, die übrigen als zulässig.</p>
<h2>Preis: gute Zutaten haben ihren Preis</h2>
<p>Im Hersteller-Shop kostet die 400-g-Dose 2,89 €, das sind 7,23 €/kg (${a(MJ_6, "mjamjam-petfood.de")}, Stand ${D}). MjAMjAM empfiehlt 200 bis 400 g täglich für eine Katze mit 3 bis 5 kg. Bei 300 g sind das rund 2,17 € pro Tag (eigene Berechnung). Nicht billig, aber für diese Deklaration nach unserer Einschätzung angemessen.</p>
<p><strong>Unser Gesamtergebnis: 87 von 100 Punkten</strong>, Ampel Grün nach unserem rezepturbasierten Bewertungsschema. ${STRENG(1, 0)} Selten ist ein Bestseller so auskunftsfreudig. Hier stimmt das Etikett mit der Werbung weitgehend überein.</p>
${FOOT}`,
    conclusionHtml: `<p>MjAMjAM Huhn an Möhrchen ist nach unserer Einschätzung ein gut deklariertes Katzennassfutter mit hohem, benanntem Fleischanteil und ohne Getreide oder Zucker. Abzüge gibt es für das fehlende Vitamin A in der Zusatzstoffliste und das Wort „naturbelassen“. Die Beliebtheit hat hier einen nachlesbaren Grund.</p>`,
  },
  // 2) animonda GranCarno Adult Rind + Entenherzen
  {
    ...BASE_H,
    brand: "animonda",
    slug: "animonda-grancarno-adult-rind-entenherzen-test",
    title: "animonda GranCarno Adult Rind + Entenherzen im Test: 78/100 Punkte",
    productName: "GranCarno Adult Rind + Entenherzen, Nassfutter für Hunde, 800 g",
    keyword: "GranCarno Rind Entenherzen",
    priceClass: "GUENSTIG" as const,
    pricePerKg: 3.23,
    packageSize: "6 × 800 g (Dosen)",
    price: 15.49,
    pricePerDay: 2.5 as number | null,
    image: "animonda-grancarno-adult-rind-entenherzen-packshot-hersteller.webp",
    imageAlt: "Dose animonda GranCarno Adult Rind + Entenherzen, 800 g (Bild: Hersteller)",
    contentImage: "animonda-grancarno-adult-rind-entenherzen-etikett-hersteller.webp",
    contentImageAlt: "Ausschnitt des Etiketts von GranCarno Adult Rind + Entenherzen (Bild: Hersteller)",
    composition:
      "56 % Rind (Fleisch, Leber, Lunge, Herz, Niere, Euter), 12 % Ente (Herz, Magen, Hals), Mineralstoffe, Distelöl. Ernährungsphysiologische Zusatzstoffe je kg: Vitamin D3 200 IE, Mangansulfat-Monohydrat 1,4 mg, Zinksulfat-Monohydrat 25 mg.",
    analysis: [
      { name: "Protein", value: 10 },
      { name: "Fettgehalt", value: 9 },
      { name: "Rohasche", value: 2 },
      { name: "Rohfaser", value: 0.5 },
      { name: "Feuchtigkeit", value: 76 },
    ],
    scores: { scoreRaw: 24, scoreHarmful: 18, scoreNutrients: 14, scoreDeclaration: 10, scoreNeeds: 8, scoreValue: 4 },
    verdict:
      "Fleischreiches Hunde-Nassfutter mit 68 % benannten Rinder- und Entenanteilen, ohne Getreide und Zucker, zu einem günstigen Kilopreis. Abzüge: Calcium und Phosphor nicht angegeben, nur drei Zusatzstoffe deklariert (kein Jod, kein Vitamin A oder E), drei fragwürdige Werbeaussagen.",
    teaser: "Viel Rind, wenig Angaben zu Mineralstoffen. 78 Punkte.",
    pros: [
      "68 % benannte tierische Zutaten: 56 % Rind und 12 % Ente, jeweils mit den verwendeten Teilen",
      "Ohne Getreide und Zucker; kurze, verständliche Zutatenliste",
      "Günstig: 3,23 €/kg im Hersteller-Shop (6 × 800 g, Stand 16.10.2026)",
    ],
    cons: [
      "Calcium und Phosphor nicht angegeben, obwohl sie bei fleischreichem Futter entscheidend sind",
      "Nur Vitamin D3, Mangan und Zink als Zusatzstoffe deklariert; Jod, Vitamin A und E nicht deklariert",
      "Drei fragwürdige Werbeaussagen („100 % frische Zutaten“, „ausgewogene, gesunde Ernährung“, „artgerecht“)",
    ],
    claims: [
      c("100 % frische Zutaten", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Die Seite erklärt nicht, was „frisch“ bedeutet (gekühlt, nicht tiefgefroren, nicht getrocknet). Mineralstoffe und Öl sind keine frischen Zutaten im üblichen Sinn."),
      c("GranCarno Adult Rind + Entenherzen steht für ausgewogene, gesunde Ernährung für Hunde von 1-6 Jahren.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1", "„Ausgewogen“ lässt sich ohne Angaben zu Calcium, Phosphor und den meisten Vitaminen nicht nachprüfen."),
      c("Natürliche, artgerechte Ernährung für den Hund", "FRAGWUERDIG", "UWG § 5", "„Artgerecht“ ist nicht definiert und wird auf der Seite nicht belegt."),
      c("Ohne Zusatz von Getreide & Zucker", "ZULAESSIG", "VO (EG) 767/2009 Art. 11", "In der Zusammensetzung sind weder Getreide noch Zucker genannt."),
      c("… kommt ohne künstliche Farb- und Konservierungsstoffe aus.", "ZULAESSIG", "VO (EG) 767/2009 Art. 11", "In der Zusatzstoffliste sind keine Farb- oder Konservierungsstoffe genannt."),
    ],
    metaTitle: "animonda GranCarno Adult Rind + Entenherzen im Test: 78/100 Punkte",
    metaDescription: "GranCarno Rind + Entenherzen im Test: Zusammensetzung, Nährstoffe, Zusatzstoffe, Werbeaussagen und Preis pro Tag. 78 von 100 Punkten nach unserem Schema.",
    keywords: ["GranCarno Test", "animonda GranCarno Rind Entenherzen", "Hundenassfutter Test", "Nassfutter Hund ohne Getreide", "GranCarno Erfahrungen"],
    bodyHtml: `<p>„Fleischig-frisch, wie Hunde es wollen!“: Mit diesem Satz bewirbt animonda das Nassfutter <strong>GranCarno Adult Rind + Entenherzen</strong> (${a(GC, "animonda.de")}, abgerufen am ${D}). Die Dose steht im Oktober 2026 auf Platz eins der Amazon.de-Bestseller für Hundefutter. Was der Hund will, wissen wir nicht. Was auf dem Etikett steht, schon.</p>
${TREND}
${METHODE(a(GC, "animonda.de"))}
<h2>Rind und Ente mit Namen und Prozent</h2>
<p>Die Zusammensetzung beginnt mit „56 % Rind (Fleisch, Leber, Lunge, Herz, Niere, Euter)“, gefolgt von „12 % Ente (Herz, Magen, Hals)“, Mineralstoffen und Distelöl. Das ist offen und verständlich. Euter und Lunge klingen weniger appetitlich als „Filet“, sind aber ehrlich benannt. Der Rest bis 100 % ist laut Hersteller Trinkwasser, das nicht als Einzelfuttermittel deklariert werden darf. Nach unserem rezepturbasierten Bewertungsschema ergibt das 24 von 30 Punkten.</p>
<h2>Viel Fleisch, wenig Auskunft über Mineralstoffe</h2>
<p>Bei 76 % Feuchtigkeit entsprechen 10 % Protein und 9 % Fett rund 42 % Protein und 38 % Fett in der Trockensubstanz (eigene Berechnung). Ein energiereiches Futter. Calcium und Phosphor nennt die Seite nicht. Gerade bei einem Rezept aus Fleisch und Innereien ist das Verhältnis der beiden der wichtigste Wert. „Mineralstoffe“ steht in der Liste, welche und wie viel, bleibt offen.</p>
<h2>Drei Zusatzstoffe für ein Alleinfutter</h2>
<p>Deklariert sind Vitamin D3, Mangan und Zink. Jod, Vitamin A und Vitamin E sind nicht deklariert. Leber kann Vitamin A liefern, Distelöl etwas Vitamin E, beziffert ist beides nicht. Ein Mangel lässt sich daraus nicht ableiten, eine ausreichende Versorgung aber auch nicht nachprüfen. Für ein Alleinfuttermittel ist das nach unserer Einschätzung zu knapp.</p>
<h2>„Frisch“ ohne Fußnote</h2>
<p>„100 % frische Zutaten“, „ausgewogene, gesunde Ernährung“, „artgerecht“: Drei Aussagen, die gut klingen und auf der Seite nicht erklärt werden. Wir stufen sie als fragwürdig ein. „Ohne Zusatz von Getreide &amp; Zucker“ und „ohne künstliche Farb- und Konservierungsstoffe“ sind durch die Deklaration gedeckt.</p>
<h2>Preis: viel Dose für wenig Geld</h2>
<p>Im Hersteller-Shop kosten 6 × 800 g 15,49 €, das sind 3,23 €/kg (${a(GC, "animonda.de")}, Stand ${D}). animonda empfiehlt für einen 20-kg-Hund 720 bis 830 g am Tag. Bei 775 g sind das rund 2,50 € pro Tag (eigene Berechnung). Für diesen Fleischanteil ist das nach unserer Einschätzung günstig.</p>
<p><strong>Unser Gesamtergebnis: 78 von 100 Punkten</strong>, Ampel Gelb nach unserem rezepturbasierten Bewertungsschema. ${STRENG(3, 0)} Weitere Abzüge gibt es für fehlende Angaben zu Calcium, Phosphor und den meisten Vitaminen. Das Fleisch ist benannt, der Rest der Rechnung nicht.</p>
${FOOT}`,
    conclusionHtml: `<p>GranCarno Adult Rind + Entenherzen ist nach unserer Einschätzung ein fleischreiches, offen deklariertes und günstiges Hundenassfutter. Für Grün fehlen Angaben zu Calcium, Phosphor und mehreren Vitaminen, und drei Werbeaussagen bleiben unbelegt. Wer Grün möchte, fragt beim Hersteller nach den Mineralstoffwerten.</p>`,
  },
  // 3) Sheba Filets Thunfisch MSC & Huhn
  {
    ...BASE_EK,
    brand: "Sheba",
    slug: "sheba-filets-thunfisch-huhn-test",
    title: "Sheba Filets Thunfisch MSC & Huhn im Test: 64/100 Punkte",
    productName: "Filets Thunfisch MSC & Huhn in Sauce, Ergänzungsfutter für Katzen, 60 g Schale",
    keyword: "Sheba Filets",
    priceClass: "PREMIUM" as const,
    pricePerKg: 21.34,
    packageSize: "16 × 60 g (Schalen)",
    price: 20.49,
    pricePerDay: 1.28 as number | null,
    image: "sheba-filets-thunfisch-huhn-schale-hersteller.webp",
    imageAlt: "Schale Sheba Filets Thunfisch & Huhn, 60 g (Bild: Hersteller)",
    contentImage: "sheba-filets-thunfisch-huhn-deklaration-hersteller.webp",
    contentImageAlt: "Rückseite der Sheba-Filets-Schale mit Deklaration (Bild: Hersteller)",
    composition:
      "Hühnchenbrustfilet (35 %), Thunfischfilets (4 %), Tapiokastärke, Xylose, Maltodextrin. Ergänzungsfuttermittel für ausgewachsene Katzen.",
    analysis: [
      { name: "Protein", value: 11.5 },
      { name: "Fettgehalt", value: 0.6 },
      { name: "Rohasche", value: 0.55 },
      { name: "Rohfaser", value: 0.1 },
      { name: "Feuchtigkeit", value: 84.0 },
    ],
    scores: { scoreRaw: 20, scoreHarmful: 16, scoreNutrients: 10, scoreDeclaration: 10, scoreNeeds: 6, scoreValue: 2 },
    verdict:
      "Mageres Ergänzungsfutter aus benanntem Hühnchenbrustfilet (35 %) und MSC-Thunfisch (4 %), ohne Farb- und Konservierungsstoffe. Abzüge: Xylose und Maltodextrin, die Prozentangaben erklären nur 39 % der Schale, Händlerseiten zeigen eine abweichende Deklaration, hoher Kilopreis.",
    teaser: "Filet mit Namen, Sauce mit Zucker. 64 Punkte.",
    pros: [
      "Hühnchenbrustfilet (35 %) und Thunfischfilets (4 %) benannt und beziffert; Thunfisch MSC-zertifiziert",
      "Ohne Farb- und Konservierungsstoffe; sehr fettarm (0,6 %), Energie angegeben (39 kcal je Schale)",
      "Klare Fütterungsempfehlung: bis zu eine Schale täglich, Hauptmahlzeit anpassen",
    ],
    cons: [
      "Xylose (ein Zucker) und Maltodextrin in einem Snack für einen Fleischfresser",
      "Wofür die übrigen 61 % stehen (Wasser, Sauce), erklärt die Herstellerseite nicht",
      "Händler zeigen eine andere Deklaration mit Sammelbegriffen; teuer mit gut 21 €/kg",
    ],
    claims: [
      c("Schonend zubereitet mit erlesenen Zutaten", "FRAGWUERDIG", "UWG § 5", "Was „schonend“ und „erlesen“ bedeutet, sagt die Seite nicht. Zu den Zutaten gehören Tapiokastärke, Xylose und Maltodextrin."),
      c("Ohne künstliche Farb- oder Konservierungsstoffe", "ZULAESSIG", "VO (EG) 767/2009 Art. 11", "In der Zusammensetzung sind keine Farb- oder Konservierungsstoffe genannt."),
      c("Hergestellt mit 100% nachhaltig gefangenem Fisch", "ZULAESSIG", "UWG § 5", "Durch das MSC-Siegel auf der Packung gedeckt, soweit es den Thunfisch (4 %) betrifft."),
      c("… verlockenden, verlässlichen Ergänzungsfutter-Rezeptur …", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "„Verlässlich“ ist nicht erklärt. Händlerseiten zeigen für denselben Artikel eine andere Zusammensetzung (Sammelbegriffe, 15 % Huhn, 14 % Thunfisch); welche Rezeptur gilt, ist ohne Packung nicht klar."),
    ],
    metaTitle: "Sheba Filets Thunfisch MSC & Huhn im Test: 64/100 Punkte",
    metaDescription: "Sheba Filets Thunfisch & Huhn im Test: Zusammensetzung, Xylose, Nährstoffe, Werbeaussagen und Preis pro Schale. 64 von 100 Punkten nach unserem Schema.",
    keywords: ["Sheba Filets Test", "Sheba Filets Thunfisch Huhn", "Katzensnack Test", "Ergänzungsfutter Katze", "Sheba Erfahrungen"],
    bodyHtml: `<p>„Schonend zubereitet mit erlesenen Zutaten“: So beschreibt Mars die Schale <strong>Sheba Filets Thunfisch MSC &amp; Huhn</strong> (${a(SH, "sheba.de")}, abgerufen am ${D}). Sheba ist laut einer Auswertung der Amazon.de-Bestseller im September 2026 die Marke mit den meisten Produkten in der Liste, die Filets stehen im Oktober weit oben. Erlesen klingt gut. Wir haben die Zutaten gelesen.</p>
${TREND}
${METHODE(a(SH, "sheba.de"))}
<h2>Ein Filet mit Namen, eine Sauce ohne</h2>
<p>Die Zusammensetzung nennt „Hühnchenbrustfilet (35 %), Thunfischfilets (4 %), Tapiokastärke, Xylose, Maltodextrin“. Huhn und Fisch sind benannt und beziffert. Das ist mehr, als viele Katzensnacks verraten. Es fehlen aber 61 %. Vermutlich ist es Wasser oder Brühe für die Sauce, nur steht das nicht da. Nach unserem rezepturbasierten Bewertungsschema ergibt das 20 von 30 Punkten.</p>
<h2>Zucker für die Sauce</h2>
<p>Xylose ist ein Zucker, Maltodextrin ein Stärkeabbauprodukt. Beides dient in Saucen üblicherweise als Binde- und Bräunungshilfe. Katzen brauchen beides nicht. Die Mengen sind nicht angegeben, bei 0,1 % Rohfaser und 0,55 % Rohasche bleibt rechnerisch wenig Platz (eigene Berechnung). Ein Fleischsnack mit Süßungsbeigabe also. Klein, aber vermeidbar.</p>
<h2>Mager wie ein Hähnchenbrustfilet</h2>
<p>Bei 84 % Feuchtigkeit entsprechen 11,5 % Protein und 0,6 % Fett rund 72 % Protein und knapp 4 % Fett in der Trockensubstanz (eigene Berechnung). Das ist sehr eiweißreich und sehr fettarm. Eine Schale liefert 39 kcal. Vitamine und Spurenelemente sind nicht zugesetzt, was bei einem Ergänzungsfutter zulässig ist. Sheba empfiehlt höchstens eine Schale täglich und eine angepasste Hauptmahlzeit. Das ist ehrlich.</p>
<h2>Welche Rezeptur liegt im Regal?</h2>
<p>Wer Händlerseiten danebenlegt, findet eine andere Deklaration: „Fleisch und tierische Nebenerzeugnisse (u.a. Hühnchenbrustfilets 15 %), Fisch und Fischnebenerzeugnisse (MSC Thunfischfilet 14 %), pflanzliche Nebenerzeugnisse, pflanzliche Eiweissextrakte“ (${a(SH_MU, "mueller.de")}, Händlerangabe, abgerufen am ${D}). Das kann eine ältere oder andere Fassung sein. Welche gilt, verrät erst die Packung. Wir stufen zwei Aussagen als fragwürdig ein, zwei als zulässig.</p>
<h2>Preis: Filet hat seinen Preis</h2>
<p>Fressnapf verlangt 20,49 € für 16 Schalen, rund 1,28 € je Schale und 21,34 €/kg (${a(SH_FN, "fressnapf.de")}, Stand ${D}). Für einen Snack, der eine Mahlzeit ergänzt und nicht ersetzt, ist das nach unserer Einschätzung teuer.</p>
<p><strong>Unser Gesamtergebnis: 64 von 100 Punkten</strong>, Ampel Gelb nach unserem rezepturbasierten Bewertungsschema. ${STRENG(2, 0)} Weitere Abzüge gibt es für Zucker und Maltodextrin, die unerklärten 61 % und die abweichende Händlerdeklaration. Erlesen ist das Filet, nicht unbedingt die Sauce.</p>
${FOOT}`,
    conclusionHtml: `<p>Sheba Filets Thunfisch &amp; Huhn ist nach unserer Einschätzung ein magerer Snack mit benanntem Huhn und MSC-Thunfisch. Xylose und Maltodextrin, die unklare Restmenge und widersprüchliche Händlerangaben kosten Punkte, der Preis ebenso. Als gelegentliche Ergänzung in Ordnung, als tägliche Gewohnheit teuer.</p>`,
  },
  // 4) Whiskas 1+ Geflügel Auswahl in Gelee
  {
    ...BASE_K,
    brand: "Whiskas",
    slug: "whiskas-1-gefluegel-auswahl-in-gelee-test",
    title: "Whiskas 1+ Geflügel Auswahl in Gelee im Test: 48/100 Punkte",
    productName: "1+ Geflügel Auswahl 4 Varietäten in Gelee, Nassfutter für Katzen, 85 g Beutel",
    keyword: "Whiskas Geflügel Auswahl Gelee",
    priceClass: "GUENSTIG" as const,
    pricePerKg: 4.11,
    packageSize: "40 × 85 g (Portionsbeutel)",
    price: 13.99,
    pricePerDay: 1.45 as number | null,
    image: "whiskas-1-gefluegel-auswahl-gelee-packshot-hersteller.webp",
    imageAlt: "Packung Whiskas 1+ Geflügel Auswahl in Gelee mit Portionsbeuteln (Bild: Hersteller)",
    contentImage: "whiskas-1-gefluegel-auswahl-gelee-seitenansicht-hersteller.webp",
    contentImageAlt: "Seitenansicht der Whiskas-Packung mit Nutzen-Symbolen (Bild: Hersteller)",
    composition:
      "mit Huhn: Fleisch und tierische Nebenerzeugnisse (90 % im Häppchen*, u.a. Huhn 4 % im Häppchen*), Getreide, Mineralstoffe, pflanzliche Nebenerzeugnisse (u.a. Rübenschnitzel 0,25 %), Zucker. *Häppchen machen 40 % des Produkts aus. (Sorten Truthahn, Geflügel, Ente entsprechend mit je 4 % im Häppchen.) Zusatzstoffe je kg: Vitamin B1 27,3 mg, Vitamin C 360 mg, Vitamin D3 200 IE, Vitamin E 18,2 mg, Taurin 620 mg, Kupfer 1,2 mg, Jod 0,22 mg, Eisen 11,2 mg, Mangan 2,2 mg, Zink 16,2 mg; Cassia-Gum 1.500 mg; Aromen.",
    analysis: [
      { name: "Protein", value: 7.5 },
      { name: "Fettgehalt", value: 4 },
      { name: "Rohasche", value: 1.6 },
      { name: "Rohfaser", value: 0.35 },
      { name: "Feuchtigkeit", value: 84.8 },
    ],
    scores: { scoreRaw: 8, scoreHarmful: 12, scoreNutrients: 11, scoreDeclaration: 6, scoreNeeds: 7, scoreValue: 4 },
    verdict:
      "Günstiges Katzennassfutter mit vollständig deklarierten Zusatzstoffen, aber nur 1,6 % namensgebendem Geflügel im Gesamtprodukt (eigene Berechnung). Abzüge: Sammelbegriffe, Getreide und Zucker, Aromen ohne Namen, vier fragwürdige Werbeaussagen.",
    teaser: "4 % Huhn im Häppchen, Zucker in der Liste. 48 Punkte.",
    pros: [
      "Zusatzstoffe vollständig beziffert, darunter Taurin (620 mg/kg), Vitamin D3, E, B1, Jod und Zink",
      "Energie (71 kcal/100 g) und Linolsäure angegeben",
      "Günstig: 13,99 € für 40 Beutel, rund 1,45 € pro Tag (Fressnapf, Stand 16.10.2026, eigene Berechnung)",
    ],
    cons: [
      "Nur Sammelbegriffe; namensgebendes Geflügel 4 % im Häppchen, also 1,6 % im Produkt (eigene Berechnung)",
      "Getreide und Zucker in einem Alleinfutter für Katzen; Aromen ohne Namen",
      "Vier fragwürdige Werbeaussagen, darunter Abwehrkräfte durch Vitamin C",
    ],
    claims: [
      c("Jede köstliche Rezeptur enthält 100% hochwertige Zutaten und deckt alle täglichen Bedürfnisse deiner 1+ Katze", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "„Hochwertig“ ist bei Sammelbegriffen wie „Fleisch und tierische Nebenerzeugnisse“ und „Getreide“ nicht nachprüfbar. Die Bedarfsdeckung entspricht dem Anspruch eines Alleinfutters."),
      c("Mit hochwertigem Protein zur Unterstützung starker Muskeln", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1", "Die Proteinquelle ist nur als Sammelbegriff deklariert. Ein Beleg für die Wirkung auf die Muskulatur fehlt auf der Seite."),
      c("Hergestellt mit Vitamin C zur Unterstützung der natürlichen Abwehrkräfte", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1, 3", "Vitamin C ist mit 360 mg/kg deklariert. Katzen bilden Vitamin C selbst; einen Beleg für die Wirkung auf die Abwehrkräfte nennt die Seite nicht."),
      c("Enthält Zink, unterstützt eine gesunde Haut & ein gesundes Fell", "ZULAESSIG", "VO (EG) 767/2009 Art. 13", "Zink ist deklariert (16,2 mg/kg) und als Nährstoff für Haut und Fell anerkannt."),
      c("Mit WHISKAS Lieblingsmahlzeiten rennt deine Katze schneller als je zuvor zum Napf!", "FRAGWUERDIG", "UWG § 5", "Gestützt laut Fußnote auf interne Daten und eine Befragung von 200 Katzenbesitzern in Großbritannien (2024). Eine Messung der Laufgeschwindigkeit ist das nicht."),
    ],
    metaTitle: "Whiskas 1+ Geflügel Auswahl in Gelee im Test: 48/100 Punkte",
    metaDescription: "Whiskas 1+ Geflügel Auswahl in Gelee im Test: Zusammensetzung, Zucker, Zusatzstoffe, Werbeaussagen und Preis pro Tag. 48 von 100 Punkten nach unserem Schema.",
    keywords: ["Whiskas Test", "Whiskas Geflügel Auswahl Gelee", "Katzennassfutter Test", "Whiskas Zucker", "Whiskas Erfahrungen"],
    bodyHtml: `<p>„Rennt deine Katze schneller als je zuvor zum Napf“, verspricht Mars für <strong>Whiskas 1+ Geflügel Auswahl in Gelee</strong> (${a(WH, "whiskas.de")}, abgerufen am ${D}). Die Fußnote verweist auf eine Befragung von 200 Katzenbesitzern in Großbritannien. Gemessen wurde also die Meinung, nicht die Geschwindigkeit. Die Beutel gehören im Oktober 2026 zu den Bestsellern für Katzenfutter auf Amazon.de.</p>
${TREND}
${METHODE(a(WH, "whiskas.de"))}
<h2>Vier Prozent Huhn, im Häppchen</h2>
<p>Die Sorte „mit Huhn“ deklariert „Fleisch und tierische Nebenerzeugnisse (90 % im Häppchen, u.a. Huhn 4 % im Häppchen)“. Die Häppchen machen 40 % des Produkts aus. Huhn kommt damit auf 1,6 % des Beutelinhalts, gut 1 g pro 85-g-Beutel (eigene Berechnung). Welche Tiere den Rest liefern? Nicht deklariert. Nach unserem rezepturbasierten Bewertungsschema reicht das für 8 von 30 Punkten.</p>
<h2>Getreide und Zucker für den Fleischfresser</h2>
<p>Hinter den tierischen Zutaten folgen Getreide, Mineralstoffe, pflanzliche Nebenerzeugnisse und Zucker. Zucker braucht eine Katze nicht. Er steht hier trotzdem in der Liste, die Menge ist nicht angegeben. Dazu kommen „Aromen“ ohne Namen und Cassia-Gum als Verdickungsmittel für das Gelee. Ein Gelee mit Aroma also.</p>
<h2>Bei den Zusatzstoffen ist Whiskas genau</h2>
<p>Positiv: Die Zusatzstoffliste ist vollständig beziffert. Taurin (620 mg/kg), Vitamin D3, Vitamin E, Vitamin B1, Kupfer, Jod, Eisen, Mangan und Zink stehen mit Menge da. Bei 84,8 % Feuchtigkeit entsprechen 7,5 % Protein und 4 % Fett rund 49 % Protein und 26 % Fett in der Trockensubstanz (eigene Berechnung). Calcium und Phosphor fehlen in der Analyse.</p>
<h2>Vitamin C für die Abwehr einer Katze, die es selbst bildet</h2>
<p>360 mg Vitamin C je kg sollen „die natürlichen Abwehrkräfte“ unterstützen. Katzen bilden Vitamin C selbst in der Leber. Einen Beleg für die Wirkung nennt die Seite nicht. Wir stufen diese Aussage, das „hochwertige Protein für starke Muskeln“, die „100 % hochwertigen Zutaten“ und den Napf-Sprint als fragwürdig ein. Zink für Haut und Fell ist deklariert und zulässig.</p>
<h2>Preis: günstig, mit Sammelbegriff</h2>
<p>Fressnapf verlangt 13,99 € für 40 Beutel, das sind 4,11 €/kg (${a(WH_FN, "fressnapf.de")}, Stand ${D}). Whiskas nennt auf der Seite keine Tagesmenge. Bei 71 kcal/100 g und rund 250 kcal Tagesbedarf einer 4-kg-Katze sind das gut 350 g oder rund 1,45 € pro Tag (eigene Berechnung und Annahme).</p>
<p><strong>Unser Gesamtergebnis: 48 von 100 Punkten</strong>, Ampel Rot nach unserem rezepturbasierten Bewertungsschema. ${STRENG(4, 0)} Weitere Abzüge gibt es für Sammelbegriffe, Zucker und unbenannte Aromen. Ob die Katze schneller rennt, wissen wir nicht. Das Huhn jedenfalls kommt nicht weit.</p>
${FOOT}`,
    conclusionHtml: `<p>Whiskas 1+ Geflügel Auswahl in Gelee ist nach unserer Einschätzung ein günstiges Nassfutter mit sauber bezifferten Zusatzstoffen, aber vager Rezeptur. Das namensgebende Geflügel macht nur 1,6 % aus, Getreide, Zucker und Aromen stehen in der Liste. Der Preis ist niedrig, die Auskunft über den Inhalt auch.</p>`,
  },
  // 5) Purina Gourmet Gold Feine Komposition Rind & Huhn
  {
    ...BASE_K,
    brand: "Purina Gourmet",
    slug: "gourmet-gold-feine-komposition-rind-huhn-test",
    title: "Gourmet Gold Feine Komposition Rind & Huhn im Test: 47/100 Punkte",
    productName: "Gourmet Gold Feine Komposition mit Rind und Huhn, Nassfutter für Katzen, 85 g Dose",
    keyword: "Gourmet Gold Feine Komposition",
    priceClass: "MITTEL" as const,
    pricePerKg: 5.68,
    packageSize: "12 × 85 g (Dosen)",
    price: 5.79,
    pricePerDay: 1.93 as number | null,
    image: "gourmet-gold-feine-komposition-rind-huhn-packshot-hersteller.webp",
    imageAlt: "Dose Gourmet Gold Feine Komposition mit Rind und Huhn, 85 g, Vorderansicht (Bild: Hersteller)",
    contentImage: "gourmet-gold-feine-komposition-rind-huhn-seite-hersteller.webp",
    contentImageAlt: "Dose Gourmet Gold Feine Komposition mit Rind und Huhn, Seitenansicht (Bild: Hersteller)",
    composition:
      "Fleisch und tierische Nebenerzeugnisse (davon 4 % Rind, 4 % Huhn), pflanzliche Eiweißextrakte, Getreide, Fisch und Fischnebenerzeugnisse, Mineralstoffe, Zucker. Ernährungsphysiologische Zusatzstoffe: Vitamin A 635 IE/kg, Vitamin D3 95 IE/kg; Eisen 22,4 mg/kg, Jod 0,28 mg/kg, Kupfer 2,5 mg/kg, Mangan 4,4 mg/kg, Zink 36 mg/kg.",
    analysis: [
      { name: "Protein", value: 10 },
      { name: "Fettgehalt", value: 3 },
      { name: "Rohasche", value: 2 },
      { name: "Rohfaser", value: 0.1 },
      { name: "Feuchtigkeit", value: 81.5 },
    ],
    scores: { scoreRaw: 8, scoreHarmful: 12, scoreNutrients: 10, scoreDeclaration: 7, scoreNeeds: 7, scoreValue: 3 },
    verdict:
      "Beliebtes Katzennassfutter, dessen namensgebende Zutaten Rind und Huhn mit je 4 % deklariert sind; an zweiter Stelle stehen pflanzliche Eiweißextrakte, am Ende Zucker. Abzüge: Sammelbegriffe, Taurin und Vitamin E nicht als Zusatzstoff deklariert, „erlesen“ ohne Beleg.",
    teaser: "Je 4 % Rind und Huhn, Pflanzeneiweiß auf Platz zwei. 47 Punkte.",
    pros: [
      "Ohne Zusatz künstlicher Farbstoffe, Konservierungsstoffe und Aromen laut Hersteller",
      "Spurenelemente und Vitamin A/D3 beziffert; klare Fütterungsempfehlung (4 Dosen/Tag für 4 kg)",
      "Fettarm (3 %) und mit 85-g-Dosen gut portionierbar",
    ],
    cons: [
      "Nur Sammelbegriffe; Rind und Huhn je 4 %, pflanzliche Eiweißextrakte an zweiter Stelle",
      "Getreide und Zucker in einem Alleinfutter für Katzen",
      "Taurin und Vitamin E nicht als Zusatzstoffe deklariert; Calcium und Phosphor nicht angegeben",
    ],
    claims: [
      c("GOURMET Gold Feine Komposition - Saftige Stückchen, kombiniert mit erlesenen Streifen.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "„Erlesen“ lässt sich bei Sammelbegriffen und pflanzlichen Eiweißextrakten an zweiter Stelle nicht nachprüfen."),
      c("Katzennassfutter ohne Zusatz künstlicher Farbstoffe, Konservierungsstoffe und Aromen.", "ZULAESSIG", "VO (EG) 767/2009 Art. 11", "In der Zusatzstoffliste sind keine Farb-, Konservierungs- oder Aromastoffe genannt."),
      c("Alleinfuttermittel für ausgewachsene Katzen.", "ZULAESSIG", "VO (EG) 767/2009 Art. 17", "Pflichtangabe zur Art des Futtermittels."),
      c("Genau das Richtige für kleine Genießer, die feine Kreationen lieben.", "FRAGWUERDIG", "UWG § 5", "Werbliche Anpreisung ohne nachprüfbaren Gehalt; „fein“ steht neben Zucker und Getreide in der Zutatenliste."),
    ],
    metaTitle: "Gourmet Gold Feine Komposition Rind & Huhn im Test: 47/100 Punkte",
    metaDescription: "Gourmet Gold Feine Komposition Rind & Huhn im Test: Zusammensetzung, Zucker, Zusatzstoffe, Werbeaussagen und Preis pro Tag. 47 von 100 Punkten nach unserem Schema.",
    keywords: ["Gourmet Gold Test", "Gourmet Gold Feine Komposition", "Katzennassfutter Test", "Gourmet Gold Zucker", "Gourmet Gold Erfahrungen"],
    bodyHtml: `<p>„Saftige Stückchen, kombiniert mit erlesenen Streifen“: So bewirbt Purina die Dose <strong>Gourmet Gold Feine Komposition mit Rind und Huhn</strong> (${a(GO, "purina.de")}, abgerufen am ${D}). Gourmet steht im Oktober 2026 mit mehreren Packungen in den Amazon.de-Bestsellern für Katzenfutter. Erlesen heißt: ausgewählt. Wir haben nachgesehen, was ausgewählt wurde.</p>
${TREND}
${METHODE(a(GO, "purina.de"))}
<h2>Rind und Huhn als Nebendarsteller</h2>
<p>Die Zutatenliste beginnt mit „Fleisch und tierische Nebenerzeugnisse (davon 4 % Rind, 4 % Huhn)“. Die namensgebenden Tiere machen zusammen 8 % aus, gut 6,8 g pro Dose (eigene Berechnung). Welche Tiere den Rest liefern? Nicht deklariert. Danach folgen pflanzliche Eiweißextrakte, Getreide, Fisch und Fischnebenerzeugnisse, Mineralstoffe und Zucker. Nach unserem rezepturbasierten Bewertungsschema ergibt das 8 von 30 Punkten.</p>
<h2>Pflanzeneiweiß auf Platz zwei</h2>
<p>Pflanzliche Eiweißextrakte stehen vor dem Getreide. Sie geben „Stückchen“ und „Streifen“ Form und heben den Proteinwert. Für einen Fleischfresser ist das nach unserer Einschätzung die zweitbeste Lösung. Bei 81,5 % Feuchtigkeit entsprechen 10 % Protein und 3 % Fett rund 54 % Protein und 16 % Fett in der Trockensubstanz (eigene Berechnung). Wie viel davon aus Fleisch stammt, lässt die Deklaration offen.</p>
<h2>Taurin: nicht deklariert</h2>
<p>Die Zusatzstoffliste nennt Vitamin A, Vitamin D3, Eisen, Jod, Kupfer, Mangan und Zink. Taurin ist nicht als Zusatzstoff deklariert, Vitamin E ebenfalls nicht. Taurin ist für Katzen lebensnotwendig und kommt auch in Fleisch und Fisch vor. Ob die Menge reicht, lässt sich ohne Angabe nicht prüfen. Calcium und Phosphor fehlen in der Analyse ebenso.</p>
<h2>„Feine Kreationen“ mit Zucker</h2>
<p>Zucker steht am Ende der Liste, die Menge ist nicht angegeben. „Ohne Zusatz künstlicher Farbstoffe, Konservierungsstoffe und Aromen“ ist durch die Deklaration gedeckt. „Erlesen“ und „genau das Richtige für kleine Genießer“ sind Anpreisungen ohne prüfbaren Inhalt. Wir stufen zwei Aussagen als fragwürdig ein, zwei als zulässig.</p>
<h2>Preis: Gold im Namen, Mittelfeld im Preis</h2>
<p>Fressnapf verlangt 5,79 € für 12 Dosen, das sind 5,68 €/kg (${a(GO_FN, "fressnapf.de")}, Stand ${D}). Purina empfiehlt 4 Dosen täglich für eine 4-kg-Katze, das sind rund 1,93 € pro Tag (eigene Berechnung). Für 8 % benanntes Fleisch ist das nach unserer Einschätzung kein Schnäppchen.</p>
<p><strong>Unser Gesamtergebnis: 47 von 100 Punkten</strong>, Ampel Rot nach unserem rezepturbasierten Bewertungsschema. ${STRENG(2, 0)} Weitere Abzüge gibt es für Sammelbegriffe, Pflanzeneiweiß an zweiter Stelle, Zucker und das nicht deklarierte Taurin. Das Gold steht auf der Dose, nicht in der Zutatenliste.</p>
${FOOT}`,
    conclusionHtml: `<p>Gourmet Gold Feine Komposition Rind &amp; Huhn ist nach unserer Einschätzung ein beliebtes, aber vage deklariertes Nassfutter: je 4 % Rind und Huhn, pflanzliche Eiweißextrakte an zweiter Stelle, Getreide und Zucker. Taurin ist nicht als Zusatzstoff deklariert. Katzen mögen es offenbar, das Etikett überzeugt uns weniger.</p>`,
  },
];
