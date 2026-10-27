import { z } from "zod";
import { slugify } from "@/lib/slug";

/** Wert von Review.layout, der die feste Testvorlage aktiviert. */
export const TESTVORLAGE_V2 = "TESTVORLAGE_V2";
export const AMAZON_TAG = "cyberni7400-21";

const kurz = z.string().trim().max(300);
const lang = z.string().max(20000);
const httpUrl = z.string().trim().url().refine((u) => /^https?:\/\//i.test(u), "nur http(s)");

/** Strukturierte Abschnitte, die ein Kapitel nach seinem Text einbinden kann; sonst folgen sie automatisch in dieser Reihenfolge. */
export const BLOCK_TYPEN = ["zutaten", "analyse", "evidenz", "herstellerangaben", "preisrechner", "sicherheit", "proscons"] as const;
export type BlockTyp = (typeof BLOCK_TYPEN)[number];

export const EINHEITEN = { STUECK: "Stück", GRAMM: "g", KILOGRAMM: "kg" } as const;
export type Einheit = keyof typeof EINHEITEN;

const kriterium = z
  .object({
    name: kurz.min(1),
    punkte: z.number().int().min(0),
    max: z.number().int().positive(),
    /** Kurzbewertung unter dem Tacho */
    kurz: z.string().trim().max(400).optional(),
    /** ausführliche Begründung (aufklappbar) */
    begruendung: z.string().max(4000).optional(),
  })
  .refine((k) => k.punkte <= k.max, { message: "punkte darf max nicht übersteigen" });

/** Alle Blöcke sind optional, fehlende Blöcke werden nicht gerendert. Unbekannte Schlüssel werden verworfen. */
export const layoutDataSchema = z.object({
  hero: z
    .object({
      titel: kurz.optional(),
      untertitel: z.string().max(2000).optional(),
      tags: z.array(kurz).max(12).optional(),
      gesamturteil: z.string().max(2000).optional(),
      /** Notenwort unter dem Haupttacho (Standard: Ampel-Label der Seite) */
      notenwort: kurz.optional(),
    })
    .optional(),
  /** drei oder vier kompakte Karten; fehlende Werte werden nicht erfunden, die Karte entfällt */
  kennzahlen: z.array(z.object({ wert: kurz.min(1), label: kurz, sub: kurz.optional() })).max(4).optional(),
  urteil: z.object({ titel: kurz.optional(), intro: z.string().max(4000).optional(), hervorhebung: kurz.optional() }).optional(),
  kriterien: z.array(kriterium).max(12).optional(),
  kapitel: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9][a-z0-9-]{0,60}$/, "id: nur a–z, 0–9 und Bindestrich").optional(),
        titel: kurz.min(1),
        html: lang.optional(),
        block: z.enum(BLOCK_TYPEN).optional(),
      }),
    )
    .max(30)
    .optional(),
  zutaten: z.array(z.object({ name: kurz.min(1), menge: kurz.optional(), funktion: z.string().max(2000).optional(), bewertung: z.string().max(2000).optional() })).max(60).optional(),
  analysewerte: z.array(z.object({ name: kurz.min(1), wert: kurz, hinweis: z.string().max(500).optional() })).max(40).optional(),
  dosierung: z.object({ kopf: z.tuple([kurz, kurz]).optional(), zeilen: z.array(z.object({ label: kurz.min(1), wert: kurz })).max(30) }).optional(),
  evidenz: z.array(z.object({ aussage: kurz.min(1), status: z.enum(["BELEGT", "PLAUSIBEL", "NICHT_VERIFIZIERT"]), quelle: z.string().max(1000).optional() })).max(30).optional(),
  herstellerangaben: z.array(z.object({ label: kurz.min(1), prozent: z.number().min(0).max(100) })).max(20).optional(),
  preisrechner: z
    .object({
      preis: z.number().min(0).max(100000),
      /** Inhalt einer Packung in der gewählten Einheit */
      inhalt: z.number().positive().max(1000000),
      einheit: z.enum(["STUECK", "GRAMM", "KILOGRAMM"]),
      /** Tagesdosis je kg Körpergewicht, in derselben Einheit wie der Inhalt */
      dosisProKg: z.number().positive().max(100000),
      koerpergewicht: z.number().positive().max(200).default(10),
      tage: z.number().int().positive().max(3650).default(30),
      tageOptionen: z.array(z.number().int().positive().max(3650)).max(12).optional(),
      hinweis: z.string().max(1000).optional(),
    })
    .optional(),
  sicherheit: z.object({ stufe: z.enum(["OK", "HINWEIS", "KRITISCH"]).default("OK"), titel: kurz.optional(), text: z.string().max(4000) }).optional(),
  pros: z.array(kurz.min(1)).max(12).optional(),
  cons: z.array(kurz.min(1)).max(12).optional(),
  /** Fazit im Stil der Redaktion (Rich-Text, wird bereinigt) */
  fazit: z.object({ titel: kurz.optional(), html: lang }).optional(),
  faq: z.array(z.object({ frage: kurz.min(1), antwort: z.string().trim().min(1).max(4000) })).max(40).optional(),
  quellen: z.array(z.object({ titel: kurz.min(1), doi: kurz.optional(), url: httpUrl.optional(), hinweis: z.string().max(1000).optional() })).max(60).optional(),
  pruefstand: z.string().max(2000).optional(),
  methodikHinweis: z.string().max(2000).optional(),
  /** Amazon-ASIN: daraus entsteht der Kauflink mit Partner-Tag */
  asin: z.string().trim().toUpperCase().regex(/^[A-Z0-9]{10}$/, "ASIN: 10 Zeichen (A–Z, 0–9)").optional(),
  /** Alternative zur ASIN: fertiger Link, muss das Partner-Tag tragen */
  kaufUrl: httpUrl.optional(),
  kaufLabel: kurz.optional(),
  bildnachweis: z.string().max(500).optional(),
  /** Slugs veröffentlichter Tests für „Ähnliche Tests“ */
  aehnlicheTests: z.array(z.string().trim().regex(/^[a-z0-9][a-z0-9-]*$/)).max(6).optional(),
  /** Eigene Abschnittsüberschriften je Block */
  abschnittTitel: z.record(z.string(), kurz).optional(),
});

export type LayoutData = z.infer<typeof layoutDataSchema>;
export type LayoutInput = z.input<typeof layoutDataSchema>;

export type LayoutResult = { ok: true; data: LayoutData } | { ok: false; error: string };

export function parseLayoutData(raw: unknown): LayoutResult {
  const r = layoutDataSchema.safeParse(raw);
  if (r.success) return { ok: true, data: r.data };
  return { ok: false, error: r.error.issues.slice(0, 5).map((i) => `${i.path.join(".") || "layoutData"}: ${i.message}`).join("; ") };
}

/** Summe der Kriterien-Punkte = Gesamtwertung. */
export const summeKriterien = (data: LayoutData): number => (data.kriterien ?? []).reduce((s, k) => s + k.punkte, 0);

/** Kauflink aus ASIN (oder kaufUrl). Ohne beides null, dann gibt es keinen Button. */
export function kaufLink(data: Pick<LayoutData, "asin" | "kaufUrl">): string | null {
  if (data.asin) return `https://www.amazon.de/dp/${data.asin}?tag=${AMAZON_TAG}`;
  return data.kaufUrl ?? null;
}

export type Bewertungsart = "ALLEINFUTTER" | "ERGAENZUNGSFUTTER";
export const KRITERIEN_ANZAHL: Record<Bewertungsart, number> = { ERGAENZUNGSFUTTER: 5, ALLEINFUTTER: 6 };
/** Vorauswahl der Kriterien-Maxima */
export const KRITERIEN_VORLAGE: Record<Bewertungsart, number[]> = { ERGAENZUNGSFUTTER: [20, 30, 20, 15, 15], ALLEINFUTTER: [30, 20, 20, 15, 10, 5] };

export type Issue = { path: string; message: string };

/**
 * Prüfung gegen die Gesamtwertung: ergibt sich aus der Summe der Kriterien. Weicht totalScore ab, ist die Vorlage ungültig.
 * Ohne Kriterien gibt es nichts zu prüfen.
 */
export function pruefeSumme(data: LayoutData, totalScore: number): Issue | null {
  if (!data.kriterien?.length) return null;
  const summe = summeKriterien(data);
  return summe === totalScore ? null : { path: "kriterien", message: `Die Summe der Kriterien (${summe}) weicht von der Gesamtwertung (${totalScore}) ab.` };
}

/** Aktive Vorlage nur bei passendem layout-Wert UND gültigen Daten (inkl. Summenprüfung); sonst null → bisheriges Layout, Fehler im Log. */
export function resolveLayout(review: { slug?: string; layout?: string | null; layoutData?: unknown; totalScore: number }): LayoutData | null {
  if (review.layout !== TESTVORLAGE_V2) return null;
  const r = parseLayoutData(review.layoutData);
  const where = review.slug ? ` (${review.slug})` : "";
  if (!r.ok) {
    console.error(`Testvorlage V2: layoutData ungültig${where}, bisheriges Layout wird verwendet. ${r.error}`);
    return null;
  }
  const summe = pruefeSumme(r.data, review.totalScore);
  if (summe) {
    console.error(`Testvorlage V2: ${summe.message}${where} Bisheriges Layout wird verwendet.`);
    return null;
  }
  return r.data;
}

/** FAQ für Anzeige und FAQPage-JSON-LD aus derselben Quelle (1:1). */
export function faqItems(data: LayoutData): { question: string; answer: string }[] {
  return (data.faq ?? []).map((f) => ({ question: f.frage.trim(), answer: f.antwort.trim() })).filter((f) => f.question && f.answer);
}

// ---------------------------------------------------------------------------
// Abschnitte und Nummerierung
// ---------------------------------------------------------------------------

export type Abschnitt =
  | { id: string; nummer: number; titel: string; art: "urteil" }
  | { id: string; nummer: number; titel: string; art: "kapitel"; index: number }
  | { id: string; nummer: number; titel: string; art: "block"; block: BlockTyp }
  | { id: string; nummer: number; titel: string; art: "fazit" | "faq" | "quellen" };

export const BLOCK_TITEL: Record<BlockTyp, string> = {
  zutaten: "Inhaltsstoffe im Detail",
  analyse: "Nährwerte und Dosierung",
  evidenz: "Wissenschaftliche Evidenz",
  herstellerangaben: "Herstellerangaben im Check",
  preisrechner: "Kosten und Preisrechner",
  sicherheit: "Sicherheit",
  proscons: "Vor- und Nachteile",
};

export function blockHatDaten(b: BlockTyp, d: LayoutData): boolean {
  switch (b) {
    case "zutaten": return Boolean(d.zutaten?.length);
    case "analyse": return Boolean(d.analysewerte?.length || d.dosierung?.zeilen.length);
    case "evidenz": return Boolean(d.evidenz?.length);
    case "herstellerangaben": return Boolean(d.herstellerangaben?.length);
    case "preisrechner": return Boolean(d.preisrechner);
    case "sicherheit": return Boolean(d.sicherheit?.text.trim());
    case "proscons": return Boolean(d.pros?.length || d.cons?.length);
  }
}

export function hatQuellenAbschnitt(d: LayoutData): boolean {
  return Boolean(d.quellen?.length || d.pruefstand || d.methodikHinweis || kaufLink(d));
}

/** Reihenfolge, Nummern und IDs aller Abschnitte. Kapitel zuerst (mit ihrem optionalen Block), dann nicht eingebundene Blöcke, Fazit, FAQ, Quellen. */
export function baueAbschnitte(d: LayoutData): Abschnitt[] {
  const out: Abschnitt[] = [];
  const ids = new Set<string>();
  const frei = (wunsch: string) => {
    let id = wunsch || "kapitel";
    let n = 2;
    while (ids.has(id)) id = `${wunsch}-${n++}`;
    ids.add(id);
    return id;
  };
  let nummer = 0;
  if (d.kriterien?.length || d.urteil) out.push({ id: frei("urteil"), nummer: ++nummer, titel: d.urteil?.titel || "Das Urteil im Überblick", art: "urteil" });
  const eingebunden = new Set<BlockTyp>();
  (d.kapitel ?? []).forEach((k, index) => {
    if (k.block && blockHatDaten(k.block, d)) eingebunden.add(k.block);
    out.push({ id: frei(k.id || slugify(k.titel, 50)), nummer: ++nummer, titel: k.titel, art: "kapitel", index });
  });
  for (const b of BLOCK_TYPEN) {
    if (eingebunden.has(b) || !blockHatDaten(b, d)) continue;
    out.push({ id: frei(b === "proscons" ? "vor-und-nachteile" : b), nummer: ++nummer, titel: d.abschnittTitel?.[b] || BLOCK_TITEL[b], art: "block", block: b });
  }
  if (d.fazit?.html.trim()) out.push({ id: frei("fazit"), nummer: ++nummer, titel: d.fazit.titel || "Fazit", art: "fazit" });
  if (d.faq?.length) out.push({ id: frei("haeufige-fragen"), nummer: ++nummer, titel: "Häufige Fragen", art: "faq" });
  if (hatQuellenAbschnitt(d)) out.push({ id: frei("quellen"), nummer: ++nummer, titel: "Quellen und Prüfstand", art: "quellen" });
  return out;
}

// ---------------------------------------------------------------------------
// Prüfung vor dem Veröffentlichen
// ---------------------------------------------------------------------------

/** Sperrliste: „unabhängig“ nur in Bezug auf uns (Futterprüfer, wir, uns, unsere). */
const SPERR_IMMER = /unzulässig|zulässig|rechtlich angreifbar|betrug/i;
const SPERR_UNABHAENGIG = /(\bwir\b|\buns\b|\bunsere[rnms]?\b|futterprüfer)[^.!?\n]{0,80}unabhängig|unabhängig[^.!?\n]{0,80}(\bwir\b|\buns\b|\bunsere[rnms]?\b|futterprüfer)/i;

export function sperrwoerter(text: string): string[] {
  const plain = text.replace(/<[^>]*>/g, " ");
  const hits: string[] = [];
  const m = SPERR_IMMER.exec(plain);
  if (m) hits.push(m[0].toLowerCase());
  if (SPERR_UNABHAENGIG.test(plain)) hits.push("unabhängig (in Bezug auf uns)");
  return hits;
}

/** Alle Texte in layoutData (Strings), mit Pfad. */
export function alleTexte(value: unknown, path = "layoutData"): Array<{ path: string; text: string }> {
  if (typeof value === "string") return [{ path, text: value }];
  if (Array.isArray(value)) return value.flatMap((v, i) => alleTexte(v, `${path}[${i}]`));
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => alleTexte(v, `${path}.${k}`));
  return [];
}

/**
 * Pflichtprüfung für „Veröffentlicht“: Pflichtfelder, Summe, Amazon-Tag, Sperrliste.
 * totalScore ist die aus den Kriterien berechnete Gesamtwertung.
 */
export function pruefeVorVeroeffentlichung(data: LayoutData, ctx: { bewertungsart: Bewertungsart; totalScore: number }): Issue[] {
  const issues: Issue[] = [];
  const need = (ok: unknown, path: string, message: string) => { if (!ok) issues.push({ path, message }); };
  need(data.hero?.titel?.trim(), "hero.titel", "Hero: Titel fehlt.");
  need(data.hero?.untertitel?.trim(), "hero.untertitel", "Hero: Untertitel fehlt.");
  need(data.hero?.gesamturteil?.trim(), "hero.gesamturteil", "Hero: Gesamturteil-Text fehlt.");
  const soll = KRITERIEN_ANZAHL[ctx.bewertungsart];
  if ((data.kriterien?.length ?? 0) !== soll) issues.push({ path: "kriterien", message: `${ctx.bewertungsart === "ERGAENZUNGSFUTTER" ? "Ergänzungsfutter" : "Alleinfutter"} braucht genau ${soll} Kriterien (aktuell ${data.kriterien?.length ?? 0}).` });
  const summe = pruefeSumme(data, ctx.totalScore);
  if (summe) issues.push(summe);
  need(data.kapitel?.some((k) => k.titel.trim() && (k.html ?? "").replace(/<[^>]*>/g, "").trim()), "kapitel", "Mindestens ein Kapitel mit Überschrift und Text.");
  need(data.pros && data.pros.length >= 2, "pros", "Mindestens 2 Vorteile.");
  need(data.cons && data.cons.length >= 2, "cons", "Mindestens 2 Nachteile.");
  need(data.fazit?.html.replace(/<[^>]*>/g, "").trim(), "fazit", "Fazit fehlt.");
  need(data.faq?.length, "faq", "Mindestens eine FAQ-Frage.");
  need(data.quellen?.length, "quellen", "Mindestens eine Quelle.");
  if (data.kaufUrl && !data.asin) {
    let tag = "";
    try { tag = new URL(data.kaufUrl).searchParams.get("tag") ?? ""; } catch { /* ungültige URL meldet das Schema */ }
    if (tag.toLowerCase() !== AMAZON_TAG) issues.push({ path: "kaufUrl", message: `Der Amazon-Link braucht das Partner-Tag tag=${AMAZON_TAG}.` });
  }
  for (const t of alleTexte(data)) {
    const hits = sperrwoerter(t.text);
    if (hits.length) issues.push({ path: t.path, message: `Sperrliste: „${hits.join("“, „")}“ in ${t.path}.` });
  }
  return issues;
}
