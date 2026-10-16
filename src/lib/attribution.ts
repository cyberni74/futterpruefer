import { authorPath, resolveAuthor } from "./authors";
import { absoluteUrl } from "./site";

/**
 * Autor als schema.org Person.
 * Entspricht den Autoren-Empfehlungen für Article/Review:
 * @type Person, name nur der Name, url zur sichtbaren Stelle, jobTitle getrennt.
 * sameAs nur, wenn ein Profil bereits auf der Seite steht – das ist nicht der Fall.
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
