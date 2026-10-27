import Link from "next/link";
import { ReviewCard } from "@/components/review-card";
import type { TestCta } from "@/lib/futterrechner/test-queries";

/** Server-Komponente: Karten verlinken auf unsere Testseiten, kein Affiliate im Rechner (Konzept 5.2). */
export function TestCtas({ tests, art, futterart }: { tests: TestCta[]; art: "hund" | "katze"; futterart: "trocken" | "nass" }) {
  const wort = `${art === "hund" ? "Hundefutter" : "Katzenfutter"}${futterart === "nass" ? " (nass)" : " (trocken)"}`;
  return (
    <div className="mt-5 border-t border-border pt-4">
      <h3 className="font-display text-base font-extrabold">Passende getestete Futter</h3>
      {tests.length > 0 ? (
        <>
          <p className="mt-1 text-sm text-muted">Unsere Tests mit Grün oder Gelb, {wort}. Die Note des Rechners ersetzt kein Testergebnis.</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {tests.map((t) => (
              <li key={t.id}><ReviewCard review={t} variant="tile" eager imageSizes="(min-width:1024px) 360px, (min-width:640px) 30vw, 85vw" /></li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-1 text-sm text-muted">Was Analysewerte nicht zeigen, prüfen unsere Tests.</p>
      )}
      <Link href="/tests" className="mt-3 inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-bold text-white hover:bg-accent-strong dark:text-black">Alle Tests ansehen</Link>
    </div>
  );
}
