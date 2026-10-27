import type { ReactNode } from "react";

export const nn = (n: number) => String(n).padStart(2, "0");

/** Gemeinsamer Kapitelrahmen: Nummer, H2 mit stabiler id. */
export function TvSection({ id, nummer, label, titel, children, final = false }: { id: string; nummer: number; label: string; titel: string; children?: ReactNode; final?: boolean }) {
  const kopf = (
    <>
      <div className="section-number">{nn(nummer)} / {label}</div>
      <h2 id={`${id}-h`}>{titel}</h2>
    </>
  );
  return final ? (
    <section className="section final" id={id} aria-labelledby={`${id}-h`}>
      <div className="final-head">{kopf}</div>
      <div className="final-body">{children}</div>
    </section>
  ) : (
    <section className="section" id={id} aria-labelledby={`${id}-h`}>
      {kopf}
      {children}
    </section>
  );
}
