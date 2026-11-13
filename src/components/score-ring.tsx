import { MAX_TOTAL, RATING_LABEL, ratingFor } from "@/lib/scoring";

const COLOR = { gut: "var(--good)", mittel: "var(--mid-fill)", schlecht: "var(--bad)" } as const;

/** compact: kleiner Tacho ohne Bewertungs-Pille (z. B. Ergebnis-Raster im Vergleichstest). */
export function ScoreRing({ score, size = 200, compact = false, methodikVersion }: { score: number; size?: number; compact?: boolean; methodikVersion?: string | null }) {
  const value = Math.max(0, Math.min(MAX_TOTAL, score ?? 0));
  const rating = ratingFor(value, methodikVersion);
  const stroke = compact ? 12 : 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / MAX_TOTAL) * c;
  return (
    <div className="relative inline-flex shrink-0" style={{ width: size, height: size }} role="img" aria-label={`Gesamtwertung: ${value} von ${MAX_TOTAL} Punkten – ${RATING_LABEL[rating]}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          className="score-ring-arc"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={COLOR[rating]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ ["--ring-from" as string]: c, ["--ring-to" as string]: offset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden>
        <span className={compact ? "font-display text-4xl font-extrabold tabular-nums leading-none" : "font-display text-6xl font-extrabold tabular-nums leading-none"} style={{ color: "var(--fg)" }}>{value}</span>
        <span className={compact ? "mt-1 text-xs font-semibold text-muted" : "mt-1 text-sm font-semibold text-muted"}>von {MAX_TOTAL} Punkten</span>
        {!compact && <span className="mt-2 rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ background: COLOR[rating], color: rating === "mittel" ? "#1b2b29" : "#fff" }}>{RATING_LABEL[rating]}</span>}
      </div>
    </div>
  );
}
