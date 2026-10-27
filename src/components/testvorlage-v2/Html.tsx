import { sanitize } from "@/lib/sanitize";

/** HTML aus der Datenbank läuft immer durch sanitize() (idempotent), kein Skript, kein style. */
export function Html({ html, className }: { html: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitize(html) }} />;
}
