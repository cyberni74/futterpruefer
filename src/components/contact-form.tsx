"use client";
import Script from "next/script";
import { useActionState, useState } from "react";
import { submitContact } from "@/lib/contact/actions";
import type { ContactState } from "@/lib/contact/schema";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactForm({ defaultKind }: { defaultKind: "allgemein" | "hersteller" }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, { ok: false, message: "" });
  const [kind, setKind] = useState(defaultKind);
  const [startedAt] = useState(() => Date.now());
  const err = (k: string) => state.errors?.[k];
  const v = (k: string) => state.values?.[k] ?? "";
  const field = "mt-1 block min-h-12 w-full rounded-xl border border-border bg-surface px-4 text-base aria-[invalid=true]:border-bad";

  if (state.ok) return <p role="status" className="rounded-2xl bg-good-soft p-5 font-semibold text-good">{state.message}</p>;

  return (
    <form action={action} className="space-y-5" noValidate>
      {SITE_KEY && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />}
      <fieldset>
        <legend className="mb-2 font-bold">Art der Anfrage</legend>
        <div className="grid grid-cols-2 gap-2">
          {(["allgemein", "hersteller"] as const).map((k) => (
            <label key={k} className={`flex min-h-12 cursor-pointer items-center justify-center rounded-xl border-2 px-3 text-sm font-semibold ${kind === k ? "border-brand bg-brand-soft" : "border-border"}`}>
              <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} className="sr-only" />
              {k === "allgemein" ? "Allgemeine Anfrage" : "Herstelleranfrage"}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="hidden" aria-hidden>
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />
      <label className="block font-semibold">Name<input name="name" defaultValue={v("name")} autoComplete="name" required aria-invalid={!!err("name")} aria-describedby="e-name" className={field} /></label>
      {err("name") && <p id="e-name" className="text-sm text-bad">{err("name")}</p>}
      <label className="block font-semibold">E-Mail<input name="email" defaultValue={v("email")} type="email" autoComplete="email" required aria-invalid={!!err("email")} aria-describedby="e-email" className={field} /></label>
      {err("email") && <p id="e-email" className="text-sm text-bad">{err("email")}</p>}
      {kind === "hersteller" && <label className="block font-semibold">Unternehmen<input name="company" defaultValue={v("company")} autoComplete="organization" className={field} /></label>}
      <label className="block font-semibold">Nachricht<textarea name="message" defaultValue={v("message")} rows={6} required aria-invalid={!!err("message")} aria-describedby="e-message" className={`${field} py-3`} /></label>
      {err("message") && <p id="e-message" className="text-sm text-bad">{err("message")}</p>}
      {kind === "hersteller" && <p className="rounded-xl bg-bg-soft p-3 text-sm">Hinweis: Eine Einreichung kauft keine Note. Die Bewertung erfolgt ausschließlich nach unserer Methodik.</p>}
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="consent" className="mt-0.5 size-5 accent-[var(--brand)]" aria-invalid={!!err("consent")} />
        <span>Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage gespeichert werden (siehe Datenschutzerklärung).</span>
      </label>
      {err("consent") && <p className="text-sm text-bad">{err("consent")}</p>}
      {SITE_KEY && <div className="cf-turnstile" data-sitekey={SITE_KEY} data-language="de" />}
      <p aria-live="polite" className="text-sm font-semibold text-bad">{!state.ok && state.message}</p>
      <button type="submit" disabled={pending} className="min-h-12 w-full rounded-full bg-accent px-6 font-bold text-white hover:bg-accent-strong disabled:opacity-60 dark:text-black sm:w-auto">
        {pending ? "Wird gesendet…" : "Nachricht senden"}
      </button>
    </form>
  );
}
