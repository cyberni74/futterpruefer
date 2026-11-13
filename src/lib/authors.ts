/**
 * Personen, die auf der Website namentlich stehen.
 * Sebastian Kraft: Impressum, verantwortlich nach § 18 Abs. 2 MStV. Standard, wenn kein Autor gesetzt ist.
 * Matthias Schröter: Chefredakteur, sichtbar auf /team. Nur Tests mit diesem Slug nennen ihn.
 * Keine sameAs-Links.
 */
export type PublicAuthor = {
  slug: string;
  name: string;
  jobTitle: string;
  /** Anker auf der Team-Seite, an dem der Name sichtbar steht. */
  hash: string;
};

export const AUTHORS = [
  {
    slug: "sebastian-kraft",
    name: "Sebastian Kraft",
    jobTitle: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
    hash: "sebastian-kraft",
  },
  {
    slug: "matthias-schroeter",
    name: "Matthias Schröter",
    jobTitle: "Chefredakteur",
    hash: "matthias-schroeter",
  },
] as const satisfies readonly PublicAuthor[];

export type AuthorSlug = (typeof AUTHORS)[number]["slug"];

/** Standard, wenn ein Test oder Artikel keinen Autor gesetzt hat. */
export const DEFAULT_AUTHOR: PublicAuthor = AUTHORS[0];

export function authorPath(author: PublicAuthor = DEFAULT_AUTHOR): string {
  return `/team#${author.hash}`;
}

/** Nur Personen aus AUTHORS. Unbekannte Freitextwerte fallen auf den Standard zurück. */
export function resolveAuthor(storedSlug?: string | null): PublicAuthor {
  return AUTHORS.find((a) => a.slug === storedSlug) ?? DEFAULT_AUTHOR;
}

export function isAuthorSlug(value: string): value is AuthorSlug {
  return AUTHORS.some((a) => a.slug === value);
}
