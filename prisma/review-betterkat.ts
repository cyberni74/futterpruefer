/** Test „The Better Cat Monoprotein Rind Pur“ (Okt. 2026). Der Seed legt ihn nur an, wenn der Slug fehlt; Änderungen im Admin bleiben erhalten. */
const SRC = "Produktseite thebettercat.com, abgerufen am 09.10.2026";
const a = (u: string, l: string) => `<a href="${u}">${l}</a>`;
type Claim = { claim: string; rating: "ZULAESSIG" | "FRAGWUERDIG" | "UNZULAESSIG"; legal: string; reason: string; imageUrl: string };
const c = (claim: string, rating: Claim["rating"], legal: string, reason: string): Claim => ({ claim, rating, legal, reason, imageUrl: "" });

export const BETTERCAT_TESTS = [
  {
    categorySlug: "alleinfuttermittel-katze",
    brand: "The Better Cat",
    slug: "the-better-cat-monoprotein-rind-pur-test",
    title: "The Better Cat Monoprotein Rind Pur im Test: 65/100 Punkte",
    productName: "Monoprotein Rind Pur",
    keyword: "Monoprotein Katzenfutter Rind",
    priceClass: "PREMIUM" as const,
    pricePerKg: 16.66,
    packageSize: "6 x 200 g Nassfutter",
    price: 19.99,
    pricePerDay: 3.33,
    image: "the-better-cat-rind-pur-katze-napf.webp",
    imageAlt: "Katze und Hund fressen aus Näpfen in einer Küche, Illustration",
    contentImage: "the-better-cat-rind-pur-nassfutter-katze-lebensphase.webp",
    contentImageAlt: "Katzen verschiedener Lebensphasen, Illustration",
    gallery: [] as string[],
    composition:
      "69 % Rind (Fleisch, Lunge, Euter, Herz, Leber), 24 % Fleischbrühe, 4 % Pastinake, 1 % Mineralstoffe, 0,7 % getrocknete Eierschalen, 0,1 % Katzenminze, 0,1 % Algenöl, 0,1 % Brennnessel, 0,05 % Bierhefe, 0,05 % Inulin, 0,05 % Fructooligosaccharide (FOS)",
    analysis: [
      { name: "Rohprotein", value: 12 },
      { name: "Rohfett", value: 9 },
      { name: "Rohasche", value: 2 },
      { name: "Rohfaser", value: 0.3 },
      { name: "Feuchtigkeit", value: 77 },
      { name: "Calcium", value: 0.3 },
      { name: "Phosphor", value: 0.2 },
    ],
    scores: { scoreRaw: 25, scoreHarmful: 18, scoreNutrients: 15, scoreDeclaration: 0, scoreNeeds: 6, scoreValue: 1 },
    verdict:
      "Eine ehrlich deklarierte, kurze Fleischrezeptur: 69 % Rind mit benannten Teilen, Brühe, kein Getreide, kein Zucker, alle Zusatzstoffe mit Mengen. Die Werbung wirkt dagegen wie von einem anderen Produkt: Zutaten, die nicht in der Liste stehen, drei verschiedene Produktionsorte, „97 % Fleisch“ bei 69 % Rind und pauschal herabsetzende Vergleichswerbung. 65 Punkte, Ampel Gelb.",
    teaser: "Starke Rezeptur (69 % Rind), aber Werbung mit Zutaten, die nicht drin sind. 65 Punkte.",
    pros: [
      "Kurze Zusammensetzung mit Prozentangaben und benannten Teilen (Fleisch, Lunge, Euter, Herz, Leber); kein Getreide, Gluten, Zucker; Taurin 1.000 mg/kg und alle Zusatzstoffe mit Mengen",
      "Rohprotein 12 % und Rohfett 9 % bei 77 % Feuchte, rechnerisch rund 52 % Protein und 39 % Fett in der Trockenmasse; Calcium-Phosphor-Verhältnis 1,5 : 1",
      "Verständliche Rückgabe: 30 Tage Zufriedenheitsgarantie auf die erste Bestellung, Abo jederzeit kündbar",
    ],
    cons: [
      "Werbung nennt Zutaten und Wirkstoffe, die in der Zusammensetzung fehlen (Leinöl, Sanddorn, Kamille, Löwenzahn, Distelöl, Probiotika); „97 % Fleisch“ bei 69 % Rind plus 24 % Brühe",
      "Drei Angaben zum Produktionsort („Deutschland“, „Frankreich“, „EU“); keine Fütterungsempfehlung als Text und kein Energiegehalt auf der Produktseite gefunden",
      "„Reduzierung von Allergien“, Schutz der Organe und pauschale Abwertung anderer Marken („Katzenschädlich“, „Junk-Food-Qualität“); 16,66 € je kg, rund 3,33 € am Tag bei 200 g",
    ],
    claims: [
      c("97% Fleisch, Innereien & Brühe (Fleisch, Herz, Lunge, Euter, Kehlkopf, Leber) - kein Gelee!", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Die Zusammensetzung nennt 69 % Rind und 24 % Fleischbrühe, zusammen 93 %. „Kehlkopf“ steht nur in der Beschreibung, nicht in der Zusammensetzung. Der Seitentitel spricht sogar von „97% Fleischanteil“, obwohl Brühe kein Fleisch ist."),
      c("Hergestellt aus regionalen Zutaten in Deutschland", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Dieselbe Produktseite sagt an anderer Stelle, das Futter werde „in Frankreich produziert, um den CO2-Fußabdruck zu minimieren“; die Nachhaltigkeitsseite nennt „in der EU produziert“ und „Deutschland, Frankreich und Italien“. Eine einzelne, eindeutige Herkunftsangabe fehlt. Der Produktionsbetrieb ist nicht genannt."),
      c("Ein ausgeglichenes Darmmikrobiom = weniger Erbrechen und Durchfall.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1, 3; UWG § 5", "Erbrechen und Durchfall sind Krankheitszeichen. Die Präbiotika machen nur 0,1 % der Rezeptur aus (Inulin 0,05 %, FOS 0,05 %); eine Quelle nennt die Seite nicht."),
      c("Vorteile von Monoprotein: … Es unterstützt auch ein gesundes Gewicht, das Immunsystem, die Haut- und Fellgesundheit sowie die Reduzierung von Allergien.", "UNZULAESSIG", "VO (EG) 767/2009 Art. 13 Abs. 3", "Eine „Reduzierung von Allergien“ ist eine Aussage zu einem Krankheitsbild. Die FAQ geht weiter: „Reduziert das Risiko von Nahrungsmittelintoleranz und Allergien“. Ein Beleg wird nicht genannt, und Monoprotein ist keine Allergieprophylaxe."),
      c("Brennnessel: Unterstützt die Nierenfunktion und hilft langfristig, die Organe zu schützen.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1, 3; UWG § 5", "Brennnessel macht 0,1 % der Rezeptur aus. „Organe schützen“ ist ein Schutzversprechen ohne Beleg; bei Nierenproblemen von Katzen ist die Tierarztpraxis zuständig."),
      c("Enthält Superfoods wie Eierschalenpulver, Leinöl, Brennnessel und Sanddorn.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1, Art. 17; UWG § 5", "Leinöl und Sanddorn stehen nicht in der Zusammensetzung. „Superfood“ ist kein geschützter Begriff."),
      c("Sehkraft und Temperament: Kamille sowie natürliche Mineralien und Vitamine … um Katzen eine bessere Sehkraft und ein stabileres Temperament zu geben.", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 13 Abs. 1; UWG § 5", "Kamille steht nicht in der Zusammensetzung. Eine Wirkung auf Sehkraft und Temperament wird ohne Beleg behauptet."),
      c("Immun- und Energie-Booster: … Löwenzahn, Algenöl und Distelöl liefert essentielle Nährstoffe …", "FRAGWUERDIG", "VO (EG) 767/2009 Art. 11 Abs. 1; UWG § 5", "Löwenzahn und Distelöl stehen nicht in der Zusammensetzung, Algenöl nur zu 0,1 %."),
      c("Alle unsere Rezepte sind exklusiv und von veterinärmedizinischen Forschern mit wissenschaftlich unterstützten Zutaten entwickelt worden.", "FRAGWUERDIG", "UWG § 5", "Weder Forschende noch Studien werden genannt. Als Beraterin tritt eine Tierärztin auf (Mag. vet. med. Veronika Broukal); eine Studie zum Produkt gibt es nach den Angaben der Seite nicht."),
      c("Sie werden nie etwas Künstliches brauchen - niemals.", "FRAGWUERDIG", "UWG § 5", "Die Zusatzstoffe (Vitamin D3, Vitamin E als α-Tocopherolacetat, Taurin, Jod als Calciumjodat, Mangan- und Zinksulfat) werden üblicherweise synthetisch hergestellt. Die Aussage ist absolut formuliert."),
      c("Anderes Katzenfutter: Aus Fleischmehl in Junk-Food-Qualität; Inklusive Zucker, Getreide und vielen Füllstoffen; 3 oder mehr Proteinquellen; Katzenschädlich und Umweltzerstörend", "UNZULAESSIG", "UWG § 6 Abs. 2 Nr. 5; UWG § 5", "Pauschale Herabsetzung aller anderen Marken in einer Vergleichstabelle. Weder belegt noch auf einzelne Wettbewerber bezogen. „Katzenschädlich“ unterstellt, anderes Futter schade Katzen."),
      c("Eine Tonne Algenöl bewahrt 60 Tonnen Wildlachs vor dem Tod; 2.5 Tonnen geretteter Lachs", "FRAGWUERDIG", "UWG § 5", "Rechnung ohne Quelle und Herleitung. Das Futter enthält 0,1 % Algenöl; das „Retten“ von Lachs hängt davon ab, was sonst als Quelle genutzt würde."),
      c("Probiotika: Helfen dabei, ein gesundes Gleichgewicht von Darmbakterien aufrechtzuerhalten", "FRAGWUERDIG", "UWG § 5", "In der Zusammensetzung steht kein Probiotikum; genannt sind nur Präbiotika (Inulin, FOS)."),
      c("30-Tage Zufriedenheit-Garantie … vollständige Rückerstattung in Form eines Gutscheins", "FRAGWUERDIG", "UWG § 5", "Die Rückgaberegel (Refund Policy) spricht von Erstattung „auf die ursprüngliche Zahlungsmethode“, die Produktseite von einem Gutschein. Geöffnete Packungen werden nicht zurückgenommen."),
      c("Kein Getreide, Gluten, Füllstoffe oder Zuckerzusatz.", "ZULAESSIG", "VO (EG) 767/2009 Art. 11 Abs. 1", "Passt zur Zusammensetzung: Rind, Brühe, Pastinake, Mineralstoffe, kleine Mengen Kräuter, Algenöl, Hefe, Eierschalen."),
      c("Alleinfuttermittel für adulte Katzen", "ZULAESSIG", "VO (EG) 767/2009 Art. 17", "Futtermittelart ist angegeben, Zusatzstoffe stehen mit Mengen. Wir haben die Nährstoffgehalte nicht gegen die FEDIAF-Werte geprüft; Energiegehalt und Fütterungsempfehlung fehlen auf der Produktseite."),
    ],
    metaTitle: "The Better Cat Monoprotein Rind Pur im Test: 65/100 Punkte",
    metaDescription: "The Better Cat Monoprotein Rind Pur Katzenfutter im Test: 69 % Rind, aber Werbung mit Zutaten, die nicht drin sind, und drei Produktionsorte. Preis pro Tag, Werbeaussagen-Check. 65 von 100 Punkten.",
    keywords: ["The Better Cat Test", "The Better Cat Rind Pur", "Monoprotein Katzenfutter", "Katzenfutter Rind Nassfutter", "The Better Cat Erfahrungen", "Katzenfutter Algenöl"],
    publishedDaysAgo: 5.4,
    bodyHtml: `<p>„97% Fleisch, Innereien &amp; Brühe … kein Gelee!“ So beginnt die Beschreibung des <strong>Monoprotein Rind Pur</strong> von The Better Cat (${SRC}). Die Zusammensetzung sagt: 69 % Rind, 24 % Fleischbrühe. Wir prüfen die Rezeptur und die Werbung.</p>

<h2>Wie wir getestet haben</h2>
<p>Wir haben das Produkt nicht im Labor analysiert und nicht an Katzen erprobt. Grundlage sind die Angaben des Herstellers (${SRC}), die wir nach unserem 100-Punkte-Schema und nach den Regeln der Futtermittelkennzeichnung (VO (EG) 767/2009) und des Wettbewerbsrechts (UWG) prüfen. Die Einstufung der Werbeaussagen ist unsere begründete Einschätzung und keine rechtsverbindliche Feststellung. Hersteller laut Impressum ist die The Healthy Pet Co. GmbH, Rosenthaler Straße 13, c/o Atlantic Labs, 10119 Berlin (Amtsgericht Charlottenburg, HRB 226450). Gewählt haben wir das 6 x 200 g-Paket Rind Pur. Die Bilder sind neutrale Illustrationen.</p>

<h2>Zusammensetzung: kurz und fleischreich</h2>
<p>Das Futter ist als „Alleinfuttermittel für adulte Katzen“ gekennzeichnet. Die Zusammensetzung: 69 % Rind (Fleisch, Lunge, Euter, Herz, Leber), 24 % Fleischbrühe, 4 % Pastinake, 1 % Mineralstoffe, 0,7 % getrocknete Eierschalen, je 0,1 % Katzenminze, Algenöl und Brennnessel, je 0,05 % Bierhefe, Inulin und FOS. Das ist für Katzen eine passende Basis: tierisch, ohne Getreide und Zucker, mit benannten Teilen. Euter und Lunge sind Nebenerzeugnisse, aber offen genannt.</p>
<p><strong>Analytische Bestandteile:</strong> Protein 12 %, Fett 9 %, Rohasche 2 %, Rohfaser 0,3 %, Feuchtigkeit 77 %, Calcium 0,3 %, Phosphor 0,2 %. In der Trockenmasse sind das rund 52 % Protein und 39 % Fett (eigene Berechnung), für eine Katze ein passendes Profil. <strong>Zusatzstoffe je kg:</strong> Vitamin D3 200 IE, Vitamin E 50 mg, Taurin 1.000 mg, Jod 0,2 mg, Mangan 2 mg, Zink 20 mg. Energiegehalt und Fütterungsempfehlung nach Gewicht haben wir auf der Produktseite nicht als Text gefunden; möglicherweise stehen sie nur auf dem Etikett.</p>

<h2>Die Werbung: Zutaten, die nicht in der Liste stehen</h2>
<p>Die Produktseite wirbt mit „Superfoods wie Eierschalenpulver, Leinöl, Brennnessel und Sanddorn“. Leinöl und Sanddorn stehen nicht in der Zusammensetzung. Bei den „präventiven Inhaltsstoffen“ werden Kamille, Löwenzahn, Distelöl und Ringelblume genannt, die ebenfalls fehlen. Auch „Probiotika“ werden beschrieben, die Zusammensetzung enthält nur Präbiotika (Inulin, FOS, zusammen 0,1 %). Die Seite erklärt nicht, ob diese Texte allgemein für die Marke gelten; auf der Produktseite des Rind Pur stehen sie als Werbung für das Produkt.</p>
<p>Die Mengen sind klein: Brennnessel 0,1 %, Algenöl 0,1 %, Katzenminze 0,1 %. Dass 0,1 % Brennnessel „die Nierenfunktion unterstützt“ und „die Organe schützt“, belegt die Seite nicht. Bei Nierenproblemen von Katzen ist die Tierarztpraxis zuständig, und Phosphor (hier 0,2 %) ist dafür eine wichtigere Zahl als jedes Kraut.</p>

<h2>„Reduzierung von Allergien“ und Vergleichswerbung</h2>
<p>Monoprotein-Futter nutzt nur eine tierische Proteinquelle. Das ist bei Ausschlussdiäten sinnvoll, belegt aber nicht, dass es Allergien „reduziert“. Die Seite behauptet das trotzdem („die Reduzierung von Allergien“; in der FAQ „Reduziert das Risiko von Nahrungsmittelintoleranz und Allergien“). Das ist nach unserer Einschätzung eine Aussage zu einem Krankheitsbild und für ein Futtermittel unzulässig (Art. 13 Abs. 3).</p>
<p>In einer Tabelle stellt die Marke sich anderem Katzenfutter gegenüber: „Aus Fleisch in Lebensmittelqualität“ gegen „Aus Fleischmehl in Junk-Food-Qualität“, „Ohne Zucker, Getreide oder irgendwelche Füllstoffe“ gegen „Inklusive Zucker, Getreide und vielen Füllstoffen“, „Katzen- und Umweltfreundlich“ gegen „Katzenschädlich und Umweltzerstörend“. Das ist keine Vergleichswerbung mit belegten Daten, sondern eine pauschale Abwertung aller anderen Hersteller. Das UWG verbietet die Herabsetzung von Wettbewerbern (§ 6 Abs. 2 Nr. 5). Wir stufen die Tabelle als unzulässig ein.</p>

<h2>Wo wird es hergestellt?</h2>
<p>Die Produktseite sagt: „Hergestellt aus regionalen Zutaten in Deutschland“. Weiter unten steht: „…wird in Frankreich produziert, um den CO2-Fußabdruck zu minimieren.“ Die Nachhaltigkeitsseite der Marke schreibt: „In Deutschland entwickelt und in der EU produziert“ und „Hergestellt in Deutschland, Frankreich und Italien. 95% der Zutaten stammen aus der EU“. Das lässt sich teilweise miteinander vereinbaren (entwickelt in Deutschland, produziert in Frankreich), aber „hergestellt in Deutschland“ ist dann zumindest missverständlich. Der Produktionsbetrieb steht nicht auf der Seite. Zur „97 %“-Angabe: Der Seitentitel nennt „97% Fleischanteil“, die Zusammensetzung 69 % Rind plus 24 % Brühe, also 93 %. Brühe ist kein Fleisch.</p>

<h2>Preis pro Tag, Abo und Garantie</h2>
<p>Das Sechserpaket (6 x 200 g) kostet 19,99 €, das sind 16,66 € je Kilogramm oder 3,33 € je Dose (eigene Berechnung). Die Seite nennt „2,4€/Dose (13,1€/Kg)“; wie sie darauf kommt, erklärt sie nicht (möglicherweise mit Abo-Rabatt). Wenn eine Katze 200 g am Tag frisst, ein Wert, den ein Testblog für eine Katze von 4 bis 5 kg nennt, kostet das rund 3,33 € am Tag.</p>
<ul>
<li><strong>Sparplan:</strong> „Spare 25% zuerst, dann 15% für immer“. Jederzeit pausieren oder kündigen, keine Mindestlaufzeit.</li>
<li><strong>Garantie:</strong> 30 Tage auf die erste Bestellung, ungeöffnete Ware, Folgebestellungen im Sparplan können laut Rückgabeseite „weder storniert noch retourniert werden“. Geöffnete Packungen werden nicht zurückgenommen. Die Produktseite spricht von Erstattung „in Form eines Gutscheins“, die Rückgaberegel von der ursprünglichen Zahlungsmethode.</li>
<li><strong>Lieferung:</strong> „4-5 Werktage“ laut Produktseite. Versandkosten haben wir nicht gefunden.</li>
</ul>

<h2>Was Käufer berichten</h2>
<p>Auf ${a("https://www.reviews.io/company-reviews/store/thebettercat.com", "reviews.io")} steht die Marke bei 4,4 Sternen und 345 Bewertungen, 86 % empfehlen sie weiter. Eine Käuferin schreibt am 20.08.2025: „Mit Better CAT habe ich das erste Futter seit knapp 4 Jahren was wirklich von Allen ausnahmslos gefressen wird.“ Eine andere am 08.10.2026: „Die Katzen lieben es Es ist schon Ein bisschen teuer“, mit dem Hinweis, die Lieferung habe fast zwei Wochen gedauert. In einem Katzenforum schreibt eine Halterin am 01.02.2026: „Beide mochten es nicht. Total verweigert, alle Sorten.“ Ein Testblog (${a("https://www.vom-taubertal.de/blog/katzenfutter-im-test-bei-den-taubertalpersern-the-better-cat/", "Taubertal-Perser")}, Datum nicht erkennbar) berichtet: „Die Akzeptanz war ausgesprochen bescheiden. Die Pouches wurden mit langen Zähnen gefressen, die Dosen gingen absolut nicht.“ Katzen sind individuell: Die Berichte zeigen, dass Akzeptanz ein Lotteriespiel ist, nicht die Qualität.</p>
<p>Weitere Angaben: Die Marke führt „The Better Cat“ als Wortmarke; zum Gründungsjahr nennen unsere Quellen 2021 und 2022, ein Handelsregisterauszug lag uns nicht vor. Stiftung Warentest und Öko-Test haben die Marke nach unserer Suche nicht getestet; eine Rückrufmeldung haben wir nicht gefunden, das ist keine Garantie, dass es keine gibt. Trustpilot war für uns nicht abrufbar.</p>

<p><strong>Unser Gesamtergebnis: 65 von 100 Punkten.</strong> Nach unserem Bewertungsschema liegt das Rind Pur im gelben Bereich. <strong>Strenge Wertung:</strong> Jede fragwürdige Werbeaussage kostet einen Punkt bei der Deklaration, jede unzulässige drei, höchstens 15; hier sind es 12 fragwürdige und 2 unzulässige Aussagen, die Deklaration ist damit ausgeschöpft. Die Rezeptur selbst (Rohstoffe 25 von 30, Zusatzstoffe 18 von 20) erkennen wir ausdrücklich an. Punkte kosten die Widersprüche bei Zutaten, Herkunft und Fleischanteil, die Allergie- und Organversprechen, die herabsetzende Vergleichstabelle, die fehlende Fütterungsempfehlung und der Preis.</p>
<p><em>Hinweis:</em> Alle Zitate stammen von den genannten Seiten (Stand 09.10.2026). Preise und Texte können sich ändern.</p>`,
    conclusionHtml: `<p>Das Rind Pur von The Better Cat ist als Futter besser, als die Werbung vermuten lässt: 69 % Rind, kein Getreide, kein Zucker, offene Deklaration. Genau diese Rezeptur braucht die vielen Wirkversprechen nicht. Wer es probiert, sollte die Akzeptanz mit einem kleinen Paket testen und bei Nierenproblemen oder Allergien vorher die Tierarztpraxis fragen.</p>`,
  },
];
