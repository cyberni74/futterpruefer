"use client";
import { ArrowLeft, Eye, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import type { ActionResult } from "@/lib/admin/schemas";
import { FormMessage } from "./form-message";
import { btnPrimary, btnSecondary } from "./ui";

/** Kopfzeile + mobile Speicherleiste für Editor-Formulare. */
export function EditorHeader({
  formId,
  backHref,
  backLabel,
  title,
  badge,
  previewHref,
  pending,
}: {
  formId: string;
  backHref: string;
  backLabel: string;
  title: string;
  badge?: ReactNode;
  previewHref?: string;
  pending: boolean;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <Link href={backHref} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-muted hover:text-fg">
          <ArrowLeft className="size-4" aria-hidden /> {backLabel}
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="truncate text-2xl font-extrabold md:text-3xl">{title}</h1>
          {badge}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {previewHref ? (
          <Link href={previewHref} target="_blank" className={btnSecondary}>
            <Eye className="size-4" aria-hidden /> Vorschau
          </Link>
        ) : (
          <span className="self-center text-xs text-muted">Vorschau nach dem ersten Speichern verfügbar</span>
        )}
        <button type="submit" form={formId} className={`${btnPrimary} hidden md:inline-flex`} disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Save className="size-4" aria-hidden />}
          Speichern
        </button>
      </div>
    </div>
  );
}

export function SaveBar({ pending, state }: { pending: boolean; state: ActionResult | null }) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-6 border-t border-border bg-bg/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:backdrop-blur-none">
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <button type="submit" className={`${btnPrimary} w-full md:w-auto`} disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Save className="size-4" aria-hidden />}
          {pending ? "Wird gespeichert …" : "Speichern"}
        </button>
        <FormMessage state={state} className="flex-1" />
      </div>
    </div>
  );
}

/** Fokussiert nach fehlgeschlagenem Speichern das erste ungültige Feld. */
export function useFocusFirstError(state: ActionResult | null) {
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!state || state.ok || !state.fieldErrors) return;
    const el = formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']");
    el?.focus();
  }, [state]);
  return formRef;
}
