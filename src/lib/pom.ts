/** Produkt des Monats = Testsieger: Pro Monat gewinnt der Test mit der höchsten Gesamtwertung (bei Gleichstand der neuere). Ein manueller Eintrag überschreibt den Automatismus. */
import { MONTHS } from "./site";

type Rev = { publishedAt: Date | null; totalScore: number };
export type PomManual<R extends Rev> = { id: string; year: number; month: number; reason: string; review: R };
export type PomItem<R extends Rev> = { id: string; year: number; month: number; reason: string; review: R; auto: boolean };

const key = (y: number, m: number) => y * 12 + (m - 1);

export function autoReason(month: number, year: number, score: number): string {
  return `Testsieger im ${MONTHS[month - 1]} ${year}: ${score} von 100 Punkten – die höchste Gesamtwertung aller in diesem Monat veröffentlichten Tests.`;
}

export function buildMonthlyWinners<R extends Rev>(reviews: R[], manual: Array<PomManual<R>>, now = new Date()): Array<PomItem<R>> {
  const nowKey = key(now.getUTCFullYear(), now.getUTCMonth() + 1);
  const winners = new Map<number, R>();
  for (const r of reviews) {
    if (!r.publishedAt) continue;
    const k = key(r.publishedAt.getUTCFullYear(), r.publishedAt.getUTCMonth() + 1);
    if (k > nowKey) continue;
    const best = winners.get(k);
    if (!best || r.totalScore > best.totalScore || (r.totalScore === best.totalScore && r.publishedAt > (best.publishedAt as Date))) winners.set(k, r);
  }
  const items = new Map<number, PomItem<R>>();
  for (const [k, review] of winners) {
    const year = Math.floor(k / 12), month = (k % 12) + 1;
    items.set(k, { id: `auto-${year}-${month}`, year, month, reason: autoReason(month, year, review.totalScore), review, auto: true });
  }
  for (const m of manual) {
    const k = key(m.year, m.month);
    if (k > nowKey) continue;
    items.set(k, { ...m, auto: false });
  }
  return [...items.entries()].sort((a, b) => b[0] - a[0]).map(([, v]) => v);
}

/** Aktuelle Anzeige: Eintrag des laufenden Monats, sonst der jüngste vorhandene. */
export function currentPom<R extends Rev>(items: Array<PomItem<R>>, now = new Date()): PomItem<R> | null {
  const k = key(now.getUTCFullYear(), now.getUTCMonth() + 1);
  return items.find((i) => key(i.year, i.month) === k) ?? items[0] ?? null;
}
