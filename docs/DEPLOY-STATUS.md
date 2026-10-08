# Deploy-Status (Übergabe für die nächste Claude-Sitzung)

## Erledigt
- GitHub: `cyberni74/futterpruefer`, Branch `main`
- Supabase: Projekt `futterpruefer` (Ref `cotopvhmsqztjtdsdnoc`, eu-central-1, Org „FeedFusion“)
  - Schema aller Migrationen angewendet, `_prisma_migrations` befüllt → `prisma migrate deploy` ist ein No-op
  - Rolle `prisma` (BYPASSRLS, Owner aller Tabellen); RLS auf allen Tabellen, anon/authenticated ohne Rechte
  - Daten: leer – der Build-Seed legt Kategorien, Admin und Demo-Inhalte an

## Offen: Vercel
1. Projekt aus dem GitHub-Repo anlegen (Vercel-Connector, Scope `bernhardehmer-3885s-projects`, Team `team_Sewsn2eWj2JUvmZVNX3GDcLq`)
2. Passwort der Rolle `prisma` neu setzen (Supabase MCP: `alter user "prisma" with password '…'`)
3. Env-Variablen (production + preview):
   - `DATABASE_URL` = `postgres://prisma.cotopvhmsqztjtdsdnoc:PW@HOST:6543/postgres`
   - `DIRECT_URL`   = `postgres://prisma.cotopvhmsqztjtdsdnoc:PW@HOST:5432/postgres?sslmode=require`
   - HOST = Supavisor-Host aus Supabase → Connect (aws-0- oder aws-1-eu-central-1.pooler.supabase.com)
   - `AUTH_SECRET` (openssl rand -base64 32), `NEXT_PUBLIC_SITE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (≥ 12 Zeichen)
4. Blob-Store anlegen und mit dem Projekt verbinden (`BLOB_READ_WRITE_TOKEN`)
5. Deploy, Build-Logs prüfen, Live-Seite + `/admin` testen
