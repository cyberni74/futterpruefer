import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/db";
import { publishedWhere } from "@/lib/queries";
import { parseCompareIds } from "@/lib/filters";
import { CRITERIA, harmfulFailed, ratioRating } from "@/lib/scoring";
import { PRICE_CLASS_LABEL } from "@/lib/site";
import { reviewPath } from "@/lib/urls";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScoreBadge } from "@/components/score-badge";
import { FpImage } from "@/components/fp-image";

export const metadata: Metadata = { title: "Produktvergleich", robots: { index: false, follow: true } };

const TONE = { gut: "bg-good", mittel: "bg-mid", schlecht: "bg-bad" } as const;

export default async function ComparePage({ searchParams }: PageProps<"/vergleich">) {
  const ids = parseCompareIds((await searchParams).ids);
  const found = ids.length ? await prisma.review.findMany({ where: { id: { in: ids }, ...publishedWhere() }, include: { category: true } }) : [];
  const items = ids.map((id) => found.find((f) => f.id === id)).filter((x): x is (typeof found)[number] => !!x);
  const best = Math.max(0, ...items.map((i) => i.totalScore));

  return (
    <div className="mx-auto max-w-6xl px-4">
      <Breadcrumbs items={[{ label: "Tests", href: "/tests" }, { label: "Vergleich" }]} />
      <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">Produktvergleich</h1>
      {items.length < 2 ? (
        <p className="mt-6 text-lg text-muted">Wählen Sie in einer <Link href="/tests" className="font-semibold text-brand underline">Testübersicht</Link> zwei bis drei Produkte zum Vergleich aus.</p>
      ) : (
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
                    <p className="text-xs font-medium text-muted">{i.category.shortName}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-bg-soft">
                <th scope="row" className="p-3 text-left font-bold">Gesamt</th>
                {items.map((i) => (
                  <td key={i.id} className="p-3"><div className="flex flex-wrap items-center gap-2"><ScoreBadge score={i.totalScore} size="sm" />{i.totalScore === best && <span className="rounded-full bg-good-soft px-2 py-0.5 text-xs font-bold text-good">Testsieger</span>}</div></td>
                ))}
              </tr>
              {CRITERIA.map((c) => (
                <tr key={c.key}>
                  <th scope="row" className="border-b border-border p-2 text-left font-semibold hyphens-auto break-words sm:p-3"><span className="sm:hidden">{c.short}</span><span className="hidden sm:inline">{c.label}</span><span className="block text-xs font-normal text-muted">max. {c.max}</span></th>
                  {items.map((i) => {
                    const v = i[c.key];
                    const failed = c.key === "scoreHarmful" && harmfulFailed(v);
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
                {items.map((i) => <td key={i.id} className="border-b border-border p-3">{PRICE_CLASS_LABEL[i.priceClass]}{i.pricePerKg != null && ` · ${Number(i.pricePerKg).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}/kg`}</td>)}
              </tr>
              <tr>
                <th scope="row" className="p-3 text-left align-top font-semibold">Fazit</th>
                {items.map((i) => <td key={i.id} className="p-3 align-top text-muted">{i.verdict}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
