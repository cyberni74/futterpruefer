import type { LayoutData } from "./schema";

const STUFEN = {
  BELEGT: { klasse: "good", label: "BELEGT" },
  PLAUSIBEL: { klasse: "warn", label: "PLAUSIBEL" },
  NICHT_VERIFIZIERT: { klasse: "bad", label: "NICHT VERIFIZIERT" },
} as const;

/** Evidenz-Karten mit Einstufung. Die Einstufung steht als Text, nicht nur als Farbe. */
export function ScientificEvidence({ evidenz }: { evidenz?: LayoutData["evidenz"] }) {
  if (!evidenz?.length) return null;
  return (
    <ul className="evidence-list">
      {evidenz.map((e) => {
        const s = STUFEN[e.status];
        return (
          <li key={e.aussage} className={`evidence ${s.klasse}`}>
            <div className="evidence-label">{s.label}</div>
            <strong>{e.aussage}</strong>
            {e.quelle && <p>Quelle: {e.quelle}</p>}
          </li>
        );
      })}
    </ul>
  );
}
