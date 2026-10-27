import type { LayoutData } from "./schema";
import { OverallScoreGauge } from "./OverallScoreGauge";

/** Kopfbereich der Vorlage ohne H1 (die Seite liefert die einzige H1). */
export function ProductTestHero({ hero, totalScore, ampelLabel }: { hero?: LayoutData["hero"]; totalScore: number; ampelLabel: string }) {
  return (
    <div className="hero">
      <div className="copy">
        {hero?.titel && <div className="eyebrow">{hero.titel}</div>}
        {hero?.untertitel && <p className="hero-lead">{hero.untertitel}</p>}
        {hero?.tags?.length ? <ul className="pills" aria-label="Schlagworte">{hero.tags.map((t) => <li key={t} className="pill">{t}</li>)}</ul> : null}
      </div>
      <div className="score-card">
        <div className="eyebrow">Gesamtwertung</div>
        <OverallScoreGauge punkte={totalScore} />
        <div className="grade">{hero?.notenwort || ampelLabel}</div>
        {hero?.gesamturteil && <p className="score-sub">{hero.gesamturteil}</p>}
      </div>
    </div>
  );
}
