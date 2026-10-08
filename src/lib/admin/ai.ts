export type AiTask = "meta" | "keywords";
export type AiKind = "review" | "blog" | "lexikon";

export type AiContext = {
  title: string;
  brand?: string;
  productName?: string;
  keyword?: string;
  verdict?: string;
  excerpt?: string;
  body?: string;
};

export const AI_MODEL = "claude-sonnet-5-5";
export const AI_MAX_TOKENS = 400;
const FIELD_CAP = 300;
const BODY_CAP = 4000;

function cap(v: string | undefined, n: number): string {
  return (v ?? "").replace(/\s+/g, " ").trim().slice(0, n);
}

export function sanitizeContext(raw: unknown): AiContext {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const s = (k: string, n = FIELD_CAP) => cap(typeof r[k] === "string" ? (r[k] as string) : "", n);
  return {
    title: s("title"),
    brand: s("brand"),
    productName: s("productName"),
    keyword: s("keyword"),
    verdict: s("verdict", 600),
    excerpt: s("excerpt", 600),
    body: s("body", BODY_CAP),
  };
}

export function buildPrompt(task: AiTask, kind: AiKind, ctx: AiContext): string {
  const art =
    kind === "review"
      ? "einen Futtertest (Hunde-/Katzenfutter-Bewertung)"
      : kind === "lexikon"
        ? "einen Lexikon-Eintrag über einen Inhaltsstoff in Hunde- und Katzenfutter"
        : "einen Fachblog-Artikel über Hunde- und Katzenernährung";
  const lines = [
    `Du bist SEO-Redakteur für das deutsche Portal Futterprüfer.de. Erstelle Angaben für ${art}.`,
    "",
    "Inhalt:",
    `Titel: ${ctx.title || "(leer)"}`,
  ];
  if (ctx.brand) lines.push(`Marke: ${ctx.brand}`);
  if (ctx.productName) lines.push(`Produkt: ${ctx.productName}`);
  if (ctx.keyword) lines.push(`Haupt-Stichwort: ${ctx.keyword}`);
  if (ctx.verdict) lines.push(`Fazit: ${ctx.verdict}`);
  if (ctx.excerpt) lines.push(`Anreißer: ${ctx.excerpt}`);
  if (ctx.body) lines.push(`Text (Auszug): ${ctx.body}`);
  lines.push("");
  if (task === "meta") {
    lines.push(
      "Aufgabe: Schreibe einen Meta-Titel (maximal 60 Zeichen, Haupt-Stichwort möglichst vorn, ohne Markennamen des Portals) und eine Meta-Beschreibung (120 bis 158 Zeichen, sachlich, mit Nutzenversprechen, keine Übertreibungen, keine unzulässigen Gesundheitsversprechen).",
      'Antworte ausschließlich mit striktem JSON ohne Erklärungen und ohne Codeblock: {"metaTitle":"...","metaDescription":"..."}',
    );
  } else {
    lines.push(
      "Aufgabe: Schlage 5 bis 8 relevante deutsche Suchbegriffe (Keywords) vor, kleingeschrieben, ohne Duplikate.",
      'Antworte ausschließlich mit striktem JSON ohne Erklärungen und ohne Codeblock: {"keywords":["...","..."]}',
    );
  }
  return lines.join("\n");
}

/** Extrahiert das erste JSON-Objekt aus der Modellantwort (tolerant gegenüber Codeblöcken). */
export function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("Keine JSON-Antwort erhalten");
  return JSON.parse(text.slice(start, end + 1));
}

export type AiResult = { metaTitle?: string; metaDescription?: string; keywords?: string[] };

export function normalizeAiResult(task: AiTask, data: unknown): AiResult {
  const d = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  if (task === "meta") {
    const metaTitle = typeof d.metaTitle === "string" ? d.metaTitle.trim().slice(0, 120) : "";
    const metaDescription = typeof d.metaDescription === "string" ? d.metaDescription.trim().slice(0, 300) : "";
    if (!metaTitle && !metaDescription) throw new Error("Antwort enthielt keine Meta-Angaben");
    return { metaTitle, metaDescription };
  }
  const kw = Array.isArray(d.keywords) ? d.keywords.filter((k): k is string => typeof k === "string") : [];
  const keywords = kw.map((k) => k.trim().slice(0, 60)).filter(Boolean).slice(0, 12);
  if (keywords.length === 0) throw new Error("Antwort enthielt keine Keywords");
  return { keywords };
}

/** Sehr einfacher Sliding-Window-Limiter pro Prozess. */
export function createRateLimiter(limit: number, windowMs: number) {
  let hits: number[] = [];
  return (now = Date.now()): boolean => {
    hits = hits.filter((t) => now - t < windowMs);
    if (hits.length >= limit) return false;
    hits.push(now);
    return true;
  };
}
