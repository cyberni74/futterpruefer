const ENTITIES: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&apos;": "'", "&nbsp;": " " };

function text(html: string): string {
  return html
    .replace(/<br\s*\/?>|<\/(?:p|li|div|h[1-6]|ul|ol)>/gi, " ") // Blockgrenzen trennen Wörter
    .replace(/<[^>]+>/g, "") // Inline-Tags (a, strong, em …) fügen kein Leerzeichen ein, sonst wird aus „machen.“ ein „machen .“
    .replace(/&(?:amp|lt|gt|quot|apos|nbsp|#39);/g, (e) => ENTITIES[e] ?? e)
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fragen und Antworten aus dem sichtbaren Abschnitt „Häufige Fragen“ eines Beitrags.
 * Frage = H3, Antwort = das direkt folgende p, ul oder ol. Der Abschnitt endet an der nächsten H2,
 * Absätze dazwischen (z. B. ein Fazit) gehören nicht zur Antwort. So steht im JSON-LD nur Text, den die Seite zeigt.
 */
export function extractFaq(html: string | null | undefined): { question: string; answer: string }[] {
  if (!html) return [];
  const heading = [...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].find((m) => /^häufige fragen/i.test(text(m[1])));
  if (!heading || heading.index === undefined) return [];
  const rest = html.slice(heading.index + heading[0].length);
  const next = rest.search(/<h2\b/i);
  const section = next === -1 ? rest : rest.slice(0, next);
  return [...section.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>\s*<(p|ul|ol)\b[^>]*>([\s\S]*?)<\/\2>/gi)]
    .map((m) => ({ question: text(m[1]), answer: text(m[3]) }))
    .filter((item) => item.question && item.answer);
}
