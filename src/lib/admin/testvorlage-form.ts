import { CRITERIA } from "@/lib/scoring";
import { KRITERIEN_VORLAGE, layoutDataSchema, type Bewertungsart, type LayoutData, type LayoutInput } from "@/components/testvorlage-v2/schema";

/**
 * Formularzustand der Testvorlage im Admin: Zahlen als Text (Eingabe), wiederholbare Zeilen mit stabilem Schlüssel `_k`.
 * Daten bleiben getrennt von der Darstellung: draftToLayoutData() erzeugt genau das JSON, das die Seite rendert.
 */
type K = { _k: string };
export type KriteriumDraft = K & { name: string; punkte: string; max: string; kurz: string; begruendung: string };
export type Draft = {
  hero: { titel: string; untertitel: string; tags: string[]; gesamturteil: string; notenwort: string };
  kennzahlen: Array<K & { wert: string; label: string; sub: string }>;
  urteil: { titel: string; intro: string; hervorhebung: string };
  kriterien: KriteriumDraft[];
  kapitel: Array<K & { titel: string; html: string; id?: string; block?: NonNullable<LayoutData["kapitel"]>[number]["block"] }>;
  zutaten: Array<K & { name: string; menge: string; funktion: string; bewertung: string }>;
  analysewerte: Array<K & { name: string; wert: string; hinweis: string }>;
  dosierung: { kopf1: string; kopf2: string; zeilen: Array<K & { label: string; wert: string }> };
  evidenz: Array<K & { aussage: string; status: "BELEGT" | "PLAUSIBEL" | "NICHT_VERIFIZIERT"; quelle: string }>;
  herstellerangaben: Array<K & { label: string; prozent: string }>;
  preisrechner: { aktiv: boolean; preis: string; inhalt: string; einheit: "STUECK" | "GRAMM" | "KILOGRAMM"; dosisProKg: string; koerpergewicht: string; tage: string };
  sicherheit: { stufe: "OK" | "HINWEIS" | "KRITISCH"; titel: string; text: string };
  pros: string[];
  cons: string[];
  fazit: { titel: string; html: string };
  faq: Array<K & { frage: string; antwort: string }>;
  quellen: Array<K & { titel: string; doi: string; url: string; hinweis: string }>;
  pruefstand: string;
  methodikHinweis: string;
  asin: string;
  bildnachweis: string;
  aehnlicheTests: string[];
  /** Felder ohne eigenes Formularfeld bleiben beim Import/Export erhalten */
  extra: Pick<LayoutData, "kaufUrl" | "kaufLabel" | "abschnittTitel">;
};

let zaehler = 0;
export const neuerSchluessel = () => `k${Date.now().toString(36)}${(zaehler++).toString(36)}`;
const k = <T extends object>(o: T): T & K => ({ _k: neuerSchluessel(), ...o });

export function emptyDraft(): Draft {
  return {
    hero: { titel: "", untertitel: "", tags: [], gesamturteil: "", notenwort: "" },
    kennzahlen: [],
    urteil: { titel: "", intro: "", hervorhebung: "" },
    kriterien: [],
    kapitel: [],
    zutaten: [],
    analysewerte: [],
    dosierung: { kopf1: "", kopf2: "", zeilen: [] },
    evidenz: [],
    herstellerangaben: [],
    preisrechner: { aktiv: false, preis: "", inhalt: "", einheit: "STUECK", dosisProKg: "", koerpergewicht: "10", tage: "30" },
    sicherheit: { stufe: "OK", titel: "", text: "" },
    pros: ["", ""],
    cons: ["", ""],
    fazit: { titel: "", html: "" },
    faq: [],
    quellen: [],
    pruefstand: "",
    methodikHinweis: "",
    asin: "",
    bildnachweis: "",
    aehnlicheTests: [],
    extra: {},
  };
}

const KRITERIEN_NAMEN: Record<Bewertungsart, string[]> = {
  ERGAENZUNGSFUTTER: ["Wirkstoffauswahl", "Dosierung", "Werbung und Aussagen", "Träger- und Zusatzstoffe", "Transparenz"],
  ALLEINFUTTER: CRITERIA.map((c) => c.label),
};

/** Vorauswahl der Kriterien: Namen und Maxima, Punkte bleiben leer. */
export function kriterienVorlage(art: Bewertungsart): KriteriumDraft[] {
  return KRITERIEN_VORLAGE[art].map((max, i) => k({ name: KRITERIEN_NAMEN[art][i] ?? "", punkte: "", max: String(max), kurz: "", begruendung: "" }));
}

export const VORLAGE_LABEL: Record<Bewertungsart, string> = {
  ERGAENZUNGSFUTTER: "Ergänzungsfutter (5: 20/30/20/15/15)",
  ALLEINFUTTER: "Alleinfutter (6: 30/20/20/15/10/5)",
};

const num = (s: string): number | undefined => {
  const t = s.trim().replace(",", ".");
  if (t === "") return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : NaN;
};
const txt = (s: string) => (s.trim() === "" ? undefined : s.trim());
const rich = (s: string) => (s.replace(/<[^>]*>/g, "").trim() === "" ? undefined : s);
const list = (a: string[]) => a.map((x) => x.trim()).filter(Boolean);
const some = <T>(a: T[]) => (a.length ? a : undefined);
const strip = <T extends object>(o: T): T | undefined => {
  const e = Object.entries(o).filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0));
  return e.length ? (Object.fromEntries(e) as T) : undefined;
};

/** Gesamtwertung aus den Kriterien (nur Anzeige, nie eingegeben). */
export const draftTotal = (d: Draft): number => d.kriterien.reduce((s, x) => s + (Number.isFinite(num(x.punkte)) ? (num(x.punkte) ?? 0) : 0), 0);

/** Formular → layoutData (leere Felder entfallen; ungültige Zahlen bleiben NaN und werden vom Schema gemeldet). */
export function draftToLayoutData(d: Draft): LayoutInput {
  const pr = d.preisrechner;
  const out: LayoutInput = {
    hero: strip({ titel: txt(d.hero.titel), untertitel: txt(d.hero.untertitel), tags: some(list(d.hero.tags)), gesamturteil: txt(d.hero.gesamturteil), notenwort: txt(d.hero.notenwort) }),
    kennzahlen: some(d.kennzahlen.filter((x) => x.wert.trim() || x.label.trim()).map((x) => ({ wert: x.wert.trim(), label: x.label.trim(), sub: txt(x.sub) }))),
    urteil: strip({ titel: txt(d.urteil.titel), intro: txt(d.urteil.intro), hervorhebung: txt(d.urteil.hervorhebung) }),
    kriterien: some(d.kriterien.filter((x) => x.name.trim() || x.punkte.trim() || x.max.trim()).map((x) => ({ name: x.name.trim(), punkte: num(x.punkte) as number, max: num(x.max) as number, kurz: txt(x.kurz), begruendung: txt(x.begruendung) }))),
    kapitel: some(d.kapitel.filter((x) => x.titel.trim() || rich(x.html)).map((x) => ({ id: x.id, titel: x.titel.trim(), html: rich(x.html), block: x.block }))),
    zutaten: some(d.zutaten.filter((x) => x.name.trim()).map((x) => ({ name: x.name.trim(), menge: txt(x.menge), funktion: txt(x.funktion), bewertung: txt(x.bewertung) }))),
    analysewerte: some(d.analysewerte.filter((x) => x.name.trim() || x.wert.trim()).map((x) => ({ name: x.name.trim(), wert: x.wert.trim(), hinweis: txt(x.hinweis) }))),
    dosierung: d.dosierung.zeilen.some((z) => z.label.trim() || z.wert.trim())
      ? { kopf: d.dosierung.kopf1.trim() || d.dosierung.kopf2.trim() ? ([d.dosierung.kopf1.trim() || "Körpergewicht", d.dosierung.kopf2.trim() || "Tagesdosis"] as [string, string]) : undefined, zeilen: d.dosierung.zeilen.filter((z) => z.label.trim() || z.wert.trim()).map((z) => ({ label: z.label.trim(), wert: z.wert.trim() })) }
      : undefined,
    evidenz: some(d.evidenz.filter((x) => x.aussage.trim()).map((x) => ({ aussage: x.aussage.trim(), status: x.status, quelle: txt(x.quelle) }))),
    herstellerangaben: some(d.herstellerangaben.filter((x) => x.label.trim() || x.prozent.trim()).map((x) => ({ label: x.label.trim(), prozent: num(x.prozent) as number }))),
    preisrechner: pr.aktiv ? { preis: num(pr.preis) as number, inhalt: num(pr.inhalt) as number, einheit: pr.einheit, dosisProKg: num(pr.dosisProKg) as number, koerpergewicht: num(pr.koerpergewicht) ?? 10, tage: num(pr.tage) ?? 30 } : undefined,
    sicherheit: d.sicherheit.text.trim() ? { stufe: d.sicherheit.stufe, titel: txt(d.sicherheit.titel), text: d.sicherheit.text.trim() } : undefined,
    pros: some(list(d.pros)),
    cons: some(list(d.cons)),
    fazit: rich(d.fazit.html) ? { titel: txt(d.fazit.titel), html: d.fazit.html } : undefined,
    faq: some(d.faq.filter((x) => x.frage.trim() || x.antwort.trim()).map((x) => ({ frage: x.frage.trim(), antwort: x.antwort.trim() }))),
    quellen: some(d.quellen.filter((x) => x.titel.trim()).map((x) => ({ titel: x.titel.trim(), doi: txt(x.doi), url: txt(x.url), hinweis: txt(x.hinweis) }))),
    pruefstand: txt(d.pruefstand),
    methodikHinweis: txt(d.methodikHinweis),
    asin: txt(d.asin),
    bildnachweis: txt(d.bildnachweis),
    aehnlicheTests: some(list(d.aehnlicheTests)),
    ...d.extra,
  };
  return JSON.parse(JSON.stringify(out, (_k, v) => (v === undefined ? undefined : typeof v === "number" && Number.isNaN(v) ? "NaN" : v)));
}

/** layoutData → Formular (Import und Laden). Unbekannte Schlüssel werden vom Schema verworfen. */
export function layoutDataToDraft(data: LayoutData): Draft {
  const d = emptyDraft();
  const n = (x: number | undefined) => (x == null ? "" : String(x).replace(".", ","));
  d.hero = { titel: data.hero?.titel ?? "", untertitel: data.hero?.untertitel ?? "", tags: data.hero?.tags ?? [], gesamturteil: data.hero?.gesamturteil ?? "", notenwort: data.hero?.notenwort ?? "" };
  d.kennzahlen = (data.kennzahlen ?? []).map((x) => k({ wert: x.wert, label: x.label, sub: x.sub ?? "" }));
  d.urteil = { titel: data.urteil?.titel ?? "", intro: data.urteil?.intro ?? "", hervorhebung: data.urteil?.hervorhebung ?? "" };
  d.kriterien = (data.kriterien ?? []).map((x) => k({ name: x.name, punkte: String(x.punkte), max: String(x.max), kurz: x.kurz ?? "", begruendung: x.begruendung ?? "" }));
  d.kapitel = (data.kapitel ?? []).map((x) => k({ titel: x.titel, html: x.html ?? "", id: x.id, block: x.block }));
  d.zutaten = (data.zutaten ?? []).map((x) => k({ name: x.name, menge: x.menge ?? "", funktion: x.funktion ?? "", bewertung: x.bewertung ?? "" }));
  d.analysewerte = (data.analysewerte ?? []).map((x) => k({ name: x.name, wert: x.wert, hinweis: x.hinweis ?? "" }));
  d.dosierung = { kopf1: data.dosierung?.kopf?.[0] ?? "", kopf2: data.dosierung?.kopf?.[1] ?? "", zeilen: (data.dosierung?.zeilen ?? []).map((z) => k({ label: z.label, wert: z.wert })) };
  d.evidenz = (data.evidenz ?? []).map((x) => k({ aussage: x.aussage, status: x.status, quelle: x.quelle ?? "" }));
  d.herstellerangaben = (data.herstellerangaben ?? []).map((x) => k({ label: x.label, prozent: n(x.prozent) }));
  if (data.preisrechner) d.preisrechner = { aktiv: true, preis: n(data.preisrechner.preis), inhalt: n(data.preisrechner.inhalt), einheit: data.preisrechner.einheit, dosisProKg: n(data.preisrechner.dosisProKg), koerpergewicht: n(data.preisrechner.koerpergewicht), tage: n(data.preisrechner.tage) };
  if (data.sicherheit) d.sicherheit = { stufe: data.sicherheit.stufe, titel: data.sicherheit.titel ?? "", text: data.sicherheit.text };
  d.pros = pad(data.pros);
  d.cons = pad(data.cons);
  d.fazit = { titel: data.fazit?.titel ?? "", html: data.fazit?.html ?? "" };
  d.faq = (data.faq ?? []).map((x) => k({ frage: x.frage, antwort: x.antwort }));
  d.quellen = (data.quellen ?? []).map((x) => k({ titel: x.titel, doi: x.doi ?? "", url: x.url ?? "", hinweis: x.hinweis ?? "" }));
  d.pruefstand = data.pruefstand ?? "";
  d.methodikHinweis = data.methodikHinweis ?? "";
  d.asin = data.asin ?? "";
  d.bildnachweis = data.bildnachweis ?? "";
  d.aehnlicheTests = data.aehnlicheTests ?? [];
  d.extra = { ...(data.kaufUrl ? { kaufUrl: data.kaufUrl } : {}), ...(data.kaufLabel ? { kaufLabel: data.kaufLabel } : {}), ...(data.abschnittTitel ? { abschnittTitel: data.abschnittTitel } : {}) };
  return d;
}

function pad(a: string[] | undefined): string[] {
  const out = [...(a ?? [])];
  while (out.length < 2) out.push("");
  return out;
}

export type ImportResult = { ok: true; draft: Draft } | { ok: false; error: string };

/** Import aus vorlage-daten.json: akzeptiert layoutData direkt oder als { layoutData: … }. */
export function importLayoutJson(text: string): ImportResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: "Die Datei ist kein gültiges JSON." };
  }
  if (raw && typeof raw === "object" && "layoutData" in raw && (raw as { layoutData: unknown }).layoutData && typeof (raw as { layoutData: unknown }).layoutData === "object") raw = (raw as { layoutData: unknown }).layoutData;
  const r = layoutDataSchema.safeParse(raw);
  if (!r.success) return { ok: false, error: r.error.issues.slice(0, 6).map((i) => `${i.path.join(".") || "Datei"}: ${i.message}`).join("\n") };
  return { ok: true, draft: layoutDataToDraft(r.data) };
}

export function exportLayoutJson(d: Draft): string {
  return JSON.stringify(draftToLayoutData(d), null, 2);
}
