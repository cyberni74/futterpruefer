import { ratingFor, RATING_LABEL } from "./scoring";
import { misleadingClaims, splitComposition, type Claim } from "./product-data";
import { frameQuote } from "./quotes";
import { REVIEW_EXTRA_FAQ } from "./review-extra-faq";

/**
 * SEO-Fazit, Kurz-gesagt-Box und FAQ für Einzeltests (HANDBUCH: SEO-Pflicht für jeden Test).
 * Alles wird nur aus vorhandenen, geprüften Feldern zusammengesetzt (Punkte, Ampel, Urteil,
 * Pro/Contra, Werbeaussagen, Preis, Zusammensetzung). Keine neuen Aussagen und keine Amazon-Links; die stehen in der CTA-Box des Testtexts (seit 23.10.2026 auch bei Rot).
 */

export const AMPEL_WORD = { gut: "Grün", mittel: "Gelb", schlecht: "Rot" } as const;

export function ampelFor(score: number | null | undefined): string {
  return AMPEL_WORD[ratingFor(score)];
}

const TZ = "Europe/Berlin";
export function monthYear(d: Date | null | undefined): string {
  if (!d || Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric", timeZone: TZ }).format(d);
}
const dayDate = (d: Date | null | undefined) =>
  d && !Number.isNaN(d.getTime()) ? new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: TZ }).format(d) : "";

const eur = (n: number) => n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
const num = (v: unknown) => (v == null || v === "" ? null : Number.isFinite(Number(v)) ? Number(v) : null);
const clean = (s: string | null | undefined) => (s ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const sentence = (s: string) => (/[.!?…“"]$/.test(s) ? s : `${s}.`);

/**
 * Kurzer Produktname für die Fazit-H2: das gepflegte Haupt-Keyword ohne „Test“,
 * sonst der Produktname ohne Packungsangaben nach dem ersten Komma.
 */
export function keywordName(keyword: string | null | undefined, brand: string | null | undefined, fallback: string): string {
  const kw = (keyword ?? "").replace(/\s+(im\s+)?Test(\s+\d{4})?$/i, "").trim();
  const b = (brand ?? "").trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  if (kw && (!b || kw.toLowerCase().includes(b))) return kw;
  return fallback.split(",")[0].trim() || fallback;
}

/** H2 mit Haupt-Keyword „<Produkt> im Test“ plus Monat und Jahr. */
export function seoFazitHeading(name: string, testedAt: Date | null | undefined): string {
  const my = monthYear(testedAt);
  return `Fazit: ${name} im Test${my ? ` ${my}` : ""}`;
}

export type ReviewSeoInput = {
  /** Slug des Tests, nur für Zusatzfragen pro Test (REVIEW_EXTRA_FAQ). */
  slug?: string;
  name: string;
  totalScore: number;
  testedAt: Date | null | undefined;
  verdict?: string | null;
  pros?: string[] | null;
  cons?: string[] | null;
  claims: Claim[];
  price?: unknown;
  packageSize?: string | null;
  pricePerKg?: unknown;
  pricePerDay?: unknown;
  priceDate?: Date | null;
  /** Shop oder Seite, von der der Preis stammt. Leer = keine Quelle nennen. */
  priceSource?: string | null;
  composition?: string | null;
  ergaenzung: boolean;
};

const lowerFirst = (s: string) => s.charAt(0).toLocaleLowerCase("de") + s.slice(1);

/** Erster Satz: beantwortet „Wie schneidet … im Test ab?“ direkt mit Punkten und Ampel. */
export function directAnswer(r: ReviewSeoInput): string {
  const rating = ratingFor(r.totalScore);
  const d = dayDate(r.testedAt);
  const label = RATING_LABEL[rating];
  // „Rot – …“ ist der Name der roten Ampel und bleibt groß. Die anderen Notenwörter stehen im Satz klein.
  const wort = label.startsWith("Rot") ? label : lowerFirst(label);
  return `Wie schneidet ${r.name} im Test ab? Nach unserem Bewertungsschema: ${wort}. ${r.name} erreicht im Test${d ? ` vom ${d}` : ""} ${r.totalScore} von 100 Punkten, Ampel ${AMPEL_WORD[rating]}.`;
}

/** TT.MM.JJJJ in Europe/Berlin. Leer, wenn kein Datum vorliegt. */
export function priceStandDate(d: Date | null | undefined): string {
  return dayDate(d);
}

/**
 * Preis nur mit Datum. Hersteller-Shop mit „im“, sonst „bei“.
 * „Preis bei Amazon, Stand 23.10.2026“, „Preis im Hersteller-Shop, Stand 16.10.2026“, ohne Quelle „Stand 23.10.2026“.
 * Ohne Datum leer: dann darf kein Preis erscheinen.
 */
export function priceCite(source: string | null | undefined, date: string | null | undefined): string {
  const src = source?.trim() ?? "";
  const d = date?.trim() ?? "";
  if (!d) return "";
  if (!src) return `Stand ${d}`;
  const prep = src === "Hersteller-Shop" ? "im" : "bei";
  return `Preis ${prep} ${src}, Stand ${d}`;
}

/** Schlusstext einer datierten Preisangabe. Bei Amazon der Änderungshinweis. */
export function priceNotice(source: string | null | undefined): string {
  return source?.trim() === "Amazon" ? "Preise können sich seitdem geändert haben." : "Preise können je nach Händler abweichen.";
}

/** Preis-FAQ: Herstellerpreis mit Datum statt „je nach Händler“. Datum ist bereits TT.MM.JJJJ. */
function priceFaqNotice(source: string | null | undefined, stand: string): string {
  const src = source?.trim() ?? "";
  if (src === "Hersteller" || src === "Hersteller-Shop") return `laut Hersteller, Stand ${stand}`;
  return priceNotice(source);
}

/**
 * Liest eine ausdrücklich genannte Preisquelle aus dem Testtext.
 * Affiliate-Buttons und bloße Amazon-Erwähnungen zählen nicht.
 */
export function priceSourceFromArticle(html: string | null | undefined): string | null {
  const text = (html ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const bisPreis = "(?:(?!\\.\\s)[\\s\\S]){0,180}?(?:€|Euro)";
  const match = new RegExp(`Im Hersteller-Shop kostet|Bei ([A-Za-zÄÖÜäöüß][\\p{L}\\d.&-]{1,40}) kostet|Auf ([a-z0-9][a-z0-9.-]*\\.[a-z]{2,}) kostet|Amazon nannte\\b${bisPreis}|Amazon-Preis\\b${bisPreis}`, "iu").exec(text);
  if (!match) return null;
  if (match[1]) return match[1];
  if (match[2]) return match[2];
  if (/^Im Hersteller-Shop/i.test(match[0])) return "Hersteller-Shop";
  return "Amazon";
}

function priceText(r: ReviewSeoInput): string {
  const stand = priceStandDate(r.priceDate);
  if (!stand) return "";
  const p = num(r.price), kg = num(r.pricePerKg), day = num(r.pricePerDay);
  const parts: string[] = [];
  if (p != null) parts.push(`${eur(p)}${r.packageSize ? ` für ${r.packageSize}` : ""}`);
  if (kg != null) parts.push(`${eur(kg)} pro Kilogramm`);
  if (day != null) parts.push(`${eur(day)} pro Tagesration`);
  if (!parts.length) return "";
  const cite = priceCite(r.priceSource, stand);
  return `${parts.join(", ")}${cite ? ` (${cite})` : ""}`;
}

const AMAZON_TAG = "cyberni7400-21";

/** ASIN oder Amazon-Produktlink aus den Daten, immer mit Partner-Tag. Sonst null. */
export function amazonPriceUrl(input: { html?: string | null; asin?: string | null; kaufUrl?: string | null }): string | null {
  const asin = (input.asin ?? "").trim().toUpperCase();
  if (/^[A-Z0-9]{10}$/.test(asin)) return `https://www.amazon.de/dp/${asin}?tag=${AMAZON_TAG}`;
  const html = input.html ?? "";
  const hrefs = [input.kaufUrl ?? "", ...[...html.matchAll(/href="([^"]+)"/gi)].map((m) => m[1].replace(/&amp;/g, "&"))];
  for (const href of hrefs) {
    if (!/amazon\./i.test(href)) continue;
    const code = href.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i)?.[1];
    if (code) return `https://www.amazon.de/dp/${code.toUpperCase()}?tag=${AMAZON_TAG}`;
  }
  return null;
}

export function kurzGesagt(r: ReviewSeoInput): string[] {
  const rating = ratingFor(r.totalScore);
  const items = [`${r.totalScore}/100 Punkte, Ampel ${AMPEL_WORD[rating]}: ${RATING_LABEL[rating]}.`];
  const pro = clean(r.pros?.[0]);
  if (pro) items.push(`Pluspunkt: ${sentence(pro)}`);
  const con = clean(r.cons?.[0]);
  if (con) items.push(`Schwachpunkt: ${sentence(con)}`);
  const mis = misleadingClaims(r.claims).length;
  if (mis) items.push(mis === 1 ? "Eine Werbeaussage halten wir für irreführend." : `${mis} Werbeaussagen halten wir für irreführend.`);
  const price = priceText(r);
  if (price) items.push(`Preis: ${price}.${r.priceSource?.trim() === "Amazon" ? ` ${priceNotice(r.priceSource)}` : ""}`);
  return items;
}

export type FaqItem = { question: string; answer: string };

export function reviewFaq(r: ReviewSeoInput, comparison?: { title: string } | null, productInComparison = false): FaqItem[] {
  const rating = ratingFor(r.totalScore);
  const d = dayDate(r.testedAt);
  const out: FaqItem[] = [];
  const verdict = withoutLeadingScore(clean(r.verdict), r.totalScore);
  out.push({
    question: `Wie schneidet ${r.name} im Test ab?`,
    answer: `${r.name} erreicht in unserem Test${d ? ` vom ${d}` : ""} ${r.totalScore} von 100 Punkten, Ampel ${AMPEL_WORD[rating]} (${RATING_LABEL[rating]}).${verdict ? ` ${sentence(verdict)}` : ""}`,
  });
  if (r.slug) out.push(...(REVIEW_EXTRA_FAQ[r.slug] ?? []));
  const pros = (r.pros ?? []).map(clean).filter(Boolean);
  if (pros.length) out.push({ question: `Was spricht für ${r.name}?`, answer: pros.map(sentence).join(" ") });
  const cons = (r.cons ?? []).map(clean).filter(Boolean);
  if (cons.length) out.push({ question: `Was spricht gegen ${r.name}?`, answer: cons.map(sentence).join(" ") });
  const mis = misleadingClaims(r.claims);
  if (mis.length) {
    out.push({
      question: mis.length === 1 ? `Welche Werbeaussage zu ${r.name} halten wir für irreführend?` : `Welche Werbeaussagen zu ${r.name} halten wir für irreführend?`,
      answer: mis.map((c) => `${frameQuote(clean(c.claim))}${clean(c.reason) ? `: ${sentence(clean(c.reason))}` : "."}`).join(" "),
    });
  }
  const stand = priceStandDate(r.priceDate);
  const price = priceText(r);
  if (price && stand) out.push({ question: `Was kostet ${r.name}?`, answer: `${price}. ${priceFaqNotice(r.priceSource, stand)}` });
  const parts = splitComposition(r.composition);
  if (parts.length) {
    const first = parts.slice(0, 5).join(", ");
    out.push({
      question: `Was steht in der Zusammensetzung von ${r.name}?`,
      answer: `Die ersten deklarierten Bestandteile sind: ${first}${parts.length > 5 ? " und weitere" : ""}. Die vollständige Zusammensetzung steht unten in den Produktdaten.`,
    });
  }
  out.push({
    question: `Wie hat Futterprüfer ${r.name} getestet?`,
    answer: `Wir haben ${r.name} nicht im Labor untersucht. Unsere Bewertung beruht auf veröffentlichten Angaben: Produktseite, Deklaration und öffentlich zugängliche Herstellerangaben${d ? ` (Stand ${d})` : ""}. Bewertet wird nach unserem ${r.ergaenzung ? "Bewertungsschema für Ergänzungsfutter" : "rezepturbasierten Bewertungsschema"} mit 100 Punkten: ab 80 Grün, ab 60 Gelb, darunter Rot.`,
  });
  if (comparison) {
    out.push(
      productInComparison
        ? { question: `Gibt es einen Vergleichstest zu ${r.name}?`, answer: `Ja, passend dazu: ${comparison.title}. Der Link steht direkt über diesen Fragen.` }
        : { question: "Gibt es einen Vergleichstest zu ähnlichen Produkten?", answer: `Ja: ${comparison.title}. ${r.name} selbst ist darin nicht enthalten. Der Link steht direkt über diesen Fragen.` },
    );
  }
  return out;
}

/** Überschrift für Body-H2, die mit „Fazit“ beginnen (das einzige Fazit-H2 ist das SEO-Fazit der Vorlage). */
export const BODY_FAZIT_HEADING = "Unser Urteil im Detail";

/**
 * Benennt jede H2 im Body um, deren Text mit „Fazit“ beginnt („Fazit“,
 * „Fazit im Detail“, „Fazit: … im Test (Oktober 2026)“ …), damit die Seite
 * genau ein Fazit-H2 hat: das SEO-Fazit mit Keyword.
 */
export function renameBodyFazit(html: string): string {
  return html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (m, attrs: string, inner: string) => {
    const text = inner.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
    return /^fazit\b/i.test(text) ? `<h2${attrs}>${BODY_FAZIT_HEADING}</h2>` : m;
  });
}

/**
 * Entfernt eine Punktzahl am Anfang des Fazit-Texts („22 von 100 Punkten, Rot
 * (nicht empfehlenswert). …“, „62/100, Gelb. …“), weil die FAQ-Antwort Punkte
 * und Ampel schon nennt. Ein angehängter Zusatz („…, mit Warnsignal Sicherheit.“)
 * bleibt als eigener Satz erhalten.
 */
export function withoutLeadingScore(verdict: string, score: number): string {
  const re = new RegExp(`^${score}\\s*(?:von\\s*100\\s*Punkten|\\/\\s*100(?:\\s*Punkte(?:n)?)?)\\s*,\\s*(?:Ampel\\s+)?(?:Rot|Gelb|Grün)(?:\\s*\\([^)]*\\))?\\s*([.,;])\\s*`, "i");
  const m = verdict.match(re);
  let rest = verdict;
  if (m) {
    rest = verdict.slice(m[0].length).trim();
    if (rest && m[1] !== ".") rest = rest.charAt(0).toLocaleUpperCase("de") + rest.slice(1);
  }
  return withoutTrailingScore(rest, score);
}

/** Entfernt einen Schlusssatz, der nur die Punktzahl wiederholt („… 61 von 100 Punkten, Gelb: …“, „Gesamt: 76/100, mit Abstrichen.“). */
function withoutTrailingScore(verdict: string, score: number): string {
  const re = new RegExp(`(?:^|(?<=[.!?“”")]\\s))\\s*(?:Mit\\s+|Gesamt:\\s*)?${score}\\s*(?:von\\s*100\\b|\\/\\s*100\\b)[^]*$`);
  const m = verdict.match(re);
  if (!m || m.index === undefined || m.index === 0) return verdict;
  if (/[.!?]\s+[A-ZÄÖÜ]/.test(m[0].trim().replace(/[.!?]$/, ""))) return verdict;
  return verdict.slice(0, m.index).trim();
}
