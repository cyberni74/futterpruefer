/**
 * Verlinkt Lexikon- und Glossarbegriffe automatisch im (bereits bereinigten) Artikel-HTML.
 * - je Begriff nur das erste Vorkommen
 * - nie in Links, Überschriften, Code oder Tabellenköpfen
 * - längere Begriffe haben Vorrang („Tierische Nebenerzeugnisse“ vor „Nebenerzeugnisse“)
 */
export type LinkTerm = {
  id: string;
  patterns: string[];
  href: string;
  title: string;
  className: string;
};

const SKIP_TAGS = new Set(["a", "h1", "h2", "h3", "h4", "h5", "h6", "code", "pre", "script", "style", "th", "button"]);

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function linkify(html: string | null | undefined, terms: LinkTerm[]): string {
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
  const lookup = new Map(patterns.map((p) => [p.text.toLocaleLowerCase("de"), p.term]));
  const re = new RegExp(`(?<![\\p{L}\\p{N}])(${patterns.map((p) => escapeRe(p.text)).join("|")})(?![\\p{L}\\p{N}])`, "giu");

  const used = new Set<string>();
  const stack: string[] = [];
  let skipDepth = 0;

  return html.replace(/(<[^>]+>)|([^<]+)/g, (_m, tag: string | undefined, text: string | undefined) => {
    if (tag) {
      const mt = /^<\s*(\/)?\s*([a-zA-Z0-9]+)/.exec(tag);
      if (mt) {
        const name = mt[2].toLowerCase();
        const closing = !!mt[1];
        const selfClosing = /\/\s*>$/.test(tag) || ["br", "hr", "img", "input", "meta", "link"].includes(name);
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
    if (!text || skipDepth > 0) return text ?? "";
    return text.replace(re, (match: string) => {
      const term = lookup.get(match.toLocaleLowerCase("de"));
      if (!term || used.has(term.id)) return match;
      used.add(term.id);
      return `<a href="${escapeHtml(term.href)}" class="${escapeHtml(term.className)}" title="${escapeHtml(term.title)}">${match}</a>`;
    });
  });
}
