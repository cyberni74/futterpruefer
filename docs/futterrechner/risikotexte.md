> **Prüfvermerk Rechtsprüfung 27.10.2026: FREIGEGEBEN MIT AUFLAGEN (A1–A7, dazu Empfehlungen E1–E4).** A1 Taurin (Hinweis „nur zugesetztes Taurin“, Nass: Verwertbarkeit), A2 Kealy exakt (48 Labrador, 25 % weniger Futter, Median 1,8 Jahre), A3 R-F-HUND ohne Herstelleranfrage, A4 Pflichtzeile über der ersten Box in normaler Größe, A5–A7 Fallberichte statt Verallgemeinerung. Ersatztexte und Belege: /workspace/futterpruefer/rechtspruefung/2026-10-27_risikotexte-rechner.md. Bau erst nach Umsetzung und Mannis Freigabe. **Umsetzung A1–A7 wortgleich erledigt 27.10.2026 (Backup: risikotexte.md.bak-2026-10-27-vorA1A7).**

# Futterrechner: Risikotexte „Mögliche Folgen“ (Problem → Lösung)

Stand: 27.10.2026 · Auftrag Manni (t566u): „Testergebnis auch die Gefahren anzeigen, welche bei ungünstigen Werten bestehen“
Gilt für: `/futterrechner/hund`, `/futterrechner/katze` · Logik: `src/lib/futterrechner/` (main, Stand 3b52e7e)
Skill angewendet: **Risiko-Marketing belegt (Problem → Lösung)**. Jede Aussage nutzt „kann“ oder „erhöht das Risiko“, hat eine geprüfte Quelle und endet mit einer Lösung.
Status: **Entwurf. Vor dem Bau prüft die Rechtsprüfung, danach gibt Manni frei.**

---

## 1. Anzeige (für den Designer)

- **Wo:** In der Ergebnis-Karte unter „Warum?“, direkt unter dem jeweiligen Kriterium (`Grund`). Es erscheint nur bei `art === "warn"` (gelb) oder `art === "bad"` (rot). Ausnahme: Die Mengen-Texte (Abschnitt 3.7) erscheinen als Info unter der Tagesmenge.
- **Box:** Stil `fp-box warn`, Überschrift **„Mögliche Folgen“** (h4 bzw. `<p class="font-semibold">`), Icon AlertTriangle. Bei `warn` (gelb) ist die Box standardmäßig eingeklappt (`<details>`, Summary „Mögliche Folgen“), bei `bad` (rot) ist sie offen.
- **Inhalt:** Risikotext (1–2 Sätze), danach die Lösung als eigener Absatz mit Link, darunter in kleiner Schrift die Quelle als Fußnote (`text-xs text-muted`, z. B. „Quelle: FEDIAF 2025, S. 24; Schoenmakers et al. 2000“, verlinkt auf das Quellenverzeichnis der Seite oder direkt auf den DOI).
- **Mengen-Texte (3.7):** Stil `fp-box merk` (neutral), nicht `warn`, weil es kein ungünstiger Wert ist.
- **Höchstens 2 Boxen je Kriterium.** Bei Calcium/Phosphor gilt die Priorität aus 2.3. Die Ergebnis-Karte zeigt insgesamt höchstens 4 Boxen offen, weitere eingeklappt.
- **Pflichtzeile einmal über der ersten Box** (normale Textgröße, nicht `text-xs`, immer sichtbar, auch wenn alle Boxen eingeklappt sind): „Mögliche Folgen beschreiben allgemeine Risiken bei dauerhafter Fütterung, abgeleitet aus den eingegebenen Etikettwerten. Sie sind keine Diagnose für Ihr Tier. Zeigt Ihr Tier Auffälligkeiten, ist die Tierarztpraxis die richtige Adresse.“
- **Mobil 390 px:** Box über die volle Kartenbreite, kein horizontales Scrollen, Links umbrechen (`break-words`), Fußnote nicht abgeschnitten.
- **Keine neuen Farben, kein neues Layout:** nur die vorhandenen `fp-box`-Varianten und Tokens.

## 2. Trigger: Wann welcher Text erscheint (1:1 verdrahtbar)

Variablen wie in `bewertung.ts` / `naehrstoffe.ts`: `rp`, `rf`, `col` (Spalte), `welpe = col.startsWith("wachstum")`, `c` = Ergebnis von `caPCheck(...)` mit `c.ratio`, `c.caTs`, `c.pTs`, `c.regel.{caMin,caMax,pMin,pMax,rMin,rMax}`, `c.caUeber`, `c.nah`; Taurin `t.ok`, `nass = futter.typ === "nass" || m >= 60`; `aTs`, `faTs`, `tier.art`.

### 2.1 Protein und Fett

| ID | Bedingung | Status |
|---|---|---|
| R-P-HUND-ADULT | `tier.art==="hund" && col==="adult110" && rp < 1` | gelb bei 0,9 ≤ rp < 1 · rot bei rp < 0,9 |
| R-P-HUND-GERING | `tier.art==="hund" && col==="adult95" && rp < 1` | wie oben |
| R-P-WELPE | `col==="wachstum_frueh" \|\| col==="wachstum_spaet"`, `rp < 1` | wie oben |
| R-P-KATZE-ADULT | `col==="adult100" \|\| col==="adult75"`, `rp < 1` | wie oben |
| R-P-KITTEN | `col==="wachstum"` (Katze), `rp < 1` | wie oben |
| R-F-HUND | Hund, `col` adult110/adult95, `rf < 1` | gelb bei 0,9 ≤ rf < 1 · rot bei rf < 0,9 |
| R-F-WELPE | Hund, `welpe`, `rf < 1` | wie oben |
| R-F-KATZE | Katze (alle Spalten), `rf < 1` | wie oben |

Mindestwerte (FEDIAF 2025, Tab. III-3b/III-4b, g je 1000 kcal ME): Protein 45,0 / 52,1 / 62,5 / 50,0 (Hund adult110 / adult95 / Welpe < 14 Wo. / Welpe ≥ 14 Wo.), 62,5 / 83,3 / 70,0 (Katze adult100 / adult75 / Kitten). Fett 13,75 (Hund adult), 21,25 (Welpe), 22,5 (Katze, alle).
Zu viel Protein oder Fett: kein Trigger, weil FEDIAF dafür keinen Höchstwert nennt.

### 2.2 Taurin (nur Katze, nur wenn angegeben)

| ID | Bedingung | Status |
|---|---|---|
| R-T-KATZE | `tier.art==="katze" && futter.taurinMgKg!=null && !t.ok && !nass` (Minimum 0,10 / 0,13 / 0,10 % TS) | rot |
| R-T-KATZE-NASS | wie oben, aber `nass` (Minimum 0,20 / 0,27 / 0,25 % TS) | rot |

Taurin nicht angegeben: keine Box (bleibt Info-Text `taurinFehlt`).

### 2.3 Calcium und Phosphor (nur wenn Ca und P angegeben)

Priorität bei mehreren Treffern: 1. Ca über Max → 2. Ca unter Min → 3. Ca:P außerhalb → 4. P außerhalb. Höchstens 2 Boxen.

| ID | Bedingung | Status |
|---|---|---|
| R-CA-HOCH-WELPE | Hund, `welpe && c.caUeber` (Max 1,6 % TS < 14 Wo., 1,8 % TS ab 14 Wo.) | rot |
| R-CA-HOCH-HUND | Hund, `!welpe && c.caUeber` (Max 2,5 % TS) | rot |
| R-CA-NIEDRIG-WELPE | Hund, `welpe && c.caTs < c.regel.caMin` (1,0 bzw. 0,8 % TS) | rot |
| R-CA-NIEDRIG-HUND | Hund, `!welpe && c.caTs < c.regel.caMin` (0,50 / 0,58 % TS) | gelb (`c.nah`) sonst rot |
| R-CA-NIEDRIG-KATZE | Katze, `c.caTs < c.regel.caMin` (0,40 / 0,53 / 1,0 % TS) | rot bei Kitten, sonst wie Punkte (gelb/rot) |
| R-CAP-NIEDRIG-WELPE | Hund, `welpe && c.ratio < c.regel.rMin` (< 1 : 1) | gelb wenn `c.nah`, sonst rot |
| R-CAP-NIEDRIG-HUND | Hund, `!welpe && c.ratio < c.regel.rMin` (< 1 : 1) | gelb wenn `c.nah`, sonst rot |
| R-CAP-NIEDRIG-KATZE | Katze (alle), `c.ratio < c.regel.rMin` (< 1 : 1) | gelb wenn `c.nah`, sonst rot |
| R-CAP-HOCH-WELPE | Hund, `welpe && c.ratio > c.regel.rMax` (> 1,6 bzw. > 1,8 : 1) | gelb wenn `c.nah`, sonst rot |
| R-CAP-HOCH | alle übrigen, `c.ratio > c.regel.rMax` (Hund adult > 2 : 1, Katze adult > 2 : 1, Kitten > 1,5 : 1) | gelb wenn `c.nah`, sonst rot |
| R-PH-HOCH-HUND | Hund adult, `c.regel.pMax!==null && c.pTs > c.regel.pMax` (> 1,6 % TS) | gelb |
| R-PH-NIEDRIG | alle, `c.pTs < c.regel.pMin` | gelb, bei `welpe` rot |

Status folgt grundsätzlich dem vorhandenen `Grund.art` für `id: "ca"`. Die Tabelle legt nur fest, welcher Text gezeigt wird.

### 2.4 Rohasche, Rohfaser

| ID | Bedingung | Status |
|---|---|---|
| R-ASCHE-HOCH | `aTs > ASCHE_BAND.max` (> 12 % TS) | gelb |
| R-ASCHE-NIEDRIG | `aTs < ASCHE_BAND.min` (< 3 % TS) | gelb |
| R-FASER-HUND | `tier.art==="hund" && faTs > FASER_GRENZE_HUND` (> 8 % TS) | gelb |

### 2.5 Energie und Tagesmenge (Info, `fp-box merk`)

| ID | Bedingung |
|---|---|
| R-MENGE-HUND | `status==="ok"`, Hund adult, `menge != null` |
| R-MENGE-WELPE | `status==="ok"`, Hund `welpe` |
| R-MENGE-KATZE | `status==="ok"`, Katze (adult und Kitten) |
| R-LECKERLI | `status==="ergaenzung"` (Hund und Katze), unter dem Leckerli-Budget |

---

## 3. Die Texte

Format je Text: **Risiko** (1–2 Sätze) · **Lösung** (1 Satz mit Link) · **Quelle** (Fußnote, Kürzel aus Abschnitt 4).

### 3.1 Rohprotein zu niedrig

**R-P-HUND-ADULT**
- Risiko: Bekommt ein Hund dauerhaft zu wenig Eiweiß, kann er nach und nach Muskulatur abbauen, auch wenn er satt und zufrieden wirkt. Laut Fachliteratur erhöht das auf Dauer das Risiko, häufiger krank zu werden.
- Lösung: Wählen Sie ein Alleinfutter, das den FEDIAF-Mindestwert sicher erreicht, zum Beispiel aus unseren [grün oder gelb bewerteten Tests](/alleinfuttermittel-hund).
- Quelle: [Q4] Laflamme 2008; [Q1] FEDIAF 2025, Tab. III-3b

**R-P-HUND-GERING** (ältere, kastrierte oder wenig aktive Hunde)
- Risiko: Hunde mit geringem Energiebedarf fressen weniger, deshalb muss jede Kalorie mehr Eiweiß liefern. Reicht es nicht, kann der Körper Muskulatur abbauen. Bei älteren Hunden steigt der Eiweißbedarf laut Studienlage sogar um etwa die Hälfte.
- Lösung: Achten Sie auf mehr Eiweiß je 1000 kcal; worauf es im Alter ankommt, lesen Sie in unserem Ratgeber [Seniorenfutter für Hunde](/blog/seniorenfutter-hund).
- Quelle: [Q4] Laflamme 2008; [Q1] FEDIAF 2025, S. 22 und Tab. III-3b

**R-P-WELPE**
- Risiko: Welpen bauen jeden Tag Muskeln, Organe und Knochen auf. Liefert das Futter zu wenig Eiweiß, kann das Wachstum gebremst werden.
- Lösung: Füttern Sie ein Alleinfutter, das ausdrücklich für Welpen oder das Wachstum gedacht ist; was dabei zählt, steht in unserem Ratgeber [Welpenfutter: wie lange?](/blog/welpenfutter-wie-lange).
- Quelle: [Q1] FEDIAF 2025, S. 22 (Total protein, Growth); [Q2] NRC 2006, Kapitel Protein and Amino Acids

**R-P-KATZE-ADULT**
- Risiko: Katzen sind auf viel Eiweiß angewiesen. In einer Studie verloren Katzen bei knappem Eiweiß Muskelmasse, obwohl die üblichen Bilanzwerte noch unauffällig waren; das kann auf Dauer auch die Abwehrkräfte schwächen.
- Lösung: Prüfen Sie ein Futter mit mehr Eiweiß je 1000 kcal, besonders für Wohnungs- und kastrierte Katzen; getestete Katzenfutter finden Sie in unseren [Tests](/alleinfuttermittel-katze).
- Quelle: [Q5] Laflamme & Hannah 2013; [Q1] FEDIAF 2025, Tab. III-4b

**R-P-KITTEN**
- Risiko: Kitten wachsen sehr schnell und brauchen dafür mehr Eiweiß je Kalorie als erwachsene Katzen. Liefert das Futter zu wenig, kann das Wachstum gebremst werden.
- Lösung: Füttern Sie ein Futter für Kitten oder das Wachstum; mehr dazu in unserem Ratgeber [Kittenfutter: wie lange?](/blog/kittenfutter-wie-lange).
- Quelle: [Q1] FEDIAF 2025, Tab. III-4b; [Q2] NRC 2006, Kapitel Protein and Amino Acids

### 3.2 Rohfett zu niedrig

**R-F-HUND**
- Risiko: Fett liefert Energie und lebenswichtige Fettsäuren wie Linolsäure. Fehlen diese dauerhaft, kann das Fell stumpf und verfilzt werden und die Haut schuppen.
- Lösung: Wählen Sie ein Futter, das den Fett-Mindestwert erreicht. Ob genug essenzielle Fettsäuren drin sind, zeigt der Rohfettwert allein nicht; steht Linolsäure oder Omega-6 auf dem Etikett, hilft diese Angabe weiter.
- Quelle: [Q7] Kirby et al. 2007; [Q1] FEDIAF 2025, S. 23

**R-F-WELPE**
- Risiko: Welpen brauchen mehr Fett als erwachsene Hunde: für Energie und für Fettsäuren wie DHA, die sich in Gehirn und Netzhaut anreichern. Zu wenig davon kann Wachstum, Haut und Fell beeinträchtigen.
- Lösung: Füttern Sie ein Alleinfutter für Welpen oder das Wachstum; worauf Sie achten sollten, steht in unserem Ratgeber [Welpenfutter: wie lange?](/blog/welpenfutter-wie-lange).
- Quelle: [Q1] FEDIAF 2025, S. 23 (Omega-3 and 6, Growth); [Q7] Kirby et al. 2007

**R-F-KATZE**
- Risiko: Katzen können bestimmte Fettsäuren wie Arachidonsäure kaum selbst bilden und müssen sie mit dem Futter aufnehmen. Fehlen sie dauerhaft, kann das Haut, Fell und weitere Körperfunktionen beeinträchtigen.
- Lösung: Prüfen Sie ein Futter mit mehr Rohfett je 1000 kcal; getestete Katzenfutter finden Sie in unseren [Tests](/alleinfuttermittel-katze).
- Quelle: [Q8] Bauer 2006; [Q1] FEDIAF 2025, S. 28

### 3.3 Taurin zu niedrig (Katze)

**R-T-KATZE**
- Risiko: Katzen können Taurin nicht in ausreichender Menge selbst bilden. Ein dauerhafter Mangel kann die Netzhaut der Augen und den Herzmuskel schädigen und die Fortpflanzung beeinträchtigen. Auf der Packung steht meist nur das zugesetzte Taurin, Fleisch und Fisch liefern zusätzlich etwas; ein Wert unter dem Mindestwert heißt deshalb nicht sicher, dass Ihre Katze zu wenig bekommt.
- Lösung: Wählen Sie ein Futter, das den Taurin-Mindestwert sicher erreicht; alles Wichtige steht in unserem Ratgeber [Taurin für Katzen](/blog/taurin-katze).
- Quelle: [Q1] FEDIAF 2025, S. 60 (7.3.2) und Tab. III-4a; [Q9] Pion et al. 1987

**R-T-KATZE-NASS**
- Risiko: Katzen können Taurin nicht in ausreichender Menge selbst bilden, und aus erhitztem Nassfutter kann die Katze weniger davon verwerten. Deshalb liegt der Mindestwert dort etwa zwei- bis zweieinhalbmal so hoch; ein dauerhafter Mangel kann Netzhaut und Herzmuskel schädigen. Auf der Packung steht meist nur das zugesetzte Taurin, Fleisch und Fisch liefern zusätzlich etwas; ein Wert unter dem Mindestwert heißt deshalb nicht sicher, dass Ihre Katze zu wenig bekommt.
- Lösung: Wählen Sie ein Nassfutter, das den Taurin-Mindestwert für Nassfutter sicher erreicht; mehr in unserem Ratgeber [Taurin für Katzen](/blog/taurin-katze).
- Quelle: [Q1] FEDIAF 2025, S. 27 (Taurine: Bioverfügbarkeit bei Nassfutter, Hickman et al. 1990/1992) und S. 60; [Q9] Pion et al. 1987

### 3.4 Calcium

**R-CA-HOCH-WELPE**
- Risiko: Zu viel Calcium im Wachstum kann die Entwicklung des Skeletts stören, besonders bei großen Rassen. In Studien mit Doggen-Welpen führte ein Calcium-Überschuss zu Störungen an Wachstumsfugen und Knochen.
- Lösung: Wählen Sie ein Welpenfutter, das den Calcium-Höchstwert einhält, und geben Sie keine zusätzlichen Calcium-Präparate ohne Rücksprache mit Ihrer Tierarztpraxis.
- Quelle: [Q1] FEDIAF 2025, S. 24 (Calcium, Maximum for puppies); [Q10] Schoenmakers et al. 2000; [Q11] Lauten 2006

**R-CA-HOCH-HUND**
- Risiko: Liegt Calcium über dem FEDIAF-Höchstwert, kann das die Aufnahme von Spurenelementen wie Zink und Kupfer verringern.
- Lösung: Vergleichen Sie mit einem Futter, das Calcium im empfohlenen Bereich hält, und verzichten Sie auf zusätzliche Mineralstoff-Präparate ohne tierärztlichen Rat.
- Quelle: [Q1] FEDIAF 2025, S. 24 (Calcium, Adult dogs) und S. 25 (Trace elements, General)

**R-CA-NIEDRIG-WELPE**
- Risiko: Bekommt ein Welpe zu wenig Calcium, kann sein Skelett nicht richtig mineralisieren. Ein Fallbericht beschreibt einen Welpen mit selbst zusammengestellter Ration, der sich nach mäßiger Belastung den Oberschenkel brach.
- Lösung: Füttern Sie ein vollständiges Welpen-Alleinfutter; bei selbst zusammengestellten Rationen lohnt eine Rationsberechnung in der Tierarztpraxis.
- Quelle: [Q12] Becker et al. 2012; [Q1] FEDIAF 2025, S. 24

**R-CA-NIEDRIG-HUND**
- Risiko: Auch erwachsene Hunde brauchen genug Calcium. Fehlt es über lange Zeit, kann der Körper Calcium aus den Knochen holen und das Skelett schwächen; das betrifft vor allem selbst zusammengestellte Rationen ohne Mineralstoffergänzung.
- Lösung: Prüfen Sie ein Alleinfutter mit vollständiger Mineralstoffangabe, zum Beispiel aus unseren [Tests](/alleinfuttermittel-hund).
- Quelle: [Q12] Becker et al. 2012; [Q1] FEDIAF 2025, Tab. III-3a

**R-CA-NIEDRIG-KATZE**
- Risiko: Bei zu wenig Calcium, oft zusammen mit viel Phosphor wie bei reiner Fleischfütterung, kann der Körper Calcium aus den Knochen lösen. Ein Fallbericht über sechs Katzen beschreibt brüchige Knochen bis hin zu Spontanbrüchen.
- Lösung: Füttern Sie ein Alleinfutter mit Calcium im FEDIAF-Bereich; bei Kitten ist das besonders wichtig.
- Quelle: [Q13] Tomsa et al. 1999; [Q1] FEDIAF 2025, Tab. III-4a

### 3.5 Verhältnis Calcium zu Phosphor

**R-CAP-NIEDRIG-WELPE**
- Risiko: Steht mehr Phosphor als Calcium im Futter, gerät das Gleichgewicht für den Knochenaufbau durcheinander. Im Wachstum kann das die Mineralisierung des Skeletts beeinträchtigen.
- Lösung: Wählen Sie ein Welpenfutter mit einem Calcium-Phosphor-Verhältnis von 1 : 1 bis 1,6 : 1 (kleine Rassen bis 1,8 : 1); mehr dazu in unserem Ratgeber [Welpenfutter: wie lange?](/blog/welpenfutter-wie-lange).
- Quelle: [Q1] FEDIAF 2025, Tab. III-3a und S. 25 (Phosphorus); [Q11] Lauten 2006

**R-CAP-NIEDRIG-HUND**
- Risiko: Mehr Phosphor als Calcium kann den Calcium-Phosphor-Haushalt belasten. Bei stark umgekehrtem Verhältnis wurden bei erwachsenen Hunden nachteilige Wirkungen beschrieben.
- Lösung: Prüfen Sie ein Futter mit einem Verhältnis von 1 : 1 bis 2 : 1, zum Beispiel aus unseren [Tests](/alleinfuttermittel-hund).
- Quelle: [Q1] FEDIAF 2025, S. 25 (Phosphorus) und Tab. III-3a

**R-CAP-NIEDRIG-KATZE**
- Risiko: Liefert das Futter mehr Phosphor als Calcium, kann der Körper zum Ausgleich Calcium aus den Knochen holen. Ein Fallbericht über sechs Katzen beschreibt so brüchige Knochen.
- Lösung: Prüfen Sie ein Alleinfutter mit einem Verhältnis von 1 : 1 bis 2 : 1 (Kitten bis 1,5 : 1); getestete Katzenfutter finden Sie in unseren [Tests](/alleinfuttermittel-katze).
- Quelle: [Q13] Tomsa et al. 1999; [Q1] FEDIAF 2025, Tab. III-4a

**R-CAP-HOCH-WELPE**
- Risiko: Viel Calcium ohne passenden Phosphor kann im Wachstum die Knochenbildung stören. In einer Studie entwickelten Doggen-Welpen so rachitisähnliche Veränderungen am Skelett.
- Lösung: Wählen Sie ein Welpenfutter, dessen Verhältnis im FEDIAF-Bereich liegt, und geben Sie keine zusätzlichen Mineralstoffe ohne Rücksprache mit Ihrer Tierarztpraxis.
- Quelle: [Q10] Schoenmakers et al. 2000; [Q1] FEDIAF 2025, S. 24 und Tab. III-3a

**R-CAP-HOCH** (Hund adult, Katze, Kitten)
- Risiko: Ein Calcium-Überschuss gegenüber Phosphor kann die Verwertung von Spurenelementen wie Zink und Kupfer verringern.
- Lösung: Vergleichen Sie mit einem Futter, dessen Verhältnis im empfohlenen Bereich liegt, zum Beispiel aus unseren Tests für [Hunde](/alleinfuttermittel-hund) oder [Katzen](/alleinfuttermittel-katze).
- Quelle: [Q1] FEDIAF 2025, S. 24 (Calcium, Adult dogs) und S. 25 (Trace elements, General)

### 3.6 Phosphor

**R-PH-HOCH-HUND**
- Risiko: Sehr viel Phosphor kann den Calcium-Phosphor-Haushalt belasten, besonders wenn er aus leicht löslichen Phosphat-Zusätzen stammt. FEDIAF nennt deshalb für erwachsene Hunde einen Höchstwert.
- Lösung: Wählen Sie ein Futter im empfohlenen Bereich; wo Phosphate auf dem Etikett stehen, zeigt unser Ratgeber [Futterdeklaration richtig lesen](/blog/futterdeklaration-richtig-lesen).
- Quelle: [Q1] FEDIAF 2025, S. 21 (Fußnote h) und S. 25 (Phosphorus); [Q14] Dobenecker et al. 2021

**R-PH-NIEDRIG**
- Risiko: Phosphor ist neben Calcium der wichtigste Baustein von Knochen und Zähnen. Liegt er dauerhaft unter dem Mindestwert, kann das den Knochenstoffwechsel beeinträchtigen, im Wachstum ganz besonders.
- Lösung: Prüfen Sie die Eingabe und vergleichen Sie mit einem Alleinfutter, das den Mindestwert erreicht.
- Quelle: [Q1] FEDIAF 2025, Tab. III-3a und III-4a; [Q2] NRC 2006, Kapitel Minerals

### 3.7 Rohasche und Rohfaser

**R-ASCHE-HOCH**
- Risiko: Viel Rohasche heißt viele Mineralstoffe, oft aus Knochen. Das ist für sich kein Schaden, kann aber mit sehr viel Calcium und Phosphor einhergehen. In einer Untersuchung lagen 30 Hunde-Trockenfutter bei 4,8 bis 9,9 % der Trockenmasse.
- Lösung: Tragen Sie Calcium und Phosphor ein, dann prüft der Rechner das Verhältnis mit; mehr in unserem Ratgeber [Rohasche im Futter](/blog/rohasche-im-futter).
- Quelle: [Q6] Kazimierska et al. 2020

**R-ASCHE-NIEDRIG**
- Risiko: Sehr wenig Rohasche ist ungewöhnlich. Sie kann auf einen Tippfehler hindeuten oder darauf, dass wenig Mineralstoffe drin sind, und zu wenig Calcium kann auf Dauer den Knochen schaden.
- Lösung: Prüfen Sie die Eingabe und tragen Sie Calcium und Phosphor ein; Hilfe dazu gibt unser Ratgeber [Rohasche im Futter](/blog/rohasche-im-futter).
- Quelle: [Q6] Kazimierska et al. 2020; [Q12] Becker et al. 2012

**R-FASER-HUND**
- Risiko: Bei sehr faserreichem Hundefutter unterschätzt die Standardformel die Energie. Die berechnete Tagesmenge kann dann zu hoch sein, und dauerhaft zu reichliches Füttern erhöht das Risiko für Übergewicht.
- Lösung: Tragen Sie die Energieangabe des Herstellers ein, falls vorhanden, und wiegen Sie Ihren Hund alle zwei bis vier Wochen.
- Quelle: [Q1] FEDIAF 2025, S. 50 (Hinweis zu Rohfaser > 8 % TS); [Q15] German 2006

### 3.8 Energie und Tagesmenge (Info-Box „Gut zu wissen“, `fp-box merk`)

**R-MENGE-HUND**
- Risiko: Auch ein kleines Zuviel am Tag summiert sich über die Jahre. In einer Langzeitstudie mit 48 Labrador Retrievern lebten Hunde, die ein Leben lang 25 % weniger Futter bekamen als ihr Vergleichspartner, im Median 1,8 Jahre länger (13,0 statt 11,2 Jahre).
- Lösung: Starten Sie mit der berechneten Menge, wiegen Sie Ihren Hund alle zwei bis vier Wochen und passen Sie an; Schritt für Schritt erklärt in [Futtermenge Hund berechnen](/blog/futtermenge-hund-berechnen).
- Quelle: [Q3] Kealy et al. 2002; [Q1] FEDIAF 2025, S. 43

**R-MENGE-WELPE**
- Risiko: Überfütterung beschleunigt das Wachstum und kann besonders bei großen Rassen Skelettprobleme begünstigen. FEDIAF rät deshalb, Welpen nie zur freien Verfügung zu füttern.
- Lösung: Teilen Sie die Tagesmenge auf mehrere Mahlzeiten auf und gleichen Sie das Gewicht regelmäßig mit der Wachstumskurve ab.
- Quelle: [Q1] FEDIAF 2025, S. 55; [Q11] Lauten 2006

**R-MENGE-KATZE**
- Risiko: Kastrierte Katzen setzen leichter Fett an. Übergewicht ist bei Katzen weit verbreitet und erhöht das Risiko für Folgeerkrankungen.
- Lösung: Starten Sie mit der berechneten Menge, wiegen Sie Ihre Katze regelmäßig und passen Sie an; mehr in [Futtermenge Katze](/blog/futtermenge-katze).
- Quelle: [Q1] FEDIAF 2025, S. 43; [Q15] German 2006

**R-LECKERLI** (Ergänzungsfutter-Modus)
- Risiko: Leckerlis und Ergänzungsfutter sollten höchstens 10 % der täglichen Kalorien liefern. Mehr kann das Hauptfutter aus dem Gleichgewicht bringen und zu Übergewicht beitragen.
- Lösung: Halten Sie sich an das berechnete Leckerli-Budget und ziehen Sie größere Mengen von der Hauptmahlzeit ab; Tipps in [Wie viele Leckerlis am Tag?](/blog/wie-viele-leckerlis-am-tag).
- Quelle: [Q16] AAHA 2021; [Q15] German 2006

**Summe: 29 Texte** (Protein 5, Fett 3, Taurin 2, Calcium 5, Ca:P 5, Phosphor 2, Rohasche/Rohfaser 3, Menge/Leckerli 4).

---

## 4. Quellen (alle am 27.10.2026 geprüft, Titel, Band und Seiten per Crossref bzw. Verlagsseite abgeglichen)

- **[Q1]** FEDIAF (2025): Nutritional Guidelines for Complete and Complementary Pet Food for Cats and Dogs, Publication September 2025. Geprüfte Stellen: S. 21 (Fußnoten a, b, f, h), S. 22 (Protein), S. 23 (Fett, Omega-3/6), S. 24 (Calcium adult, RA puppies, Maximum for puppies), S. 25 (Phosphorus, Trace elements), S. 27 (Taurine), S. 28 (Fat, Katze), S. 43 (Body Condition Score), S. 50 (Rohfaser-Hinweis), S. 55 (Welpen nie ad libitum), S. 60 (7.3.2 Taurin Katze), Tab. III-3a/b, III-4a/b. https://europeanpetfood.org/wp-content/uploads/2025/09/FEDIAF-Nutritional-Guidelines_2025-ONLINE.pdf
- **[Q2]** National Research Council (2006): Nutrient Requirements of Dogs and Cats. National Academies Press. https://doi.org/10.17226/10668
- **[Q3]** Kealy RD, Lawler DF, Ballam JM, et al. (2002): Effects of diet restriction on life span and age-related changes in dogs. J Am Vet Med Assoc 220(9): 1315–1320. https://doi.org/10.2460/javma.2002.220.1315 (48 Labrador, paarweise, 25 % weniger Futter ab 8. Lebenswoche; Median 13,0 vs. 11,2 Jahre)
- **[Q4]** Laflamme DP (2008): Pet food safety: dietary protein. Top Companion Anim Med 23(3): 154–157. https://doi.org/10.1053/j.tcam.2008.04.009 (Muskelabbau, erhöhte Morbidität; Bedarf älterer Hunde etwa +50 %)
- **[Q5]** Laflamme DP, Hannah SS (2013): Discrepancy between use of lean body mass or nitrogen balance to determine protein requirements for adult cats. J Feline Med Surg 15(8): 691–697. https://doi.org/10.1177/1098612X12474448
- **[Q6]** Kazimierska K, Biel W, Witkowicz R (2020): Mineral Composition of Cereal and Cereal-Free Dry Dog Foods versus Nutritional Guidelines. Molecules 25(21): 5173. https://doi.org/10.3390/molecules25215173 (Rohasche 4,8–9,92 g/100 g TS)
- **[Q7]** Kirby NA, Hester SL, Bauer JE (2007): Dietary fats and the skin and coat of dogs. J Am Vet Med Assoc 230(11): 1641–1644. https://doi.org/10.2460/javma.230.11.1641
- **[Q8]** Bauer JE (2006): Metabolic basis for the essential nature of fatty acids and the unique dietary fatty acid requirements of cats. J Am Vet Med Assoc 229(11): 1729–1732. https://doi.org/10.2460/javma.229.11.1729
- **[Q9]** Pion PD, Kittleson MD, Rogers QR, Morris JG (1987): Myocardial failure in cats associated with low plasma taurine: a reversible cardiomyopathy. Science 237(4816): 764–768. https://doi.org/10.1126/science.3616607
- **[Q10]** Schoenmakers I, Hazewinkel HAW, Voorhout G, et al. (2000): Effects of diets with different calcium and phosphorus contents on the skeletal development and blood chemistry of growing Great Danes. Vet Rec 147(23): 652–660. https://pubmed.ncbi.nlm.nih.gov/11131552/
- **[Q11]** Lauten SD (2006): Nutritional risks to large-breed dogs: from weaning to the geriatric years. Vet Clin North Am Small Anim Pract 36(6): 1345–1359. https://doi.org/10.1016/j.cvsm.2006.09.003
- **[Q12]** Becker N, Kienzle E, Dobenecker B (2012): Kalziummangel – bei wachsenden und ausgewachsenen Hunden ein Problem. Zwei Fallberichte. Tierärztl Prax Ausg K 40(2): 135–139. https://doi.org/10.1055/s-0038-1623630
- **[Q13]** Tomsa K, Glaus T, Hauser B, et al. (1999): Nutritional secondary hyperparathyroidism in six cats. J Small Anim Pract 40(11): 533–539. https://doi.org/10.1111/j.1748-5827.1999.tb03015.x
- **[Q14]** Dobenecker B, Reese S, Herbst S (2021): Effects of dietary phosphates from organic and inorganic sources on parameters of phosphorus homeostasis in healthy adult dogs. PLoS One 16(2): e0246950. https://doi.org/10.1371/journal.pone.0246950
- **[Q15]** German AJ (2006): The growing problem of obesity in dogs and cats. J Nutr 136(7): 1940S–1946S. https://doi.org/10.1093/jn/136.7.1940S
- **[Q16]** AAHA (2021): Nutrition and Weight Management Guidelines for Dogs and Cats (10-%-Regel für Leckerlis), wie in konzept.md [A]: https://www.aaha.org/wp-content/uploads/2021/06/new-2021-aaha-nutrition-and-weight-management-guidelines-with-ref.pdf

Hinweis zu [Q5] und [Q4]: Beide Arbeiten stammen von einer Autorin, die bei einem Futterhersteller angestellt war. Sie sind peer-reviewed und werden in FEDIAF bzw. der Fachliteratur zitiert, wir nutzen sie nur für die allgemeine Aussage „zu wenig Eiweiß kann Muskulatur kosten“.

## 5. Compliance-Check (vor Abgabe an die Rechtsprüfung)

- Alle Risiken sind als „kann“ oder „erhöht das Risiko“ formuliert, nichts wird als sicher dargestellt. Es gibt keine Diagnose und keine Heil- oder Krankheitsversprechen zu Produkten. Kein Text nennt ein Produkt oder einen Hersteller.
- Auf jedes Risiko folgt eine Lösung: ein Test, ein Ratgeber oder die Tierarztpraxis. Kein Zeitdruck, keine Schuldsprache gegen den Leser.
- Die gesperrten Wörter aus der Projektliste kommen nicht vor (per Suche geprüft), keine Eigenwerbung zur Neutralität, kein „ersetzt den Tierarzt“.
- Krankheitsnamen werden nur als mögliche Folge eines Nährstoffmangels mit Quelle genannt (Netzhaut, Herzmuskel, Skelett), nie als Eigenschaft eines Futters.
- Prüfpunkte für die Rechtsprüfung: (1) Formulierungen zu Taurin (Herzmuskel) und Calcium im Wachstum (Skelett), (2) R-MENGE-HUND mit Studienzahl, (3) Lösungstext R-F-HUND („Hersteller kann auf Nachfrage nennen“), (4) Pflichtzeile unter den Boxen.

## 6. Technische Hinweise zum vorhandenen Code (beim Bau mit beheben)

1. `T.caPDaneben(ratio, rMax, …)` sagt immer „höchstens rMax“, auch wenn das Verhältnis **zu niedrig** ist (ratio < rMin). Bitte zusätzlich `caPZuNiedrig(ratio, rMin, zielgruppe)` mit „FEDIAF nennt für … mindestens 1 : 1“ einführen.
2. Fällt nur `okCa` (Ca unter Min) oder nur `okP` aus, zeigt der Code heute ebenfalls `caPDaneben`. Bitte eigene Grund-Texte für „Calcium unter Mindestwert“ und „Phosphor außerhalb“ ergänzen, passend zu den Risiko-IDs aus 2.3.
3. Vorschlag Datenmodell: `Grund` bekommt `risiken?: RisikoId[]`; neue Datei `src/lib/futterrechner/risiken.ts` mit `RISIKEN: Record<RisikoId, { risiko: string; loesung: string; link?: { href: string; text: string }; quellen: QuelleId[] }>` und `QUELLEN: Record<QuelleId, { kurz: string; voll: string; url: string }>`. Die Auswahl läuft rein über eine Funktion `risikenFuer(ergebnis, eingabe)`, die in `bewerte()` aufgerufen wird. Texte stehen nur dort, nicht in der DB.
4. Tests: je Risiko-ID ein Vitest-Fall (Trigger an der Schwelle knapp darüber und darunter), dazu ein Snapshot der Ergebnis-Karte bei T1 (keine Box) und bei einem Welpen mit Ca 2,0 % TS (R-CA-HOCH-WELPE offen).

---

## 7. Designer-Prompt (fertig zum Kopieren)

```
Auftrag: Futterrechner – Box „Mögliche Folgen“ bei ungünstigen Werten (Folge-PR)

Repo: cyberni74/futterpruefer · neuer Branch: feat/futterrechner-risiken · Ziel: Pull Request, danach Merge + Deploy (siehe Abnahme).

Grundlage (bitte vollständig lesen): /workspace/futterpruefer/futter-rechner-konzept/risikotexte.md
Stand: Rechtsprüfung 27.10.2026 FREIGEGEBEN, Auflagen A1–A7 bereits wortgleich eingearbeitet. Im Repo: Branch docs/futterrechner-risikotexte, Datei docs/futterrechner/risikotexte.md (von dort holen und mit in den PR nehmen). Die Texte dort sind final – nicht umformulieren.

Was zu bauen ist:
1. Neue Datei src/lib/futterrechner/risiken.ts mit allen 29 Texten (Abschnitt 3) WORTGLEICH, den Quellen Q1–Q16 (Abschnitt 4) und der Funktion risikenFuer(ergebnis, eingabe), die exakt die Trigger aus Abschnitt 2 umsetzt (Schwellen kommen aus fediaf.ts, keine neuen Zahlen erfinden).
2. Typ Grund um risiken?: RisikoId[] erweitern; bewerte() hängt die passenden IDs an die Gründe protein, fett, ca, taurin, asche, faser an. Priorität und Maximalzahl wie in 2.3 und Abschnitt 1.
3. Ergebnis-Karte: unter jedem Grund mit art "warn" oder "bad" die Box „Mögliche Folgen“ im vorhandenen Stil fp-box warn (rot = offen, gelb = eingeklappt per <details>). Risikotext, darunter die Lösung mit Link, darunter die Quelle als kleine Fußnote (text-xs) mit Link. Unter der Tagesmenge die Mengen-Box (R-MENGE-*) im Stil fp-box merk; im Ergänzungsfutter-Modus R-LECKERLI unter dem Leckerli-Budget. Einmal über der ersten Box die Pflichtzeile aus Abschnitt 1, normale Textgröße, immer sichtbar. Abnahme-Screenshots (a)–(d) müssen die Zeile zeigen.
4. Ca:P-Fehlerkorrekturen bleiben drin: Code-Fehler aus Abschnitt 6 beheben (caPDaneben bei zu niedrigem Verhältnis, eigene Texte für Ca unter Minimum und P außerhalb).
5. Tests: je Risiko-ID ein Vitest-Fall an der Schwelle, plus die zwei Snapshots aus Abschnitt 6.4. Alle bestehenden Tests müssen grün bleiben.

Regeln (nicht verhandelbar):
- Keine DB-Schreibzugriffe, keine Migrationen, keine Änderung an Review/BlogPost.
- Keine Änderung an Farben, Grundlayout, Menü oder Handy-Leiste; nur vorhandene fp-box-Varianten und Tokens.
- Texte wortgleich übernehmen; wenn dir ein Satz zu lang für die Box scheint, frag nach statt zu kürzen.
- Kein Force-Push, nichts löschen außer dem fehlerhaften Textbaustein, den du ersetzt.
- Keine Affiliate-Links in den Boxen; Links nur auf unsere eigenen Seiten (Tests, Ratgeber) und auf Quellen.

Abnahme vor dem Merge:
- Vercel-Preview-Link + Handy-Screenshots bei 390 px von: (a) Hund adult mit Protein unter Minimum (rote Box offen), (b) Welpe mit Calcium 2,0 % TS, (c) Katze Nassfutter mit Taurin unter Minimum, (d) gelber Fall eingeklappt, (e) Ergebnis ohne Auffälligkeiten (keine Box), (f) Ergänzungsfutter mit R-LECKERLI. Nichts darf überlaufen oder abgeschnitten sein, kein horizontales Scrollen.
- Freigaben liegen vor: Manni hat die Funktion am 27.10.2026, 07:04 beauftragt, die Rechtsprüfung hat die Texte am 27.10.2026 freigegeben (A1–A7 umgesetzt). Wenn alle Tests grün sind und der 390-px-Check (a)–(f) sauber ist, darfst du mergen und deployen. Danach Live-URL + Screenshots melden.
```
