import type { LayoutData } from "./schema";

const prozent = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });

/** Herstellerangaben mit Balken (role=meter, Zahl steht zusätzlich als Text). */
export function ManufacturerClaims({ angaben }: { angaben?: LayoutData["herstellerangaben"] }) {
  if (!angaben?.length) return null;
  return (
    <ul className="makers">
      {angaben.map((h) => (
        <li key={h.label} className="maker">
          <div className="maker-row"><span>{h.label}</span><span>{prozent.format(h.prozent)} %</span></div>
          <div className="meter" role="meter" aria-label={h.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={h.prozent}><span style={{ width: `${Math.min(100, Math.max(0, h.prozent))}%` }} /></div>
        </li>
      ))}
    </ul>
  );
}
