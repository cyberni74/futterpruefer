import { isMethodikV1, METHODIK_V1_STAND } from "./scoring";

/**
 * Tests mit DB-Feld methodikVersion „1“ stehen auf dem Bewertungsstand vor Version 2 (Ausnahmen auf /methodik).
 * Ihre Punkte sind nicht mit Version-2-Werten vergleichbar und werden deshalb nicht zwischen ihnen gerankt.
 */

/** Prisma-Filter: nur Tests ohne methodikVersion „1“ (Feld ist nie null, leer und andere Werte bleiben drin). */
export const ohneMethodikV1 = () => ({ methodikVersion: { not: "1" } });

/** Stabile Aufteilung: erst alle Tests nach Version 2 in ihrer Reihenfolge, dann die Tests auf Version 1. */
export function v1Zuletzt<T extends { methodikVersion?: string | null }>(rows: T[]): T[] {
  return [...rows.filter((r) => !isMethodikV1(r.methodikVersion)), ...rows.filter((r) => isMethodikV1(r.methodikVersion))];
}

/** Kennzeichnung in Karten und Listen. */
export const V1_KENNZEICHNUNG = `Bewertungsstand ${METHODIK_V1_STAND} · Methodik Version 1`;
