# Futterprüfer.de

Bewertungsportal für Hunde- und Katzenfutter (Deutsch, Mobile First).

**Stack:** Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · Framer Motion · PostgreSQL + Prisma 7 · Auth.js · TipTap · sharp · Vercel Blob · next-themes

## Lokal starten

```bash
cp .env.example .env          # Werte eintragen
npm install                   # generiert auch den Prisma-Client
npx prisma migrate deploy     # Schema + Volltextsuche (pg_trgm, deutsche FTS)
npm run db:seed               # Kategorien, Admin-Konto, Demo-Inhalte
npm run dev                   # http://localhost:3000, Admin: /admin
```

## Prüfungen

```bash
npm test                      # Unit-Tests (vitest)
npm run typecheck
npm run lint
npm run build
node scripts/smoke.mjs http://localhost:3000 / /tests      # Render-Check mobil + desktop
node scripts/qa-interactions.mjs                            # Suche, Dark Mode, Vergleich, Kontakt
```

## Deployment (Vercel)

1. Repository mit Vercel verbinden.
2. Postgres anlegen (Neon über Vercel Marketplace) → `DATABASE_URL` wird gesetzt.
3. `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL` setzen; optional Blob, Resend, Turnstile, Anthropic.
4. Der Build führt `prisma migrate deploy` und den (idempotenten) Seed aus: Kategorien, Admin-Konto aus `ADMIN_EMAIL`/`ADMIN_PASSWORD` und – nur bei leerer DB – Demo-Inhalte. Passwort ändern = `ADMIN_PASSWORD` ändern + Redeploy.

## Inhalte vor dem Livegang

- Alle Demo-Tests (fiktive Marken) und Demo-Blogartikel ersetzen.
- Gelb markierte Platzhalter auf **Methodik** (Interessenkonflikte), **Über mich**, **Impressum**, **Datenschutz** ausfüllen und rechtlich prüfen lassen.

## Architektur

- `src/app/(site)` – öffentliche Seiten (ISR, `revalidate = 3600`; beim Speichern im Admin sofortige Revalidierung über `src/lib/revalidate.ts`)
- `src/app/admin` – Redaktionsbereich (Login mit Rate Limiting, jede Server-Action prüft `requireAdmin()`)
- `src/lib/scoring.ts` – Kriterien, Maxima, Ampel, Warnsignal (eine Quelle für Frontend, Admin und Validierung)
- `src/lib/search.ts` – deutsche Volltextsuche + Trigramm-Ähnlichkeit
- Slug-Änderungen erzeugen automatisch 301-Weiterleitungen (`Redirect`-Tabelle)
