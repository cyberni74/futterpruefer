/**
 * Optionale sichtbare Unterschrift für das Titelbild eines Fachartikels.
 *
 * Steht im bodyHtml ein Absatz `<p class="fp-titelbild-unterschrift">…</p>`, wird er aus dem Fließtext
 * genommen und direkt unter dem Titelbild ausgegeben (z. B. KI-Hinweis bei B-Titelbildern oder
 * CC-Nennung bei echten Fotos). Ohne diesen Absatz bleibt alles wie bisher.
 */
const HERO_CAPTION = /<p\b[^>]*\bclass="[^"]*\bfp-titelbild-unterschrift\b[^"]*"[^>]*>([\s\S]*?)<\/p>\s*/i;

export function splitHeroCaption(html: string | null | undefined): { caption: string | null; body: string } {
  const src = html ?? "";
  const m = HERO_CAPTION.exec(src);
  if (!m) return { caption: null, body: src };
  const caption = m[1].trim();
  return { caption: caption || null, body: src.slice(0, m.index) + src.slice(m.index + m[0].length) };
}
