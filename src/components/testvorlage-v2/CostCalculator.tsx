"use client";

import { useId, useState } from "react";
import { berechneKosten } from "./rechnen";
import { EINHEITEN, type Einheit } from "./schema";

const EUR = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const ZAHL = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 });

export type CostCalculatorProps = {
  preis: number;
  inhalt: number;
  einheit: Einheit;
  dosisProKg: number;
  koerpergewicht: number;
  tage: number;
  tageOptionen?: number[];
  hinweis?: string;
};

const parse = (s: string): number | null => (s.trim() === "" ? null : Number(s.replace(",", ".")));

/** Preis, Körpergewicht und Zeitraum → Tagesdosis, Teilkosten, benötigte Packungen und Kaufpreis. Läuft komplett im Browser. */
export function CostCalculator(p: CostCalculatorProps) {
  const id = useId();
  const e = EINHEITEN[p.einheit];
  const [preis, setPreis] = useState(String(p.preis).replace(".", ","));
  const [gewicht, setGewicht] = useState(String(p.koerpergewicht).replace(".", ","));
  const [tage, setTage] = useState(p.tage);
  const g = parse(gewicht);
  const k = berechneKosten({ preis: parse(preis), dosisProKg: p.dosisProKg, koerpergewicht: g != null && g > 0 ? g : 0, tage, inhalt: p.inhalt });
  const tageListe = [...new Set([...(p.tageOptionen?.length ? p.tageOptionen : [7, 14, 30, 60, 90]), p.tage])].sort((a, b) => a - b);
  return (
    <div className="calculator" role="group" aria-label="Kostenrechner">
      <div className="form-row">
        <div>
          <label htmlFor={`${id}-preis`}>Preis je Packung (€)</label>
          <input id={`${id}-preis`} type="text" inputMode="decimal" autoComplete="off" value={preis} onChange={(ev) => setPreis(ev.target.value)} />
        </div>
        <div>
          <label htmlFor={`${id}-kg`}>Körpergewicht (kg)</label>
          <input id={`${id}-kg`} type="text" inputMode="decimal" autoComplete="off" value={gewicht} onChange={(ev) => setGewicht(ev.target.value)} />
        </div>
        <div>
          <label htmlFor={`${id}-tage`}>Zeitraum</label>
          <select id={`${id}-tage`} value={tage} onChange={(ev) => setTage(Number(ev.target.value))}>
            {tageListe.map((o) => <option key={o} value={o}>{o} Tage</option>)}
          </select>
        </div>
      </div>
      <div className="result" aria-live="polite">
        <div className="kicker">KOSTEN FÜR DEN ZEITRAUM</div>
        <div className="big" data-testid="teilkosten">{k.teilkosten == null ? "–" : EUR.format(k.teilkosten)}</div>
        <div className="mini">Für {tage} Tage</div>
      </div>
      <div className="calc-mini">
        <div><strong data-testid="tagesdosis">{ZAHL.format(k.tagesdosis)} {e}</strong><small>pro Tag</small></div>
        <div><strong data-testid="packungen">{k.packungen}</strong><small>Packungen nötig</small></div>
        <div><strong data-testid="kaufpreis">{k.kaufpreis == null ? "–" : EUR.format(k.kaufpreis)}</strong><small>Kaufpreis</small></div>
      </div>
      <p className="mini" style={{ marginTop: 15 }}>
        {p.hinweis || `Eine Packung enthält ${ZAHL.format(p.inhalt)} ${e}, die Tagesdosis beträgt ${ZAHL.format(p.dosisProKg)} ${e} je kg Körpergewicht. Die Teilkosten rechnen anteilig, der Kaufpreis ganze Packungen.`}
      </p>
    </div>
  );
}
