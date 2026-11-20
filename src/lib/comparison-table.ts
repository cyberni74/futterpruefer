import { AMAZON_TAG } from "@/components/testvorlage-v2/schema";
import { isMethodikV1, noteFuerPunkte, ratingFor, type Rating } from "@/lib/scoring";
import { AMPEL_WORD, amazonPriceUrl } from "@/lib/review-seo";
import { productLabel } from "@/lib/seo";

export const COMPARISON_AMAZON_REL = "sponsored nofollow noopener";

export type ComparisonTableRow = {
  name: string;
  href: string;
  score: number;
  methodikVersion?: string | null;
  /** Nur setzen, wenn die Dosis je kg im Test belegt ist. */
  dosePerKgLabel?: string | null;
  /** Nur setzen, wenn der Preis pro Tagesdosis im Test belegt ist. */
  pricePerDay?: number | null;
  /** Amazon-URL bereits mit Partner-Tag – die Komponente zeigt sie nur bei Grün/Gelb. */
  amazonUrl?: string | null;
  place?: number;
  /** Teamwertung außerhalb der Methodik; Kennzeichnung in der Namensspalte und Fußnote. */
  teamWertung?: boolean;
};

/** A1: Fußnote unter Tabellen mit Methodik-Version-1-Zeilen. */
export const METHODIK_V1_NOTE_FOOTNOTE =
  "Note ‚–‘: Test nach Methodik Version 1 (Bewertungsstand 27.10.2026); dafür vergeben wir keine Note. Maßgeblich ist die Testseite.";

/** A2: Fußnote unter Tabellen mit einer Teamwertung (Wortlaut der Rechtsprüfung). */
export const TEAMWERTUNG_FOOTNOTE =
  "Teamwertung: Gesamtwertung nach Entscheidung des Herausgebers, außerhalb unserer Methodik für Ergänzungsfutter. Nach der Methodik ergäben sich 28 von 100 Punkten; Einzelheiten auf der Testseite und auf der Methodik-Seite.";

export const TEAMWERTUNG_LABEL = "Teamwertung";

/** A4: Fußnote unter Hub-Tabellen mit Spalte „Preis / Tag“. */
export const PRICE_PER_DAY_FOOTNOTE =
  "Preis / Tag: Tagesdosis für einen Hund mit 10 kg, berechnet zum Preisstand des jeweiligen Tests; heutige Preise können abweichen.";

const TEAMWERTUNG_SLUGS = new Set(["medidog-haut-und-fellglueck-paste"]);

export function isTeamWertungSlug(slug: string): boolean {
  return TEAMWERTUNG_SLUGS.has(slug);
}

export function productNameWithTeamWertung(name: string, teamWertung?: boolean): string {
  if (!teamWertung) return name;
  const suffix = ` (${TEAMWERTUNG_LABEL})`;
  return name.endsWith(suffix) ? name : `${name}${suffix}`;
}

/** A1: Tests nach Methodik Version 1 zeigen in der Noten-Spalte „–“, keine Note V3. */
export function rowNoteLabel(row: Pick<ComparisonTableRow, "score" | "methodikVersion">): string {
  if (isMethodikV1(row.methodikVersion)) return "–";
  return formatNote(rowNote(row));
}

export function rowIsMethodikV1(row: Pick<ComparisonTableRow, "methodikVersion">): boolean {
  return isMethodikV1(row.methodikVersion);
}

export function formatNote(note: number): string {
  return new Intl.NumberFormat("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(note);
}

export function formatEuro(value: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
}

export function formatMg(value: number): string {
  const n = Math.round(value * 100) / 100;
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: n % 1 === 0 ? 0 : 2 }).format(n);
}

export function rowRating(row: Pick<ComparisonTableRow, "score" | "methodikVersion">): Rating {
  return ratingFor(row.score, row.methodikVersion);
}

export function rowNote(row: Pick<ComparisonTableRow, "score">): number {
  return noteFuerPunkte(row.score);
}

export function rowAmpelWord(row: Pick<ComparisonTableRow, "score" | "methodikVersion">): string {
  return AMPEL_WORD[rowRating(row)];
}

/** Partner-CTA nur bei Grün oder Gelb. Rot bekommt in der Tabelle keinen Amazon-Button. */
export function rowAmazonCtaUrl(row: ComparisonTableRow): string | null {
  if (rowRating(row) === "schlecht") return null;
  const url = (row.amazonUrl ?? "").trim();
  if (!url) return null;
  if (!/amazon\./i.test(url)) return null;
  const tagged = amazonPriceUrl({ kaufUrl: url, html: "", asin: null });
  return tagged;
}

export function affiliateAmazonUrl(asin: string): string {
  return `https://www.amazon.de/dp/${asin.toUpperCase()}?tag=${AMAZON_TAG}`;
}

/**
 * Dosis je kg nur aus belegter Tagesmenge.
 * Konvention der Methodik: Tagesdosis gilt für einen Hund mit 10 kg, daher mg/kg = Menge / 10.
 */
export function dosePerKgLabel(
  wirkstoffe: { name: string; mengeMgProTagesdosis: number | null }[],
): string | null {
  const hit = wirkstoffe.find((w) => w.mengeMgProTagesdosis != null && w.mengeMgProTagesdosis > 0 && w.name.trim());
  if (!hit || hit.mengeMgProTagesdosis == null) return null;
  return `${hit.name.trim()} ${formatMg(hit.mengeMgProTagesdosis / 10)} mg/kg`;
}

export function documentedPricePerDay(values: Array<number | null | undefined>): number | null {
  for (const value of values) {
    if (value == null) continue;
    const n = Number(value);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

export type HubPurposeId =
  | "gelenke"
  | "haut_fell_oel"
  | "kotfressen"
  | "verdauung"
  | "zaehne"
  | "nerven"
  | "snacks_kauartikel"
  | "weitere";

const KAUARTIKEL_SLUGS = new Set([
  "tierliebhaber-hirschohren-mit-fell",
  "tierliebhaber-rinderkopfhautplatte",
  "tierliebhaber-lammkopfhaut",
  "tierliebhaber-rinderohren-mit-fell",
]);

/** Feste Zuordnung vor den Heuristiken, damit Fell-Kauartikel nicht unter Haut & Fell landen. */
const PURPOSE_SLUG_OVERRIDES: Record<string, HubPurposeId> = {
  "hundpur-z-protect-hund-test": "weitere",
  "held-hilde-zz-stop-snacks-hund-test": "weitere",
  "hundpur-aller-immun-hund-test": "weitere",
};

const PURPOSE_RULES: Array<{ id: HubPurposeId; pattern: RegExp }> = [
  { id: "kotfressen", pattern: /kotfresser|gras-kot/i },
  { id: "gelenke", pattern: /gelenk|gruenlipp|grünlipp|glucosamin|chondroitin|huefte|hüfte|hips|baender|bänder|\bgag\b/i },
  { id: "zaehne", pattern: /zahn|dental|plaque|dentastix|greenies|zahnpflege|zahnfee|z-pulver|z-snack|zahnbuerste|smile|fresh-clean/i },
  { id: "verdauung", pattern: /darm|magen|probiot|verdauung|ulmenrinde|lucky-belly|canikur|reconvales|prae-probio|ipakitine/i },
  { id: "haut_fell_oel", pattern: /lachs(oe|ö)l|haut-und-fell|haut_und_fell|fellglueck|fellglück|bierhefe|aller-immune|omega/i },
  { id: "nerven", pattern: /chill|relax|nerven|bach|rescura|calm|stress|cannabiu/i },
  { id: "snacks_kauartikel", pattern: /ohren|kopfhaut|snackie|goodie|haehnchen|g-snack|w-snack|filet|smoothie|nassbarf|singlefleisch|huehnersuppe/i },
];

export function purposeForReview(input: { slug: string; title?: string | null; productName?: string | null; keyword?: string | null }): HubPurposeId {
  if (KAUARTIKEL_SLUGS.has(input.slug) || PURPOSE_SLUG_OVERRIDES[input.slug] === "snacks_kauartikel") {
    return "snacks_kauartikel";
  }
  const override = PURPOSE_SLUG_OVERRIDES[input.slug];
  if (override) return override;
  const text = `${input.slug} ${input.title ?? ""} ${input.productName ?? ""} ${input.keyword ?? ""}`;
  for (const rule of PURPOSE_RULES) {
    if (rule.pattern.test(text) || rule.pattern.test(input.slug)) return rule.id;
  }
  return "weitere";
}

export const HUB_PURPOSE_ORDER: HubPurposeId[] = [
  "gelenke",
  "haut_fell_oel",
  "kotfressen",
  "verdauung",
  "zaehne",
  "nerven",
  "snacks_kauartikel",
  "weitere",
];

export type PublishedComparisonId = "gelenktabletten-hund-vergleich" | "lachsoel-hund-vergleich";

/**
 * Ergebnisse der bereits veröffentlichten Vergleichstests.
 * Diese Produkte haben (Stand 20.11.2026) oft noch keine eigene Review-Zeile;
 * die Zahlen stammen aus dem veröffentlichten Vergleich, nicht aus einer neuen Prüfung.
 */
export const PUBLISHED_COMPARISON_ROWS: Record<PublishedComparisonId, ComparisonTableRow[]> = {
  "gelenktabletten-hund-vergleich": [
    {
      place: 1,
      name: "Cadoc Grünlippmuschel Pulver",
      href: "/blog/gelenktabletten-hund-vergleich#platz-1",
      score: 59,
      dosePerKgLabel: "Grünlippmuschel 150 mg/kg",
      pricePerDay: 0.05,
      amazonUrl: affiliateAmazonUrl("B07Z669DGV"),
    },
    {
      place: 2,
      name: "Collagile Dog",
      href: "/blog/gelenktabletten-hund-vergleich#platz-2",
      score: 50,
      dosePerKgLabel: "Kollagenpeptide 700 mg/kg",
      pricePerDay: 0.74,
    },
    {
      place: 3,
      name: "NutriLabs Canicox-HD",
      href: "/blog/gelenktabletten-hund-vergleich#platz-3",
      score: 41,
      dosePerKgLabel: "Glucosamin ca. 31 mg/kg",
      pricePerDay: 0.42,
    },
    {
      place: 4,
      name: "Natureflow Gelenktabletten",
      href: "/blog/gelenktabletten-hund-vergleich#platz-4",
      score: 28,
      dosePerKgLabel: "Muschelmehl 15 mg/kg (ohne Referenz)",
      pricePerDay: 0.15,
    },
  ],
  "lachsoel-hund-vergleich": [
    {
      place: 1,
      name: "Scheidler horse-direkt Lachsöl",
      href: "/blog/lachsoel-hund-vergleich#platz-1",
      score: 52,
      dosePerKgLabel: "EPA + DHA 31,3 mg/kg",
      pricePerDay: 0.05,
      amazonUrl: affiliateAmazonUrl("B00DDNWJ1Y"),
    },
    {
      place: 2,
      name: "ReaVET Lachsöl",
      href: "/blog/lachsoel-hund-vergleich#platz-2",
      score: 45,
      dosePerKgLabel: "EPA + DHA 31,5 mg/kg",
      pricePerDay: 0.09,
    },
    {
      place: 3,
      name: "AniForte Lachsöl",
      href: "/blog/lachsoel-hund-vergleich#platz-3",
      score: 40,
      dosePerKgLabel: "EPA + DHA 32,6 mg/kg",
      pricePerDay: 0.08,
    },
    {
      place: 4,
      name: "Pets Nature Lachsöl",
      href: "/blog/lachsoel-hund-vergleich#platz-4",
      score: 39,
      pricePerDay: 0.09,
    },
    {
      place: 5,
      name: "DIBO Lachsöl",
      href: "/blog/lachsoel-hund-vergleich#platz-5",
      score: 35,
      pricePerDay: 0.12,
    },
  ],
};

export function publishedComparisonRows(id: PublishedComparisonId): ComparisonTableRow[] {
  return PUBLISHED_COMPARISON_ROWS[id].map((row) => ({ ...row }));
}

export function splitFirstVtTable(html: string): { before: string; after: string } | null {
  const match = html.match(/<table\s+[^>]*class="[^"]*\bvt-table\b[^"]*"[^>]*>[\s\S]*?<\/table>/i);
  if (!match || match.index == null) return null;
  return { before: html.slice(0, match.index), after: html.slice(match.index + match[0].length) };
}

export function comparisonIdForBlogSlug(slug: string): PublishedComparisonId | null {
  if (slug === "gelenktabletten-hund-vergleich" || slug === "gelenk-test-hund-oktober-2026") return "gelenktabletten-hund-vergleich";
  if (slug === "lachsoel-hund-vergleich" || slug === "lachsoel-test-hund-oktober-2026") return "lachsoel-hund-vergleich";
  return null;
}


export type ReviewForComparisonRow = {
  slug: string;
  title: string;
  brand: string;
  productName: string;
  totalScore: number;
  methodikVersion?: string | null;
  category: { slug: string };
  pricePerDay?: unknown;
  efPreisTagesdosisEur?: unknown;
  bodyHtml?: string | null;
  layoutData?: unknown;
  wirkstoffe?: { name: string; mengeMgProTagesdosis: unknown }[];
};

function layoutAsin(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const asin = String((data as { asin?: unknown }).asin ?? "").trim().toUpperCase();
  return /^[A-Z0-9]{10}$/.test(asin) ? asin : null;
}

function layoutKaufUrl(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const url = String((data as { kaufUrl?: unknown }).kaufUrl ?? "").trim();
  return url || null;
}

function decimalNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function reviewToComparisonRow(review: ReviewForComparisonRow): ComparisonTableRow {
  const wirkstoffe = (review.wirkstoffe ?? []).map((w) => ({
    name: w.name,
    mengeMgProTagesdosis: decimalNumber(w.mengeMgProTagesdosis),
  }));
  return {
    name: productLabel(review.brand, review.productName) || review.title,
    href: `/${review.category.slug}/${review.slug}`,
    score: Number(review.totalScore) || 0,
    methodikVersion: review.methodikVersion ?? null,
    dosePerKgLabel: dosePerKgLabel(wirkstoffe),
    pricePerDay: documentedPricePerDay([decimalNumber(review.efPreisTagesdosisEur), decimalNumber(review.pricePerDay)]),
    amazonUrl: amazonPriceUrl({
      asin: layoutAsin(review.layoutData),
      kaufUrl: layoutKaufUrl(review.layoutData),
      html: review.bodyHtml ?? "",
    }),
    teamWertung: isTeamWertungSlug(review.slug),
  };
}
