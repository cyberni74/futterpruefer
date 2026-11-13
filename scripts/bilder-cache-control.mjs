// Setzt Cache-Control der bestehenden Objekte im Bucket „bilder“ auf
// `public, max-age=31536000, immutable`.
//
// Neue Uploads setzen diesen Header bereits (src/lib/supabase-storage.ts,
// scripts/image-variants.mjs). Ältere Objekte wurden mit `cacheControl: 31536000`
// gespeichert. Supabase liefert das als `cache-control: public, 31536000`
// (ohne max-age=); der Storage-Gateway antwortet darauf inzwischen mit
// `private, no-cache`. Browser cachen die Bilder dann nicht ein Jahr.
//
// Nicht automatisch ausführen. Dry-Run ist die Voreinstellung.
//   node scripts/bilder-cache-control.mjs           # zählt, ändert nichts
//   node scripts/bilder-cache-control.mjs --apply   # schreibt metadata.cacheControl
//
// Braucht DATABASE_URL (direkte Postgres-Verbindung, nicht der Pooler-Transaction-Modus).
// Der Wert wird nicht ausgegeben.

import "dotenv/config";
import pg from "pg";

const TARGET = "public, max-age=31536000, immutable";
const APPLY = process.argv.includes("--apply");

const sql = `
  SELECT name, COALESCE(metadata->>'cacheControl', '') AS cache_control
  FROM storage.objects
  WHERE bucket_id = 'bilder'
  ORDER BY name
`;

const updateSql = `
  UPDATE storage.objects
  SET metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{cacheControl}',
    to_jsonb($1::text),
    true
  )
  WHERE bucket_id = 'bilder'
    AND COALESCE(metadata->>'cacheControl', '') IS DISTINCT FROM $1
`;

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error("DATABASE_URL fehlt. Es wurde nichts geändert.");
  process.exit(1);
}

const client = new pg.Client({ connectionString: url });
await client.connect();
try {
  const { rows } = await client.query(sql);
  const wrong = rows.filter((row) => row.cache_control !== TARGET);
  console.log(`${rows.length} Objekte im Bucket bilder, ${wrong.length} ohne „${TARGET}“.`);
  const samples = [...new Set(wrong.map((row) => row.cache_control || "(leer)"))];
  console.log("bisherige Werte:", samples.join(" | ") || "(keine)");
  if (!APPLY) {
    console.log("Dry-Run. Zum Schreiben: node scripts/bilder-cache-control.mjs --apply");
  } else if (wrong.length) {
    const result = await client.query(updateSql, [TARGET]);
    console.log(`aktualisiert: ${result.rowCount}`);
  }
} finally {
  await client.end();
}
