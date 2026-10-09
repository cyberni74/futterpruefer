"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { Lightbulb } from "lucide-react";
import { submitWish } from "@/lib/wish/actions";
import type { WishState } from "@/lib/wish/schema";

/** Besucher wünschen sich Produkte für einen Test oder Fachbeitrag. */
export function WishBox() {
  const [state, action, pending] = useActionState<WishState, FormData>(submitWish, { ok: false, message: "" });
  const [startedAt] = useState(() => Date.now());
  const err = (k: string) => state.errors?.[k];
  const v = (k: string) => state.values?.[k] ?? "";
  const field = "mt-1 block min-h-12 w-full rounded-2xl border border-border bg-surface px-4 text-base aria-[invalid=true]:border-bad";
  return (
    <section aria-labelledby="wish-h" className="rounded-3xl border border-border bg-bg-soft p-6 md:p-8">
      <div className="flex items-start gap-3">
        <Lightbulb className="mt-1 size-7 shrink-0 text-accent" aria-hidden />
        <div className="flex-1">
          <h2 id="wish-h" className="text-xl font-extrabold md:text-2xl">Welches Futter sollen wir testen?</h2>
          <p className="mt-1 text-muted">Nennen Sie uns einfach den Produktnamen, gern mit Ihren Fragen dazu. Aus beliebten Wünschen machen wir einen Test oder einen Fachbeitrag.</p>
        </div>
      </div>
      {state.ok ? (
        <p role="status" className="mt-4 rounded-2xl bg-good-soft p-4 font-semibold text-good">{state.message}</p>
      ) : (
        <form action={action} className="mt-4 space-y-3" noValidate>
          <div className="hidden" aria-hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <input type="hidden" name="startedAt" value={startedAt} />
          <label className="block text-sm font-semibold">Produktname
            <input name="product" defaultValue={v("product")} required maxLength={160} placeholder="z. B. Marke und Sorte" aria-invalid={!!err("product")} className={field} />
          </label>
          {err("product") && <p className="text-sm font-semibold text-bad">{err("product")}</p>}
          <label className="block text-sm font-semibold">Ihre Fragen dazu (optional)
            <textarea name="question" defaultValue={v("question")} rows={3} maxLength={1000} placeholder="Was möchten Sie über das Produkt wissen?" className={`${field} py-3`} />
          </label>
          <label className="block text-sm font-semibold">E-Mail für eine Rückmeldung (optional)
            <input name="email" type="email" defaultValue={v("email")} autoComplete="email" aria-invalid={!!err("email")} className={field} />
          </label>
          {err("email") && <p className="text-sm font-semibold text-bad">{err("email")}</p>}
          <label className="flex items-start gap-2 text-sm text-muted">
            <input type="checkbox" name="consent" className="mt-0.5 size-5 shrink-0 accent-[var(--brand)]" aria-invalid={!!err("consent")} />
            <span>Ich bin einverstanden, dass meine Angaben zur Bearbeitung gespeichert werden (siehe <Link href="/datenschutz" className="underline">Datenschutzerklärung</Link>).</span>
          </label>
          {err("consent") && <p className="text-sm font-semibold text-bad">{err("consent")}</p>}
          <p aria-live="polite" className="text-sm font-semibold text-bad">{!state.ok && state.message}</p>
          <button type="submit" disabled={pending} className="min-h-12 rounded-full bg-accent px-6 font-bold text-white hover:bg-accent-strong disabled:opacity-60 dark:text-black">{pending ? "Wird gesendet…" : "Wunsch senden"}</button>
        </form>
      )}
    </section>
  );
}
