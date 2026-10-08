import type { ReactNode } from "react";

export const inputCls =
  "block w-full min-h-11 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-base text-fg placeholder:text-muted/70 focus-visible:border-brand aria-[invalid=true]:border-bad";
export const textareaCls = `${inputCls} min-h-24 leading-relaxed`;
export const labelCls = "mb-1.5 block text-sm font-semibold text-fg";
export const btnBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";
export const btnPrimary = `${btnBase} bg-accent text-white shadow-card hover:bg-accent-strong`;
export const btnBrand = `${btnBase} bg-brand text-white hover:bg-brand-strong dark:text-[#04201e]`;
export const btnSecondary = `${btnBase} border border-border bg-surface text-fg hover:bg-bg-soft`;
export const btnDanger = `${btnBase} border border-bad/40 bg-bad-soft text-bad hover:bg-bad hover:text-white`;
export const btnGhost = `${btnBase} text-fg hover:bg-bg-soft`;
export const cardCls = "rounded-2xl border border-border bg-surface p-4 shadow-card md:p-6";

export function Field({
  id,
  label,
  error,
  hint,
  children,
  className = "",
}: {
  id: string;
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm font-medium text-bad">
          {error}
        </p>
      )}
    </div>
  );
}

/** aria-Attribute für ein Eingabefeld mit Fehler/Hinweis. */
export function describe(id: string, error?: string, hint?: boolean) {
  return {
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  };
}

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Section({ title, children, id, description }: { title: string; children: ReactNode; id?: string; description?: ReactNode }) {
  return (
    <section className={cardCls} aria-labelledby={id}>
      <h2 id={id} className="text-lg font-bold">
        {title}
      </h2>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
