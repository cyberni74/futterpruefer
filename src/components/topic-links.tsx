import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { getCategoryLeaders } from "@/lib/queries";

type Leaders = Awaited<ReturnType<typeof getCategoryLeaders>>;

/** Interne Verlinkung am Ende eines Fachartikels: passende Test-Kategorien (nur mit Tests), Methodik, Lexikon, FAQ. */
export function TopicLinks({ leaders, text }: { leaders: Leaders; text: string }) {
  const t = text.toLocaleLowerCase("de");
  const dog = /hund|welpe/.test(t), cat = /katze/.test(t);
  const animals = new Set([...(dog || !cat ? ["HUND"] : []), ...(cat || !dog ? ["KATZE"] : [])]);
  const tests = leaders.filter((l) => l.count > 0 && animals.has(l.animal));
  const links: Array<[string, string, string]> = [
    ...tests.map((l): [string, string, string] => [`/${l.slug}`, `${l.name} im Test`, `${l.count} ${l.count === 1 ? "Test" : "Tests"} mit Punkten und Faktencheck`]),
    ["/methodik", "So bewerten wir", "Kriterien, Quellen und Gewichtung offen erklärt"],
    ["/lexikon", "Futter-Lexikon", "Inhaltsstoffe und Zusätze mit Ampel-Bewertung"],
    ["/faq", "Häufige Fragen", "Antworten rund um Futter und Bewertung"],
    ["/blog", "Alle Fachartikel", "Ratgeber und Hintergründe aus der Redaktion"],
  ];
  return (
    <section aria-labelledby="mehr-zum-thema" className="mt-16">
      <h2 id="mehr-zum-thema" className="mb-5 text-2xl font-extrabold">Mehr zum Thema</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {links.map(([href, label, hint]) => (
          <li key={href}>
            <Link href={href} className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lift motion-reduce:hover:translate-y-0">
              <span className="min-w-0">
                <span className="block font-bold group-hover:text-brand-strong">{label}</span>
                <span className="block text-sm text-muted">{hint}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-brand" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
