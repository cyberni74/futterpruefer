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
    <div id="fp-cookie" role="region" aria-label="Datenschutzhinweis" className="border-b border-border bg-bg-soft">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
        <p className="text-sm sm:flex-1">
          Wir verwenden nur technisch notwendige Speicherungen (z. B. Ihre Farbschema-Wahl) und eine cookiefreie, anonyme Reichweitenmessung. Details in der <Link href="/datenschutz" className="font-semibold text-brand underline">Datenschutzerklärung</Link>.
        </p>
        <div className="flex gap-2 sm:shrink-0">
          <button type="button" onClick={() => close("ok")} className="min-h-11 flex-1 rounded-full bg-accent px-4 text-sm font-bold text-white hover:bg-accent-strong sm:flex-none dark:text-black">Verstanden</button>
          <button type="button" onClick={() => close("essential")} className="min-h-11 flex-1 rounded-full border border-border bg-surface px-4 text-sm font-semibold hover:bg-bg-soft sm:flex-none">Nur notwendige</button>
        </div>
      </div>
    </div>
  );
}
