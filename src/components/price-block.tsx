import { AFFILIATE_HINWEIS, AMAZON_CTA, AMAZON_CTA_ROT, ROT_KEINE_KAUFEMPFEHLUNG } from "@/components/testvorlage-v2/Sources";
import { priceCite, priceNotice, priceStandDate } from "@/lib/review-seo";

const eur = (n: number) => n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
const num = (v: unknown) => (v == null || v === "" ? null : Number.isFinite(Number(v)) ? Number(v) : null);

/** @deprecated Alias für Rot-CTA; neue Stellen bitte AMAZON_CTA / AMAZON_CTA_ROT nutzen. */
export const AMAZON_PRICE_CTA = AMAZON_CTA_ROT;

/**
 * Amazon-Button wie in den Testtexten: Partner-Tag, rel=sponsored, Affiliate-Hinweis.
 * Ampel Gelb/Grün → „Jetzt bei Amazon entdecken*“; Ampel Rot → „Aktuellen Preis bei Amazon ansehen*“
 * plus derselbe Rot-Satz wie bei `AmazonKauf` (keine Kaufempfehlung).
 */
export function AmazonPriceCta({ url, rot = false }: { url: string; rot?: boolean }) {
  return (
    <div className="prose-fp">
      <div className="cta-amazon">
        <p>
          <a className="cta-amazon-btn" href={url} target="_blank" rel="sponsored nofollow noopener">{rot ? AMAZON_CTA_ROT : AMAZON_CTA}</a>
        </p>
        {rot ? <p className="rot-hinweis">{ROT_KEINE_KAUFEMPFEHLUNG}</p> : null}
        <p className="cta-hinweis">{AFFILIATE_HINWEIS}</p>
      </div>
    </div>
  );
}

/** Datierte Preise mit Quelle. Ohne Datum kein Betrag, nur den Amazon-Button, wenn ein Link vorliegt. */
export function PriceBlock({ price, packageSize, pricePerKg, pricePerDay, priceDate, priceSource, amazonUrl, rot = false }: { price: unknown; packageSize?: string | null; pricePerKg: unknown; pricePerDay: unknown; priceDate: Date | null | undefined; priceSource?: string | null; amazonUrl?: string | null; rot?: boolean }) {
  const stand = priceStandDate(priceDate);
  if (!stand) return amazonUrl ? <AmazonPriceCta url={amazonUrl} rot={rot} /> : null;
  const p = num(price);
  const kg = num(pricePerKg);
  const day = num(pricePerDay);
  if (p == null && kg == null && day == null) return null;
  const cite = priceCite(priceSource, stand);
  return (
    <div>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {p != null && (
          <div className="rounded-2xl bg-bg-soft p-4"><dt className="text-xs font-bold uppercase tracking-wide text-muted">Packung{packageSize ? ` (${packageSize})` : ""}</dt><dd className="mt-1 text-xl font-extrabold tabular-nums">{eur(p)}</dd></div>
        )}
        {kg != null && (
          <div className="rounded-2xl bg-bg-soft p-4"><dt className="text-xs font-bold uppercase tracking-wide text-muted">Pro Kilogramm</dt><dd className="mt-1 text-xl font-extrabold tabular-nums">{eur(kg)}</dd></div>
        )}
        {day != null && (
          <div className="rounded-2xl bg-bg-soft p-4"><dt className="text-xs font-bold uppercase tracking-wide text-muted">Pro Tagesration</dt><dd className="mt-1 text-xl font-extrabold tabular-nums">{eur(day)}</dd></div>
        )}
      </dl>
      {cite && <p className="mt-2 text-xs text-muted">{cite}. {priceNotice(priceSource)}</p>}
    </div>
  );
}
