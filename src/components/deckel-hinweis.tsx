/** Zeile unmittelbar unter den Kriterien, gleiches Muster wie bei PlaqueOff. */
export function DeckelHinweis({ text }: { text: string }) {
  if (!text) return null;
  return <p className="mt-4 text-sm text-muted">{text}</p>;
}
