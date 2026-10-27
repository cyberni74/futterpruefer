import type { Art, CaRegel, Spalte } from "./types";
import { ASCHE_BAND, KOLLAGEN, KOLLAGEN_ABZUG_AKTIV, KOLL_STUFE1_MAX, KOLL_STUFE1_MAX_GRENZE, TAURIN_MIN, caRegel } from "./fediaf";
import { inTs } from "./energie";

/** g je 1000 kcal = Wert wie gefüttert (g/100 g) ÷ ME (kcal/100 g) × 1000 */
export const proTausendKcal = (wert: number, me: number) => (wert / me) * 1000;

export type CaPCheck = { ratio: number; caTs: number; pTs: number; regel: CaRegel; okRatio: boolean; okCa: boolean; okP: boolean; nah: boolean; caUeber: boolean };

export function caPCheck(art: Art, spalte: Spalte, ca: number, ph: number, feuchte: number, endgewicht?: number | null, wochen?: number): CaPCheck {
  const regel = caRegel(art, spalte, endgewicht, wochen);
  const ratio = ca / ph;
  const caTs = inTs(ca, feuchte);
  const pTs = inTs(ph, feuchte);
  const okRatio = regel.rMin <= ratio && ratio <= regel.rMax;
  const okCa = caTs >= regel.caMin && (regel.caMax === null || caTs <= regel.caMax);
  const okP = pTs >= regel.pMin && (regel.pMax === null || pTs <= regel.pMax);
  const nah = regel.rMin - 0.1 <= ratio && ratio <= regel.rMax + 0.1;
  return { ratio, caTs, pTs, regel, okRatio, okCa, okP, nah, caUeber: regel.caMax !== null && caTs > regel.caMax };
}

/** Taurin in % TS = (mg/kg ÷ 10.000) ÷ TS × 100 */
export function taurinCheck(mgKg: number, feuchte: number, spalte: Spalte, nass: boolean) {
  const ts = (mgKg / 10000 / (100 - feuchte)) * 100;
  const min = TAURIN_MIN[`${spalte}:${nass ? "nass" : "trocken"}`] ?? 0;
  return { ts, min, ok: ts >= min };
}

export const ascheImBand = (aTs: number) => aTs >= ASCHE_BAND.min && aTs <= ASCHE_BAND.max;

/**
 * Stufen: Verhältnis zum Minimum → Punkte.
 * @deprecated Bis v1 für Protein und Fett genutzt; die Bewertung v2 vergibt Punkte über Verhältnis und Energieanteil.
 */
export function stufe(r: number, steps: Array<[number, number]>): number {
  for (const [thr, pts] of steps) if (r >= thr) return pts;
  return 0;
}

/** 0 bei x ≤ lo, 1 bei x ≥ hi, linear dazwischen. */
export const lin = (x: number, lo: number, hi: number) => (hi === lo ? (x >= hi ? 1 : 0) : Math.min(1, Math.max(0, (x - lo) / (hi - lo))));
/** Teilpunkte auf 0,1 (wie Math.round in der Referenz). */
export const r1 = (x: number) => Math.round(x * 10) / 10;

/** Oberste Ebene an , oder ; trennen; Inhalt in () oder [] bleibt beim Bestandteil. Leere Teile werden verworfen, die ersten n bleiben. */
export function zutatenListe(text: string, n: number): string[] {
  const teile: string[] = [];
  let tiefe = 0;
  let cur = "";
  for (const ch of text ?? "") {
    if (ch === "(" || ch === "[") tiefe += 1;
    else if (ch === ")" || ch === "]") tiefe = Math.max(0, tiefe - 1);
    if ((ch === "," || ch === ";") && tiefe === 0) {
      if (cur.trim()) teile.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) teile.push(cur.trim());
  return teile.slice(0, n);
}

export type KollagenErgebnis = {
  /** Protein und Asche (in der Trockenmasse) beide hoch: Hinweis K1, nur aus den Nährwerten */
  stufe1: boolean;
  abzugNaehrwerte: number;
  abzugZutaten: number;
  /** Alle gefundenen Wörter aus den Zutaten (stark, dann Sammelbegriffe) */
  treffer: string[];
  /** Starke Begriffe (Kollagen, Knorpel, Knochenmehl …): lösen Abzug und K2 aus */
  trefferStark: string[];
  /** Sammelbegriffe („Nebenerzeugnisse“, „hydrolysierte Tierproteine“): nie Abzug, nur K2-Zusatz */
  trefferSchwach: string[];
  /** Hinweis anzeigen, auch ohne Abzug */
  flag: boolean;
  zutatenGeprueft: boolean;
};

/** Das ganze Wort, in dem der Treffer steht („Rinderknorpel“ statt „knorpel“). */
function wortUm(original: string, index: number, laenge: number): string {
  const buchstabe = /[A-Za-zÄÖÜäöüß-]/;
  let von = index;
  let bis = index + laenge;
  while (von > 0 && buchstabe.test(original[von - 1])) von -= 1;
  while (bis < original.length && buchstabe.test(original[bis])) bis += 1;
  return original.slice(von, bis);
}

/**
 * Kollagen-Heuristik nach A5 (Rechtsprüfung 27.10.2026). Stufe 1 nur aus den Nährwerten, Stufe 2 aus den ersten fünf eingegebenen Zutaten.
 * pTs, aTs in % der Trockenmasse. caTs bleibt nur als Parameter erhalten (der Ca-Zusatzabzug entfällt).
 * Der Abzug gilt nur bei abzugAktiv; die Hinweise (flag) erscheinen unabhängig davon.
 */
export function kollagen(
  art: Art, pTs: number, aTs: number, _caTs: number | null, zutaten?: string | null,
  abzugAktiv: boolean = KOLLAGEN_ABZUG_AKTIV, stufe1Max: number = KOLL_STUFE1_MAX,
): KollagenErgebnis {
  if (!(stufe1Max >= 0 && stufe1Max <= KOLL_STUFE1_MAX_GRENZE)) throw new Error(`stufe1Max muss zwischen 0 und ${KOLL_STUFE1_MAX_GRENZE} liegen`);
  const K = KOLLAGEN;
  const stufe1 = pTs >= K.proteinTsAb[art] && aTs > K.ascheAb;
  const a1 = stufe1 ? Math.round(lin(aTs, K.ascheAb, K.ascheVoll) * stufe1Max) : 0;
  const stark = new Map<string, string>();
  const schwach = new Map<string, string>();
  if (zutaten) {
    for (const z of zutatenListe(zutaten, K.zutatenPositionen)) {
      const zl = z.toLocaleLowerCase("de");
      let starkHier = false;
      for (const re of K.stark) {
        const m = re.exec(zl);
        if (m) {
          starkHier = true;
          if (!stark.has(re.source)) stark.set(re.source, wortUm(z, m.index, m[0].length));
        }
      }
      for (const re of K.schwach) {
        const m = re.exec(zl);
        if (m && !schwach.has(re.source)) schwach.set(re.source, wortUm(z, m.index, m[0].length));
      }
      const h = K.hydroJa.exec(zl);
      if (h && K.hydroKontext.test(zl) && !K.hydroNein.test(zl) && !schwach.has("hydrolysat") && !starkHier) {
        schwach.set("hydrolysat", wortUm(z, h.index, h[0].length));
      }
    }
  }
  const trefferStark = [...new Set(stark.values())];
  const trefferSchwach = [...new Set(schwach.values())];
  const a2 = stark.size ? Math.min(4 + 2 * (stark.size - 1), K.zutatenMax) : 0;
  return {
    stufe1,
    abzugNaehrwerte: abzugAktiv ? a1 : 0,
    abzugZutaten: abzugAktiv ? a2 : 0,
    treffer: [...trefferStark, ...trefferSchwach],
    trefferStark,
    trefferSchwach,
    flag: stufe1 || trefferStark.length > 0 || trefferSchwach.length > 0,
    zutatenGeprueft: (zutaten ?? "").trim().length > 0,
  };
}
