import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "./json-ld";
import { absoluteUrl } from "@/lib/site";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Start", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Brotkrümelnavigation" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          {all.map((c, i) => (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="size-4 opacity-60" aria-hidden />}
              {c.href && i < all.length - 1 ? (
                <Link href={c.href} className="inline-flex min-h-8 items-center hover:text-fg hover:underline">{c.label}</Link>
              ) : (
                <span aria-current="page" className="line-clamp-1 font-medium text-fg">{c.label}</span>
              )}
            </li>
          ))}
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
