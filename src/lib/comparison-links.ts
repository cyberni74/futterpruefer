/**
 * Interne Verlinkung Einzeltest/Fachartikel ↔ Vergleichstest (HANDBUCH: jeder Einzeltest verlinkt
 * seinen Vergleichstest, der Vergleichstest verlinkt zurück). Nur interne Links; Amazon-Links stehen im Testtext selbst (seit 23.10.2026 auch bei Rot).
 */
export type Comparison = { slug: string; title: string; href: string; members?: string[] };

const C = {
  nassfutter: { slug: "nassfutter-test-rind-hund-oktober-2026", title: "Nassfutter für Hunde im Test 2026: 7 Rind-Dosen im Vergleich", href: "/blog/nassfutter-test-rind-hund-oktober-2026", members: ["rinti-kennerfleisch-rind-400g-test"] },
  monoproteinKatze: {
    slug: "monoprotein-katzenfutter-test-2026",
    title: "Monoprotein-Katzenfutter im Test 2026: 3 Nassfutter im Vergleich",
    href: "/blog/monoprotein-katzenfutter-test-2026",
    members: [
      "granatapet-delicatessen-huhn-pur-katze-test",
      "mjamjam-purer-fleischgenuss-delikates-kaenguru-pur-test",
      "leonardo-finest-selection-rind-pur-test",
    ],
  },
  gelenk: { slug: "gelenk-test-hund-oktober-2026", title: "Gelenktabletten und Gelenkpulver für Hunde im Test 2026: 5 Gelenkmittel im Vergleich", href: "/blog/gelenk-test-hund-oktober-2026" },
  lachsoel: { slug: "lachsoel-test-hund-oktober-2026", title: "Lachsöl für Hunde im Test 2026: 5 Lachsöle im Vergleich", href: "/blog/lachsoel-test-hund-oktober-2026" },
  algenoel: { slug: "algenoel-test-hund-oktober-2026", title: "Algenöl für Hunde im Test 2026: 5 Algenöle im Vergleich", href: "/blog/algenoel-test-hund-oktober-2026" },
} satisfies Record<string, Comparison>;

export const COMPARISONS: Comparison[] = Object.values(C);

const BLOG_MAP: Record<string, readonly Comparison[]> = {
  "lachsoel-hunde": [C.lachsoel],
  "hunde-nahrungsergaenzung": [C.lachsoel],
  "gelenkschmerzen-hund-produkte": [C.gelenk],
  "fleischanteil-hundefutter-katzenfutter": [C.nassfutter],
  "tierische-nebenerzeugnisse-gut-oder-schlecht": [C.nassfutter],
  "fleischherkunft-tierhaltung-tierfutter": [C.nassfutter],
  "nassfutter-trockenfutter-haltbarkeit": [C.nassfutter],
  "trockenmasse-berechnen-nass-trockenfutter": [C.nassfutter],
  // Katzenvergleich zuerst, der bisherige Nassfutter-Vergleich für Hunde bleibt.
  "monoprotein-futter": [C.monoproteinKatze, C.nassfutter],
};

export function comparisonsForPost(slug: string): Comparison[] {
  return BLOG_MAP[slug] ? [...BLOG_MAP[slug]] : [];
}

export function comparisonForPost(slug: string): Comparison | null {
  return comparisonsForPost(slug)[0] ?? null;
}

const WET = /nassfutter|\bdose\b|pastete|kennerfleisch|grancarno|mjamjam|rinti|lakefields|h(ä|ae)ppchen|in so(ß|ss)e|in gelee|\bpur\b|fleischgenuss/i;

export function comparisonForReview(r: { title?: string | null; productName?: string | null; keyword?: string | null; categorySlug: string; moisture?: number | null }): Comparison | null {
  const text = `${r.title ?? ""} ${r.productName ?? ""} ${r.keyword ?? ""}`;
  const wet = WET.test(text) || (r.moisture != null && r.moisture >= 60);
  if (r.categorySlug === "alleinfuttermittel-katze") return wet ? C.monoproteinKatze : null;
  if (!r.categorySlug.endsWith("-hund")) return null;
  if (/alge(n)?(ö|oe)l|algal|schizochytrium|mikroalge/i.test(text)) return C.algenoel;
  if (/lachs(ö|oe)l|fisch(ö|oe)l|omega-?3/i.test(text)) return C.lachsoel;
  if (/gelenk|gr(ü|ue)nlippmuschel|glucosamin|chondroitin|h(ü|ue)fte/i.test(text)) return C.gelenk;
  if (r.categorySlug === "alleinfuttermittel-hund" && wet) return C.nassfutter;
  return null;
}

/** Steht genau dieses Produkt (Einzeltest-Slug) im Vergleichstest? Nur dann darf die FAQ „Vergleichstest zu <Produkt>“ sagen. */
export function isInComparison(comparison: Comparison | null | undefined, reviewSlug: string): boolean {
  return Boolean(comparison?.members?.includes(reviewSlug));
}
