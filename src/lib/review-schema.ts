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
  totalScore: number;
  verdict: string;
  publishedAt: Date | null;
  updatedAt: Date;
  authorSlug: string | null;
  images: string[];
  pros: string[];
  cons: string[];
};

/**
 * Verschachteltes Product → Review für Review-Snippets.
 * Google: bei einem Review an `Product.review` kein `itemReviewed` setzen;
 * Name, Bild und Marke stehen am Product. Kein AggregateRating: die Punktzahl
 * ist eine einzelne redaktionelle Wertung, kein Mittel aus Nutzerstimmen.
 * Die bewertete Sache ist das Produkt, nicht die Organization der Website.
 */
export function productReviewJsonLd(r: ProductReviewInput) {
  const name = productLabel(r.brand, r.productName);
  const images = r.images.filter(Boolean).map((u) => (u.startsWith("http") ? u : absoluteUrl(u)));
  const headline = reviewHeadline(name);
  return {
    "@context": "https://schema.org",
    "@type": "Product" as const,
    name,
    brand: { "@type": "Brand" as const, name: r.brand },
    category: r.categoryName,
    ...(images.length ? { image: images } : {}),
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
      positiveNotes: notes(r.pros),
      negativeNotes: notes(r.cons),
    },
  };
}
