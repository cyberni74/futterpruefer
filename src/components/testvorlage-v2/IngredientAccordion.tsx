import type { LayoutData } from "./schema";

/** Zutaten als natives Akkordeon (details/summary, funktioniert ohne JavaScript und per Tastatur). */
export function IngredientAccordion({ zutaten }: { zutaten?: LayoutData["zutaten"] }) {
  if (!zutaten?.length) return null;
  return (
    <div>
      {zutaten.map((z) => (
        <details key={z.name} className="ingredient">
          <summary><span>{z.name}</span>{z.menge && <small>{z.menge}</small>}</summary>
          {(z.funktion || z.bewertung) && (
            <div className="ing-body">
              {z.funktion && <p><strong>Funktion:</strong> {z.funktion}</p>}
              {z.bewertung && <p><strong>Bewertung:</strong> {z.bewertung}</p>}
            </div>
          )}
        </details>
      ))}
    </div>
  );
}
