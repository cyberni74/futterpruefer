/**
 * Synonyme, die keinen Autolink auslösen (Rechtsprüfung).
 * Der Eigenname des Eintrags bleibt verlinkbar. „BHA“ verlinkt nur über den
 * veröffentlichten Eintrag /lexikon/bha, nicht als Synonym von Antioxidationsmittel.
 */
export const AUTOLINK_EXCLUDED_SYNONYMS: Record<string, readonly string[]> = {
  carrageen: ["Geliermittel"],
  lachsoel: ["Fischöl"],
  bierhefe: ["Hefe"],
  inulin: ["Zichorie", "Zichorienwurzel", "Chicorée-Wurzel", "FOS", "Fructooligosaccharide", "Oligofructose", "Fructan"],
  "pflanzliche-nebenerzeugnisse": ["Kleie", "Rübenschnitzel", "Trester", "Ölschrot"],
  antioxidationsmittel: ["Tocopherole", "Rosmarinextrakt", "BHA", "Propylgallat"],
};

const norm = (value: string) => value.trim().toLocaleLowerCase("de");

/** Eigenname plus Synonyme, ohne die gesperrten Synonyme dieses Slugs. */
export function autolinkPatterns(slug: string, name: string, synonyms: readonly string[]): string[] {
  const banned = new Set((AUTOLINK_EXCLUDED_SYNONYMS[slug] ?? []).map(norm));
  const patterns = [name, ...synonyms].map((item) => item.trim()).filter((item) => item.length > 0);
  return patterns.filter((item, index) => index === 0 || !banned.has(norm(item)));
}

/** Sichtbarer Titel eines Lexikon-Autolinks, ohne Kurzbeschreibung. */
export function lexikonLinkTitle(name: string): string {
  return `Im Lexikon: ${name}`;
}
