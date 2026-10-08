"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-2xl font-extrabold">Etwas ist schiefgelaufen</h1>
      <p className="mt-2 text-muted">{error.message || "Unbekannter Fehler"}</p>
      <button type="button" onClick={reset} className="mt-6 min-h-12 rounded-full bg-accent px-6 font-bold text-white dark:text-black">Erneut versuchen</button>
    </div>
  );
}
