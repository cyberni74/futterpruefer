"use client";
import { Plus, X } from "lucide-react";
import { inputCls } from "./ui";

/** Liste von Textzeilen (z. B. Pro/Contra) mit Hinzufügen/Entfernen. */
export function ListInput({
  name,
  label,
  items,
  onChange,
  max = 3,
  error,
  tone,
}: {
  name: string;
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  max?: number;
  error?: string;
  tone: "good" | "bad";
}) {
  const errId = `${name}-error`;
  return (
    <fieldset aria-describedby={error ? errId : undefined}>
      <legend className={`mb-1.5 text-sm font-bold ${tone === "good" ? "text-good" : "text-bad"}`}>{label}</legend>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <label htmlFor={`${name}-${i}`} className="sr-only">
              {label} {i + 1}
            </label>
            <input
              id={`${name}-${i}`}
              name={name}
              value={item}
              maxLength={200}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
              placeholder={`${label}-Punkt ${i + 1}`}
              className={inputCls}
              aria-invalid={error ? true : undefined}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              aria-label={`${label} ${i + 1} entfernen`}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-border text-muted hover:bg-bad-soft hover:text-bad"
            >
              <X className="size-4" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
      {items.length < max && (
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-brand hover:bg-brand-soft"
        >
          <Plus className="size-4" aria-hidden /> {label}-Punkt hinzufügen
        </button>
      )}
      {error && (
        <p id={errId} className="mt-1 text-sm font-medium text-bad">
          {error}
        </p>
      )}
    </fieldset>
  );
}
