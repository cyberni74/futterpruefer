// Nur lesend: meldet Tests, bei denen totalScore nicht der Summe der Teilwerte entspricht. Schreibt nichts.
// Aufruf: npx tsx scripts/check-score-sums.ts (liest DATABASE_URL, setzt die Transaktion auf READ ONLY)
import "dotenv/config";
import pg from "pg";
import { pgConfig } from "../src/lib/pg-config";
import { pruefeScoreSummen, type ScoreRow } from "../src/lib/score-sum-check";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) { console.error("DATABASE_URL fehlt"); process.exit(2); }
  const client = new pg.Client(pgConfig(url));
  await client.connect();
  try {
    await client.query("BEGIN READ ONLY");
    const { rows } = await client.query<ScoreRow>(
      `select slug, layout, "layoutData", "totalScore", "scoreRaw", "scoreHarmful", "scoreNutrients", "scoreDeclaration", "scoreNeeds", "scoreValue"
         from "Review" where status = 'PUBLISHED' order by slug`,
    );
    await client.query("ROLLBACK");
    const abweichungen = pruefeScoreSummen(rows);
    console.log(`[check-score-sums] ${rows.length} veröffentlichte Tests geprüft, ${abweichungen.length} Abweichung(en).`);
    for (const a of abweichungen) console.log(`  ${a.slug} (${a.schema}): totalScore ${a.gespeichert}, Summe der Teilwerte ${a.summe}`);
    process.exitCode = abweichungen.length ? 1 : 0;
  } finally {
    await client.end();
  }
}

main().catch((e) => { console.error(e); process.exit(2); });
