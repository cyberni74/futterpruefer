import Link from "next/link";
import { ArrowRight, BadgeCheck, FlaskConical, Scale } from "lucide-react";
import { HeroSearch } from "@/components/hero-search";
import { FpImage } from "@/components/fp-image";
import { hyphenateCategory } from "@/lib/urls";
import type { getCategoryLeaders } from "@/lib/queries";

type Leaders = Awaited<ReturnType<typeof getCategoryLeaders>>;

const TRUST = [
  { Icon: BadgeCheck, text: "Unabhängig bewertet" },
  { Icon: FlaskConical, text: "Offene 100-Punkte-Methodik" },
  { Icon: Scale, text: "Faktencheck der Werbeaussagen" },
] as const;

const HERO_IMAGE = "/brand/drei-hunde-auf-blumenwiese-hundefutter-test.webp";
const HERO_BLUR = "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAAAQAgCdASoQAA8AA4BaJbACdAEDlcHWJyaAAP3b5BSpCK47dp0ys5as/s+tMydGvfARPOvIPbZiZGATVYYwwp5La/P/qLTIZTSCFshRT0M2s4duEL+Le1cvjzxkTzGda3AAAA==";
const HERO_ALT = "Drei Hunde sitzen auf einer Blumenwiese – unabhängige Futtertests für Hunde und Katzen";

const GROUPS = [
  { animal: "HUND", emoji: "🐕", title: "Für Hunde" },
  { animal: "KATZE", emoji: "🐈", title: "Für Katzen" },
] as const;

/** Einstieg der Startseite: Aussage, Suche, Wege nach Tierart. Funktioniert unabhängig vom Produkt des Monats. */
export function HomeHero({ leaders }: { leaders: Leaders }) {
  const total = leaders.reduce((n, l) => n + l.count, 0);
  return (
    <section aria-labelledby="home-h1" className="overflow-hidden rounded-3xl bg-brand-soft">
      <div className="relative">
        {/* Handy: Bild als Banner oben; ab Tablet: Hintergrundbild rechts mit Verlauf zum Text */}
        <div className="relative aspect-[16/10] md:absolute md:inset-y-0 md:right-0 md:aspect-auto md:w-[60%]">
          <FpImage src={HERO_IMAGE} alt={HERO_ALT} blur={HERO_BLUR} sizes="(min-width:1152px) 670px, (min-width:768px) 58vw, calc(100vw - 32px)" quality={50} priority className="object-[50%_62%]" />
          <div aria-hidden className="absolute inset-y-0 left-0 hidden w-1/4 bg-gradient-to-r from-brand-soft to-transparent md:block" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-soft to-transparent md:hidden" />
        </div>
        <div className="relative px-5 pb-2 pt-4 md:max-w-[47%] md:px-10 md:pb-4 md:pt-12">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-brand-strong">
            {TRUST.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-1.5"><Icon className="size-4" aria-hidden />{text}</li>
            ))}
          </ul>
          <h1 id="home-h1" className="mt-4 text-4xl font-extrabold leading-[1.1] text-balance md:text-4xl lg:text-[2.6rem]">Hunde- und Katzenfutter im unabhängigen Fachtest</h1>
          <p className="mt-4 text-lg text-muted">
            {total > 0 ? `${total} Futtersorten` : "Futtersorten"} geprüft nach einer offenen{" "}
            <Link href="/methodik" className="font-semibold text-brand underline">100-Punkte-Methodik</Link>: Rohstoffe, Schadstoffe, Nährstoffprofil, Deklaration und Preis-Leistung.
          </p>
          <div className="mt-6 max-w-xl"><HeroSearch /></div>
        </div>
      </div>

      <nav aria-label="Testkategorien" className="grid gap-3 px-5 pb-8 pt-6 sm:grid-cols-2 md:px-10 md:pb-10">
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
