# Seiten sofort neu erzeugen (POST /api/revalidate)

Seiten werden gecacht (ISR, 1 Stunde). Wer Inhalte **über den Admin** speichert, muss nichts tun: Die Speicheraktionen für Tests, Blog, Ticker, Produkt des Monats und FAQ rufen `revalidateContent` selbst auf.

Wer Inhalte **direkt in der Datenbank** ändert (SQL, Skript), ruft danach diesen Endpunkt auf. Sonst bleibt eine neu veröffentlichte Seite bis zu 60 Minuten ein zwischengespeicherter 404.

## Einrichtung (einmalig)

1. In Vercel (Project → Settings → Environment Variables, Production) die Variable **`REVALIDATE_SECRET`** anlegen. Wert: mindestens 16 Zeichen, zufällig, z. B. `openssl rand -hex 32`. Nie in Chat, Tickets oder das Repository schreiben.
2. Neu deployen (Umgebungsvariablen gelten erst für neue Deployments).
3. Ohne gesetztes Secret antwortet der Endpunkt immer mit **503**. Er ist dann nicht benutzbar.

## Aufruf

Nur `POST`, Token im Header `Authorization: Bearer …`. Das Secret steht in der Shell-Variable `REVALIDATE_SECRET`, nicht im Befehl.

```bash
export REVALIDATE_SECRET='…'   # aus dem Passwortspeicher, nicht aus dem Chat
URL=https://xn--futterprfer-0hb.de/api/revalidate

# Blogbeitrag: /blog/<slug>, /blog, Startseite, /sitemap.xml, /rss.xml
curl -sS -X POST "$URL" -H "Authorization: Bearer $REVALIDATE_SECRET" -H 'Content-Type: application/json' \
  -d '{"kind":"blog","slug":"pfotenbalsam-selber-machen-hund"}'

# Test (Review): Testseite, Kategorie, /tests, Marken, Startseite, Sitemap, RSS
# Die Kategorie sucht der Endpunkt selbst (nur lesend); optional "category":"alleinfuttermittel-katze"
curl -sS -X POST "$URL" -H "Authorization: Bearer $REVALIDATE_SECRET" -H 'Content-Type: application/json' \
  -d '{"kind":"review","slug":"leonardo-adult-gf-poultry-test"}'

# Mehrere Slugs (bis 20): "slugs":["a","b"]
# Einzelne Seiten (bis 20, nur Seitenpfade, kein /admin, kein /api, keine Query)
curl -sS -X POST "$URL" -H "Authorization: Bearer $REVALIDATE_SECRET" -H 'Content-Type: application/json' \
  -d '{"paths":["/marken/animonda","/faq"]}'

# Alles (alle gecachten Seiten)
curl -sS -X POST "$URL" -H "Authorization: Bearer $REVALIDATE_SECRET" -H 'Content-Type: application/json' \
  -d '{"all":true}'
```

Antwort bei Erfolg (`200`): `{"revalidated":["/","/sitemap.xml",…],"at":"…"}`.

| Status | Bedeutung |
|---|---|
| 200 | Seiten sind zur Neuerzeugung markiert, der nächste Abruf baut sie neu |
| 400 | Body ungültig (die Meldung nennt den Grund) |
| 401 | Token fehlt oder falsch |
| 413 | Body größer als 10 KB |
| 503 | `REVALIDATE_SECRET` fehlt oder ist kürzer als 16 Zeichen |

Nach dem Aufruf mit `curl -s -o /dev/null -w '%{http_code}\n' https://futterprüfer.de/blog/<slug>` prüfen. Die Neuerzeugung passiert beim ersten Abruf, nicht im Aufruf selbst.

## Sicherheit

- Der Endpunkt schreibt nichts in die Datenbank. Er liest höchstens die Kategorie eines Tests.
- Token-Vergleich in konstanter Zeit, Antworten mit `Cache-Control: no-store`, keine Fehlermeldung nennt das Secret.
- Das Secret rotieren: Variable in Vercel ändern und neu deployen.
