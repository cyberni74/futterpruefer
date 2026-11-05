const AMAZON_TAG = "cyberni7400-21";

/** Hinweis direkt unter dem oberen Amazon-Button (Rechtsprüfung 30.10.2026). */
export const AFFILIATE_HINWEIS_OBEN =
  "*Affiliate-Link: Kaufen Sie über diesen Link, erhalten wir eine Provision von Amazon. Der Preis ändert sich für Sie nicht. Unsere Bewertung bleibt davon unberührt.";

/** Beschriftung ab 60 Punkten; darunter gilt der neutrale Preis-Text. */
export const AMAZON_TOP_CTA = "Jetzt bei Amazon entdecken*";
export const AMAZON_TOP_CTA_ROT = "Aktuellen Preis bei Amazon ansehen*";

const ASIN = /^[A-Z0-9]{10}$/;

/**
 * Link zum getesteten Produkt für den oberen Button: ausschließlich /dp/<ASIN> mit Partner-Tag.
 * Quelle ist zuerst das ASIN-Feld, sonst genau eine ASIN aus den vorhandenen Amazon-Produktlinks.
 * Keine Suchlinks, keine Varianten: bei fehlender oder mehrdeutiger ASIN gibt es keinen Button (null).
 */
export function topAmazonUrl(input: { asin?: string | null; kaufUrl?: string | null; html?: string | null }): string | null {
  const direkt = (input.asin ?? "").trim().toUpperCase();
  if (ASIN.test(direkt)) return `https://www.amazon.de/dp/${direkt}?tag=${AMAZON_TAG}`;
  const hrefs = [input.kaufUrl ?? "", ...[...(input.html ?? "").matchAll(/href="([^"]+)"/gi)].map((m) => m[1].replace(/&amp;/g, "&"))];
  const codes = new Set<string>();
  for (const href of hrefs) {
    if (!/^https?:\/\/(?:[\w-]+\.)?amazon\.[a-z.]+\//i.test(href)) continue;
    const code = href.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?![A-Z0-9])/i)?.[1];
    if (code) codes.add(code.toUpperCase());
  }
  return codes.size === 1 ? `https://www.amazon.de/dp/${[...codes][0]}?tag=${AMAZON_TAG}` : null;
}
