import type { LayoutData } from "./schema";

const STUFEN = { OK: { klasse: "", label: "Unbedenklich nach unserer Prüfung" }, HINWEIS: { klasse: "amber", label: "Hinweis" }, KRITISCH: { klasse: "red", label: "Kritisch" } } as const;

/** Sicherheitsbewertung als Hervorhebung. Die Stufe steht als Text, nicht nur als Farbe. */
export function SafetyAssessment({ sicherheit }: { sicherheit?: LayoutData["sicherheit"] }) {
  if (!sicherheit?.text.trim()) return null;
  const s = STUFEN[sicherheit.stufe];
  return (
    <div className={`callout ${s.klasse}`} role="note">
      <strong>{sicherheit.titel || s.label}</strong>
      <p>{sicherheit.text}</p>
    </div>
  );
}
