/** Nachbearbeitung des (bereinigten) Artikel-HTML: Anker an H2, Inhaltsverzeichnis, Mini-Balken an Kriterien-Abschnitten. */
import { CRITERIA, ratioRating, type Scores } from "./scoring";
import { anchorFor } from "./product-data";

export type TocItem = { id: string; text: string };

const decode = (s: string) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
const norm = (s: string) => s.toLocaleLowerCase("de").replace(/&/g, "und").replace(/\s+/g, " ");

/** Welches Kriterium behandelt die Überschrift? (Name oder Kurzname enthalten) */
export function criterionForHeading(text: string): (typeof CRITERIA)[number] | null {
  const t = norm(text);
  return CRITERIA.find((c) => t.includes(norm(c.label)) || t.includes(norm(c.short))) ?? null;
}

function miniBar(key: (typeof CRITERIA)[number], value: number): string {
  const v = Math.max(0, Math.min(key.max, Math.round(value)));
  const tone = ratioRating(v, key.max);
  const pct = Math.round((v / key.max) * 100);
  return `<div class="crit-bar crit-${tone}" role="meter" aria-label="${key.label}: ${v} von ${key.max} Punkten" aria-valuemin="0" aria-valuemax="${key.max}" aria-valuenow="${v}"><span class="crit-bar-track"><span class="crit-bar-fill" style="width:${pct}%"></span></span><span class="crit-bar-value">${v}/${key.max}</span></div>`;
}

export function enhanceArticle(html: string, scores?: Partial<Scores> | null): { html: string; toc: TocItem[] } {
  if (!html) return { html: "", toc: [] };
  const toc: TocItem[] = [];
  const used = new Set<string>();
  const out = html.replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi, (_m, attrs: string | undefined, inner: string) => {
    const text = decode(inner);
    if (!text) return _m;
    let id = anchorFor(text);
    for (let i = 2; used.has(id); i++) id = `${anchorFor(text)}-${i}`;
    used.add(id);
    toc.push({ id, text });
    const cleanAttrs = (attrs ?? "").replace(/\sid="[^"]*"/i, "");
    const crit = scores ? criterionForHeading(text) : null;
    const bar = crit && scores?.[crit.key] != null ? miniBar(crit, scores[crit.key] as number) : "";
    return `<h2 id="${id}"${cleanAttrs}>${inner}</h2>${bar}`;
  });
  return { html: out, toc };
}
