import { Gauge } from "./Gauge";

/** Tacho eines Kriteriums mit eigenem Maximum, füllt sich zu punkte/max. */
export function CriterionScoreGauge({ punkte, max }: { punkte: number; max: number }) {
  return <Gauge punkte={punkte} max={max} />;
}
