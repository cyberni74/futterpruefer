import type { ReactNode } from "react";

/** Gemeinsamer Rahmen der sechs Infografiken (Konzept 8.0): echter Text, Quellenzeile, Fußzeile. */
export function Rahmen({ nr, datei, titel, alt, quelle, children }: { nr: number; datei: string; titel: string; alt: string; quelle: string; children: ReactNode }) {
  return (
    <figure
      id={`infografik-${nr}`} data-infografik={nr} data-dateiname={`${datei}.webp`} role="group" aria-label={alt}
      className="not-prose my-6 overflow-hidden rounded-3xl border border-border bg-bg-soft p-4 shadow-card sm:p-6"
    >
      <p className="font-display text-xl font-extrabold leading-tight text-brand-strong sm:text-2xl">{titel}</p>
      <div className="mt-4 space-y-4">{children}</div>
      <figcaption className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted">
        <span>Quelle: {quelle}</span>
        <span className="font-bold text-accent">futterprüfer.de/futterrechner</span>
      </figcaption>
    </figure>
  );
}

export const Karte = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-border bg-surface p-4 ${className}`}>{children}</div>
);
