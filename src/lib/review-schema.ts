import { contentAuthor } from "./attribution";
import { productLabel } from "./seo";
import { absoluteUrl, SITE } from "./site";

/** Methodik: Summe der Kriterien, jedes ab 0. Google nimmt sonst 1–5 an. */
export const REVIEW_WORST_RATING = 0;
export const REVIEW_BEST_RATING = 100;

/**
 * Überschrift des Tests, passend zur sichtbaren H1.
 * Hängt „im Test“ nicht an, wenn der Produktname es schon enthält.
 */
export function reviewHeadline(productName: string): string {
  const name = productName.trim().replace(/\s+/g, " ");
  if (!name) return "";
  if (/\bim Test\b/i.test(name)) return name;
  return `${name} im Test`;
}

function notes(items: string[]) {
  if (!items.length) return undefined;
  return {
    "@type": "ItemList" as const,
    itemListElement: items.map((name, i) => ({ "@type": "ListItem" as const, position: i + 1, name })),
  };
}

export type ProductReviewInput = {
  brand: string;
  productName: string;
  categoryName: string;
  /** Sichtbare Kurzbeschreibung (Meta-Text oder Fazit), kein erfundener Text. */
  description?: string;
  totalScore: number;
  verdict: string;
  publishedAt: Date | null;
  updatedAt: Date;
  authorSlug: string | null;
  images: string[];
  pros: string[];
  cons: string[];
  /**
   * Packungspreis und Testseite. Bewusst nicht als Offer ausgegeben: wir sind
   * kein Händler, Verfügbarkeit/Versand/Rückgabe kennen wir nicht. Ein Offer
   * löst sonst Händlereintrags-Warnungen in der Search Console aus.
   */
  price?: number | null;
  url?: string;
  /** Amazon-ASIN, nur wenn sie als eigener Wert vorliegt. Kein GTIN. */
  asin?: string | null;
};

/** ASIN ist 10-stellig und kein GTIN. Google prüft bei gtin Länge und Prüfziffer. */
export function skuFromAsin(asin: string | null | undefined) {
  const code = (asin ?? "").trim().toUpperCase();
  return /^[A-Z0-9]{10}$/.test(code) ? code : undefined;
}

function statements(items: string[]) {
  return items.map((name) => name.trim()).filter(Boolean);
}

/**
 * Verschachteltes Product → Review für Review-Snippets.
 * Google: bei einem Review an `Product.review` kein `itemReviewed` setzen;
 * Name, Bild und Marke stehen am Product. Kein AggregateRating: die Punktzahl
 * ist eine einzelne redaktionelle Wertung, kein Mittel aus Nutzerstimmen.
 * Kein Offer: Testseite, kein Shop (sonst Händlereintrags-Warnungen).
 * Die bewertete Sache ist das Produkt, nicht die Organization der Website.
 */
export function productReviewJsonLd(r: ProductReviewInput) {
  const name = productLabel(r.brand, r.productName);
  const images = r.images.filter(Boolean).map((u) => (u.startsWith("http") ? u : absoluteUrl(u)));
  const headline = reviewHeadline(name);
  const description = r.description?.trim();
  const sku = skuFromAsin(r.asin);
  const pros = statements(r.pros);
  const cons = statements(r.cons);
  // Google: Pros/Contras nur, wenn zusammen mindestens zwei Aussagen dastehen.
  const withNotes = pros.length + cons.length >= 2;
  return {
    "@context": "https://schema.org",
    "@type": "Product" as const,
    name,
    ...(description ? { description } : {}),
    brand: { "@type": "Brand" as const, name: r.brand },
    category: r.categoryName,
    ...(images.length ? { image: images } : {}),
    ...(sku ? { sku } : {}),
    review: {
      "@type": "Review" as const,
      ...(headline ? { name: headline } : {}),
      ...(r.verdict.trim() ? { reviewBody: r.verdict.trim() } : {}),
      ...(r.publishedAt ? { datePublished: r.publishedAt.toISOString() } : {}),
      dateModified: r.updatedAt.toISOString(),
      author: contentAuthor(r.authorSlug),
      publisher: { "@type": "Organization" as const, name: SITE.name, url: SITE.url },
      reviewRating: {
        "@type": "Rating" as const,
        ratingValue: r.totalScore,
        bestRating: REVIEW_BEST_RATING,
        worstRating: REVIEW_WORST_RATING,
      },
      ...(withNotes ? { positiveNotes: notes(pros), negativeNotes: notes(cons) } : {}),
    },
  };
}

/** Kritische Punkte aus Googles Produkt-Snippet-Regeln. Leer = kein bekannter Fehler. */
export function productSnippetIssues(data: ReturnType<typeof productReviewJsonLd>): string[] {
  const issues: string[] = [];
  const json = JSON.stringify(data);
  if (data["@type"] !== "Product" || !data.name?.trim()) issues.push("Product.name fehlt");
  if (!data.review || data.review["@type"] !== "Review") issues.push("verschachteltes Review fehlt");
  if (json.toLowerCase().includes("aggregaterating")) issues.push("aggregateRating ist nicht erlaubt");
  if ("gtin" in data || "gtin13" in data || "gtin12" in data || "gtin8" in data || "gtin14" in data) issues.push("GTIN ohne gespeicherte Prüfziffer");
  const rating = data.review?.reviewRating;
  if (!rating || rating.ratingValue < rating.worstRating || rating.ratingValue > rating.bestRating) issues.push("reviewRating außerhalb 0–100");
  if (rating?.bestRating !== 100 || rating?.worstRating !== 0) issues.push("Skala ist nicht 0–100");
  const author = data.review?.author;
  if (!author || author["@type"] !== "Person" || !author.name?.trim()) issues.push("Autor ist keine benannte Person");
  if (data.review?.publisher?.["@type"] !== "Organization" || data.review.publisher.name !== SITE.name) issues.push("Publisher fehlt");
  const pros = data.review?.positiveNotes?.itemListElement.length ?? 0;
  const cons = data.review?.negativeNotes?.itemListElement.length ?? 0;
  if ((data.review?.positiveNotes || data.review?.negativeNotes) && pros + cons < 2) issues.push("Pros/Contras unter zwei Aussagen");
  // Wir verkaufen nichts: ein Offer ohne Verfügbarkeit, Versand und Rückgabe
  // meldet die Search Console als Händlereintrag mit fehlenden Feldern.
  if ("offers" in data) issues.push("Offer gehört nicht in eine Testseite");
  return issues;
}

/**
 * Bereits gespeicherte JSON-LD-Knoten (Vergleichstests im bodyHtml) auf die Seitenregeln bringen:
 * kein Offer (wir verkaufen nichts) und ein Autor wie auf allen anderen Tests (Person), nie Organization.
 */
export function normalizeStoredJsonLd(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeStoredJsonLd);
  if (!value || typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    if (key === "offers" || key === "offer") continue;
    const isOrganizationAuthor = key === "author" && typeof item === "object" && item !== null && (item as { "@type"?: unknown })["@type"] === "Organization";
    out[key] = isOrganizationAuthor ? contentAuthor(null) : normalizeStoredJsonLd(item);
  }
  return out;
}
