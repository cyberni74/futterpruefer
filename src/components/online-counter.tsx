"use client";

import { useEffect, useState } from "react";
import { PING_INTERVALL_MS } from "@/lib/online";

/**
 * „Gerade online“ mit echten Zahlen. Die Kennung liegt nur im Arbeitsspeicher dieses Seitenaufrufs
 * (kein Cookie, kein localStorage). Ohne Antwort des Servers bleibt die Anzeige unsichtbar.
 */
export function OnlineCounter() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    const id = crypto.randomUUID();
    let aktiv = true;
    const ping = async () => {
      if (document.visibilityState === "hidden") return;
      try {
        const r = await fetch("/api/online", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }), cache: "no-store", keepalive: true });
        if (!r.ok) return;
        const d = (await r.json()) as { count: number | null };
        if (aktiv && typeof d.count === "number" && d.count > 0) setCount(d.count);
      } catch {
        /* offline: Anzeige bleibt wie sie ist */
      }
    };
    ping();
    const t = setInterval(ping, PING_INTERVALL_MS);
    const sichtbar = () => { if (document.visibilityState === "visible") ping(); };
    document.addEventListener("visibilitychange", sichtbar);
    return () => { aktiv = false; clearInterval(t); document.removeEventListener("visibilitychange", sichtbar); };
  }, []);
  return (
    <div className="mt-2 flex min-h-5 items-center justify-center gap-2 text-xs text-muted" aria-live="off">
      {count != null && (
        <>
          <span aria-hidden className="online-dot" />
          <span><strong className="font-semibold tabular-nums text-fg">{count}</strong> {count === 1 ? "Person" : "Personen"} gerade online</span>
        </>
      )}
    </div>
  );
}
