import type { LayoutData } from "./schema";

/** Kennzahl-Kacheln (Wert plus Beschriftung). */
export function ProductFacts({ kennzahlen }: { kennzahlen?: LayoutData["kennzahlen"] }) {
  if (!kennzahlen?.length) return null;
  return (
    <ul className="stripe" aria-label="Kennzahlen">
      {kennzahlen.map((k) => (
        <li key={`${k.label}-${k.wert}`} className="small-stat"><b>{k.wert}</b><span>{k.label}</span>{k.sub && <span className="sub">{k.sub}</span>}</li>
      ))}
    </ul>
  );
}
