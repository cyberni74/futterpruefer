"use client";

import { useOnlineCount } from "@/lib/online-store";

export const GAESTE_TOOLTIP = "gezählt: Gäste der letzten 90 Sekunden, die der Anzeige zugestimmt haben";

/**
 * „Gäste online“ mit echten Zahlen, nur nach Zustimmung im Datenschutzhinweis (§ 25 TDDDG).
 * `leiste` sitzt am unteren Rand des Menüs unten (mobil), `footer` im Seitenende (ab Tablet). Beide teilen sich eine Meldeschleife.
 * Ohne Zahl wird nichts gerendert, es bleibt kein Leerraum.
 */
export function OnlineCounter({ variant = "footer" }: { variant?: "footer" | "leiste" }) {
  const count = useOnlineCount();
  if (count == null) return null;
  const rahmen = variant === "leiste" ? "flex border-t border-border/60 py-1 text-xs md:hidden" : "mt-2 hidden text-xs md:flex";
  return (
    <div className={`${rahmen} items-center justify-center gap-2 text-muted`} aria-live="off" title={GAESTE_TOOLTIP} data-online={variant}>
      <span aria-hidden className="online-dot" />
      <span><strong className="font-semibold tabular-nums text-fg">{count}</strong> {count === 1 ? "Gast" : "Gäste"} online</span>
      <span className="sr-only">({GAESTE_TOOLTIP})</span>
    </div>
  );
}
