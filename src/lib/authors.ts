/**
 * Personen, die auf der Website bereits namentlich stehen.
 * Quelle: Impressum – „Vertretungsberechtigt“ und die Überschrift
 * „Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV“.
 * Keine weiteren Namen, Titel, Profile oder sameAs-Links ergänzen.
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
