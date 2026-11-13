import Link from "next/link";
import { AlertTriangle, Megaphone, Pause, Play } from "lucide-react";
import type { TickerEntry } from "@/lib/queries";

/** Laufband mit wichtigen Meldungen. Pause über eine Checkbox, damit kein Client-JavaScript nötig ist (WCAG 2.2.2). */
export function Ticker({ items }: { items: TickerEntry[] }) {
  if (!items.length) return null;
  const loop = [...items, ...items];
  // Tempo je Meldung statt fester Gesamtdauer: mehr Meldungen laufen nicht schneller.
  const duration = `${Math.max(60, items.length * 15)}s`;
  return (
    <section aria-label="Aktuelle Meldungen" className="border-b-4 border-accent bg-[#063d3d] text-white">
      <div className="mx-auto flex max-w-6xl items-stretch">
        <input id="ticker-pause" type="checkbox" className="peer sr-only" />
        <span className="z-10 flex shrink-0 items-center gap-2 bg-accent px-3 text-sm font-extrabold uppercase tracking-wider text-white sm:px-4">
          <span className="relative flex size-2.5" aria-hidden>
            <span className="absolute inline-flex size-full rounded-full bg-white opacity-70 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2.5 rounded-full bg-white" />
          </span>
          <Megaphone className="size-5" aria-hidden /> News
        </span>
        <div className="relative min-w-0 flex-1 overflow-hidden peer-checked:[&_.ticker-track]:[animation-play-state:paused] [mask-image:linear-gradient(to_right,transparent,#000_20px,#000_calc(100%-32px),transparent)]">
          <ul
            style={{ animationDuration: duration }}
            className="ticker-track flex w-max items-center py-3.5 pl-6 motion-reduce:w-full motion-reduce:flex-col motion-reduce:items-start motion-reduce:gap-1 motion-reduce:[&>li:nth-child(n+4)]:hidden"
          >
            {loop.map((t, i) => (
              <li key={`${t.id}-${i}`} aria-hidden={i >= items.length || undefined} className={`flex items-center whitespace-nowrap text-base font-semibold ${i >= items.length ? "motion-reduce:hidden" : ""}`}>
                <span className="mx-6 text-accent motion-reduce:hidden" aria-hidden>◆</span>
                {t.isWarning && (
                  <span className="mr-2 inline-flex items-center gap-1 rounded-md bg-bad px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide text-white dark:bg-[#dc2626]">
                    <AlertTriangle className="size-3.5" aria-hidden /> Warnung
                  </span>
                )}
                {t.href && i < items.length ? (
                  <Link href={t.href} className="underline decoration-white/40 underline-offset-4 hover:text-[#ffd7c2] hover:decoration-[#ffd7c2]">{t.text}</Link>
                ) : (
                  <span>{t.text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <label htmlFor="ticker-pause" className="z-10 flex min-w-11 shrink-0 cursor-pointer items-center justify-center px-3 text-white/80 hover:bg-white/10 hover:text-white motion-reduce:hidden peer-checked:[&_.when-pause]:hidden peer-checked:[&_.when-play]:inline-flex">
          <span className="when-pause inline-flex items-center">
            <Pause className="size-5" aria-hidden />
            <span className="sr-only">Laufband anhalten</span>
          </span>
          <span className="when-play hidden items-center">
            <Play className="size-5" aria-hidden />
            <span className="sr-only">Laufband fortsetzen</span>
          </span>
        </label>
      </div>
    </section>
  );
}
