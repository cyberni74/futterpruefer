import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Button unter Vorschau-Boxen, der zur vollständigen Liste führt. */
export function AllLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 flex justify-center">
      <Link
        href={href}
        className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 font-bold text-white transition hover:bg-accent-strong dark:text-black"
      >
        {children}
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}
