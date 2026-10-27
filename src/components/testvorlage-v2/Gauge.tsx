import { AMPEL_FARBE, TACHO_HINTERGRUND, ampelFuerAnteil, tachoAnteil, tachoPfad } from "./rechnen";

const zahl = (x: number) => new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(x);

/**
 * Halbkreis-Tacho aus geometrisch berechneten Bögen (Start links, Endpunkt aus punkte/max, nie über 180°).
 * Farbe nach Ampel (80 % / 60 %). Kein stroke-dasharray.
 */
export function Gauge({ punkte, max, gross = false }: { punkte: number; max: number; gross?: boolean }) {
  const pfad = tachoPfad(punkte, max);
  const farbe = AMPEL_FARBE[ampelFuerAnteil(tachoAnteil(punkte, max))];
  return (
    <div role="img" aria-label={`${zahl(punkte)} von ${zahl(max)} Punkten`} className={`gauge ${gross ? "gauge--large" : "gauge--small"}`}>
      <svg aria-hidden="true" viewBox="0 0 200 133" width="100%" focusable="false">
        <path d={TACHO_HINTERGRUND} fill="none" stroke="#d9e8de" strokeLinecap="round" strokeWidth="13" />
        {pfad && <path d={pfad} fill="none" stroke={farbe} strokeLinecap="round" strokeWidth="13" />}
        <text x="100" y="85" textAnchor="middle" fill="#163f30" fontSize={gross ? 44 : 36} fontWeight="800">
          {zahl(punkte)}
          <tspan fontSize="15" fontWeight="500">/{zahl(max)}</tspan>
        </text>
        <text x="100" y="119" textAnchor="middle" fill="#587465" fontSize="10" fontWeight="600">PUNKTE</text>
      </svg>
    </div>
  );
}
