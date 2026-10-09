import { SITE } from "./site";

const norm = (s: string) => s.trim().toLocaleLowerCase("de").replace(/\s+/g, " ");

/** „Marke Produkt“ ohne Doppelung, wenn der Produktname schon mit der Marke beginnt („Josera“ + „Josera Festival“ → „Josera Festival“). */
export function productLabel(brand: string | null | undefined, productName: string | null | undefined): string {
  const b = (brand ?? "").trim(), p = (productName ?? "").trim();
  if (!b) return p;
  if (!p) return b;
  return norm(p).startsWith(norm(b)) ? p : `${b} ${p}`;
}

/** Seitentitel mit Markensuffix, aber nur wenn er sonst nicht zu lang wird (≈ 60 Zeichen) und nicht doppelt vorkommt. */
export function seoTitle(title: string, suffix: string = SITE.name, max = 60): string {
  const t = title.trim().replace(new RegExp(`\\s*[|–-]\\s*${suffix}\\s*$`, "i"), "");
  const full = `${t} | ${suffix}`;
  return full.length <= max ? full : t;
}
