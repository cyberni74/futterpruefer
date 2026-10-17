/** Ergänzungsfutter-Bewertung. Reine Funktionen, serverseitig und im Admin genutzt. */
import { isSponsoredHref } from "./sanitize";

export const EF_METHODIK_VERSION = "ergaenzung-v1";

export const EF_FIELDS = [
  { key: "auswahl", column: "efWirkstoffAuswahl", begruendung: "efWirkstoffAuswahlBegruendung", label: "Auswahl der Wirkstoffe", max: 20 },
  { key: "dosierung", column: "efWirkstoffDosierung", begruendung: "efWirkstoffDosierungBegruendung", label: "Dosierung", max: 30 },
  { key: "werbung", column: "efWerbung", begruendung: "efWerbungBegruendung", label: "Werbeaussagen", max: 20 },
  { key: "traeger", column: "efTraeger", begruendung: "efTraegerBegruendung", label: "Trägerqualität", max: 15 },
  { key: "mengen", column: "efTransparenzMengen", begruendung: "efTransparenzMengenBegruendung", label: "Deklarierte Wirkstoffmengen", max: 5 },
  { key: "unterlagen", column: "efTransparenzUnterlagen", begruendung: "efTransparenzUnterlagenBegruendung", label: "Herstellerunterlagen", max: 10 },
] as const;

export type EfFieldKey = (typeof EF_FIELDS)[number]["key"];

export const TRAEGER_ABZUEGE = [
  { id: "zucker", label: "Zugesetzter Zucker, Glukosesirup, Melasse, Honig oder Karamell", points: 4 },
  { id: "antioxidans", label: "Synthetische Antioxidantien (BHA, BHT, Ethoxyquin, Propylgallat)", points: 4 },
  { id: "farbstoff", label: "Farbstoffe, auch natürliche, die nur der Optik dienen", points: 3 },
  { id: "fuellstoff", label: "Füllstoffe als Hauptbestandteil (Stärke, Cellulose, Getreidemehl, Maltodextrin), Abzug 2 bis 4", points: 2 },
  { id: "konservierung", label: "Konservierungsstoffe ohne technische Notwendigkeit oder nur als Gruppenangabe", points: 2 },
  { id: "aroma", label: "Nicht bezeichnete Aromen oder Geschmacksverstärker", points: 2 },
  { id: "sammelbegriff", label: "Sammelbegriffe (tierische oder pflanzliche Nebenerzeugnisse)", points: 2 },
  { id: "zusatz", label: "Weiterer überflüssiger Zusatz", points: 1 },
] as const;

export const TIERART_LABEL = {
  HUND: "Hund",
  KATZE: "Katze",
  ANDERE_TIERART: "andere Tierart",
  MENSCH: "Mensch",
  IN_VITRO: "In-vitro",
} as const;

export const EVIDENZ_LABEL = {
  META_ANALYSE: "Metaanalyse",
  SYSTEMATISCHES_REVIEW: "systematisches Review",
  RCT: "randomisierte kontrollierte Studie",
  KONTROLLIERT_NICHT_RANDOMISIERT: "kontrollierte Studie",
  BEOBACHTUNG: "Beobachtungsstudie",
  FALLBERICHT: "Fallbericht",
  IN_VITRO: "In-vitro",
  EXPERTENMEINUNG: "Expertenmeinung",
} as const;

export const EINHEIT_LABEL = {
  MG: "mg/kg",
  G: "g/kg",
  KBE: "KBE",
  MG_KG_075: "mg × kg^0,75",
} as const;

export type EfTierart = keyof typeof TIERART_LABEL;
export type EfEvidenz = keyof typeof EVIDENZ_LABEL;
export type EfRichtung = "POSITIV" | "KEIN_EFFEKT" | "NEGATIV" | "GEMISCHT";
export type EfEinheit = keyof typeof EINHEIT_LABEL;
export type EfSicherheit = "OK" | "MITTEL" | "SCHWER";
export type Zieltier = "HUND" | "KATZE";

export type EfScores = Record<EfFieldKey, number>;

export type EfInput = EfScores & {
  alibi: boolean;
  keineReferenzdosis: boolean;
  heilaussage: boolean;
  sicherheit: EfSicherheit;
};

export type EfAmpel = "GRUEN" | "GELB" | "ROT";

export type EfResult = {
  dosierung: number;
  summe: number;
  cap: number;
  gesamt: number;
  warnsignal: boolean;
  ampel: EfAmpel;
  gruende: string[];
};

const clampInt = (value: unknown, max: number) => {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(max, Math.max(0, Math.round(n)));
};

export function scoreErgaenzung(input: EfInput): EfResult {
  const auswahl = clampInt(input.auswahl, 20);
  const werbung = clampInt(input.werbung, 20);
  const traeger = clampInt(input.traeger, 15);
  const mengen = clampInt(input.mengen, 5);
  const unterlagen = clampInt(input.unterlagen, 10);
  let dosierung = clampInt(input.dosierung, 30);
  if (input.alibi) dosierung = 0;
  else if (input.keineReferenzdosis) dosierung = Math.min(dosierung, 10);

  const summe = auswahl + dosierung + werbung + traeger + mengen + unterlagen;
  let cap = 100;
  const gruende: string[] = [];
  if (input.alibi) {
    cap = Math.min(cap, 59);
    gruende.push("Alibi-Dosierung: höchstens 59 Punkte.");
  } else if (mengen === 0) {
    cap = Math.min(cap, 59);
    gruende.push("Keine deklarierte Wirkstoffmenge: höchstens 59 Punkte.");
  }
  if (input.heilaussage) {
    cap = Math.min(cap, 79);
    gruende.push("Heilaussage: höchstens 79 Punkte.");
  }
  if (input.sicherheit === "MITTEL") {
    cap = Math.min(cap, 59);
    gruende.push("Sicherheit mittel: rotes Warnsignal, höchstens 59 Punkte.");
  }
  if (input.sicherheit === "SCHWER") {
    cap = Math.min(cap, 39);
    gruende.push("Sicherheit schwer: rotes Warnsignal, höchstens 39 Punkte.");
  }
  const gesamt = Math.min(summe, cap);
  const ampel: EfAmpel = gesamt >= 80 ? "GRUEN" : gesamt >= 60 ? "GELB" : "ROT";
  return { dosierung, summe, cap, gesamt, warnsignal: input.sicherheit !== "OK", ampel, gruende };
}

export function efBars(input: EfInput, result: EfResult): { key: string; label: string; max: number; value: number }[] {
  const auswahl = clampInt(input.auswahl, 20);
  const werbung = clampInt(input.werbung, 20);
  const traeger = clampInt(input.traeger, 15);
  const mengen = clampInt(input.mengen, 5);
  const unterlagen = clampInt(input.unterlagen, 10);
  return [
    { key: "wirkstoff", label: "Wirkstoff", max: 50, value: auswahl + result.dosierung },
    { key: "werbung", label: "Werbeaussagen", max: 20, value: werbung },
    { key: "traeger", label: "Trägerqualität", max: 15, value: traeger },
    { key: "transparenz", label: "Transparenz", max: 15, value: mengen + unterlagen },
  ];
}

export function capNote(result: EfResult): string {
  if (result.cap >= 100) return "";
  return `Deckel aktiv (${result.gruende.join(" ")}). Summe ${result.summe}, gewertet ${result.gesamt}.`;
}

export type StudieInput = {
  wirkstoffKey: string;
  titel: string;
  autoren: string;
  jahr: number;
  zeitschrift: string;
  tierart: EfTierart;
  studiendosisJeKg: number | null;
  einheit: EfEinheit | "";
  studiendosisOriginal: string;
  ergebnisKurz: string;
  link: string;
  linkFreigabe: boolean;
  evidenzstufe: EfEvidenz;
  richtung: EfRichtung;
  geprueftAm: string;
};

export type WirkstoffInput = {
  key: string;
  name: string;
  mengeMgProTagesdosis: number | null;
  referenzMgProKg: number | null;
};

const TIERARTEN = new Set<string>(Object.keys(TIERART_LABEL));
const EVIDENZEN = new Set<string>(Object.keys(EVIDENZ_LABEL));
const RICHTUNGEN = new Set<string>(["POSITIV", "KEIN_EFFEKT", "NEGATIV", "GEMISCHT"]);
const EINHEITEN = new Set<string>(Object.keys(EINHEIT_LABEL));

export function allowedStudyLink(link: string): boolean {
  try {
    const url = new URL(link.trim());
    if (url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase().replace(/\.$/, "");
    return host === "doi.org" || host === "www.doi.org" || host === "dx.doi.org" || host === "pubmed.ncbi.nlm.nih.gov" || host === "pmc.ncbi.nlm.nih.gov";
  } catch {
    return false;
  }
}

export function suggestAuswahl(studien: Pick<StudieInput, "wirkstoffKey" | "tierart" | "evidenzstufe" | "richtung">[], tierart: Zieltier, hauptwirkstoffKey?: string): { min: number; max: number; hinweis: string } {
  const pool = studien.filter((s) => !hauptwirkstoffKey || s.wirkstoffKey === hauptwirkstoffKey);
  const ziel = pool.filter((s) => s.tierart === tierart);
  const metaKeinEffekt = ziel.some((s) => (s.evidenzstufe === "META_ANALYSE" || s.evidenzstufe === "SYSTEMATISCHES_REVIEW") && s.richtung === "KEIN_EFFEKT");
  if (metaKeinEffekt) return { min: 0, max: 10, hinweis: "Metaanalyse oder systematisches Review ohne Effekt beim Zieltier: höchstens 10 Punkte." };
  const positiveMeta = ziel.some((s) => (s.evidenzstufe === "META_ANALYSE" || s.evidenzstufe === "SYSTEMATISCHES_REVIEW") && s.richtung === "POSITIV");
  const positiveRct = ziel.filter((s) => s.evidenzstufe === "RCT" && s.richtung === "POSITIV").length;
  if (positiveMeta || positiveRct >= 2) return { min: 17, max: 20, hinweis: "Mehrere belastbare Belege beim Zieltier: 17–20 Punkte." };
  const mixed = ziel.some((s) => s.richtung === "GEMISCHT") || positiveRct === 1;
  if (mixed) return { min: 11, max: 16, hinweis: "Einzelne oder gemischte Belege beim Zieltier: 11–16 Punkte." };
  const weak = pool.some((s) => s.tierart === "ANDERE_TIERART" || s.tierart === "MENSCH" || s.evidenzstufe === "BEOBACHTUNG" || s.evidenzstufe === "FALLBERICHT");
  if (weak) return { min: 5, max: 10, hinweis: "Nur andere Tierarten, Mensch, Beobachtung oder Fallbericht: 5–10 Punkte." };
  return { min: 0, max: 4, hinweis: "Keine verwertbare Studie oder nur In-vitro bzw. Expertenmeinung: 0–4 Punkte." };
}

export function dosisAnteilProzent(mengeMg: number | null, referenzMgProKg: number | null, gewichtKg: number): number | null {
  if (mengeMg == null || referenzMgProKg == null || referenzMgProKg <= 0 || gewichtKg <= 0) return null;
  return (mengeMg / gewichtKg / referenzMgProKg) * 100;
}

export function gewichtFuerTier(tier: Zieltier): number {
  return tier === "KATZE" ? 4 : 10;
}

export function traegerVorschlag(ids: string[]): number {
  const sum = TRAEGER_ABZUEGE.reduce((n, item) => n + (ids.includes(item.id) ? item.points : 0), 0);
  return Math.max(0, 15 - sum);
}

export type EfFieldErrors = Record<string, string>;

export function validateEfSave(args: {
  scores: EfScores;
  begruendungen: Record<EfFieldKey, string>;
  alibi: boolean;
  keineReferenzdosis: boolean;
  heilaussage: boolean;
  sicherheit: EfSicherheit;
  sicherheitBegruendung: string;
  tierschutz: string;
  wirkstoffe: WirkstoffInput[];
  studien: StudieInput[];
  tierart: Zieltier;
  publishing: boolean;
  year?: number;
}): { ok: true; scores: EfScores } | { ok: false; message: string; fieldErrors: EfFieldErrors } {
  const fieldErrors: EfFieldErrors = {};
  const scores = { ...args.scores };
  if (args.alibi) scores.dosierung = 0;
  else if (args.keineReferenzdosis) scores.dosierung = Math.min(scores.dosierung, 10);

  for (const field of EF_FIELDS) {
    const value = scores[field.key];
    if (!Number.isInteger(value) || value < 0 || value > field.max) {
      fieldErrors[field.column] = `${field.label}: ganze Punkte von 0 bis ${field.max}.`;
    } else if (args.publishing && value < field.max && args.begruendungen[field.key].trim().length < 10) {
      fieldErrors[field.begruendung] = `${field.label}: unter ${field.max} Punkten bitte begründen (mindestens 10 Zeichen).`;
    }
  }
  if (args.sicherheit !== "OK" && args.publishing && args.sicherheitBegruendung.trim().length < 10) {
    fieldErrors.efSicherheitBegruendung = "Bitte die Sicherheitseinstufung begründen (mindestens 10 Zeichen).";
  }
  if (args.publishing && args.tierschutz.trim().length < 20) {
    fieldErrors.efTierschutzText = "Bitte den Abschnitt Tierschutz ausfüllen (mindestens 20 Zeichen).";
  }

  const names = new Map(args.wirkstoffe.map((w) => [w.key, w.name.trim()]));
  args.wirkstoffe.forEach((w, i) => {
    if (!w.name.trim()) fieldErrors.efPayload = `Wirkstoff ${i + 1}: bitte einen Namen angeben.`;
  });

  const yearMax = args.year ?? new Date().getFullYear();
  const payload = (msg: string) => {
    if (!fieldErrors.efPayload) fieldErrors.efPayload = msg;
  };
  args.studien.forEach((s, i) => {
    const prefix = `Studie ${i + 1}`;
    if (!names.get(s.wirkstoffKey)) payload(`${prefix}: bitte einen Wirkstoff wählen.`);
    if (s.titel.trim().length < 3 || s.titel.trim().length > 300) payload(`${prefix}: Titel mit 3 bis 300 Zeichen.`);
    if (!s.autoren.trim()) payload(`${prefix}: Autoren angeben.`);
    if (!Number.isInteger(s.jahr) || s.jahr < 1950 || s.jahr > yearMax) payload(`${prefix}: Jahr zwischen 1950 und ${yearMax}.`);
    if (!TIERARTEN.has(s.tierart)) payload(`${prefix}: Tierart fehlt.`);
    if (!EVIDENZEN.has(s.evidenzstufe)) payload(`${prefix}: Evidenzstufe fehlt.`);
    if (!RICHTUNGEN.has(s.richtung)) payload(`${prefix}: Richtung fehlt.`);
    if (s.ergebnisKurz.trim().length < 3 || s.ergebnisKurz.trim().length > 280) payload(`${prefix}: Ergebnis in 3 bis 280 Zeichen.`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s.geprueftAm)) payload(`${prefix}: Datum der Prüfung fehlt.`);
    if (s.einheit && !EINHEITEN.has(s.einheit)) payload(`${prefix}: Einheit ungültig.`);
    if (!s.link.trim() || !allowedStudyLink(s.link)) {
      if (!s.link.trim() || !s.linkFreigabe || !/^https:\/\/[^\s]+$/.test(s.link.trim())) {
        payload(`${prefix}: Link fehlt oder ist kein erlaubter DOI-, PubMed- oder PMC-Link. Andere Links brauchen das Freigabe-Häkchen und https.`);
      }
    }
  });

  const zielStudien = args.studien.filter((s) => s.tierart === args.tierart);
  if (scores.auswahl > 10 && zielStudien.length === 0) {
    fieldErrors.efWirkstoffAuswahl = "Auswahl über 10 Punkte speichert nicht ohne mindestens eine Studie beim Zieltier.";
  }
  const metaKeinEffekt = zielStudien.some((s) => (s.evidenzstufe === "META_ANALYSE" || s.evidenzstufe === "SYSTEMATISCHES_REVIEW") && s.richtung === "KEIN_EFFEKT");
  if (metaKeinEffekt && scores.auswahl > 10) {
    fieldErrors.efWirkstoffAuswahl = "Eine Metaanalyse oder ein systematisches Review ohne Effekt begrenzt die Auswahl auf 10 Punkte.";
  }

  const first = Object.values(fieldErrors)[0];
  if (first) return { ok: false, message: first, fieldErrors };
  return { ok: true, scores };
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function linkLabel(link: string): string {
  try {
    const host = new URL(link).hostname.toLowerCase();
    if (host.includes("pubmed.")) return "PubMed";
    if (host.includes("pmc.")) return "PMC";
    if (host.includes("doi.org")) return "DOI";
  } catch {
    /* bleibt Quelle */
  }
  return "Quelle";
}

export type StudieView = {
  wirkstoff: string;
  autoren: string;
  jahr: number;
  titel: string;
  zeitschrift: string;
  tierart: EfTierart;
  evidenzstufe: EfEvidenz;
  dosis: string;
  ergebnis: string;
  link: string;
};

/** Nummerierte Quellenliste, gruppiert nach Wirkstoff. Leer, wenn keine Studien da sind. */
export function renderStudienListe(studien: StudieView[]): string {
  if (!studien.length) return "";
  const groups: { name: string; items: StudieView[] }[] = [];
  for (const studie of studien) {
    const name = studie.wirkstoff.trim() || "Wirkstoff";
    const last = groups[groups.length - 1];
    if (last && last.name === name) last.items.push(studie);
    else groups.push({ name, items: [studie] });
  }
  let n = 0;
  const blocks = groups.map((group) => {
    const items = group.items.map((s) => {
      n += 1;
      const bits = [TIERART_LABEL[s.tierart], EVIDENZ_LABEL[s.evidenzstufe], s.dosis.trim(), s.ergebnis.trim()].filter(Boolean);
      const journal = s.zeitschrift.trim() ? ` ${esc(s.zeitschrift.trim())}.` : "";
      const link = s.link.trim()
        ? ` <a href="${esc(s.link.trim())}" rel="noopener">${linkLabel(s.link)}</a>`
        : "";
      return `<li id="studie-${n}">${esc(s.autoren)} (${s.jahr}): ${esc(s.titel)}.${journal} ${esc(bits.join(" · "))}.${link}</li>`;
    });
    return `<p><strong>${esc(group.name)}</strong></p><ol${n === group.items.length ? "" : ` start="${n - group.items.length + 1}"`}>${items.join("")}</ol>`;
  });
  return `<div id="ergaenzung-studien">${blocks.join("")}</div>`;
}

/** Hängt die Studienliste an die vorhandene Überschrift „Quellen“. Ohne Studien bleibt das HTML unverändert. */
export function insertStudienIntoQuellen(html: string, liste: string): string {
  if (!liste || html.includes('id="ergaenzung-studien"')) return html;
  const heading = /(<h2\b[^>]*>\s*Quellen\s*<\/h2>)/i;
  if (heading.test(html)) return html.replace(heading, `$1${liste}`);
  return `${html}<h2>Quellen</h2>${liste}`;
}

function markdownLite(text: string): string {
  const html = esc(text.trim())
    .replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g, '<a href="$2" rel="noopener">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return html
    .split(/\n{2,}/)
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function appendTierschutz(html: string, text: string): string {
  const body = text.trim();
  if (!body || /<h2\b[^>]*>\s*Tierschutz\s*<\/h2>/i.test(html)) return html;
  return `${html}<h2>Tierschutz</h2>${markdownLite(body)}`;
}

/** Entfernt Kauf-Boxen und Amazon-Buttons. Wissenschaftliche Links bleiben. */
export function suppressAmazonCta(html: string): string {
  const withoutBox = html.replace(/<div\b[^>]*\bclass="[^"]*\bcta-box\b[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");
  return withoutBox.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (full, attrs: string, inner: string) => {
    if (!/\bclass="[^"]*\b(?:button|cta-button|btn)\b/.test(attrs)) return full;
    const href = /href="([^"]*)"/i.exec(attrs)?.[1] ?? "";
    if (!isSponsoredHref(href)) return full;
    return inner.replace(/<[^>]+>/g, "");
  });
}

export function prepareErgaenzungArticle(html: string, opts: { studienHtml: string; tierschutz: string; rot: boolean }): string {
  let out = insertStudienIntoQuellen(html, opts.studienHtml);
  out = appendTierschutz(out, opts.tierschutz);
  if (opts.rot) out = suppressAmazonCta(out);
  return out;
}

export function studieDosisText(s: { studiendosisJeKg: number | null; einheit: EfEinheit | ""; studiendosisOriginal: string }): string {
  if (s.studiendosisJeKg != null && s.einheit) return `${s.studiendosisJeKg} ${EINHEIT_LABEL[s.einheit]}`;
  return s.studiendosisOriginal.trim();
}
