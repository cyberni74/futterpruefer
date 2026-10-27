import type { Art, CaRegel, Spalte } from "./types";
import { ASCHE_BAND, KOLLAGEN, TAURIN_MIN, caRegel } from "./fediaf";
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
  abzugNaehrwerte: number;
  abzugZutaten: number;
  /** Lesbare Begriffe aus den eingegebenen Zutaten (nicht der Regex) */
  treffer: string[];
  /** mindestens ein Sammelbegriff („Nebenerzeugnisse“, „hydrolysierte Tierproteine“) getroffen */
  schwach: boolean;
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
 * Kollagen-Heuristik (Abzug in Punkten, kein Deckel). Stufe 1 nur aus den Nährwerten, Stufe 2 aus den ersten fünf eingegebenen Zutaten.
 * pTs, aTs, caTs in % der Trockenmasse.
 */
export function kollagen(art: Art, pTs: number, aTs: number, caTs: number | null, zutaten?: string | null): KollagenErgebnis {
  const K = KOLLAGEN;
  let a1 = 0;
  let caExtra = 0;
  if (pTs >= K.proteinTsAb[art] && aTs > K.ascheAb) {
    a1 = Math.round(lin(aTs, K.ascheAb, K.ascheVoll) * K.ascheMax);
    if (caTs != null && caTs > K.caTsAb) caExtra = K.caAbzug;
  }
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
  const a2 = Math.min((stark.size ? 4 + 2 * (stark.size - 1) : 0) + (schwach.size ? 2 : 0), K.zutatenMax);
  return {
    abzugNaehrwerte: a1 + caExtra,
    abzugZutaten: a2,
    treffer: [...new Set([...stark.values(), ...schwach.values()])],
    schwach: schwach.size > 0,
    flag: a1 + caExtra + a2 > 0,
    zutatenGeprueft: (zutaten ?? "").trim().length > 0,
  };
}
