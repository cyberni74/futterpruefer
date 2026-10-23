/**
 * Interne Verlinkung Einzeltest/Fachartikel ↔ Vergleichstest (HANDBUCH: jeder Einzeltest verlinkt
 * seinen Vergleichstest, der Vergleichstest verlinkt zurück). Nur interne Links, keine Kauflinks.
 */
export type Comparison = { slug: string; title: string; href: string };

const C = {
  nassfutter: { slug: "nassfutter-test-rind-hund-oktober-2026", title: "Nassfutter für Hunde im Test 2026: 7 Rind-Dosen im Vergleich", href: "/blog/nassfutter-test-rind-hund-oktober-2026" },
  gelenk: { slug: "gelenk-test-hund-oktober-2026", title: "Gelenktabletten für Hunde im Test 2026: 5 Gelenkmittel im Vergleich", href: "/blog/gelenk-test-hund-oktober-2026" },
  lachsoel: { slug: "lachsoel-test-hund-oktober-2026", title: "Lachsöl für Hunde im Test 2026: 5 Lachsöle im Vergleich", href: "/blog/lachsoel-test-hund-oktober-2026" },
} satisfies Record<string, Comparison>;

export const COMPARISONS: Comparison[] = Object.values(C);

const BLOG_MAP: Record<string, Comparison> = {
  "lachsoel-hunde": C.lachsoel,
  "hunde-nahrungsergaenzung": C.lachsoel,
  "gelenkschmerzen-hund-produkte": C.gelenk,
  "fleischanteil-hundefutter-katzenfutter": C.nassfutter,
  "tierische-nebenerzeugnisse-gut-oder-schlecht": C.nassfutter,
  "fleischherkunft-tierhaltung-tierfutter": C.nassfutter,
  "nassfutter-trockenfutter-haltbarkeit": C.nassfutter,
  "trockenmasse-berechnen-nass-trockenfutter": C.nassfutter,
  "monoprotein-futter": C.nassfutter,
};

export function comparisonForPost(slug: string): Comparison | null {
  return BLOG_MAP[slug] ?? null;
}

const WET = /nassfutter|\bdose\b|pastete|kennerfleisch|grancarno|mjamjam|rinti|lakefields|h(ä|ae)ppchen|in so(ß|ss)e|in gelee|\bpur\b|fleischgenuss/i;

export function comparisonForReview(r: { title?: string | null; productName?: string | null; keyword?: string | null; categorySlug: string; moisture?: number | null }): Comparison | null {
  if (!r.categorySlug.endsWith("-hund")) return null;
  const text = `${r.title ?? ""} ${r.productName ?? ""} ${r.keyword ?? ""}`;
  if (/lachs(ö|oe)l|fisch(ö|oe)l|omega-?3/i.test(text)) return C.lachsoel;
  if (/gelenk|gr(ü|ue)nlippmuschel|glucosamin|chondroitin|h(ü|ue)fte/i.test(text)) return C.gelenk;
  if (r.categorySlug === "alleinfuttermittel-hund" && (WET.test(text) || (r.moisture != null && r.moisture >= 60))) return C.nassfutter;
  return null;
}
