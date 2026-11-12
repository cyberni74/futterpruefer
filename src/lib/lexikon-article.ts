import { contentAuthor } from "@/lib/attribution";
import { extractFaq } from "@/lib/faq-extract";
import { faqPageJsonLd } from "@/lib/faq-schema";
import { isAllowedImageUrl } from "@/lib/image-hosts";
import { trimMetaDescription } from "@/lib/seo";
import { absoluteUrl, SITE } from "@/lib/site";

/** Ampel als Text. Dieselben drei Stufen wie im Admin und auf der öffentlichen Seite. */
export const LEXIKON_CONCERN_LABEL = {
  UNBEDENKLICH: "Unbedenklich",
  EINGESCHRAENKT: "Eingeschränkt",
  BEDENKLICH: "Bedenklich",
} as const;

export type LexikonConcern = keyof typeof LEXIKON_CONCERN_LABEL;

export const LEXIKON_IMAGE_SLOTS = 5;
export const LEXIKON_FAQ_MAX = 12;

export type LexikonImage = { url: string; alt: string; caption: string };
export type LexikonFaq = { question: string; answer: string };

const LEGACY_WORD_MAX = 250;

function plainText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function norm(value: string): string {
  return value.toLocaleLowerCase("de").replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim();
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Alt-Kurztext aus dem Seed: nur die Einschätzung, keine Tabelle, kein Bild, keine eigene Gliederung.
 * Solche Bodies wiederholt das Template sonst unter der fachlichen Einschätzung.
 */
export function isLegacyLexikonBody(bodyHtml: string | null | undefined): boolean {
  const html = bodyHtml ?? "";
  if (!plainText(html)) return true;
  if (/<(?:table|thead|figure|img|h3|blockquote)\b/i.test(html)) return false;
  const headings = [...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map((match) => plainText(match[1]));
  if (headings.some((heading) => !/^(fachliche\s+)?einschätzung$/i.test(heading))) return false;
  return plainText(html).split(/\s+/).filter(Boolean).length <= LEGACY_WORD_MAX;
}

/** true, wenn der Artikeltext die Einschätzung schon enthält (kein zweiter Kasten). */
export function bodyRepeatsAssessment(bodyHtml: string | null | undefined, assessment: string): boolean {
  const needle = norm(assessment);
  if (needle.length < 40) return false;
  return norm(plainText(bodyHtml ?? "")).includes(needle);
}

/** true, wenn der Artikeltext die Kurzbeschreibung schon als Absatz enthält. */
export function bodyRepeatsLead(bodyHtml: string | null | undefined, shortDescription: string): boolean {
  const needle = norm(shortDescription);
  if (needle.length < 40) return false;
  return norm(plainText(bodyHtml ?? "")).includes(needle);
}

export function lexikonHeadline(entry: { headline?: string | null; name: string }): string {
  const headline = entry.headline?.trim() ?? "";
  return headline || entry.name;
}

/** <title> ohne Markensuffix. Gesetzter SEO-Titel, sonst das bisherige Muster. */
export function lexikonDocumentTitle(entry: { name: string; concern: LexikonConcern; metaTitle?: string | null }): string {
  const custom = entry.metaTitle?.trim() ?? "";
  if (custom) return custom;
  return `${entry.name} im Tierfutter: ${LEXIKON_CONCERN_LABEL[entry.concern]}?`;
}

/** Meta-Beschreibung: gesetztes Feld, sonst die bisherige Kurzbeschreibung samt Auffüllsatz. */
export function lexikonMetaDescription(entry: { metaDescription?: string | null; shortDescription?: string | null }): string {
  const base = (entry.metaDescription?.trim() || entry.shortDescription?.trim() || "").replace(/\s+/g, " ").trim();
  return trimMetaDescription(base.length >= 70 ? base : `${base} Bewertung und Einordnung im Futter-Lexikon von ${SITE.name}.`);
}

export function parseLexikonImages(value: unknown): LexikonImage[] {
  if (!Array.isArray(value)) return [];
  const images: LexikonImage[] = [];
  for (const item of value) {
    if (images.length >= LEXIKON_IMAGE_SLOTS) break;
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const url = readString(record.url);
    if (!url || !isAllowedImageUrl(url)) continue;
    images.push({ url, alt: readString(record.alt), caption: readString(record.caption) });
  }
  return images;
}

export function parseLexikonFaqs(value: unknown): LexikonFaq[] {
  if (!Array.isArray(value)) return [];
  const faqs: LexikonFaq[] = [];
  for (const item of value) {
    if (faqs.length >= LEXIKON_FAQ_MAX) break;
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const question = readString(record.question);
    const answer = readString(record.answer);
    if (!question || !answer) continue;
    faqs.push({ question, answer });
  }
  return faqs;
}

/** Erstes Bild mit URL. Leer, wenn kein Bild gesetzt ist. */
export function lexikonHero(images: readonly LexikonImage[]): LexikonImage | null {
  return images.find((image) => image.url) ?? null;
}

/** Bilder, deren URL im bereits gerenderten HTML nicht vorkommt. Leere URLs gibt es hier nicht. */
export function lexikonImagesOutsideBody(images: readonly LexikonImage[], html: string): LexikonImage[] {
  return images.filter((image) => image.url && !html.includes(image.url));
}

/**
 * Das erste Bild im Artikeltext ist oft das Titelbild und damit LCP.
 * Sanitize setzt überall loading=lazy; hier nur das erste Bild hochstufen, und nur wenn kein separates Hero-Bild darüber steht.
 */
export function promoteLeadImage(html: string): string {
  const index = html.search(/<img\b/i);
  // Nur ein Bild weit oben ist der LCP-Kandidat. Späte Bilder bleiben lazy.
  if (index < 0 || index > 2500) return html;
  let used = false;
  return html.replace(/<img\b[^>]*>/i, (tag) => {
    if (used) return tag;
    used = true;
    const withoutLazy = tag.replace(/\s+loading=(["'])lazy\1/i, "");
    if (/\bfetchpriority\s*=/i.test(withoutLazy)) return withoutLazy;
    return withoutLazy.replace(/<img\b/i, '<img fetchpriority="high"');
  });
}

export type LexikonFaqSource = "body" | "field" | "none";

/**
 * Sichtbare FAQ und damit die einzige Quelle für FAQPage.
 * Steht „Häufige Fragen“ im Artikeltext, gilt dieser Wortlaut. Sonst die gepflegten Paare, die das Template ausgibt.
 */
export function lexikonVisibleFaqs(longForm: boolean, renderedBody: string, stored: readonly LexikonFaq[]): { items: LexikonFaq[]; source: LexikonFaqSource } {
  const fromBody = longForm ? extractFaq(renderedBody) : [];
  if (fromBody.length) return { items: fromBody, source: "body" };
  const items = stored.filter((item) => item.question && item.answer);
  return { items, source: items.length ? "field" : "none" };
}

export function lexikonDefinedTerm(entry: { name: string; synonyms: string[]; shortDescription: string; slug: string }) {
  const url = absoluteUrl(`/lexikon/${entry.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm" as const,
    name: entry.name,
    ...(entry.synonyms.length ? { alternateName: entry.synonyms } : {}),
    description: entry.shortDescription,
    url,
    inDefinedTermSet: { "@type": "DefinedTermSet" as const, name: "Futter-Lexikon", url: absoluteUrl("/lexikon") },
  };
}

export function lexikonArticleJsonLd(entry: {
  name: string;
  slug: string;
  headline: string;
  description: string;
  images: readonly LexikonImage[];
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  const url = absoluteUrl(`/lexikon/${entry.slug}`);
  const image = entry.images.map((item) => (item.url.startsWith("http") ? item.url : absoluteUrl(item.url)));
  const published = entry.publishedAt ?? entry.createdAt;
  return {
    "@context": "https://schema.org",
    "@type": "Article" as const,
    headline: entry.headline,
    name: entry.name,
    description: entry.description,
    datePublished: published.toISOString(),
    dateModified: entry.updatedAt.toISOString(),
    inLanguage: "de-DE",
    mainEntityOfPage: url,
    ...(image.length ? { image } : {}),
    author: contentAuthor(null),
    publisher: { "@type": "Organization" as const, name: SITE.name, url: SITE.url },
  };
}

export function lexikonFaqJsonLd(items: readonly LexikonFaq[]) {
  return faqPageJsonLd(items.map((item) => ({ question: item.question, answer: item.answer })));
}
