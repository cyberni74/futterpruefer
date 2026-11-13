"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CONSENT_COOKIE,
  CONSENT_KEY,
  CONSENT_OPEN_EVENT,
  hasCurrentConsent,
  parseConsentValue,
  type ConsentChoice,
} from "@/lib/consent";

function readCookieConsent() {
  try {
    for (const part of document.cookie.split(";")) {
      const c = part.trim();
      if (!c.startsWith(`${CONSENT_COOKIE}=`)) continue;
      const parsed = parseConsentValue(decodeURIComponent(c.slice(CONSENT_COOKIE.length + 1)));
      if (parsed && hasCurrentConsent(`v${parsed.version}.${parsed.choice}`)) return parsed.choice;
    }
  } catch {}
  return null;
}

function readStoredChoice(): ConsentChoice | null {
  const fromCookie = readCookieConsent();
  if (fromCookie) return fromCookie;
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === "ok" || stored === "essential") return stored;
  } catch {}
  return null;
}

function hasConsentCookie(): boolean {
  return readCookieConsent() !== null;
}

function hideBanner() {
  document.documentElement.classList.add("fp-consent");
  if (!document.getElementById("fp-consent-hide")) {
    const style = document.createElement("style");
    style.id = "fp-consent-hide";
    style.textContent = "#fp-cookie{display:none!important}";
    (document.head || document.documentElement).appendChild(style);
  }
}

function showBanner() {
  document.documentElement.classList.remove("fp-consent");
  document.getElementById("fp-consent-hide")?.remove();
}

async function persistConsent(choice: ConsentChoice) {
  try {
    await fetch("/api/consent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ choice }),
      credentials: "same-origin",
    });
  } catch {}
}

/** Die Seite setzt keine Tracking-Cookies (cookiefreie Analyse). Der Hinweis informiert und speichert die Kenntnisnahme. */
export function CookieBanner() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const stored = readStoredChoice();
    if (stored) {
      hideBanner();
      setOpen(false);
      if (!hasConsentCookie()) void persistConsent(stored);
    }
    const onOpen = () => {
      setOpen(true);
      showBanner();
    };
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
  }, []);

  const close = (choice: ConsentChoice) => {
    try { localStorage.setItem(CONSENT_KEY, choice); } catch {}
    hideBanner();
    setOpen(false);
    void persistConsent(choice);
  };

  if (!open) return null;

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
