import { SITE } from "./site";

/**
 * Öffentliche Urheberschaft für Tests, Blog und Lexikon.
 * Ein in der Datenbank oder im Freitext gespeicherter Personenname wird nicht ausgegeben.
 */
export function contentAuthor(storedName?: string | null) {
  // Gespeicherte Personennamen werden nicht ausgegeben.
  void storedName;
  return {
    "@type": "Organization" as const,
    name: SITE.name,
    url: SITE.url,
  };
}
