export type AnimalKind = "HUND" | "KATZE";

/** Erkennt Hund und Katze im Text (Titel, Tags, Auszug). „Hundefutter“ zählt als Hund, „Katzenfutter“ als Katze. */
export function mentionedAnimals(text: string): AnimalKind[] {
  const value = text.toLocaleLowerCase("de");
  const found: AnimalKind[] = [];
  if (/(^|[^a-zäöü])(hund|welpe|hünd)/.test(value)) found.push("HUND");
  if (/(^|[^a-zäöü])(katze|kater|mieze)/.test(value)) found.push("KATZE");
  return found;
}

/** Ein Beitrag passt zur Tierart, wenn er sie nennt, beide nennt oder keine nennt. Nur die andere Tierart fällt weg. */
export function fitsAnimal(text: string, animal: AnimalKind): boolean {
  const mentioned = mentionedAnimals(text);
  return mentioned.length !== 1 || mentioned[0] === animal;
}

/**
 * Tierart eines Fachartikels für die Test-Box.
 * Titel und Auszug gehen vor: nennt nur einer von beiden genau eine Art,
 * gilt diese, auch wenn ein Tag die andere Art erwähnt.
 * Nennen Titel und Auszug keine Art, entscheidet ein eindeutiger Tag.
 */
export function subjectAnimal(title: string, excerpt?: string | null, keywords: string[] = []): AnimalKind | null {
  const head = mentionedAnimals(`${title} ${excerpt ?? ""}`);
  if (head.length === 1) return head[0];
  if (head.length > 1) return null;
  const fromTags = mentionedAnimals(keywords.join(" "));
  return fromTags.length === 1 ? fromTags[0] : null;
}
