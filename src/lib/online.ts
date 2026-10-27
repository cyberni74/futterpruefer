import { createHash, randomBytes } from "node:crypto";

/** Fenster, in dem ein Besucher als „online“ zählt (Pings kommen alle 30 s). */
export const ONLINE_FENSTER_MS = 90_000;
/** Ältere Einträge werden gelöscht. */
export const ONLINE_AUFBEWAHRUNG_MS = 10 * 60_000;
export const PING_INTERVALL_MS = 30_000;

/** Zufällige Kennung (z. B. UUID) ohne Personenbezug. */
export const gueltigeId = (id: unknown): id is string => typeof id === "string" && /^[A-Za-z0-9-]{16,64}$/.test(id);

/** Bekannte Bots, Crawler, Monitoring und Vorschau-Dienste zählen nicht (ebenso fehlender User-Agent). */
const BOT = /bot|crawl|spider|slurp|archiver|fetch|scan|monitor|uptime|pingdom|lighthouse|headless|phantom|preview|facebookexternalhit|embedly|whatsapp|telegram|curl|wget|httpie|python|requests|axios|okhttp|java\/|go-http|libwww|postman|vercel|prerender|chrome-lighthouse|gtmetrix|semrush|ahrefs|mj12|dotbot|petalbot|bytespider|gptbot|claude|anthropic|perplexity|ccbot/i;
export const istBot = (userAgent: string | null | undefined): boolean => !userAgent || userAgent.length < 12 || BOT.test(userAgent);

/**
 * Missbrauchsbremse je Absender im Arbeitsspeicher. Der Schlüssel ist ein gesalzener Hash der IP-Adresse
 * (Salz nur im Arbeitsspeicher, wechselt bei jedem Start); abgelaufene Einträge werden bei JEDEM Aufruf entfernt.
 */
export function bremse(max = 8, fensterMs = 60_000) {
  const stand = new Map<string, { n: number; bis: number }>();
  const pruefen = (schluessel: string, jetzt = Date.now()): boolean => {
    for (const [k, v] of stand) if (v.bis < jetzt) stand.delete(k);
    const e = stand.get(schluessel);
    if (!e) {
      stand.set(schluessel, { n: 1, bis: jetzt + fensterMs });
      return false;
    }
    e.n += 1;
    return e.n > max;
  };
  pruefen.groesse = () => stand.size;
  return pruefen;
}

const SALZ = randomBytes(16);
/** Gesalzener Hash einer IP-Adresse, nur als Schlüssel der Bremse. */
export const ipSchluessel = (ip: string): string => createHash("sha256").update(SALZ).update(ip).digest("hex");
