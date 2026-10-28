import { CheckCircle2, AlertTriangle, XCircle, Scale, CircleDashed, CircleDot } from "lucide-react";
import { CLAIM_BADGE_CLASS, CLAIM_LABEL, claimStageSummary, type Claim, type ClaimRating } from "@/lib/product-data";
import { frameQuote } from "@/lib/quotes";
import { FpImage } from "./fp-image";

function ClaimPhoto({ src, claim }: { src: string; claim: string }) {
  return (
    <a href={src} target="_blank" rel="noopener" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-brand underline-offset-2 hover:underline">
      <span className="relative block size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-bg-soft">
        <FpImage src={src} alt={`Verpackungsfoto mit der Aussage ${frameQuote(claim)}`} sizes="64px" />
      </span>
      Foto vergrößern<span className="sr-only"> (öffnet in neuem Tab)</span>
    </a>
  );
}

const ICON: Record<ClaimRating, typeof CheckCircle2> = {
  ZULAESSIG: CheckCircle2,
  PLAUSIBEL: CircleDot,
  UNBELEGT: CircleDashed,
  FRAGWUERDIG: AlertTriangle,
  UNZULAESSIG: XCircle,
};

function Badge({ rating }: { rating: ClaimRating }) {
  const Icon = ICON[rating];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${CLAIM_BADGE_CLASS[rating]}`}>
      <Icon className="size-3.5" aria-hidden />
      {CLAIM_LABEL[rating]}
    </span>
  );
}

/** Werbeaussagen-Check: Aussage → Bewertung → Begründung. Mobil Karten, Desktop Tabelle. */
export function ClaimsCheck({ claims, brand, sourceLabel }: { claims: Claim[]; brand: string; sourceLabel?: string }) {
  if (!claims?.length) return null;
  return (
    <section id="werbeaussagen" aria-labelledby="werbeaussagen-h" className="scroll-mt-28">
      <h2 id="werbeaussagen-h" className="text-2xl font-extrabold">Werbeversprechen im Faktencheck</h2>
      <p className="mt-2 text-muted">{sourceLabel ?? `Geprüft haben wir Aussagen zu ${brand} auf der Verpackung, beim Hersteller und im Amazon-Listing. Wer die Angaben im Amazon-Listing eingetragen hat, ist uns nicht bekannt.`} Die Bewertungen sind unsere begründete fachliche Einschätzung.</p>
      <p className="mt-2 text-sm text-muted">{claimStageSummary(claims)}</p>

      <ul className="mt-5 space-y-3 md:hidden">
        {claims.map((c, i) => (
          <li key={`${c.claim}-${i}`} className="rounded-2xl border border-border bg-surface p-4 shadow-card">
            <p className="font-bold">{frameQuote(c.claim)}</p>
            <div className="mt-2"><Badge rating={c.rating} /></div>
            {c.reason && <p className="mt-2 text-sm"><span className="font-semibold">Unsere Einschätzung:</span> {c.reason}</p>}
            {c.legal && <p className="mt-2 flex items-start gap-1.5 text-xs text-muted"><Scale className="mt-0.5 size-3.5 shrink-0" aria-hidden />{c.legal}</p>}
            {c.imageUrl && <ClaimPhoto src={c.imageUrl} claim={c.claim} />}
          </li>
        ))}
      </ul>

      <div className="mt-5 hidden overflow-hidden rounded-2xl border border-border md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Geprüfte Werbeaussagen mit Bewertung und Begründung</caption>
          <thead className="bg-bg-soft">
            <tr><th scope="col" className="p-3">Aussage</th><th scope="col" className="p-3">Bewertung</th><th scope="col" className="p-3">Begründung</th></tr>
          </thead>
          <tbody>
            {claims.map((c, i) => (
              <tr key={`${c.claim}-${i}`} className="border-t border-border align-top">
                <th scope="row" className="p-3 font-bold">{frameQuote(c.claim)}{c.imageUrl && <div className="font-normal"><ClaimPhoto src={c.imageUrl} claim={c.claim} /></div>}</th>
                <td className="p-3"><Badge rating={c.rating} /></td>
                <td className="p-3">
                  {c.reason && <p>Unsere Einschätzung: {c.reason}</p>}
                  {c.legal && <p className="mt-1 flex items-start gap-1.5 text-xs text-muted"><Scale className="mt-0.5 size-3.5 shrink-0" aria-hidden />{c.legal}</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
