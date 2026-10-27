import type { Ergebnis, FutterInput, TierInput } from "./types";
import { bewerte, type BewertungsOptionen } from "./bewertung";

export type Eingabe = {
  futter: FutterInput;
  tier: TierInput;
  /** Ergänzungsfutter oder Snack: keine Note, nur Energie und Leckerli-Budget */
  ergaenzung?: boolean;
  stueckGramm?: number | null;
};

/** Reine Funktion: Eingabe → Ergebnis. Läuft nur im Browser, nichts wird gespeichert. Die Optionen überschreiben die Schalter aus fediaf.ts nur für Tests. */
export function berechne(eingabe: Eingabe, optionen?: BewertungsOptionen): Ergebnis {
  return bewerte(eingabe, optionen);
}

export type { BewertungsOptionen } from "./bewertung";
export * from "./types";
export { NOTEN, NOTEN_REIHE } from "./fediaf";
