"use client";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { ActionResult } from "@/lib/admin/schemas";

/** Status-/Fehlermeldung mit aria-live für Screenreader. */
export function FormMessage({ state, className = "" }: { state: ActionResult | null | undefined; className?: string }) {
  return (
    <div aria-live="polite" role="status" className={className}>
      {state?.message && (
        <p
          key={state.at}
          className={`flex items-start gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium ${state.ok ? "bg-good-soft text-good" : "bg-bad-soft text-bad"}`}
        >
          {state.ok ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden /> : <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />}
          <span>{state.message}</span>
        </p>
      )}
    </div>
  );
}
