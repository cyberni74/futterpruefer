import Link from "next/link";
import { SITE } from "@/lib/site";

/** Sichtbare Autorenzeile: immer die Organisation, nie eine Person. */
export function AuthorCredit({ className = "font-semibold text-fg hover:underline" }: { className?: string }) {
  return (
    <Link href="/team" className={className}>
      {SITE.name}
    </Link>
  );
}
