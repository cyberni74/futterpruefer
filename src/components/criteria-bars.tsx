"use client";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { CRITERIA, harmfulFailed, ratioRating, type Scores } from "@/lib/scoring";

const COLOR = { gut: "var(--good)", mittel: "var(--mid)", schlecht: "var(--bad)" } as const;

export function CriteriaBars({ scores }: { scores: Scores }) {
  const reduce = useReducedMotion();
  return (
    <ul className="space-y-3.5">
      {CRITERIA.map((c, i) => {
        const v = Math.max(0, Math.min(c.max, scores[c.key] ?? 0));
        const failed = c.key === "scoreHarmful" && harmfulFailed(v);
        const tone = failed ? "schlecht" : ratioRating(v, c.max);
        return (
          <li key={c.key}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
              <span className="flex items-center gap-1.5 font-semibold">
                {failed && <AlertTriangle className="size-4 text-bad" aria-hidden />}
                {c.label}
              </span>
              <span className="tabular-nums text-muted">
                <strong className="text-fg">{v}</strong> / {c.max}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-border" role="meter" aria-label={c.label} aria-valuemin={0} aria-valuemax={c.max} aria-valuenow={v} aria-valuetext={`${v} von ${c.max} Punkten`}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: COLOR[tone] }}
                initial={{ width: reduce ? `${(v / c.max) * 100}%` : 0 }}
                whileInView={{ width: `${(v / c.max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
