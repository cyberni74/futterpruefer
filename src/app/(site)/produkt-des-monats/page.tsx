import type { Metadata } from "next";
import Link from "next/link";
import { getProductOfMonthArchive } from "@/lib/queries";
import { MONTHS } from "@/lib/site";
import { reviewPath } from "@/lib/urls";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { MonthSeal } from "@/components/product-of-month";
import { ScoreBadge } from "@/components/score-badge";
import { FpImage } from "@/components/fp-image";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Produkt des Monats – Archiv", description: "Alle bisherigen Produkte des Monats mit Begründung.", alternates: { canonical: "/produkt-des-monats" } };

export default async function PomArchive() {
  const now = new Date();
  const list = (await getProductOfMonthArchive()).filter((p) => p.year < now.getFullYear() || (p.year === now.getFullYear() && p.month <= now.getMonth() + 1));
  return (
    <div className="mx-auto max-w-4xl px-4">
      <Breadcrumbs items={[{ label: "Produkt des Monats" }]} />
      <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">Produkt des Monats</h1>
      <p className="mb-10 mt-3 text-lg text-muted">Jeden Monat küren wir das fachlich überzeugendste Produkt aus unseren Tests.</p>
      <ol className="space-y-6">
        {list.map((p) => (
          <li key={p.id} className="relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-card sm:flex-row">
            <div className="relative aspect-[4/3] sm:aspect-auto sm:w-64 sm:shrink-0"><FpImage src={p.review.imageUrl} alt={p.review.imageAlt || p.review.title} blur={p.review.imageBlur} sizes="(min-width:640px) 256px, 100vw" /></div>
            <div className="flex flex-1 gap-4 p-5">
              <MonthSeal month={p.month} year={p.year} className="hidden size-24 md:flex" />
              <div className="flex-1">
                <p className="text-sm font-bold text-brand">{MONTHS[p.month - 1]} {p.year}</p>
                <h2 className="mt-1 text-xl font-extrabold"><Link href={reviewPath(p.review)} className="after:absolute after:inset-0 hover:underline">{p.review.title}</Link></h2>
                <p className="mt-2 text-muted">{p.reason}</p>
              </div>
              <ScoreBadge score={p.review.totalScore} />
            </div>
          </li>
        ))}
      </ol>
      {list.length === 0 && <p className="text-muted">Noch kein Produkt des Monats gekürt.</p>}
    </div>
  );
}
