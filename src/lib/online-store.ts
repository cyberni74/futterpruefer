import { useSyncExternalStore } from "react";
import { CONSENT_CHANGE_EVENT, CONSENT_KEY, readConsent, visitorId } from "./consent";
import { PING_INTERVALL_MS } from "./online";

/**
 * Gemeinsamer Zustand der „Gäste online“-Anzeige: genau eine Meldeschleife pro Tab, egal wie viele Stellen (Menü unten, Footer) die Zahl zeigen.
 * Läuft nur nach Zustimmung (§ 25 TDDDG); ohne Zustimmung, nach Widerruf oder ohne Antwort des Servers gibt es keine Zahl.
 */
let count: number | null = null;
let aktiv = false;
let timer: ReturnType<typeof setInterval> | null = null;
let abonnenten = 0;
const hoerer = new Set<() => void>();

const melden = () => hoerer.forEach((h) => h());
const setze = (n: number | null) => {
  if (n === count) return;
  count = n;
  melden();
};

async function ping() {
  if (!aktiv || document.visibilityState === "hidden") return;
  const id = visitorId();
  if (!id) return;
  try {
    const r = await fetch("/api/online", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }), cache: "no-store", keepalive: true });
    if (!r.ok) return;
    const d = (await r.json()) as { count: number | null };
    // Antwort nach einem Widerruf ignorieren
    if (aktiv && typeof d.count === "number" && d.count > 0) setze(d.count);
  } catch {
    /* offline: Anzeige bleibt wie sie ist */
  }
}

function stoppen() {
  aktiv = false;
  if (timer) clearInterval(timer);
  timer = null;
  setze(null);
}

function abgleichen() {
  if (readConsent() === "all") {
    if (aktiv) return;
    aktiv = true;
    void ping();
    timer = setInterval(ping, PING_INTERVALL_MS);
  } else stoppen();
}

const sichtbar = () => { if (document.visibilityState === "visible") void ping(); };
// storage: Widerruf oder Zustimmung in einem anderen Tab wirkt sofort in allen Tabs
const speicher = (e: StorageEvent) => { if (e.key === CONSENT_KEY || e.key === null) abgleichen(); };

function starten() {
  window.addEventListener(CONSENT_CHANGE_EVENT, abgleichen);
  window.addEventListener("storage", speicher);
  document.addEventListener("visibilitychange", sichtbar);
  abgleichen();
}
function beenden() {
  window.removeEventListener(CONSENT_CHANGE_EVENT, abgleichen);
  window.removeEventListener("storage", speicher);
  document.removeEventListener("visibilitychange", sichtbar);
  stoppen();
}

function abonnieren(h: () => void) {
  hoerer.add(h);
  if (++abonnenten === 1) starten();
  return () => {
    hoerer.delete(h);
    if (--abonnenten === 0) beenden();
  };
}

/** Anzahl der Gäste oder null (nichts anzeigen). */
export const useOnlineCount = (): number | null => useSyncExternalStore(abonnieren, () => count, () => null);
