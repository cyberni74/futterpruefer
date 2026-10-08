import { z } from "zod";
import { CRITERIA, type CriterionKey } from "@/lib/scoring";
import { parseKeywords } from "./seo";

export type FieldErrors = Record<string, string>;

export type ActionResult = {
  ok: boolean;
  message: string;
  fieldErrors?: FieldErrors;
  /** Zeitstempel, damit identische Meldungen erneut angekündigt werden */
  at?: number;
};

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const text = (label: string, max: number, min = 0) =>
  z
    .string({ error: `${label} fehlt.` })
    .trim()
    .max(max, { error: `${label}: höchstens ${max} Zeichen.` })
    .min(min, { error: min <= 1 ? `${label} ist ein Pflichtfeld.` : `${label}: mindestens ${min} Zeichen.` });

const slugField = z
  .string()
  .trim()
  .min(2, { error: "Slug: mindestens 2 Zeichen." })
  .max(80, { error: "Slug: höchstens 80 Zeichen." })
  .regex(SLUG_RE, { error: "Slug: nur Kleinbuchstaben, Ziffern und Bindestriche." });

const imageUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || v.startsWith("/uploads/") || /^https:\/\/[^\s]+$/.test(v), { error: "Ungültige Bild-URL." });

const imageBlur = z
  .string()
  .max(6000, { error: "Blur-Platzhalter zu groß." })
  .refine((v) => v === "" || v.startsWith("data:image/webp;base64,"), { error: "Ungültiger Blur-Platzhalter." });

const publishMode = z.enum(["draft", "now", "scheduled"], { error: "Ungültiger Status." });

const seoFields = {
  metaTitle: text("Meta-Titel", 120),
  metaDescription: text("Meta-Beschreibung", 300),
  keywords: z.string().max(1500).transform(parseKeywords),
};

const bodyHtml = z.string().max(300_000, { error: "Der Text ist zu lang (max. 300.000 Zeichen)." });

const scoreFields = Object.fromEntries(
  CRITERIA.map((c) => [
    c.key,
    z.coerce
      .number({ error: `${c.label}: bitte eine Zahl eingeben.` })
      .int({ error: `${c.label}: nur ganze Punkte.` })
      .min(0, { error: `${c.label}: mindestens 0 Punkte.` })
      .max(c.max, { error: `${c.label}: maximal ${c.max} Punkte.` }),
  ]),
) as Record<CriterionKey, z.ZodCoercedNumber<unknown>>;

const listItems = (label: string) =>
  z
    .array(z.string().trim().max(200, { error: `${label}: höchstens 200 Zeichen pro Punkt.` }))
    .transform((a) => a.filter(Boolean))
    .pipe(z.array(z.string()).max(3, { error: `${label}: höchstens 3 Punkte.` }));

const pricePerKg = z
  .string()
  .trim()
  .transform((v, ctx) => {
    if (v === "") return null;
    const n = Number(v.replace(/\s|€/g, "").replace(",", "."));
    if (!Number.isFinite(n) || n < 0 || n > 999999) {
      ctx.addIssue({ code: "custom", message: "Preis/kg: bitte einen gültigen Betrag angeben (z. B. 12,90)." });
      return z.NEVER;
    }
    return Math.round(n * 100) / 100;
  });

export const reviewSchema = z
  .object({
    title: text("Titel", 160, 3),
    slug: slugField,
    brand: text("Marke", 80, 1),
    productName: text("Produktname", 160, 1),
    keyword: text("Stichwort", 80),
    categoryId: z.string().trim().min(1, { error: "Bitte eine Kategorie wählen." }).max(40),
    priceClass: z.enum(["GUENSTIG", "MITTEL", "PREMIUM"], { error: "Ungültige Preisklasse." }),
    pricePerKg,
    imageUrl,
    imageAlt: text("Alt-Text", 200),
    imageBlur,
    ...scoreFields,
    verdict: text("Fazit", 400),
    pros: listItems("Pro"),
    cons: listItems("Contra"),
    bodyHtml,
    ...seoFields,
    publishMode,
    scheduledAt: z.string().max(30),
  })
  .superRefine((v, ctx) => {
    if (v.imageUrl && !v.imageAlt) ctx.addIssue({ code: "custom", path: ["imageAlt"], message: "Bitte einen Alt-Text für das Bild angeben." });
    if (v.publishMode === "draft") return;
    if (v.verdict.length < 10) ctx.addIssue({ code: "custom", path: ["verdict"], message: "Zum Veröffentlichen bitte ein Fazit (1–2 Sätze) angeben." });
    if (v.pros.length < 2) ctx.addIssue({ code: "custom", path: ["pros"], message: "Zum Veröffentlichen mindestens 2 Pro-Punkte angeben." });
    if (v.cons.length < 2) ctx.addIssue({ code: "custom", path: ["cons"], message: "Zum Veröffentlichen mindestens 2 Contra-Punkte angeben." });
  });

export type ReviewInput = z.output<typeof reviewSchema>;

export const blogSchema = z
  .object({
    title: text("Titel", 160, 3),
    slug: slugField,
    excerpt: text("Anreißer", 400),
    imageUrl,
    imageAlt: text("Alt-Text", 200),
    imageBlur,
    bodyHtml,
    ...seoFields,
    publishMode,
    scheduledAt: z.string().max(30),
  })
  .superRefine((v, ctx) => {
    if (v.imageUrl && !v.imageAlt) ctx.addIssue({ code: "custom", path: ["imageAlt"], message: "Bitte einen Alt-Text für das Bild angeben." });
    if (v.publishMode !== "draft" && v.excerpt.length < 20)
      ctx.addIssue({ code: "custom", path: ["excerpt"], message: "Zum Veröffentlichen bitte einen Anreißer (mind. 20 Zeichen) angeben." });
  });

export type BlogInput = z.output<typeof blogSchema>;

const optionalHref = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || (v.startsWith("/") && !v.startsWith("//")) || /^https:\/\/[^\s]+$/.test(v), {
    error: "Link: interner Pfad (/…) oder https://-Adresse.",
  });

export const tickerSchema = z.object({
  text: text("Text", 200, 3),
  href: optionalHref,
  isWarning: z.boolean(),
  active: z.boolean(),
  expiresAt: z.string().max(30),
});

export const pdmSchema = z.object({
  year: z.coerce.number({ error: "Bitte ein Jahr angeben." }).int().min(2020, { error: "Jahr ab 2020." }).max(2100, { error: "Jahr bis 2100." }),
  month: z.coerce.number({ error: "Bitte einen Monat wählen." }).int().min(1, { error: "Ungültiger Monat." }).max(12, { error: "Ungültiger Monat." }),
  reviewId: z.string().trim().min(1, { error: "Bitte einen Test auswählen." }).max(40),
  reason: text("Begründung", 1000, 10),
});

export const faqSchema = z.object({
  question: text("Frage", 300, 5),
  answer: text("Antwort", 4000, 5),
  sortOrder: z.coerce.number({ error: "Sortierung: bitte eine Zahl." }).int({ error: "Sortierung: ganze Zahl." }).min(-9999).max(9999),
});

/** Zod-Fehler → { feld: erste Meldung } */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "_form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
}

function strs(fd: FormData, key: string): string[] {
  return fd.getAll(key).filter((v): v is string => typeof v === "string");
}

export function bool(fd: FormData, key: string): boolean {
  const v = fd.get(key);
  return v === "on" || v === "true" || v === "1";
}

export function reviewFormToRaw(fd: FormData) {
  return {
    title: str(fd, "title"),
    slug: str(fd, "slug"),
    brand: str(fd, "brand"),
    productName: str(fd, "productName"),
    keyword: str(fd, "keyword"),
    categoryId: str(fd, "categoryId"),
    priceClass: str(fd, "priceClass"),
    pricePerKg: str(fd, "pricePerKg"),
    imageUrl: str(fd, "imageUrl"),
    imageAlt: str(fd, "imageAlt"),
    imageBlur: str(fd, "imageBlur"),
    ...Object.fromEntries(CRITERIA.map((c) => [c.key, str(fd, c.key)])),
    verdict: str(fd, "verdict"),
    pros: strs(fd, "pros"),
    cons: strs(fd, "cons"),
    bodyHtml: str(fd, "bodyHtml"),
    metaTitle: str(fd, "metaTitle"),
    metaDescription: str(fd, "metaDescription"),
    keywords: str(fd, "keywords"),
    publishMode: str(fd, "publishMode"),
    scheduledAt: str(fd, "scheduledAt"),
  };
}

export function blogFormToRaw(fd: FormData) {
  return {
    title: str(fd, "title"),
    slug: str(fd, "slug"),
    excerpt: str(fd, "excerpt"),
    imageUrl: str(fd, "imageUrl"),
    imageAlt: str(fd, "imageAlt"),
    imageBlur: str(fd, "imageBlur"),
    bodyHtml: str(fd, "bodyHtml"),
    metaTitle: str(fd, "metaTitle"),
    metaDescription: str(fd, "metaDescription"),
    keywords: str(fd, "keywords"),
    publishMode: str(fd, "publishMode"),
    scheduledAt: str(fd, "scheduledAt"),
  };
}

export function tickerFormToRaw(fd: FormData) {
  return { text: str(fd, "text"), href: str(fd, "href"), isWarning: bool(fd, "isWarning"), active: bool(fd, "active"), expiresAt: str(fd, "expiresAt") };
}

export function pdmFormToRaw(fd: FormData) {
  return { year: str(fd, "year"), month: str(fd, "month"), reviewId: str(fd, "reviewId"), reason: str(fd, "reason") };
}

export function faqFormToRaw(fd: FormData) {
  return { question: str(fd, "question"), answer: str(fd, "answer"), sortOrder: str(fd, "sortOrder") || "0" };
}

/** Prisma-Fehler für Unique-Constraint (P2002) erkennen, ohne Prisma zu importieren. */
export function isUniqueViolation(e: unknown): boolean {
  return !!e && typeof e === "object" && (e as { code?: unknown }).code === "P2002";
}
