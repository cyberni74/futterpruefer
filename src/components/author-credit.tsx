import Link from "next/link";
import { authorPath, resolveAuthor } from "@/lib/authors";

/** Sichtbare Autorenzeile. Die Redaktion verlinkt /team, Matthias Schröter seinen Team-Anker. */
export function AuthorCredit({ slug, className = "font-semibold text-fg hover:underline" }: { slug?: string | null; className?: string }) {
  const author = resolveAuthor(slug);
  return (
    <Link href={authorPath(author)} className={className}>
      {author.name}
    </Link>
  );
}
