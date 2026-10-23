// Erzeugt für jedes Bild im Supabase-Bucket „bilder“ die Varianten -400 und -800 (WebP), falls sie fehlen.
// Läuft im Build vor `next build`. Nie fatal: bei Fehlern bleibt das Bereit-Flag aus, die Seite lädt dann nur das Original.
import "dotenv/config";
import fs from "node:fs";
import sharp from "sharp";

const HOST = "cotopvhmsqztjtdsdnoc.supabase.co";
const BUCKET = "bilder";
const WIDTHS = [400, 800];
const READY_FILE = new URL("../src/data/image-variants-ready.json", import.meta.url);
const log = (m) => console.log(`[bildvarianten] ${m}`);
const setReady = (value) => fs.writeFileSync(READY_FILE, `${JSON.stringify({ supabase: value })}\n`);

const isVariant = (name) => WIDTHS.some((w) => name.endsWith(`-${w}.webp`));
const variantName = (name, w) => name.replace(/\.webp$/, `-${w}.webp`);

async function main() {
  const raw = process.env.SUPABASE_URL?.trim() ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
  if (!raw || !key || /[\r\n]/.test(key)) return log("übersprungen: SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY fehlt");
  const base = new URL(raw);
  if (base.protocol !== "https:" || base.hostname !== HOST) return log("übersprungen: SUPABASE_URL zeigt nicht auf den vorgesehenen Host");
  const api = `https://${HOST}/storage/v1`;
  const auth = { apikey: key, Authorization: `Bearer ${key}` };

  async function listNames() {
    const names = new Set();
    for (let offset = 0; ; offset += 1000) {
      const res = await fetch(`${api}/object/list/${BUCKET}`, {
        method: "POST",
        headers: { ...auth, "Content-Type": "application/json" },
        body: JSON.stringify({ prefix: "", limit: 1000, offset, sortBy: { column: "name", order: "asc" } }),
      });
      if (!res.ok) throw new Error(`Liste: Status ${res.status}`);
      const rows = await res.json();
      for (const r of rows) if (r.id && typeof r.name === "string") names.add(r.name);
      if (rows.length < 1000) return names;
    }
  }

  const names = await listNames();
  const bases = [...names].filter((n) => n.endsWith(".webp") && !isVariant(n));
  const todo = bases.flatMap((n) => WIDTHS.filter((w) => !names.has(variantName(n, w))).map((w) => ({ name: n, w })));
  log(`${bases.length} Bilder, ${todo.length} fehlende Varianten`);

  const started = Date.now();
  let done = 0;
  let failed = 0;
  const queue = [...todo];
  async function worker() {
    for (let job = queue.shift(); job; job = queue.shift()) {
      if (Date.now() - started > 8 * 60_000) { failed++; continue; }
      try {
        const src = await fetch(`${api}/object/public/${BUCKET}/${job.name}`);
        if (!src.ok) throw new Error(`Download ${src.status}`);
        const body = await sharp(Buffer.from(await src.arrayBuffer())).resize({ width: job.w, withoutEnlargement: true }).webp({ quality: 60, effort: 5 }).toBuffer();
        const up = await fetch(`${api}/object/${BUCKET}/${variantName(job.name, job.w)}`, {
          method: "POST",
          headers: { ...auth, "Content-Type": "image/webp", "cache-control": "public, max-age=31536000, immutable", "x-upsert": "true" },
          body: new Uint8Array(body),
        });
        if (!up.ok) throw new Error(`Upload ${up.status}`);
        done++;
      } catch (e) {
        failed++;
        log(`Fehler bei ${job.name} (${job.w}): ${e.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker));
  log(`erzeugt: ${done}, fehlgeschlagen: ${failed}`);

  // Erst nach erneuter Prüfung als bereit melden.
  const after = await listNames();
  const missing = bases.filter((n) => WIDTHS.some((w) => !after.has(variantName(n, w))));
  if (missing.length === 0) {
    setReady(true);
    log("alle Varianten vorhanden, srcset für Supabase-Bilder aktiv");
  } else {
    log(`${missing.length} Bilder ohne vollständige Varianten, srcset bleibt aus`);
  }
}

setReady(false);
main().catch((e) => log(`abgebrochen: ${e.message}`)).finally(() => process.exit(0));
