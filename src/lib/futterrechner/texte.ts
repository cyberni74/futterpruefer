import type { Spalte } from "./types";

const de = (digits: number) => new Intl.NumberFormat("de-DE", { minimumFractionDigits: digits, maximumFractionDigits: digits });
const F0 = de(0);
const F1 = de(1);
const F2 = de(2);

/** Anzeige-Rundung nach Konzept 9.3: Prozent 1 Stelle, g/1000 kcal ganz, kcal ganz, Ca:P 2 Stellen. */
export const n0 = (x: number) => F0.format(x);
export const n1 = (x: number) => F1.format(x);
export const n2 = (x: number) => F2.format(x);
/** Minima behalten ihre Originalnachkommastellen (52,1 / 13,75 / 83,3). */
export const nMin = (x: number) => new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 }).format(x);

const ZIEL: Record<Spalte, string> = {
  adult110: "erwachsene Hunde",
  adult95: "Hunde mit geringem Energiebedarf",
  wachstum_frueh: "Welpen unter 14 Wochen",
  wachstum_spaet: "Welpen ab 14 Wochen",
  adult100: "erwachsene Katzen mit Freigang",
  adult75: "kastrierte oder Wohnungskatzen",
  wachstum: "Kitten",
};
export const zielgruppe = (s: Spalte) => ZIEL[s];

export function proteinGrund(p1000: number, min: number, rp: number, spalte: Spalte) {
  if (rp >= 1) {
    return `Rohprotein: ${n0(p1000)} g je 1000 kcal. FEDIAF empfiehlt für ${zielgruppe(spalte)} mindestens ${nMin(min)} g. Ihr Futter liegt beim ${n1(rp)}-Fachen.`;
  }
  if (rp >= 0.9) {
    return `Rohprotein: ${n0(p1000)} g je 1000 kcal, Mindestwert für ${zielgruppe(spalte)}: ${nMin(min)} g. Das sind ${n0(rp * 100)} %. Etikettwerte haben Toleranzen, aber Luft ist da nicht mehr.`;
  }
  return "Rohprotein liegt unter 90 % des FEDIAF-Mindestwerts. Für diese Lebensphase reicht das nach unserer Rechnung nicht. Deshalb höchstens „mangelhaft“.";
}

export function fettGrund(f1000: number, min: number, rf: number) {
  if (rf >= 1) return `Rohfett: ${n0(f1000)} g je 1000 kcal (Minimum ${nMin(min)} g). Fett liefert Energie und essenzielle Fettsäuren.`;
  if (rf >= 0.9) return `Rohfett: ${n0(f1000)} g je 1000 kcal bei einem Minimum von ${nMin(min)} g. Das sind ${n0(rf * 100)} %, also knapp darunter.`;
  return `Rohfett liegt mit ${n0(f1000)} g je 1000 kcal unter 90 % des FEDIAF-Mindestwerts (${nMin(min)} g). Deshalb höchstens „mangelhaft“.`;
}

export function spaltenWechsel(spalte: Spalte, mindestP: number): string | null {
  if (spalte === "adult75") return `Weil Ihre Katze kastriert ist oder in der Wohnung lebt, frisst sie weniger. Jede Kalorie muss also mehr Eiweiß liefern: FEDIAF nennt dann ${nMin(mindestP)} g statt 62,5 g je 1000 kcal.`;
  if (spalte === "adult95") return `Weil Ihr Hund wenig Energie braucht, frisst er weniger. Jede Kalorie muss also mehr Eiweiß liefern: FEDIAF nennt dann ${nMin(mindestP)} g statt 45 g je 1000 kcal.`;
  return null;
}

export const caPPasst = (ratio: number, min: number, max: number) =>
  `Calcium zu Phosphor ${n2(ratio)} : 1, empfohlen sind ${n1(min)} : 1 bis ${n1(max)} : 1.`;
export const caPDaneben = (ratio: number, max: number, zielgruppeText: string) =>
  `Calcium zu Phosphor ${n2(ratio)} : 1. FEDIAF nennt für ${zielgruppeText} höchstens ${n1(max)} : 1.`;
export const caZuHoch =
  "Calcium liegt über dem FEDIAF-Höchstwert für wachsende Tiere. Gerade im Wachstum zählt das Gleichgewicht. Deshalb höchstens „mangelhaft“.";
export const caZuHochAdult = "Calcium liegt über dem FEDIAF-Höchstwert für erwachsene Hunde. Deshalb höchstens „ausreichend“.";
export const caPFehlt =
  "Calcium und Phosphor stehen nicht auf dem Etikett. Viele Hersteller nennen sie auf Nachfrage. Ohne diese Werte vergeben wir höchstens „gut“.";
export const feuchteGeschaetzt = "Keine Feuchte angegeben. Wir rechnen mit 10 %, wie bei Trockenfutter üblich.";
export const ascheAuffaellig = (aTs: number) =>
  `Rohasche: ${n1(aTs)} % der Trockenmasse, außerhalb des Bands von 3 bis 12 %, das wir als unauffällig ansehen. Das kann auf viel Knochen oder Mineralzusatz hindeuten. Was genau drin ist, sagt die Summe nicht.`;
export const ascheOk = (aTs: number) => `Rohasche: ${n1(aTs)} % der Trockenmasse, unauffällig (Band 3 bis 12 %, eigene Festlegung).`;
export const nfeInfo = (nfeTs: number) => `Rechnerischer Rest (NfE): ${n0(nfeTs)} % der Trockenmasse, vor allem Stärke. Information, keine Bewertung.`;
export const taurinFehlt =
  "Taurin ist für Katzen lebensnotwendig. Auf der Packung steht meist nur die zugesetzte Menge. Ohne Angabe prüfen wir es nicht.";
export const taurinText = (ts: number, min: number, ok: boolean) =>
  ok ? `Taurin: ${n2(ts)} % der Trockenmasse, Minimum ${n2(min)} %.` : `Taurin: ${n2(ts)} % der Trockenmasse, unter dem Minimum von ${n2(min)} %.`;

export const MENGEN_HINWEIS = "Startwert. Wiegen Sie Ihr Tier alle zwei bis vier Wochen und passen Sie die Menge an.";
export const WELPEN_HINWEIS = "Für Welpen ist ein Futter mit Angabe „für Welpen/Wachstum“ der sichere Weg. Welpen nicht zur freien Verfügung füttern und das Gewicht regelmäßig mit der Wachstumskurve abgleichen.";
export const ERKRANKUNG_HINWEIS = "Hat Ihr Tier eine Erkrankung, klärt die Tierarztpraxis, welches Futter passt. Der Rechner ist dafür nicht gedacht.";
export const FASER_HINWEIS = "Rohfaser über 8 % der Trockenmasse: Die Energie wird bei Hunden eher unterschätzt.";
export const ERGAENZUNG_TEXT =
  "Ergänzungsfutter deckt allein nicht den ganzen Bedarf. Eine Note nach Alleinfutter-Maßstäben wäre deshalb nicht aussagekräftig.";
export const NUR_NAEHRWERTE =
  "Diese Note bewertet nur die Nährwerte, die Sie eingegeben haben. Zutaten, Rohstoffqualität und Zusatzstoffe kann ein Rechner nicht prüfen. Dafür gibt es unsere Tests.";
export const NICHT_GEZEIGT_VORN =
  "Woher das Protein stammt, wie viel Fleisch drin ist, welche Zusatzstoffe zugesetzt wurden und wie die Rohstoffe verarbeitet sind, steht nicht in den Analysewerten. Das prüfen wir in unseren";
export const GUTE_WERTE = "Gute Werte machen noch kein gutes Futter.";
