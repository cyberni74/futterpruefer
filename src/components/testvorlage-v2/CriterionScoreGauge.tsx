import { Gauge } from "./Gauge";

/** Tacho eines Kriteriums mit eigenem Maximum, füllt sich zu punkte/max. */
export function CriterionScoreGauge({ punkte, max, methodikVersion }: { punkte: number; max: number; methodikVersion?: string | null }) {
  return <Gauge punkte={punkte} max={max} methodikVersion={methodikVersion} />;
}
