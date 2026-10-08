"use client";
import { CONCERN_OPTIONS, type Concern } from "@/lib/admin/lexikon";
import { labelCls } from "./ui";

const TONE = {
  good: { on: "border-good bg-good text-white dark:text-black", off: "border-good/40 bg-good-soft text-good hover:border-good", dot: "bg-good" },
  mid: { on: "border-mid bg-mid text-white dark:text-black", off: "border-mid/40 bg-mid-soft text-mid hover:border-mid", dot: "bg-mid" },
  bad: { on: "border-bad bg-bad text-white dark:text-black", off: "border-bad/40 bg-bad-soft text-bad hover:border-bad", dot: "bg-bad" },
} as const;

/** Bedenklichkeits-Ampel als Radiogruppe mit drei farbigen Schaltflächen. */
export function ConcernField({ value, onChange, error }: { value: Concern; onChange: (v: Concern) => void; error?: string }) {
  return (
    <fieldset aria-describedby={error ? "concern-error" : undefined}>
      <legend className={labelCls}>Bedenklichkeits-Ampel *</legend>
      <div className="grid grid-cols-3 gap-2">
        {CONCERN_OPTIONS.map((o) => {
          const t = TONE[o.tone];
          const active = value === o.value;
          return (
            <label
              key={o.value}
              className={`flex min-h-14 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 px-2 py-2.5 text-center transition has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-[var(--ring)] ${
                active ? `${t.on} shadow-card` : t.off
              }`}
            >
              <input type="radio" name="concern" value={o.value} checked={active} onChange={() => onChange(o.value)} className="sr-only" />
              <span className={`size-3 rounded-full ring-2 ring-current/30 ${active ? "bg-current" : t.dot}`} aria-hidden />
              <span className="text-sm leading-tight font-bold">{o.label}</span>
              <span className={`hidden text-xs sm:block ${active ? "opacity-90" : "opacity-80"}`}>{o.hint}</span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id="concern-error" className="mt-1 text-sm font-medium text-bad">
          {error}
        </p>
      )}
    </fieldset>
  );
}
