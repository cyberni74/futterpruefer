"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Hellen Modus aktivieren" : "Dunklen Modus aktivieren"}
      className={`inline-flex size-11 items-center justify-center rounded-full text-fg hover:bg-bg-soft ${className}`}
    >
      {mounted ? (dark ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />) : <span className="size-5" />}
    </button>
  );
}
