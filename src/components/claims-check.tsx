import { CheckCircle2, AlertTriangle, XCircle, Scale } from "lucide-react";
import { CLAIM_LABEL, type Claim, type ClaimRating } from "@/lib/product-data";

const TONE: Record<ClaimRating, { cls: string; Icon: typeof CheckCircle2 }> = {
  ZULAESSIG: { cls: "bg-good-soft text-good", Icon: CheckCircle2 },
  FRAGWUERDIG: { cls: "bg-mid-soft text-mid", Icon: AlertTriangle },
  UNZULAESSIG: { cls: "bg-bad-soft text-bad", Icon: XCircle },
};

function Badge({ rating }: { rating: ClaimRating }) {
  const t = TONE[rating];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${t.cls}`}>
      <t.Icon className="size-3.5" aria-hidden />
      {CLAIM_LABEL[rating]}
    </span>
  );
}

/** Werbeaussagen-Check: Aussage → Bewertung → Begründung. Mobil Karten, Desktop Tabelle. */
export function ClaimsCheck({ claims, brand }: { claims: Claim[]; brand: string }) {
  if (!claims?.length) return null;
  return (
    <section id="werbeaussagen" aria-labelledby="werbeaussagen-h" className="scroll-mt-28">
      <h2 id="werbeaussagen-h" className="text-2xl font-extrabold">Werbeversprechen im Faktencheck</h2>
      <p className="mt-2 text-muted">Wir haben die Werbeaussagen von {brand} auf der Verpackung und im Shop geprüft. Die Bewertungen sind unsere begründete fachliche Einschätzung.</p>

      <ul className="mt-5 space-y-3 md:hidden">
        {claims.map((c, i) => (
          <li key={`${c.claim}-${i}`} className="rounded-2xl border border-border bg-surface p-4 shadow-card">
            <p className="font-bold">„{c.claim}“</p>
            <div className="mt-2"><Badge rating={c.rating} /></div>
            {c.reason && <p className="mt-2 text-sm"><span className="font-semibold">Unsere Einschätzung:</span> {c.reason}</p>}
            {c.legal && <p className="mt-2 flex items-start gap-1.5 text-xs text-muted"><Scale className="mt-0.5 size-3.5 shrink-0" aria-hidden />{c.legal}</p>}
            {c.imageUrl && <a href={c.imageUrl} className="mt-2 inline-block text-sm font-semibold text-brand underline">Verpackungsfoto ansehen</a>}
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
                <th scope="row" className="p-3 font-bold">„{c.claim}“{c.imageUrl && <a href={c.imageUrl} className="mt-1 block text-xs font-semibold text-brand underline">Verpackungsfoto</a>}</th>
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
