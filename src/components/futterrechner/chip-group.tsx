"use client";

import { Check } from "lucide-react";
import { useId, type ReactNode } from "react";

export type ChipOption<T extends string> = { value: T; label: string; icon?: ReactNode; hilfe?: string };

/** Native Radio-Gruppe, optisch als Chips (6.4). `tile`: Icon-Kachel für Aktivität. */
export function ChipGroup<T extends string>({
  legend, options, value, onChange, cols = 2, tile = false, hideLegend = false,
}: { legend: string; options: ChipOption<T>[]; value: T | null; onChange: (v: T) => void; cols?: 1 | 2 | 3 | 4; tile?: boolean; hideLegend?: boolean }) {
  const name = useId();
  const grid = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-2 min-[400px]:grid-cols-4" }[cols];
  return (
    <fieldset className="min-w-0">
      <legend className={hideLegend ? "sr-only" : "mb-2 text-sm font-bold"}>{legend}</legend>
      <div className={`grid gap-2 ${grid}`}>
        {options.map((o) => {
          const active = value === o.value;
          return (
            <label
              key={o.value}
              className={`relative flex cursor-pointer select-none rounded-2xl border text-center transition-colors duration-150 focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 ${
                tile ? "min-h-[4.5rem] flex-col items-center justify-center gap-1 px-1 py-2" : "min-h-12 items-center justify-center gap-2 px-3 py-2"
              } ${active ? "border-brand bg-brand text-white dark:text-black" : "border-border bg-surface hover:border-brand"}`}
            >
              <input type="radio" name={name} value={o.value} checked={active} onChange={() => onChange(o.value)} className="peer sr-only" />
              {o.icon && <span aria-hidden className="shrink-0 [&>svg]:size-5">{o.icon}</span>}
              <span className={`font-semibold ${tile ? "text-xs leading-tight" : "text-sm"}`}>{o.label}</span>
              {active && <Check aria-hidden className={`size-4 shrink-0 ${tile ? "absolute right-1 top-1" : ""}`} />}
              {tile && o.hilfe && <span className={`text-[0.7rem] leading-tight ${active ? "opacity-90" : "text-muted"}`}>{o.hilfe}</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
