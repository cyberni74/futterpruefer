import { CRITERIA, type Scores } from "@/lib/scoring";
import { dateToBerlinLocal } from "./datetime";
import { initialPublishMode, type ContentStatus } from "./publish";

type ReviewRow = {
  id: string;
  title: string;
  slug: string;
  brand: string;
  productName: string;
  keyword: string;
  categoryId: string;
  priceClass: "GUENSTIG" | "MITTEL" | "PREMIUM";
  pricePerKg: { toString(): string } | null;
  imageUrl: string | null;
  imageAlt: string;
  imageBlur: string | null;
  verdict: string;
  pros: string[];
  cons: string[];
  bodyHtml: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  status: ContentStatus;
  publishedAt: Date | null;
  updatedAt: Date;
} & Scores;

/** Prisma-Datensatz → serialisierbare Editor-Daten (Decimal → String, Daten → Berlin-Ortszeit). */
export function reviewToEditorData(r: ReviewRow, now = new Date()) {
  const mode = initialPublishMode(r.status, r.publishedAt, now);
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    brand: r.brand,
    productName: r.productName,
    keyword: r.keyword,
    categoryId: r.categoryId,
    priceClass: r.priceClass,
    pricePerKg: r.pricePerKg ? Number(r.pricePerKg.toString()).toFixed(2).replace(".", ",") : "",
    imageUrl: r.imageUrl,
    imageAlt: r.imageAlt,
    imageBlur: r.imageBlur,
    scores: Object.fromEntries(CRITERIA.map((c) => [c.key, r[c.key]])) as Scores,
    verdict: r.verdict,
    pros: r.pros,
    cons: r.cons,
    bodyHtml: r.bodyHtml,
    metaTitle: r.metaTitle,
    metaDescription: r.metaDescription,
    keywords: r.keywords,
    publishMode: mode,
    scheduledAt: mode === "scheduled" ? dateToBerlinLocal(r.publishedAt) : "",
    updatedAt: r.updatedAt.toISOString(),
  };
}

export const EMPTY_REVIEW = {
  title: "",
  slug: "",
  brand: "",
  productName: "",
  keyword: "",
  categoryId: "",
  priceClass: "MITTEL" as const,
  pricePerKg: "",
  imageUrl: null,
  imageAlt: "",
  imageBlur: null,
  scores: Object.fromEntries(CRITERIA.map((c) => [c.key, 0])) as Scores,
  verdict: "",
  pros: [],
  cons: [],
  bodyHtml: "",
  metaTitle: "",
  metaDescription: "",
  keywords: [],
  publishMode: "draft" as const,
  scheduledAt: "",
  updatedAt: null,
};

type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  bodyHtml: string;
  imageUrl: string | null;
  imageAlt: string;
  imageBlur: string | null;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  status: ContentStatus;
  publishedAt: Date | null;
};

export function postToEditorData(p: PostRow, now = new Date()) {
  const mode = initialPublishMode(p.status, p.publishedAt, now);
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    bodyHtml: p.bodyHtml,
    imageUrl: p.imageUrl,
    imageAlt: p.imageAlt,
    imageBlur: p.imageBlur,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    keywords: p.keywords,
    publishMode: mode,
    scheduledAt: mode === "scheduled" ? dateToBerlinLocal(p.publishedAt) : "",
  };
}

export const EMPTY_POST = {
  title: "",
  slug: "",
  excerpt: "",
  bodyHtml: "",
  imageUrl: null,
  imageAlt: "",
  imageBlur: null,
  metaTitle: "",
  metaDescription: "",
  keywords: [],
  publishMode: "draft" as const,
  scheduledAt: "",
};
