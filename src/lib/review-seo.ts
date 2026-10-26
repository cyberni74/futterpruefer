import { ratingFor, RATING_LABEL } from "./scoring";
import { misleadingClaims, splitComposition, type Claim } from "./product-data";
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
  composition?: string | null;
  ergaenzung: boolean;
};

const lowerFirst = (s: string) => s.charAt(0).toLocaleLowerCase("de") + s.slice(1);

/** Erster Satz: beantwortet „Lohnt sich …?“ direkt mit Punkten und Ampel. */
export function directAnswer(r: ReviewSeoInput): string {
  const rating = ratingFor(r.totalScore);
  const d = dayDate(r.testedAt);
  return `Lohnt sich ${r.name}? Nach unserem Bewertungsschema: ${lowerFirst(RATING_LABEL[rating])}. ${r.name} erreicht im Test${d ? ` vom ${d}` : ""} ${r.totalScore} von 100 Punkten, Ampel ${AMPEL_WORD[rating]}.`;
}

function priceText(r: ReviewSeoInput): string {
  const p = num(r.price), kg = num(r.pricePerKg), day = num(r.pricePerDay);
  const parts: string[] = [];
  if (p != null) parts.push(`${eur(p)}${r.packageSize ? ` für ${r.packageSize}` : ""}`);
  if (kg != null) parts.push(`${eur(kg)} pro Kilogramm`);
  if (day != null) parts.push(`${eur(day)} pro Tagesration`);
  if (!parts.length) return "";
  const d = dayDate(r.priceDate);
  return `${parts.join(", ")}${d ? ` (Preisstand ${d})` : ""}`;
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
  if (price) items.push(`Preis: ${price}.`);
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
      answer: mis.map((c) => `„${clean(c.claim)}“${clean(c.reason) ? `: ${sentence(clean(c.reason))}` : "."}`).join(" "),
    });
  }
  const price = priceText(r);
  if (price) out.push({ question: `Was kostet ${r.name}?`, answer: `${price}. Preise können je nach Händler abweichen.` });
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
