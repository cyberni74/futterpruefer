"use client";
import { useId } from "react";
import type { PublishMode } from "@/lib/admin/publish";
import { inputCls, labelCls } from "./ui";

const OPTIONS: { value: PublishMode; label: string; hint: string }[] = [
  { value: "draft", label: "Entwurf", hint: "Nicht öffentlich sichtbar" },
  { value: "now", label: "Veröffentlichen sofort", hint: "Sofort live" },
  { value: "scheduled", label: "Geplant", hint: "Automatisch zum Zeitpunkt" },
];

export function PublishField({
  mode,
  onModeChange,
  scheduledAt,
  onScheduledAtChange,
  error,
}: {
  mode: PublishMode;
  onModeChange: (m: PublishMode) => void;
  scheduledAt: string;
  onScheduledAtChange: (v: string) => void;
  error?: string;
}) {
  const uid = useId();
  return (
    <fieldset className="space-y-3">
      <legend className={labelCls}>Status</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {OPTIONS.map((o) => (
          <label
            key={o.value}
            className={`flex min-h-11 cursor-pointer items-start gap-2.5 rounded-xl border p-3 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-[var(--ring)] ${
              mode === o.value ? "border-brand bg-brand-soft" : "border-border bg-surface hover:bg-bg-soft"
            }`}
          >
            <input
              type="radio"
              name="publishMode"
              value={o.value}
              checked={mode === o.value}
              onChange={() => onModeChange(o.value)}
              className="mt-1 size-4 accent-[var(--brand)]"
            />
            <span>
              <span className="block text-sm font-semibold">{o.label}</span>
              <span className="block text-xs text-muted">{o.hint}</span>
            </span>
          </label>
        ))}
      </div>
      {mode === "scheduled" && (
        <div>
          <label htmlFor={`${uid}-at`} className={labelCls}>
            Veröffentlichen am (Berliner Zeit)
          </label>
          <input
            id={`${uid}-at`}
            type="datetime-local"
            name="scheduledAt"
            value={scheduledAt}
            onChange={(e) => onScheduledAtChange(e.target.value)}
            required
            className={`${inputCls} sm:max-w-xs`}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${uid}-at-error` : undefined}
          />
          {error && (
            <p id={`${uid}-at-error`} className="mt-1 text-sm font-medium text-bad">
              {error}
            </p>
          )}
        </div>
      )}
      {mode !== "scheduled" && <input type="hidden" name="scheduledAt" value="" />}
    </fieldset>
  );
}
