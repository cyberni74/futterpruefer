import type { ReactNode } from "react";
import type { LayoutData } from "./schema";
import { OverallScoreGauge } from "./OverallScoreGauge";

/** Kopfbereich der Vorlage ohne H1 (die Seite liefert die einzige H1). */
export function ProductTestHero({ hero, totalScore, ampelLabel, kopf, methodikVersion }: { hero?: LayoutData["hero"]; totalScore: number; ampelLabel: string; kopf?: ReactNode; methodikVersion?: string | null }) {
  return (
    <div className="hero">
      <div className="copy">
        <div className="eyebrow brand">Futterprüfer</div>
        {kopf}
        {hero?.titel && <p className="hero-sub">{hero.titel}</p>}
        {hero?.untertitel && <p className="hero-lead">{hero.untertitel}</p>}
        {hero?.tags?.length ? <ul className="pills" aria-label="Schlagworte">{hero.tags.map((t) => <li key={t} className="pill">{t}</li>)}</ul> : null}
      </div>
      <div className="score-card">
        <div className="eyebrow">Gesamtwertung</div>
        <OverallScoreGauge punkte={totalScore} methodikVersion={methodikVersion} />
        {/* Notenwort aus dem DB-Patch. Ohne Patch bleibt das Ampel-Label; noteFuerPunkte rechnet die Note hier nicht. */}
        <div className="grade">{hero?.notenwort || ampelLabel}</div>
        {hero?.gesamturteil && <p className="score-sub">{hero.gesamturteil}</p>}
      </div>
    </div>
  );
}
