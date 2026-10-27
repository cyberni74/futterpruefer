/**
 * Fazit-Box „Unser Fazit“ im Pollmer-Stil (Zusatz 2, Manni 27.10.2026).
 * PLATZHALTER: Die Texte liefert die Redaktion, die Rechtsprüfung prüft sie. Bis zur Freigabe bleibt
 * FAZIT_FREIGEGEBEN auf false, die Box wird nicht angezeigt. Nicht live schalten, bevor die Texte freigegeben sind.
 */
export const FAZIT_FREIGEGEBEN = false;

export type Ampelstufe = "gruen" | "gelb" | "rot";
export type FazitTexte = Record<"hund" | "katze", Record<Ampelstufe, string[]>>;

/** Je Tierart und Ampelstufe (Grün ab 80, Gelb 60–79, Rot darunter) ein oder mehrere Bausteine mit 2–4 Sätzen. */
export const FAZIT_TEXTE: FazitTexte = {
  hund: {
    gruen: ["[Platzhalter Fazit Hund Grün: Redaktion liefert Text]"],
    gelb: ["[Platzhalter Fazit Hund Gelb: Redaktion liefert Text]"],
    rot: ["[Platzhalter Fazit Hund Rot: Redaktion liefert Text]"],
  },
  katze: {
    gruen: ["[Platzhalter Fazit Katze Grün: Redaktion liefert Text]"],
    gelb: ["[Platzhalter Fazit Katze Gelb: Redaktion liefert Text]"],
    rot: ["[Platzhalter Fazit Katze Rot: Redaktion liefert Text]"],
  },
};

export const ampelstufeFuer = (score: number): Ampelstufe => (score >= 80 ? "gruen" : score >= 60 ? "gelb" : "rot");

/** Gibt nur dann einen Text zurück, wenn die Freigabe vorliegt. */
export function fazitFuer(art: "hund" | "katze", score: number, freigegeben = FAZIT_FREIGEGEBEN): string | null {
  if (!freigegeben) return null;
  return FAZIT_TEXTE[art][ampelstufeFuer(score)][0] ?? null;
}
