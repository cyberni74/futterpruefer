import type { LayoutData } from "./schema";
import { CriterionScoreGauge } from "./CriterionScoreGauge";

/** Kriterien-Tachos, 5 oder 6 Karten (auch andere Anzahl). Jede Karte hat ihr eigenes Maximum. */
export function ScoreBreakdown({ kriterien, urteil, methodikVersion }: { kriterien?: LayoutData["kriterien"]; urteil?: LayoutData["urteil"]; methodikVersion?: string | null }) {
  return (
    <>
      {urteil?.intro && <p className="intro">{urteil.intro}</p>}
      {kriterien?.length ? (
        <ul className="metrics" aria-label="Bewertung nach Kriterien">
          {kriterien.map((k) => (
            <li key={k.name} className="metric">
              <h3>{k.name}</h3>
              <CriterionScoreGauge punkte={k.punkte} max={k.max} methodikVersion={methodikVersion} />
              {k.kurz && <p className="metric-sub">{k.kurz}</p>}
              {k.begruendung && (
                <details>
                  <summary>Begründung</summary>
                  <p>{k.begruendung}</p>
                </details>
              )}
            </li>
          ))}
        </ul>
      ) : null}
      {urteil?.hervorhebung && <div className="summary-strip"><strong>{urteil.hervorhebung}</strong></div>}
    </>
  );
}
