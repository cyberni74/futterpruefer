import { fazitFuer } from "@/lib/futterrechner/fazit-texte";

/** „Unser Fazit“: bleibt unsichtbar, solange FAZIT_FREIGEGEBEN false ist (Redaktion und Rechtsprüfung stehen aus). */
export function FazitBox({ art, score }: { art: "hund" | "katze"; score: number }) {
  const text = fazitFuer(art, score);
  if (!text) return null;
  return (
    <div className="prose-fp mt-5">
      <div className="fp-box fp-fazit fp-ergebnis-box">
        <p className="font-semibold">Unser Fazit</p>
        <p>{text}</p>
      </div>
    </div>
  );
}
