import { AlertOctagon, CalendarClock, Check, Minus } from "lucide-react";
import { ScoreRing } from "./score-ring";
import { CriteriaBars } from "./criteria-bars";
import { CRITERIA, harmfulFailed, type Scores } from "@/lib/scoring";
import { formatDate } from "@/lib/site";

export type VerdictData = Scores & {
  totalScore: number;
  verdict: string;
  pros: string[];
  cons: string[];
  updatedAt: Date | string | null;
};

export function VerdictPanel({ data }: { data: VerdictData }) {
  const scores = Object.fromEntries(CRITERIA.map((c) => [c.key, Number(data[c.key] ?? 0)])) as Scores;
  const failed = harmfulFailed(scores.scoreHarmful);
  const pros = (data.pros ?? []).filter(Boolean);
  const cons = (data.cons ?? []).filter(Boolean);
  return (
    <section aria-labelledby="fazit-heading" className="overflow-hidden rounded-3xl border border-border bg-surface shadow-card">
      {failed && (
        <div role="alert" className="flex items-start gap-3 bg-bad px-5 py-3.5 text-white">
          <AlertOctagon className="mt-0.5 size-6 shrink-0" aria-hidden />
          <p className="text-sm font-semibold leading-snug">
            Warnsignal: Dieses Produkt fällt im Kriterium „Schadstoffe &amp; Bedenkliches“ durch. Es enthält ungeeignete oder problematische Inhaltsstoffe.
          </p>
        </div>
      )}
      <div className="p-5 md:p-8">
        <div className="flex items-center justify-between gap-3">
          <h2 id="fazit-heading" className="text-2xl font-extrabold">Fazit</h2>
          {data.updatedAt && (
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <CalendarClock className="size-4" aria-hidden />
              Zuletzt aktualisiert: <time dateTime={new Date(data.updatedAt).toISOString()}>{formatDate(data.updatedAt)}</time>
            </p>
          )}
        </div>
        <div className="mt-6 flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-10">
          <ScoreRing score={Number(data.totalScore ?? 0)} />
          <div className="w-full flex-1">
            <CriteriaBars scores={scores} />
          </div>
        </div>
        {data.verdict && <p className="mt-8 text-lg font-medium leading-relaxed">{data.verdict}</p>}
        {(pros.length > 0 || cons.length > 0) && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-good-soft p-4">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-good">Pro</h3>
              <ul className="space-y-2">
                {pros.map((p) => (
                  <li key={p} className="flex gap-2"><Check className="mt-0.5 size-5 shrink-0 text-good" aria-hidden /><span>{p}</span></li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-bad-soft p-4">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-bad">Contra</h3>
              <ul className="space-y-2">
                {cons.map((p) => (
                  <li key={p} className="flex gap-2"><Minus className="mt-0.5 size-5 shrink-0 text-bad" aria-hidden /><span>{p}</span></li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
