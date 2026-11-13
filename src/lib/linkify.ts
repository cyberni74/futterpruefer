/**
 * Verlinkt Lexikon- und Glossarbegriffe automatisch im (bereits bereinigten) Artikel-HTML.
 * - je Begriff nur das erste Vorkommen (ein übergebenes Set gilt über mehrere Abschnitte)
 * - nie in Links, Überschriften, Code, Tabellenköpfen, Zitaten (blockquote, q)
 *   oder in Aussage-/Zitat-Zellen von Anspruchs- und Werbetabellen
 * - längere Begriffe haben Vorrang („Tierische Nebenerzeugnisse“ vor „Nebenerzeugnisse“)
 * - „ohne Zucker“ bleibt verlinkt, trägt aber keinen Bedenklichkeits-Punkt
 */
export type LinkTerm = {
  id: string;
  patterns: string[];
  href: string;
  title: string;
  className: string;
};

const SKIP_TAGS = new Set(["a", "h1", "h2", "h3", "h4", "h5", "h6", "code", "pre", "script", "style", "th", "button", "blockquote", "q"]);

/** Spaltenüberschrift einer Zitat- oder Aussage-Zelle. */
const QUOTE_LABEL = /^(aussage|werbeaussage|anspruch|zitat|herstellerzitat|herstelleraussage|werbezitat|werbeversprechen)\b/i;

const CONCERN_CLASS = /^lex-(?:unbedenklich|eingeschraenkt|bedenklich)$/;

function attrValue(tag: string, name: string): string {
  const match = new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, "i").exec(tag) ?? new RegExp(`\\b${name}\\s*=\\s*'([^']*)'`, "i").exec(tag);
  return (match?.[1] ?? "").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/\s+/g, " ").trim();
}

function isQuoteLabel(label: string): boolean {
  return QUOTE_LABEL.test(label.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

function hasClass(tag: string, name: string): boolean {
  return new RegExp(`(?:^|\\s)${name}(?:\\s|$)`).test(attrValue(tag, "class"));
}

type TableFrame = { headers: string[]; claims: boolean; rowTh: number; rowTd: number; rowText: string[] };

/** Verneinte Stelle: der Link bleibt, der farbige Punkt entfällt. */
function withoutConcernMarker(className: string): string {
  const tokens = className.split(/\s+/).filter((token) => token && !CONCERN_CLASS.test(token));
  if (!tokens.includes("lex-ohne-marker")) tokens.push("lex-ohne-marker");
  return tokens.join(" ");
}

function isNegated(before: string): boolean {
  const plain = before.replace(/&nbsp;|&#160;|&#xa0;/gi, " ").replace(/\s+/g, " ");
  return /(?:^|[\s,;:(„"«])(?:ohne|kein(?:e(?:m|n|r|s)?)?|nicht|frei von)\s+$/i.test(plain);
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function linkify(html: string | null | undefined, terms: LinkTerm[], used = new Set<string>()): string {
  if (!html) return "";
  const patterns: Array<{ text: string; term: LinkTerm }> = [];
  for (const term of terms) {
    for (const p of term.patterns) {
      const t = p?.trim();
      if (t && t.length >= 3) patterns.push({ text: escapeHtml(t), term });
    }
  }
  if (!patterns.length) return html;
  patterns.sort((a, b) => b.text.length - a.text.length);
  // Bei gleicher Schreibweise gewinnt der zuerst übergebene Begriff (Lexikon steht vor dem Glossar).
  const lookup = new Map<string, LinkTerm>();
  for (const pattern of patterns) {
    const key = pattern.text.toLocaleLowerCase("de");
    if (!lookup.has(key)) lookup.set(key, pattern.term);
  }
  const re = new RegExp(`(?<![\\p{L}\\p{N}])(${patterns.map((p) => escapeRe(p.text)).join("|")})(?![\\p{L}\\p{N}])`, "giu");

  const stack: string[] = [];
  let skipDepth = 0;
  let inThead = 0;
  let column = 0;
  const tables: TableFrame[] = [];
  let headerBuf = "";
  let capturingHeader = false;

  return html.replace(/(<[^>]+>)|([^<]+)/g, (_m, tag: string | undefined, text: string | undefined) => {
    if (tag) {
      const mt = /^<\s*(\/)?\s*([a-zA-Z0-9]+)/.exec(tag);
      if (mt) {
        const name = mt[2].toLowerCase();
        const closing = !!mt[1];
        const selfClosing = /\/\s*>$/.test(tag) || ["br", "hr", "img", "input", "meta", "link"].includes(name);
        const table = tables.at(-1);
        if (name === "table" && !selfClosing) {
          if (!closing) {
            const claims = hasClass(tag, "claims");
            tables.push({ headers: [], claims, rowTh: 0, rowTd: 0, rowText: [] });
            // Werbetabelle: keine Autolinks, auch nicht in der Begründungs-Spalte.
            if (claims) {
              stack.push("table-claims");
              skipDepth++;
            }
          } else {
            tables.pop();
            if (stack.at(-1) === "table-claims") {
              stack.pop();
              skipDepth = Math.max(0, skipDepth - 1);
            }
          }
        } else if (name === "thead" && !selfClosing) {
          inThead += closing ? -1 : 1;
        } else if (name === "tr" && !selfClosing) {
          if (!closing) {
            column = 0;
            if (table) {
              table.rowTh = 0;
              table.rowTd = 0;
              table.rowText = [];
            }
          } else if (table && table.headers.length === 0 && table.rowTh > 0 && table.rowTd === 0) {
            // Kopfzeile aus th, auch ohne thead.
            table.headers = table.rowText.slice();
          }
        } else if ((name === "th" || name === "td") && !selfClosing && inThead === 0) {
          if (!closing) {
            const headers = table?.headers ?? [];
            const label = attrValue(tag, "data-label") || headers[column] || "";
            column++;
            if (table) {
              if (name === "th") table.rowTh++;
              else table.rowTd++;
            }
            if (name === "th" && table && table.headers.length === 0) {
              capturingHeader = true;
              headerBuf = "";
            }
            if (name === "td" && isQuoteLabel(label)) {
              stack.push("td-quote");
              skipDepth++;
            }
          } else {
            if (capturingHeader && name === "th") {
              table?.rowText.push(headerBuf.replace(/\s+/g, " ").trim());
              headerBuf = "";
              capturingHeader = false;
            }
            if (name === "td" && stack.at(-1) === "td-quote") {
              stack.pop();
              skipDepth = Math.max(0, skipDepth - 1);
            }
          }
        } else if (name === "th" && inThead > 0 && !selfClosing) {
          if (!closing) {
            capturingHeader = true;
            headerBuf = "";
          } else {
            table?.rowText.push(headerBuf.replace(/\s+/g, " ").trim());
            headerBuf = "";
            capturingHeader = false;
            if (table) table.rowTh++;
          }
        }
        if (SKIP_TAGS.has(name) && !selfClosing) {
          if (closing) {
            const idx = stack.lastIndexOf(name);
            if (idx !== -1) {
              stack.splice(idx, 1);
              skipDepth = Math.max(0, skipDepth - 1);
            }
          } else {
            stack.push(name);
            skipDepth++;
          }
        }
      }
      return tag;
    }
    if (capturingHeader && text) headerBuf += text;
    if (!text || skipDepth > 0) return text ?? "";
    return text.replace(re, (match: string, _group: string, offset: number, source: string) => {
      const term = lookup.get(match.toLocaleLowerCase("de"));
      if (!term || used.has(term.id)) return match;
      const negated = isNegated(source.slice(0, offset));
      used.add(term.id);
      const className = negated ? withoutConcernMarker(term.className) : term.className;
      return `<a href="${escapeHtml(term.href)}" class="${escapeHtml(className)}" title="${escapeHtml(term.title)}">${match}</a>`;
    });
  });
}
