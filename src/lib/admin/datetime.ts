/**
 * Redaktionelle Zeitangaben (datetime-local) werden immer als Ortszeit Berlin interpretiert –
 * unabhängig von der Zeitzone des Servers oder Browsers. Dadurch sind Server- und Client-Rendering identisch.
 */
export const EDITORIAL_TZ = "Europe/Berlin";

const LOCAL_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;

function tzOffsetMs(utcMs: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

/** "2026-10-08T14:30" (Berlin) → Date. Gibt null zurück bei ungültiger Eingabe. */
export function berlinLocalToDate(value: string | null | undefined, timeZone = EDITORIAL_TZ): Date | null {
  if (!value) return null;
  const m = LOCAL_RE.exec(value.trim());
  if (!m) return null;
  const [y, mo, d, h, mi, s] = m.slice(1).map((v) => Number(v ?? 0));
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || h > 23 || mi > 59) return null;
  const guess = Date.UTC(y, mo - 1, d, h, mi, s || 0);
  let result = guess - tzOffsetMs(guess, timeZone);
  // Zweiter Durchlauf für Sommer-/Winterzeit-Grenzen
  const second = guess - tzOffsetMs(result, timeZone);
  if (second !== result) result = second;
  const date = new Date(result);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Date → "2026-10-08T14:30" in Berliner Ortszeit (für datetime-local). */
export function dateToBerlinLocal(date: Date | string | null | undefined, timeZone = EDITORIAL_TZ): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  const local = new Date(d.getTime() + tzOffsetMs(d.getTime(), timeZone));
  return local.toISOString().slice(0, 16);
}

/** Lesbares Datum mit Uhrzeit, z. B. "08.10.2026, 14:30". */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short", timeZone: EDITORIAL_TZ }).format(d);
}
