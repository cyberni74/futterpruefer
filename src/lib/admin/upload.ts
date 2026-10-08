import { slugify } from "@/lib/slug";

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const MAX_IMAGE_WIDTH = 1600;
export const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;

/** Prüft das von sharp erkannte Format (AVIF meldet sharp als "heif" mit AV1-Kompression). */
export function isAllowedSharpFormat(format: string | undefined, compression?: string): boolean {
  if (!format) return false;
  if (format === "jpeg" || format === "png" || format === "webp") return true;
  if (format === "heif") return compression === "av1";
  return false;
}

export function randomSuffix(length = 6): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

/** SEO-Dateiname: "royal-canin-mini-adult-x7k2qp.webp" */
export function buildImageFileName(name: string | null | undefined, suffix = randomSuffix()): string {
  const base = slugify(name, 60) || "bild";
  return `${base}-${suffix}.webp`;
}

export function altSuggestion(kind: "review" | "blog", name: string | null | undefined): string {
  const n = (name ?? "").trim().replace(/\s+/g, " ").slice(0, 120);
  if (!n) return "";
  return kind === "blog" ? `Titelbild: ${n}` : `Verpackung von ${n}`;
}
