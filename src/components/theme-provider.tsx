"use client";
import { ThemeProvider as NextThemes } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    // Standard ist das helle Layout, unabhängig von der Systemeinstellung. Dunkel nur per Umschalter.
    // Neuer storageKey: frühere „System“-Einstellungen aus dem Browser werden so zurückgesetzt.
    <NextThemes attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange storageKey="fp-theme-v2">
      {children}
    </NextThemes>
  );
}
