/**
 * Schreibweisen und Produktlinien, die zu EINER Marke gehören (Schlüssel kleingeschrieben).
 * Wirkt auf Markenseiten, Markenfilter und Sitemap; die Tests behalten ihren Markennamen.
 */
const ALIASES: Record<string, string> = {
  "purina gourmet": "Purina",
  "purina pro plan": "Purina",
  "purina one": "Purina",
  "purina dentalife": "Purina",
  bosch: "Bosch",
};

export const canonicalBrand = (brand: string): string => {
  const b = brand.trim();
  return ALIASES[b.toLowerCase()] ?? b;
};
