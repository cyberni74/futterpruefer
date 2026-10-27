# Futter-Rechner: Bewertung v2 („Scoring v2“)

Stand: 27.10.2026 · Status: **Vorschlag zur Umsetzung**, Kollagen-Hinweistext **Entwurf, Rechtsprüfung offen**
Referenz: `docs/futterrechner/rechner.py` (v2), `testfaelle.py` (17 Sollwerte), `kalibrierung_v2.py`, `rechner_v1.py` (v1 eingefroren, nur zum Vergleich)
Anlass: Manni, 27.10.2026: „Das Protein-Fett-Verhältnis braucht mehr Gewicht … fast jedes Futter hat 90–100 %.“

## 1. Ursache (Befund v1)

v1 ist ein **Mindestwert-Check**, keine Bewertung der Zusammensetzung. Protein (35) und Fett (20) bekommen volle Punkte, sobald sie das 1,3- bzw. 1,2-Fache des FEDIAF-Minimums je 1000 kcal erreichen. Das schafft praktisch jedes Alleinfutter: Die 38 realen Futter liegen beim Fett beim 1,4- bis 5,2-Fachen. Das Verhältnis von Protein zu Fett, die Energieverteilung und die Kohlenhydrate (NfE) gehen gar nicht ein. Plausibilität (15) und Ca/P (20) sind fast immer voll. Ergebnis: 55 von 55 Protein-/Fettpunkten für fast alle, Spreizung nur über fehlende Werte.

**v1 auf 38 realen Futtern** (Futterprüfer-Testdaten, 27 Hund, 11 Katze, nass und trocken, günstig bis Premium): Ø 93,8 Punkte, 36 von 38 (95 %) ≥ 80, 30 ≥ 90. Darunter nur zwei Katzen-Trockenfutter (65 mit Protein-Deckel, 72).

## 2. Neue Formel (v2), Kern

Gleich bleiben: Energie (NRC 2006), Bedarf, Bedarfsspalten, FEDIAF-Mindestwerte, alle v1-Deckel (Protein/Fett < 90 % → höchstens „mangelhaft“, < 100 % → höchstens „ausreichend“; ohne Ca/P höchstens „gut“; Ca über Maximum → „ausreichend“, bei Welpen „mangelhaft“; Ca/P 0 Punkte bei Welpen → „ausreichend“), `NOTEN`-Wörter und `NOTEN_SCHWELLEN` (90/80/70/60). **Keine** neuen Deckel, insbesondere keiner für hohes Protein und keiner für Taurin.

| Kriterium | Hund | Katze | Regel |
|---|---|---|---|
| **1 Protein:Fett-Verhältnis (g:g)** | **35** | **35** | linear: 0 Punkte bei P:F ≤ 1,0, volle Punkte ab Hund 2,9 / Katze 2,75 |
| 2 Protein-Energieanteil (Atwater 3,5/8,5/3,5) | 15 | 15 | unter FEDIAF-Minimum (in Energie-%) 0; ab Minimum 50 % der Punkte, linear bis voll bei Hund 30 % / Katze 52 % |
| 3 Protein ≥ FEDIAF-Minimum | 10 | 10 | ≥ 1,0-fach 10; ≥ 0,9-fach 5; sonst 0 (+ v1-Deckel) |
| 4 Fett ≥ FEDIAF-Minimum | 5 | 5 | ≥ 1,0-fach 5; ≥ 0,9-fach 2,5; sonst 0 (+ v1-Deckel) |
| 5 NfE (Kohlenhydrate) % TS | 5 | 10 | voll bis Hund 35 / Katze 15 %, 0 ab Hund 55 / Katze 40 %, linear |
| 6 Calcium/Phosphor | 20 | 20 | wie v1 (20/10/0); fehlt → zählt nicht, Note höchstens „gut“ |
| 7 Taurin | – | 10 | wie v1, nur wenn angegeben, kein Deckel |
| 8 Plausibilität | 10 | 10 | −2 Feuchte geschätzt, −3 Asche außerhalb 3–12 % TS, −3 Rohfaser Hund > 8 % TS |
| **Summe max.** | **100** | **115** | Score = Punkte / max × 100 |
| **Kollagen-Heuristik** | Abzug | Abzug | vom Score nach der Normierung, **kein Deckel** (Abschnitt 4) |

Damit hängen beim Hund 55 von 100 Punkten (55 %), bei der Katze 60 von 115 (52 %) an der Energieverteilung (P:F, Protein-Energie, NfE). In v1 waren es 0. Das Protein-Fett-Verhältnis ist mit 35 das stärkste Einzelkriterium.

Rundung (wie TypeScript `Math.round`): Teilpunkte auf 0,1 (`r1(x)=Math.round(x*10)/10`), Score ganzzahlig. Python nutzt dafür `floor(x+0,5)`, nicht `round()`.

### Begründung der Bänder (Quellen)

- **Untergrenze P:F 1,0**: Bei 1 g Protein je g Fett kommen (ohne NfE) 29 % der Energie aus Protein und 71 % aus Fett. Hunde wählen bei freier Wahl etwa 30 : 63 : 7 % Energie (P : F : KH) und fressen dabei mehr als das Doppelte ihres Erhaltungsbedarfs (Hewson-Hughes et al. 2013, Behav Ecol 24:293, doi:10.1093/beheco/ars168). Ein Futter auf diesem Niveau ist also schmackhaft, aber energie- und fettlastig.
- **Obergrenze Hund 2,9**: Energieverteilung der Wolfsbeute 54 : 45 : 1 % (Bosch et al. 2015, Br J Nutr, doi:10.1017/S0007114514002311) → (54/3,5)/(45/8,5) = 2,91 g Protein je g Fett.
- **Obergrenze Katze 2,75**: Beute verwilderter Katzen 62,7 % Rohprotein, 22,8 % Rohfett, 2,8 % NfE in der TS, 52 : 46 : 2 % Energie (Plantinga et al. 2011, Br J Nutr, doi:10.1017/S0007114511002285) → 62,7/22,8 = 2,75.
- **Protein-Energieziel**: Hund 30 % (Hewson-Hughes et al. 2013), Katze 52 % (Hewson-Hughes et al. 2011, J Exp Biol 214:1039, doi:10.1242/jeb.049429; Plantinga et al. 2011). Die Untergrenze ist das jeweilige FEDIAF-Minimum, nur in Energie-% umgerechnet (g/1000 kcal × 3,5 / 10). Wer das Minimum erfüllt, bekommt schon die Hälfte (Sockel), damit die Note nicht zu hart fällt.
- **NfE**: FEDIAF nennt kein Minimum für Kohlenhydrate. Die Beute liefert bei der Katze unter 3 % NfE (Plantinga 2011), beim Wolf 1 % der Energie. Das Band ist bewusst weit (eigene Festlegung) und beim Hund nur 5 Punkte schwer, weil Hunde Stärke gut verwerten.
- **Fett-Obergrenze**: NRC (2006) nennt für den Hund eine sichere Obergrenze von 82,5 g Fett/1000 kcal. Sie dient hier nur als Plausibilitätsanker (T9 liegt mit 72 g knapp darunter und wird trotzdem durch P:F abgewertet), nicht als Kriterium.
- **Kein Protein-Deckel**: T10 (45 % Rohprotein) erreicht 100 Punkte. Hohes Protein wird nicht bestraft (Mannis Vorgabe).

## 3. Verteilung vorher/nachher

Farbzuordnung für die Ziel-Spreizung: grün = ≥ 80 („gut“/„sehr gut“), gelb = 70–79 („befriedigend“), orange = 60–69 („ausreichend“, im Gauge das dunklere Mittelsegment), rot = < 60 („mangelhaft“). Die Ampel in `fazit-texte.ts` (grün ≥ 80, gelb 60–79, rot < 60) bleibt unverändert.

**Erwachsener Hund 20 kg normal aktiv / Wohnungskatze 4,5 kg kastriert (38 Futter):**

| Version | Ø | Spanne | ≥ 90 | grün ≥ 80 | gelb 70–79 | orange 60–69 | rot < 60 |
|---|---|---|---|---|---|---|---|
| v1 | 93,8 | 65–100 | 30 | **36 (95 %)** | 1 (3 %) | 1 (3 %) | 0 |
| v2 nur Nährwerte | 73,1 | 56–96 | 3 | **8 (21 %)** | **17 (45 %)** | 10 (26 %) | 3 (8 %) |
| v2 + Feld „Erste Zutaten“ | 72,6 | 56–94 | 2 | **7 (18 %)** | **17 (45 %)** | 11 (29 %) | 3 (8 %) |

Noten v2 (nur Nährwerte): 1 × sehr gut, 7 × gut, 17 × befriedigend, 10 × ausreichend, 3 × mangelhaft (v1: 12 × sehr gut, 24 × gut, 1 × ausreichend, 1 × mangelhaft).

**Robustheit, andere Tierprofile (nur Nährwerte, grün/gelb/orange/rot):**

| Profil | v1 | v2 |
|---|---|---|
| Hund Senior 25 kg kastriert (adult95), 27 Futter | 26/1/0/0 | 4/14/8/1 |
| Welpe 17 Wochen, Endgewicht 30 kg, 27 Futter | 24/2/1/0 | 3/15/7/2 |
| Katze Freigang (adult100), 11 Futter | 11/0/0/0 | 4/4/2/1 |

Bei Senior und Welpe ist v2 strenger, weil das FEDIAF-Protein-Minimum höher liegt (bei Welpen erwartbar, Adult-Futter verlieren dort ohnehin an Ca/P).

**Was rot wird (nur Nährwerte):** ein Hunde-Nassfutter (P:F 1,11, 64 % der Energie aus Fett), ein Katzen-Trockenfutter (Protein unter dem Minimum, schon in v1 „mangelhaft“) und ein Katzen-Nassfutter (P:F 1,24). **Rechtlicher Hinweis:** Die beiden Nassfutter erfüllen alle FEDIAF-Minima. „Mangelhaft“ entsteht hier allein aus der eigenen Gewichtung (fettlastige Energieverteilung). Das ist methodisch begründet, aber eine eigene Wertung. Option, falls die Rechtsprüfung das verlangt: Score-Boden 60 („ausreichend“), solange alle FEDIAF-Minima erfüllt und kein Ca-Deckel greift. Damit würde „mangelhaft“ nur bei echten Defiziten vergeben (Verteilung dann 21/45/32/3 %). Nicht eingebaut, Entscheidung offen.

**Abgleich mit den Futterprüfer-Testnoten:** Die Korrelation von Rechner-Score und Test-Gesamtnote ist bei v1 r = 0,23 und bei v2 r = −0,32. Das ist erwartbar und kein Fehler: Die Tests bewerten Zutaten, Zusatzstoffe und Deklaration, der Rechner nur die Analysewerte. Beispiel: Zwei Katzen-Nassfutter mit schwachen Testnoten (Nr. 1 und 3) haben sehr wenig Fett und dadurch ein „ideales“ P:F. Die Kollagen-Heuristik zieht bei Nr. 3 6 Punkte ab (mit Zutaten 8), bei Nr. 1 nur 1 (mit Zutaten 3). Beide bleiben „gut“. Das muss der Wortlaut auffangen: „Note nach den Nährwerten, kein Testurteil“ (steht schon so im Rechner).

## 4. Kollagen-Heuristik (zwei Stufen)

Ziel: Hinweis, dass hohes Rohprotein bei hoher Rohasche oft aus Knochen, Knorpel, Haut oder Sehnen stammt, also zum Teil aus Kollagen mit geringer Proteinqualität. Rohprotein = Stickstoff × 6,25, die Analyse unterscheidet das nicht.

**Stufe 1, immer aktiv, nur Nährwerte**
- Bedingung: Rohprotein TS ≥ 25 % (Hund) bzw. ≥ 30 % (Katze) **und** Rohasche TS > 10 %.
- Abzug = `Math.round(lin(AscheTS; 10; 14) × 6)` Punkte (10 % → 0, 12 % → 3, ab 14 % → 6), zusätzlich 2 Punkte, wenn Ca TS > 2,0 %. Höchstens 8.
- Kalibrierung: Bei den 38 Futtern liegen 31 unter 10 % Asche TS. Darüber liegen 8 Futter mit 10,1 bis 13,9 %, 6 davon Nassfutter. Bei den meisten nennt die Zutatenliste „tierische Nebenerzeugnisse“. Mittel bei Hunde-Trockenfutter laut Kazimierska et al. (2020) 7,1 % TS (Spanne 4,8–9,9).
- Getroffen: 7 von 38, Abzug 1 bis 6.

**Stufe 2, nur mit dem optionalen Feld „Erste Zutaten (optional)“**
- Liste an Komma/Semikolon auf oberster Ebene trennen (Klammerinhalt gehört zum Bestandteil), die ersten 5 Positionen prüfen, Kleinschreibung.
- Stark (kollagenreich), je 1. Treffer 4, jeder weitere starke Begriff +2: `kollagen, gelatine, knorpel, haut\b, häute, schwarte, feder(n|mehl|hydrolysat)?\b, sehne, luftröhre, grieben, knochenmehl, tiermehl, schlachtabf`.
- Schwach (Sammelbegriff, Herkunft offen), einmalig 2: `nebenerzeugnis`; `hydrolys…` nur, wenn die Position „protein“ oder „tier“ enthält und nicht „leber, hefe, fisch, pflanz, soja, reis, weizen, mais, erbs, kartoffel“ (z. B. „hydrolysierte Tierproteine“ ja, „hydrolysierte Hühnerleber“ oder „Hefehydrolysat“ nein).
- Höchstens 6. Gesamtabzug aus beiden Stufen also höchstens 14.
- Getroffen: 9 von 38 (7 × „Nebenerzeugnisse“ −2, 1 × „hydrolysierte Tierproteine“ −2, 1 × „Schlund und Luftröhren“ −4).

**Wirkung je Futter:** siehe Tabelle in Abschnitt 6 (Spalten „Stufe 1“ und „Stufe 2“). Grün sinkt mit Zutaten von 8 auf 7 (Nr. 8: 80 → 78), orange steigt von 10 auf 11 (Nr. 23: 71 → 69).

**Wortlaut-Regel:** Ohne Zutatenfeld heißt es immer „nach den Nährwerten“. Kein Text darf andeuten, dass Zutaten geprüft wurden (`zutatenGeprueft = false`). Mit Feld nur: „in den ersten fünf Zutaten, die Sie eingegeben haben“.

### Hinweistext (Entwurf, Rechtsprüfung offen)

Aufbau nach „Risiko-Marketing belegt“: Problem → Folge mit Quelle → Lösung → Entlastung.

**K1, Stufe 1 (nur Nährwerte), Titel: „Hinweis zur Proteinqualität (nach den Nährwerten)“**
> Ihr Futter hat viel Rohprotein ({p} % der Trockenmasse) und zugleich viel Rohasche ({a} %). Diese Kombination entsteht oft, wenn ein Teil des Eiweißes aus Knochen, Knorpel, Haut oder Sehnen stammt. Dieses Bindegewebe-Eiweiß (Kollagen) enthält kein Tryptophan, eine essenzielle Aminosäure. Für sich allein hat es deshalb eine Proteinqualität (PDCAAS) von null (Paul et al. 2019). In Fleischknochenmehl sinkt der Gehalt an essenziellen Aminosäuren je Gramm Rohprotein mit steigendem Aschegehalt (Shirley & Parsons 2001). Die Analyse auf der Packung kann das nicht unterscheiden, denn „Rohprotein“ zählt jedes Eiweiß gleich. Das ist eine Schätzung nach den Nährwerten, keine Aussage über die Zutaten. **Was Sie tun können:** Prüfen Sie, ob in der Zutatenliste Fleisch oder Innereien mit Prozentangabe vorne stehen. Tragen Sie die ersten Zutaten oben ein, dann wird der Hinweis genauer.

**K2, Stufe 2 (mit Zutatenfeld), Titel: „Hinweis zur Proteinqualität (nach Ihren Zutatenangaben)“**
> In den ersten fünf Zutaten, die Sie eingegeben haben, steht „{treffer}“. Solche Bestandteile können viel Bindegewebe-Eiweiß (Kollagen) liefern. Kollagen enthält kein Tryptophan und hat für sich allein eine Proteinqualität (PDCAAS) von null (Paul et al. 2019). Tierische Mehle aus Schlachtnebenprodukten haben oft eine geringere Proteinqualität als frische Rohstoffe (Cramer et al. 2007). Im Mischfutter wird das teilweise durch anderes Eiweiß ausgeglichen. **Was Sie tun können:** Ein Futter wählen, das Fleisch oder Innereien mit Prozentangabe an erster Stelle nennt.

**K2-Zusatz bei Sammelbegriff („Nebenerzeugnisse“, „hydrolysierte Tierproteine“):**
> „Tierische Nebenerzeugnisse“ ist ein Sammelbegriff. Er kann wertvolle Innereien wie Leber oder Herz ebenso umfassen wie Haut, Knorpel oder Sehnen. Welcher Anteil es ist, verrät die Deklaration nicht.

Quellen für den Quellenblock:
- Paul C, Leser S, Oesser S (2019): Significant Amounts of Functional Collagen Peptides Can Be Incorporated in the Diet While Maintaining Indispensable Amino Acid Balance. Nutrients 11(5):1079. doi:10.3390/nu11051079
- Shirley RB, Parsons CM (2001): Effect of ash content on protein quality of meat and bone meal. Poultry Science 80(5):626–632. doi:10.1093/ps/80.5.626 (PubMed 11372713). Dort auch: Knochenprotein besteht zu etwa 83 % aus Kollagen.
- Cramer KR, Greenwood MW, Moritz JS, Beyer RS, Parsons CM (2007): Protein quality of various raw and rendered by-product meals commonly incorporated into companion animal diets. J Anim Sci 85(12):3285–3293. doi:10.2527/jas.2006-225
- Kazimierska K, Biel W, Witkowicz R (2020): Mineral composition of cereal and cereal-free dry dog foods versus nutritional guidelines. Molecules 25(21):5173. doi:10.3390/molecules25215173

Offene Punkte für die Rechtsprüfung: (1) „PDCAAS null“ gilt für isoliertes Kollagen, nicht für ein Mischfutter. Der Text sagt deshalb „für sich allein“ und „teilweise ausgeglichen“. (2) Kein Produkt- oder Herstellerbezug im Text. (3) Shirley & Parsons und Cramer et al. stammen aus Geflügel- bzw. Futtermittelstudien, nicht aus Fütterungsversuchen mit Hund oder Katze. Bis zur Freigabe zeigt der Rechner nur den neutralen Hinweis „Viel Rohprotein bei viel Rohasche: Ein Teil des Eiweißes kann aus Bindegewebe stammen (Schätzung nach den Nährwerten).“

## 5. Testfälle (Sollwerte, `testfaelle.py`)

| Fall | Kurz | Punkte (pf/pe/pmin/fmin/nfe/capr/taurin/plaus) | Score | Note | Kollagen S1/S2 |
|---|---|---|---|---|---|
| T1 | Hund adult trocken 25/14 | 14,5/12,3/10/5/2,2/20/–/10 | 74 | befriedigend | 0/0 |
| T2 | Hund nass, kastriert, wenig aktiv | 9,2/15/10/5/5/20/–/10 | 74 | befriedigend | 0/0 |
| T3 | Welpe 17 Wo., Welpenfutter | 11,9/13,1/10/5/4/20/–/10 | 74 | befriedigend | 0/0 |
| T3b | Welpe mit T1-Futter | 14,5/11,9/10/5/2,2/20/–/10 | 74 | befriedigend | 0/0 |
| T4 | Senior, Feuchte fehlt, kein Ca/P | 22,1/10,7/10/5/0,3/–/–/8 | 70 | befriedigend | 0/0 |
| T5 | Katze nass Wohnung | 20/12,1/10/5/10/20/10/10 | 84 | gut | 0/0 |
| T6 | Kitten trocken | 14/9,2/10/5/3,6/20/10/10 | 71 | befriedigend | 0/0 |
| T7 | knappes Futter (Deckel) | 35/0/5/5/0/0/–/10 | 55 | mangelhaft | 0/0 |
| T9 | **fettreich nass Hund, P:F 1,1** | 2/14,7/10/5/5/20/–/10 | 67 | ausreichend | 0/0 |
| T10 | **45 % Protein, kein Deckel** | 35/15/10/5/5/20/–/10 | 100 | sehr gut | 0/0 |
| T11 | **Asche 13,9 % TS, Ca 2,3 % TS, ohne Zutaten** | 35/15/10/5/10/20/10/7 | 89 | gut | 8/0 |
| T12 | T11 + „Fleisch und tierische Nebenerzeugnisse …“ | wie T11 | 87 | gut | 8/2 |
| T13 | Luftröhre + Rinderknorpel in Top 5, kein Ca/P | 16,7/15/10/5/5/–/–/10 | 71 | befriedigend | 0/6 |
| T14 | Gelatine erst an Position 6, Komma in Klammer | wie T13 | 77 | befriedigend | 0/0 |
| T15 | Asche 12 % TS, Ca 2,3 % TS | 21,5/13,8/10/5/3/20/–/7 | 75 | befriedigend | 5/0 |
| T16 | hydrolysierte Hühnerleber, Hefehydrolysat | 15,8/12,8/10/5/2,5/20/–/10 | 76 | befriedigend | 0/0, geprüft = ja |
| T17 | Feld nur Leerzeichen | wie T16 | 76 | befriedigend | 0/0, geprüft = nein |

T8 (Snack) unverändert, keine Note.

## 6. Alle 38 Futter: v1 → v2, vor und nach der Kollagen-Heuristik

„v2 Basis“ = Score ohne Kollagen-Abzug. „Stufe 1“ = Abzug nach Nährwerten (immer). „v2 Nährwerte“ = so, wie der Rechner ohne Zutatenfeld urteilt. „Stufe 2“ = zusätzlicher Abzug mit eingetragener Zutatenliste (hier aus der Testdatenbank, erste 5 Positionen). Energie P/F/KH = Anteil an der Energie nach Atwater. Profile wie in Abschnitt 3. Die Futter sind anonymisiert (H/K = Hund/Katze, N/T = nass/trocken). Die Zuordnung zu Produkten liegt nur intern vor, damit Rechner-Noten nicht als Produkturteil gelesen werden.

| # | Futter (anonym) | Tier/Typ | Preis | v1 | v2 Basis | Stufe 1 (Nährwerte) | **v2 Nährwerte** | Stufe 2 (Zutaten) | **v2 + Zutaten** | P:F | Energie P/F/KH % | Asche TS % |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | K-N-01 | katze nass | mittel | 100 gut | 96,9 | −1 | **96 gut** | −2 (nebenerzeugnis) | **94 gut** | 3,33 | 48/35/16 | 10,8 |
| 2 | H-T-02 | hund trocken | premium | 94 sehr gut | 92,1 | – | **92 sehr gut** | – | **92 sehr gut** | 3,29 | 27/20/54 | 7,4 |
| 3 | K-N-03 | katze nass | guenstig | 93 gut | 96,5 | −6 | **90 gut** | −2 (nebenerzeugnis) | **88 gut** | 4,78 | 59/30/11 | 13,9 |
| 4 | H-T-04 | hund trocken | guenstig | 100 sehr gut | 83,1 | – | **83 gut** | – | **83 gut** | 2,44 | 23/23/54 | 7,1 |
| 5 | H-T-05 | hund trocken | mittel | 94 sehr gut | 82,9 | – | **83 gut** | – | **83 gut** | 2,40 | 26/26/48 | 6,7 |
| 6 | K-N-06 | katze nass | mittel | 100 sehr gut | 82,7 | – | **83 gut** | – | **83 gut** | 2,00 | 42/51/6 | 8,2 |
| 7 | H-N-07 | hund nass | premium | 100 gut | 80,4 | – | **80 gut** | – | **80 gut** | 2,05 | 45/53/2 | 8,2 |
| 8 | K-T-08 | katze trocken | guenstig | 80 gut | 79,5 | – | **80 gut** | −2 (nebenerzeugnis) | **78 befriedigend** | 2,61 | 31/29/39 | 10,1 |
| 9 | H-T-09 | hund trocken | guenstig | 100 sehr gut | 78,9 | – | **79 befriedigend** | – | **79 befriedigend** | 2,00 | 26/32/42 | 7,8 |
| 10 | H-N-10 | hund nass | premium | 100 gut | 78,9 | – | **79 befriedigend** | – | **79 befriedigend** | 1,98 | 44/53/3 | 7,7 |
| 11 | H-T-11 | hund trocken | guenstig | 94 sehr gut | 78,6 | – | **79 befriedigend** | −2 (nebenerzeugnis) | **77 befriedigend** | 2,33 | 22/23/54 | 7,8 |
| 12 | H-N-12 | hund nass | premium | 100 gut | 78,5 | – | **78 befriedigend** | – | **78 befriedigend** | 1,97 | 44/54/2 | 8,6 |
| 13 | H-N-13 | hund nass | premium | 100 gut | 77,9 | – | **78 befriedigend** | – | **78 befriedigend** | 1,94 | 43/54/2 | 7,7 |
| 14 | H-N-14 | hund nass | guenstig | 100 gut | 79,2 | −1 | **78 befriedigend** | −2 (nebenerzeugnis) | **76 befriedigend** | 2,00 | 42/51/7 | 10,5 |
| 15 | H-N-15 | hund nass | premium | 100 gut | 77,9 | – | **78 befriedigend** | −4 (luftröhre) | **74 befriedigend** | 1,94 | 43/54/2 | 7,7 |
| 16 | H-T-16 | hund trocken | premium | 100 gut | 75,8 | – | **76 befriedigend** | – | **76 befriedigend** | 2,33 | 22/23/54 | 8,7 |
| 17 | H-T-17 | hund trocken | mittel | 100 sehr gut | 73,5 | – | **74 befriedigend** | – | **74 befriedigend** | 1,81 | 24/32/44 | 7,8 |
| 18 | H-N-18 | hund nass | premium | 100 gut | 74,1 | – | **74 befriedigend** | – | **74 befriedigend** | 1,77 | 37/51/12 | 9,6 |
| 19 | K-N-19 | katze nass | guenstig | 93 gut | 74,6 | −1 | **74 befriedigend** | −2 (nebenerzeugnis) | **72 befriedigend** | 1,88 | 40/51/9 | 10,5 |
| 20 | H-T-20 | hund trocken | mittel | 94 sehr gut | 73,2 | – | **73 befriedigend** | – | **73 befriedigend** | 2,05 | 22/26/51 | 6,4 |
| 21 | H-T-21 | hund trocken | mittel | 89 gut | 71,8 | – | **72 befriedigend** | – | **72 befriedigend** | 2,00 | 21/26/53 | 8,3 |
| 22 | H-N-22 | hund nass | mittel | 100 gut | 71,4 | – | **71 befriedigend** | – | **71 befriedigend** | 1,66 | 37/54/9 | 9,0 |
| 23 | H-N-23 | hund nass | guenstig | 100 sehr gut | 71,9 | −1 | **71 befriedigend** | −2 (nebenerzeugnis) | **69 ausreichend** | 1,38 | 35/62/3 | 10,9 |
| 24 | H-T-24 | hund trocken | mittel | 94 sehr gut | 69,9 | – | **70 befriedigend** | – | **70 befriedigend** | 1,62 | 25/37/37 | 7,4 |
| 25 | K-T-25 | katze trocken | mittel | 86 gut | 70,4 | – | **70 befriedigend** | – | **70 befriedigend** | 1,94 | 31/39/30 | 6,8 |
| 26 | K-N-26 | katze nass | premium | 94 sehr gut | 67,9 | – | **68 ausreichend** | – | **68 ausreichend** | 1,33 | 35/65/0 | 8,7 |
| 27 | H-T-27 | hund trocken | premium | 93 gut | 65,9 | – | **66 ausreichend** | – | **66 ausreichend** | 2,00 | 22/26/52 | 10,0 |
| 28 | H-N-28 | hund nass | premium | 100 gut | 66,0 | – | **66 ausreichend** | – | **66 ausreichend** | 1,42 | 35/59/7 | 7,5 |
| 29 | K-N-29 | katze nass | guenstig | 94 sehr gut | 70,8 | −5 | **66 ausreichend** | – | **66 ausreichend** | 1,50 | 35/56/9 | 11,8 |
| 30 | H-T-30 | hund trocken | premium | 93 gut | 64,5 | – | **65 ausreichend** | −2 (hydrolysat) | **63 ausreichend** | 1,69 | 26/37/37 | 7,6 |
| 31 | K-T-31 | katze trocken | premium | 72 ausreichend | 63,5 | – | **64 ausreichend** | – | **64 ausreichend** | 1,78 | 31/42/28 | 9,1 |
| 32 | H-T-32 | hund trocken | premium | 86 gut | 62,9 | – | **63 ausreichend** | – | **63 ausreichend** | 1,95 | 20/25/55 | 9,4 |
| 33 | H-T-33 | hund trocken | guenstig | 93 gut | 62,6 | – | **63 ausreichend** | – | **63 ausreichend** | 1,62 | 25/38/37 | 8,3 |
| 34 | H-T-34 | hund trocken | mittel | 89 gut | 61,8 | – | **62 ausreichend** | – | **62 ausreichend** | 1,44 | 20/34/45 | 5,1 |
| 35 | H-T-35 | hund trocken | premium | 93 gut | 62,2 | −1 | **61 ausreichend** | – | **61 ausreichend** | 1,53 | 26/41/34 | 10,6 |
| 36 | H-N-36 | hund nass | guenstig | 100 gut | 58,1 | – | **58 mangelhaft** | – | **58 mangelhaft** | 1,11 | 29/64/7 | 8,3 |
| 37 | K-T-37 | katze trocken | mittel | 65 mangelhaft | 57,8 | – | **58 mangelhaft** | – | **58 mangelhaft** | 2,08 | 27/31/42 | 8,1 |
| 38 | K-N-38 | katze nass | guenstig | 81 gut | 56,4 | – | **56 mangelhaft** | – | **56 mangelhaft** | 1,24 | 31/62/7 | 8,8 |

## 7. Was sich für Nutzer ändert (Kurzfassung für Texte)

- Ein Futter, das die FEDIAF-Minima erfüllt, ist nicht mehr automatisch „sehr gut“. „Gut“ und besser gibt es, wenn auch die Energieverteilung stimmt: viel Protein im Verhältnis zum Fett.
- Fettreiche Futter (P:F um 1 : 1, mehr als 60 % der Energie aus Fett) landen bei „ausreichend“ oder darunter.
- Viel Protein wird nie bestraft.
- Neu und optional: Feld „Erste Zutaten (optional)“. Ohne Eintrag bleibt alles „nach den Nährwerten“.
