import { priceCite } from "@/lib/review-seo";
import { formatDate } from "@/lib/site";

const eur = (n: number) => n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
const num = (v: unknown) => (v == null || v === "" ? null : Number.isFinite(Number(v)) ? Number(v) : null);

/** Mit Quelle der neue Satz, ohne Quelle der bisherige Preisstand. Nichts dazuerfinden. */
function priceLine(source: string | null | undefined, priceDate: Date | null | undefined): string {
  const stand = priceDate ? formatDate(priceDate) : "";
  if (source?.trim()) return `${priceCite(source, stand)}.`;
  if (stand) return `Preisstand: ${stand}.`;
  return "";
}

/** Preis pro kg bzw. Tagesration mit Stand-Datum. Blendet sich aus, wenn keine Preisangaben vorliegen. */
export function PriceBlock({ price, packageSize, pricePerKg, pricePerDay, priceDate, priceSource }: { price: unknown; packageSize?: string | null; pricePerKg: unknown; pricePerDay: unknown; priceDate: Date | null | undefined; priceSource?: string | null }) {
  const p = num(price);
  const kg = num(pricePerKg);
  const day = num(pricePerDay);
  if (p == null && kg == null && day == null) return null;
  const line = priceLine(priceSource, priceDate);
  return (
    <div>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {p != null && (
          <div className="rounded-2xl bg-bg-soft p-4"><dt className="text-xs font-bold uppercase tracking-wide text-muted">Packung{packageSize ? ` (${packageSize})` : ""}</dt><dd className="mt-1 text-xl font-extrabold tabular-nums">{eur(p)}</dd></div>
        )}
        {kg != null && (
          <div className="rounded-2xl bg-bg-soft p-4"><dt className="text-xs font-bold uppercase tracking-wide text-muted">Pro Kilogramm</dt><dd className="mt-1 text-xl font-extrabold tabular-nums">{eur(kg)}</dd></div>
        )}
        {day != null && (
          <div className="rounded-2xl bg-bg-soft p-4"><dt className="text-xs font-bold uppercase tracking-wide text-muted">Pro Tagesration</dt><dd className="mt-1 text-xl font-extrabold tabular-nums">{eur(day)}</dd></div>
        )}
      </dl>
      {line && <p className="mt-2 text-xs text-muted">{line} Preise können je nach Händler abweichen.</p>}
    </div>
  );
}
