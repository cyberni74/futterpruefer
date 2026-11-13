import { authorPath, resolveAuthor } from "./authors";
import { absoluteUrl } from "./site";

/**
 * Autor für Article- und Review-JSON-LD.
 * Die Redaktion ist eine Organization ohne jobTitle.
 * Matthias Schröter bleibt eine Person mit jobTitle und Team-Anker.
 * sameAs und reviewedBy werden nicht gesetzt.
 */
export function contentAuthor(storedSlug?: string | null) {
  const author = resolveAuthor(storedSlug);
  const url = absoluteUrl(authorPath(author));
  if (author.kind === "organization") {
    return {
      "@type": "Organization" as const,
      name: author.name,
      url,
    };
  }
  return {
    "@type": "Person" as const,
    "@id": url,
    name: author.name,
    url,
    jobTitle: author.jobTitle,
  };
}
