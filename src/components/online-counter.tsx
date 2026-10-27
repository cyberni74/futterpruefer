"use client";

import { useEffect, useState } from "react";
import { CONSENT_CHANGE_EVENT, CONSENT_KEY, readConsent, visitorId } from "@/lib/consent";
import { PING_INTERVALL_MS } from "@/lib/online";

export const GAESTE_TOOLTIP = "gezählt: Gäste der letzten 90 Sekunden, die der Anzeige zugestimmt haben";

/**
 * „Gäste online“ mit echten Zahlen, nur nach Zustimmung im Datenschutzhinweis (§ 25 TDDDG).
 * Alle Tabs eines Browsers senden dieselbe Kennung (lokaler Speicher), ein Gast zählt also einmal.
 * Ohne Zustimmung, nach Widerruf oder ohne Serverantwort wird nichts angezeigt und nichts gesendet.
 */
export function OnlineCounter() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    let aktiv = false;
    let timer: ReturnType<typeof setInterval> | null = null;
    const ping = async () => {
      if (!aktiv || document.visibilityState === "hidden") return;
      const id = visitorId();
      if (!id) return;
      try {
        const r = await fetch("/api/online", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }), cache: "no-store", keepalive: true });
        if (!r.ok) return;
        const d = (await r.json()) as { count: number | null };
        // Antwort nach einem Widerruf ignorieren
        if (aktiv && typeof d.count === "number" && d.count > 0) setCount(d.count);
      } catch {
        /* offline: Anzeige bleibt wie sie ist */
      }
    };
    const stoppen = () => {
      aktiv = false;
      if (timer) clearInterval(timer);
      timer = null;
      setCount(null);
    };
    const abgleichen = () => {
      if (readConsent() === "all") {
        if (aktiv) return;
        aktiv = true;
        ping();
        timer = setInterval(ping, PING_INTERVALL_MS);
      } else stoppen();
    };
    const sichtbar = () => { if (document.visibilityState === "visible") ping(); };
    // storage: Widerruf oder Zustimmung in einem anderen Tab wirkt sofort in allen Tabs
    const speicher = (e: StorageEvent) => { if (e.key === CONSENT_KEY || e.key === null) abgleichen(); };
    abgleichen();
    window.addEventListener(CONSENT_CHANGE_EVENT, abgleichen);
    window.addEventListener("storage", speicher);
    document.addEventListener("visibilitychange", sichtbar);
    return () => {
      aktiv = false;
      if (timer) clearInterval(timer);
      window.removeEventListener(CONSENT_CHANGE_EVENT, abgleichen);
      window.removeEventListener("storage", speicher);
      document.removeEventListener("visibilitychange", sichtbar);
    };
  }, []);
  // Ohne Zahl nichts rendern: kein Leerraum unter dem Footer
  if (count == null) return null;
  return (
    <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted" aria-live="off" title={GAESTE_TOOLTIP}>
      <span aria-hidden className="online-dot" />
      <span><strong className="font-semibold tabular-nums text-fg">{count}</strong> {count === 1 ? "Gast" : "Gäste"} online</span>
      <span className="sr-only">({GAESTE_TOOLTIP})</span>
    </div>
  );
}
