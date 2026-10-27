import type { Eingabe } from "./index";
import type { ErgebnisOk } from "./types";
import { ASCHE_BAND, FASER_GRENZE_HUND } from "./fediaf";
import type { RisikoId } from "./risiken-daten";

export { QUELLEN, RISIKEN } from "./risiken-daten";
export type { QuelleId, Risiko, RisikoId, Teil } from "./risiken-daten";

export type Stufe = "warn" | "bad";
export type RisikoTreffer = { id: RisikoId; art: Stufe };
export type RisikoGrund = "protein" | "fett" | "ca" | "taurin" | "asche" | "faser";
export type RisikoAuswahl = Partial<Record<RisikoGrund, RisikoTreffer[]>>;

/** Pflichtzeile über der ersten Box (Rechtsprüfung A4, normale Textgröße, immer sichtbar). */
export const RISIKO_PFLICHTZEILE =
  "Mögliche Folgen beschreiben allgemeine Risiken bei dauerhafter Fütterung, abgeleitet aus den eingegebenen Etikettwerten. Sie sind keine Diagnose für Ihr Tier. Zeigt Ihr Tier Auffälligkeiten, ist die Tierarztpraxis die richtige Adresse.";

/** Höchstens 2 Boxen je Kriterium, insgesamt höchstens 4 offen (Anzeige in der Ergebnis-Karte). */
export const MAX_BOXEN_JE_KRITERIUM = 2;
export const MAX_OFFEN = 4;

type Ergebnisdaten = Pick<ErgebnisOk, "spalte" | "rp" | "rf" | "capr" | "taurin" | "aTs" | "faTs" | "feuchte">;

/**
 * Trigger nach Abschnitt 2 von docs/futterrechner/risikotexte.md. Reine Funktion; Schwellen aus fediaf.ts und dem Ergebnis.
 * Status: Protein/Fett gelb bei 0,9 ≤ r < 1, rot bei r < 0,9. Calcium/Phosphor siehe Tabelle 2.3.
 */
export function risikenFuer(e: Ergebnisdaten, eingabe: Pick<Eingabe, "futter" | "tier">): RisikoAuswahl {
  const { tier, futter } = eingabe;
  const out: RisikoAuswahl = {};
  const hund = tier.art === "hund";
  const wachstum = e.spalte.startsWith("wachstum");
  const welpe = hund && wachstum;
  const stufe = (r: number): Stufe => (r < 0.9 ? "bad" : "warn");

  // 2.1 Protein
  if (e.rp < 1) {
    const id: RisikoId = hund
      ? wachstum ? "R-P-WELPE" : e.spalte === "adult110" ? "R-P-HUND-ADULT" : "R-P-HUND-GERING"
      : wachstum ? "R-P-KITTEN" : "R-P-KATZE-ADULT";
    out.protein = [{ id, art: stufe(e.rp) }];
  }
  // 2.1 Fett
  if (e.rf < 1) {
    const id: RisikoId = hund ? (welpe ? "R-F-WELPE" : "R-F-HUND") : "R-F-KATZE";
    out.fett = [{ id, art: stufe(e.rf) }];
  }
  // 2.2 Taurin (nur Katze, nur wenn angegeben)
  if (!hund && e.taurin && futter.taurinMgKg != null && e.taurin.ts < e.taurin.min) {
    const nass = futter.typ === "nass" || e.feuchte >= 60;
    out.taurin = [{ id: nass ? "R-T-KATZE-NASS" : "R-T-KATZE", art: "bad" }];
  }
  // 2.3 Calcium und Phosphor (nur wenn beide angegeben); Priorität Ca hoch → Ca niedrig → Ca:P → P
  if (e.capr) {
    const { ratio, caTs, pTs, regel } = e.capr;
    const nah = regel.rMin - 0.1 <= ratio && ratio <= regel.rMax + 0.1;
    const treffer: RisikoTreffer[] = [];
    if (hund && regel.caMax !== null && caTs > regel.caMax) {
      treffer.push({ id: welpe ? "R-CA-HOCH-WELPE" : "R-CA-HOCH-HUND", art: "bad" });
    }
    if (caTs < regel.caMin) {
      if (hund) treffer.push(welpe ? { id: "R-CA-NIEDRIG-WELPE", art: "bad" } : { id: "R-CA-NIEDRIG-HUND", art: nah ? "warn" : "bad" });
      else treffer.push({ id: "R-CA-NIEDRIG-KATZE", art: wachstum ? "bad" : nah ? "warn" : "bad" });
    }
    if (ratio < regel.rMin) {
      const id: RisikoId = hund ? (welpe ? "R-CAP-NIEDRIG-WELPE" : "R-CAP-NIEDRIG-HUND") : "R-CAP-NIEDRIG-KATZE";
      treffer.push({ id, art: nah ? "warn" : "bad" });
    } else if (ratio > regel.rMax) {
      treffer.push({ id: welpe ? "R-CAP-HOCH-WELPE" : "R-CAP-HOCH", art: nah ? "warn" : "bad" });
    }
    if (pTs < regel.pMin) treffer.push({ id: "R-PH-NIEDRIG", art: wachstum && hund ? "bad" : "warn" });
    else if (hund && !welpe && regel.pMax !== null && pTs > regel.pMax) treffer.push({ id: "R-PH-HOCH-HUND", art: "warn" });
    if (treffer.length) out.ca = treffer.slice(0, MAX_BOXEN_JE_KRITERIUM);
  }
  // 2.4 Rohasche, Rohfaser
  if (e.aTs > ASCHE_BAND.max) out.asche = [{ id: "R-ASCHE-HOCH", art: "warn" }];
  else if (e.aTs < ASCHE_BAND.min) out.asche = [{ id: "R-ASCHE-NIEDRIG", art: "warn" }];
  if (hund && e.faTs > FASER_GRENZE_HUND) out.faser = [{ id: "R-FASER-HUND", art: "warn" }];
  return out;
}

/** 2.5 Energie und Tagesmenge (Info, nicht „warn“). */
export function mengenRisiko(e: Pick<ErgebnisOk, "menge">, eingabe: Pick<Eingabe, "tier">): RisikoId | null {
  const t = eingabe.tier;
  if (t.art === "hund") return t.phase === "welpe" ? "R-MENGE-WELPE" : e.menge != null ? "R-MENGE-HUND" : null;
  return "R-MENGE-KATZE";
}
