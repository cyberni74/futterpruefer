import Link from "next/link";
import { Logo } from "./logo";

const COLS = [
  { title: "Tests", links: [["Alleinfutter Hund", "/kategorie/alleinfutter-hund"], ["Alleinfutter Katze", "/kategorie/alleinfutter-katze"], ["Ergänzung Hund", "/kategorie/ergaenzungsfutter-hund"], ["Ergänzung Katze", "/kategorie/ergaenzungsfutter-katze"], ["Produkt des Monats", "/produkt-des-monats"]] },
  { title: "Wissen", links: [["Fachblog", "/blog"], ["Methodik", "/methodik"], ["FAQ", "/faq"], ["RSS-Feed", "/rss.xml"]] },
  { title: "Kontakt", links: [["Über mich", "/ueber-mich"], ["Für Hersteller", "/fuer-hersteller"], ["Kontakt", "/kontakt"], ["Impressum", "/impressum"], ["Datenschutz", "/datenschutz"]] },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-bg-soft pb-24 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted">Unabhängige Fachbewertungen für Hunde- und Katzenfutter. Eine Einreichung kauft keine Note.</p>
        </div>
        {COLS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-sm font-bold uppercase tracking-wide">{col.title}</h2>
            <ul className="mt-3 space-y-1">
              {col.links.map(([label, href]) => (
                <li key={href}><Link href={href} className="inline-flex min-h-9 items-center text-sm text-muted hover:text-fg hover:underline">{label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <p className="border-t border-border px-4 py-5 text-center text-xs text-muted">© {new Date().getFullYear()} Futterprüfer.de · Alle Bewertungen nach offengelegter Methodik</p>
    </footer>
  );
}
