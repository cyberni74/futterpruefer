"use client";
import { Loader2 } from "lucide-react";
import { useState, useTransition, type ReactNode } from "react";
import { btnSecondary } from "./ui";

/** Button, der eine (per bind vorbelegte) Server-Action ohne Rückfrage ausführt. */
export function ActionButton({ action, children, className = btnSecondary }: { action: () => Promise<{ ok: boolean; message: string }>; children: ReactNode; className?: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  return (
    <span className="inline-flex flex-col">
      <button
        type="button"
        className={className}
        disabled={pending}
        onClick={() =>
          start(async () => {
            setError("");
            try {
              const r = await action();
              if (!r.ok) setError(r.message);
            } catch {
              setError("Aktion fehlgeschlagen.");
            }
          })
        }
      >
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {children}
      </button>
      <span aria-live="polite" className="text-sm text-bad">
        {error}
      </span>
    </span>
  );
}
