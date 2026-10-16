import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { ReviewCardData } from "@/lib/queries";
import { harmfulFailed } from "@/lib/scoring";
import { productLabel } from "@/lib/seo";
import { hyphenateCategory, reviewPath } from "@/lib/urls";
import { FpImage } from "./fp-image";
import { ScoreBadge } from "./score-badge";

/** variant „tile“: schmale, leicht hochkant stehende Kachel für dreispaltige Raster (Startseite). */
export function ReviewCard({ review, priority = false, variant = "card" }: { review: ReviewCardData; priority?: boolean; variant?: "card" | "tile" }) {
  const failed = harmfulFailed(review.scoreHarmful);
  if (variant === "tile") {
    return (
      <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0 sm:rounded-2xl">
        <div className="relative aspect-square overflow-hidden bg-white">
          <FpImage src={review.imageUrl} alt={review.imageAlt.trim() || `Verpackung von ${productLabel(review.brand, review.productName) || review.title}`} blur={null} sizes="(min-width:1152px) 380px, (min-width:640px) 33vw, 33vw" priority={priority} className="transition duration-500 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100" />
          {failed && (
            <span className="absolute left-1 top-1 inline-flex items-center gap-1 rounded-full bg-bad px-1.5 py-0.5 text-[0.6rem] font-bold text-white sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-xs">
              <AlertTriangle className="size-3 sm:size-3.5" aria-hidden /> <span className="hidden sm:inline">Bedenklich</span>
            </span>
          )}
        </div>
        <div className="relative flex flex-1 flex-col p-2 pt-4 sm:p-4 sm:pt-5">
          <ScoreBadge score={review.totalScore} size="sm" className="absolute -top-6 right-1.5 z-10 sm:-top-7 sm:right-3" />
          <p className="hidden pr-12 text-[0.7rem] font-bold uppercase tracking-wide text-brand sm:block">{hyphenateCategory(review.category?.shortName)}</p>
          <h3 className="hyphens-auto break-words text-[0.78rem] font-bold leading-tight sm:mt-1 sm:text-base sm:leading-snug">
            <Link href={reviewPath(review)} className="line-clamp-4 after:absolute after:inset-0 sm:line-clamp-3">{review.title}</Link>
          </h3>
          {review.teaser && <p className="mt-2 hidden line-clamp-3 text-sm leading-relaxed text-muted lg:block">{review.teaser}</p>}
        </div>
      </article>
    );
  }
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0">
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        <FpImage src={review.imageUrl} alt={review.imageAlt.trim() || `Verpackung von ${productLabel(review.brand, review.productName) || review.title}`} blur={null} sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" priority={priority} className="transition duration-500 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100" />
        {failed && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-bad px-2.5 py-1 text-xs font-bold text-white">
            <AlertTriangle className="size-3.5" aria-hidden /> Bedenklich
          </span>
        )}
      </div>
      <div className="relative flex flex-1 flex-col p-4 pt-5">
        <ScoreBadge score={review.totalScore} className="absolute -top-9 right-4 z-10" />
        <p className="text-xs font-bold uppercase tracking-wide text-brand">{hyphenateCategory(review.category?.shortName)}</p>
        <h3 className="mt-1 pr-16 text-lg font-bold leading-snug">
          <Link href={reviewPath(review)} className="after:absolute after:inset-0">
            {review.title}
          </Link>
        </h3>
        {review.teaser ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{review.teaser}</p>
        ) : (
          review.keyword && <p className="mt-auto pt-3 text-sm text-muted">{review.keyword}</p>
        )}
      </div>
    </article>
  );
}
