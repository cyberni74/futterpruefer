import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { nurAnlegen, seedBlockReason } from "./seed-guard";

const lokal = { ALLOW_SEED: "1", DATABASE_URL: "postgresql://fp:fp@localhost:5432/fp" };
const wurzel = resolve(__dirname, "../..");

describe("Seed-Sperre", () => {
  it("läuft lokal nur mit ALLOW_SEED=1", () => {
    expect(seedBlockReason(lokal)).toBeNull();
    expect(seedBlockReason({ DATABASE_URL: lokal.DATABASE_URL })).toMatch(/ALLOW_SEED/);
    expect(seedBlockReason({ ...lokal, ALLOW_SEED: "true" })).toMatch(/ALLOW_SEED/);
    expect(seedBlockReason({ ...lokal, ALLOW_SEED: "0" })).toMatch(/ALLOW_SEED/);
    expect(seedBlockReason({})).not.toBeNull();
  });
  it("sperrt auf Vercel und in CI, auch mit ALLOW_SEED=1", () => {
    for (const extra of [{ VERCEL: "1" }, { VERCEL_ENV: "production" }, { VERCEL_ENV: "preview" }, { VERCEL_URL: "x.vercel.app" }, { CI: "true" }]) {
      expect(seedBlockReason({ ...lokal, ...extra }), JSON.stringify(extra)).not.toBeNull();
    }
    expect(seedBlockReason({ ...lokal, VERCEL: "1", ALLOW_SEED_REMOTE: "1" })).toMatch(/Vercel/);
  });
  it("sperrt entfernte Datenbanken ohne ALLOW_SEED_REMOTE=1", () => {
    const remote = { ALLOW_SEED: "1", DATABASE_URL: "postgresql://u:p@aws-0-eu-central-1.pooler.supabase.com:6543/postgres" };
    expect(seedBlockReason(remote)).toMatch(/nicht lokal/);
    expect(seedBlockReason({ ...remote, ALLOW_SEED_REMOTE: "1" })).toBeNull();
    expect(seedBlockReason({ ALLOW_SEED: "1", DATABASE_URL: "kaputt" })).toMatch(/DATABASE_URL/);
    expect(seedBlockReason({ ALLOW_SEED: "1", DATABASE_URL: "postgresql://fp:fp@127.0.0.1:5432/fp" })).toBeNull();
  });
  it("der Build ruft den Seed nicht auf, das Seed-Skript prüft die Sperre vor jeder Datenbankarbeit", () => {
    const build = readFileSync(resolve(wurzel, "scripts/vercel-build.mjs"), "utf8");
    expect(build).not.toMatch(/prisma\/seed/);
    expect(build).not.toMatch(/\["Seed"/);
    const pkg = JSON.parse(readFileSync(resolve(wurzel, "package.json"), "utf8")) as { scripts: Record<string, string> };
    for (const k of ["build", "postinstall", "start"]) expect(pkg.scripts[k]).not.toMatch(/seed/);
    const seed = readFileSync(resolve(wurzel, "prisma/seed.ts"), "utf8");
    expect(seed.indexOf("seedBlockReason(process.env)")).toBeGreaterThan(-1);
    expect(seed.indexOf("seedBlockReason(process.env)")).toBeLessThan(seed.indexOf("new PrismaClient"));
    expect(seed).toContain("process.exit(0)");
    expect(seed).toContain("nurAnlegen(new PrismaClient");
  });
});

describe("nurAnlegen: der Seed überschreibt nichts", () => {
  type Aufruf = { op: string; arg?: unknown };
  const bauen = (vorhanden: boolean) => {
    const aufrufe: Aufruf[] = [];
    const delegate = {
      findUnique: async (a: unknown) => { aufrufe.push({ op: "findUnique", arg: a }); return vorhanden ? { id: "x", punkte: 1 } : null; },
      create: async (a: unknown) => { aufrufe.push({ op: "create", arg: a }); return { id: "neu" }; },
    };
    let handler: Record<string, (a: unknown) => Promise<unknown>> = {};
    const base = { review: delegate, $extends: (cfg: { query: { $allModels: typeof handler } }) => { handler = cfg.query.$allModels; return base; } };
    const stat = { uebersprungen: 0 };
    nurAnlegen(base, stat);
    return { handler: () => handler, aufrufe, stat };
  };
  it("update und delete ändern nichts und liefern den vorhandenen Datensatz", async () => {
    const t = bauen(true);
    expect(await t.handler().update({ model: "Review", args: { where: { id: "x" }, data: { punkte: 2 } } })).toEqual({ id: "x", punkte: 1 });
    expect(await t.handler().delete({ model: "Review", args: { where: { id: "x" } } })).toEqual({ id: "x", punkte: 1 });
    expect(await t.handler().updateMany({})).toEqual({ count: 0 });
    expect(await t.handler().deleteMany({})).toEqual({ count: 0 });
    expect(t.aufrufe.some((a) => a.op === "create")).toBe(false);
    expect(t.stat.uebersprungen).toBe(4);
  });
  it("upsert: vorhanden bleibt unverändert, fehlend wird angelegt", async () => {
    const da = bauen(true);
    expect(await da.handler().upsert({ model: "Review", args: { where: { slug: "a" }, update: { punkte: 9 }, create: { slug: "a" } } })).toEqual({ id: "x", punkte: 1 });
    expect(da.aufrufe.some((a) => a.op === "create")).toBe(false);
    expect(da.stat.uebersprungen).toBe(1);
    const fehlt = bauen(false);
    expect(await fehlt.handler().upsert({ model: "Review", args: { where: { slug: "a" }, update: { punkte: 9 }, create: { slug: "a" } } })).toEqual({ id: "neu" });
    expect(fehlt.aufrufe.find((a) => a.op === "create")?.arg).toEqual({ data: { slug: "a" } });
    expect(fehlt.stat.uebersprungen).toBe(0);
  });
});
