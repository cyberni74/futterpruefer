# Futterrechner: freigegebenes Konzept

## Freigabe & Entscheidungen

Freigegeben von Manni am 26.10.2026, 23:28 (Berlin). Diese Entscheidungen gehen dem Konzepttext unten vor:

- **URLs:** `/futterrechner` (Hub), `/futterrechner/hund`, `/futterrechner/katze`.
- **Erreichbarkeit:** nur die Teaser-Box auf der Startseite (direkt nach dem Hero). **Keine** Änderungen an Navigation, Bottom-Bar oder Hero; Grundlayout und Farben bleiben unverändert. Abschnitt 10.2 ist damit vorerst erledigt (nicht umsetzen).
- **Notenwörter:** „sehr gut / gut / befriedigend / ausreichend / mangelhaft“, **vorläufig** bis zur Freigabe durch die Rechtsprüfung. Die Wörter müssen über **eine einzige Konstante** austauschbar sein (Alternative: „stark / gut / solide / knapp / schwach“).
- **Teaser in veröffentlichten Blog-Beiträgen und Tests** (Abschnitt 10.3) wären DB-Änderungen: **nicht** Teil dieses Builds, kommen später nach eigener Freigabe.

Referenzimplementierung in diesem Ordner: `docs/futterrechner/rechner.py` und `docs/futterrechner/testfaelle.py` (im Konzept als `ref/…` bezeichnet; `ref/kalibrierung.py` und `data/` liegen nicht im Repo).

---

# Konzept: Futterrechner Hund & Katze (Futterprüfer.de)

Stand: 26.10.2026, 23:15 MEZ · Status: **nur Konzept** (nichts gebaut, nichts in die DB geschrieben, niemand kontaktiert)
Autor der Seite: Sebastian Kraft · Betreiber: Karpas Web Solutions Ltd.
Ablauf: Konzept → Designer (Claude-Code-Session) baut → Rechtsprüfung → Freigabe Manni → live.

Arbeitsdateien in diesem Ordner:
- `ref/rechner.py`: Referenzimplementierung in Python (Vorlage für das TS-Modul, alle Zahlen der Testfälle stammen daraus)
- `ref/testfaelle.py`: die Testfälle aus Abschnitt 9
- `ref/kalibrierung.py`: Rechner auf alle veröffentlichten Alleinfutter-Tests mit Analyse angewendet (Abschnitt 4.6)
- `data/suggest_2026-10-26.json`: Google-Autocomplete-Rohdaten

---

## 0. Kurzfassung

| Punkt | Entscheidung |
|---|---|
| URLs | `/futterrechner` (Hub) · `/futterrechner/hund` · `/futterrechner/katze` |
| Was der Rechner tut | Analysewerte vom Etikett → Trockenmasse, Energie (ME nach NRC 2006/FEDIAF), Tagesmenge, Protein und Fett je 1000 kcal gegen FEDIAF-Mindestwerte, Ca:P, Plausibilität → **Nährwert-Note** von „sehr gut“ bis „mangelhaft“ mit „Warum“-Liste |
| Was er nicht tut | Keine Aussage zur Rohstoffqualität, zu Schadstoffen oder zur Deklaration. Er ist **kein Testurteil**. Keine Note für Ergänzungsfutter und Snacks. |
| Notenschwellen | sehr gut ≥ 90 · gut 80–89 · befriedigend 70–79 · ausreichend 60–69 · mangelhaft < 60 Punkte (passend zu Grün ≥ 80 / Gelb 60–79 / Rot < 60). Dazu Deckel bei Unterschreitung von FEDIAF-Mindestwerten. |
| Technik | Reines Client-TypeScript, Vitest-Unit-Tests, keine DB, nichts gespeichert, Teilen-Link über `#`-Fragment |
| Bedienung | Schieberegler + Zahlenfeld, große Chips, Live-Ergebnis beim Schieben (Abschnitt 6) |
| Erreichbarkeit | Teaser-Box auf der Startseite direkt nach dem Hero, Teaser in 25 Beiträgen und allen Tests. Navigation und Bottom-Bar nur als **Vorschlag**. |

---

## 1. Eingaben

### 1.1 Felder

Alle Analysewerte in **% „wie gefüttert“**, also so, wie sie auf der Packung stehen.

| Feld | Pflicht | Einheit | Etikett-Hinweis (Tooltip „Wo steht das?“) |
|---|---|---|---|
| Tierart | ja | Hund / Katze | Durch die Seite vorbelegt, umschaltbar |
| Futterart | ja | Trocken / Nass / Snack | Trocken ≤ 14 % Feuchte, Nass ≥ 60 % (FEDIAF-Labelling-Code); halbfeucht automatisch dazwischen |
| Futtertyp | ja | Alleinfutter / Ergänzungsfutter | Steht vorn auf der Packung: „Alleinfuttermittel“ oder „Ergänzungsfuttermittel“ (Art. 3 VO (EG) 767/2009) |
| Rohprotein | ja | % | „Analytische Bestandteile“ bzw. „Inhaltsstoffe“, oft auch „Protein“ |
| Rohfett | ja | % | Auch „Fettgehalt“ |
| Rohfaser | ja | % | Auch „Rohfaser“ |
| Rohasche | ja | % | Auch „Ascherückstand“ oder „anorganischer Stoff“ (Anhang II Nr. 5 VO 767/2009) |
| Feuchte | ja bei Nass, sonst optional | % | Pflicht erst über 14 % Feuchte (Anhang I Nr. 6). Fehlt sie bei Trockenfutter: **10 % angenommen**, sichtbar markiert. |
| Calcium | optional | % | Freiwillige Angabe, oft unter Analyse oder auf Anfrage beim Hersteller |
| Phosphor | optional | % | wie Calcium |
| Taurin (nur Katze) | optional | mg/kg | Steht meist unter „Zusatzstoffe je kg“, z. B. „Taurin 1.000 mg“. Das ist die **zugesetzte** Menge, nicht der Gesamtgehalt. |
| Energie laut Hersteller | optional | kcal/100 g, kcal/kg oder MJ/kg | Wenn angegeben, hat sie Vorrang vor unserer Schätzung (1 MJ = 239 kcal, 1 kcal = 4,184 kJ) |
| Gewicht | ja | kg | Aktuelles Gewicht. Bei Übergewicht Hinweis: „Idealgewicht nehmen“. |
| Alter / Lebensphase | ja | Hund: Welpe (Wochen) · 1–2 J · 3–7 J · ab 8 J / Katze: Kitten (Monate) · Erwachsen · Senior | |
| Erwartetes Endgewicht | nur Welpe | kg | Braucht die Wachstumsformel. Hilfe: „Rassestandard oder Schätzung der Tierarztpraxis“ |
| Aktivität | ja (adult) | Hund: wenig · normal · sportlich · Arbeitshund / Katze: Wohnung · Freigang | |
| Kastriert | ja (adult) | ja / nein | |

Bewusst **nicht** abgefragt: Produktname, Marke, Krankheiten, Rasse (außer Endgewicht), E-Mail. Das senkt das Risiko, dass ein geteiltes Ergebnis wie ein Urteil über ein bestimmtes Produkt aussieht (siehe Abschnitt 4).

### 1.2 Validierung (zod-Schema, Meldungen inline unter dem Feld)

| Regel | Reaktion |
|---|---|
| Jeder Analysewert 0–100, Dezimalkomma und -punkt erlaubt | Fehler |
| Rohprotein + Rohfett + Rohfaser + Rohasche + Feuchte > 102 % | **Keine Berechnung**: „Die Werte ergeben zusammen mehr als 100 %. Bitte prüfen Sie die Eingabe.“ (2 % Spielraum für Rundung) |
| Rechnerischer NfE < −2 % | Wie oben, keine Berechnung |
| NfE zwischen −2 und 0 | Auf 0 setzen, Hinweis „Rundung“ |
| Trocken, aber Feuchte > 14 % · Nass, aber Feuchte < 60 % | Warnung, Rechnung läuft weiter |
| Nass ohne Feuchte | Pflichtfeld-Fehler |
| Ca oder P > 5 % wie gefüttert, Ca:P > 4 | Warnung „Wert ungewöhnlich, bitte prüfen“ |
| Herstellerenergie außerhalb 50–600 kcal/100 g | Fehler; weicht sie mehr als 15 % von unserer Schätzung ab: Hinweis, Herstellerwert gilt |
| Gewicht Hund 0,5–100 kg · Katze 0,3–12 kg | Fehler |
| Welpe: Alter 8–52 Wochen (Formel gilt laut FEDIAF für 8 Wochen bis 1 Jahr), Gewicht < Endgewicht | Fehler mit Erklärung |
| Kitten: 2–12 Monate | Fehler |

### 1.3 Etikett-Hilfe

Ein aufklappbares „So lesen Sie das Etikett“ mit Infografik 1 (Abschnitt 8) und Link auf [Futterdeklaration richtig lesen](/blog/futterdeklaration-richtig-lesen).

---

## 2. Formeln (alle mit Quelle)

Quellen-Kürzel:
- **[F]** FEDIAF Nutritional Guidelines, September 2025: https://europeanpetfood.org/wp-content/uploads/2025/09/FEDIAF-Nutritional-Guidelines_2025-ONLINE.pdf
- **[N]** NRC (2006): Nutrient Requirements of Dogs and Cats, National Academies Press: https://nap.nationalacademies.org/catalog/10668/nutrient-requirements-of-dogs-and-cats
- **[V]** Verordnung (EG) Nr. 767/2009: https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32009R0767
- **[A]** AAHA 2021 Nutrition and Weight Management Guidelines, Box 1: https://www.aaha.org/wp-content/uploads/globalassets/02-guidelines/2021-nutrition-and-weight-management/resourcepdfs/nutritiongl_box1.pdf · Volltext: https://www.aaha.org/wp-content/uploads/2021/06/new-2021-aaha-nutrition-and-weight-management-guidelines-with-ref.pdf
- **[K]** Kazimierska K., Biel W., Witkowicz R. (2020): Mineral Composition of Cereal and Cereal-Free Dry Dog Foods versus Nutritional Guidelines. Molecules 25: 5173. https://doi.org/10.3390/molecules25215173
- **[M]** Futterprüfer-Methodik: /methodik

### 2.1 Trockenmasse (TS)

```
TS (%)          = 100 − Feuchte
Wert in TS (%)  = Wert wie gefüttert ÷ TS × 100
```

Quelle: Standardumrechnung, so auch im Beitrag [Trockenmasse berechnen](/blog/trockenmasse-berechnen-nass-trockenfutter). FEDIAF-Tabellen stehen „per 100 g DM“ [F, Tab. III-3a/III-4a].

### 2.2 NfE (nur zur Information, keine Punkte)

```
NfE (%) = 100 − (Feuchte + Rohprotein + Rohfett + Rohfaser + Rohasche)
```

NfE (stickstofffreie Extraktstoffe) ist der rechnerische Rest, im Wesentlichen Stärke und Zucker. Weender-Analyse, Methoden nach VO (EG) 152/2009. Wird in TS angezeigt. **Keine Bewertung und kein Gesundheitsbezug.** Wettbewerber verkaufen ihren NfE-Rechner über Diabetes. Das übernehmen wir nicht (Abschnitt 4).

### 2.3 Umsetzbare Energie (ME), NRC-2006-Vierschrittverfahren

Laut FEDIAF für Fertigfutter das Standardverfahren [F, Kap. 7.2.2.2 (a), Tab. VII-5; N]. Alle Werte je 100 g wie gefüttert:

```
1) GE  (kcal) = 5,7 × RP + 9,4 × RFe + 4,1 × (NfE + RFa)
2) Verdaulichkeit (%)   Hund:  91,2 − 1,43 × RFa_TS
                        Katze: 87,9 − 0,88 × RFa_TS
3) DE  (kcal) = GE × Verdaulichkeit ÷ 100
4) ME  (kcal) Hund:  DE − 1,04 × RP
              Katze: DE − 0,77 × RP
```

(RP = Rohprotein, RFe = Rohfett, RFa = Rohfaser in %, RFa_TS = Rohfaser in % der TS)

- Hinweis von FEDIAF: Bei Hundefutter mit mehr als 8 % Rohfaser in der TS unterschätzt die Formel die Energie. Der Rechner zeigt dann einen Hinweis.
- Gibt der Hersteller ME an, rechnet der Rechner damit und zeigt die eigene Schätzung daneben.
- Der modifizierte Atwater-Ansatz (4/9/4 bzw. 4/8,5/4) gilt laut FEDIAF nur für hochverdauliche Produkte und wird nicht verwendet.

### 2.4 Energiebedarf (MER)

**RER** wird nur als Info angezeigt: RER = 70 × kg^0,75 kcal/Tag [N; A].

**Hund, erwachsen** [F, Tab. VII-6 und VII-7], MER = Faktor × kg^0,75:

| Auswahl | Faktor kcal/kg^0,75 | Quelle |
|---|---|---|
| wenig aktiv (< 1 h/Tag) | 95 | VII-7 |
| normal, 1–2 Jahre | 130 (125–140) | VII-6 |
| normal, 3–7 Jahre | 110 (95–130) | VII-6 / VII-7 „moderat 1–3 h, ruhig“ |
| normal, ab 8 Jahren | 95 (80–120) | VII-6 |
| sportlich (1–3 h, intensiv) | 125 (bei 1–2 J: 130) | VII-7 |
| Arbeitshund (3–6 h) | 150–175, Startwert 162,5 | VII-7 |
| kastriert | Faktor × 0,9 | Abgeleitet aus [A]: kastriert 1,4–1,6 × RER statt 1,6–1,8 × RER, also rund 10 % weniger (**eigene Ableitung, im Text so benennen**) |

**Welpe** (8 Wochen bis 1 Jahr) [F, Tab. VII-8b]:
```
MER = (254,1 − 135,0 × aktuelles Gewicht ÷ erwartetes Endgewicht) × aktuelles Gewicht^0,75
```
Pflichthinweis: Welpen nicht zur freien Verfügung füttern; Gewicht regelmäßig mit Wachstumskurve abgleichen [F, VII-8a].

**Katze, erwachsen** [F, Kap. 7.2.4.2, Tab. VII-9], MER = Faktor × kg^0,67:
- kastriert und/oder Wohnung: **75** (Spanne 52–75)
- unkastriert mit Freigang: **100**

**Kitten** [F, Tab. VII-10], Vielfaches von 100 × kg^0,67:
- bis 4 Monate: 2,0–2,5 (Startwert 2,25)
- 4–9 Monate: 1,75–2,0 (Startwert 1,875)
- 9–12 Monate: 1,5

**Spanne:** Der Rechner zeigt einen Startwert und ±10 % (eigene Festlegung). FEDIAF schreibt, dass Bedarfsangaben den tatsächlichen Bedarf um 10–60 % überschätzen können. Deshalb gilt: mit dem Startwert beginnen und nach Gewicht und Körperkondition anpassen (Ziel BCS 4–5 von 9) [F, Kap. 7.2].

### 2.5 Tagesmenge

```
Gramm pro Tag = MER (kcal) ÷ ME (kcal je 100 g) × 100
```
Bei Snacks: Leckerli-Budget = höchstens 10 % des Tagesbedarfs. Laut AAHA soll das Hauptfutter mindestens 90 % der Energie liefern, Leckerlis höchstens 10 % [A, Volltext].

### 2.6 Protein und Fett je 1000 kcal gegen FEDIAF

```
g je 1000 kcal = Wert wie gefüttert (g/100 g) ÷ ME (kcal/100 g) × 1000
```
FEDIAF rechnet zwischen TS und 1000 kcal mit dem Faktor 2,5. Das unterstellt 4,0 kcal ME je g TS. Für abweichende Energiedichte ist zu korrigieren [F, Tab. III-2]. Unsere Formel macht genau das.

Mindestwerte (g je 1000 kcal ME) [F, Tab. III-3b und III-4b]:

| Tier / Spalte | Rohprotein | Rohfett | Wann der Rechner sie nimmt |
|---|---|---|---|
| Hund adult, MER 110 | 45,0 | 13,75 | Faktor > 100 |
| Hund adult, MER 95 | 52,1 | 13,75 | Faktor ≤ 100 (wenig aktiv, Senior, kastriert mit normaler Aktivität) |
| Hund Welpe < 14 Wochen | 62,5 | 21,25 | |
| Hund Welpe ab 14 Wochen | 50,0 | 21,25 | |
| Katze adult, MER 100 | 62,5 | 22,5 | unkastriert, Freigang |
| Katze adult, MER 75 | 83,3 | 22,5 | kastriert oder Wohnung |
| Katze Wachstum | 70,0 | 22,5 | Kitten |

Logik: Tiere mit geringem Energiebedarf fressen weniger Futter, also muss jede Kalorie mehr Nährstoffe liefern.

Zur Einordnung beim Fett: FEDIAF schreibt, dass Fett an sich nicht essenziell ist, solange die essenziellen Fettsäuren gedeckt sind. Deshalb gibt es für Fett weniger Punkte als für Protein.

### 2.7 Calcium, Phosphor, Ca:P

Mindest- und Höchstwerte in g je 100 g TS [F, Tab. III-3a, III-4a, Fußnoten a und b]:

| Tier / Phase | Ca min | Ca max | P min | P max | Ca:P |
|---|---|---|---|---|---|
| Hund adult 110 | 0,50 | 2,5 | 0,40 | 1,6 | 1:1 bis 2:1 |
| Hund adult 95 | 0,58 | 2,5 | 0,46 | 1,6 | 1:1 bis 2:1 |
| Welpe < 14 Wochen | 1,00 | 1,6 | 0,90 | – | 1:1 bis 1,6:1 |
| Welpe ≥ 14 Wo., Endgewicht ≤ 15 kg | 0,80 | 1,8 | 0,70 | – | 1:1 bis 1,8:1 |
| Welpe ≥ 14 Wo., Endgewicht > 15 kg | 1,00 | 1,8 | 0,70 | – | 1:1 bis 1,6:1 |
| Katze adult 100 | 0,40 | – | 0,26 | – | 1:1 bis 2:1 |
| Katze adult 75 | 0,53 | – | 0,35 | – | 1:1 bis 2:1 |
| Kitten | 1,00 | – | 0,84 | – | 1:1 bis 1,5:1 |

Laut Fußnote b gilt der höhere Calcium-Mindestwert bei großen Rassen bis etwa 6 Monate. Danach sind 0,8 % TS und Ca:P bis 1,8:1 möglich. Für einen Welpen über 6 Monaten mit Endgewicht über 15 kg nutzt der Rechner deshalb die Zeile „≤ 15 kg“.

### 2.8 Taurin (Katze, optional)

```
Taurin in % TS = (mg/kg ÷ 10.000) ÷ TS × 100
```
Mindestwerte in % TS [F, Tab. III-4a]:
- Nassfutter: 0,20 (MER 100) / 0,27 (MER 75) / 0,25 (Wachstum)
- Trockenfutter: 0,10 / 0,13 / 0,10

FEDIAF begründet die höheren Werte für Nassfutter mit der geringeren Bioverfügbarkeit nach Hitzebehandlung [F, Kap. Taurine].

### 2.9 Rohasche, Plausibilität

- Es gibt keinen gesetzlichen Höchstwert, und FEDIAF nennt keinen Richtwert für die Summe.
- Gemessen: 30 Hunde-Trockenfutter lagen bei 4,8–9,9 % der TS, im Mittel 7,1 % [K].
- Für Katzenfutter haben wir keine vergleichbaren Zahlen gefunden. Nassfutter liegt in unseren eigenen Testdaten oft bei 8–14 % TS.
- Rechner-Band „unauffällig“: **3–12 % TS**. Das ist eine **eigene Festlegung** auf Basis von [K] plus Spielraum für Nassfutter und wird so benannt.
- Außerhalb des Bands gibt es 5 Punkte Abzug unter „Plausibilität“ und einen Hinweis, aber keine Abwertung als „schlecht“.
- Etikettwerte haben gesetzliche Toleranzen [V, Anhang IV Teil A]. Kleine Unterschiede sind daher wenig aussagekräftig.

---

## 3. Bewertungsmodell („Nährwert-Note“)

### 3.1 Verhältnis zur 100-Punkte-Methodik

Die [Methodik](/methodik) vergibt 100 Punkte:
- Rohstoffqualität 30
- Schadstoffe & Bedenkliches 20
- **Nährstoffprofil 20**
- Deklaration & Transparenz 15
- **Bedarfsdeckung 10**
- Preis-Leistung 5

Der Rechner deckt nur die zwei fett gedruckten Kriterien ab, also 30 von 100 Methodik-Punkten. Darum:

- Er zeigt eine eigene Skala **„Nährwert-Check: 0–100“**, nie „Testergebnis“.
- Die Schwellen sind an die Ampel der Tests angelehnt: Grün ≥ 80, Gelb 60–79, Rot < 60 (`RATING_THRESHOLDS` in `scoring.ts`).
- Pflichtsatz direkt unter der Note: **„Diese Note bewertet nur die Nährwerte, die Sie eingegeben haben. Zutaten, Rohstoffqualität und Zusatzstoffe kann ein Rechner nicht prüfen. Dafür gibt es unsere Tests.“**

### 3.2 Kriterien und Punkte

Wenn ein Kriterium nicht prüfbar ist, entfällt es aus der Maximalsumme. Die Note ergibt sich aus erreichten ÷ möglichen Punkten × 100 (gerundet).

**A. Rohprotein je 1000 kcal (max. 35)** · Verhältnis r = Ist ÷ FEDIAF-Minimum

| r | Punkte |
|---|---|
| ≥ 1,3 | 35 |
| 1,1–1,29 | 30 |
| 1,0–1,09 | 22 |
| 0,9–0,99 | 10 (Toleranzzone) |
| < 0,9 | 0 |

Mehr Protein bringt ab 1,3 keine Zusatzpunkte. Für Protein gibt es kein Maximum in FEDIAF, und mehr ist nicht automatisch besser.

**B. Rohfett je 1000 kcal (max. 20)**

| r | Punkte |
|---|---|
| ≥ 1,2 | 20 |
| 1,0–1,19 | 14 |
| 0,9–0,99 | 6 |
| < 0,9 | 0 |

**C. Calcium/Phosphor (max. 20, nur wenn beide angegeben)**
- 20 Punkte: Ca:P im Bereich und Ca/P innerhalb von Min/Max.
- 10 Punkte: Ca:P bis 0,1 außerhalb und Ca im Bereich.
- sonst 0.

**D. Taurin (max. 10, nur Katze, nur wenn angegeben)**
- 10 Punkte bei ≥ Minimum, sonst 0.
- Fehlt die Angabe, wird das Kriterium nicht gewertet und nicht gedeckelt, weil Taurin meist nur als Zusatzstoff deklariert ist.

**E. Plausibilität & Vollständigkeit (max. 15)**
- Start 15.
- −5, wenn die Feuchte geschätzt werden musste.
- −5, wenn Rohasche außerhalb 3–12 % TS liegt.
- −5 bei Hund mit Rohfaser > 8 % TS (Energieschätzung unsicher).

### 3.3 Notenschwellen

| Punkte | Note | Badge-Farbe |
|---|---|---|
| ≥ 90 | **sehr gut** | good (#15803d) |
| 80–89 | **gut** | good (#15803d), heller (good-soft) |
| 70–79 | **befriedigend** | mid (#854d0e / mid-fill #eab308) |
| 60–69 | **ausreichend** | mid (#854d0e) |
| < 60 | **mangelhaft** | bad (#b91c1c) |

### 3.4 Deckel (gehen vor der Punktzahl)

| Situation | Höchstens |
|---|---|
| Protein oder Fett < 90 % des FEDIAF-Minimums | mangelhaft |
| Protein oder Fett 90–99 % des Minimums | ausreichend |
| Ca über FEDIAF-Höchstwert, adult | ausreichend |
| Ca über FEDIAF-Höchstwert, Welpe/Kitten | mangelhaft |
| Ca:P klar außerhalb (0 Punkte) bei Welpe/Kitten | ausreichend |
| Ca oder P nicht angegeben | gut („sehr gut“ nur mit vollständiger Mineralstoffangabe) |

### 3.5 Sonderfälle

| Fall | Verhalten |
|---|---|
| **Ergänzungsfutter oder Snack** | **Keine Note.** Angezeigt werden TS, ME je 100 g, kcal je Stück (optionales Stückgewicht) und das Leckerli-Budget (10 % des Tagesbedarfs in g). Text: „Ergänzungsfutter deckt allein nicht den ganzen Bedarf. Eine Note nach Alleinfutter-Maßstäben wäre deshalb nicht aussagekräftig. Mehr dazu: [Alleinfutter oder Ergänzungsfutter](/blog/alleinfuttermittel-ergaenzungsfuttermittel).“ |
| Pflichtwert fehlt | Kein Ergebnis, Feld wird markiert, Ergebnis-Karte zeigt „Noch 1 Wert fehlt“ |
| Feuchte fehlt bei Trockenfutter | 10 % angenommen, Badge „geschätzt“, −5 Plausibilität |
| Summe > 102 % oder NfE < −2 % | Kein Ergebnis: „Die Werte passen nicht zusammen.“ |
| Hersteller-ME weicht > 15 % ab | Herstellerwert gilt, Hinweis zeigt beide Werte |
| Welpe ohne Endgewicht | Kein Ergebnis für die Menge. Bewertung nach Wachstumsspalte läuft, Ca-Zeile „Endgewicht > 15 kg“ als strengere Annahme. |
| Hund mit Rohfaser > 8 % TS | Hinweis „Energie wird eher unterschätzt“ |
| Halbfeuchtes Futter (14–60 % Feuchte) | Wird gerechnet, Taurin-Schwelle wie Nassfutter |

### 3.6 „Warum“-Texte (Bausteine, Pollmer-Ton, sachlich, ohne Heilsversprechen)

- **Protein reichlich:** „Rohprotein: 67 g je 1000 kcal. FEDIAF empfiehlt für erwachsene Hunde mindestens 45 g. Ihr Futter liegt beim 1,5-Fachen.“
- **Protein knapp:** „Rohprotein: 49 g je 1000 kcal, Mindestwert für Hunde mit geringem Energiebedarf: 52,1 g. Das sind 94 %. Etikettwerte haben Toleranzen, aber Luft ist da nicht mehr.“
- **Protein darunter:** „Rohprotein liegt unter 90 % des FEDIAF-Mindestwerts. Für diese Lebensphase reicht das nach unserer Rechnung nicht. Deshalb höchstens ‚mangelhaft‘.“
- **Spaltenwechsel erklären:** „Weil Ihre Katze kastriert ist, frisst sie weniger. Jede Kalorie muss also mehr Eiweiß liefern: FEDIAF nennt dann 83,3 g statt 62,5 g je 1000 kcal.“
- **Fett:** „Rohfett: 38 g je 1000 kcal (Minimum 13,75 g). Fett liefert Energie und essenzielle Fettsäuren.“
- **Ca:P passt:** „Calcium zu Phosphor 1,37 : 1, empfohlen sind 1 : 1 bis 2 : 1.“
- **Ca:P daneben:** „Calcium zu Phosphor 3 : 1. FEDIAF nennt für erwachsene Hunde höchstens 2 : 1.“
- **Ca zu hoch beim Welpen:** „Calcium liegt über dem FEDIAF-Höchstwert für wachsende Hunde. Gerade im Wachstum zählt das Gleichgewicht. Deshalb höchstens ‚mangelhaft‘.“
- **Ca/P fehlt:** „Calcium und Phosphor stehen nicht auf dem Etikett. Viele Hersteller nennen sie auf Nachfrage. Ohne diese Werte vergeben wir höchstens ‚gut‘.“
- **Feuchte geschätzt:** „Keine Feuchte angegeben. Wir rechnen mit 10 %, wie bei Trockenfutter üblich.“
- **Rohasche auffällig:** „Rohasche: 13,9 % der Trockenmasse, über dem Band, das wir als unauffällig ansehen. Das kann auf viel Knochen oder Mineralzusatz hindeuten. Was genau drin ist, sagt die Summe nicht.“
- **NfE-Info:** „Rechnerischer Rest (NfE): 46 % der Trockenmasse, vor allem Stärke. Information, keine Bewertung.“
- **Taurin fehlt (Katze):** „Taurin ist für Katzen lebensnotwendig. Auf der Packung steht meist nur die zugesetzte Menge. Ohne Angabe prüfen wir es nicht.“
- **Mengenhinweis immer:** „Startwert. Wiegen Sie Ihr Tier alle zwei bis vier Wochen und passen Sie die Menge an.“ (Keine Formulierung wie „ersetzt die Tierarztpraxis“ oder „gesund“.)

### 3.7 Testlauf gegen unsere Tests (Kalibrierung, `ref/kalibrierung.py`)

Der Rechner wurde auf alle 38 veröffentlichten Alleinfutter-Tests mit vollständiger Analyse angewendet. Annahmen: Hund 20 kg, 3–7 Jahre, normal aktiv; Katze 4 kg, kastriert.

Ergebnis:
- 36 von 38 erreichen „gut“ oder „sehr gut“ (12 sehr gut, 24 gut, 1 ausreichend, 1 mangelhaft), auch Futter, die in unseren Tests Rot bekamen.
- Begründung: Fast jedes Alleinfutter erfüllt die FEDIAF-Mindestwerte bei Protein und Fett. Abzüge im Test kommen von Rohstoffen, Zusatzstoffen und Deklaration.

**Das ist kein Fehler des Modells, sondern die Kernbotschaft:** „Gute Analysewerte heißen noch kein gutes Futter.“ Diese Kernbotschaft trägt die Infografik 6 und die CTA zu den Tests.

Auffällig waren:
- ein Trocken-Katzenfutter mit 27 % Protein bei kastrierter Katze: rund 87 % des Minimums der 75er-Spalte, also „mangelhaft“;
- ein weiteres mit 1,00 fast genau am Minimum.

Deshalb ist das Feld „Energie laut Hersteller“ wichtig. Mit deklarierter ME verschiebt sich das Ergebnis oft um einige Prozent.

**Konsequenz:** Rechner-Ergebnisse zu echten Produkten **nicht** als Futterprüfer-Aussage veröffentlichen (z. B. „Produkt X: mangelhaft im Rechner“). Die Kalibrierung bleibt intern.

---

## 4. Compliance

### 4.1 Keine Heil- oder Krankheitsaussagen
- Werbung für Futtermittel darf nicht behaupten, dass ein Futter Krankheiten verhütet, behandelt oder heilt (Art. 13 Abs. 3 VO (EG) 767/2009). Wir sind kein Hersteller, aber wir bleiben bei derselben Linie.
- Kein Bezug auf Diabetes, Niere, Harnsteine, Allergie im Rechner, in Metas, im SEO-Text oder in der FAQ. Ausnahme ist der Pflicht-Hinweis: „Hat Ihr Tier eine Erkrankung, klärt die Tierarztpraxis, welches Futter passt. Der Rechner ist dafür nicht gedacht.“
- **Nicht** schreiben: „ersetzt den Tierarzt“, „gesund“, „optimal versorgt“, „bedarfsgerecht garantiert“, „Diät“, „Heilung“.
- Wenn ein Gesundheitsbezug unvermeidbar ist: „legt nach unserer Einschätzung einen Krankheitsbezug nahe“.

### 4.2 Analysewerte ≠ Qualität
Pflichtbox unter jedem Ergebnis:

> **Was der Rechner nicht sieht:** Woher das Protein stammt, wie viel Fleisch drin ist, welche Zusatzstoffe zugesetzt wurden und wie die Rohstoffe verarbeitet sind, steht nicht in den Analysewerten. Das prüfen wir in unseren [Futtertests](/tests) nach unserer [Methodik](/methodik).

### 4.3 Wortliste
- Verboten: „zulässig“, „unzulässig“, „Rechtlich angreifbar“, „Betrug“, „unabhängig“ über uns selbst.
- Nicht empfehlen oder verlinken: Animagus/Tierliebhaber, Canina, alfavet, Medidog. Gilt auch für die dynamische CTA-Liste: Filter im Code.
- Nicht nennen: Schäfer, Coscun.
- Vermeiden: „Testsieger“ im Rechnerkontext, „amtlich“, „zertifiziert“, „Stiftung Warentest“ (keine Vermischung).

### 4.4 Datenschutz
- Alles wird im Browser berechnet. Kein Server-Request mit Eingaben, keine DB, kein Cookie.
- Kein `localStorage`, solange Rechtsprüfung und Manni es nicht freigeben (TDDDG § 25: Speichern im Endgerät; „vom Nutzer ausdrücklich gewünscht“ wäre zu prüfen).
- **Teilen-Link mit Werten im `#`-Fragment**, z. B. `/futterrechner/hund#p=25&f=14&fa=2.5&a=7&m=10`. Das Fragment wird nicht an den Server übertragen und landet nicht in Vercel-Logs. Kein Query-String.
- Vercel Analytics: höchstens ein Event `rechner_berechnet` mit Tierart und Futterart, **ohne Werte**. In der Datenschutzerklärung einen Absatz „Futterrechner“ ergänzen.
- Hinweiszeile unter dem Formular: „Ihre Eingaben bleiben auf Ihrem Gerät. Wir speichern nichts.“

### 4.5 Prüfpunkte für die Rechtsprüfung
1. Notenskala „sehr gut … mangelhaft“: Sie ähnelt der Notenskala von Stiftung Warentest. Ist eine Verwechslung oder Irreführung (UWG § 5) denkbar? Alternative: „Nährwert-Check: stark / gut / solide / knapp / schwach“.
2. Ampelfarben wie in Tests: Reicht der Pflichtsatz „nur Nährwerte“, um die Rechnernote vom Testurteil abzugrenzen?
3. Geteilte Ergebnisse: Kein Produktname im Rechner. Bleibt ein Restrisiko, dass Nutzer Screenshots mit Marke posten? Disclaimer ausreichend?
4. Formulierungen zur Menge: „Startwert“ statt „richtige Menge“, kein Gesundheitsversprechen. Bitte prüfen.
5. Pflichthinweis zu Erkrankungen (4.1): Wortlaut prüfen.
6. „Kastriert × 0,9“ als eigene Ableitung aus AAHA: Ist die Kennzeichnung ausreichend?
7. Datenschutzerklärung: Absatz Futterrechner, Analytics-Event.
8. Schema.org: keine `aggregateRating` ohne echte Bewertungen.
9. Teaser in Testseiten: Rechner-CTA darf nicht wie Werbung für ein Produkt wirken.

---

## 5. UX & Design

Leitlinie Manni: „übersichtlich, schick, modern, sexy“. Mobile-first bei 390 px. Bestehende Markenfarben und Komponentenstil (rounded-2xl/3xl, `--shadow`, `--shadow-lift`, `font-heading` für Zahlen) übernehmen. Das Grundlayout (Header, Footer, Bottom-Bar) bleibt unverändert.

### 5.1 Seitenaufbau `/futterrechner/hund` (390 px, von oben nach unten)

1. Breadcrumb „Start › Futterrechner › Hund“ (klein, muted)
2. **H1** + 1 Satz Nutzen (siehe 7.5), daneben ein kleiner Chip „Nach FEDIAF 2025 · im Browser berechnet“
3. **Rechner** (Abschnitt 6): drei Karten „Ihr Hund“, „Das Futter“, „Analysewerte“
4. **Sticky Ergebnis-Leiste** (mobil, über der Bottom-Bar): Mini-Gauge + Note + g/Tag. Ein Tipp darauf scrollt zur Ergebnis-Karte.
5. **Ergebnis-Karte** (5.2)
6. Box „Was der Rechner nicht sieht“ (4.2) + **CTA zu passenden Tests**
7. SEO-Text mit den 6 Infografiken (Abschnitt 8), FAQ, Quellen
8. Autorbox Sebastian Kraft, Stand-Datum

Desktop ab `lg`: zweispaltig, links Formular, rechts Ergebnis-Karte `sticky top-24`.

**Entscheidung kompakt statt Schritt-Formular:** Bei einem Step-Formular sieht man das Ergebnis erst am Ende. Manni will ein Live-Ergebnis beim Schieben. Darum: eine Seite, drei Karten, Fortschritt „4 von 5 Pflichtwerten“ in der Ergebnis-Leiste.

### 5.2 Ergebnis-Karte

```
┌───────────────────────────────────────────┐
│  Nährwert-Check                [Teilen ⤴] │
│   ◠◠◠ Halbkreis-Gauge 0–100 ◠◠◠           │
│        100   ● SEHR GUT                   │
│  „Nur Nährwerte bewertet, kein Testurteil“│
├───────────────────────────────────────────┤
│  281 g pro Tag   (253–309 g)              │
│  1.040 kcal/Tag · 370 kcal/100 g          │
├───────────────────────────────────────────┤
│  Warum?                                   │
│  ✓ Protein 67 g/1000 kcal (Min. 45)  ▮▮▮▮ │
│  ✓ Fett 38 g/1000 kcal (Min. 13,75)  ▮▮▮▮ │
│  ✓ Ca:P 1,37 : 1 (1–2 : 1)                │
│  ✓ Rohasche 7,8 % TS, unauffällig         │
│  ℹ NfE 46 % TS (Info)                     │
├───────────────────────────────────────────┤
│  ▸ Rechenweg anzeigen (TS, GE, DE, ME)    │
├───────────────────────────────────────────┤
│  Passende getestete Futter (Grün/Gelb)    │
│  [Karte] [Karte] [Karte]  → Alle Tests    │
└───────────────────────────────────────────┘
```
(Werte = Testfall T1)

- **Badge:** Text + Icon + Farbe. Die Note ist nie nur über Farbe erkennbar.
  - sehr gut/gut: `bg-good-soft text-good`, CheckCircle
  - befriedigend/ausreichend: `bg-mid-soft text-mid`, AlertTriangle
  - mangelhaft: `bg-bad-soft text-bad`, XCircle
- **Balken** je Kriterium: Ist-Wert im Verhältnis zum Minimum. Eine Linie markiert 100 % = FEDIAF-Minimum (Stil wie `criteria-bars.tsx`).
- **„Rechenweg anzeigen“:** Details-Akkordeon mit allen Zwischenwerten. Das schafft Vertrauen und hilft der SEO (Begriffe stehen im DOM).
- **CTA-Karten:**
  - Serverseitig per ISR (`revalidate 3600`) nur lesend aus `Review` geladen.
  - Filter: gleiche Tierart, gleiche Futterart (trocken/nass), Alleinfutter, veröffentlicht, nur Grün oder Gelb.
  - Ausschlussliste im Code: Animagus/Tierliebhaber, Canina, alfavet, Medidog. 3 Stück nach Score.
  - Die Karten verlinken **auf unsere Testseiten**, nicht direkt auf Amazon. Kein Affiliate im Rechner selbst, damit die Note nicht nach Verkaufen aussieht.
  - Falls Manni später Amazon-Links will: nur Grün/Gelb, `tag=cyberni7400-21`, `rel="sponsored nofollow noopener"` und der Satz „Die Provision hat keinen Einfluss auf unsere Bewertung.“
- **Teilen:**
  - Web Share API (mobil), sonst „Link kopieren“.
  - Werte im `#`-Fragment, ohne Produktnamen.
  - OG-Bild statisch. Kein dynamisches OG mit Note, damit sie nicht als Urteil zirkuliert.
- **Ergänzungsfutter-Variante:** Statt Gauge eine Info-Karte (brand-soft) mit kcal/100 g, kcal je Stück und „Leckerli-Budget: bis 21 kcal ≈ 6 g pro Tag“ (T8).

---

## 6. Formular-UX im Detail (Schieberegler, Chips, Live-Ergebnis)

Manni (23:11): „Schönes Formular mit Schieberegler oder so, sehr bequem zu bedienen.“

Inspiration: Die Mobbin-Abfrage am 26.10.2026 wurde abgelehnt (Bezahl-Plan nötig). Deshalb hier nur allgemein bekannte Muster als Anregung, nicht zum Nachbauen:
- Onboarding-Regler aus Fitness- und Gesundheits-Apps (großer Zahlenwert über dem Regler)
- Kreditrechner von Banken (Regler + Zahlenfeld nebeneinander, Ergebnis live)
- Segment-Chips aus Kalorien-Apps

### 6.1 Aufbau: drei Karten

**Karte 1 „Ihr Hund“ / „Ihre Katze“**
- Tierart-Toggle (2 große Chips mit Icon)
- Gewicht (Regler)
- Alter (Regler; Lebensphase wird automatisch erkannt und als Chip gezeigt, überschreibbar)
- Bei Welpen: Endgewicht (Regler)
- Aktivität (Icon-Chips)
- Kastriert (Ja/Nein)

**Karte 2 „Das Futter“**
- Futterart: Trocken / Nass / Snack (Icon-Chips)
- Alleinfutter / Ergänzungsfutter (Segment-Toggle)
- Snack setzt automatisch „Ergänzungsfutter“.

**Karte 3 „Analysewerte vom Etikett“**
- 5 Pflichtregler
- darunter aufklappbar „Mehr Werte (genauer)“: Calcium, Phosphor, Taurin (Katze), Energie laut Hersteller
- Link „Wo steht das?“ → Etikett-Hilfe mit Infografik 1

### 6.2 Regler-Komponente `<ValueSlider>`

```
Rohprotein                         [ 25,0 ] %
├──────────●───────────┼────────────────┤
10                  FEDIAF-Min ≈ 16,7 %    45
```

**Aufbau**
- Zeile 1: Label links (font-bold), rechts Zahlenfeld als Pille (`inputmode="decimal"`, Komma und Punkt, `tabular-nums`, `font-heading text-xl`, Breite 5 ch).
- Zeile 2: Regler.
  - Natives `<input type="range">`, gestylt: beste Zugänglichkeit, keine Fremdbibliothek.
  - Spur 8 px, `rounded-full`, unbefüllt `bg-border`.
  - Befüllt mit Verlauf `brand → lime`.
  - Daumen 28 px sichtbar, weiß, 3 px Rand `brand`, `shadow-lift`.
  - Trefferfläche mindestens 44 px hoch (`h-11` um die Spur).
- Beim Ziehen: Wert-Bubble über dem Daumen (`bg-brand text-white rounded-lg`, 150 ms Fade).
- Zeile 3: Min/Max klein, muted.
- **FEDIAF-Markierung** bei Rohprotein und Rohfett: ein dünner Strich mit Label „Min. ≈ 16,7 %“.
  - Wird live aus aktueller Energie und Tierprofil zurückgerechnet: Minimum je 1000 kcal × ME ÷ 1000.
  - Liegt der Daumen links davon, wird der befüllte Teil `mid`, unter 90 % `bad`.
  - Das ist der „Aha“-Moment des Rechners. Beispiel T1: 45 g × 370 kcal ÷ 1000 = 16,7 % Rohprotein wären nötig, das Futter hat 25 %.

**Verhalten**
- Zahlenfeld und Regler sind synchron.
- Werte außerhalb des Reglerbereichs dürfen getippt werden (bis zur Validierungsgrenze). Der Daumen bleibt dann am Rand, mit Hinweis „außerhalb des üblichen Bereichs“.
- **Startzustand „noch nicht gesetzt“:**
  - Daumen grau, Zahlenfeld „–“, Platzhalter „typisch 24 %“.
  - Der erste Tipp oder Zug setzt den Wert.
  - Grund: Wir zeigen keine Note für Vorgabewerte, die niemand eingegeben hat.
- Das Ergebnis erscheint, sobald alle Pflichtwerte gesetzt sind. Vorher zeigt die Leiste: „Noch 2 Werte, dann sehen Sie die Note“.
- Haptik (optional): `navigator.vibrate(5)` beim Überschreiten der FEDIAF-Markierung. Aus bei `prefers-reduced-motion`.

### 6.3 Bereiche und Schritte

Die Bereiche gelten für den Regler. Das Zahlenfeld erlaubt mehr (Validierung 1.2).

**Hund · Trockenfutter**

| Wert | Bereich | Schritt | Platzhalter |
|---|---|---|---|
| Rohprotein | 10–45 % | 0,5 | 24 |
| Rohfett | 3–30 % | 0,5 | 13 |
| Rohfaser | 0–12 % | 0,1 | 2,5 |
| Rohasche | 2–15 % | 0,1 | 7 |
| Feuchte | 3–14 % | 0,5 | 10 |
| Calcium | 0,2–3,0 % | 0,05 | 1,2 |
| Phosphor | 0,2–2,0 % | 0,05 | 0,9 |

**Hund · Nassfutter**

| Wert | Bereich | Schritt | Platzhalter |
|---|---|---|---|
| Rohprotein | 3–20 % | 0,1 | 10 |
| Rohfett | 0,5–15 % | 0,1 | 7 |
| Rohfaser | 0–3 % | 0,1 | 0,5 |
| Rohasche | 0,5–5 % | 0,1 | 2,2 |
| Feuchte | 60–88 % | 0,5 | 78 |
| Calcium | 0,05–1,0 % | 0,01 | 0,3 |
| Phosphor | 0,05–0,8 % | 0,01 | 0,22 |

**Katze · Trockenfutter**

| Wert | Bereich | Schritt | Platzhalter |
|---|---|---|---|
| Rohprotein | 20–55 % | 0,5 | 32 |
| Rohfett | 5–28 % | 0,5 | 15 |
| Rohfaser | 0–10 % | 0,1 | 2,5 |
| Rohasche | 3–14 % | 0,1 | 7,5 |
| Feuchte | 3–14 % | 0,5 | 8 |
| Calcium | 0,3–2,5 % | 0,05 | 1,1 |
| Phosphor | 0,3–2,0 % | 0,05 | 0,9 |
| Taurin | 0–3.000 mg/kg | 50 | 1.500 |

**Katze · Nassfutter**

| Wert | Bereich | Schritt | Platzhalter |
|---|---|---|---|
| Rohprotein | 5–20 % | 0,1 | 11 |
| Rohfett | 0,5–12 % | 0,1 | 5,5 |
| Rohfaser | 0–3 % | 0,1 | 0,4 |
| Rohasche | 0,5–5 % | 0,1 | 2 |
| Feuchte | 65–88 % | 0,5 | 80 |
| Calcium | 0,05–1,0 % | 0,01 | 0,3 |
| Phosphor | 0,05–0,8 % | 0,01 | 0,22 |
| Taurin | 0–3.000 mg/kg | 50 | 1.000 |

**Snack (beide)**
- Rohprotein 0–80 %, Rohfett 0–40 %, Rohfaser 0–15 %, Rohasche 0–20 %, Feuchte 3–85 %, je Schritt 0,5.
- Dazu „Gewicht pro Stück“ 0,5–50 g (Schritt 0,5).

**Herstellerenergie:** Zahlenfeld plus Einheiten-Segment (kcal/100 g · kcal/kg · MJ/kg). Kein Regler, weil es ein Ablesewert ist.

**Tier**

| Regler | Hund | Katze |
|---|---|---|
| Gewicht | 1–80 kg, zweistufige Skala: bis 10 kg in 0,5er-Schritten, darüber in 1er-Schritten, damit kleine Hunde nicht auf 2 mm Spur liegen. Zahlenfeld 0,5–100. | 1–10 kg, Schritt 0,1. Zahlenfeld 0,3–12. |
| Alter | Ein Regler mit zwei Abschnitten: 8–52 Wochen (Schritt 1 Woche), dann 1–18 Jahre (Schritt 1). Label wechselt „17 Wochen“ / „4 Jahre“. Lebensphasen-Chip springt automatisch: Welpe / 1–2 J / 3–7 J / Senior ab 8. | 2–12 Monate (Schritt 1), dann 1–22 Jahre. Chip: Kitten / Erwachsen / Senior ab 11 (Senior nur Info, gerechnet wie erwachsen). |
| Endgewicht (nur Welpe) | 2–90 kg, gleiche Skala wie Gewicht, Pflicht | – |

### 6.4 Chips und Toggles

Alle als native Radio-Gruppen (`fieldset` + `legend`), optisch als Chips.

**Größe und Stil**
- Mindesthöhe 48 px (`min-h-12`), Abstand 8 px. Auf 390 px zweispaltig. Aktivität als Icon-Kacheln 80 × 72 px in 4 Spalten.
- Aktiv: `bg-brand text-white` (Dark: `text-black`), Haken-Icon.
- Inaktiv: `bg-surface border border-border`, Hover `border-brand`.

**Icons (lucide-react, im Repo vorhanden)**

| Gruppe | Optionen |
|---|---|
| Tierart | `Dog` Hund · `Cat` Katze |
| Futterart | Trocken (eigenes SVG „Kroketten“) · Nass (eigenes SVG „Dose“) · Snack `Bone` |
| Futtertyp | Segment „Alleinfutter / Ergänzungsfutter“ mit Info-Tooltip |
| Aktivität Hund | `Sofa` wenig · `Footprints` normal · `Zap` sportlich · `Mountain` Arbeitshund |
| Aktivität Katze | `Home` Wohnung · `Trees` Freigang |

Unter jeder Aktivität steht eine Zeile Erklärung, z. B. „unter 1 Stunde Bewegung am Tag“.

**Kastriert:** Ja/Nein-Segment ohne Vorauswahl. Ohne Auswahl rechnen wir „nein“ und markieren das.

**Lebensphase:** Chip-Leiste unter dem Alter, automatisch gesetzt, manuell änderbar.

### 6.5 Live-Ergebnis und erhaltene Werte

- Rechnung bei **jedem** Input-Event. Die reine TS-Funktion braucht unter 1 ms, Debounce nur für Screenreader und URL.
- **Gauge:** Halbkreis-SVG 0–100 mit 5 Farbsegmenten.
  - Segmente: 0–59 bad, 60–79 mid (zwei Abstufungen), 80–89 good-soft, 90–100 good.
  - Zeiger mit framer-motion `spring` (stiffness 200, damping 25). Ohne Animation bei `prefers-reduced-motion`.
  - Die Zahl zählt hoch (tabular-nums).
- **Sticky-Leiste mobil:**
  - 64 px, `bg-surface/90 backdrop-blur`, `shadow-lift`, über der Bottom-Bar (Abstand über `env(safe-area-inset-bottom)` + Bottom-Bar-Höhe).
  - Inhalt: Mini-Gauge 40 px · Note-Badge · „281 g/Tag“.
  - Erscheint, sobald der erste Wert gesetzt ist.
- **Notenwechsel:** Badge pulsiert kurz (scale 1 → 1,06 → 1).
- **Werte bleiben erhalten:**
  - Trocken ↔ Nass: Der State hält je Futterart einen eigenen Wertesatz. Wer zurückschaltet, findet seine Werte wieder.
  - Hund ↔ Katze: Analysewerte bleiben, Tierangaben getrennt.
  - **Hash-Sync:** Jede Änderung schreibt per `history.replaceState` (gedrosselt auf 300 ms) ins `#`-Fragment. Neu laden, Zurück-Taste und Teilen-Link stellen alles wieder her.
  - Nichts geht an den Server, nichts in `localStorage` (4.4).
- **Zurücksetzen:** Text-Button „Alle Werte löschen“, mit Undo-Toast (5 s) statt Bestätigungsdialog.

### 6.6 Barrierefreiheit (Ziel WCAG 2.2 AA)

- **Labels:** Jeder Regler und jedes Zahlenfeld hat ein sichtbares `<label>`. Regler und Feld hängen per `aria-labelledby` am selben Label.
- **`aria-valuetext`** am Regler, z. B. „25 Prozent Rohprotein, über dem FEDIAF-Mindestwert“, „17 Wochen“, „12,5 Kilogramm“.
- **Tastatur** (nativer Range):
  - Pfeiltasten = 1 Schritt
  - Bild auf/ab = 10 Schritte
  - Pos1/Ende = Min/Max
  - Tab-Reihenfolge: Regler, dann zugehöriges Zahlenfeld
- **Fokus** sichtbar: `focus-visible:ring-2 ring-brand ring-offset-2`.
- **Live-Region** `aria-live="polite"` für die Note:
  - Liest erst 600 ms nach der letzten Änderung vor, damit beim Ziehen nicht jeder Schritt angesagt wird.
  - Beispiel: „Nährwert-Check 100 von 100, sehr gut. Tagesmenge 281 Gramm.“
- **Fehler:** per `aria-describedby` und `aria-invalid`, Text in `text-bad` plus Icon.
- **Kontrast:** brand #0a5654 auf Weiß und Weiß auf accent #c2410c beim Bau prüfen (Ziel ≥ 4,5:1). mid-fill #eab308 nur als Fläche mit dunklem Text, nie als Textfarbe auf Weiß.
- **Touch-Ziele** ≥ 44 × 44 px (WCAG 2.5.8 verlangt 24 px, wir nehmen 44 px nach Manni).
- **Zoom:** 200 % ohne horizontales Scrollen bei 390 px.

### 6.7 Stil („übersichtlich, schick, modern, sexy“)

- **Karten:** `rounded-3xl bg-surface shadow-[var(--shadow)] p-5`, Abstand 16 px. Kopf je Karte mit Nummernkreis 1/2/3 in `bg-brand-soft text-brand`.
- **Zahlen:** große Zahlen in `font-heading`.
- **Orange (accent) nur für Handlungs-Buttons** (Teilen, CTA). Keine orangefarbenen Regler, damit Orange „klick mich“ bleibt.
- **Hintergrund** der Rechner-Sektion: `bg-bg-soft` mit sehr dezentem Raster (Analysepapier-Anmutung, 4 % Deckkraft).
- **Dark Mode:** Tokens greifen automatisch. Gauge mit Dark-Werten (good #4ade80, mid #facc15, bad #f87171).
- **Micro-Interactions** dezent: Chip-Auswahl 120 ms, Gauge-Feder, Bubble beim Ziehen. Kein Konfetti.

---

## 7. SEO (umfangreich)

### 7.1 Recherche (26.10.2026)

**Google Autocomplete** (Rohdaten in `data/suggest_2026-10-26.json`):
- „futterrechner hund“ → nassfutter, nass- und trocken, trockenfutter, kochen, barf, welpe, mischfütterung
- „futterrechner katze“ → online, Markenvarianten
- „futter rechner“ → hund, katze, welpe, kitten
- „hundefutter rechner“ → nass und trockenfutter, nassfutter, trockenfutter, welpen, menge, online, bedarf
- „katzenfutter rechner“ → kitten, trocken nass, online, menge, bedarf, nfe, diabetes (**meiden**)
- „hundefutter analytische bestandteile“ → gutes …, berechnen, optimal
- „hundefutter/katzenfutter kalorien berechnen“, „kcal hundefutter berechnen“
- „nfe berechnen“ (formel, katzenfutter), „kohlenhydrate katzenfutter berechnen“
- „rohprotein hundefutter wieviel“, „rohprotein katzenfutter wieviel“, „rohfett/rohfaser hundefutter wieviel“, „wieviel taurin katzenfutter“
- „ca p verhältnis hundefutter“, „calcium phosphor verhältnis katzenfutter“
- „kalorienbedarf hund/katze“ (+ kg), „energiebedarf hund berechnen“ (formel, metabolisch, nrc)
- „wie viel futter braucht mein hund“, „wie viel futter braucht eine katze am tag“, „hundefutter check“

**Fragen (PAA):** Die FAQ unten ist aus Autocomplete-Fragen und den FAQ-Blöcken der Wettbewerber abgeleitet. Die Box „Ähnliche Fragen“ lässt sich ohne Browser-Sitzung nicht zuverlässig auslesen; beim Bau einmal manuell gegenprüfen.

**Wettbewerb**
- **NfE-Rechner:** nfe-rechner.de, enupet.com, tierportal-muenchen.de, napfcheck.de, futter-rechner.de (mehrere mit Diabetes-Rahmung).
- **Mengenrechner:** hundefutter-abc.de (RER × AAHA plus NRC), xaravet.de, ivh-online.de (FEDIAF-Vierschritt), royalcanin.com/de (Herstellertool), pet-ai.app.
- **Unsere Lücke:** Niemand bewertet die Analyse **gegen FEDIAF je 1000 kcal**, abhängig von Lebensphase und Aktivität, mit Note und Begründung, und verlinkt auf echte Tests.

**GSC**
- `trockenmasse-berechnen-nass-trockenfutter`: 29 Impressionen, Position 5,9
- `rohasche-im-futter`: 31 Impressionen, Position 27,9 (Rohasche-Fragen um Position 8)
- Noch keine Rechner-Anfragen. Die internen Links aus diesen beiden Artikeln sind die wichtigste Starthilfe.

### 7.2 Keywords

**Short-Tail:** futterrechner · futter rechner · hundefutter rechner · katzenfutter rechner · futterrechner hund · futterrechner katze

**Long-Tail:**
- Rechner nach Futterart und Tier: futterrechner hund trockenfutter / nassfutter / welpe · futterrechner katze online · katzenfutter rechner kitten · hundefutter rechner nass und trockenfutter
- Futter prüfen: hundefutter analytische bestandteile berechnen · hundefutter prüfen · hundefutter check
- Kalorien und NfE: kcal hundefutter berechnen · hundefutter kalorien berechnen · katzenfutter kalorien berechnen · nfe rechner · nfe berechnen katzenfutter
- Futtermenge: futtermenge hund rechner · futtermenge katze rechner · futtermenge welpe rechner
- Nährstoffe: rohprotein hundefutter wieviel · rohprotein katzenfutter wieviel · wieviel taurin katzenfutter · ca p verhältnis hundefutter

**Fragen:**
- Wie viel Futter braucht mein Hund am Tag?
- Wie viel Futter braucht eine Katze am Tag?
- Wie viel Rohprotein sollte Hundefutter haben?
- Wie rechne ich die Trockenmasse aus?
- Wie berechne ich die Kalorien im Hundefutter?
- Was ist ein gutes Calcium-Phosphor-Verhältnis?
- Wie viel Taurin braucht eine Katze?
- Was sagen die analytischen Bestandteile aus?

**Top 10 Ziel-Keywords**
1. futterrechner hund
2. futterrechner katze
3. hundefutter rechner
4. katzenfutter rechner
5. futter rechner
6. hundefutter analytische bestandteile (berechnen)
7. kcal hundefutter berechnen / hundefutter kalorien berechnen
8. katzenfutter kalorien berechnen
9. futtermenge hund rechner (vom Artikel verschoben)
10. nfe rechner

### 7.3 URL-Empfehlung

**`/futterrechner` (Hub) + `/futterrechner/hund` + `/futterrechner/katze`**

Begründung:
1. Das stärkste Suchmuster ist „futterrechner hund/katze“. Die URL bildet es 1:1 ab, kurz und deutsch.
2. Zwei Unterseiten statt einer kombinierten:
   - getrennte Keyword-Cluster (Hundefutter vs. Katzenfutter)
   - eigene Metas, FAQ, Beispiele und CTAs
   - Suchende nennen die Tierart fast immer im Query
3. Der Hub fängt „futter rechner“ ab und verteilt Linkkraft auf beide Seiten.
4. Technik: Ein statischer Ordner `src/app/(site)/futterrechner/` hat in Next.js Vorrang vor `[kategorie]`. Der Designer prüft, dass kein Kategorie-Slug „futterrechner“ existiert.

**Verworfen:**
- `/rechner/...`: zu generisch
- `/tools/...`: englisch
- `/blog/futterrechner`: Ein Werkzeug ist kein Beitrag und würde mit den Artikeln konkurrieren.

### 7.4 Metas (Längen gemessen)

| Seite | metaTitle (Zeichen) | metaDescription (Zeichen) |
|---|---|---|
| `/futterrechner` | Futterrechner Hund & Katze: Futter prüfen \| Futterprüfer (56) | Futterrechner für Hund und Katze: Analysewerte vom Etikett eintippen, Note nach FEDIAF und Tagesmenge sehen. Ohne Anmeldung, nichts gespeichert. (145) |
| `/futterrechner/hund` | Futterrechner Hund: Hundefutter prüfen & Menge berechnen (56) | Hundefutter-Rechner: Rohprotein, Rohfett & Co. eintippen und Nährwert-Note, kcal und Futtermenge pro Tag sehen. Nach FEDIAF, für Welpen bis Senioren. (149) |
| `/futterrechner/katze` | Futterrechner Katze: Katzenfutter prüfen & Menge berechnen (58) | Katzenfutter-Rechner: Analysewerte eintippen, Nährwert-Note nach FEDIAF, kcal und Futtermenge pro Tag sehen. Für Kitten, Wohnungskatzen und Freigänger. (151) |

- Falls das Root-Layout ein Title-Template mit „| Futterprüfer“ anhängt, beim Hub `title.absolute` setzen, sonst steht es doppelt.
- Canonical ohne Fragment.
- OG-Bild: statische Grafik je Seite (Infografik 6 im Zuschnitt 1200 × 630).

### 7.5 H1/H2-Struktur und SEO-Text

**`/futterrechner/hund`**
- **H1:** Futterrechner Hund: Hundefutter prüfen und Tagesmenge berechnen
- **Lead:** „Tippen Sie die analytischen Bestandteile von der Packung ein. Der Rechner zeigt in Sekunden, ob das Futter die FEDIAF-Mindestwerte für Ihren Hund erreicht, wie viele Kalorien es hat und wie viel Gramm am Tag ein guter Startwert sind.“
- [Rechner]
- **H2:** So rechnet der Futterrechner (Infografik 2 und 3)
  - H3: Schritt 1: Trockenmasse
  - H3: Schritt 2: Kalorien (ME) nach NRC 2006
  - H3: Schritt 3: Energiebedarf Ihres Hundes
  - H3: Schritt 4: Nährstoffe je 1000 kcal gegen FEDIAF
- **H2:** Wie viel Rohprotein und Rohfett braucht Hundefutter? (FEDIAF-Tabelle, Infografik 4)
- **H2:** Calcium, Phosphor und Rohasche richtig einordnen (Infografik 5)
- **H2:** Rechenbeispiele
  - H3: T1 Erwachsener Hund
  - H3: T3 Welpe
  - H3: T4 Senior
  - H3: T7 knappes Futter
- **H2:** So bewerten wir: was die Note sagt und was nicht (Infografik 6, Links zu Methodik und Tests)
- **H2:** Häufige Fragen zum Futterrechner (8 Fragen)
- **H2:** Quellen

**`/futterrechner/katze`**
- **H1:** Futterrechner Katze: Katzenfutter prüfen und Tagesmenge berechnen
- Gliederung analog, plus zwei eigene H2:
  - „Warum kastrierte Katzen mehr Eiweiß pro Kalorie brauchen“
  - „Taurin: was auf der Packung steht“
- Beispiele: T5, T6

**`/futterrechner` (Hub)**
- **H1:** Futterrechner für Hund und Katze
- 2 große Auswahlkarten
- **H2:** Was der Futterrechner kann
- **H2:** Was er nicht kann
- **H2:** Unsere Rechenbasis (FEDIAF 2025, NRC 2006)
- 3 FAQ

**Umfang:** rund 1.400–1.800 Wörter je Unterseite unter dem Rechner, im Pollmer-Stil.
- Beim Schreiben die Skills `seo-pflicht-futterpr-fer-pollmer-stil` und `seo-blogbeitrag-mit-google-recherche` laden.
- Der Text selbst gehört nicht zu diesem Konzept.

**FAQ Hund**
1. Wie viel Futter braucht mein Hund am Tag?
2. Wie berechne ich die Kalorien im Hundefutter?
3. Wie viel Rohprotein sollte Hundefutter haben?
4. Wie mache ich Nass- und Trockenfutter vergleichbar?
5. Was ist ein gutes Calcium-Phosphor-Verhältnis?
6. Warum bekommt Ergänzungsfutter keine Note?
7. Ist „sehr gut“ im Rechner dasselbe wie ein gutes Testergebnis? (Nein, nur Nährwerte.)
8. Werden meine Eingaben gespeichert?

**FAQ Katze**
1. Wie viel Futter braucht eine Katze am Tag?
2. Wie viele Kalorien braucht eine kastrierte Katze?
3. Wie viel Rohprotein sollte Katzenfutter haben?
4. Wie viel Taurin braucht eine Katze?
5. Wie viel frisst ein Kitten?
6. Warum Nassfutter auf die Trockenmasse umrechnen?
7. Was sagt die Note und was nicht?
8. Werden meine Eingaben gespeichert?

### 7.6 Schema.org (über `json-ld.tsx`)

- **WebApplication** je Unterseite:
  - `applicationCategory: "UtilitiesApplication"` (nicht „HealthApplication“, wegen Gesundheitsbezug)
  - `operatingSystem: "Web"`, `inLanguage: "de"`, `isAccessibleForFree: true`, `offers {price: 0, priceCurrency: "EUR"}`
  - `author` Sebastian Kraft, `publisher` Karpas Web Solutions Ltd., `dateModified`
  - **Kein `aggregateRating`** ohne echte Bewertungen. Google zeigt Software-Rich-Results nur mit Bewertungen. Ein Rich Result ist also nicht zu erwarten, das Markup hilft trotzdem beim Verständnis. Quelle: https://developers.google.com/search/docs/appearance/structured-data/software-app
- **FAQPage:** ja, fürs Verständnis. FAQ-Rich-Results zeigt Google seit August 2023 nur noch für Behörden- und Gesundheitsseiten. Quelle: https://developers.google.com/search/blog/2023/08/howto-faq-changes
- **HowTo:** Google zeigt dafür keine Rich Results mehr (gleiche Quelle). Empfehlung: weglassen.
- **BreadcrumbList:** ja.

### 7.7 Interne Verlinkung

Anker abwechseln, immer beschreibend.

| Quelle | Ziel | Anker (Beispiel) |
|---|---|---|
| Startseite (Abschnitt 10) | Hub + beide | „Futterrechner für Hund und Katze“ |
| futtermenge-hund-berechnen | /hund | „Futtermenge mit dem Futterrechner Hund berechnen“ |
| futtermenge-katze | /katze | „Futterrechner Katze“ |
| trockenmasse-berechnen-nass-trockenfutter | beide | „Trockenmasse automatisch ausrechnen lassen“ |
| rohasche-im-futter | beide | „Rohasche im Futterrechner einordnen“ |
| bestes-hundefutter-zusammensetzung | /hund | „Hundefutter prüfen mit dem Futterrechner“ |
| futterdeklaration-richtig-lesen | Hub | „Analysewerte in den Futterrechner eintippen“ |
| welpenfutter-wie-lange | /hund | „Futtermenge für Welpen berechnen“ |
| kittenfutter-wie-lange | /katze | „Futtermenge für Kitten berechnen“ |
| seniorenfutter-hund | /hund | „Futterrechner für ältere Hunde“ |
| taurin-katze | /katze | „Taurin im Katzenfutter prüfen“ |
| alleinfuttermittel-ergaenzungsfuttermittel | Hub | „Futterrechner“ |
| nassfutter-oder-trockenfutter-katze | /katze | „Nass- und Trockenfutter vergleichen“ |
| katzenfutter-richtig-auswaehlen | /katze | „Katzenfutter prüfen“ |
| fleischanteil-hundefutter-katzenfutter | Hub | „Nährwerte berechnen“ |
| wie-viele-leckerlis-am-tag | beide | „Leckerli-Budget berechnen“ |
| futterumstellung-hund / futterumstellung-katze | jeweilige | „Tagesmenge für das neue Futter berechnen“ |
| hundefutter-ohne-hochglanz-was-im-napf-zaehlt, getreidefreies-hundefutter-sinnvoll, zucker-im-hundefutter-katzenfutter, ergaenzungsfutter-katze, nassfutter-test-rind-hund-oktober-2026, trockenfutter-einweichen, monoprotein-futter, kaltgepresstes-hundefutter | passend | Satz im Fließtext |
| /methodik | Hub | „Schnelle Nährwert-Prüfung: Futterrechner“ |
| Lexikon/Glossar: Trockenmasse, Rohprotein, Rohasche, NfE, Taurin | passend | ein Satz |

- Rückwärts verlinkt der Rechner auf diese Artikel, auf `/methodik` und auf `/tests`.
- Links in Blog-Bodies sind DB-Änderungen an veröffentlichten Beiträgen. Sie laufen über den normalen Freigabeweg und gehören nicht zu diesem Konzept.

### 7.8 Kannibalisierungsplan

| Keyword | Gehört zu | Regel |
|---|---|---|
| futterrechner hund/katze, futter rechner | Rechner | – |
| hundefutter rechner, katzenfutter rechner (+ nass/trocken/welpe/kitten) | Rechner | – |
| hundefutter prüfen, hundefutter check, analytische bestandteile berechnen | Rechner | – |
| kcal/kalorien hundefutter/katzenfutter berechnen | Rechner | – |
| nfe rechner, nfe berechnen | Rechner (NfE nur Info) | – |
| **futtermenge hund rechner** | **Rechner**, neu | Aus dem Keyword-Plan des Artikels herausnehmen. Artikel verlinkt mit diesem Anker. |
| **futtermenge katze rechner** | **Rechner**, neu | ebenso |
| futtermenge hund berechnen, … tabelle, … formel, kalorienbedarf hund (+ kg) | futtermenge-hund-berechnen | Rechner nutzt „Futtermenge“ nur in H3 und Text, nie in H1 oder Title |
| futtermenge katze, … tabelle, kalorienbedarf katze, kastrierte katze | futtermenge-katze | wie oben |
| trockenmasse/trockensubstanz berechnen (formel, nassfutter) | trockenmasse-berechnen-nass-trockenfutter | Rechner erklärt TS nur kurz und verlinkt |
| rohasche hundefutter wieviel | rohasche-im-futter | Rechner verlinkt |
| rohprotein hundefutter/katzenfutter wieviel | Rechner (H2 mit FEDIAF-Tabelle), bis es einen eigenen Artikel gibt | – |

**Aufgabe nach Livegang:** `/workspace/seo/fachbeitraege-keywords-2026-10-26/plan.md` anpassen und die „rechner“-Varianten bei beiden Futtermengen-Artikeln streichen.

### 7.9 Bildideen (Grok, ohne Text im Bild)

Zusätzlich zu den 6 Infografiken:

1. `futterrechner-hund-trockenfutter-napf.webp`: Labrador vor Napf mit Trockenfutter, Küchenwaage daneben. Alt: „Hund vor einem Napf Trockenfutter neben einer Küchenwaage“
2. `futterrechner-katze-nassfutter-schale.webp`: getigerte Katze an einer Schale Nassfutter. Alt: „Katze frisst Nassfutter aus einer Schale“
3. `hundefutter-pruefen-etikett-smartphone.webp`: Hände mit neutraler Futterpackung und Smartphone. Alt: „Futterpackung und Smartphone beim Eintippen der Analysewerte“
4. `futtermenge-welpe-rechner.webp`: Welpe neben einer abgewogenen Portion. Alt: „Welpe neben abgewogener Futterportion“
5. Optional `kitten-futtermenge-rechner.webp`: Kitten vor kleiner Schale. Alt: „Kitten vor einer kleinen Futterschale“

Keine erkennbaren Marken und keine Schrift im Bild.

### 7.10 Backlinks und Linkbait

- **Einbett-Widget** `/futterrechner/embed` (noindex, iframe):
  - Pflicht-Backlink im Einbettcode: „Rechner von Futterprüfer.de“
  - Für Hundeschulen, Züchter, Tierheime, Praxis-Blogs
  - Phase 2, nach Freigabe
- **Datenstück:** „38 getestete Alleinfutter durch den Rechner: Fast alle erreichen FEDIAF, trotzdem fallen viele im Test durch.“
  - Zitierfähig für Presse.
  - Ohne Produktnamen bei Rechner-Ergebnissen (3.7).
- **Infografiken** zur Einbindung mit Namensnennung freigeben (Embed-Code mit Link).
- **Teilen-Link** mit genau den eingegebenen Werten: brauchbar für Foren- und Reddit-Antworten.
- **Outreach** nur nach Mannis Freigabe. **Nichts davon ist versendet.**

---

## 8. Sechs Infografiken („wo alles erklärt, umfangreich, verständlich“)

### 8.0 Produktion (für alle sechs)

**Keine KI-Bilder mit Text.** Der Designer baut jede Grafik als **React/SVG-Komponente** mit echtem Text:
- auf der Seite inline als `<figure>` mit `<figcaption>`: Text ist lesbar, durchsuchbar, zoombar und im Dark Mode umschaltbar;
- zusätzlich per Build-Skript (sharp ist im Repo) als **WebP-Export** für Bildersuche, OG und Einbettung.

**Formate**
- Master 1080 × 1350 px (4:5, mobil ideal), WebP ≤ 150 KB
- Querformat 1600 × 900 für Desktop und Einbettung
- Auf der Seite responsiv: bei 390 px volle Breite, ab `lg` max. 760 px

**Stil**
- Hintergrund `bg-soft` #f4f8f7, Karten `surface` #ffffff mit `border` #dde7e5, Ecken 24 px
- Überschrift `font-display` in `brand-strong` #063d3d, Fließtext `fg` #12201f, Nebentext `muted` #4b5f5d
- Ampel: good #15803d / good-soft #dcfce7 · mid #854d0e / mid-fill #eab308 / mid-soft #fef9c3 · bad #b91c1c / bad-soft #fee2e2
- Akzentlinie `lime` #3f8f12, Hervorhebung `brand` #0a5654. Orange `accent` #c2410c nur für das Futterprüfer-Logo und die Fußzeile „futterprüfer.de/futterrechner“.
- Icons lucide-artig, Linienstärke 2 px, keine Fotos
- Jede Grafik hat unten eine Quellenzeile (6–7 pt) und das Logo.
- **Dark-Variante** aus den Dark-Tokens (bg #0c1413, surface #152221, brand #3cc2b8).

**Zahlen:** Alle Zahlen stammen aus Abschnitt 2 oder aus den Testfällen in Abschnitt 9. Beim Bau nicht neu runden.

### Infografik 1: „Die Analysewerte auf der Packung lesen“

- **Datei:** `analytische-bestandteile-hundefutter-erklaert.webp`
- **Alt:** „Etikett eines Hundefutters mit erklärten analytischen Bestandteilen: Rohprotein, Rohfett, Rohfaser, Rohasche und Feuchte“
- **Platzierung:**
  - Etikett-Hilfe im Rechner („Wo steht das?“)
  - H2 „So rechnet der Futterrechner“ (Schritt 1)
  - Vorschlag zusätzlich in futterdeklaration-richtig-lesen (DB-Änderung, Freigabe nötig)
- **Layout:** Links ein stilisiertes Etikett (neutral, ohne Marke) mit dem Block „Analytische Bestandteile: Rohprotein 25 % · Rohfett 14 % · Rohfaser 2,5 % · Rohasche 7 % · Feuchtigkeit 10 % · Calcium 1,3 % · Phosphor 0,95 %“ und „Zusatzstoffe je kg: … Taurin 1.000 mg“. Rechts Callouts mit Pfeilen.
- **Inhalt der Callouts:**
  1. „Pflicht bei Hunde- und Katzenfutter: Rohprotein, Rohfett, Rohfaser, Rohasche (VO (EG) 767/2009, Anhang VII Kap. II)“
  2. „Feuchte: Pflicht erst über 14 %. Fehlt sie bei Trockenfutter, rechnen wir mit 10 %.“
  3. „Rohasche = Mineralstoffe. Auch ‚Ascherückstand‘ oder ‚anorganischer Stoff‘.“
  4. „Calcium und Phosphor: freiwillig. Fehlen sie, fragen Sie den Hersteller.“
  5. „Taurin unter Zusatzstoffe = zugesetzte Menge, nicht der Gesamtgehalt.“
  6. „Alle Werte gelten für das Futter, wie es in der Packung ist, inklusive Wasser.“
- **Quellenzeile:** VO (EG) 767/2009 · FEDIAF Labelling Code

### Infografik 2: „Trockenmasse: so werden Nass- und Trockenfutter vergleichbar“

- **Datei:** `trockensubstanz-berechnen-nassfutter-trockenfutter.webp`
- **Alt:** „Rechenbeispiel Trockenmasse: Nassfutter mit 10,5 Prozent Protein hat 47,7 Prozent in der Trockenmasse, Trockenfutter mit 25 Prozent hat 27,8 Prozent“
- **Platzierung:** H3 „Schritt 1: Trockenmasse“; Vorschlag zusätzlich in trockenmasse-berechnen-nass-trockenfutter
- **Layout:** Zwei Spalten mit je einem Napf-Icon. Darunter ein Balken: Wasseranteil grau, Trockenmasse in `brand`. Unten die Formel groß.
- **Inhalt:**
  - **Nassfutter:** 10,5 % Rohprotein, 78 % Feuchte → Trockenmasse 22 % → 10,5 ÷ 22 × 100 = **47,7 % Protein in der TS**
  - **Trockenfutter:** 25 % Rohprotein, 10 % Feuchte → TS 90 % → 25 ÷ 90 × 100 = **27,8 % Protein in der TS**
  - Formel: „Wert in TS = Wert ÷ (100 − Feuchte) × 100“
  - Merksatz: „Auf der Packung wirkt Nassfutter eiweißarm, in der Trockenmasse ist es oft reicher.“
  - Fußnote: „Noch fairer ist der Vergleich je 1000 kcal (Grafik 4).“
- **Quellenzeile:** FEDIAF 2025, Tab. III-3a; Testfälle T1/T2

### Infografik 3: „Wie viele Kalorien braucht mein Tier?“

- **Datei:** `kalorienbedarf-hund-katze-berechnen.webp`
- **Alt:** „Energiebedarf von Hund und Katze nach FEDIAF: Faktoren nach Aktivität und Lebensphase mit Rechenbeispielen“
- **Platzierung:** H3 „Schritt 3: Energiebedarf“, auf beiden Unterseiten (Hund-Seite Hund oben, Katze-Seite Katze oben)
- **Layout:** Zwei Karten übereinander.
- **Karte Hund:** „MER = Faktor × Gewicht^0,75“. Daneben ein Faktor-Stapel als horizontale Balken:
  - wenig aktiv 95
  - normal 3–7 J 110
  - 1–2 J 130
  - sportlich 125
  - Arbeitshund 150–175
  - Senior 95
  - kastriert ≈ −10 %
- **Beispiel Hund:** „20 kg, normal aktiv: 110 × 20^0,75 = **1.040 kcal/Tag**“
- **Welpe:** „(254,1 − 135 × aktuell/Endgewicht) × Gewicht^0,75. Beispiel 12 kg von 30 kg: **1.290 kcal/Tag**“
- **Karte Katze:** „MER = Faktor × Gewicht^0,67“
  - kastriert/Wohnung 75 (52–75)
  - Freigang 100
  - Kitten bis 4 Mon. ×2,0–2,5 · 4–9 Mon. ×1,75–2,0 · 9–12 Mon. ×1,5
- **Beispiel Katze:** „4,5 kg, kastriert: 75 × 4,5^0,67 = **206 kcal/Tag**“
- **Fußleiste:** „Startwert, kein Muss: Diese Werte können den Bedarf um 10–60 % überschätzen. Wiegen und anpassen.“
- **Quellenzeile:** FEDIAF 2025, Tab. VII-6, VII-7, VII-8b, VII-9, VII-10; AAHA 2021

### Infografik 4: „Protein und Fett je 1000 kcal: die FEDIAF-Ampel“

- **Datei:** `rohprotein-hundefutter-wieviel-fediaf.webp`
- **Alt:** „Ampelskala Rohprotein und Rohfett je 1000 kcal mit FEDIAF-Mindestwerten für Hund und Katze nach Lebensphase“
- **Platzierung:** H2 „Wie viel Rohprotein und Rohfett braucht Hunde-/Katzenfutter?“ Die Katzen-Seite zeigt die Katzen-Hälfte zuerst.
- **Layout:** Je Zeile eine horizontale Skala mit drei Zonen:
  - < 90 % des Minimums = bad
  - 90–99 % = mid
  - ≥ 100 % = good
  - Das Minimum als dicke Linie mit Zahl.
- **Zeilen Protein** (g/1000 kcal):
  - Hund adult 45 · Hund wenig aktiv/Senior 52,1 · Welpe < 14 Wo. 62,5 · Welpe ≥ 14 Wo. 50
  - Katze Freigang 62,5 · Katze kastriert/Wohnung 83,3 · Kitten 70
- **Zeilen Fett:** Hund adult 13,75 · Welpe 21,25 · Katze 22,5
- **Beispiel-Marker:**
  - „Beispiel T1: 67 g Protein → 1,5-fach“ (Zone good)
  - „Beispiel T7: 49 g bei 52,1 nötig → 94 %“ (Zone mid)
- **Merksatz:** „Wer weniger frisst, braucht mehr Nährstoff pro Kalorie. Deshalb ist der Wert für kastrierte Katzen höher.“
- **Quellenzeile:** FEDIAF 2025, Tab. III-3b, III-4b

### Infografik 5: „Calcium, Phosphor und Rohasche einordnen“

- **Datei:** `calcium-phosphor-verhaeltnis-hundefutter-katzenfutter.webp`
- **Alt:** „Empfohlene Calcium-Phosphor-Verhältnisse für Hund, Welpe, Katze und Kitten sowie typischer Rohaschegehalt in der Trockenmasse“
- **Platzierung:** H2 „Calcium, Phosphor und Rohasche richtig einordnen“; Vorschlag zusätzlich in rohasche-im-futter
- **Layout oben:** Waage-Icon, darunter Bereichsbalken auf einer Skala 0,5 : 1 bis 3 : 1:
  - Hund adult 1–2 : 1
  - Welpe < 14 Wo. 1–1,6 : 1
  - Welpe ≥ 14 Wo. bis 15 kg Endgewicht 1–1,8 : 1, darüber 1–1,6 : 1
  - Katze adult 1–2 : 1
  - Kitten 1–1,5 : 1
  - Beispiel-Punkte: T1 1,37 (im Bereich), T7 3,0 (außerhalb)
- **Layout unten:** Rohasche-Balken in % TS:
  - gemessene Spanne 4,8–9,9 % TS bei 30 Hunde-Trockenfuttern (Mittel 7,1)
  - Rechner-Band 3–12 % als gestrichelter Rahmen, beschriftet „eigene Festlegung“
  - Hinweis: „Rohasche ist eine Summe. Sie sagt nicht, welche Mineralstoffe drin sind.“
- **Quellenzeile:** FEDIAF 2025, Tab. III-3a, III-4a; Kazimierska et al. 2020

### Infografik 6: „So bewertet der Futterrechner und was die Analyse nicht zeigt“

- **Datei:** `hundefutter-pruefen-bewertung-futterrechner.webp`
- **Alt:** „Punkteschema des Futterrechners von sehr gut bis mangelhaft und Liste dessen, was Analysewerte nicht zeigen“
- **Platzierung:** H2 „So bewerten wir“; OG-Bild aller drei Seiten (Querformat); Hub-Seite
- **Layout links „Was wir rechnen“:** Punktebalken
  - Protein 35 · Fett 20 · Ca/P 20 · Taurin 10 (Katze) · Plausibilität 15
  - Notenleiste: ≥ 90 sehr gut · 80–89 gut · 70–79 befriedigend · 60–69 ausreichend · < 60 mangelhaft
  - Deckel-Hinweis: „Unter 90 % des FEDIAF-Minimums: höchstens mangelhaft“
- **Layout rechts „Was die Analyse nicht zeigt“:** Liste mit durchgestrichenem Auge-Icon
  - Herkunft und Qualität der Rohstoffe
  - Fleischanteil
  - Zusatzstoffe und Konservierung
  - Schadstoffe
  - Verarbeitung
  - Deklaration
- **Unten:** Pfeil „Das prüfen unsere Tests nach 100-Punkte-Methodik → futterprüfer.de/tests“
- **Quellenzeile:** Futterprüfer-Methodik (Stand 26.10.2026); FEDIAF 2025

---

## 9. Technische Skizze für den Designer

### 9.1 Grundsätze

- Reines Client-TypeScript, keine DB-Zugriffe im Rechner, keine API-Route, keine Server Action.
- Die einzige Server-Datenquelle ist die CTA-Liste (nur lesend, ISR).
- Alle Rechenfunktionen sind **pur** (Eingabe → Ausgabe), ohne React. So lassen sie sich mit Vitest testen.
- Alle FEDIAF-Zahlen leben in **einer** Datei mit Quellenkommentar je Wert (Tabelle und Seite).
- Python-Vorlage: `ref/rechner.py`. Der TS-Port muss die Testfälle in 9.4 auf ±0,1 treffen.

### 9.2 Dateistruktur (Next.js 16, App Router)

```
src/lib/futterrechner/
  fediaf.ts          // Konstanten: Mindestwerte je 1000 kcal, Ca/P-Regeln, Taurin, MER-Faktoren (mit Quellenkommentar)
  types.ts           // FutterInput, TierInput, Ergebnis, Grund (Warum-Eintrag)
  validierung.ts     // zod-Schemas + Plausibilitätsregeln (1.2), liefert Fehler/Warnungen
  energie.ts         // trockenmasse(), nfe(), meNrc2006(art, werte) -> {ge, dig, de, me}
  bedarf.ts          // rer(), merHund(), merWelpe(), merKatze(), merKitten(), spanne()
  naehrstoffe.ts     // proTausendKcal(), fediafSpalte(), caPCheck(), taurinCheck(), ascheCheck()
  bewertung.ts       // punkte(), note(), deckel() -> Ergebnis inkl. Gründe
  texte.ts           // Warum-Bausteine (3.6) als Funktionen mit Zahlen
  hash.ts            // encode/decode #-Fragment (nur Zahlen und Enums, Versionierung v=1)
  index.ts           // berechne(futter, tier): Ergebnis
  *.test.ts          // Vitest, je Datei; testfaelle.test.ts mit T1–T8
src/components/futterrechner/
  rechner.tsx            // 'use client', State, Hash-Sync, Layout der 3 Karten
  value-slider.tsx       // Regler + Zahlenfeld + FEDIAF-Marker (6.2)
  chip-group.tsx         // Radio-Chips mit Icons (6.4)
  ergebnis-karte.tsx     // Gauge, Badge, Menge, Warum-Liste, Rechenweg
  gauge.tsx              // SVG-Halbkreis, framer-motion
  ergebnis-leiste.tsx    // Sticky mobil
  test-ctas.tsx          // Server Component, liest Review (Grün/Gelb, Ausschlussliste)
  infografiken/*.tsx     // 6 SVG-Komponenten (Abschnitt 8)
  startseiten-teaser.tsx // Abschnitt 10
  inline-teaser.tsx      // für Blog und Tests
src/app/(site)/futterrechner/
  page.tsx               // Hub (Server Component, metadata, JSON-LD)
  hund/page.tsx          // metadata, H1, <Rechner art="hund" />, SEO-Text, FAQ, JSON-LD
  katze/page.tsx
scripts/export-infografiken.mts  // SVG -> WebP (sharp)
e2e/futterrechner.spec.ts        // Playwright, Viewport 390x844: Regler per Tastatur, Hash-Restore, Note sichtbar
```

- Sitemap: drei URLs ergänzen.
- `robots`: Embed-Seite (Phase 2) `noindex`.
- Kein `localStorage`, keine Cookies.

### 9.3 Rundung und Anzeige

| Größe | Darstellung |
|---|---|
| Prozentwerte | 1 Nachkommastelle |
| g/1000 kcal | ganze Zahl (Minima mit Originalnachkommastellen: 52,1 / 13,75) |
| kcal | ganze Zahl, Tausenderpunkt |
| Tagesmenge | ganze Gramm, Spanne ±10 % |
| Ca:P | 2 Nachkommastellen |
| Punkte | gerundet |

- Deutsches Zahlenformat über `Intl.NumberFormat('de-DE')`.
- Gerechnet wird ungerundet, gerundet wird erst in der Anzeige.

### 9.4 Testfälle (Eingabe → Zwischenwerte → Ergebnis)

Alle Werte stammen aus `ref/testfaelle.py`. ME und Mengen ohne Herstellerangabe, also mit unserer Schätzung. Die Futter sind **fiktiv**; Ähnlichkeiten mit Produkten sind Zufall. Öffentliche Beispiele im SEO-Text verwenden nur diese fiktiven Futter.

**T1 Hund adult, Trockenfutter (Standardfall)**
- **Eingabe:** RP 25, RFe 14, RFa 2,5, RA 7, Feuchte 10, Ca 1,3, P 0,95 · Hund 20 kg, 3–7 J, normal, unkastriert
- **Zwischenwerte:**
  - TS 90 %
  - NfE 41,5 % (46,1 % TS)
  - GE 454,5 · Verdaulichkeit 87,23 % · DE 396,5 · **ME 370,5 kcal/100 g**
- **Bedarf:** Faktor 110 → **1.040 kcal/Tag** (936–1.144)
- **Menge:** **281 g/Tag** (253–309)
- **Nährstoffe:**
  - Spalte adult 110
  - Protein 67,5 g/1000 kcal (Min. 45 → 1,50) → 35 P
  - Fett 37,8 (Min. 13,75 → 2,75) → 20 P
  - Ca:P 1,37, Ca 1,44 % TS, P 1,06 % TS → 20 P
  - Rohasche 7,8 % TS → Plausibilität 15 P
- **Ergebnis:** 90/90 = **100 → sehr gut**

**T2 Hund adult, Nassfutter, kastriert, wenig aktiv**
- **Eingabe:** RP 10,5, RFe 7, RFa 0,5, RA 2,2, Feuchte 78, Ca 0,3, P 0,22 · 10 kg, 3–7 J, wenig aktiv, kastriert
- **Zwischenwerte:**
  - TS 22 %
  - NfE 1,8 % (8,2 % TS)
  - GE 135,1 · Verdaulichkeit 87,95 % · DE 118,8 · **ME 107,9 kcal/100 g**
- **Bedarf:** Faktor 95 × 0,9 = 85,5 → **481 kcal/Tag**
- **Menge:** **446 g/Tag** (401–490)
- **Nährstoffe:**
  - Spalte adult 95 (Faktor ≤ 100)
  - Protein 97,3 (Min. 52,1 → 1,87) → 35
  - Fett 64,9 (→ 4,72) → 20
  - Ca:P 1,36, Ca 1,36 % TS → 20
  - Rohasche 10,0 % TS → 15
- **Ergebnis:** **100 → sehr gut**

**T3 Welpe, 17 Wochen, 12 kg, Endgewicht 30 kg, Welpen-Trockenfutter**
- **Eingabe:** RP 28, RFe 17, RFa 2,5, RA 7,5, Feuchte 10, Ca 1,3, P 1,0
- **Zwischenwerte:**
  - TS 90 %
  - NfE 35 %
  - GE 473,2 · Verdaulichkeit 87,23 % · DE 412,7 · **ME 383,6**
- **Bedarf:** (254,1 − 135 × 12/30) × 12^0,75 = **1.290 kcal/Tag**
- **Menge:** **336 g/Tag** (303–370)
- **Nährstoffe:**
  - Spalte Wachstum ≥ 14 Wo.
  - Protein 73,0 (Min. 50 → 1,46) → 35
  - Fett 44,3 (Min. 21,25 → 2,09) → 20
  - Ca:P 1,30 (erlaubt 1–1,6, Endgewicht > 15 kg); Ca 1,44 % TS (1,0–1,8) → 20
  - Plausibilität 15
- **Ergebnis:** **100 → sehr gut**
- **Variante T3b:** gleicher Welpe mit dem Adult-Futter aus T1 → Protein 1,35, Fett 1,78, Ca 1,44 % TS, Ca:P 1,37 → ebenfalls 100. Menge 348 g.
  - Lehre: Der Rechner prüft nur die Werte, die er kennt, nicht z. B. Aminosäuren oder Spurenelemente.
  - Hinweistext bei Welpen immer: „Für Welpen ist ein Futter mit Angabe ‚für Welpen/Wachstum‘ der sichere Weg.“

**T4 Senior-Hund, 10 Jahre, 25 kg, kastriert, normal aktiv; Feuchte und Ca/P fehlen**
- **Eingabe:** RP 22, RFe 10, RFa 3,5, RA 6, Feuchte –
- **Zwischenwerte:**
  - Feuchte 10 % angenommen
  - TS 90 %
  - NfE 48,5 %
  - GE 432,6 · Verdaulichkeit 85,64 % · DE 370,5 · **ME 347,6**
- **Bedarf:** Faktor 95 × 0,9 = 85,5 → **956 kcal/Tag**
- **Menge:** **275 g/Tag** (248–303)
- **Nährstoffe:**
  - Spalte adult 95
  - Protein 63,3 (Min. 52,1 → 1,21) → 30
  - Fett 28,8 (→ 2,09) → 20
  - Ca/P nicht bewertbar
  - Plausibilität 15 − 5 (Feuchte geschätzt) = 10
- **Ergebnis:** 60/70 = **86 → gut** (wäre ohnehin gut; Deckel „gut“ wegen fehlendem Ca/P)
- **Warum-Liste:** Feuchte geschätzt, Ca/P fehlt, Protein reicht für ältere Hunde.

**T5 Katze adult, Nassfutter, kastriert, Wohnung, 4,5 kg**
- **Eingabe:** RP 11, RFe 5,5, RFa 0,4, RA 2,0, Feuchte 80, Ca 0,3, P 0,22, Taurin 1.000 mg/kg
- **Zwischenwerte:**
  - TS 20 %
  - NfE 1,1 %
  - GE 120,6 · Verdaulichkeit 86,14 % · DE 103,8 · **ME 95,4**
- **Bedarf:** 75 × 4,5^0,67 = **206 kcal/Tag**
- **Menge:** **215 g/Tag** (194–237)
- **Nährstoffe:**
  - Spalte adult 75
  - Protein 115,3 (Min. 83,3 → 1,38) → 35
  - Fett 57,7 (Min. 22,5 → 2,56) → 20
  - Ca:P 1,36 → 20
  - Taurin 0,50 % TS (Min. Nass 0,27) → 10
  - Rohasche 10 % TS → 15
- **Ergebnis:** 100/100 = **100 → sehr gut**

**T6 Kitten, 5 Monate, 2,5 kg, Trockenfutter**
- **Eingabe:** RP 34, RFe 20, RFa 2, RA 7,5, Feuchte 8, Ca 1,2, P 1,0, Taurin 2.000 mg/kg
- **Zwischenwerte:**
  - TS 92 %
  - NfE 28,5 %
  - GE 506,9 · Verdaulichkeit 85,99 % · DE 435,8 · **ME 409,6**
- **Bedarf:** 100 × 2,5^0,67 × 1,875 (4–9 Monate) = **346 kcal/Tag**
- **Menge:** **85 g/Tag** (76–93)
- **Nährstoffe:**
  - Spalte Wachstum
  - Protein 83,0 (Min. 70 → 1,19) → 30
  - Fett 48,8 (→ 2,17) → 20
  - Ca:P 1,20 (1–1,5), Ca 1,30 % TS (≥ 1,0) → 20
  - Taurin 0,22 % TS (Min. trocken 0,10) → 10
  - Plausibilität 15
- **Ergebnis:** 95/100 = **95 → sehr gut**

**T7 Mangelhaftes Futter: Hund adult, 15 kg, wenig aktiv, Trockenfutter**
- **Eingabe:** RP 15, RFe 4,5, RFa 4, RA 9,5, Feuchte 10, Ca 2,4, P 0,8
- **Zwischenwerte:**
  - TS 90 %
  - NfE 57 % (63,3 % TS)
  - GE 377,9 · Verdaulichkeit 84,84 % · DE 320,6 · **ME 305,0**
- **Bedarf:** Faktor 95 → **724 kcal/Tag**
- **Menge:** **237 g/Tag**
- **Nährstoffe:**
  - Spalte adult 95
  - Protein 49,2 (Min. 52,1 → 0,94) → 10, **Deckel ausreichend**
  - Fett 14,8 (→ 1,07) → 14
  - Ca:P 3,0 (max. 2) → 0
  - Ca 2,67 % TS > Höchstwert 2,5 → **Deckel ausreichend**
  - Rohasche 10,6 % TS → 15
- **Ergebnis:** 39/90 = **43 → mangelhaft**
- **Warum:** Protein knapp unter Minimum, Calcium über Höchstwert, Ca:P zu hoch.

**T8 Ergänzungsfutter: Katzen-Snack (keine Note)**
- **Eingabe:** RP 30, RFe 12, RFa 2, RA 7, Feuchte 18 · Katze 4,5 kg kastriert
- **ME:** 336 kcal/100 g
- **Tagesbedarf:** 206 kcal → **Leckerli-Budget 21 kcal ≈ 6 g/Tag**
- **Ausgabe:** Info-Karte statt Note.

**Zusätzliche Unit-Tests (Kantenfälle)**
- Summe 103 % → `status: unplausibel`
- Nassfutter ohne Feuchte → Pflichtfeld-Fehler
- NfE −1 → auf 0 gesetzt, Hinweis
- Herstellerenergie 3.600 kcal/kg → 360 kcal/100 g wird verwendet
- MJ-Umrechnung 15 MJ/kg → 358,5 kcal/100 g
- Welpe 8 Wochen → Spalte „Wachstum früh“ (Protein-Min. 62,5)
- Welpe ohne Endgewicht → keine Menge
- Hund mit Rohfaser 9 % TS → Hinweis + −5
- Katze unkastriert Freigang → Spalte 100 (Protein-Min. 62,5)
- Hash encode/decode als Roundtrip; manipulierte Hash-Werte werden von zod verworfen

---

## 10. Startseite & Erreichbarkeit („Startseite Box, so leicht erreichbar“)

### 10.1 Teaser-Box auf der Startseite (umsetzbar ohne Layoutänderung)

**Platz:** direkt **nach `HomeHero`, vor dem Ticker** in `src/app/(site)/page.tsx`.
- Das fügt eine Sektion ein, ohne bestehende Bereiche umzubauen.
- Ob das schon als Layoutänderung gilt, entscheidet Manni (Frage 2 in Abschnitt 11).

**Above the fold:** Bei 390 × 844 px füllt der HomeHero vermutlich den ersten Bildschirm. Die Box sitzt dann knapp darunter (erster Wisch). Echt „above the fold“ geht nur mit einer Mini-Zeile im Hero selbst, siehe 10.2 (Vorschlag).

**Layout 390 px** (Höhe ca. 250 px):

```
┌──────────────────────────────────────────┐
│ [Calculator-Icon]  NEU · FUTTERRECHNER   │  Eyebrow: text-brand, uppercase, text-xs
│ Was steckt wirklich in Ihrem Futter?     │  H2, font-heading text-2xl
│ Werte von der Packung eintippen, Note    │  1 Nutzenzeile, text-muted
│ nach FEDIAF und Tagesmenge sofort sehen. │
│ (●Trocken)(○Nass)                        │  Mini-Eingabe: Segment, min-h-11
│ [🐕 Hundefutter prüfen ]                 │  accent-Button volle Breite, min-h-12
│ [🐈 Katzenfutter prüfen]                 │  accent-Outline, volle Breite, min-h-12
│ Kostenlos · ohne Anmeldung · nichts gespeichert │ text-xs muted
└──────────────────────────────────────────┘
```

**Stil**
- `rounded-3xl bg-brand-soft` mit dezenter Illustration rechts (Napf + Gauge als Linien-SVG, nur ab `sm` sichtbar), `p-5`, `shadow-[var(--shadow)]`.
- Desktop: zweispaltig, links Text, rechts Buttons und eine kleine **animierte Gauge-Vorschau** (statisch bei reduced motion).
- Buttons im bestehenden Stil: `inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-bold text-white hover:bg-accent-strong dark:text-black`. Der zweite Button als Outline-Variante: `border-2 border-accent text-accent bg-transparent`.

**Copy**
- Eyebrow: „Neu: Futterrechner“
- H2: „Was steckt wirklich in Ihrem Futter?“
- Nutzenzeile: „Werte von der Packung eintippen, Note nach FEDIAF und Tagesmenge sofort sehen.“
- Buttons: „Hundefutter prüfen“ · „Katzenfutter prüfen“
- Mikrozeile: „Kostenlos · ohne Anmeldung · nichts gespeichert“

**Mini-Eingabe (Deep-Link):** Das Segment „Trocken/Nass“ setzt die Futterart, die Buttons wählen die Tierart. Ziele:
- `/futterrechner/hund#typ=trocken`
- `/futterrechner/katze#typ=nass`

Der Rechner liest das Fragment und setzt den Chip. Das Fragment enthält keine personenbezogenen Daten.

**Technik:** `startseiten-teaser.tsx` als Client-Komponente, nur wegen des Segments. Ohne JS funktionieren die Buttons als normale Links (Default „trocken“).

**Messung:** Vercel-Analytics-Event `teaser_klick` (Tierart, Futterart, Quelle „home“), ohne weitere Daten.

### 10.2 Navigation und Bottom-Bar (nur **VORSCHLAG**, braucht Mannis Freigabe)

- **Hauptnavigation:** „Futterrechner“ zwischen „Tests“ und „Fachblog“. Ergebnis: Start · Tests · **Futterrechner** · Fachblog · Lexikon · Methodik · Team.
- **Mobile Bottom-Bar** (heute: Start, Kategorien, Blog, Suche):
  - Variante A: 5. Eintrag „Rechner“ (lucide `Calculator`) in der Mitte, leicht hervorgehoben (Icon in `bg-brand-soft`-Kreis).
  - Variante B: „Kategorien“ durch „Rechner“ ersetzen, wenn 5 Einträge zu eng werden. Mindestbreite je Eintrag bei 390 px: 78 px, also passen 5.
- **Hero-Mini-Zeile** (echt above the fold): Unter der Hero-Suche (`hero-search.tsx`) ein Text-Link-Chip „Oder: Futter selbst prüfen → Futterrechner“, 44 px hoch.
- Alle drei ändern das Grundlayout und werden **nicht** ohne Manni gebaut.

### 10.3 Teaser in Blog-Beiträgen und Tests

**`inline-teaser.tsx`:** kompakte Box, `rounded-2xl border border-border bg-bg-soft p-4`
- Icon `Calculator` + Satz + 1 Button (accent, min-h-12)
- Copy Hund: „Wie schneidet Ihr Hundefutter ab? Analysewerte eintippen, Note und Tagesmenge sehen.“ → „Hundefutter prüfen“
- Copy Katze analog.

**In Blog-Beiträgen** (Liste aus 7.7):
- Option 1: Box als HTML-Block im Beitragstext nach „Das Wichtigste in Kürze“. Das ist eine DB-Änderung, über den normalen Freigabeweg.
- Option 2: Das Blog-Template rendert die Box automatisch für Slugs aus einer Zuordnungsliste `slug → hund|katze|beide`. Das ist eine Template-Änderung und damit ein **Vorschlag**.

**In Testseiten:** Box unter der Analysetabelle (`analysis-table.tsx`).
- Copy: „Eigenes Futter prüfen? Mit dem Futterrechner sehen Sie in einer Minute, ob die Nährwerte passen.“
- **Bewusst ohne Vorausfüllung mit den Werten des getesteten Produkts.** Sonst stünde neben „Rot, 38 Punkte“ ein „gut“ aus dem Rechner, und das verwirrt (3.7).

**Methodik-Seite:** Satz + Link im Abschnitt Nährstoffprofil.

### 10.4 SEO-Wirkung der Startseiten-Verlinkung

- Die Startseite ist die Seite mit den meisten externen Links und der höchsten internen Linkkraft. Ein Link direkt von dort gibt dem Rechner sofort Gewicht. Google wertet ihn als Signal „wichtige Seite“.
- Die Startseite wird am häufigsten gecrawlt. Neue Rechnerseiten werden so schneller gefunden und indexiert, zusätzlich über die Sitemap.
- Klickpfad-Tiefe 1 statt 3+ (heute wäre der Rechner nur über Blog-Artikel erreichbar).
- Beschreibende Anker („Hundefutter prüfen“, „Futterrechner für Hund und Katze“) stärken die Ziel-Keywords. Nicht überall denselben exakten Anker nutzen: Startseite = Nutzenanker, Navigation = „Futterrechner“, Artikel = variierende Anker.
- Nutzersignale: Ein Werkzeug hält Besucher länger und führt über die CTAs in die Tests. Das ist gut für Klicktiefe und Affiliate-Umsatz auf den Testseiten.
- Ein sitewider Nav-Link (falls freigegeben) verstärkt das, gilt aber als „Navigation“ und wiegt pro Link weniger als der redaktionelle Startseiten-Teaser.

---

## 11. Offene Fragen an Manni (nur 3)

1. **URL** `/futterrechner/hund` und `/futterrechner/katze` (+ Hub `/futterrechner`): einverstanden?
2. **Startseite und Navigation:**
   - Teaser-Box nach dem Hero einbauen: ja/nein?
   - Und welche der Vorschläge aus 10.2: Nav-Eintrag, Bottom-Bar A oder B, Hero-Mini-Zeile?
3. **Notenwörter:** „sehr gut … mangelhaft“ wie gewünscht, oder (falls die Rechtsprüfung wegen Verwechslung mit Warentest-Noten Bedenken hat) „stark / gut / solide / knapp / schwach“?

Alles andere ist im Konzept entschieden und kann der Designer bauen. Danach folgen Rechtsprüfung, Freigabe durch Manni und Livegang.

---

## 12. Quellen

1. FEDIAF Nutritional Guidelines for Complete and Complementary Pet Food for Cats and Dogs, September 2025 (Tab. III-2, III-3a/b, III-4a/b, Kap. 4, 7.2.2.2, VII-5 bis VII-10): https://europeanpetfood.org/wp-content/uploads/2025/09/FEDIAF-Nutritional-Guidelines_2025-ONLINE.pdf
2. National Research Council (2006): Nutrient Requirements of Dogs and Cats: https://nap.nationalacademies.org/catalog/10668/nutrient-requirements-of-dogs-and-cats
3. Verordnung (EG) Nr. 767/2009 über das Inverkehrbringen und die Verwendung von Futtermitteln (Art. 3, Art. 13, Anhang I Nr. 6, Anhang II Nr. 5, Anhang IV Teil A, Anhang VII Kap. II): https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32009R0767
4. Verordnung (EG) Nr. 152/2009 (Analysemethoden): https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32009R0152
5. AAHA (2021): Nutrition and Weight Management Guidelines for Dogs and Cats, Box 1: https://www.aaha.org/wp-content/uploads/globalassets/02-guidelines/2021-nutrition-and-weight-management/resourcepdfs/nutritiongl_box1.pdf · Volltext (10-%-Regel für Leckerlis): https://www.aaha.org/wp-content/uploads/2021/06/new-2021-aaha-nutrition-and-weight-management-guidelines-with-ref.pdf
6. Kazimierska K., Biel W., Witkowicz R. (2020): Mineral Composition of Cereal and Cereal-Free Dry Dog Foods versus Nutritional Guidelines. Molecules 25: 5173: https://doi.org/10.3390/molecules25215173
7. Google Search Central: Software-App-Markup: https://developers.google.com/search/docs/appearance/structured-data/software-app · Änderungen bei HowTo/FAQ (08/2023): https://developers.google.com/search/blog/2023/08/howto-faq-changes
8. Futterprüfer-Methodik (Stand 26.10.2026): /methodik · `src/lib/scoring.ts`
9. Google Autocomplete, abgefragt am 26.10.2026: `data/suggest_2026-10-26.json`
