import Link from "next/link";
import { AlertTriangle, Megaphone } from "lucide-react";
import type { TickerEntry } from "@/lib/queries";

export function Ticker({ items }: { items: TickerEntry[] }) {
  if (!items.length) return null;
  const loop = [...items, ...items];
  return (
    <section aria-label="Aktuelle Meldungen" className="border-y border-border bg-bg-soft">
      <div className="mx-auto flex max-w-6xl items-center">
        <span className="z-10 flex shrink-0 items-center gap-1.5 bg-brand px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-white">
          <Megaphone className="size-4" aria-hidden /> News
        </span>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <ul className="ticker-track flex w-max gap-8 py-2.5 pl-4 motion-reduce:w-full motion-reduce:flex-col motion-reduce:gap-1 motion-reduce:[&>li:nth-child(n+4)]:hidden">
            {loop.map((t, i) => (
              <li key={`${t.id}-${i}`} aria-hidden={i >= items.length || undefined} className={`flex items-center gap-1.5 whitespace-nowrap text-sm ${i >= items.length ? "motion-reduce:hidden" : ""}`}>
                {t.isWarning && <AlertTriangle className="size-4 text-bad" aria-hidden />}
                {t.href && i < items.length ? (
                  <Link href={t.href} className={`hover:underline ${t.isWarning ? "font-semibold text-bad" : ""}`}>{t.text}</Link>
                ) : (
                  <span className={t.isWarning ? "font-semibold text-bad" : ""}>{t.text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
