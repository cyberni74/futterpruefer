import { z } from "zod";
import { isAllowedImageUrl } from "@/lib/image-hosts";
import { slugify } from "@/lib/slug";
import { dateToBerlinLocal } from "./datetime";
import { initialPublishMode, type ContentStatus, type PublishMode } from "./publish";
import { SLUG_RE } from "./schemas";

export const LEXIKON_IMAGE_SLOTS = 5;
export const LEXIKON_FAQ_MAX = 12;

export type Concern = "UNBEDENKLICH" | "EINGESCHRAENKT" | "BEDENKLICH";

export const CONCERN_OPTIONS: { value: Concern; label: string; hint: string; tone: "good" | "mid" | "bad" }[] = [
  { value: "UNBEDENKLICH", label: "Unbedenklich", hint: "Keine Bedenken", tone: "good" },
  { value: "EINGESCHRAENKT", label: "Eingeschränkt", hint: "Mit Einschränkungen", tone: "mid" },
  { value: "BEDENKLICH", label: "Bedenklich", hint: "Kritisch", tone: "bad" },
];

export const CONCERN_LABEL: Record<Concern, string> = {
  UNBEDENKLICH: "Unbedenklich",
  EINGESCHRAENKT: "Eingeschränkt",
  BEDENKLICH: "Bedenklich",
};

export const LEXIKON_GROUPS = [
  "Zusatzstoff",
  "Rohstoff",
  "Nährstoff",
  "Konservierungsstoff",
  "Zucker & Süßungsmittel",
  "Füllstoff",
  "Vitamin",
  "Mineralstoff",
] as const;

export const SYNONYM_MAX = 20;
export const SYNONYM_LEN = 80;

/**
 * Synonyme normalisieren: trimmen, Leerraum zusammenfassen, leere und doppelte (Groß-/Kleinschreibung egal)
 * sowie mit dem Hauptbegriff identische Einträge entfernen.
 */
export function normalizeSynonyms(items: readonly string[], exclude?: string): string[] {
  const seen = new Set<string>();
  if (exclude) seen.add(exclude.trim().replace(/\s+/g, " ").toLocaleLowerCase("de"));
  const out: string[] = [];
  for (const raw of items) {
    const s = raw.trim().replace(/\s+/g, " ");
    const key = s.toLocaleLowerCase("de");
    if (!s || seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

/** "Taurine, L-Taurin;  taurine" → ["Taurine", "L-Taurin"] (Trennzeichen: Komma, Semikolon, Zeilenumbruch). */
export function parseSynonyms(input: string | null | undefined, exclude?: string): string[] {
  if (!input) return [];
  return normalizeSynonyms(input.split(/[,;\n]/), exclude);
}

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

const synonymItems = z
  .array(z.string().trim().max(SYNONYM_LEN, { error: `Synonyme: höchstens ${SYNONYM_LEN} Zeichen pro Eintrag.` }))
  .transform((a) => normalizeSynonyms(a))
  .pipe(z.array(z.string()).max(SYNONYM_MAX, { error: `Synonyme: höchstens ${SYNONYM_MAX} Einträge.` }));

const concern = z.enum(["UNBEDENKLICH", "EINGESCHRAENKT", "BEDENKLICH"], { error: "Bitte eine Bedenklichkeits-Stufe wählen." });

const imageUrls = z.array(z.string().trim().max(500, { error: "Bild-URL: höchstens 500 Zeichen." })).max(LEXIKON_IMAGE_SLOTS, { error: `Höchstens ${LEXIKON_IMAGE_SLOTS} Bilder.` });
const imageAlts = z.array(z.string().trim().max(300, { error: "Alt-Text: höchstens 300 Zeichen." })).max(LEXIKON_IMAGE_SLOTS);
const imageCaptions = z.array(z.string().trim().max(400, { error: "Bildunterschrift: höchstens 400 Zeichen." })).max(LEXIKON_IMAGE_SLOTS);
const faqQuestions = z.array(z.string().trim().max(300, { error: "Frage: höchstens 300 Zeichen." })).max(LEXIKON_FAQ_MAX, { error: `Höchstens ${LEXIKON_FAQ_MAX} Fragen.` });
const faqAnswers = z.array(z.string().trim().max(2000, { error: "Antwort: höchstens 2.000 Zeichen." })).max(LEXIKON_FAQ_MAX);

export const lexikonSchema = z
  .object({
    name: text("Name", 120, 1),
    slug: slugField,
    synonyms: synonymItems,
    group: text("Gruppe", 60),
    concern,
    shortDescription: text("Kurzbeschreibung", 300),
    assessment: text("Bewertung", 1000),
    bodyHtml: z.string().max(300_000, { error: "Der Text ist zu lang (max. 300.000 Zeichen)." }),
    headline: text("Überschrift", 160),
    imageUrl: imageUrls,
    imageAlt: imageAlts,
    imageCaption: imageCaptions,
    faqQuestion: faqQuestions,
    faqAnswer: faqAnswers,
    metaTitle: text("SEO-Titel", 120),
    metaDescription: text("Meta-Beschreibung", 300),
    publishMode: z.enum(["draft", "now", "scheduled"], { error: "Ungültiger Status." }),
    scheduledAt: z.string().max(30),
  })
  .superRefine((v, ctx) => {
    if (v.publishMode !== "draft" && v.shortDescription.length < 20)
      ctx.addIssue({ code: "custom", path: ["shortDescription"], message: "Zum Veröffentlichen bitte eine Kurzbeschreibung (mind. 20 Zeichen) angeben." });
    const slots = Math.max(v.imageUrl.length, v.imageAlt.length, v.imageCaption.length);
    for (let i = 0; i < slots; i++) {
      const url = v.imageUrl[i] ?? "";
      const alt = v.imageAlt[i] ?? "";
      const caption = v.imageCaption[i] ?? "";
      if (!url && !alt && !caption) continue;
      if (!url) ctx.addIssue({ code: "custom", path: [`imageUrl${i}`], message: `Bild ${i + 1}: URL fehlt.` });
      else if (!isAllowedImageUrl(url)) ctx.addIssue({ code: "custom", path: [`imageUrl${i}`], message: `Bild ${i + 1}: nur eigene Uploads oder den Bucket „bilder“.` });
      if (url && !alt) ctx.addIssue({ code: "custom", path: [`imageAlt${i}`], message: `Bild ${i + 1}: Alt-Text fehlt.` });
    }
    const pairs = Math.max(v.faqQuestion.length, v.faqAnswer.length);
    for (let i = 0; i < pairs; i++) {
      const question = v.faqQuestion[i] ?? "";
      const answer = v.faqAnswer[i] ?? "";
      if (!question && !answer) continue;
      if (!question) ctx.addIssue({ code: "custom", path: [`faqQuestion${i}`], message: `Frage ${i + 1} fehlt.` });
      if (!answer) ctx.addIssue({ code: "custom", path: [`faqAnswer${i}`], message: `Antwort ${i + 1} fehlt.` });
    }
  })
  .transform((v) => {
    const images: LexikonImageInput[] = [];
    const slots = Math.max(v.imageUrl.length, v.imageAlt.length, v.imageCaption.length);
    for (let i = 0; i < slots && images.length < LEXIKON_IMAGE_SLOTS; i++) {
      const url = v.imageUrl[i] ?? "";
      if (!url) continue;
      images.push({ url, alt: v.imageAlt[i] ?? "", caption: v.imageCaption[i] ?? "" });
    }
    const faqs: LexikonFaqInput[] = [];
    const pairs = Math.max(v.faqQuestion.length, v.faqAnswer.length);
    for (let i = 0; i < pairs && faqs.length < LEXIKON_FAQ_MAX; i++) {
      const question = v.faqQuestion[i] ?? "";
      const answer = v.faqAnswer[i] ?? "";
      if (!question && !answer) continue;
      faqs.push({ question, answer });
    }
    return {
      name: v.name,
      slug: v.slug,
      synonyms: normalizeSynonyms(v.synonyms, v.name),
      group: v.group,
      concern: v.concern,
      shortDescription: v.shortDescription,
      assessment: v.assessment,
      bodyHtml: v.bodyHtml,
      headline: v.headline,
      images,
      faqs,
      metaTitle: v.metaTitle,
      metaDescription: v.metaDescription,
      publishMode: v.publishMode,
      scheduledAt: v.scheduledAt,
    };
  });

export type LexikonImageInput = { url: string; alt: string; caption: string };
export type LexikonFaqInput = { question: string; answer: string };

export type LexikonInput = z.output<typeof lexikonSchema>;

export const glossarySchema = z
  .object({
    term: text("Begriff", 120, 1),
    slug: z.string().trim().max(80, { error: "Slug: höchstens 80 Zeichen." }),
    synonyms: z.string().max(2000, { error: "Synonyme: zu lang." }),
    definition: text("Definition", 600, 1),
  })
  .transform((v, ctx) => {
    const slug = v.slug ? v.slug : slugify(v.term);
    if (slug.length < 2 || !SLUG_RE.test(slug)) {
      ctx.addIssue({ code: "custom", path: ["slug"], message: "Slug: mind. 2 Zeichen, nur Kleinbuchstaben, Ziffern und Bindestriche." });
      return z.NEVER;
    }
    const synonyms = parseSynonyms(v.synonyms, v.term);
    if (synonyms.some((s) => s.length > SYNONYM_LEN)) {
      ctx.addIssue({ code: "custom", path: ["synonyms"], message: `Synonyme: höchstens ${SYNONYM_LEN} Zeichen pro Eintrag.` });
      return z.NEVER;
    }
    if (synonyms.length > SYNONYM_MAX) {
      ctx.addIssue({ code: "custom", path: ["synonyms"], message: `Synonyme: höchstens ${SYNONYM_MAX} Einträge.` });
      return z.NEVER;
    }
    return { term: v.term, slug, synonyms, definition: v.definition };
  });

export type GlossaryInput = z.output<typeof glossarySchema>;

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
}

export function lexikonFormToRaw(fd: FormData) {
  return {
    name: str(fd, "name"),
    slug: str(fd, "slug"),
    synonyms: fd.getAll("synonyms").filter((v): v is string => typeof v === "string"),
    group: str(fd, "group"),
    concern: str(fd, "concern"),
    shortDescription: str(fd, "shortDescription"),
    assessment: str(fd, "assessment"),
    bodyHtml: str(fd, "bodyHtml"),
    headline: str(fd, "headline"),
    imageUrl: fd.getAll("imageUrl").filter((v): v is string => typeof v === "string"),
    imageAlt: fd.getAll("imageAlt").filter((v): v is string => typeof v === "string"),
    imageCaption: fd.getAll("imageCaption").filter((v): v is string => typeof v === "string"),
    faqQuestion: fd.getAll("faqQuestion").filter((v): v is string => typeof v === "string"),
    faqAnswer: fd.getAll("faqAnswer").filter((v): v is string => typeof v === "string"),
    metaTitle: str(fd, "metaTitle"),
    metaDescription: str(fd, "metaDescription"),
    publishMode: str(fd, "publishMode"),
    scheduledAt: str(fd, "scheduledAt"),
  };
}

export function glossaryFormToRaw(fd: FormData) {
  return { term: str(fd, "term"), slug: str(fd, "slug"), synonyms: str(fd, "synonyms"), definition: str(fd, "definition") };
}

/** Alphabetisch nach deutscher Sortierung (ä bei a, Groß-/Kleinschreibung egal). */
export function sortByTermDe<T extends { term: string }>(items: readonly T[]): T[] {
  const collator = new Intl.Collator("de", { sensitivity: "base", numeric: true });
  return [...items].sort((a, b) => collator.compare(a.term, b.term));
}

export type LexikonEditorData = {
  id?: string;
  name: string;
  slug: string;
  synonyms: string[];
  group: string;
  concern: Concern;
  shortDescription: string;
  assessment: string;
  bodyHtml: string;
  headline: string;
  images: LexikonImageInput[];
  faqs: LexikonFaqInput[];
  metaTitle: string;
  metaDescription: string;
  publishMode: PublishMode;
  scheduledAt: string;
  /** Aktuell öffentlich sichtbar (für den Link zur Live-Seite) */
  isLive?: boolean;
};

type LexikonRow = Omit<LexikonEditorData, "publishMode" | "scheduledAt" | "isLive" | "images" | "faqs"> & {
  id: string;
  status: ContentStatus;
  publishedAt: Date | null;
  images: unknown;
  faqs: unknown;
};

function storedImages(value: unknown): LexikonImageInput[] {
  const out: LexikonImageInput[] = [];
  if (Array.isArray(value)) {
    for (const item of value) {
      if (out.length >= LEXIKON_IMAGE_SLOTS) break;
      if (!item || typeof item !== "object") continue;
      const record = item as Record<string, unknown>;
      const url = typeof record.url === "string" ? record.url : "";
      if (!url.trim()) continue;
      out.push({
        url,
        alt: typeof record.alt === "string" ? record.alt : "",
        caption: typeof record.caption === "string" ? record.caption : "",
      });
    }
  }
  while (out.length < LEXIKON_IMAGE_SLOTS) out.push({ url: "", alt: "", caption: "" });
  return out;
}

function storedFaqs(value: unknown): LexikonFaqInput[] {
  if (!Array.isArray(value)) return [];
  const out: LexikonFaqInput[] = [];
  for (const item of value) {
    if (out.length >= LEXIKON_FAQ_MAX) break;
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const question = typeof record.question === "string" ? record.question : "";
    const answer = typeof record.answer === "string" ? record.answer : "";
    if (!question.trim() && !answer.trim()) continue;
    out.push({ question, answer });
  }
  return out;
}

export function lexikonToEditorData(e: LexikonRow, now = new Date()): LexikonEditorData {
  const mode = initialPublishMode(e.status, e.publishedAt, now);
  return {
    id: e.id,
    name: e.name,
    slug: e.slug,
    synonyms: e.synonyms,
    group: e.group,
    concern: e.concern,
    shortDescription: e.shortDescription,
    assessment: e.assessment,
    bodyHtml: e.bodyHtml,
    headline: e.headline,
    images: storedImages(e.images),
    faqs: storedFaqs(e.faqs),
    metaTitle: e.metaTitle,
    metaDescription: e.metaDescription,
    publishMode: mode,
    scheduledAt: mode === "scheduled" ? dateToBerlinLocal(e.publishedAt) : "",
    isLive: mode === "now",
  };
}

export const EMPTY_LEXIKON: LexikonEditorData = {
  name: "",
  slug: "",
  synonyms: [],
  group: "",
  concern: "UNBEDENKLICH",
  shortDescription: "",
  assessment: "",
  bodyHtml: "",
  headline: "",
  images: Array.from({ length: LEXIKON_IMAGE_SLOTS }, () => ({ url: "", alt: "", caption: "" })),
  faqs: [],
  metaTitle: "",
  metaDescription: "",
  publishMode: "draft",
  scheduledAt: "",
};
