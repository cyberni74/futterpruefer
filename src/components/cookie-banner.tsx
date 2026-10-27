"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CONSENT_OPEN_EVENT, writeConsent } from "@/lib/consent";

/**
 * Datenschutzhinweis. „Zustimmen“ erlaubt zusätzlich die Live-Anzeige der Gäste im Footer (zufällige Kennung im lokalen Speicher),
 * „Nur notwendige“ schaltet sie ab. Über „Datenschutz-Einstellungen“ im Footer lässt sich der Hinweis jederzeit wieder öffnen.
 */
export function CookieBanner() {
  const [dismissed, setDismissed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const open = () => {
      setDismissed(false);
      setTimeout(() => ref.current?.focus(), 0);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open);
  }, []);
  if (dismissed) return null;
  const close = (v: "all" | "essential") => {
    writeConsent(v);
    setDismissed(true);
  };
  return (
    <div id="fp-cookie" ref={ref} tabIndex={-1} role="region" aria-label="Datenschutzhinweis" className="border-b border-border bg-bg-soft outline-none">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
        <p className="text-sm sm:flex-1">
          Wir verwenden technisch notwendige Speicherungen (z. B. Ihre Farbschema-Wahl) und eine cookiefreie Reichweitenmessung. Mit „Zustimmen“ erlauben Sie zusätzlich die Live-Anzeige der Gäste im Footer, für die Ihr Browser eine zufällige Kennung speichert und sendet. Details in der <Link href="/datenschutz" className="font-semibold text-brand underline">Datenschutzerklärung</Link>.
        </p>
        <div className="flex gap-2 sm:shrink-0">
          <button type="button" onClick={() => close("all")} className="min-h-11 flex-1 rounded-full bg-accent px-4 text-sm font-bold text-white hover:bg-accent-strong sm:flex-none dark:text-black">Zustimmen</button>
          <button type="button" onClick={() => close("essential")} className="min-h-11 flex-1 rounded-full border border-border bg-surface px-4 text-sm font-semibold hover:bg-bg-soft sm:flex-none">Nur notwendige</button>
        </div>
      </div>
    </div>
  );
}
