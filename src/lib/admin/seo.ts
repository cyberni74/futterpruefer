export const META_TITLE_MAX = 60;
export const META_DESC_MIN = 120;
export const META_DESC_MAX = 158;

export type LengthTone = "good" | "mid" | "bad";

export function metaTitleTone(length: number): LengthTone {
  if (length === 0) return "bad";
  if (length <= META_TITLE_MAX) return length < 30 ? "mid" : "good";
  return length <= META_TITLE_MAX + 10 ? "mid" : "bad";
}

export function metaDescriptionTone(length: number): LengthTone {
  if (length === 0) return "bad";
  if (length >= META_DESC_MIN && length <= META_DESC_MAX) return "good";
  if (length >= 80 && length <= META_DESC_MAX + 20) return "mid";
  return "bad";
}

/** "a, b ,  c,,a" → ["a","b","c"] (dedupliziert, max. 20 Stück à 60 Zeichen). */
export function parseKeywords(input: string | null | undefined): string[] {
  if (!input) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of input.split(/[,\n;]/)) {
    const k = raw.trim().replace(/\s+/g, " ").slice(0, 60);
    const key = k.toLowerCase();
    if (!k || seen.has(key)) continue;
    seen.add(key);
    out.push(k);
    if (out.length >= 20) break;
  }
  return out;
}

/** Kürzt für die SERP-Vorschau wie Google (ungefähr) mit Auslassungszeichen. */
export function truncateForSerp(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()} …`;
}
