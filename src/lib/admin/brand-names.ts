/** Eindeutige Markennamen, Groß-/Kleinschreibung zusammengeführt (erste Schreibweise gewinnt), alphabetisch. */
export function uniqueBrands(list: Array<string | null | undefined>): string[] {
  const seen = new Map<string, string>();
  for (const raw of list) {
    const b = (raw ?? "").trim().replace(/\s+/g, " ");
    if (b && !seen.has(b.toLocaleLowerCase("de"))) seen.set(b.toLocaleLowerCase("de"), b);
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b, "de", { sensitivity: "base" }));
}

/** Gibt die bereits gespeicherte Schreibweise zurück, falls die Marke schon existiert. */
export function canonicalBrand(input: string, known: string[]): string {
  const b = input.trim().replace(/\s+/g, " ");
  return known.find((k) => k.toLocaleLowerCase("de") === b.toLocaleLowerCase("de")) ?? b;
}

