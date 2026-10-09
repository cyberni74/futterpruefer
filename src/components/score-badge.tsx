import { ratingFor } from "@/lib/scoring";

// Feste Farben: Das Siegel ist immer weiß, damit es in hellem und dunklem Modus gleich gut lesbar ist.
const COLOR = { gut: "#16a34a", mittel: "#eab308", schlecht: "#dc2626" } as const;
const INK = "#1b2b29";
const SIZE = { sm: 44, md: 64, lg: 84 } as const;

/** Punkte-Siegel: weiße Scheibe, Ampel-Ring als Fortschritt, Punktzahl in der Mitte. */
export function ScoreBadge({ score, size = "md", className = "" }: { score: number | null | undefined; size?: "sm" | "md" | "lg"; className?: string }) {
  const s = Math.max(0, Math.min(100, Math.round(score ?? 0)));
  const color = COLOR[ratingFor(s)];
  const px = SIZE[size];
  const stroke = size === "sm" ? 4 : 5;
  const r = 50 - stroke / 2 - 3;
  const c = 2 * Math.PI * r;
  return (
    <span className={`${/\b(absolute|fixed)\b/.test(className) ? "" : "relative "}inline-flex shrink-0 rounded-full bg-white shadow-lift ${className}`} style={{ width: px, height: px }} role="img" aria-label={`${s} von 100 Punkten`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e3ebe8" strokeWidth={stroke} />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${(s / 100) * c} ${c}`} />
      </svg>
      <span className="relative flex size-full flex-col items-center justify-center font-display leading-none" style={{ color: INK }} aria-hidden>
        <span className={`font-extrabold tabular-nums ${size === "sm" ? "text-[0.95rem]" : size === "lg" ? "text-[1.9rem]" : "text-[1.45rem]"}`}>{s}</span>
        {size !== "sm" && <span className={`mt-0.5 font-semibold text-[#4b5f5d] ${size === "lg" ? "text-xs" : "text-[0.62rem]"}`}>/100</span>}
      </span>
    </span>
  );
}
