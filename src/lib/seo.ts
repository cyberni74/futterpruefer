import { SITE } from "./site";

const norm = (s: string) => s.trim().toLocaleLowerCase("de").replace(/\s+/g, " ");

/** „Marke Produkt“ ohne Doppelung, wenn der Produktname schon mit der Marke beginnt („Josera“ + „Josera Festival“ → „Josera Festival“). */
export function productLabel(brand: string | null | undefined, productName: string | null | undefined): string {
  const b = (brand ?? "").trim(), p = (productName ?? "").trim();
  if (!b) return p;
  if (!p) return b;
  return norm(p).startsWith(norm(b)) ? p : `${b} ${p}`;
}

/** Obergrenze für Meta-Descriptions, damit Google sie nicht mitten im Wort abschneidet. */
export const META_DESCRIPTION_MAX = 160;

/**
 * Kürzt an der letzten Wortgrenze vor `max`. Kein Auslassungszeichen:
 * das würde Zeichen verbrauchen, die in der Description fehlen.
 */
export function trimMetaDescription(text: string | null | undefined, max = META_DESCRIPTION_MAX): string {
  const value = (text ?? "").replace(/\s+/g, " ").trim();
  if (value.length <= max) return value;
  const slice = value.slice(0, max + 1);
  const space = slice.lastIndexOf(" ");
  const cut = (space >= Math.floor(max * 0.6) ? slice.slice(0, space) : value.slice(0, max)).replace(/[\s,;:–—-]+$/u, "");
  return cut.trim();
}

/** Seitentitel mit Markensuffix, aber nur wenn er sonst nicht zu lang wird (≈ 60 Zeichen) und nicht doppelt vorkommt. */
export function seoTitle(title: string, suffix: string = SITE.name, max = 60): string {
  const t = title.trim().replace(new RegExp(`\\s*[|–-]\\s*${suffix}\\s*$`, "i"), "");
  const full = `${t} | ${suffix}`;
  return full.length <= max ? full : t;
}
