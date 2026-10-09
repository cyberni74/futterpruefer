import { CRITERIA, type Scores } from "@/lib/scoring";
import { parseAnalysis, parseClaims } from "@/lib/product-data";

const money = (v: { toString(): string } | null | undefined) => (v == null ? "" : Number(v.toString()).toFixed(2).replace(".", ","));
const day = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : "");

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
  contentImageUrl: string | null;
  contentImageAlt: string;
  contentImageBlur: string | null;
  verdict: string;
  harmfulReason: string;
  composition: string;
  analysis: unknown;
  packageSize: string;
  price: { toString(): string } | null;
  pricePerDay: { toString(): string } | null;
  priceDate: Date | null;
  testedAt: Date | null;
  gallery: string[];
  claims: unknown;
  pros: string[];
  cons: string[];
  bodyHtml: string;
  conclusionHtml: string;
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
    contentImageUrl: r.contentImageUrl,
    contentImageAlt: r.contentImageAlt,
    contentImageBlur: r.contentImageBlur,
    scores: Object.fromEntries(CRITERIA.map((c) => [c.key, r[c.key]])) as Scores,
    verdict: r.verdict,
    harmfulReason: r.harmfulReason,
    composition: r.composition,
    analysis: parseAnalysis(r.analysis),
    packageSize: r.packageSize,
    price: money(r.price),
    pricePerDay: money(r.pricePerDay),
    priceDate: day(r.priceDate),
    testedAt: day(r.testedAt),
    gallery: r.gallery,
    claims: parseClaims(r.claims),
    pros: r.pros,
    cons: r.cons,
    bodyHtml: r.bodyHtml,
    conclusionHtml: r.conclusionHtml,
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
  contentImageUrl: null,
  contentImageAlt: "",
  contentImageBlur: null,
  scores: Object.fromEntries(CRITERIA.map((c) => [c.key, 0])) as Scores,
  verdict: "",
  harmfulReason: "",
  composition: "",
  analysis: [] as Array<{ name: string; value: number }>,
  packageSize: "",
  price: "",
  pricePerDay: "",
  priceDate: "",
  testedAt: "",
  gallery: [] as string[],
  claims: [] as ReturnType<typeof parseClaims>,
  pros: [],
  cons: [],
  bodyHtml: "",
  conclusionHtml: "",
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
