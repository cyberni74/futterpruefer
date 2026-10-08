import { dryMatter, type AnalysisRow } from "@/lib/product-data";

const fmt = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Analytische Bestandteile (Originalsubstanz) und – falls Feuchte bekannt – Trockensubstanz als Balkendiagramm. */
export function AnalysisTable({ rows }: { rows: AnalysisRow[] }) {
  if (!rows?.length) return null;
  const dm = dryMatter(rows);
  const max = dm ? Math.max(...dm.map((r) => r.value), 1) : 1;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <table className="w-full text-sm">
        <caption className="mb-2 text-left text-xs font-bold uppercase tracking-wide text-muted">Laut Deklaration</caption>
        <thead className="sr-only"><tr><th scope="col">Bestandteil</th><th scope="col">Gehalt</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-border">
              <th scope="row" className="py-2.5 pr-3 text-left font-medium">{r.name}</th>
              <td className="py-2.5 text-right font-bold tabular-nums">{fmt(r.value)} %</td>
            </tr>
          ))}
        </tbody>
      </table>
      {dm && dm.length > 0 && (
        <figure>
          <figcaption className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">In der Trockensubstanz</figcaption>
          <ul className="space-y-2.5">
            {dm.map((r) => (
              <li key={r.name} className="text-sm">
                <div className="mb-1 flex justify-between gap-2"><span>{r.name}</span><span className="font-bold tabular-nums">{fmt(r.value)} %</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-border" aria-hidden>
                  <div className="h-full w-full origin-left rounded-full bg-brand" style={{ transform: `scaleX(${r.value / max})` }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted">Umgerechnet ohne Feuchtigkeit – so lassen sich Nass- und Trockenfutter vergleichen.</p>
        </figure>
      )}
    </div>
  );
}
