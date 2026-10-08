import Link from "next/link";
import { CalendarClock, Check, Info, X } from "lucide-react";
import { ScoreRing } from "./score-ring";
import { CriteriaBars } from "./criteria-bars";
import { WarningBanner } from "./warning-banners";
import { CRITERIA, type Scores } from "@/lib/scoring";
import { formatDate } from "@/lib/site";

export type VerdictData = Scores & {
  totalScore: number;
  verdict: string;
  pros: string[];
  cons: string[];
  updatedAt: Date | string | null;
  harmfulReason?: string | null;
};

/** Fazit-Box: Punkte-Ring, Kriterien-Balken, Klartext-Fazit, Pro/Contra. */
export function VerdictPanel({ data, showWarning = false }: { data: VerdictData; showWarning?: boolean }) {
  const scores = Object.fromEntries(CRITERIA.map((c) => [c.key, Number(data?.[c.key] ?? 0) || 0])) as Scores;
  const pros = (data?.pros ?? []).map((p) => p?.trim()).filter(Boolean);
  const cons = (data?.cons ?? []).map((p) => p?.trim()).filter(Boolean);
  const updated = data?.updatedAt ? new Date(data.updatedAt) : null;
  return (
    <section aria-labelledby="fazit-heading" className="overflow-hidden rounded-3xl border border-border bg-surface shadow-card">
      {showWarning && <WarningBanner scoreHarmful={scores.scoreHarmful} reason={data?.harmfulReason} flush />}
      <div className="p-5 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="fazit-heading" className="text-2xl font-extrabold">Fazit</h2>
          {updated && !Number.isNaN(updated.getTime()) && (
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <CalendarClock className="size-4" aria-hidden />
              Zuletzt aktualisiert: <time dateTime={updated.toISOString()}>{formatDate(updated)}</time>
            </p>
          )}
        </div>
        <div className="mt-6 flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-10">
          <ScoreRing score={Number(data?.totalScore ?? 0) || 0} />
          <div className="w-full flex-1">
            <CriteriaBars scores={scores} />
          </div>
        </div>
        {data?.verdict?.trim() && <p className="mt-8 text-lg font-medium leading-relaxed">{data.verdict}</p>}
        {(pros.length > 0 || cons.length > 0) && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {pros.length > 0 && (
              <div className="rounded-2xl bg-good-soft p-4">
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-good">Pro</h3>
                <ul className="space-y-2">
                  {pros.map((p) => (
                    <li key={p} className="flex gap-2"><Check className="mt-0.5 size-5 shrink-0 text-good" strokeWidth={3} aria-label="Pro:" /><span>{p}</span></li>
                  ))}
                </ul>
              </div>
            )}
            {cons.length > 0 && (
              <div className="rounded-2xl bg-bad-soft p-4">
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-bad">Contra</h3>
                <ul className="space-y-2">
                  {cons.map((p) => (
                    <li key={p} className="flex gap-2"><X className="mt-0.5 size-5 shrink-0 text-bad" strokeWidth={3} aria-label="Contra:" /><span>{p}</span></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        <Link href="/methodik" className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-brand hover:underline">
          <Info className="size-4" aria-hidden /> So bewerten wir
        </Link>
      </div>
    </section>
  );
}
