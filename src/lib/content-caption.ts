/** Sichtbare Bildunterschrift des zweiten Produktbilds. Leer: keine erfundene Unterschrift. */
export function contentImageCaption(alt: string | null | undefined): string | null {
  const text = (alt ?? "").trim();
  return text.length > 0 ? text : null;
}
