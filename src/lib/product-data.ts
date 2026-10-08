/** Produktdaten eines Tests: Zusammensetzung, Analyse, Werbeaussagen, Lesezeit – alles null-sicher. */
import { slugify } from "./slug";

// ---------- Werbeaussagen ----------
export const CLAIM_RATINGS = ["ZULAESSIG", "FRAGWUERDIG", "UNZULAESSIG"] as const;
export type ClaimRating = (typeof CLAIM_RATINGS)[number];
export type Claim = { claim: string; rating: ClaimRating; reason: string; legal: string; imageUrl: string };

export const CLAIM_LABEL: Record<ClaimRating, string> = {
  ZULAESSIG: "Zulässig",
  FRAGWUERDIG: "Fragwürdig",
  UNZULAESSIG: "Unzulässig/irreführend",
};

const str = (v: unknown, max = 1000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function parseClaims(json: unknown): Claim[] {
  if (!Array.isArray(json)) return [];
  return json
    .map((c): Claim | null => {
      if (!c || typeof c !== "object") return null;
      const o = c as Record<string, unknown>;
      const claim = str(o.claim, 200);
      const rating = CLAIM_RATINGS.includes(o.rating as ClaimRating) ? (o.rating as ClaimRating) : null;
      if (!claim || !rating) return null;
      return { claim, rating, reason: str(o.reason), legal: str(o.legal, 200), imageUrl: str(o.imageUrl, 500) };
    })
    .filter((c): c is Claim => c !== null);
}

export const misleadingClaims = (claims: Claim[]) => claims.filter((c) => c.rating === "UNZULAESSIG");

/** Vorschlag für den Abzug bei „Deklaration & Transparenz“: 3 Punkte je unzulässiger, 1 je fragwürdiger Aussage, max. 15. */
export function suggestedDeclarationDeduction(claims: Claim[]): number {
  const n = claims.reduce((s, c) => s + (c.rating === "UNZULAESSIG" ? 3 : c.rating === "FRAGWUERDIG" ? 1 : 0), 0);
  return Math.min(15, n);
}

/** Contra-Liste inkl. unzulässiger Werbeaussagen (ohne Dubletten). */
export function consWithClaims(cons: string[] | null | undefined, claims: Claim[]): string[] {
  const base = (cons ?? []).filter(Boolean);
  const extra = misleadingClaims(claims).map((c) => `Irreführende Werbeaussage: „${c.claim}“`);
  return [...base, ...extra.filter((e) => !base.includes(e))];
}

// ---------- Analytische Bestandteile ----------
export type AnalysisRow = { name: string; value: number };

export function parseAnalysis(json: unknown): AnalysisRow[] {
  if (!Array.isArray(json)) return [];
  return json
    .map((r) => {
      if (!r || typeof r !== "object") return null;
      const o = r as Record<string, unknown>;
      const name = str(o.name, 60);
      const value = typeof o.value === "number" ? o.value : Number(String(o.value ?? "").replace(",", "."));
      return name && Number.isFinite(value) && value >= 0 && value <= 100 ? { name, value } : null;
    })
    .filter((r): r is AnalysisRow => r !== null);
}

const isMoisture = (n: string) => /feuchte|feuchtigkeit|wasser/i.test(n);

/** Trockensubstanz-Werte (ohne Feuchte). null, wenn Feuchte fehlt oder unplausibel ist. */
export function dryMatter(rows: AnalysisRow[]): AnalysisRow[] | null {
  const moisture = rows.find((r) => isMoisture(r.name))?.value;
  if (moisture == null || moisture >= 100 || moisture < 0) return null;
  const factor = 100 / (100 - moisture);
  return rows.filter((r) => !isMoisture(r.name)).map((r) => ({ name: r.name, value: Math.round(r.value * factor * 10) / 10 }));
}

// ---------- Zusammensetzung ----------
/** Teilt die Zusammensetzung an Kommas/Semikolons außerhalb von Klammern. */
export function splitComposition(text: string | null | undefined): string[] {
  if (!text) return [];
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of text.replace(/\s+/g, " ")) {
    if (ch === "(" || ch === "[") depth++;
    if ((ch === ")" || ch === "]") && depth > 0) depth--;
    if ((ch === "," || ch === ";") && depth === 0) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim().replace(/\.$/, "").trim()).filter(Boolean);
}

export type LexRef = { slug: string; name: string; synonyms: string[]; concern: "UNBEDENKLICH" | "EINGESCHRAENKT" | "BEDENKLICH"; shortDescription: string };

/** Findet den passendsten Lexikon-Eintrag (längster Begriff, ganzes Wort). */
export function matchLexikon(ingredient: string, entries: LexRef[]): LexRef | null {
  const lower = ingredient.toLocaleLowerCase("de");
  let best: { e: LexRef; len: number } | null = null;
  for (const e of entries) {
    for (const n of [e.name, ...e.synonyms]) {
      const t = n.trim().toLocaleLowerCase("de");
      if (t.length < 3) continue;
      const re = new RegExp(`(?<![\\p{L}\\p{N}])${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\p{N}])`, "u");
      if (re.test(lower) && (!best || t.length > best.len)) best = { e, len: t.length };
    }
  }
  return best?.e ?? null;
}

// ---------- Lesezeit ----------
export function readingMinutes(...texts: Array<string | null | undefined>): number {
  const words = texts.join(" ").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const anchorFor = (text: string) => slugify(text) || "abschnitt";
