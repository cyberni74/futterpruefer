// Build-Ablauf mit Diagnose und automatischer Wahl des Supabase-Pooler-Hosts.
// 1. Pflicht-Variablen prüfen  2. funktionierenden DB-Host ermitteln  3. migrate → seed → next build
import "dotenv/config";
import { spawnSync } from "node:child_process";
import pg from "pg";

const log = (m) => console.log(`[futterpruefer-build] ${m}`);
const fail = (m) => { console.error(`[futterpruefer-build] FEHLER: ${m}`); process.exit(1); };

const required = ["DATABASE_URL", "AUTH_SECRET"];
const missing = required.filter((k) => !process.env[k]);
log(`Variablen gesetzt: ${["DATABASE_URL", "DIRECT_URL", "AUTH_SECRET", "NEXT_PUBLIC_SITE_URL", "ADMIN_EMAIL", "ADMIN_PASSWORD", "BLOB_READ_WRITE_TOKEN"].map((k) => `${k}=${process.env[k] ? "ja" : "nein"}`).join(", ")}`);
if (missing.length) fail(`Fehlende Umgebungsvariablen: ${missing.join(", ")}`);

const parse = (s) => { try { return new URL(s); } catch { return null; } };
const db = parse(process.env.DATABASE_URL);
if (!db) fail("DATABASE_URL ist keine gültige URL");
const direct = parse(process.env.DIRECT_URL ?? process.env.DATABASE_URL);

async function tryHost(host) {
  const u = new URL(direct.toString());
  u.hostname = host;
  u.search = "";
  const client = new pg.Client({ connectionString: u.toString(), ssl: /^(localhost|127\.)/.test(host) ? undefined : { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 });
  try {
    await client.connect();
    await client.query("select 1");
    return true;
  } catch (e) {
    log(`Host ${host}: ${e.message}`);
    return false;
  } finally {
    await client.end().catch(() => {});
  }
}

const original = db.hostname;
const m = original.match(/^aws-(\d+)-([a-z0-9-]+)\.pooler\.supabase\.com$/);
const candidates = m ? [original, ...[0, 1, 2].filter((n) => String(n) !== m[1]).map((n) => `aws-${n}-${m[2]}.pooler.supabase.com`)] : [original];
let host = null;
for (const h of candidates) if (await tryHost(h)) { host = h; break; }
if (!host) fail(`Keine Datenbankverbindung möglich (getestet: ${candidates.join(", ")})`);
log(`Datenbank erreichbar über ${host}${host !== original ? ` (statt ${original})` : ""}`);

const withHost = (s) => { const u = new URL(s); u.hostname = host; return u.toString(); };
const env = {
  ...process.env,
  DATABASE_URL: withHost(process.env.DATABASE_URL),
  ...(process.env.DIRECT_URL ? { DIRECT_URL: withHost(process.env.DIRECT_URL) } : {}),
  DB_HOST_OVERRIDE: host !== original ? host : "",
};

for (const [label, cmd, args] of [
  ["Migrationen", "npx", ["prisma", "migrate", "deploy"]],
  ["Seed", "npx", ["tsx", "prisma/seed.ts"]],
  ["Next-Build", "npx", ["next", "build"]],
]) {
  log(`${label} …`);
  const r = spawnSync(cmd, args, { stdio: "inherit", env });
  if (r.status !== 0) fail(`${label} fehlgeschlagen (Exit ${r.status})`);
}
log("fertig");
