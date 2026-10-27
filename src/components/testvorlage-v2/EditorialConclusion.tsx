import { Html } from "./Html";
import type { LayoutData } from "./schema";

/** Redaktionelles Fazit (Rich-Text, bereinigt). Der Rahmen kommt aus TvSection (final). */
export function EditorialConclusion({ fazit }: { fazit?: LayoutData["fazit"] }) {
  if (!fazit?.html.trim()) return null;
  return <Html html={fazit.html} className="conclusion" />;
}
