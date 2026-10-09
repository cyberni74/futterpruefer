import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Abschluss unter Vorschau-Boxen: kurzer Aufruf plus Button zur vollständigen Liste. */
export function AllLink({ href, title, text, children }: { href: string; title: string; text: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 flex flex-col items-center gap-3 rounded-3xl border border-border bg-bg-soft px-5 py-7 text-center">
      <p className="text-xl font-extrabold md:text-2xl">{title}</p>
      <p className="max-w-xl text-muted">{text}</p>
      <Link
        href={href}
        className="mt-1 inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 font-bold text-white transition hover:bg-accent-strong dark:text-black"
      >
        {children}
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}
