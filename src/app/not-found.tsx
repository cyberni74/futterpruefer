import type { Metadata } from "next";
import Link from "next/link";

/**
 * Kein Canonical: die Root-Layout-Angabe zeigt sonst auf die Startseite,
 * und eine 404-URL würde als Duplikat der Startseite gelesen.
 * noindex bleibt, Links auf der Seite dürfen gefolgt werden.
 */
export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-6xl" aria-hidden>🐾</p>
      <h1 className="text-3xl font-extrabold">Seite nicht gefunden</h1>
      <p className="text-muted">Diese Seite gibt es nicht (mehr). Vielleicht hilft die Suche oder die Testübersicht weiter.</p>
      <div className="flex gap-3">
        <Link href="/" className="inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-bold text-white hover:bg-accent-strong dark:text-black">Zur Startseite</Link>
        <Link href="/tests" className="inline-flex min-h-12 items-center rounded-full border border-border px-6 font-semibold hover:border-brand hover:bg-bg-soft">Alle Tests</Link>
      </div>
    </main>
  );
}
