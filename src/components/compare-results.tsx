import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { classicCriteriaApply, criterionFailed, showsComparisonWinner } from "@/lib/compare-display";
import { CRITERIA, ratioRating, type CriterionKey } from "@/lib/scoring";
import { priceClassCell } from "@/lib/price-source";
import { PRICE_CLASS_LABEL } from "@/lib/site";
import { hyphenateCategory, reviewPath } from "@/lib/urls";
import { ScoreBadge } from "./score-badge";
import { FpImage } from "./fp-image";

const TONE = { gut: "bg-good", mittel: "bg-mid-fill", schlecht: "bg-bad" } as const;

export type CompareRow = {
  id: string;
  slug: string;
  title: string;
  imageUrl: string | null;
  imageAlt: string;
  imageBlur: string | null;
  totalScore: number;
  layout: string;
  verdict: string;
  priceClass: keyof typeof PRICE_CLASS_LABEL;
  pricePerKg?: unknown;
  layoutData?: unknown;
  category: { slug: string; shortName: string };
} & Record<CriterionKey, number>;

/** Tabelle der Vergleichsseite. Gesetzte Alleinfutter-Teilnoten bleiben bei x/max; sonst „–“ ohne Warn-Icon. */
export function CompareResults({ items }: { items: CompareRow[] }) {
  const best = Math.max(0, ...items.map((i) => i.totalScore));
  return (
    <div className="mt-8 overflow-x-auto">
      <table className={`w-full table-fixed border-separate border-spacing-0 text-sm ${items.length > 2 ? "min-w-[34rem]" : ""}`}>
        <caption className="sr-only">Vergleich von {items.length} Produkten nach den sechs Bewertungskriterien</caption>
        <thead>
          <tr>
            <th scope="col" className="w-28 p-2 text-left align-bottom text-muted sm:w-44 sm:p-3">Produkt</th>
            {items.map((i) => (
              <th key={i.id} scope="col" className="p-2 text-left align-top sm:p-3">
                <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl bg-bg-soft"><FpImage src={i.imageUrl} alt={i.imageAlt || i.title} blur={i.imageBlur} sizes="260px" /></div>
                <Link href={reviewPath(i)} className="text-base font-bold hover:underline">{i.title}</Link>
                <p className="text-xs font-medium text-muted">{hyphenateCategory(i.category.shortName)}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-bg-soft">
            <th scope="row" className="p-3 text-left font-bold">Gesamt</th>
            {items.map((i) => (
              <td key={i.id} className="p-3"><div className="flex flex-wrap items-center gap-2"><ScoreBadge score={i.totalScore} size="sm" />{showsComparisonWinner(i.totalScore, best) && <span className="rounded-full bg-good-soft px-2 py-0.5 text-xs font-bold text-good">Testsieger</span>}</div></td>
            ))}
          </tr>
          {CRITERIA.map((c) => (
            <tr key={c.key}>
              <th scope="row" className="border-b border-border p-2 text-left font-semibold hyphens-auto break-words sm:p-3"><span className="sm:hidden">{c.short}</span><span className="hidden sm:inline">{c.label}</span><span className="block text-xs font-normal text-muted">max. {c.max}</span></th>
              {items.map((i) => {
                if (!classicCriteriaApply(i)) {
                  return (
                    <td key={i.id} className="border-b border-border p-3">
                      <span className="font-bold tabular-nums" aria-label="Dieses Kriterium gilt für diesen Test nicht">–</span>
                    </td>
                  );
                }
                const v = i[c.key];
                    const failed = criterionFailed(i, c.key, v);
                return (
                  <td key={i.id} className="border-b border-border p-3">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                      <span className="w-11 shrink-0 font-bold tabular-nums">{v}/{c.max}</span>
                      <span className="block h-2 w-full overflow-hidden rounded-full bg-border sm:flex-1"><span className={`block h-full rounded-full ${failed ? "bg-bad" : TONE[ratioRating(v, c.max)]}`} style={{ width: `${(v / c.max) * 100}%` }} /></span>
                      {failed && <AlertTriangle className="size-4 text-bad" aria-label="durchgefallen" />}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
          <tr>
            <th scope="row" className="border-b border-border p-3 text-left font-semibold">Preisklasse</th>
            {items.map((i) => <td key={i.id} className="border-b border-border p-3">{priceClassCell(i)}</td>)}
          </tr>
          <tr>
            <th scope="row" className="p-3 text-left align-top font-semibold">Fazit</th>
            {items.map((i) => <td key={i.id} className="p-3 align-top text-muted">{i.verdict}</td>)}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
