"use client";
import { startTransition, useActionState, useEffect, useRef, type ReactNode } from "react";
import type { ActionResult } from "@/lib/admin/schemas";
import { FormMessage } from "./form-message";

export type FormAction = (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;

/**
 * Generisches Formular für einfache CRUD-Aktionen mit aria-live-Statusmeldung.
 * Setzt Eingaben nur nach Erfolg und nur mit `resetOnSuccess` zurück (bei Fehlern bleibt alles erhalten).
 * Hinweis: Render-Funktion als children nur aus Client-Komponenten verwenden.
 */
export function ActionForm({
  action,
  children,
  className = "",
  resetOnSuccess = false,
  ariaLabel,
}: {
  action: FormAction;
  children: (s: { pending: boolean; errors: Record<string, string> }) => ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
  ariaLabel?: string;
}) {
  const [state, dispatch, pending] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok && resetOnSuccess) ref.current?.reset();
    if (state && !state.ok) ref.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
  }, [state, resetOnSuccess]);

  return (
    <form
      ref={ref}
      aria-label={ariaLabel}
      className={className}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => dispatch(fd));
      }}
    >
      {children({ pending, errors: state?.fieldErrors ?? {} })}
      <FormMessage state={state} className="mt-3 empty:hidden" />
    </form>
  );
}

/** Fehlertext unter einem Feld. */
export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className="mt-1 text-sm font-medium text-bad">
      {error}
    </p>
  );
}
