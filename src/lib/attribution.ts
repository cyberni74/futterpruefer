import { authorPath, resolveAuthor } from "./authors";
import { absoluteUrl } from "./site";

/**
 * Autor als schema.org Person.
 * Entspricht den Autoren-Empfehlungen für Article/Review:
 * @type Person, name nur der Name, url zur sichtbaren Stelle, jobTitle getrennt.
 * sameAs wird nicht gesetzt.
 */
export function contentAuthor(storedSlug?: string | null) {
  const author = resolveAuthor(storedSlug);
  const url = absoluteUrl(authorPath(author));
  return {
    "@type": "Person" as const,
    "@id": url,
    name: author.name,
    url,
    jobTitle: author.jobTitle,
  };
}
