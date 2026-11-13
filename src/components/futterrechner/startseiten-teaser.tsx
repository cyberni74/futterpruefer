import { Calculator, Cat, Dog } from "lucide-react";
import Link from "next/link";

const linkClass = "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 font-bold text-white hover:bg-accent-strong dark:text-black";

/** Teaser-Box direkt nach dem Hero. Die Futterart schaltet die Links per CSS, ohne Client-JavaScript. */
export function StartseitenTeaser() {
  return (
    <section aria-labelledby="futterrechner-teaser" className="mx-auto mt-6 max-w-6xl px-4">
      <div className="rounded-3xl bg-brand-soft p-5 shadow-card md:grid md:grid-cols-2 md:items-center md:gap-8 md:p-8">
        <div>
          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-brand"><Calculator aria-hidden className="size-4" /> Neu: Futterrechner</p>
          <h2 id="futterrechner-teaser" className="font-display mt-2 text-2xl font-extrabold md:text-3xl">Stimmen die Nährwerte Ihres Futters?</h2>
          <p className="mt-2 text-muted">Zu wenig Eiweiß oder zu viel Calcium sieht man auf dem Etikett nicht auf den ersten Blick. Gerade bei Welpen und Kitten zählt das Gleichgewicht der Nährstoffe. Prüfen Sie Ihr Futter in einer Minute nach den FEDIAF-Richtwerten.</p>
        </div>
        <div className="teaser-art mt-4 space-y-3 md:mt-0">
          <fieldset>
            <legend className="sr-only">Futterart</legend>
            <div className="flex gap-2">
              <label className="flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-full border border-border bg-surface px-4 text-sm font-bold transition-colors focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2">
                <input type="radio" name="teaser-futterart" value="trocken" defaultChecked className="sr-only" />
                Trocken
              </label>
              <label className="flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-full border border-border bg-surface px-4 text-sm font-bold transition-colors focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2">
                <input type="radio" name="teaser-futterart" value="nass" className="sr-only" />
                Nass
              </label>
            </div>
          </fieldset>
          <div className="teaser-trocken space-y-3">
            <Link href="/futterrechner/hund#typ=trocken" className={linkClass}><Dog aria-hidden className="size-5" /> Hundefutter prüfen</Link>
            <Link href="/futterrechner/katze#typ=trocken" className={linkClass}><Cat aria-hidden className="size-5" /> Katzenfutter prüfen</Link>
          </div>
          <div className="teaser-nass space-y-3">
            <Link href="/futterrechner/hund#typ=nass" className={linkClass}><Dog aria-hidden className="size-5" /> Hundefutter prüfen</Link>
            <Link href="/futterrechner/katze#typ=nass" className={linkClass}><Cat aria-hidden className="size-5" /> Katzenfutter prüfen</Link>
          </div>
          <p className="text-xs text-muted">Kostenlos · ohne Anmeldung · nichts gespeichert · bewertet nur Nährwerte, keine Zutaten</p>
        </div>
      </div>
    </section>
  );
}
