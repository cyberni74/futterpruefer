/** Fenster, in dem ein Besucher als „online“ zählt (Pings kommen alle 30 s). */
export const ONLINE_FENSTER_MS = 90_000;
/** Ältere Einträge werden gelöscht. */
export const ONLINE_AUFBEWAHRUNG_MS = 10 * 60_000;
export const PING_INTERVALL_MS = 30_000;

/** Zufällige Kennung (z. B. UUID) ohne Personenbezug. */
export const gueltigeId = (id: unknown): id is string => typeof id === "string" && /^[A-Za-z0-9-]{16,64}$/.test(id);

/** Einfache Missbrauchsbremse je Absender im Arbeitsspeicher (nichts wird gespeichert oder protokolliert). */
export function bremse(max = 8, fensterMs = 60_000) {
  const stand = new Map<string, { n: number; bis: number }>();
  return (schluessel: string, jetzt = Date.now()): boolean => {
    if (stand.size > 5000) for (const [k, v] of stand) if (v.bis < jetzt) stand.delete(k);
    const e = stand.get(schluessel);
    if (!e || e.bis < jetzt) {
      stand.set(schluessel, { n: 1, bis: jetzt + fensterMs });
      return false;
    }
    e.n += 1;
    return e.n > max;
  };
}
