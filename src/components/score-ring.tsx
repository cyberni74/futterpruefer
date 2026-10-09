"use client";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MAX_TOTAL, RATING_LABEL, ratingFor } from "@/lib/scoring";

const COLOR = { gut: "var(--good)", mittel: "var(--mid-fill)", schlecht: "var(--bad)" } as const;

export function ScoreRing({ score, size = 200 }: { score: number; size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const value = Math.max(0, Math.min(MAX_TOTAL, score ?? 0));
  const rating = ratingFor(value);
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const progress = useMotionValue(0);
  const dash = useTransform(progress, (v) => c - (v / MAX_TOTAL) * c);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(progress, value, { duration: reduce ? 0 : 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduce, value, progress]);

  return (
    <div ref={ref} className="relative inline-flex shrink-0" style={{ width: size, height: size }} role="img" aria-label={`Gesamtwertung: ${value} von ${MAX_TOTAL} Punkten – ${RATING_LABEL[rating]}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={COLOR[rating]} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} style={{ strokeDashoffset: dash }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden>
        <span className="font-display text-6xl font-extrabold tabular-nums leading-none" style={{ color: "var(--fg)" }}>{display}</span>
        <span className="mt-1 text-sm font-semibold text-muted">von {MAX_TOTAL} Punkten</span>
        <span className="mt-2 rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ background: COLOR[rating], color: rating === "mittel" ? "#1b2b29" : "#fff" }}>{RATING_LABEL[rating]}</span>
      </div>
    </div>
  );
}
