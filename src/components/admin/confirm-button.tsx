"use client";
import { Loader2, Trash2 } from "lucide-react";
import { useTransition, useState } from "react";
import { btnDanger } from "./ui";

/** Löschen (o. ä.) mit Sicherheitsabfrage. Die Aktion erhält keine Argumente (per bind vorbelegt). */
export function ConfirmButton({
  action,
  label = "Löschen",
  confirmText,
  className = btnDanger,
  icon = true,
}: {
  action: () => Promise<{ ok: boolean; message: string } | void>;
  label?: string;
  confirmText: string;
  className?: string;
  icon?: boolean;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  return (
    <span className="inline-flex flex-col">
      <button
        type="button"
        className={className}
        disabled={pending}
        onClick={() => {
          if (!window.confirm(confirmText)) return;
          setError("");
          start(async () => {
            try {
              const r = await action();
              if (r && !r.ok) setError(r.message);
            } catch (e) {
              // redirect() wirft absichtlich – nur echte Fehler anzeigen
              if (e instanceof Error && !String((e as { digest?: string }).digest ?? "").startsWith("NEXT_REDIRECT")) setError(e.message);
              else throw e;
            }
          });
        }}
      >
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : icon ? <Trash2 className="size-4" aria-hidden /> : null}
        {label}
      </button>
      <span aria-live="polite" className="text-sm text-bad">
        {error}
      </span>
    </span>
  );
}
