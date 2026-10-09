"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useClientValue } from "@/lib/use-client";

/** Schieberschalter Hell/Dunkel: Sonne links, Mond rechts, der Knopf zeigt den aktiven Modus. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useClientValue(() => true, false);
  const dark = mounted && resolvedTheme === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dunkler Modus"
      title={dark ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln"}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className={`group inline-flex min-h-11 shrink-0 items-center rounded-full px-1 ${className}`}
    >
      <span
        className={`relative flex h-8 w-[3.75rem] items-center justify-between rounded-full border-2 px-1.5 transition-colors duration-300 ${dark ? "border-brand bg-brand-soft" : "border-border bg-bg-soft"}`}
        aria-hidden
      >
        <Sun className={`size-4 ${dark ? "text-muted" : "text-accent"}`} />
        <Moon className={`size-4 ${dark ? "text-brand" : "text-muted"}`} />
        <span
          className={`absolute left-0.5 top-0.5 flex size-6 items-center justify-center rounded-full bg-white shadow-card transition-transform duration-300 motion-reduce:transition-none ${dark ? "translate-x-[1.75rem]" : "translate-x-0"}`}
        >
          {mounted ? dark ? <Moon className="size-3.5 text-brand-strong" /> : <Sun className="size-3.5 text-accent" /> : null}
        </span>
      </span>
    </button>
  );
}
