import { ratingFor } from "@/lib/scoring";

const TONE = {
  gut: "bg-good text-white",
  mittel: "bg-mid text-white dark:text-[#1a1400]",
  schlecht: "bg-bad text-white dark:text-[#1f0000]",
} as const;

export function ScoreBadge({ score, size = "md", className = "" }: { score: number | null | undefined; size?: "sm" | "md" | "lg"; className?: string }) {
  const s = score ?? 0;
  const dims = size === "sm" ? "size-11 text-sm" : size === "lg" ? "size-20 text-2xl" : "size-14 text-lg";
  return (
    <span
      className={`inline-flex shrink-0 flex-col items-center justify-center rounded-full font-display font-extrabold leading-none shadow-card ring-4 ring-surface ${TONE[ratingFor(s)]} ${dims} ${className}`}
      aria-label={`${s} von 100 Punkten`}
      role="img"
    >
      {s}
      {size !== "sm" && <span className="mt-0.5 text-[0.55em] font-semibold">/100</span>}
    </span>
  );
}
