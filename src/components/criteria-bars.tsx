"use client";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { CRITERIA, harmfulFailed, ratioRating, type Scores } from "@/lib/scoring";

const COLOR = { gut: "var(--good)", mittel: "var(--mid-fill)", schlecht: "var(--bad)" } as const;

/** Sechs Kriterien-Balken; füllen sich nacheinander beim Sichtbarwerden (nur transform → flüssig, kein Layout-Shift). */
export function CriteriaBars({ scores }: { scores: Scores }) {
  const reduce = useReducedMotion();
  return (
    <ul className="space-y-3.5">
      {CRITERIA.map((c, i) => {
        const v = Math.max(0, Math.min(c.max, Math.round(Number(scores?.[c.key] ?? 0)) || 0));
        const failed = c.key === "scoreHarmful" && harmfulFailed(v);
        const tone = failed ? "schlecht" : ratioRating(v, c.max);
        const ratio = v / c.max;
        return (
          <li key={c.key}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
              <span className="flex items-center gap-1.5 font-semibold">
                {failed && <AlertTriangle className="size-4 text-bad" aria-hidden />}
                {c.label}
              </span>
              <span className="tabular-nums text-muted" aria-hidden>
                <strong className="text-fg">{v}</strong> / {c.max}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-border" role="meter" aria-label={`${c.label}: ${v} von ${c.max} Punkten`} aria-valuemin={0} aria-valuemax={c.max} aria-valuenow={v}>
              <motion.div
                className="h-full w-full origin-left rounded-full"
                style={{ background: COLOR[tone] }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: ratio }}
                viewport={{ once: true }}
                transition={reduce ? { duration: 0 } : { duration: 0.9, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
