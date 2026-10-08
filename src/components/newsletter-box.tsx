"use client";
import Link from "next/link";
import { useActionState } from "react";
import { MailCheck } from "lucide-react";
import { subscribeNewsletter } from "@/lib/newsletter/actions";
import type { NewsletterState } from "@/lib/newsletter/schema";

export function NewsletterBox({ compact = false }: { compact?: boolean }) {
  const [state, action, pending] = useActionState<NewsletterState, FormData>(subscribeNewsletter, { ok: false, message: "" });
  return (
    <section aria-labelledby="newsletter-h" className={`rounded-3xl bg-brand-strong text-white dark:bg-brand-soft dark:text-fg ${compact ? "p-5" : "p-6 md:p-8"}`}>
      <div className="flex items-start gap-3">
        <MailCheck className="mt-1 size-7 shrink-0 opacity-90" aria-hidden />
        <div className="flex-1">
          <h2 id="newsletter-h" className="text-xl font-extrabold md:text-2xl">Neue Tests &amp; Rückrufe per E-Mail</h2>
          <p className="mt-1 text-white/85 dark:text-muted">Höchstens zweimal im Monat: neue Testergebnisse, Produktwarnungen und Fachwissen. Jederzeit abbestellbar.</p>
        </div>
      </div>
      {state.ok ? (
        <p role="status" className="mt-4 rounded-2xl bg-white/15 p-4 font-semibold">{state.message}</p>
      ) : (
        <form action={action} className="mt-4 space-y-3">
          <div className="hidden" aria-hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="flex-1">
              <span className="sr-only">E-Mail-Adresse</span>
              <input name="email" type="email" required autoComplete="email" placeholder="Ihre E-Mail-Adresse" className="min-h-12 w-full rounded-full border-0 bg-white px-5 text-base text-[#12201f] placeholder:text-[#4b5f5d]" />
            </label>
            <button type="submit" disabled={pending} className="min-h-12 rounded-full bg-accent px-6 font-bold text-white hover:bg-accent-strong disabled:opacity-60 dark:text-black">{pending ? "Wird gesendet…" : "Anmelden"}</button>
          </div>
          <label className="flex items-start gap-2 text-sm text-white/85 dark:text-muted">
            <input type="checkbox" name="consent" required className="mt-0.5 size-5 shrink-0 accent-[var(--accent)]" />
            <span>Ich möchte den Newsletter erhalten und habe die <Link href="/datenschutz" className="underline">Datenschutzerklärung</Link> gelesen. Die Anmeldung wird per E-Mail bestätigt (Double-Opt-In).</span>
          </label>
          {state.message && <p aria-live="polite" className="text-sm font-semibold text-[#ffd7c2] dark:text-bad">{state.message}</p>}
        </form>
      )}
    </section>
  );
}
