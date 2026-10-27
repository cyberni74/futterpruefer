"use client";

import { useEffect, useId, useRef, useState } from "react";
import { parseZahl } from "@/lib/futterrechner/validierung";

const fmt = (x: number, step: number) => {
  const dec = step >= 1 ? 0 : step >= 0.1 ? 1 : 2;
  return new Intl.NumberFormat("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: Math.max(dec, 2) }).format(x);
};

export type Marker = { wert: number; label: string };

/** Regler + Zahlenfeld (6.2). Natives <input type="range">, Zahlenfeld synchron, Startzustand „noch nicht gesetzt“. */
export function ValueSlider({
  label, einheit, value, onChange, min, max, step, platzhalter, marker, fehler, warnung, hilfe, valueText, mitte, skala, textAnzeige, id: idProp, fehlt,
}: {
  label: string; einheit: string; value: number | null; onChange: (v: number | null) => void;
  min: number; max: number; step: number; platzhalter: number; marker?: Marker | null;
  fehler?: string; warnung?: string; hilfe?: string; valueText?: (v: number) => string; mitte?: string;
  /** Regler arbeitet in Positionen (zweiteilige Skala); Zahlenfeld in echten Werten. */
  skala?: { max: number; zuPos: (v: number) => number; vonPos: (p: number) => number };
  /** Statt Zahlenfeld nur Text (z. B. „17 Wochen“); value/min/max sind dann Positionen. */
  textAnzeige?: (v: number) => string;
  /** Stabile Feld-ID (Fokus bei fehlenden Pflichtangaben); der Regler hat die ID `${id}-r`. */
  id?: string;
  /** Pflichtangabe fehlt nach Klick auf „Jetzt Futter analysieren“ */
  fehlt?: boolean;
}) {
  const gen = useId();
  const id = idProp ?? gen;
  const labelId = `${id}-l`;
  const descId = `${id}-d`;
  const [text, setText] = useState(value == null ? "" : fmt(value, step));
  const [aktiv, setAktiv] = useState(false);
  const [ungueltig, setUngueltig] = useState(false);
  const fokus = useRef(false);

  useEffect(() => {
    if (!fokus.current) setText(value == null ? "" : fmt(value, step));
  }, [value, step]);

  const anzeige = value ?? platzhalter;
  const rMin = skala ? 0 : min;
  const rMax = skala ? skala.max : max;
  const rStep = skala ? 1 : step;
  const rWert = skala ? skala.zuPos(anzeige) : anzeige;
  const pos = (v: number) => Math.min(100, Math.max(0, ((v - rMin) / (rMax - rMin)) * 100));
  const pct = pos(rWert);
  const ausserhalb = !textAnzeige && value != null && (value < min || value > max);
  const markerPct = marker && !skala ? pos(marker.wert) : null;
  const tone = value == null || !marker ? undefined : value < marker.wert * 0.9 ? "bad" : value < marker.wert ? "mid" : undefined;
  const beschr = [hilfe, ausserhalb ? "Außerhalb des üblichen Bereichs." : null, fehler, warnung, fehlt].filter(Boolean).length ? descId : undefined;

  return (
    <div id={`${id}-feld`} className={`py-1 ${fehlt ? "-mx-2 rounded-2xl px-2 ring-2 ring-accent" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <label id={labelId} htmlFor={`${id}-r`} className="text-sm font-bold">{label}</label>
        {textAnzeige ? (
          <span className="font-display text-xl font-bold tabular-nums">{value == null ? <span className="text-sm font-normal text-muted">bitte wählen</span> : textAnzeige(value)}</span>
        ) : (
        <span className="flex shrink-0 items-center gap-1.5">
          <input
            type="text" inputMode="decimal" autoComplete="off" aria-labelledby={labelId} aria-invalid={fehler || ungueltig || fehlt ? true : undefined}
            aria-describedby={beschr} placeholder={`typ. ${fmt(platzhalter, step)}`} value={text}
            onFocus={() => (fokus.current = true)}
            onBlur={() => { fokus.current = false; setText(value == null ? "" : fmt(value, step)); setUngueltig(false); }}
            onChange={(e) => {
              setText(e.target.value);
              const n = parseZahl(e.target.value);
              if (Number.isNaN(n)) setUngueltig(true);
              else { setUngueltig(false); onChange(n); }
            }}
            className="font-display h-11 w-[5.5rem] rounded-xl border border-border bg-bg-soft px-2 text-right text-xl font-bold tabular-nums placeholder:text-sm placeholder:font-normal placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          />
          <span className="w-8 text-sm text-muted">{einheit}</span>
        </span>
        )}
      </div>
      <div className="relative">
        {aktiv && value != null && (
          <span aria-hidden className="pointer-events-none absolute -top-5 z-10 -translate-x-1/2 rounded-lg bg-brand px-2 py-0.5 text-xs font-bold tabular-nums text-white dark:text-black" style={{ left: `calc(${pct}% + ${(0.5 - pct / 100) * 28}px)` }}>
            {fmt(value, step)}
          </span>
        )}
        <input
          id={`${id}-r`} type="range" min={rMin} max={rMax} step={rStep} value={Math.min(rMax, Math.max(rMin, rWert))}
          className="fp-range" data-unset={value == null} data-tone={tone} style={{ ["--pct" as string]: `${pct}%` }}
          aria-labelledby={labelId} aria-describedby={beschr} aria-invalid={fehlt ? true : undefined}
          aria-valuetext={value == null ? "noch nicht gesetzt" : valueText ? valueText(value) : `${fmt(value, step)} ${einheit}`}
          onChange={(e) => { const n = Number(e.target.value); onChange(skala ? skala.vonPos(n) : n); }}
          onPointerDown={() => { setAktiv(true); if (value == null) onChange(platzhalter); }}
          onPointerUp={() => setAktiv(false)} onPointerCancel={() => setAktiv(false)} onBlur={() => setAktiv(false)}
        />
        {markerPct != null && marker && (
          <span aria-hidden className="pointer-events-none absolute top-[0.9rem] h-3 w-0.5 -translate-y-1/2 bg-fg/70" style={{ left: `calc(${markerPct}% + ${(0.5 - markerPct / 100) * 28}px)` }} />
        )}
      </div>
      <div className="relative flex justify-between text-xs tabular-nums text-muted">
        <span>{textAnzeige ? textAnzeige(min) : fmt(min, step)}</span>
        {mitte && <span className="text-center">{mitte}</span>}
        <span>{textAnzeige ? textAnzeige(max) : fmt(max, step)}</span>
      </div>
      {marker && <p className="mt-1 text-xs font-semibold text-fg"><span aria-hidden>▏</span>{marker.label}</p>}
      <div id={descId} className="space-y-0.5 text-xs">
        {hilfe && <p className="text-muted">{hilfe}</p>}
        {ausserhalb && <p className="text-muted">Außerhalb des üblichen Bereichs, der Wert wird trotzdem verwendet.</p>}
        {ungueltig && <p role="alert" className="font-semibold text-bad">Bitte eine Zahl eingeben.</p>}
        {fehler && <p role="alert" className="font-semibold text-bad">{fehler}</p>}
        {fehlt && <p className="font-bold text-accent">Hier fehlt noch Ihre Angabe</p>}
        {warnung && !fehler && <p className="font-semibold text-mid">{warnung}</p>}
      </div>
    </div>
  );
}
