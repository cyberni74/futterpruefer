export const SORTS = {
  punkte: { label: "Beste Bewertung" },
  neu: { label: "Neueste" },
  preis_auf: { label: "Preis/kg aufsteigend" },
  preis_ab: { label: "Preis/kg absteigend" },
} as const;
export type SortKey = keyof typeof SORTS;

export const PRICE_CLASSES = ["GUENSTIG", "MITTEL", "PREMIUM"] as const;
export type PriceClassKey = (typeof PRICE_CLASSES)[number];

export type ReviewFilters = { sort: SortKey; preis: PriceClassKey | null; tier: "HUND" | "KATZE" | null; min: number };

type Raw = Record<string, string | string[] | undefined> | null | undefined;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export function parseFilters(sp: Raw): ReviewFilters {
  const sort = one(sp?.sort);
  const preis = one(sp?.preis);
  const tier = one(sp?.tier);
  const min = Number(one(sp?.min));
  return {
    sort: sort && sort in SORTS ? (sort as SortKey) : "punkte",
    preis: preis && (PRICE_CLASSES as readonly string[]).includes(preis) ? (preis as PriceClassKey) : null,
    tier: tier === "HUND" || tier === "KATZE" ? tier : null,
    min: Number.isFinite(min) ? Math.min(100, Math.max(0, Math.round(min))) : 0,
  };
}

export function orderByFor(sort: SortKey) {
  switch (sort) {
    case "neu": return [{ publishedAt: "desc" as const }];
    case "preis_auf": return [{ pricePerKg: { sort: "asc" as const, nulls: "last" as const } }];
    case "preis_ab": return [{ pricePerKg: { sort: "desc" as const, nulls: "last" as const } }];
    default: return [{ totalScore: "desc" as const }, { publishedAt: "desc" as const }];
  }
}

/** Vergleichs-IDs aus ?ids=a,b,c – max. 3, eindeutig, nur sichere Zeichen. */
export function parseCompareIds(v: string | string[] | undefined): string[] {
  const raw = one(v) ?? "";
  return [...new Set(raw.split(",").map((s) => s.trim()).filter((s) => /^[a-z0-9]{8,40}$/i.test(s)))].slice(0, 3);
}
