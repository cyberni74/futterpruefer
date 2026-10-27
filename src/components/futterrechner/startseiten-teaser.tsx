"use client";

import { Calculator, Cat, Dog } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/** Teaser-Box direkt nach dem Hero (Konzept 10.1). Ohne JS bleiben die Buttons normale Links (Vorgabe „trocken“). */
export function StartseitenTeaser() {
  const [typ, setTyp] = useState<"trocken" | "nass">("trocken");
  const seg = (v: "trocken" | "nass", label: string) => (
    <label className={`flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-full border px-4 text-sm font-bold transition-colors focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 ${typ === v ? "border-brand bg-brand text-white dark:text-black" : "border-border bg-surface hover:border-brand"}`}>
      <input type="radio" name="teaser-futterart" value={v} checked={typ === v} onChange={() => setTyp(v)} className="sr-only" />
      {label}
    </label>
  );
  return (
    <section aria-labelledby="futterrechner-teaser" className="mx-auto mt-6 max-w-6xl px-4">
      <div className="rounded-3xl bg-brand-soft p-5 shadow-card md:grid md:grid-cols-2 md:items-center md:gap-8 md:p-8">
        <div>
          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-brand"><Calculator aria-hidden className="size-4" /> Neu: Futterrechner</p>
          <h2 id="futterrechner-teaser" className="font-display mt-2 text-2xl font-extrabold md:text-3xl">Stimmen die Nährwerte Ihres Futters?</h2>
          <p className="mt-2 text-muted">Zu wenig Eiweiß oder zu viel Calcium sieht man auf dem Etikett nicht auf den ersten Blick. Gerade bei Welpen und Kitten zählt das Gleichgewicht der Nährstoffe. Prüfen Sie Ihr Futter in einer Minute nach den FEDIAF-Richtwerten.</p>
        </div>
        <div className="mt-4 space-y-3 md:mt-0">
          <fieldset>
            <legend className="sr-only">Futterart</legend>
            <div className="flex gap-2">{seg("trocken", "Trocken")}{seg("nass", "Nass")}</div>
          </fieldset>
          <Link href={`/futterrechner/hund#typ=${typ}`} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 font-bold text-white hover:bg-accent-strong dark:text-black">
            <Dog aria-hidden className="size-5" /> Hundefutter prüfen
          </Link>
          <Link href={`/futterrechner/katze#typ=${typ}`} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 font-bold text-white hover:bg-accent-strong dark:text-black">
            <Cat aria-hidden className="size-5" /> Katzenfutter prüfen
          </Link>
          <p className="text-xs text-muted">Kostenlos · ohne Anmeldung · nichts gespeichert · bewertet nur Nährwerte, keine Zutaten</p>
        </div>
      </div>
    </section>
  );
}
