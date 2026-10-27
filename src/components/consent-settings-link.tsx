"use client";
import { openConsentBanner } from "@/lib/consent";

/** Footer-Link „Datenschutz-Einstellungen“: öffnet den Hinweis wieder (Widerruf der Einwilligung). */
export function ConsentSettingsLink() {
  return (
    <button type="button" onClick={openConsentBanner} className="inline-flex min-h-9 items-center text-sm text-muted hover:text-fg hover:underline">
      Datenschutz-Einstellungen
    </button>
  );
}
