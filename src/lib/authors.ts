/**
 * Öffentliche Autorenangabe.
 * Standard ist die Redaktion als Organization, verlinkt auf /team ohne Anker.
 * Gespeicherte Slugs wie „sebastian-kraft“ werden darauf abgebildet.
 * Sebastian Kraft bleibt nur im Impressum, nicht als Autor.
 * Matthias Schröter bleibt Person mit Team-Anker. Kein reviewedBy, keine sameAs-Links.
 */
export type EditorialAuthor = {
  slug: "redaktion-futterpruefer";
  name: "Redaktion Futterprüfer";
  kind: "organization";
};

export type PersonAuthor = {
  slug: "matthias-schroeter";
  name: "Matthias Schröter";
  kind: "person";
  jobTitle: "Chefredakteur";
  hash: "matthias-schroeter";
};

export type PublicAuthor = EditorialAuthor | PersonAuthor;

export const EDITORIAL_AUTHOR: EditorialAuthor = {
  slug: "redaktion-futterpruefer",
  name: "Redaktion Futterprüfer",
  kind: "organization",
};

export const SCHROETER: PersonAuthor = {
  slug: "matthias-schroeter",
  name: "Matthias Schröter",
  kind: "person",
  jobTitle: "Chefredakteur",
  hash: "matthias-schroeter",
};

export const AUTHORS = [EDITORIAL_AUTHOR, SCHROETER] as const;

/** Standard, wenn ein Test oder Artikel keinen Autor gesetzt hat. */
export const DEFAULT_AUTHOR: EditorialAuthor = EDITORIAL_AUTHOR;

/** Slug aus älteren Datensätzen. Wird wie ein leeres Feld auf die Redaktion abgebildet. */
export const LEGACY_EDITORIAL_SLUG = "sebastian-kraft";

export type AuthorSlug = (typeof AUTHORS)[number]["slug"] | typeof LEGACY_EDITORIAL_SLUG;

export function authorPath(author: PublicAuthor = DEFAULT_AUTHOR): string {
  return author.kind === "person" ? `/team#${author.hash}` : "/team";
}

/** Unbekannte Freitextwerte und der alte Kraft-Slug fallen auf die Redaktion zurück. */
export function resolveAuthor(storedSlug?: string | null): PublicAuthor {
  if (storedSlug === SCHROETER.slug) return SCHROETER;
  return DEFAULT_AUTHOR;
}

export function isAuthorSlug(value: string): value is AuthorSlug {
  return value === LEGACY_EDITORIAL_SLUG || AUTHORS.some((author) => author.slug === value);
}

const STORED_AUTHOR_BYLINE = 'Von <a href="/team">Redaktion Futterprüfer</a>';

/**
 * Gespeicherte Autorenzeilen im Artikel-HTML auf die Redaktion abbilden.
 * Der übrige Text bleibt, das Impressum geht nicht durch diese Funktion.
 */
export function mapStoredAuthorByline(html: string): string {
  return html
    .replaceAll("Autor: Sebastian Kraft, Futterprüfer.de (Karpas Web Solutions Ltd.)", STORED_AUTHOR_BYLINE)
    .replaceAll("Autor: Sebastian Kraft", STORED_AUTHOR_BYLINE);
}
