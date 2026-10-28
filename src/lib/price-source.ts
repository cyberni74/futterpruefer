import { Prisma } from "@/generated/prisma/client";
import type { PriceClassKey } from "@/lib/filters";
import { PRICE_CLASS_LABEL } from "@/lib/site";

/**
 * Obergrenze der Kategorie- und Testliste. Beim Preisklassen-Filter gilt sie erst,
 * nachdem Tests ohne Preisquelle ausgesondert sind.
 */
export const REVIEW_LIST_CAP = 120;

export const NO_PRICE_CLASS_LABEL = "keine Angabe";

type PriceSourceReview = {
  pricePerKg?: unknown;
  layoutData?: unknown;
};

/**
 * Ob ein Test eine geprüfte Preisquelle hat.
 * `priceClass` ist in der Datenbank immer gesetzt (Standard MITTEL) und zählt allein nicht.
 *
 * Quelle ist nur:
 * - `pricePerKg`, sobald der Wert gesetzt ist (auch 0), oder
 * - `layoutData.preisrechner.preis` als endliche Zahl ≥ 0.
 *
 * Im V2-Schema (`layoutDataSchema`) ist `preisrechner.preis` das einzige Preisfeld.
 * Es gibt kein eigenes Feld `preis` oder `kosten`. Kennzahlen, Kapiteltexte und
 * fehlende, leere oder ungültige Felder sind keine Quelle. Klassische Tests ohne
 * `layoutData` mit gesetztem `pricePerKg` bleiben damit unverändert.
 */
export function hasPriceSource(review: PriceSourceReview): boolean {
  return pricePerKgIsSet(review.pricePerKg) || layoutPreisIsSet(review.layoutData);
}

/** Prisma-Vorauswahl: Preisklasse und mindestens ein Feld, das eine Preisquelle tragen kann. */
export function priceClassCandidateWhere(preis: PriceClassKey): Prisma.ReviewWhereInput {
  return {
    priceClass: preis,
    OR: [
      { pricePerKg: { not: null } },
      { layoutData: { not: Prisma.AnyNull } },
    ],
  };
}

/**
 * Nach der Abfrage: nur Tests mit Preisquelle, höchstens {@link REVIEW_LIST_CAP}.
 * Ein JSON-Filter auf `preisrechner.preis` bildet „fehlend oder leer“ nicht zuverlässig ab
 * (Postgres vergleicht JSON-Typen untereinander, ein Cast auf numeric bricht die Abfrage,
 * sobald dort keine Zahl steht). Deshalb prüft `hasPriceSource` und das Limit gilt danach.
 */
export function reviewsMatchingPriceFilter<T extends PriceSourceReview>(rows: T[]): T[] {
  return rows.filter(hasPriceSource).slice(0, REVIEW_LIST_CAP);
}

/** Zelle „Preisklasse“ im Vergleich. Ohne Quelle: „keine Angabe“, sonst Klasse und ggf. €/kg. */
export function priceClassCell(review: PriceSourceReview & { priceClass: keyof typeof PRICE_CLASS_LABEL }): string {
  if (!hasPriceSource(review)) return NO_PRICE_CLASS_LABEL;
  const label = PRICE_CLASS_LABEL[review.priceClass];
  const kg = pricePerKgEuros(review.pricePerKg);
  if (kg == null) return label;
  return `${label} · ${kg.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}/kg`;
}

/** Überschrift des Preisblocks auf der klassischen Testseite. */
export function priceSectionTitle(review: PriceSourceReview & { priceClass?: keyof typeof PRICE_CLASS_LABEL | null }): string {
  if (!review.priceClass || !hasPriceSource(review)) return "Preis";
  return `Preis · Preisklasse ${PRICE_CLASS_LABEL[review.priceClass]}`;
}

function pricePerKgIsSet(value: unknown): boolean {
  return pricePerKgEuros(value) != null;
}

/** Gesetzter Kilopreis, einschließlich 0. Leere Zeichenketten und Nicht-Zahlen zählen nicht. */
function pricePerKgEuros(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "bigint") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  if (typeof value === "string") return parseEuro(value);
  if (typeof value === "object") return parseEuro(String(value));
  return null;
}

function parseEuro(raw: string): number | null {
  const text = raw.trim();
  if (!text || text === "[object Object]") return null;
  const n = Number(text.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

/**
 * `preisrechner.preis` aus layoutData. Nur eine endliche Zahl ≥ 0, wie im Schema
 * (`z.number().min(0)`). Strings, null und fehlende Schlüssel sind leer.
 */
function layoutPreisIsSet(layoutData: unknown): boolean {
  if (!layoutData || typeof layoutData !== "object" || Array.isArray(layoutData)) return false;
  const rechner = (layoutData as { preisrechner?: unknown }).preisrechner;
  if (!rechner || typeof rechner !== "object" || Array.isArray(rechner)) return false;
  const preis = (rechner as { preis?: unknown }).preis;
  return typeof preis === "number" && Number.isFinite(preis) && preis >= 0;
}
