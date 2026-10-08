import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({ id, title, kicker, href, linkLabel }: { id: string; title: string; kicker?: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {kicker && <p className="text-sm font-bold uppercase tracking-wide text-brand">{kicker}</p>}
        <h2 id={id} className="mt-1 text-2xl font-extrabold md:text-3xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-bold text-brand hover:underline">
          {linkLabel ?? "Alle anzeigen"} <ArrowRight className="size-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
