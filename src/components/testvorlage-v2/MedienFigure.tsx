import type { ReactNode } from "react";

/**
 * Produktbild mit Unterschrift. Mit `kaufUrl` (aus der ASIN) ist das Bild ein Amazon-Partnerlink
 * und trägt darüber das Label „Werbung“, wie bei den Galeriebildern im Beitrag.
 */
export function MedienFigure({ kaufUrl, caption, label, children }: { kaufUrl?: string | null; caption?: string | null; label: string; children: ReactNode }) {
  return (
    <figure>
      {kaufUrl ? <span className="adlabel">Werbung</span> : null}
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-bg-soft">
        {kaufUrl ? (
          <a href={kaufUrl} target="_blank" rel="sponsored nofollow noopener" aria-label={`${label} bei Amazon ansehen (Werbung)`} className="absolute inset-0 block">{children}</a>
        ) : children}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

export const BILDQUELLE_HERSTELLER = "Bild: Hersteller";

/**
 * Unterschrift eines Produktbilds. Ein eigener Text (bildunterschriftHaupt/-Inhalt) gilt unverändert.
 * Sonst steht der Standardtext, ergänzt um „Bild: Hersteller“ (nicht bei Symbol- oder KI-Bildern: `herstellerBild` false).
 */
export function medienCaption(eigen: string | null | undefined, standard: string | null | undefined, herstellerBild = true): string | null {
  const text = eigen?.trim();
  if (text) return text;
  const basis = standard?.trim();
  if (!herstellerBild) return basis || null;
  return basis ? `${basis} · ${BILDQUELLE_HERSTELLER}` : BILDQUELLE_HERSTELLER;
}

/** Symbol- und KI-Bilder stammen nicht vom Hersteller. */
export const istHerstellerBild = (alt: string | null | undefined) => !/symbolbild|ki-generiert/i.test(alt ?? "");
