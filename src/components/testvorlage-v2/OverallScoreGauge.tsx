import { Gauge } from "./Gauge";

/** Haupttacho: zeigt immer die Gesamtwertung (bei gültigen Daten gleich der Summe der Kriterien). */
export function OverallScoreGauge({ punkte, max = 100 }: { punkte: number; max?: number }) {
  return <Gauge punkte={punkte} max={max} gross />;
}
