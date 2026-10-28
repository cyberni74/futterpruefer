import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReviewCardData } from "@/lib/queries";
import { MONTHS } from "@/lib/site";
import { reviewPath } from "@/lib/urls";
import { FpImage } from "./fp-image";
import { ScoreBadge } from "./score-badge";

/** Rundes Siegel (Produkt des Monats, Testsieger): kleine Zeile oben, große Zeile, Monat und Jahr. */
export function HeroSeal({ top, main, sub, label, className = "" }: { top: string; main: string; sub: string; label: string; className?: string }) {
  return (
    <div className={`flex size-28 flex-col items-center justify-center rounded-full bg-accent text-center text-white shadow-lift ring-4 ring-white/80 dark:text-black ${className}`} role="img" aria-label={label}>
      <span className="text-[0.6rem] font-bold uppercase tracking-widest">{top}</span>
      <span className="font-display text-lg font-extrabold leading-none">{main}</span>
      <span className="mt-1 text-xs font-semibold">{sub}</span>
    </div>
  );
}

export function MonthSeal({ month, year, className = "" }: { month: number; year: number; className?: string }) {
  const sub = `${MONTHS[month - 1]} ${year}`;
  return <HeroSeal top="Produkt des" main="Monats" sub={sub} label={`Produkt des Monats ${sub}`} className={className} />;
}

export type FeatureHeroProps = {
  /** Eindeutige id für die Überschrift (aria-labelledby). */
  headingId: string;
  /** Kleine Zeile über der Überschrift, z. B. „Produkt des Monats“. */
  kicker: string;
  /** Unsichtbarer Vorsatz der Überschrift für Screenreader. */
  srPrefix: string;
  title: string;
  score: number | null | undefined;
  text: string;
  image: { src: string | null | undefined; alt: string; blur?: string | null };
  seal?: React.ReactNode;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
};

/** Gemeinsamer Startseiten-Kasten für Produkt des Monats und Testsieger der großen Vergleichstests. */
export function FeatureHero({ headingId, kicker, srPrefix, title, score, text, image, seal, primary, secondary }: FeatureHeroProps) {
  return (
    <section aria-labelledby={headingId} className="relative overflow-hidden rounded-3xl bg-brand-strong text-white shadow-lift dark:bg-brand-soft">
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[16/9] md:aspect-auto md:min-h-[18rem]">
          <FpImage src={image.src} alt={image.alt} blur={image.blur} sizes="(min-width:768px) 50vw, 100vw" />
          {seal}
        </div>
        <div className="flex flex-col justify-center gap-3 p-5 md:p-7">
          <p className="text-sm font-bold uppercase tracking-widest text-white/80 dark:text-fg/80">{kicker}</p>
          <div className="flex items-start gap-4">
            <h2 id={headingId} className="flex-1 text-2xl font-extrabold leading-tight md:text-3xl dark:text-fg">
              <span className="sr-only">{srPrefix}</span>{title}
            </h2>
            {score != null && <ScoreBadge score={score} size="md" />}
          </div>
          <p className="line-clamp-4 leading-relaxed text-white/90 dark:text-fg/90">{text}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href={primary.href} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 font-bold text-white hover:bg-accent-strong dark:text-black">
              {primary.label} <ArrowRight className="size-5" aria-hidden />
            </Link>
            {secondary ? (
              <Link href={secondary.href} className="inline-flex min-h-12 items-center rounded-full border border-white/40 px-5 font-semibold text-white hover:bg-white/10 dark:border-border dark:text-fg">
                {secondary.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export const SEAL_POSITION = "absolute left-3 top-3 origin-top-left scale-75 md:left-4 md:top-4";

export function ProductOfMonthHero({ pom }: { pom: { year: number; month: number; reason: string; review: ReviewCardData } }) {
  const r = pom.review;
  return (
    <FeatureHero
      headingId="pdm-heading"
      kicker="Produkt des Monats"
      srPrefix="Produkt des Monats: "
      title={r.title}
      score={r.totalScore}
      text={pom.reason}
      image={{ src: r.imageUrl, alt: r.imageAlt || r.title, blur: r.imageBlur }}
      seal={<MonthSeal month={pom.month} year={pom.year} className={SEAL_POSITION} />}
      primary={{ href: reviewPath(r), label: "Zum Testbericht" }}
      secondary={{ href: "/produkt-des-monats", label: "Archiv" }}
    />
  );
}
