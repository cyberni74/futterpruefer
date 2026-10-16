import raw from "@/data/brand-info.json";

export type BrandIncident = { datum: string; art: "Rückruf" | "Behördenwarnung" | "Verfahren" | "Kritik"; titel: string; text: string; quelle_name: string; quelle: string };
export type BrandInfo = {
  slug: string;
  name: string;
  unternehmen: string | null;
  sitz: string | null;
  konzern: string | null;
  gegruendet: string | null;
  ueberblick: string;
  geschichte: { jahr: string; text: string; quelle: string }[];
  vorfaelle: BrandIncident[];
  vorfaelle_hinweis: string;
  quellen: { name: string; url: string }[];
};

const INFO = raw as unknown as Record<string, BrandInfo>;

export function getBrandInfo(slug: string): BrandInfo | null {
  return INFO[slug] ?? null;
}

const MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

/** „2023-01“ → „Januar 2023“, „2023-01-18“ → „18. Januar 2023“, „2023“ → „2023“. */
export function formatIncidentDate(d: string): string {
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(d.trim());
  if (!m) return d;
  const [, y, mo, day] = m;
  if (!mo) return y;
  const month = MONTHS[Number(mo) - 1];
  if (!month) return y;
  return day ? `${Number(day)}. ${month} ${y}` : `${month} ${y}`;
}

/** Nur http(s)-Links aus den Quellenangaben zulassen. */
export const safeUrl = (u: string) => (/^https?:\/\//i.test(u) ? u : null);
