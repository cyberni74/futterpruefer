# Testvorlage V2 (`layout = "TESTVORLAGE_V2"`)

Feste, wiederverwendbare Vorlage für neue Tests. Daten und Darstellung sind getrennt: ein neuer Test entsteht nur über `Review.layoutData` (JSON), ohne neuen Code. Bestehende Tests bleiben unverändert (`layout = ""`).

## Schalter

| Spalte | Typ | Bedeutung |
|---|---|---|
| `Review.layout` | `String @default("")` | leer = bisheriges Layout, `TESTVORLAGE_V2` = Vorlage |
| `Review.layoutData` | `Json?` | Inhalte der Vorlage (siehe unten) |

Die Seite nutzt die Vorlage nur, wenn `layout = "TESTVORLAGE_V2"`, `layoutData` dem Schema entspricht **und** die Summe der Kriterien-Punkte der Gesamtwertung (`totalScore`) entspricht. Sonst rendert sie das bisherige Layout und schreibt einen Fehler ins Log (`console.error`).

Migration: `prisma/migrations/20261027110000_review_testvorlage_v2/migration.sql` (additiv, vor dem Deployment ausführen).

## Komponenten (`src/components/testvorlage-v2/`)

`ProductTestHero`, `OverallScoreGauge`, `CriterionScoreGauge`, `ScoreBreakdown`, `ProductFacts`, `IngredientAccordion`, `AnalyticalValues`, `FeedingTable`, `ScientificEvidence`, `ManufacturerClaims`, `CostCalculator`, `SafetyAssessment`, `ProsCons`, `EditorialConclusion`, `ProductFAQ`, `Sources`, `ArticleNavigation`. `TestvorlageV2` setzt sie zusammen. Gescoped CSS: `src/styles/testvorlage-v2.css` (alle Regeln unter `.tv2`).

- Tacho: Halbkreis, Mittelpunkt (100,104), Radius 78; der Endpunkt des Bogens wird aus `punkte/max` berechnet (kein `stroke-dasharray`), der Bogen bleibt ≤ 180°, bei 0 Punkten entfällt der Füllbogen.
- Gesamtwertung = Summe der Kriterien. Weicht `totalScore` ab, ist die Vorlage ungültig (Validierungsfehler beim Speichern, Rückfall mit Log-Eintrag bei der Auslieferung).
- Kriterien: Ergänzungsfutter 5 (Vorauswahl 20/30/20/15/15), Alleinfutter 6 (30/20/20/15/10/5), jede Karte mit eigenem Maximum. Das Grid zentriert die letzte Reihe (6 = 3+3, 5 = 3+2; mobil 2+2+2 bzw. 2+2+1).
- Nur der Kostenrechner ist ein Client-Baustein, alles andere wird serverseitig gerendert (Akkordeons über `details/summary`).

## `layoutData`

Alle Blöcke sind optional, fehlende Blöcke werden nicht gerendert. Unbekannte Schlüssel werden verworfen. Das Schema steht in `src/components/testvorlage-v2/schema.ts` (zod).

```json
{
  "hero": { "titel": "", "untertitel": "", "tags": [""], "gesamturteil": "", "notenwort": "" },
  "kennzahlen": [{ "wert": "", "label": "", "sub": "" }],
  "urteil": { "titel": "", "intro": "", "hervorhebung": "" },
  "kriterien": [{ "name": "", "punkte": 0, "max": 0, "kurz": "", "begruendung": "" }],
  "kapitel": [{ "id": "optional", "titel": "", "html": "<p>…</p>", "block": "zutaten|analyse|evidenz|herstellerangaben|preisrechner|sicherheit|proscons" }],
  "zutaten": [{ "name": "", "menge": "", "funktion": "", "bewertung": "" }],
  "analysewerte": [{ "name": "", "wert": "", "hinweis": "" }],
  "dosierung": { "kopf": ["Körpergewicht", "Tagesdosis"], "zeilen": [{ "label": "", "wert": "" }] },
  "evidenz": [{ "aussage": "", "status": "BELEGT|PLAUSIBEL|NICHT_VERIFIZIERT", "quelle": "" }],
  "herstellerangaben": [{ "label": "", "prozent": 0 }],
  "preisrechner": { "preis": 0, "inhalt": 0, "einheit": "STUECK|GRAMM|KILOGRAMM", "dosisProKg": 0, "koerpergewicht": 10, "tage": 30 },
  "sicherheit": { "stufe": "OK|HINWEIS|KRITISCH", "titel": "", "text": "" },
  "pros": [""], "cons": [""],
  "fazit": { "titel": "", "html": "" },
  "faq": [{ "frage": "", "antwort": "" }],
  "quellen": [{ "titel": "", "doi": "", "url": "https://…", "hinweis": "" }],
  "pruefstand": "", "methodikHinweis": "",
  "asin": "ASIN (10 Zeichen)", "bildnachweis": "", "aehnlicheTests": ["slug-eines-tests"]
}
```

Reihenfolge der Abschnitte: Urteil (Kriterien), Kapitel (jeweils mit optional eingebundenem Block), danach nicht eingebundene Blöcke in der Reihenfolge Zutaten, Nährwerte und Dosierung, Evidenz, Herstellerangaben, Preisrechner, Sicherheit, Vor- und Nachteile, dann Fazit, FAQ, Quellen. Die Nummerierung (01, 02 …) und die Anker-IDs entstehen automatisch.

Rich-Text (`kapitel[].html`, `fazit.html`) läuft immer durch `sanitize()` (kein `script`, kein `style`, keine Ereignis-Attribute). Innerhalb von Kapiteln bitte H3 statt H2 nutzen; die Seite hat genau eine H1.

## Seite und SEO

- Bleibt: Breadcrumbs, H1 (`reviewH1`), Metazeile, Produktbilder (plus `bildnachweis`), Warnhinweis bei irreführenden Werbeaussagen, Offenlegung, Teilen, „Ähnliche Tests“ (`aehnlicheTests` oder automatisch), Fachartikel.
- Entfällt bei der Vorlage: `VerdictPanel`, bisheriges Inhaltsverzeichnis, „Kurz gesagt“, Fazit-Doppelblock, automatische FAQ.
- `generateMetadata` ist unverändert (Self-Canonical, `metaTitle`/`metaDescription`, index/follow). Im Entwurf-Preview gilt weiter `noindex`.
- JSON-LD: `Product` mit `review.reviewRating` (`ratingValue = totalScore`, `bestRating 100`, `worstRating 0`), bewusst **ohne** `aggregateRating` (eine einzelne redaktionelle Wertung; Googles Regel zu selbst ausgestellten Bewertungen), ein `Article`, genau ein `FAQPage` aus `layoutData.faq` (sichtbar 1:1 wie im Schema).
- Amazon-Button: nur mit `asin` (oder einer `kaufUrl` mit Partner-Tag). Link `https://www.amazon.de/dp/<ASIN>?tag=<Partner-Tag>`, `rel="sponsored nofollow noopener"`, `target="_blank"`, darunter der Affiliate-Hinweis.

## Admin

Layout-Auswahl „Klassisch“ oder „TESTVORLAGE_V2“ im Test-Editor. Bei der Vorlage ersetzen strukturierte Formularbereiche das freie HTML-Feld. Live-Vorschau im iframe (Mobil 390 px oder Desktop), Import und Export von `layoutData` als JSON (`vorlage-daten.json`).

Prüfung beim Speichern als „Veröffentlicht“: Pflichtfelder, Kriterienzahl (5 bzw. 6), Summe der Punkte, Amazon-Tag, Sperrliste („zulässig“, „unzulässig“, „rechtlich angreifbar“, „Betrug“, „unabhängig“ in Bezug auf uns). Entwürfe lassen sich immer speichern.

## Vorschau und Tests

`/vorschau-testvorlage?k=5` bzw. `?k=6` zeigt die Vorlage mit neutralen Beispieldaten (nur lokal und auf Vercel-Previews, Produktion 404). Die Beispieldaten liegen in `src/components/testvorlage-v2/fixtures.ts`.

## Layout-Designsystem (verbindlich, Nachtrag 3)

Tokens `--fp-*` (Farben, Radien, Inhaltsbreite 1250 px) stehen scoped unter `.tv2`; die Vorlagen-Variablen sind darauf abgebildet. Schrift Inter (Fallback System), H1 28,8 bis 46 px (Hero), H2 22 bis 30 px, H3 18 bis 22 px, Fließtext 16 bis 17 px bei Zeilenhöhe 1,7, tabellarische Ziffern bei Zahlen.

- Raster: Sidebar 235 px, Abstand 28 px, ab 1024 px zweispaltig (Sidebar sticky unter dem festen Header, aktiver Abschnitt über `aria-current`). Darunter einspaltig mit einklappbarem Inhaltsverzeichnis. Inhaltsrand mobil 16 px.
- Hero (mintgrüne Fläche): Branding „Futterprüfer“, Kategorie-Badges, H1, Metazeile, Unterüberschrift (`hero.titel`), Einleitung (`hero.untertitel`), weiße Bewertungskarte mit Gesamttacho. Darunter drei oder vier Kennzahl-Karten (`kennzahlen`, höchstens 4; fehlende Werte erscheinen nicht).
- Tacho: groß höchstens 300 px, klein höchstens 160 px (alle gleich groß), Geometrie nach `gaugeArc` (Radius 78, Mitte 100/104, drei Nachkommastellen). Kriterien-Grid: mobil 2 Spalten (unter 360 px eine), ab 900 px 3 Spalten, letzte Reihe zentriert.
- Geprüft bei 320, 375, 390, 430, 768, 1024 und 1440 px (keine horizontale Scrollleiste, Tachos in ihren Karten, genau eine H1).
