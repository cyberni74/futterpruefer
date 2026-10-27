/** Geometrie des Halbkreis-Tachos: Mittelpunkt (100,104), Radius 78, Start links (22,104). */
const CX = 100;
const CY = 104;
const R = 78;

const f3 = (x: number) => x.toFixed(3);

export function tachoAnteil(punkte: number, max: number): number {
  if (!(max > 0) || !Number.isFinite(punkte)) return 0;
  return Math.min(1, Math.max(0, punkte / max));
}

/** Endpunkt des gefüllten Bogens. Winkel von 180° (links) bis 0° (rechts), der Bogen bleibt ≤ 180°. */
export function tachoEndpunkt(anteil: number): { x: number; y: number } {
  const w = Math.PI * (1 - anteil);
  return { x: CX + R * Math.cos(w), y: CY - R * Math.sin(w) };
}

export const TACHO_HINTERGRUND = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`;

/** Pfad des gefüllten Bogens (Referenz gaugeArc des Designsystems: Radius 78, Mitte 100/104, Start 22/104, 3 Nachkommastellen). Bei 0 Punkten null. */
export function tachoPfad(punkte: number, max: number): string | null {
  const a = tachoAnteil(punkte, max);
  if (a <= 0) return null;
  const e = tachoEndpunkt(a);
  return `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${f3(e.x)} ${f3(e.y)}`;
}

export type Ampel = "gut" | "mittel" | "schlecht";
export const ampelFuerAnteil = (a: number): Ampel => (a >= 0.8 ? "gut" : a >= 0.6 ? "mittel" : "schlecht");
export const AMPEL_FARBE: Record<Ampel, string> = { gut: "#17845f", mittel: "#bb8c31", schlecht: "#b64c48" };

export type Kosten = { tagesdosis: number; menge: number; packungen: number; teilkosten: number | null; kaufpreis: number | null };

/**
 * Logik des Kostenrechners: Tagesdosis = Dosis je kg × Körpergewicht, Menge = Tagesdosis × Tage,
 * Teilkosten anteilig, benötigte Packungen aufgerundet, Kaufpreis ganze Packungen.
 */
export function berechneKosten(o: { preis: number | null; dosisProKg: number; koerpergewicht: number; tage: number; inhalt: number }): Kosten {
  const tagesdosis = o.dosisProKg * o.koerpergewicht;
  const menge = tagesdosis * o.tage;
  const gueltig = Number.isFinite(menge) && o.inhalt > 0;
  const packungen = gueltig ? Math.max(0, Math.ceil(menge / o.inhalt - 1e-9)) : 0;
  const ok = gueltig && o.preis != null && Number.isFinite(o.preis) && o.preis >= 0;
  return {
    tagesdosis: gueltig ? tagesdosis : 0,
    menge: gueltig ? menge : 0,
    packungen,
    teilkosten: ok ? (o.preis! * menge) / o.inhalt : null,
    kaufpreis: ok ? o.preis! * packungen : null,
  };
}
