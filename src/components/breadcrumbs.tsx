import Link from "next/link";
import { ArrowLeft, ChevronRight, House } from "lucide-react";
import { JsonLd } from "./json-ld";
import { absoluteUrl } from "@/lib/site";

export type Crumb = { label: string; href?: string };

const pill = "inline-flex min-h-10 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold text-muted transition-colors hover:bg-brand-soft hover:text-brand-strong";

/** Handy: große Zurück-Pille zur übergeordneten Seite. Desktop: Pfad aus Pillen mit hervorgehobener aktueller Seite. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Start", href: "/" }, ...items];
  const parent = [...all].slice(0, -1).reverse().find((c) => c.href) ?? all[0];
  return (
    <>
      <nav aria-label="Brotkrümelnavigation">
        <Link
          href={parent.href ?? "/"}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-bold text-brand shadow-card transition hover:bg-brand-soft hover:text-brand-strong md:hidden"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Zurück zu {parent.label}
        </Link>
        <ol className="hidden flex-wrap items-center gap-1 md:flex">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={`${c.label}-${i}`} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="size-4 text-muted/60" aria-hidden />}
                {c.href && !last ? (
                  <Link href={c.href} className={pill} aria-label={i === 0 ? "Startseite" : undefined}>
                    {i === 0 ? <House className="size-4" aria-hidden /> : null}
                    {i === 0 ? "Start" : c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="inline-flex min-h-10 items-center rounded-full bg-brand-soft px-3.5 text-sm font-bold text-brand-strong">
                    <span className="line-clamp-1">{c.label}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: absoluteUrl(c.href) } : {}) })),
        }}
      />
    </>
  );
}
