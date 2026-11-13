"use client";
import { CONSENT_OPEN_EVENT } from "@/lib/consent";

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      className="inline-flex min-h-9 items-center text-sm text-muted hover:text-fg hover:underline"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
    >
      Cookie-Einstellungen
    </button>
  );
}
