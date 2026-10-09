---
name: seo-starter-guide
description: Google-Leitfaden für Suchmaschinenoptimierung (SEO Starter Guide) als Prüfliste für futterprüfer.de. Verwenden bei jeder Arbeit an Seitentiteln, Meta-Beschreibungen, URLs, Überschriften, Bildern, Links, Sitemap, robots, strukturierten Daten, neuen Seiten oder Artikeln, und für SEO-Audits vor Releases.
---

# SEO-Leitfaden für Futterprüfer (nach Googles „SEO Starter Guide“)

Quelle: https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=de
Hinweis: Diese Fassung ist aus dem Wissen über den Leitfaden (Überarbeitung 2024) und Auszügen der Seite zusammengestellt, nicht aus einem vollständigen Abruf. Bei Zweifeln die Originalseite lesen.

Grundsatz: Google belohnt hilfreiche, zuverlässige Inhalte, die für Menschen geschrieben sind. SEO macht Inhalte auffindbar und verständlich, es ersetzt sie nicht. Änderungen wirken nach Stunden bis Monaten, mindestens einige Wochen abwarten.

## 1. Google soll die Seiten finden
- Jede Seite ist über mindestens einen Link von einer anderen auffindbaren Seite erreichbar (Menü, Kategorie, „Verwandte Tests“, Lexikon-Links).
- Links sind echte `<a href>`-Elemente. Keine Navigation nur über Skripte oder Formulare.
- XML-Sitemap unter `/sitemap.xml`, in `robots.txt` verlinkt, bei der Search Console eingereicht. Nur indexierbare Seiten mit kanonischer URL aufnehmen.
- `robots.txt` sperrt nur, was nicht in die Suche soll (`/admin`, `/api/`, Suche, Vergleich). Nie CSS/JS/Bilder sperren.
- Seiten, die nicht in die Suche sollen: `noindex` (Meta-Robots), nicht nur robots.txt. Gesperrte Seiten können trotzdem indexiert werden, wenn sie verlinkt sind.
- Auf `vercel.app` und lokal immer `noindex`; nur die Hauptdomain wird indexiert (`isIndexable` in `src/lib/site.ts`).

## 2. Inhalte
- **Hilfreich und zuverlässig:** Eigene Bewertung, Methodik offenlegen, Quellen nennen, Datum der Aktualisierung zeigen, Autorenschaft/Verantwortliche klar benennen (Team, Impressum). Keine Texte nur für Suchmaschinen.
- **Titel (`<title>`):** je Seite einzigartig, knapp und treffend (grob 30–60 Zeichen), wichtigstes zuerst, Marke am Ende (`| Futterprüfer`). Kein Keyword-Stuffing, keine Wiederholung gleicher Titel.
- **Meta-Beschreibung:** je Seite einzigartig, 1–2 Sätze (grob 70–160 Zeichen), fasst den Inhalt zusammen. Das Meta-Keywords-Tag nutzt Google nicht.
- **Überschriften:** genau eine H1 je Seite, danach H2/H3 logisch ohne Ebenen zu überspringen. H1 ≈ Thema der Seite.
- **Lesbarer Text:** kurze Absätze, Zwischenüberschriften, Listen/Tabellen für Fakten. Text steht als HTML im Dokument, nicht in Bildern.
- **Kein Duplicate Content:** Gleiche Inhalte nur unter einer URL. Sonst Kanonisierung (`rel="canonical"`) oder 301/308-Weiterleitung.

## 3. Darstellung in den Suchergebnissen
- **Titel-Link** kommt aus `<title>` und H1. Beide sollten zusammenpassen.
- **Snippet** kommt aus der Meta-Beschreibung oder dem Seitentext.
- **Strukturierte Daten (JSON-LD)** passend zum sichtbaren Inhalt, nie für Unsichtbares: Test = Product + Review, Artikel = Article, Brotkrumen = BreadcrumbList, FAQ = FAQPage nur wenn die Fragen sichtbar sind, Startseite = Organization + WebSite. Mit dem Rich-Results-Test prüfen.
- **Favicon** (`favicon.ico`, Icon ≥ 48 px, Vielfaches von 48) und **Brotkrumen** sichtbar und als Markup.
- **Vorschaubild** (`og:image` 1200×630) auf jeder Seite, Open-Graph- und Twitter-Tags.

## 4. Struktur und URLs
- Sprechende, stabile, kleingeschriebene URLs mit Bindestrichen: `/alleinfuttermittel-hund/produktname`. Keine Session-IDs, keine kryptischen Parameter.
- Pro Inhalt genau eine URL. Umbenennen nur mit dauerhafter Weiterleitung (308/301) von der alten Adresse.
- Hierarchie: Start → Kategorie → Test; Breadcrumbs zeigen den Pfad.
- Eigene 404-Seite mit Wegen zurück, richtiger Statuscode 404 für nicht vorhandene Seiten.
- HTTPS überall, eine Hauptdomain (www und Fremdadressen leiten dauerhaft um).

## 5. Bilder
- Beschreibender **Alt-Text** zu jedem inhaltlichen Bild (kurz, konkret, bei Verpackung „Verpackung von …“). Dekorative Bilder mit leerem Alt (`alt=""`).
- Sprechende **Dateinamen** (`drei-hunde-auf-blumenwiese-hundefutter-test.webp`), keine `IMG_1234.jpg`.
- Bilder nahe am passenden Text, scharf, modernes Format (WebP/AVIF), responsive `srcset`/`sizes`, Lazy Loading unterhalb des ersten Bildschirms, das erste große Bild (LCP) mit `priority`.
- Bild-Sitemap nicht nötig, solange Bilder per `<img>` im HTML stehen.

## 6. Links
- **Linktext** beschreibt das Ziel („Methodik“, „Test: Royal Canin Mini Adult“), nie „hier klicken“.
- Interne Links großzügig: Test ↔ Lexikon/Glossar ↔ Fachblog ↔ Kategorie.
- Externe Quellen nennen (Gesetze, Studien, Hersteller). Bezahlte oder nicht vertrauenswürdige Links mit `rel="sponsored"` bzw. `rel="nofollow"`/`ugc`. Affiliate-Links immer `sponsored` und gekennzeichnet.
- Keine Linkkäufe, keine Linktausch-Netzwerke.

## 7. Technik und Nutzer
- Mobilfreundlich (responsive, Tippflächen ≥ 44 px, kein horizontales Scrollen), schnelle Ladezeit (Core Web Vitals: LCP < 2,5 s, CLS < 0,1, INP < 200 ms), `lang="de"` und Viewport-Meta.
- Keine aufdringlichen Pop-ups, die Inhalt verdecken (Cookie-Hinweis klein halten).
- Inhalte nicht hinter Login/Skript-Rendering verstecken.

## 8. Nicht tun
- Keyword-Stuffing, versteckter Text, Cloaking, Doorway-Seiten, automatisch erzeugte Massenseiten, kopierte Inhalte (Spam-Richtlinien).
- Gleiche Titel/Beschreibungen für viele Seiten.
- Falsche oder irreführende strukturierte Daten (z. B. AggregateRating ohne echte Nutzerbewertungen).
- Wichtige Seiten per `noindex` oder robots.txt aussperren.

## 9. Messen und verbessern
- Google Search Console: Domain bestätigen, Sitemap einreichen, URL-Prüfung, Leistungsbericht (Suchanfragen, Klicks, Position), Abdeckung/Indexierung, Core Web Vitals.
- Nach Änderungen einige Wochen beobachten.

## So wird hier geprüft
1. `node scripts/seo-audit.mjs http://localhost:3001` prüft jede URL der Sitemap auf Titel, Beschreibung, H1, Überschriftenfolge, Canonical, Alt-Texte, leere Links, Strukturierte Daten, Open Graph, kaputte interne Links und doppelte Titel/Beschreibungen.
2. Vorher lokal bauen und starten, mit `NEXT_PUBLIC_SITE_URL=http://localhost:3001`, damit Canonical-Adressen zur geprüften Adresse passen.
3. Befunde beheben, erneut laufen lassen, bis keine Fehler (✗) bleiben. Hinweise (!) bewusst entscheiden.
