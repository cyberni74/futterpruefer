import { AMPEL_FARBE, TACHO_HINTERGRUND, ampelFuerAnteil, tachoAnteil, tachoPfad } from "./rechnen";

const zahl = (x: number) => new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(x);

/**
 * Halbkreis-Tacho aus geometrisch berechneten Bögen (Start links, Endpunkt aus punkte/max, nie über 180°).
 * Farbe nach Ampel (68 % / 51 %, Version 1: 80 % / 60 %). Kein stroke-dasharray.
 *
 * Die Punktzahl und „/100“ stehen untereinander. In einer Zeile würde „91,8/100“
 * bei fontSize 44 den Innenbogen (Radius 78, Mitte 100/104) seitlich überlaufen,
 * besonders sichtbar auf etwa 390 px Breite.
 */
export function Gauge({ punkte, max, gross = false, methodikVersion }: { punkte: number; max: number; gross?: boolean; methodikVersion?: string | null }) {
  const pfad = tachoPfad(punkte, max);
  const farbe = AMPEL_FARBE[ampelFuerAnteil(tachoAnteil(punkte, max), methodikVersion)];
  const score = zahl(punkte);
  const maxLabel = zahl(max);
  const scoreSize = gross ? 32 : 26;
  const maxSize = gross ? 14 : 12;
  const scoreY = gross ? 76 : 80;
  const maxY = gross ? 96 : 98;
  const punkteY = gross ? 121 : 119;
  return (
    <div role="img" aria-label={`${score} von ${maxLabel} Punkten`} className={`gauge ${gross ? "gauge--large" : "gauge--small"}`}>
      <svg aria-hidden="true" viewBox="0 0 200 133" width="100%" focusable="false">
        <path d={TACHO_HINTERGRUND} fill="none" stroke="#d9e8de" strokeLinecap="round" strokeWidth="13" />
        {pfad && <path d={pfad} fill="none" stroke={farbe} strokeLinecap="round" strokeWidth="13" />}
        <text x="100" y={scoreY} textAnchor="middle" fill="#163f30" fontSize={scoreSize} fontWeight="800">
          {score}
        </text>
        <text x="100" y={maxY} textAnchor="middle" fill="#163f30" fontSize={maxSize} fontWeight="500">
          /{maxLabel}
        </text>
        <text x="100" y={punkteY} textAnchor="middle" fill="#587465" fontSize="10" fontWeight="600">PUNKTE</text>
      </svg>
    </div>
  );
}
