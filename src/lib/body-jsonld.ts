import { normalizeStoredJsonLd } from "@/lib/review-schema";

/**
 * Vergleichstests liegen als BlogPost vor. Ihr JSON-LD (FAQPage, ItemList) steht im bodyHtml,
 * das der Sanitizer samt script entfernt. Nur für diese Slugs wird es hier als geparstes JSON
 * ausgegeben. Article-Knoten entfallen, weil die Seite ihr eigenes Article-JSON-LD rendert.
 */
export const BODY_JSON_LD_SLUGS = new Set([
  "nassfutter-test-rind-hund-oktober-2026",
  "gelenk-test-hund-oktober-2026",
  "lachsoel-test-hund-oktober-2026",
  "algenoel-test-hund-oktober-2026",
  "veganes-hundefutter-test-oktober-2026",
  "veganes-katzenfutter-test-oktober-2026",
]);

export function bodyJsonLd(slug: string, html: string | null | undefined): Record<string, unknown> | null {
  if (!html || !BODY_JSON_LD_SLUGS.has(slug)) return null;
  const nodes: Record<string, unknown>[] = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]) as Record<string, unknown>;
      const graph = Array.isArray(data["@graph"]) ? (data["@graph"] as Record<string, unknown>[]) : [data];
      nodes.push(...(graph.filter((n) => n && typeof n === "object" && n["@type"] !== "Article").map(normalizeStoredJsonLd) as Record<string, unknown>[]));
    } catch {
      // ungültiges JSON: nichts ausgeben
    }
  }
  return nodes.length ? { "@context": "https://schema.org", "@graph": nodes.map((n) => { const { "@context": _ctx, ...rest } = n; void _ctx; return rest; }) } : null;
}
