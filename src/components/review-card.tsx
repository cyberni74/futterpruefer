import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { ReviewCardData } from "@/lib/queries";
import { harmfulFailed } from "@/lib/scoring";
import { FpImage } from "./fp-image";
import { ScoreBadge } from "./score-badge";

export function ReviewCard({ review, priority = false }: { review: ReviewCardData; priority?: boolean }) {
  const failed = harmfulFailed(review.scoreHarmful);
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0">
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-soft">
        <FpImage src={review.imageUrl} alt={review.imageAlt || review.title} blur={review.imageBlur} sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" priority={priority} className="transition duration-500 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100" />
        {failed && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-bad px-2.5 py-1 text-xs font-bold text-white">
            <AlertTriangle className="size-3.5" aria-hidden /> Bedenklich
          </span>
        )}
        <ScoreBadge score={review.totalScore} className="absolute -bottom-6 right-4" />
      </div>
      <div className="flex flex-1 flex-col p-4 pt-5">
        <p className="text-xs font-bold uppercase tracking-wide text-brand">{review.category?.shortName}</p>
        <h3 className="mt-1 pr-14 text-lg font-bold leading-snug">
          <Link href={`/tests/${review.slug}`} className="after:absolute after:inset-0">
            {review.title}
          </Link>
        </h3>
        {review.keyword && <p className="mt-auto pt-3 text-sm text-muted">{review.keyword}</p>}
      </div>
    </article>
  );
}
