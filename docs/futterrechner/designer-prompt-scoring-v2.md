# Auftrag an den Webseiten-Designer: Futter-Rechner Bewertung v2 („Scoring v2“) umsetzen

Stand 27.10.2026 · Repo `cyberni74/futterpruefer` · Referenz-Branch `docs/futterrechner-scoring-v2`
Dieser Prompt ist vollständig. Du brauchst nichts anderes als das Repo und den Referenz-Branch.

## Warum
Manni: „Das Protein-Fett-Verhältnis braucht mehr Gewicht. Fast jedes Futter hat 90–100 %.“ Befund: v1 prüft nur, ob Protein und Fett das FEDIAF-Minimum je 1000 kcal erreichen. Das schafft fast jedes Alleinfutter, deshalb lagen 36 von 38 realen Futtern bei ≥ 80 Punkten. v2 bewertet zusätzlich die **Energieverteilung**: Protein:Fett-Verhältnis (35 Punkte, stärkstes Kriterium), Protein-Energieanteil, NfE. Dazu kommt eine **Kollagen-Heuristik** in zwei Stufen. Ergebnis an denselben 38 Futtern: 21 % grün (≥ 80), 45 % 70–79, 26 % 60–69, 8 % unter 60.

## Harte Regeln
- Keine DB-Schreibzugriffe, keine Migrationen, kein Prisma-Write. Der Rechner läuft weiterhin komplett im Browser.
- **Nicht** auf `main` committen. Arbeite auf einem neuen Branch `feat/futterrechner-scoring-v2` (von `main`). Kein Force-Push, kein Rebase bereits gepushter Commits.
- Keine Farb- oder Layoutänderungen. Einzige UI-Ergänzung ist das optionale Feld „Erste Zutaten (optional)“ im **bestehenden** Stil (gleiche Komponente/Klassen wie die vorhandenen Texteingaben, Hinweistext im Stil der vorhandenen Hilfetexte).
- Nichts löschen: keine Dateien, keine Tests, keine Exporte. Alte Konstanten, die nicht mehr gebraucht werden, als `@deprecated` markieren statt entfernen.
- `NOTEN`, `NOTEN_REIHE`, `NOTEN_SCHWELLEN` (90/80/70/60) und die Ampel in `fazit-texte.ts` (grün ≥ 80, gelb 60–79, rot < 60) **unverändert**.
- Keine neuen Deckel. Insbesondere **kein** Deckel oder Abzug für hohes Protein und **keiner** für Taurin.
- Der Kollagen-Hinweistext ist „Entwurf, Rechtsprüfung offen“. Er geht nur hinter einem Schalter live (siehe Abschnitt 5).
- Merge erst, wenn alle Tests grün sind und der 390-px-Check gemacht ist.

## 1. Referenz lesen
Im Branch `docs/futterrechner-scoring-v2`, Ordner `docs/futterrechner/`:
- `rechner.py`: Python-Referenz v2. Sie ist maßgeblich. Bei Abweichung gilt die Python-Logik, außer bei `caPCheck`/`caRegel`. Dort gilt das bestehende TS, mit dem Wochen-Sonderfall.
- `testfaelle.py`: 17 Sollwerte (`python3 testfaelle.py` muss „Alle 17 Sollwerte erfüllt.“ ausgeben).
- `scoring-v2.md`: Begründung, Quellen, Verteilung, Hinweistexte.
- `kalibrierung_v2.py` + `rechner_v1.py`: Kalibrierung an echten Futtern. Braucht lokal eine Review.json, nicht für CI.

## 2. Logik in TypeScript (`src/lib/futterrechner/`)

### 2.1 `fediaf.ts`: neue Konstanten (bestehende bleiben)
```ts
/** Modifizierte Atwater-Faktoren nur für die Energieverteilung (NRC 2006). */
export const ATWATER = { p: 3.5, f: 8.5, c: 3.5 } as const;
/** Protein:Fett (g:g). lo → 0 Punkte, hi → volle Punkte. Hund hi: Wolfsbeute 54:45 % Energie (Bosch 2015); Katze hi: 62,7/22,8 (Plantinga 2011). */
export const PF_BAND = { hund: { lo: 1.0, hi: 2.9 }, katze: { lo: 1.0, hi: 2.75 } } as const;
/** Ziel Protein-Energieanteil in %: Hund 30 (Hewson-Hughes 2013), Katze 52 (Hewson-Hughes 2011, Plantinga 2011). */
export const PE_ZIEL = { hund: 30, katze: 52 } as const;
/** Anteil der PE-Punkte, sobald das FEDIAF-Minimum (in Energie-%) erreicht ist. */
export const PE_SOCKEL = 0.5;
/** NfE in % TS: volle Punkte bis lo, 0 ab hi. */
export const NFE_BAND = { hund: { lo: 35, hi: 55 }, katze: { lo: 15, hi: 40 } } as const;
export const GEWICHT = {
  hund: { pf: 35, pe: 15, pmin: 10, fmin: 5, nfe: 5, capr: 20, plaus: 10 },
  katze: { pf: 35, pe: 15, pmin: 10, fmin: 5, nfe: 10, capr: 20, taurin: 10, plaus: 10 },
} as const;
export const PLAUS_ABZUG = { feuchteGeschaetzt: 2, ascheAusserhalb: 3, faserHund: 3 } as const;
export const KOLLAGEN = {
  ascheAb: 10, ascheVoll: 14, ascheMax: 6, caTsAb: 2.0, caAbzug: 2,
  proteinTsAb: { hund: 25, katze: 30 }, zutatenPositionen: 5, zutatenMax: 6,
  stark: [/kollagen/, /gelatine/, /knorpel/, /haut\b/, /häute/, /schwarte/, /feder(n|mehl|hydrolysat)?\b/, /sehne/, /luftröhre/, /grieben/, /knochenmehl/, /tiermehl/, /schlachtabf/],
  schwach: [/nebenerzeugnis/],
  hydroJa: /hydrolys/, hydroKontext: /protein|tier/, hydroNein: /leber|hefe|fisch|pflanz|soja|reis|weizen|mais|erbs|kartoffel/,
} as const;
```
Achtung beim Regex `haut\b`: In JS ist `\b` ASCII-basiert. „hühnerhaut“ endet auf „t“, das passt. Teste aber T13/T14 und die Umlaut-Begriffe (`häute`, `luftröhre`) ausdrücklich.

### 2.2 Hilfsfunktionen (neu, z. B. in `naehrstoffe.ts`)
```ts
export const lin = (x: number, lo: number, hi: number) => hi === lo ? (x >= hi ? 1 : 0) : Math.min(1, Math.max(0, (x - lo) / (hi - lo)));
export const r1 = (x: number) => Math.round(x * 10) / 10;
/** Oberste Ebene an , oder ; trennen; Inhalt in () oder [] bleibt beim Bestandteil. Leere Teile verwerfen. Erste n. */
export function zutatenListe(text: string, n: number): string[] { /* wie zutaten_liste() in rechner.py */ }
export function kollagen(art, pTs, aTs, caTs: number | null, zutaten?: string | null):
  { abzugNaehrwerte: number; abzugZutaten: number; treffer: string[]; flag: boolean; zutatenGeprueft: boolean }
```
`kollagen()` exakt nach `rechner.py`:
- **Stufe 1:** Wenn `pTs >= proteinTsAb[art] && aTs > ascheAb`, dann `a1 = Math.round(lin(aTs, 10, 14) * 6)`, plus 2, wenn `caTs != null && caTs > 2.0`.
- **Stufe 2:** Jede der ersten 5 Positionen wird klein geschrieben (`toLocaleLowerCase("de")`).
  - Jeder neue starke Begriff kommt in `stark`.
  - `nebenerzeugnis` kommt in `schwach`.
  - Ein „hydrolys…“-Treffer zählt als schwach („hydrolysat“), wenn alle drei Bedingungen gelten:
    - `hydroKontext` passt,
    - `hydroNein` passt nicht,
    - an dieser Position steht kein starker Begriff.
  - Abzug: `a2 = (stark.length ? 4 + 2*(stark.length-1) : 0) + (schwach.length ? 2 : 0)`, höchstens 6.
- `zutatenGeprueft = (zutaten ?? "").trim().length > 0`.
- `treffer` enthält lesbare Begriffe für den Text, z. B. das gefundene Wort aus der Zutat, nicht den Regex.

### 2.3 `bewertung.ts`: Punktevergabe ersetzen (Zeilen „punkte.protein“ bis Score)
Unverändert bleiben:
- Feuchte-Schätzung, Plausibilitätsabbrüche, ME, Bedarf, Spalte, `rp`/`rf`
- alle `deckel`-Regeln aus v1
- `caPCheck` sowie Taurin-Check und Taurin-Punkte (10/0)
- Ergänzungsfutter-Zweig, Hinweise, Risiken-Zuordnung

Neu (`W = GEWICHT[tier.art]`):
1. `pf = f > 0 ? p / f : 99`. Daraus `punkte.pf = r1(W.pf * lin(pf, PF_BAND.lo, PF_BAND.hi))`, `max.pf = 35`.
2. `nfeC = Math.max(e.nfe, 0)`.
   - Energie: `eP = 3.5*p`, `eF = 8.5*f`, `eC = 3.5*nfeC`. Anteile `pe/fe/ce` in % von `eP+eF+eC`.
   - `peLo = mindest.p * 3.5 / 10`.
   - Punkte: `punkte.pe = pe >= peLo ? r1(W.pe * (PE_SOCKEL + (1-PE_SOCKEL) * lin(pe, peLo, PE_ZIEL))) : 0`, `max.pe = 15`.
3. Mindestwerte:
   - Protein: `punkte.pmin = rp >= 1 ? 10 : rp >= 0.9 ? 5 : 0`.
   - Fett: `punkte.fmin = rf >= 1 ? 5 : rf >= 0.9 ? 2.5 : 0`.
   - Die v1-Deckel bleiben genau so.
4. NfE: `punkte.nfe = r1(W.nfe * (1 - lin(nfeTs, NFE_BAND.lo, NFE_BAND.hi)))`, max 5 (Hund) bzw. 10 (Katze).
5. Ca/P: wie bisher 20/10/0 und `max.capr = 20`. Fehlt der Wert, gibt es keinen Eintrag und den Deckel „gut“.
6. Taurin: wie bisher.
7. Plausibilität: Start bei 10.
   - Feuchte geschätzt: −2
   - Asche außerhalb 3–12 % TS: −3
   - Hund mit Rohfaser > 8 % TS: −3
   - Mindestens 0. `max.plaus = 10`.
8. Score:
   - `basis = summe(punkte) / summe(max) * 100`
   - `k = kollagen(art, pTs, aTs, capr?.caTs ?? null, futter.zutaten)`
   - `abzug = k.abzugNaehrwerte + k.abzugZutaten`
   - `score = Math.max(0, Math.round(basis - abzug))`
   - Danach `noteFuer(score)`, dann die Deckel wie bisher.

Hinweis: Die alten Schlüssel `punkte.protein` und `punkte.fett` gibt es nicht mehr. Suche alle Verwendungen (`rg "punkte\.(protein|fett)|max\.(protein|fett)" src`) und stelle sie um. Lösche dabei nichts, was noch anderswo gebraucht wird.

### 2.4 `types.ts`
- `FutterInput`: `zutaten?: string | null` (optional, freier Text).
- `ErgebnisOk` bekommt:
  - `pf: number`
  - `energieAnteile: { p: number; f: number; c: number }`
  - `peLo: number`
  - `basis: number`
  - `kollagen: { abzugNaehrwerte: number; abzugZutaten: number; treffer: string[]; flag: boolean; zutatenGeprueft: boolean }`
  - `abzug: number`

### 2.5 Gründe (`gruende`) und Texte (`texte.ts`)
Die bestehenden IDs bleiben (`protein`, `spalte`, `fett`, `ca`, `taurin`, `feuchte`, `asche`, `faser`, `nfe`). Neu:

- **`pf`**, Titel „Protein-Fett-Verhältnis“. Direkt nach `fett` einfügen.
  - `art`:
    - `"ok"`, wenn `lin(pf) >= 0.75`
    - `"warn"`, wenn `>= 0.35`
    - sonst `"bad"`
  - Text: `Auf 1 g Fett kommen ${n1(pf)} g Protein. Damit stammen ${n0(pe)} % der Energie aus Protein, ${n0(fe)} % aus Fett und ${n0(ce)} % aus Kohlenhydraten. Volle Punkte gibt es ab ${hi} : 1 – so ist das Verhältnis in der natürlichen Beute (Hund: Wolf, Katze: Mäuse und Vögel).`
  - Bei `"bad"` zusätzlich: ` Das Futter ist fettbetont. Fett macht schmackhaft und liefert viel Energie, deshalb fressen Tiere davon leicht mehr als nötig (Hewson-Hughes et al. 2013).`
- **`nfe`** bleibt Info. Neuer Text: `Rechnerische Kohlenhydrate (NfE): ${n0(nfeTs)} % der Trockenmasse, vor allem Stärke. Fließt mit ${W.nfe} Punkten in die Note ein: volle Punkte bis ${lo} %, keine ab ${hi} %.`
- **`kollagen`**, nur wenn `k.flag`.
  - `art: "warn"`. Hat Stufe 1 gegriffen (`abzugNaehrwerte > 0`), lautet der Titel „Hinweis zur Proteinqualität (nach den Nährwerten)“ und es folgt Text K1. Hat Stufe 2 gegriffen (`abzugZutaten > 0`), lautet der Titel „Hinweis zur Proteinqualität (nach Ihren Zutatenangaben)“ und es folgt Text K2. Greifen beide, gibt es einen Grund mit dem Zutaten-Titel und beiden Texten nacheinander (erst K2, dann K1).
  - Text: siehe Abschnitt 5.
- Asche-Text `ascheAuffaellig`: Das Wort „5 Punkte“ kommt dort nicht vor. Prüfe trotzdem alle Texte auf alte Punktzahlen (`rg -n "5 Punkte|35|20 Punkte|15" src/components/futterrechner src/lib/futterrechner/texte.ts`).

**Wortlaut-Regel (Pflicht):** Ohne eingetragene Zutaten (`zutatenGeprueft === false`) darf kein Text andeuten, dass Zutaten geprüft wurden. Dann heißt es immer „nach den Nährwerten“. Mit Feld: „in den ersten fünf Zutaten, die Sie eingegeben haben“.

## 3. UI: optionales Feld „Erste Zutaten (optional)“
- Ort: in der Futter-Eingabe unter den Analysewerten. Nur bei Alleinfutter, nicht bei Snack/Ergänzung.
- Bestehende Textfeld-Komponente und Klassen verwenden. Keine neue Farbe, kein neues Layout-Raster.
  - `<textarea>` mit 2 Zeilen, `maxLength` 600.
  - Label „Erste Zutaten (optional)“.
  - Hilfetext: „Die ersten Zutaten von der Packung, durch Komma getrennt. Wir prüfen die ersten fünf auf Bindegewebe-Rohstoffe.“
- `FormState.werte[futterart].zutaten: string | null` (in `leereWerte()` mit `null`). An `bewerte()` als `futter.zutaten` übergeben.
- Nicht in den Teilen-Link/Hash (`hash.ts`) aufnehmen (Länge, Privatsphäre). Dafür einen Test anlegen.
- Das Feld ändert nur den Kollagen-Abzug, sonst nichts. Ohne Eintrag ist das Ergebnis identisch zu „Feld nicht vorhanden“.
- Screenreader: Label mit dem Feld verknüpfen, Hilfetext über `aria-describedby`.

## 4. Tests (Vitest)
`src/lib/futterrechner/testfaelle.test.ts`:
- T1–T8 auf die neuen Sollwerte umstellen. Prüfe dabei `punkte` je Schlüssel, `score`, `note`, `kollagen.abzugNaehrwerte`, `kollagen.abzugZutaten` und `kollagen.zutatenGeprueft`.
- Energie-, Bedarfs- und Mengenwerte bleiben unverändert und müssen weiter grün sein.

| Fall | Eingabe (Futter; Tier) | punkte | score | note | S1/S2 | geprüft |
|---|---|---|---|---|---|---|
| T1 | trocken p25 f14 fa2,5 a7 m10 ca1,3 ph0,95; Hund 20 kg adult normal | pf14,5 pe12,3 pmin10 fmin5 nfe2,2 capr20 plaus10 | 74 | befriedigend | 0/0 | nein |
| T2 | nass p10,5 f7 fa0,5 a2,2 m78 ca0,3 ph0,22; Hund 10 kg adult wenig kastriert | pf9,2 pe15 pmin10 fmin5 nfe5 capr20 plaus10 | 74 | befriedigend | 0/0 | nein |
| T3 | trocken p28 f17 fa2,5 a7,5 m10 ca1,3 ph1,0; Welpe 12 kg 17 Wo. End 30 | pf11,9 pe13,1 pmin10 fmin5 nfe4 capr20 plaus10 | 74 | befriedigend | 0/0 | nein |
| T3b | Futter T1; Welpe wie T3 | pf14,5 pe11,9 pmin10 fmin5 nfe2,2 capr20 plaus10 | 74 | befriedigend | 0/0 | nein |
| T4 | trocken p22 f10 fa3,5 a6 m–; Hund 25 kg senior normal kastriert | pf22,1 pe10,7 pmin10 fmin5 nfe0,3 plaus8 | 70 | befriedigend | 0/0 | nein |
| T5 | nass p11 f5,5 fa0,4 a2 m80 ca0,3 ph0,22 Taurin 1000; Katze 4,5 kg Wohnung kastriert | pf20 pe12,1 pmin10 fmin5 nfe10 capr20 taurin10 plaus10 | 84 | gut | 0/0 | nein |
| T6 | trocken p34 f20 fa2 a7,5 m8 ca1,2 ph1,0 Taurin 2000; Kitten 2,5 kg 5 Mon. | pf14 pe9,2 pmin10 fmin5 nfe3,6 capr20 taurin10 plaus10 | 71 | befriedigend | 0/0 | nein |
| T7 | trocken p15 f4,5 fa4 a9,5 m10 ca2,4 ph0,8; Hund 15 kg adult wenig | pf35 pe0 pmin5 fmin5 nfe0 capr0 plaus10 | 55 | mangelhaft | 0/0 | nein |
| T9 neu | nass p10 f9 fa0,5 a2,3 m76 ca0,35 ph0,25; Hund 20 kg | pf2 pe14,7 pmin10 fmin5 nfe5 capr20 plaus10 | 67 | ausreichend | 0/0 | nein |
| T10 neu | trocken p45 f15 fa2,5 a8 m8 ca1,6 ph1,1; Hund 20 kg | alle voll | 100 | sehr gut | 0/0 | nein |
| T11 neu | nass p11,5 f2,4 fa0,3 a2,5 m82 ca0,42 ph0,3 Taurin 500; Katze wie T5 | pf35 pe15 pmin10 fmin5 nfe10 capr20 taurin10 plaus7 | 89 | gut | 8/0 | nein |
| T12 neu | wie T11 + zutaten „Fleisch und tierische Nebenerzeugnisse (davon 4 % Huhn), pflanzliche Eiweißextrakte, Fisch und Fischnebenerzeugnisse, Mineralstoffe, Zucker“ | wie T11 | 87 | gut | 8/2 | ja |
| T13 neu | nass p10,5 f5,5 fa0,5 a2 m78, kein Ca/P; zutaten „Kaninchen 40 % (Fleisch, Herz, Luftröhre), Rinderknorpel, Karotte, Kartoffel, Leinöl, Mineralstoffe“; Hund 20 kg | pf16,7 pe15 pmin10 fmin5 nfe5 plaus10 | 71 | befriedigend | 0/6 | ja |
| T14 neu | wie T13, zutaten „Huhn 60 % (Brust, Herz, Leber), Reis, Karotte, Erbsen, Leinöl, Gelatine“ | wie T13 | 77 | befriedigend | 0/0 | ja |
| T15 neu | trocken p26 f12 fa2,5 a10,8 m10 ca2,07 ph1,25; Hund 20 kg | pf21,5 pe13,8 pmin10 fmin5 nfe3 capr20 plaus7 | 75 | befriedigend | 5/0 | nein |
| T16 neu | trocken p26 f14 fa2,5 a7 m10 ca1,3 ph0,95; zutaten „Huhn getrocknet 30 %, Reis, hydrolysierte Hühnerleber 4 %, Hefehydrolysat, Hühnerfett“; Hund 20 kg | pf15,8 pe12,8 pmin10 fmin5 nfe2,5 capr20 plaus10 | 76 | befriedigend | 0/0 | ja |
| T17 neu | wie T16, zutaten „   “ | wie T16 | 76 | befriedigend | 0/0 | nein |

Hinweis zu T13: Bei Luftröhre in der Klammer von Position 1 und Knorpel an Position 2 zählen 2 starke Begriffe, Abzug 4 + 2 = 6. Bei T14 steht Gelatine an Position 6 und zählt nicht. Die Kommas in der Klammer trennen nicht.

Weitere Unit-Tests:
- `zutatenListe` mit verschachtelten Klammern, Semikolon und leeren Teilen.
- `kollagen()` an den Grenzen: Asche TS genau 10 → 0; 12 → 3; 14 und mehr → 6. Protein TS knapp unter der Schwelle → 0.
- Kein Text enthält „Zutaten“ + „geprüft“, wenn `zutatenGeprueft === false`.
- Hash/Teilen-Link enthält kein `zutaten`.
- `kantenfaelle.test.ts`, `risiken*.test.ts`, `analysieren.test.tsx`, `slider-blase.test.tsx`: grün halten und nur Erwartungswerte anpassen, die sich durch v2 ändern. Begründe jede Anpassung im PR.
- Wenn ein Test einen Score von 100 für „normales“ Futter erwartet, ist der Fall nicht mehr gültig. Passe ihn auf den v2-Sollwert an, nicht die Logik.

## 5. Kollagen-Hinweis: Text und Freigabe
Schalter in `fediaf.ts`: `export const KOLLAGEN_TEXT_FREIGEGEBEN = false;`
- Bei `false` (Standard bis zur Rechtsprüfung) erscheint nur der Kurztext: „Viel Rohprotein bei viel Rohasche: Ein Teil des Eiweißes kann aus Bindegewebe stammen (Schätzung nach den Nährwerten).“ Mit Zutatenfeld: „In den ersten fünf Zutaten, die Sie eingegeben haben, steht „{treffer}“. Solche Bestandteile können viel Bindegewebe-Eiweiß enthalten.“
- Bei `true` erscheinen die Langtexte K1, K2 und der K2-Zusatz aus `scoring-v2.md`, Abschnitt 4, wörtlich mit Quellen. Diese Texte sind ein **Entwurf, die Rechtsprüfung ist offen**. Nicht eigenmächtig auf `true` setzen.
- Der Punktabzug gilt unabhängig vom Schalter, weil er Teil der Bewertung ist.

## 6. Grafiken und Erklärtexte konsistent halten (nur Inhalte, keine Gestaltung)
- `src/components/futterrechner/infografiken/infografik-6.tsx`:
  - `PUNKTE` → `[["Protein-Fett-Verhältnis",35],["Calcium/Phosphor",20],["Protein-Energieanteil",15],["Protein-Minimum",10],["Plausibilität",10],["Taurin (nur Katze)",10],["Kohlenhydrate (NfE)",5],["Fett-Minimum",5]]`.
  - Die Balkenbreite bleibt `pt / 35`.
  - Zusatz in der grauen Box: „Unter 90 % des FEDIAF-Minimums: höchstens „mangelhaft“. Kohlenhydrate bei Katzen: 10 Punkte.“
  - Die Quelle bekommt das Datum 27.10.2026 und den Zusatz „Bosch et al. 2015; Plantinga et al. 2011; Hewson-Hughes et al. 2011/2013“.
  - Den Alt-Text anpassen, falls nötig. Wenn die Zeilen bei 390 px zu eng werden, darf die Spalte `8.5rem` **nicht** geändert werden. Dann die Labels kürzen: „P:F-Verhältnis“, „Protein-Energie“.
- `infografik-4.tsx` (FEDIAF-Ampel je 1000 kcal): Die Mindestwerte bleiben. Unter der Skala einen Satz ergänzen: „Das Minimum zu erreichen bringt 10 bzw. 5 Punkte. Den größeren Teil der Note bestimmt das Verhältnis von Protein zu Fett.“
- `seo-hund.tsx`:
  - Zeile ~43: Ersetze „Deshalb gibt es für Fett weniger Punkte als für Protein. Mehr Protein als gefordert bringt ab dem 1,3-Fachen keine Zusatzpunkte …“ durch eine Erklärung von P:F mit Ziel 2,9 : 1 (Wolfsbeute, Bosch et al. 2015) und dem Satz, dass hohes Protein nie Punkte kostet.
  - Rohasche-Absatz: „5 Punkte Abzug“ wird zu „3 Punkte Abzug“. Neuer Satz zur Kollagen-Heuristik ab 10 % Asche TS bei viel Protein.
  - Rechenbeispiele:
    - T1: 74 „befriedigend“, P:F 1,79, 25 % Energie aus Protein
    - T3: 74 „befriedigend“. Den Satz „Ein normales Adult-Futter würde ebenfalls 100 Punkte erreichen“ ersetzen durch „Das Adult-Futter aus T1 erreicht beim Welpen ebenfalls 74 Punkte, weil der Rechner …“.
    - T4: 70 „befriedigend“, 2 Punkte Abzug für die geschätzte Feuchte
    - T7: 55 „mangelhaft“
  - Neues Beispiel T9 (fettreiches Nassfutter, 67 „ausreichend“).
  - Punktetext: „Protein-Fett-Verhältnis 35, Calcium und Phosphor 20, Protein-Energieanteil 15, Protein-Minimum 10, Plausibilität 10, Fett-Minimum 5, Kohlenhydrate 5“.
- `seo-katze.tsx`:
  - T5: 84 „gut“
  - T6: 71 „befriedigend“
  - Punktetext analog, mit Katzenwerten: Kohlenhydrate 10, Taurin 10, Ziel P:F 2,75 : 1 nach Plantinga et al. 2011.
- `src/app/(site)/futterrechner/page.tsx` Zeile ~53: „Protein und Fett je 1000 kcal … vergleichen“ wird zu „… vergleichen und das Verhältnis von Protein zu Fett bewerten“. Unter „Eigene Festlegungen“ ergänzen: P:F-Bänder, NfE-Band, Kollagen-Heuristik.
- FAQ/Quellen (`faq-quellen.tsx`): Ergänze die Quellen Bosch 2015, Plantinga 2011, Hewson-Hughes 2011 und 2013 sowie Paul 2019 (nur bei Freigabe des Langtexts). Die vollständigen Angaben stehen in `scoring-v2.md`.
- Suche nach weiteren Stellen mit den alten Zahlen: `rg -n "Protein 35|Fett 20|Plausibilität 15|100 Punkte|95 Punkte|86 Punkte|43 Punkte" src`.

## 7. Prüfen, PR, Merge
1. `npm run lint`, `npm run typecheck` (bzw. `tsc --noEmit`) und `npx vitest run` müssen grün sein. Zusätzlich `python3 docs/futterrechner/testfaelle.py` aus dem Referenz-Branch als Gegenprobe.
2. **390-px-Check** (iPhone-Breite, hell und dunkel) mit Screenshots im PR:
   - `/futterrechner/hund` und `/futterrechner/katze`
   - leeres Formular, T1 eingegeben, T11 mit und ohne Zutaten
   - Infografik 6 und 4
   - Prüfe: kein horizontales Scrollen, das Zutatenfeld bricht sauber um, Gründe-Liste und Gauge unverändert.
3. PR von `feat/futterrechner-scoring-v2` nach `main`. Der Titel lautet „Futter-Rechner: Bewertung v2 (Protein-Fett-Verhältnis, Kollagen-Heuristik)“. Inhalt:
   - Link auf `docs/futterrechner/scoring-v2.md` im Referenz-Branch
   - Tabelle der geänderten Testerwartungen (alt → neu)
   - Screenshots
   - Hinweis „Kollagen-Langtext hinter `KOLLAGEN_TEXT_FREIGEGEBEN=false`, Rechtsprüfung offen“
4. Merge erst nach grünen Checks. Normaler Merge oder Squash, **kein Force-Push**. Danach den Referenz-Branch `docs/futterrechner-scoring-v2` nicht löschen.
5. Nach dem Deploy auf Production die Rechenbeispiele T1/T5 im Live-Rechner nachrechnen. Sie müssen den Sollwerten oben entsprechen.

## 8. Was du nicht tun sollst
- Keine Notenwörter, Schwellen, Farben, Gauge-Segmente oder Ampelgrenzen ändern.
- Keine Protein- oder Taurin-Deckel einbauen. Den Kollagen-Abzug nicht als Deckel umsetzen.
- Keine Produktnamen in Texte, Beispiele oder Tests schreiben. Beispiele bleiben fiktiv.
- Keine Daten in eine Datenbank schreiben, keine Review-Daten verändern.
