/**
 * Schutz des Seeds (prisma/seed.ts): Er darf nie Produktionsdaten schreiben.
 * - läuft nur mit ausdrücklichem ALLOW_SEED=1, nie auf Vercel oder in CI
 * - nur gegen eine lokale Datenbank, es sei denn, ALLOW_SEED_REMOTE=1 ist zusätzlich gesetzt
 * - vorhandene Datensätze werden nie überschrieben (nurAnlegen)
 */
export type SeedEnv = Record<string, string | undefined>;

const LOKALE_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

function hostVon(url: string | undefined): string {
  try {
    return new URL(url ?? "").hostname;
  } catch {
    return "";
  }
}

/** Grund, warum der Seed nicht laufen darf, oder null, wenn er laufen darf. */
export function seedBlockReason(env: SeedEnv): string | null {
  if (env.VERCEL || env.VERCEL_ENV || env.VERCEL_URL) return "Vercel-Umgebung erkannt";
  if (env.CI) return "CI-Umgebung erkannt";
  if (env.ALLOW_SEED !== "1") return "ALLOW_SEED=1 ist nicht gesetzt";
  const host = hostVon(env.DATABASE_URL);
  if (!host) return "DATABASE_URL fehlt oder ist ungültig";
  if (!LOKALE_HOSTS.has(host) && env.ALLOW_SEED_REMOTE !== "1") return `Datenbank-Host „${host}“ ist nicht lokal (zusätzlich ALLOW_SEED_REMOTE=1 nötig)`;
  return null;
}

export type NurAnlegenStatistik = { uebersprungen: number };

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Erweitert einen Prisma-Client so, dass der Seed nur anlegt: update, updateMany, delete und deleteMany ändern nichts
 * (update/delete liefern den vorhandenen Datensatz), upsert legt nur an, wenn es den Datensatz noch nicht gibt.
 */
export function nurAnlegen<C extends { $extends: (arg: any) => any }>(base: C, stat: NurAnlegenStatistik = { uebersprungen: 0 }): C {
  const delegate = (model: string) => (base as any)[model.charAt(0).toLowerCase() + model.slice(1)];
  return base.$extends({
    query: {
      $allModels: {
        async update({ model, args }: any) { stat.uebersprungen++; return delegate(model).findUnique({ where: args.where }); },
        async updateMany() { stat.uebersprungen++; return { count: 0 }; },
        async delete({ model, args }: any) { stat.uebersprungen++; return delegate(model).findUnique({ where: args.where }); },
        async deleteMany() { stat.uebersprungen++; return { count: 0 }; },
        async upsert({ model, args }: any) {
          const vorhanden = await delegate(model).findUnique({ where: args.where });
          if (vorhanden) { stat.uebersprungen++; return vorhanden; }
          return delegate(model).create({ data: args.create });
        },
      },
    },
  }) as C;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
