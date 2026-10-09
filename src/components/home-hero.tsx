import Link from "next/link";
import { ArrowRight, BadgeCheck, FlaskConical, Scale } from "lucide-react";
import { HeroSearch } from "@/components/hero-search";
import { hyphenateCategory } from "@/lib/urls";
import type { getCategoryLeaders } from "@/lib/queries";

type Leaders = Awaited<ReturnType<typeof getCategoryLeaders>>;

const TRUST = [
  { Icon: BadgeCheck, text: "Unabhängig bewertet" },
  { Icon: FlaskConical, text: "Offene 100-Punkte-Methodik" },
  { Icon: Scale, text: "Faktencheck der Werbeaussagen" },
] as const;

const GROUPS = [
  { animal: "HUND", emoji: "🐕", title: "Für Hunde" },
  { animal: "KATZE", emoji: "🐈", title: "Für Katzen" },
] as const;

/** Einstieg der Startseite: Aussage, Suche, Wege nach Tierart. Funktioniert unabhängig vom Produkt des Monats. */
export function HomeHero({ leaders }: { leaders: Leaders }) {
  const total = leaders.reduce((n, l) => n + l.count, 0);
  return (
    <section aria-labelledby="home-h1" className="rounded-3xl bg-brand-soft px-5 py-8 md:px-10 md:py-12">
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-brand-strong">
        {TRUST.map(({ Icon, text }) => (
          <li key={text} className="flex items-center gap-1.5"><Icon className="size-4" aria-hidden />{text}</li>
        ))}
      </ul>
      <h1 id="home-h1" className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.1] text-balance md:text-5xl">Hunde- und Katzenfutter im unabhängigen Fachtest</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        {total > 0 ? `${total} Futtersorten` : "Futtersorten"} geprüft nach einer offenen{" "}
        <Link href="/methodik" className="font-semibold text-brand underline">100-Punkte-Methodik</Link>: Rohstoffe, Schadstoffe, Nährstoffprofil, Deklaration und Preis-Leistung.
      </p>

      <div className="mt-6 max-w-2xl"><HeroSearch /></div>

      <nav aria-label="Testkategorien" className="mt-6 grid gap-3 sm:grid-cols-2">
        {GROUPS.map((g) => {
          const cats = leaders.filter((l) => l.animal === g.animal);
          return (
            <div key={g.animal} className="rounded-2xl border border-border bg-surface p-4 shadow-card">
              <p className="flex items-center gap-2 text-lg font-extrabold"><span aria-hidden className="text-2xl">{g.emoji}</span>{g.title}</p>
              <ul className="mt-3 grid gap-2">
                {cats.map((c) => (
                  <li key={c.id}>
                    <Link href={`/${c.slug}`} className="group flex min-h-12 items-center justify-between gap-2 rounded-xl bg-bg-soft px-3 sm:gap-3 sm:px-4 font-semibold transition duration-300 hover:-translate-y-0.5 hover:bg-brand-soft hover:text-brand-strong active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                      <span className="min-w-0 leading-tight">{hyphenateCategory(c.foodType === "ALLEIN" ? "Alleinfuttermittel" : "Ergänzungsfuttermittel")}</span>
                      <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-normal text-muted tabular-nums">
                        {c.count} {c.count === 1 ? "Test" : "Tests"}
                        <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-0.5" aria-hidden />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
    </section>
  );
}
