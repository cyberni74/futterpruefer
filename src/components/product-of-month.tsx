import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReviewCardData } from "@/lib/queries";
import { MONTHS } from "@/lib/site";
import { reviewPath } from "@/lib/urls";
import { FpImage } from "./fp-image";
import { ScoreBadge } from "./score-badge";

export function MonthSeal({ month, year, className = "" }: { month: number; year: number; className?: string }) {
  return (
    <div className={`flex size-28 flex-col items-center justify-center rounded-full bg-accent text-center text-white shadow-lift ring-4 ring-white/80 dark:text-black ${className}`} role="img" aria-label={`Produkt des Monats ${MONTHS[month - 1]} ${year}`}>
      <span className="text-[0.6rem] font-bold uppercase tracking-widest">Produkt des</span>
      <span className="font-display text-lg font-extrabold leading-none">Monats</span>
      <span className="mt-1 text-xs font-semibold">{MONTHS[month - 1]} {year}</span>
    </div>
  );
}

export function ProductOfMonthHero({ pom }: { pom: { year: number; month: number; reason: string; review: ReviewCardData } }) {
  const r = pom.review;
  return (
    <section aria-labelledby="pdm-heading" className="relative overflow-hidden rounded-3xl bg-brand-strong text-white shadow-lift dark:bg-brand-soft">
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[26rem]">
          <FpImage src={r.imageUrl} alt={r.imageAlt || r.title} blur={r.imageBlur} sizes="(min-width:768px) 50vw, 100vw" priority />
          <MonthSeal month={pom.month} year={pom.year} className="absolute left-4 top-4 md:left-6 md:top-6" />
        </div>
        <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-white/80 dark:text-fg/80">Produkt des Monats</p>
          <div className="flex items-start gap-4">
            <h2 id="pdm-heading" className="flex-1 text-3xl font-extrabold leading-tight md:text-4xl dark:text-fg">{r.title}</h2>
            <ScoreBadge score={r.totalScore} size="lg" />
          </div>
          <p className="text-lg leading-relaxed text-white/90 dark:text-fg/90">{pom.reason}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href={reviewPath(r)} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 font-bold text-white hover:bg-accent-strong dark:text-black">
              Zum Testbericht <ArrowRight className="size-5" aria-hidden />
            </Link>
            <Link href="/produkt-des-monats" className="inline-flex min-h-12 items-center rounded-full border border-white/40 px-5 font-semibold text-white hover:bg-white/10 dark:border-border dark:text-fg">
              Archiv
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
