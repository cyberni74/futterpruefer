import type { Ergebnis, FutterInput, TierInput } from "./types";
import { bewerte } from "./bewertung";

export type Eingabe = {
  futter: FutterInput;
  tier: TierInput;
  /** Ergänzungsfutter oder Snack: keine Note, nur Energie und Leckerli-Budget */
  ergaenzung?: boolean;
  stueckGramm?: number | null;
};

/** Reine Funktion: Eingabe → Ergebnis. Läuft nur im Browser, nichts wird gespeichert. */
export function berechne(eingabe: Eingabe): Ergebnis {
  return bewerte(eingabe);
}

export * from "./types";
export { NOTEN, NOTEN_REIHE } from "./fediaf";
