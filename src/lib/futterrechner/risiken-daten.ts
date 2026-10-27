/**
 * Risikotexte „Mögliche Folgen“ (Problem → Lösung). Quelle der Texte: docs/futterrechner/risikotexte.md,
 * Rechtsprüfung 27.10.2026 freigegeben (A1–A7 eingearbeitet). Die Texte sind wortgleich übernommen und nicht zu ändern.
 * Die Trigger (Abschnitt 2) stehen in risiken.ts.
 */

export type QuelleId = "Q1" | "Q2" | "Q3" | "Q4" | "Q5" | "Q6" | "Q7" | "Q8" | "Q9" | "Q10" | "Q11" | "Q12" | "Q13" | "Q14" | "Q15" | "Q16";
export type RisikoId =
  | "R-P-HUND-ADULT"
  | "R-P-HUND-GERING"
  | "R-P-WELPE"
  | "R-P-KATZE-ADULT"
  | "R-P-KITTEN"
  | "R-F-HUND"
  | "R-F-WELPE"
  | "R-F-KATZE"
  | "R-T-KATZE"
  | "R-T-KATZE-NASS"
  | "R-CA-HOCH-WELPE"
  | "R-CA-HOCH-HUND"
  | "R-CA-NIEDRIG-WELPE"
  | "R-CA-NIEDRIG-HUND"
  | "R-CA-NIEDRIG-KATZE"
  | "R-CAP-NIEDRIG-WELPE"
  | "R-CAP-NIEDRIG-HUND"
  | "R-CAP-NIEDRIG-KATZE"
  | "R-CAP-HOCH-WELPE"
  | "R-CAP-HOCH"
  | "R-PH-HOCH-HUND"
  | "R-PH-NIEDRIG"
  | "R-ASCHE-HOCH"
  | "R-ASCHE-NIEDRIG"
  | "R-FASER-HUND"
  | "R-MENGE-HUND"
  | "R-MENGE-WELPE"
  | "R-MENGE-KATZE"
  | "R-LECKERLI";

/** Lösungstext: Zeichenketten und Links auf eigene Seiten. */
export type Teil = string | { a: string; href: string };
export type Risiko = { risiko: string; loesung: Teil[]; quellen: Array<{ id: QuelleId; text: string }> };

export const QUELLEN: Record<QuelleId, { voll: string; url: string }> = {
  "Q1": { voll: "FEDIAF (2025): Nutritional Guidelines for Complete and Complementary Pet Food for Cats and Dogs, Publication September 2025. Geprüfte Stellen: S. 21 (Fußnoten a, b, f, h), S. 22 (Protein), S. 23 (Fett, Omega-3/6), S. 24 (Calcium adult, RA puppies, Maximum for puppies), S. 25 (Phosphorus, Trace elements), S. 27 (Taurine), S. 28 (Fat, Katze), S. 43 (Body Condition Score), S. 50 (Rohfaser-Hinweis), S. 55 (Welpen nie ad libitum), S. 60 (7.3.2 Taurin Katze), Tab. III-3a/b, III-4a/b", url: "https://europeanpetfood.org/wp-content/uploads/2025/09/FEDIAF-Nutritional-Guidelines_2025-ONLINE.pdf" },
  "Q2": { voll: "National Research Council (2006): Nutrient Requirements of Dogs and Cats. National Academies Press", url: "https://doi.org/10.17226/10668" },
  "Q3": { voll: "Kealy RD, Lawler DF, Ballam JM, et al. (2002): Effects of diet restriction on life span and age-related changes in dogs. J Am Vet Med Assoc 220(9): 1315–1320", url: "https://doi.org/10.2460/javma.2002.220.1315" },
  "Q4": { voll: "Laflamme DP (2008): Pet food safety: dietary protein. Top Companion Anim Med 23(3): 154–157", url: "https://doi.org/10.1053/j.tcam.2008.04.009" },
  "Q5": { voll: "Laflamme DP, Hannah SS (2013): Discrepancy between use of lean body mass or nitrogen balance to determine protein requirements for adult cats. J Feline Med Surg 15(8): 691–697", url: "https://doi.org/10.1177/1098612X12474448" },
  "Q6": { voll: "Kazimierska K, Biel W, Witkowicz R (2020): Mineral Composition of Cereal and Cereal-Free Dry Dog Foods versus Nutritional Guidelines. Molecules 25(21): 5173", url: "https://doi.org/10.3390/molecules25215173" },
  "Q7": { voll: "Kirby NA, Hester SL, Bauer JE (2007): Dietary fats and the skin and coat of dogs. J Am Vet Med Assoc 230(11): 1641–1644", url: "https://doi.org/10.2460/javma.230.11.1641" },
  "Q8": { voll: "Bauer JE (2006): Metabolic basis for the essential nature of fatty acids and the unique dietary fatty acid requirements of cats. J Am Vet Med Assoc 229(11): 1729–1732", url: "https://doi.org/10.2460/javma.229.11.1729" },
  "Q9": { voll: "Pion PD, Kittleson MD, Rogers QR, Morris JG (1987): Myocardial failure in cats associated with low plasma taurine: a reversible cardiomyopathy. Science 237(4816): 764–768", url: "https://doi.org/10.1126/science.3616607" },
  "Q10": { voll: "Schoenmakers I, Hazewinkel HAW, Voorhout G, et al. (2000): Effects of diets with different calcium and phosphorus contents on the skeletal development and blood chemistry of growing Great Danes. Vet Rec 147(23): 652–660", url: "https://pubmed.ncbi.nlm.nih.gov/11131552/" },
  "Q11": { voll: "Lauten SD (2006): Nutritional risks to large-breed dogs: from weaning to the geriatric years. Vet Clin North Am Small Anim Pract 36(6): 1345–1359", url: "https://doi.org/10.1016/j.cvsm.2006.09.003" },
  "Q12": { voll: "Becker N, Kienzle E, Dobenecker B (2012): Kalziummangel – bei wachsenden und ausgewachsenen Hunden ein Problem. Zwei Fallberichte. Tierärztl Prax Ausg K 40(2): 135–139", url: "https://doi.org/10.1055/s-0038-1623630" },
  "Q13": { voll: "Tomsa K, Glaus T, Hauser B, et al. (1999): Nutritional secondary hyperparathyroidism in six cats. J Small Anim Pract 40(11): 533–539", url: "https://doi.org/10.1111/j.1748-5827.1999.tb03015.x" },
  "Q14": { voll: "Dobenecker B, Reese S, Herbst S (2021): Effects of dietary phosphates from organic and inorganic sources on parameters of phosphorus homeostasis in healthy adult dogs. PLoS One 16(2): e0246950", url: "https://doi.org/10.1371/journal.pone.0246950" },
  "Q15": { voll: "German AJ (2006): The growing problem of obesity in dogs and cats. J Nutr 136(7): 1940S–1946S", url: "https://doi.org/10.1093/jn/136.7.1940S" },
  "Q16": { voll: "AAHA (2021): Nutrition and Weight Management Guidelines for Dogs and Cats (10-%-Regel für Leckerlis), wie in konzept.md [A]:", url: "https://www.aaha.org/wp-content/uploads/2021/06/new-2021-aaha-nutrition-and-weight-management-guidelines-with-ref.pdf" },
};

export const RISIKEN: Record<RisikoId, Risiko> = {
  "R-P-HUND-ADULT": {
    risiko: "Bekommt ein Hund dauerhaft zu wenig Eiweiß, kann er nach und nach Muskulatur abbauen, auch wenn er satt und zufrieden wirkt. Laut Fachliteratur erhöht das auf Dauer das Risiko, häufiger krank zu werden.",
    loesung: ["Wählen Sie ein Alleinfutter, das den FEDIAF-Mindestwert sicher erreicht, zum Beispiel aus unseren ", { a: "grün oder gelb bewerteten Tests", href: "/alleinfuttermittel-hund" }, "."],
    quellen: [{ id: "Q4", text: "Laflamme 2008" }, { id: "Q1", text: "FEDIAF 2025, Tab. III-3b" }],
  },
  "R-P-HUND-GERING": {
    risiko: "Hunde mit geringem Energiebedarf fressen weniger, deshalb muss jede Kalorie mehr Eiweiß liefern. Reicht es nicht, kann der Körper Muskulatur abbauen. Bei älteren Hunden steigt der Eiweißbedarf laut Studienlage sogar um etwa die Hälfte.",
    loesung: ["Achten Sie auf mehr Eiweiß je 1000 kcal; worauf es im Alter ankommt, lesen Sie in unserem Ratgeber ", { a: "Seniorenfutter für Hunde", href: "/blog/seniorenfutter-hund" }, "."],
    quellen: [{ id: "Q4", text: "Laflamme 2008" }, { id: "Q1", text: "FEDIAF 2025, S. 22 und Tab. III-3b" }],
  },
  "R-P-WELPE": {
    risiko: "Welpen bauen jeden Tag Muskeln, Organe und Knochen auf. Liefert das Futter zu wenig Eiweiß, kann das Wachstum gebremst werden.",
    loesung: ["Füttern Sie ein Alleinfutter, das ausdrücklich für Welpen oder das Wachstum gedacht ist; was dabei zählt, steht in unserem Ratgeber ", { a: "Welpenfutter: wie lange?", href: "/blog/welpenfutter-wie-lange" }, "."],
    quellen: [{ id: "Q1", text: "FEDIAF 2025, S. 22 (Total protein, Growth)" }, { id: "Q2", text: "NRC 2006, Kapitel Protein and Amino Acids" }],
  },
  "R-P-KATZE-ADULT": {
    risiko: "Katzen sind auf viel Eiweiß angewiesen. In einer Studie verloren Katzen bei knappem Eiweiß Muskelmasse, obwohl die üblichen Bilanzwerte noch unauffällig waren; das kann auf Dauer auch die Abwehrkräfte schwächen.",
    loesung: ["Prüfen Sie ein Futter mit mehr Eiweiß je 1000 kcal, besonders für Wohnungs- und kastrierte Katzen; getestete Katzenfutter finden Sie in unseren ", { a: "Tests", href: "/alleinfuttermittel-katze" }, "."],
    quellen: [{ id: "Q5", text: "Laflamme & Hannah 2013" }, { id: "Q1", text: "FEDIAF 2025, Tab. III-4b" }],
  },
  "R-P-KITTEN": {
    risiko: "Kitten wachsen sehr schnell und brauchen dafür mehr Eiweiß je Kalorie als erwachsene Katzen. Liefert das Futter zu wenig, kann das Wachstum gebremst werden.",
    loesung: ["Füttern Sie ein Futter für Kitten oder das Wachstum; mehr dazu in unserem Ratgeber ", { a: "Kittenfutter: wie lange?", href: "/blog/kittenfutter-wie-lange" }, "."],
    quellen: [{ id: "Q1", text: "FEDIAF 2025, Tab. III-4b" }, { id: "Q2", text: "NRC 2006, Kapitel Protein and Amino Acids" }],
  },
  "R-F-HUND": {
    risiko: "Fett liefert Energie und lebenswichtige Fettsäuren wie Linolsäure. Fehlen diese dauerhaft, kann das Fell stumpf und verfilzt werden und die Haut schuppen.",
    loesung: ["Wählen Sie ein Futter, das den Fett-Mindestwert erreicht. Ob genug essenzielle Fettsäuren drin sind, zeigt der Rohfettwert allein nicht; steht Linolsäure oder Omega-6 auf dem Etikett, hilft diese Angabe weiter."],
    quellen: [{ id: "Q7", text: "Kirby et al. 2007" }, { id: "Q1", text: "FEDIAF 2025, S. 23" }],
  },
  "R-F-WELPE": {
    risiko: "Welpen brauchen mehr Fett als erwachsene Hunde: für Energie und für Fettsäuren wie DHA, die sich in Gehirn und Netzhaut anreichern. Zu wenig davon kann Wachstum, Haut und Fell beeinträchtigen.",
    loesung: ["Füttern Sie ein Alleinfutter für Welpen oder das Wachstum; worauf Sie achten sollten, steht in unserem Ratgeber ", { a: "Welpenfutter: wie lange?", href: "/blog/welpenfutter-wie-lange" }, "."],
    quellen: [{ id: "Q1", text: "FEDIAF 2025, S. 23 (Omega-3 and 6, Growth)" }, { id: "Q7", text: "Kirby et al. 2007" }],
  },
  "R-F-KATZE": {
    risiko: "Katzen können bestimmte Fettsäuren wie Arachidonsäure kaum selbst bilden und müssen sie mit dem Futter aufnehmen. Fehlen sie dauerhaft, kann das Haut, Fell und weitere Körperfunktionen beeinträchtigen.",
    loesung: ["Prüfen Sie ein Futter mit mehr Rohfett je 1000 kcal; getestete Katzenfutter finden Sie in unseren ", { a: "Tests", href: "/alleinfuttermittel-katze" }, "."],
    quellen: [{ id: "Q8", text: "Bauer 2006" }, { id: "Q1", text: "FEDIAF 2025, S. 28" }],
  },
  "R-T-KATZE": {
    risiko: "Katzen können Taurin nicht in ausreichender Menge selbst bilden. Ein dauerhafter Mangel kann die Netzhaut der Augen und den Herzmuskel schädigen und die Fortpflanzung beeinträchtigen. Auf der Packung steht meist nur das zugesetzte Taurin, Fleisch und Fisch liefern zusätzlich etwas; ein Wert unter dem Mindestwert heißt deshalb nicht sicher, dass Ihre Katze zu wenig bekommt.",
    loesung: ["Wählen Sie ein Futter, das den Taurin-Mindestwert sicher erreicht; alles Wichtige steht in unserem Ratgeber ", { a: "Taurin für Katzen", href: "/blog/taurin-katze" }, "."],
    quellen: [{ id: "Q1", text: "FEDIAF 2025, S. 60 (7.3.2) und Tab. III-4a" }, { id: "Q9", text: "Pion et al. 1987" }],
  },
  "R-T-KATZE-NASS": {
    risiko: "Katzen können Taurin nicht in ausreichender Menge selbst bilden, und aus erhitztem Nassfutter kann die Katze weniger davon verwerten. Deshalb liegt der Mindestwert dort etwa zwei- bis zweieinhalbmal so hoch; ein dauerhafter Mangel kann Netzhaut und Herzmuskel schädigen. Auf der Packung steht meist nur das zugesetzte Taurin, Fleisch und Fisch liefern zusätzlich etwas; ein Wert unter dem Mindestwert heißt deshalb nicht sicher, dass Ihre Katze zu wenig bekommt.",
    loesung: ["Wählen Sie ein Nassfutter, das den Taurin-Mindestwert für Nassfutter sicher erreicht; mehr in unserem Ratgeber ", { a: "Taurin für Katzen", href: "/blog/taurin-katze" }, "."],
    quellen: [{ id: "Q1", text: "FEDIAF 2025, S. 27 (Taurine: Bioverfügbarkeit bei Nassfutter, Hickman et al. 1990/1992) und S. 60" }, { id: "Q9", text: "Pion et al. 1987" }],
  },
  "R-CA-HOCH-WELPE": {
    risiko: "Zu viel Calcium im Wachstum kann die Entwicklung des Skeletts stören, besonders bei großen Rassen. In Studien mit Doggen-Welpen führte ein Calcium-Überschuss zu Störungen an Wachstumsfugen und Knochen.",
    loesung: ["Wählen Sie ein Welpenfutter, das den Calcium-Höchstwert einhält, und geben Sie keine zusätzlichen Calcium-Präparate ohne Rücksprache mit Ihrer Tierarztpraxis."],
    quellen: [{ id: "Q1", text: "FEDIAF 2025, S. 24 (Calcium, Maximum for puppies)" }, { id: "Q10", text: "Schoenmakers et al. 2000" }, { id: "Q11", text: "Lauten 2006" }],
  },
  "R-CA-HOCH-HUND": {
    risiko: "Liegt Calcium über dem FEDIAF-Höchstwert, kann das die Aufnahme von Spurenelementen wie Zink und Kupfer verringern.",
    loesung: ["Vergleichen Sie mit einem Futter, das Calcium im empfohlenen Bereich hält, und verzichten Sie auf zusätzliche Mineralstoff-Präparate ohne tierärztlichen Rat."],
    quellen: [{ id: "Q1", text: "FEDIAF 2025, S. 24 (Calcium, Adult dogs) und S. 25 (Trace elements, General)" }],
  },
  "R-CA-NIEDRIG-WELPE": {
    risiko: "Bekommt ein Welpe zu wenig Calcium, kann sein Skelett nicht richtig mineralisieren. Ein Fallbericht beschreibt einen Welpen mit selbst zusammengestellter Ration, der sich nach mäßiger Belastung den Oberschenkel brach.",
    loesung: ["Füttern Sie ein vollständiges Welpen-Alleinfutter; bei selbst zusammengestellten Rationen lohnt eine Rationsberechnung in der Tierarztpraxis."],
    quellen: [{ id: "Q12", text: "Becker et al. 2012" }, { id: "Q1", text: "FEDIAF 2025, S. 24" }],
  },
  "R-CA-NIEDRIG-HUND": {
    risiko: "Auch erwachsene Hunde brauchen genug Calcium. Fehlt es über lange Zeit, kann der Körper Calcium aus den Knochen holen und das Skelett schwächen; das betrifft vor allem selbst zusammengestellte Rationen ohne Mineralstoffergänzung.",
    loesung: ["Prüfen Sie ein Alleinfutter mit vollständiger Mineralstoffangabe, zum Beispiel aus unseren ", { a: "Tests", href: "/alleinfuttermittel-hund" }, "."],
    quellen: [{ id: "Q12", text: "Becker et al. 2012" }, { id: "Q1", text: "FEDIAF 2025, Tab. III-3a" }],
  },
  "R-CA-NIEDRIG-KATZE": {
    risiko: "Bei zu wenig Calcium, oft zusammen mit viel Phosphor wie bei reiner Fleischfütterung, kann der Körper Calcium aus den Knochen lösen. Ein Fallbericht über sechs Katzen beschreibt brüchige Knochen bis hin zu Spontanbrüchen.",
    loesung: ["Füttern Sie ein Alleinfutter mit Calcium im FEDIAF-Bereich; bei Kitten ist das besonders wichtig."],
    quellen: [{ id: "Q13", text: "Tomsa et al. 1999" }, { id: "Q1", text: "FEDIAF 2025, Tab. III-4a" }],
  },
  "R-CAP-NIEDRIG-WELPE": {
    risiko: "Steht mehr Phosphor als Calcium im Futter, gerät das Gleichgewicht für den Knochenaufbau durcheinander. Im Wachstum kann das die Mineralisierung des Skeletts beeinträchtigen.",
    loesung: ["Wählen Sie ein Welpenfutter mit einem Calcium-Phosphor-Verhältnis von 1 : 1 bis 1,6 : 1 (kleine Rassen bis 1,8 : 1); mehr dazu in unserem Ratgeber ", { a: "Welpenfutter: wie lange?", href: "/blog/welpenfutter-wie-lange" }, "."],
    quellen: [{ id: "Q1", text: "FEDIAF 2025, Tab. III-3a und S. 25 (Phosphorus)" }, { id: "Q11", text: "Lauten 2006" }],
  },
  "R-CAP-NIEDRIG-HUND": {
    risiko: "Mehr Phosphor als Calcium kann den Calcium-Phosphor-Haushalt belasten. Bei stark umgekehrtem Verhältnis wurden bei erwachsenen Hunden nachteilige Wirkungen beschrieben.",
    loesung: ["Prüfen Sie ein Futter mit einem Verhältnis von 1 : 1 bis 2 : 1, zum Beispiel aus unseren ", { a: "Tests", href: "/alleinfuttermittel-hund" }, "."],
    quellen: [{ id: "Q1", text: "FEDIAF 2025, S. 25 (Phosphorus) und Tab. III-3a" }],
  },
  "R-CAP-NIEDRIG-KATZE": {
    risiko: "Liefert das Futter mehr Phosphor als Calcium, kann der Körper zum Ausgleich Calcium aus den Knochen holen. Ein Fallbericht über sechs Katzen beschreibt so brüchige Knochen.",
    loesung: ["Prüfen Sie ein Alleinfutter mit einem Verhältnis von 1 : 1 bis 2 : 1 (Kitten bis 1,5 : 1); getestete Katzenfutter finden Sie in unseren ", { a: "Tests", href: "/alleinfuttermittel-katze" }, "."],
    quellen: [{ id: "Q13", text: "Tomsa et al. 1999" }, { id: "Q1", text: "FEDIAF 2025, Tab. III-4a" }],
  },
  "R-CAP-HOCH-WELPE": {
    risiko: "Viel Calcium ohne passenden Phosphor kann im Wachstum die Knochenbildung stören. In einer Studie entwickelten Doggen-Welpen so rachitisähnliche Veränderungen am Skelett.",
    loesung: ["Wählen Sie ein Welpenfutter, dessen Verhältnis im FEDIAF-Bereich liegt, und geben Sie keine zusätzlichen Mineralstoffe ohne Rücksprache mit Ihrer Tierarztpraxis."],
    quellen: [{ id: "Q10", text: "Schoenmakers et al. 2000" }, { id: "Q1", text: "FEDIAF 2025, S. 24 und Tab. III-3a" }],
  },
  "R-CAP-HOCH": {
    risiko: "Ein Calcium-Überschuss gegenüber Phosphor kann die Verwertung von Spurenelementen wie Zink und Kupfer verringern.",
    loesung: ["Vergleichen Sie mit einem Futter, dessen Verhältnis im empfohlenen Bereich liegt, zum Beispiel aus unseren Tests für ", { a: "Hunde", href: "/alleinfuttermittel-hund" }, " oder ", { a: "Katzen", href: "/alleinfuttermittel-katze" }, "."],
    quellen: [{ id: "Q1", text: "FEDIAF 2025, S. 24 (Calcium, Adult dogs) und S. 25 (Trace elements, General)" }],
  },
  "R-PH-HOCH-HUND": {
    risiko: "Sehr viel Phosphor kann den Calcium-Phosphor-Haushalt belasten, besonders wenn er aus leicht löslichen Phosphat-Zusätzen stammt. FEDIAF nennt deshalb für erwachsene Hunde einen Höchstwert.",
    loesung: ["Wählen Sie ein Futter im empfohlenen Bereich; wo Phosphate auf dem Etikett stehen, zeigt unser Ratgeber ", { a: "Futterdeklaration richtig lesen", href: "/blog/futterdeklaration-richtig-lesen" }, "."],
    quellen: [{ id: "Q1", text: "FEDIAF 2025, S. 21 (Fußnote h) und S. 25 (Phosphorus)" }, { id: "Q14", text: "Dobenecker et al. 2021" }],
  },
  "R-PH-NIEDRIG": {
    risiko: "Phosphor ist neben Calcium der wichtigste Baustein von Knochen und Zähnen. Liegt er dauerhaft unter dem Mindestwert, kann das den Knochenstoffwechsel beeinträchtigen, im Wachstum ganz besonders.",
    loesung: ["Prüfen Sie die Eingabe und vergleichen Sie mit einem Alleinfutter, das den Mindestwert erreicht."],
    quellen: [{ id: "Q1", text: "FEDIAF 2025, Tab. III-3a und III-4a" }, { id: "Q2", text: "NRC 2006, Kapitel Minerals" }],
  },
  "R-ASCHE-HOCH": {
    risiko: "Viel Rohasche heißt viele Mineralstoffe, oft aus Knochen. Das ist für sich kein Schaden, kann aber mit sehr viel Calcium und Phosphor einhergehen. In einer Untersuchung lagen 30 Hunde-Trockenfutter bei 4,8 bis 9,9 % der Trockenmasse.",
    loesung: ["Tragen Sie Calcium und Phosphor ein, dann prüft der Rechner das Verhältnis mit; mehr in unserem Ratgeber ", { a: "Rohasche im Futter", href: "/blog/rohasche-im-futter" }, "."],
    quellen: [{ id: "Q6", text: "Kazimierska et al. 2020" }],
  },
  "R-ASCHE-NIEDRIG": {
    risiko: "Sehr wenig Rohasche ist ungewöhnlich. Sie kann auf einen Tippfehler hindeuten oder darauf, dass wenig Mineralstoffe drin sind, und zu wenig Calcium kann auf Dauer den Knochen schaden.",
    loesung: ["Prüfen Sie die Eingabe und tragen Sie Calcium und Phosphor ein; Hilfe dazu gibt unser Ratgeber ", { a: "Rohasche im Futter", href: "/blog/rohasche-im-futter" }, "."],
    quellen: [{ id: "Q6", text: "Kazimierska et al. 2020" }, { id: "Q12", text: "Becker et al. 2012" }],
  },
  "R-FASER-HUND": {
    risiko: "Bei sehr faserreichem Hundefutter unterschätzt die Standardformel die Energie. Die berechnete Tagesmenge kann dann zu hoch sein, und dauerhaft zu reichliches Füttern erhöht das Risiko für Übergewicht.",
    loesung: ["Tragen Sie die Energieangabe des Herstellers ein, falls vorhanden, und wiegen Sie Ihren Hund alle zwei bis vier Wochen."],
    quellen: [{ id: "Q1", text: "FEDIAF 2025, S. 50 (Hinweis zu Rohfaser > 8 % TS)" }, { id: "Q15", text: "German 2006" }],
  },
  "R-MENGE-HUND": {
    risiko: "Auch ein kleines Zuviel am Tag summiert sich über die Jahre. In einer Langzeitstudie mit 48 Labrador Retrievern lebten Hunde, die ein Leben lang 25 % weniger Futter bekamen als ihr Vergleichspartner, im Median 1,8 Jahre länger (13,0 statt 11,2 Jahre).",
    loesung: ["Starten Sie mit der berechneten Menge, wiegen Sie Ihren Hund alle zwei bis vier Wochen und passen Sie an; Schritt für Schritt erklärt in ", { a: "Futtermenge Hund berechnen", href: "/blog/futtermenge-hund-berechnen" }, "."],
    quellen: [{ id: "Q3", text: "Kealy et al. 2002" }, { id: "Q1", text: "FEDIAF 2025, S. 43" }],
  },
  "R-MENGE-WELPE": {
    risiko: "Überfütterung beschleunigt das Wachstum und kann besonders bei großen Rassen Skelettprobleme begünstigen. FEDIAF rät deshalb, Welpen nie zur freien Verfügung zu füttern.",
    loesung: ["Teilen Sie die Tagesmenge auf mehrere Mahlzeiten auf und gleichen Sie das Gewicht regelmäßig mit der Wachstumskurve ab."],
    quellen: [{ id: "Q1", text: "FEDIAF 2025, S. 55" }, { id: "Q11", text: "Lauten 2006" }],
  },
  "R-MENGE-KATZE": {
    risiko: "Kastrierte Katzen setzen leichter Fett an. Übergewicht ist bei Katzen weit verbreitet und erhöht das Risiko für Folgeerkrankungen.",
    loesung: ["Starten Sie mit der berechneten Menge, wiegen Sie Ihre Katze regelmäßig und passen Sie an; mehr in ", { a: "Futtermenge Katze", href: "/blog/futtermenge-katze" }, "."],
    quellen: [{ id: "Q1", text: "FEDIAF 2025, S. 43" }, { id: "Q15", text: "German 2006" }],
  },
  "R-LECKERLI": {
    risiko: "Leckerlis und Ergänzungsfutter sollten höchstens 10 % der täglichen Kalorien liefern. Mehr kann das Hauptfutter aus dem Gleichgewicht bringen und zu Übergewicht beitragen.",
    loesung: ["Halten Sie sich an das berechnete Leckerli-Budget und ziehen Sie größere Mengen von der Hauptmahlzeit ab; Tipps in ", { a: "Wie viele Leckerlis am Tag?", href: "/blog/wie-viele-leckerlis-am-tag" }, "."],
    quellen: [{ id: "Q16", text: "AAHA 2021" }, { id: "Q15", text: "German 2006" }],
  },
};
