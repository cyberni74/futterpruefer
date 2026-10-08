"use client";
import Link from "next/link";
import { useState } from "react";
import { CONSENT_KEY } from "@/lib/consent";


/** Die Seite setzt keine Tracking-Cookies (cookiefreie Analyse). Der Hinweis informiert und speichert die Kenntnisnahme lokal. */
export function CookieBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  const close = (v: string) => {
    try { localStorage.setItem(CONSENT_KEY, v); } catch {}
    document.documentElement.classList.add("fp-consent");
    setDismissed(true);
  };
  return (
    <div id="fp-cookie" role="region" aria-label="Datenschutzhinweis" className="fixed inset-x-3 bottom-20 z-50 mx-auto max-w-xl rounded-2xl border border-border bg-surface p-4 shadow-lift md:bottom-4">
      <p className="text-sm">
        Wir verwenden nur technisch notwendige Speicherungen (z. B. Ihre Farbschema-Wahl) und eine cookiefreie, anonyme Reichweitenmessung. Details in der <Link href="/datenschutz" className="font-semibold text-brand underline">Datenschutzerklärung</Link>.
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => close("ok")} className="min-h-11 flex-1 rounded-full bg-accent px-4 text-sm font-bold text-white hover:bg-accent-strong dark:text-black">Verstanden</button>
        <button type="button" onClick={() => close("essential")} className="min-h-11 flex-1 rounded-full border border-border px-4 text-sm font-semibold hover:bg-bg-soft">Nur notwendige</button>
      </div>
    </div>
  );
}
