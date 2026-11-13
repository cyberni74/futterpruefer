import { Fragment } from "react";
import Link from "next/link";
import { authorPath, resolveAuthor, splitAuthorByline } from "@/lib/authors";

/** Sichtbare Autorenzeile. Die Redaktion verlinkt /team, Matthias Schröter seinen Team-Anker. */
export function AuthorCredit({ slug, className = "font-semibold text-fg hover:underline" }: { slug?: string | null; className?: string }) {
  const author = resolveAuthor(slug);
  return (
    <Link href={authorPath(author)} className={className}>
      {author.name}
    </Link>
  );
}

/** Prüfstand und ähnliche Klartextfelder: nur die Autorenzeile wird zum Link auf /team. */
export function BylineText({ text }: { text: string }) {
  return splitAuthorByline(text).map((part, index) =>
    part.kind === "text" ? <Fragment key={index}>{part.text}</Fragment> : (
      <Fragment key={index}>Von <Link href="/team">Redaktion Futterprüfer</Link></Fragment>
    ),
  );
}
