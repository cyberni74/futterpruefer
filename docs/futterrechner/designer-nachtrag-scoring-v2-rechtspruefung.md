# Nachtrag zum Designer-Auftrag „Futter-Rechner Bewertung v2“: Auflagen der Rechtsprüfung

Stand 27.10.2026 · Repo `cyberni74/futterpruefer` · Arbeits-Branch weiterhin `feat/futterrechner-scoring-v2` · Referenz-Branch `docs/futterrechner-scoring-v2` (aktualisiert, siehe Abschnitt 1)

Dieser Nachtrag ergänzt `designer-prompt-scoring-v2.md` und **geht ihm vor**, wo sich beide widersprechen. Die Rechtsprüfung hat Bewertung v2 „freigegeben mit Auflagen A1–A9“ erteilt. Unten steht alles, was du dafür brauchst. Texte in Anführungszeichen oder als Zitat (`>`) sind **wörtlich** zu übernehmen: kein Umformulieren, Kürzen oder „Verbessern“, auch nicht bei Satzzeichen oder typografischen Anführungszeichen. `**…**` im Zitat bedeutet fett (`<strong>`).

## 0. Harte Regeln (gelten weiter, teils verschärft)
- Nur auf dem Feature-Branch `feat/futterrechner-scoring-v2` arbeiten, PR nach `main` öffnen. **Nicht mergen.** Das ersetzt §7 Punkt 4 des Hauptauftrags („Merge erst nach grünen Checks“). Der Merge erfolgt erst nach Freigabe durch Manni.
- Kein Force-Push, kein Rebase gepushter Commits, kein Commit auf `main`.
- Nichts löschen: keine Dateien, Tests, Exporte oder Konstanten. Was nicht mehr gebraucht wird, bekommt `@deprecated`.
- Keine DB- oder Supabase-Schreibzugriffe, keine Migrationen, kein Prisma-Write, keine Änderung an Review-Daten.
- Keine Änderung an Farben, Layout, Notenwörtern (`NOTEN`), Schwellen 90/80/70/60, Gauge oder Ampel.
- **390-px-Check** (hell und dunkel) mit Screenshots im PR, siehe Abschnitt 9.
- **Slider-Blasen:** Jede Slider-Blase zeigt immer genau denselben Wert wie die Anzeige bzw. das Eingabefeld daneben, auch beim Alters-Regler (Wochen/Monate/Jahre). `slider-blase.test.tsx` muss grün bleiben. Prüfe das im 390-px-Check bei mindestens drei Positionen je Regler.
- **Sperrwörter:** Die Wörter „zulässig“, „unzulässig“, „Rechtlich angreifbar“ und „Betrug“ sowie „unabhängig“ in Bezug auf uns (Futterprüfer) dürfen in keinem sichtbaren Text, Alt-Text, Meta-Text oder FAQ vorkommen. Lege dafür einen Vitest an, der `texte.ts`, `fazit-texte.ts`, `risiken-daten.ts`, `seo.ts` und die Komponenten unter `src/components/futterrechner/` auf diese Wörter prüft (Groß-/Kleinschreibung egal; „unabhängig“ nur melden, wenn es in einem sichtbaren Text steht).
- Keine Produkt- oder Markennamen in Texten, Beispielen, Tests, Screenshots oder in der PR-Beschreibung (A2, Abschnitt 8).

## 1. Referenz aktualisiert (`docs/futterrechner-scoring-v2`, Ordner `docs/futterrechner/`)
- `rechner.py`: neue Schalter `KOLLAGEN_ABZUG_AKTIV`, `KOLL_STUFE1_MAX`, `UNTERGRENZE_FEDIAF_KONFORM` und `UNTERGRENZE_WERT`. Dazu `kollagen()` nach A5 und die Untergrenze nach A1 in `bewerte()`. `bewerte(futter, tier, untergrenze=None, abzug_aktiv=None, stufe1_max=None)` überschreibt die Schalter nur für Tests.
- `testfaelle.py`: 21 Fälle × 4 Konfigurationen = 84 Sollwerte. `python3 docs/futterrechner/testfaelle.py` muss „Alle 84 Sollwerte erfüllt“ ausgeben.
- `kalibrierung_v2.py`: Verteilungen je Konfiguration (nur intern, braucht lokale Review.json, nicht für CI).
- Die Python-Referenz bleibt maßgeblich (Ausnahme wie bisher: `caPCheck`/`caRegel`).

## 2. Schalter in `fediaf.ts` (neu, Auslieferungszustand)
```ts
/** A5(e) Rechtsprüfung 27.10.2026: Kollagen-Punktabzug. Bleibt false, bis alles aus diesem Nachtrag umgesetzt ist. Aktivierung erfolgt separat, nicht eigenmächtig umstellen. */
export const KOLLAGEN_ABZUG_AKTIV = false;
/** A5(a): Stufe-1-Abzug (nur Nährwerte). 0 = nur Hinweis. Höchstens 3, kein Ca-Zusatzabzug. */
export const KOLL_STUFE1_MAX = 0;
export const KOLL_STUFE1_MAX_GRENZE = 3;
/** A1: Untergrenze 60 für FEDIAF-konforme Futter. Entscheidung offen, deshalb false. Aktivierung erfolgt separat. */
export const UNTERGRENZE_FEDIAF_KONFORM = false;
export const UNTERGRENZE_WERT = 60;
```
- `KOLLAGEN.caTsAb`, `KOLLAGEN.caAbzug` und `KOLLAGEN.ascheMax` nicht mehr verwenden, sondern mit `@deprecated` markieren (nicht löschen).
- Die Funktionen bekommen die Schalter als optionale Parameter (wie in Python), damit Tests beide Zustände prüfen können. Die Standardwerte kommen aus den Konstanten.
- Ein Test stellt sicher, dass `KOLL_STUFE1_MAX` zwischen 0 und 3 liegt. Ein Aufruf mit 4 muss einen Fehler werfen (wie `assert` in `rechner.py`).
- `KOLLAGEN_TEXT_FREIGEGEBEN` auf `true` setzen, aber erst zusammen mit den neuen Texten aus Abschnitt 4. Die Rechtsprüfung hat K1/K2 in der Fassung unten freigegeben, eine Nachprüfung ist nicht nötig. Die alten Langtexte aus `scoring-v2.md` §4 dürfen **nirgends** erscheinen. Der Kurztext für `false` bleibt als Rückfall im Code.
- Hauptauftrag §5, letzter Satz „Der Punktabzug gilt … vom Schalter, weil er Teil der Bewertung ist.“ entfällt. Neu gilt: „Der Punktabzug ist erst aktiv, wenn A5 der Rechtsprüfung vom 27.10.2026 umgesetzt ist.“ Technisch heißt das: Abzug nur bei `KOLLAGEN_ABZUG_AKTIV === true`.

## 3. Logik

### 3.1 `kollagen()` nach A5 (ersetzt Hauptauftrag §2.2)
Signatur: `kollagen(art, pTs, aTs, caTs, zutaten, abzugAktiv = KOLLAGEN_ABZUG_AKTIV, stufe1Max = KOLL_STUFE1_MAX)`. Rückgabe:
`{ stufe1: boolean; abzugNaehrwerte: number; abzugZutaten: number; treffer: string[]; trefferStark: string[]; trefferSchwach: string[]; flag: boolean; zutatenGeprueft: boolean }`
- **Stufe 1:** `stufe1 = pTs >= proteinTsAb[art] && aTs > 10`. Abzug `a1 = stufe1 ? Math.round(lin(aTs, 10, 14) * stufe1Max) : 0`. Mit dem Standard 0 gibt es keinen Abzug, nur Hinweis K1. Der **Ca-Zusatzabzug (+2 bei Ca TS > 2,0 %) entfällt ersatzlos** (A5(a), Doppelzählung mit Ca/P). `caTs` bleibt nur als Parameter erhalten.
- **Stufe 2, starke Begriffe** (Liste unverändert): Abzug `a2 = stark.length ? Math.min(4 + 2*(stark.length-1), 6) : 0` (A5(c)).
- **Stufe 2, Sammelbegriffe** (`nebenerzeugnis`, „hydrolysat“-Regel unverändert): **kein Abzug** (A5(b)). Sie landen nur in `trefferSchwach` und lösen den K2-Zusatz aus.
- Wenn `abzugAktiv === false`, sind `a1 = a2 = 0`. Die Hinweise erscheinen trotzdem.
- `flag = stufe1 || trefferStark.length > 0 || trefferSchwach.length > 0` (Hinweis anzeigen, auch ohne Abzug).
- `zutatenListe`, Regexe, Positionen und `zutatenGeprueft` bleiben wie im Hauptauftrag.

### 3.2 Untergrenze (A1) in `bewertung.ts`, nach dem Kollagen-Abzug
```ts
const caDeckel = /* true, sobald im Ca/P-Block ein Deckel gesetzt wurde: Ca TS > caMax ODER (Wachstum && punkte.capr === 0) */;
const taurinUnterMin = art === "katze" && taurinAngegeben && taurinTs < taurinMin;
const fediafKonform = rp >= 1 && rf >= 1 && !caDeckel && !taurinUnterMin;
let score = Math.max(0, Math.round(basis - abzug));
const untergrenzeGegriffen = untergrenze && fediafKonform && score < UNTERGRENZE_WERT;
if (untergrenzeGegriffen) score = UNTERGRENZE_WERT;
// danach noteFuer(score) und die v1-Deckel wie bisher
```
- Bedingungen genau nach Rechtsprüfung: Protein ≥ 1,0 × und Fett ≥ 1,0 × FEDIAF-Minimum, kein Ca-Deckel, bei der Katze Taurin (falls angegeben) nicht unter dem Minimum. Die Untergrenze gilt **nach** jedem Kollagen-Abzug (A5(d)). Fehlt Ca/P, ist das kein Ca-Deckel; der bestehende Deckel „gut“ bleibt.
- Ohne Taurinangabe greift die Untergrenze (Taurin zählt nur, „falls angegeben“).
- `ErgebnisOk` bekommt zusätzlich `fediafKonform: boolean` und `untergrenzeGegriffen: boolean`.
- **Erklärzeile**, nur wenn `untergrenzeGegriffen === true`, als eigener Grund (`id: "untergrenze"`, `art: "info"`) direkt nach `pf`. Wortlaut:
  > Alle FEDIAF-Mindestwerte sind erfüllt. Die Energie kommt aber zu einem großen Teil aus Fett ({f} %), deshalb nur „ausreichend“.

  `{f}` = `n0(energieAnteile.f)`, also der Fett-Energieanteil als ganze Zahl.
- Ist `UNTERGRENZE_FEDIAF_KONFORM === false`, bleibt alles wie ohne Untergrenze. Kein Text erwähnt dann eine Untergrenze (siehe A6 in Abschnitt 5).

## 4. Kollagen-Hinweistexte (A3, A4, A5), ersetzen K1/K2 aus `scoring-v2.md` §4

### 4.1 Wann welcher Grund erscheint (ersetzt Hauptauftrag §2.5, Punkt `kollagen`)
- Grund `kollagen`, `art: "warn"`, nur wenn `k.flag`.
- Titel:
  - Nur Stufe 1 (`stufe1`, keine Zutaten-Treffer): „Hinweis zur Proteinqualität (nach den Nährwerten)“
  - Mindestens ein Zutaten-Treffer (stark oder schwach): „Hinweis zur Proteinqualität (nach Ihren Zutatenangaben)“
- Reihenfolge der Textteile, falls mehrere greifen:
  1. K2, wenn `trefferStark.length > 0`
  2. K2-Zusatz, wenn `trefferSchwach.length > 0`
  3. K1, wenn `stufe1`
- `{treffer}` in K2 = die gefundenen Wörter aus den starken Treffern, wie in der Zutat geschrieben, mit „, “ getrennt.
- Gibt es nur Sammelbegriffe, erscheint nur der K2-Zusatz und **kein** K2.
- `{p}` und `{a}` werden immer **auf ganze Zahlen gerundet** ausgegeben (`n0`, Empfehlung E2).

### 4.2 K1 (Stufe 1, nur Nährwerte), A3
> Ihr Futter hat viel Rohprotein ({p} % der Trockenmasse) und zugleich viel Rohasche ({a} %). Das **kann** darauf hindeuten, dass ein Teil des Eiweißes aus Knochen oder Knorpel stammt. Hohe Asche kann aber auch von zugesetzten Mineralstoffen oder von Fisch mit Gräten kommen. Die Analyse auf der Packung unterscheidet das nicht, denn „Rohprotein“ zählt jedes Eiweiß gleich. Warum das wichtig sein kann: Bindegewebe-Eiweiß (Kollagen) enthält kein Tryptophan, eine Aminosäure, die Hund und Katze mit dem Futter aufnehmen müssen. Für sich allein ist es deshalb ein unvollständiges Eiweiß (Paul et al. 2019). In Versuchen an Küken und Hähnen sank in Fleischknochenmehl der Anteil fast aller essenziellen Aminosäuren am Rohprotein, je mehr Asche es enthielt (Shirley & Parsons 2001). Im fertigen Futter gleicht anderes Eiweiß das oft aus. Das ist eine Schätzung nach den Nährwerten, keine Aussage über die Zutaten. **Was Sie tun können:** Schauen Sie, ob in der Zutatenliste Fleisch oder Innereien mit Prozentangabe vorne stehen, und tragen Sie die ersten Zutaten oben ein. Dann wird der Hinweis genauer.

### 4.3 K2 (Stufe 2, starke Begriffe), A4
> In den ersten fünf Zutaten, die Sie eingegeben haben, steht „{treffer}“. Solche Bestandteile können viel Bindegewebe-Eiweiß (Kollagen) liefern. Kollagen enthält kein Tryptophan und ist für sich allein ein unvollständiges Eiweiß (Paul et al. 2019). {MEHL_SATZ} Im fertigen Futter wird das oft durch anderes Eiweiß ausgeglichen. Wie groß der Anteil ist, verrät die Zutatenliste nicht. **Wenn Sie sichergehen möchten:** Achten Sie auf Futter, die Fleisch oder Innereien mit Prozentangabe an erster Stelle nennen.

`{MEHL_SATZ}` steht nur da, wenn ein starker Treffer „mehl“ enthält (z. B. knochenmehl, tiermehl, federmehl). Sonst entfällt er samt Leerzeichen, sodass kein doppeltes Leerzeichen entsteht. Wortlaut:
> In Versuchen an Küken und Hähnen hatten ausgeschmolzene Tiermehle meist eine geringere Proteinqualität als rohe, gefriergetrocknete Nebenprodukte wie Lunge oder Leber (Cramer et al. 2007).

### 4.4 K2-Zusatz (Sammelbegriffe), unverändert
> „Tierische Nebenerzeugnisse“ ist ein Sammelbegriff. Er kann wertvolle Innereien wie Leber oder Herz ebenso umfassen wie Haut, Knorpel oder Sehnen. Welcher Anteil es ist, verrät die Deklaration nicht.

### 4.5 Sichtbare Abzüge (A5(a)/(c)), nur wenn der jeweilige Abzug > 0
- Stufe 1 (nur möglich, wenn `KOLL_STUFE1_MAX > 0` und der Abzug aktiv ist): „−{n} Punkte: Hinweis zur Proteinqualität (Schätzung nach den Nährwerten)“
- Stufe 2, starke Begriffe: „−{n} Punkte: {treffer} in den ersten fünf Zutaten (Ihre Angabe)“
- Platz: in der Punkte-Aufschlüsselung des Ergebnisses, im bestehenden Stil der Zeilen dort, ohne neue Farbe. `{n}` ist der Abzug als ganze Zahl, `{treffer}` wie in K2.
- Für Sammelbegriffe gibt es **nie** eine Abzugszeile.

### 4.6 Wortlaut-Regel (bleibt)
Ohne Zutatenfeld (`zutatenGeprueft === false`) darf kein Text andeuten, dass Zutaten geprüft wurden.

## 5. Gewichtung offenlegen (A6) und Abgrenzung zum Testurteil (A7)

### 5.1 A6: Erklärtext, Infografik, Methodik gleichzeitig auf v2
- Alle öffentlichen Angaben zur Gewichtung werden im selben PR auf v2 umgestellt, sonst ist der Text irreführend:
  - `infografik-6.tsx` (siehe Hauptauftrag §6)
  - `seo-hund.tsx` Z. ~62 und `seo-katze.tsx` Z. ~65 („Protein 35, Fett 20, … Plausibilität 15“)
  - `seo.ts` FAQ „Was sagt die Note und was nicht?“: Der Teil „gegen die FEDIAF-Mindestwerte“ wird ergänzt um „und nach dem Verhältnis von Protein zu Fett“
  - `src/app/(site)/futterrechner/page.tsx`
  - jeder Methodik-Abschnitt zum Rechner
  - Gegenprobe: `rg -n "Protein 35|Fett 20|Plausibilität 15|\"Protein\", 35|\"Fett\", 20" src` darf nichts mehr finden.
- **Pflichtsatz** im Erklärtext zur Punktevergabe (`seo-hund.tsx`, `seo-katze.tsx`, direkt nach dem Punktetext) und im Methodik-Abschnitt von `page.tsx`, wörtlich:
  > Das Protein-Fett-Verhältnis ist unsere eigene Gewichtung. Sie orientiert sich an der Beute von Wolf und verwilderter Katze (Bosch et al. 2015; Plantinga et al. 2011). FEDIAF nennt dafür keinen Grenzwert. Hunde selbst wählen bei freier Wahl eher fettreich (Hewson-Hughes et al. 2013). Futter, die alle FEDIAF-Mindestwerte erfüllen, bekommen deshalb mindestens „ausreichend“.

  Der **letzte Satz** („Futter, die alle FEDIAF-Mindestwerte erfüllen, bekommen deshalb mindestens „ausreichend“.“) erscheint **nur**, wenn `UNTERGRENZE_FEDIAF_KONFORM === true`. Bei `false` wäre er falsch, dann endet der Pflichtsatz nach „(Hewson-Hughes et al. 2013).“. Beide Fassungen bekommen einen Test.
- Die Formulierung „schmackhaft, aber energie- und fettlastig“ aus `scoring-v2.md` §2 erscheint nirgends öffentlich.
- Hauptauftrag §2.5, Grund `pf`, Zusatzsatz bei `"bad"` („Das Futter ist fettbetont. Fett macht schmackhaft …, deshalb fressen Tiere davon leicht mehr als nötig (Hewson-Hughes et al. 2013).“): **vorerst nicht einbauen.** Er gibt dieselbe eigene Lesart von Hewson-Hughes 2013 wieder. Klärung folgt separat. Der Haupttext von `pf` bleibt.
- Begriffsliste offenlegen (Empfehlung E3): Unter „Eigene Festlegungen“ in `page.tsx` die Kollagen-Suchbegriffe als Liste nennen: Kollagen, Gelatine, Knorpel, Haut, Häute, Schwarte, Federn/Federmehl/Federhydrolysat, Sehne, Luftröhre, Grieben, Knochenmehl, Tiermehl, Schlachtabfälle. Dazu die Sammelbegriffe „Nebenerzeugnisse“ und „hydrolysierte Tierproteine“ mit dem Hinweis, dass diese keinen Punktabzug auslösen. Formuliere das sachlich im bestehenden Stil und ohne Sperrwörter.

### 5.2 A7: Satz direkt an der Note
- Neu, **direkt unter dem Notenwort** in `ergebnis-karte.tsx`, vor dem bestehenden Pflichtsatz, in normaler Schriftgröße (gleiche Klasse wie der Fließtext der Karte, nicht kleiner, nicht ausgegraut). Wortlaut:
  > Nährwert-Note, kein Testurteil. Unsere Tests prüfen zusätzlich Zutaten, Rohstoffqualität und Zusatzstoffe und können deshalb anders ausfallen.
- Der bestehende Pflichtsatz bleibt unverändert darunter.
- **Überall, wo Score oder Notenwort erscheinen**, muss der Satz im selben Blick stehen:
  - in der Ergebnis-Leiste (`ergebnis-leiste.tsx`), falls sie Score oder Note zeigt. Wenn es bei 390 px eng wird, darf er dort umbrechen, aber nicht wegfallen oder in ein Aufklappelement wandern.
  - im Vorlese-/Live-Text (`ergebnis-karte.tsx` Z. ~200, „Nährwert-Check … von 100, …“): Satz anhängen.
  - **Teilen:** Aktuell teilt der Button nur die URL. Falls `navigator.share` oder die Zwischenablage einen Text mit Score oder Note bekommt, oder falls je ein Teilen-Bild bzw. OG-Bild mit Score erzeugt wird, gehört der Satz hinein. Prüfe außerdem, dass ein Screenshot der Ergebniskarte bei 390 px Note und Satz zusammen zeigt (A7(b)).
- Tests: Der Satz steht im DOM direkt nach dem Notenwort, auch für Hund und Katze sowie im Vorlesetext.
- Bei Ergänzungsfutter und Snacks gibt es keine Note, dort erscheint der Satz nicht.

## 6. Quellenblock (A8), `faq-quellen.tsx`
Ergänzen bzw. ersetzen. Den Satz „Knochenprotein besteht zu etwa 83 % Kollagen“ bzw. „… zu etwa 83 % aus Kollagen“ nirgends verwenden.
- Paul C, Leser S, Oesser S (2019): Significant Amounts of Functional Collagen Peptides Can Be Incorporated in the Diet While Maintaining Indispensable Amino Acid Balance. Nutrients 11(5):1079. doi:10.3390/nu11051079 (PDCAAS ist ein Bewertungsmaß aus der menschlichen Ernährung)
- Shirley RB, Parsons CM (2001): Effect of ash content on protein quality of meat and bone meal. Poultry Science 80(5):626–632. doi:10.1093/ps/80.5.626 (Versuche an Geflügel, nicht an Hund oder Katze)
- Cramer KR, Greenwood MW, Moritz JS, Beyer RS, Parsons CM (2007): Protein quality of various raw and rendered by-product meals commonly incorporated into companion animal diets. J Anim Sci 85(12):3285–3293. doi:10.2527/jas.2006-225 (Versuche an Geflügel, nicht an Hund oder Katze)
- Dazu Bosch et al. 2015, Plantinga et al. 2011 und Hewson-Hughes et al. 2011 und 2013 mit den Angaben aus `scoring-v2.md` §2 (wie im Hauptauftrag §6). Die Einschränkung „nur bei Freigabe des Langtexts“ für Paul 2019 entfällt.
- Kazimierska et al. 2020 kommt **nicht** in den öffentlichen Quellenblock.

## 7. Tests (Vitest), ergänzt Hauptauftrag §4
Übertrage `docs/futterrechner/testfaelle.py` vollständig nach `testfaelle.test.ts`, mit allen 4 Konfigurationen per Parameter (`abzugAktiv`, `untergrenze`, `stufe1Max`). Zusätzlich muss ein Test sicherstellen, dass die Konstanten im Auslieferungszustand stehen: Abzug aus, Untergrenze aus, Stufe 1 = 0.

Neue Fälle (Eingaben exakt wie in `testfaelle.py`):
- **T18:** Hund 20 kg, trocken p22 f22 fa3 a7 m10 ca1,2 ph0,9. P:F 1,0, alle Minima erfüllt.
- **T19:** wie T18 mit ca2,6 ph1,6. Ca TS über dem Maximum, also Ca-Deckel.
- **T20:** Katze wie T5, nass p14 f12 fa0,3 a2 m72 ca0,35 ph0,28 Taurin 300 mg/kg. Taurin unter dem Minimum.
- **T21:** wie T18 + Zutaten „Geflügel, Rinderknorpel, Mais, Gelatine, Hühnerfett“.

Hinweis: Die „T9-Variante mit P:F 1,0“ der Rechtsprüfung ist als **Nassfutter** nicht unter 60 zu bringen (P:F 1,0 nass ergibt 64). Deshalb ist T18 ein Trockenfutter.

| Fall | STANDARD (Auslieferung) | A5 (Abzug an) | A5_BODEN (Abzug + Untergrenze an) | A5_S1_3 (Stufe 1 = 3) |
|---|---|---|---|---|
| T1–T7, T9, T10, T14, T16, T17 | Sollwerte wie Hauptauftrag | gleich | gleich | gleich |
| T11 | 97 sehr gut · 0/0 · Hinweis K1 | 97 sehr gut · 0/0 | 97 sehr gut · 0/0 | 94 sehr gut · 3/0 |
| T12 | 97 sehr gut · 0/0 · K1 + K2-Zusatz | 97 sehr gut · 0/0 | 97 sehr gut · 0/0 | 94 sehr gut · 3/0 |
| T13 | 77 befriedigend · 0/0 · K2 | 71 befriedigend · 0/6 | 71 befriedigend · 0/6 | 71 befriedigend · 0/6 |
| T15 | 80 gut · 0/0 · K1 | 80 gut · 0/0 | 80 gut · 0/0 | 78 befriedigend · 2/0 |
| T18 | 58 mangelhaft | 58 mangelhaft | **60 ausreichend, Untergrenze gegriffen** | 58 mangelhaft |
| T19 | 38 mangelhaft | 38 mangelhaft | 38 mangelhaft (Ca-Deckel, keine Untergrenze) | 38 mangelhaft |
| T20 | 58 mangelhaft | 58 mangelhaft | 58 mangelhaft (Taurin unter Minimum, keine Untergrenze) | 58 mangelhaft |
| T21 | 58 mangelhaft · 0/0 · K2 | 52 mangelhaft · 0/6 | **60 ausreichend · 0/6, Untergrenze nach dem Abzug** | 52 mangelhaft · 0/6 |

- Punkte je Schlüssel: T11–T17 wie Hauptauftrag. T18/T21: pf0 pe9,6 pmin10 fmin5 nfe3,8 capr20 plaus10. T19: wie T18, aber capr0. T20: pf3,3 pe8,6 pmin10 fmin5 nfe10 capr20 taurin0 plaus10.
- „x/y“ steht für `abzugNaehrwerte/abzugZutaten`.
- Die geänderten Erwartungen T11, T12 und T15 (vorher 89/87/75 mit Abzug) begründest du im PR mit „A5 Rechtsprüfung 27.10.2026“.

Weitere Tests:
- Die Erklärzeile der Untergrenze erscheint nur bei `untergrenzeGegriffen`, mit `{f}` als ganzer Zahl (T18: „… aus Fett (48 %) …“).
- Bei Sammelbegriffen gibt es nie eine Abzugszeile und nie K2, nur den K2-Zusatz (T12).
- `{MEHL_SATZ}` erscheint bei „Knochenmehl“ an Position 1–5 und fehlt bei „Rinderknorpel“. Es entsteht kein doppeltes Leerzeichen.
- Kein sichtbarer Text enthält „83 %“ in Verbindung mit Kollagen. Weder alte K1/K2-Sätze noch „PDCAAS) von null“ kommen vor.
- Der A7-Satz steht an der Note (Abschnitt 5.2). Der A6-Pflichtsatz erscheint in beiden Fassungen je nach Schalter.
- Sperrwort-Test (Abschnitt 0).

## 8. Keine Rechner-Noten mit Produktnamen (A2)
- Die Tabelle mit Marken und Rechner-Noten aus `scoring-v2.md` §3/§6 ist intern. Sie kommt nicht in Code, Texte, Tests, Kommentare, Screenshots, PR-Beschreibung oder Commit-Nachrichten.
- Rechenbeispiele bleiben fiktiv, wie live („Alle Beispiele nutzen fiktive Futter.“).
- Screenshots im PR nur mit den Testfällen T1, T11, T12, T18 bzw. leeren Formularen.

## 9. Prüfen und PR (ergänzt Hauptauftrag §7)
1. `npm run lint`, `tsc --noEmit` und `npx vitest run` müssen grün sein. Gegenprobe: `python3 docs/futterrechner/testfaelle.py`.
2. 390-px-Check, hell und dunkel, für `/futterrechner/hund` und `/futterrechner/katze`. Zusätzlich zum Hauptauftrag prüfen:
   - Die Ergebniskarte zeigt Note und A7-Satz bei T1 in einem Bildschirm.
   - Ergebnis-Leiste mit A7-Satz, falls sie die Note zeigt.
   - T11 ohne Zutaten (K1, keine Abzugszeile).
   - T12 (K1 + K2-Zusatz, keine Abzugszeile).
   - T13 in den Konfigurationen STANDARD und A5. Für A5 den Schalter nur lokal umstellen, nicht committen.
   - T18 mit lokal aktivierter Untergrenze (Erklärzeile), ebenfalls nicht committen.
   - Slider-Blasen gleich der Anzeige (Abschnitt 0).
   - Kein horizontales Scrollen.
3. Im PR (Titel wie im Hauptauftrag) zusätzlich angeben:
   - „Auflagen A1–A8 der Rechtsprüfung vom 27.10.2026 umgesetzt“, mit Liste je Auflage und Datei.
   - „`KOLLAGEN_ABZUG_AKTIV = false` und `UNTERGRENZE_FEDIAF_KONFORM = false` (Aktivierung separat)“.
   - Tabelle der geänderten Testerwartungen.
   - Screenshots.
4. **Nicht mergen.** Melde den PR-Link und die Screenshots zurück.

## 10. Nicht für den Designer (intern, nur zur Vollständigkeit)
- **A9 TikTok:** Der Screenshot im TikTok-Video („93 GUT“) muss zu den gezeigten Eingaben nach v2 passen oder als „Beispiel“ gekennzeichnet sein. Fazit-Protokoll A1(b) (Grün trotz Taurin unter Minimum) gilt für v2 weiter. Das erledigt das Video-Team, der Designer nicht.
- **Entscheidungen offen (Manni):**
  - A1 Untergrenze aktivieren. Laut Rechtsprüfung ist sie Pflicht vor dem Go-live von v2.
  - Ob Stufe 1 statt 0 bis zu 3 Punkte abziehen soll.
  - Wann `KOLLAGEN_ABZUG_AKTIV` eingeschaltet wird.
- **E1:** Die 83-%-Angabe und die Kazimierska-Werte vor jeder öffentlichen Nutzung im Volltext gegenlesen.
- **E4:** Der optionale Satz zu Hydrolysaten in Diätfuttern ist hier nicht beauftragt. Bei Bedarf separat entscheiden.
- `scoring-v2.md` §3, Satz „steht schon so im Rechner“, ist sachlich falsch und wird über A7 korrigiert (interne Notiz).
