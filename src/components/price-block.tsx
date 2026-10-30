import { AFFILIATE_HINWEIS } from "@/components/testvorlage-v2/Sources";
import { AFFILIATE_HINWEIS_OBEN, AMAZON_TOP_CTA, AMAZON_TOP_CTA_ROT } from "@/lib/amazon-asin";
import { ROT_KEINE_KAUFEMPFEHLUNG } from "@/components/testvorlage-v2/Sources";
import { priceCite, priceNotice, priceStandDate } from "@/lib/review-seo";

const eur = (n: number) => n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
const num = (v: unknown) => (v == null || v === "" ? null : Number.isFinite(Number(v)) ? Number(v) : null);

export const AMAZON_PRICE_CTA = "Aktuellen Preis bei Amazon ansehen*";

/** Gleicher Amazon-Button wie in den Testtexten: Partner-Tag, rel=sponsored, Affiliate-Hinweis. */
export function AmazonPriceCta({ url }: { url: string }) {
  return (
    <div className="prose-fp">
      <div className="cta-amazon">
        <p>
          <a className="cta-amazon-btn" href={url} target="_blank" rel="sponsored nofollow noopener">{AMAZON_PRICE_CTA}</a>
        </p>
        <p className="cta-hinweis">{AFFILIATE_HINWEIS}</p>
      </div>
    </div>
  );
}

/** Oberer Amazon-Button direkt unter der Bewertungsbox. Unter 60 Punkten neutraler Text mit Rot-Satz, sonst Standardtext. */
export function AmazonTopCta({ url, rot }: { url: string; rot: boolean }) {
  return (
    <div className="prose-fp" data-amazon-top>
      <div className="cta-amazon">
        <p>
          <a className="cta-amazon-btn" href={url} target="_blank" rel="sponsored nofollow noopener">{rot ? AMAZON_TOP_CTA_ROT : AMAZON_TOP_CTA}</a>
        </p>
        {rot ? <p className="cta-hinweis">{ROT_KEINE_KAUFEMPFEHLUNG}</p> : null}
        <p className="cta-hinweis">{AFFILIATE_HINWEIS_OBEN}</p>
      </div>
    </div>
  );
}

/** Datierte Preise mit Quelle. Ohne Datum kein Betrag, nur der Amazon-Button, wenn ein Link vorliegt. */
export function PriceBlock({ price, packageSize, pricePerKg, pricePerDay, priceDate, priceSource, amazonUrl }: { price: unknown; packageSize?: string | null; pricePerKg: unknown; pricePerDay: unknown; priceDate: Date | null | undefined; priceSource?: string | null; amazonUrl?: string | null }) {
  const stand = priceStandDate(priceDate);
  if (!stand) return amazonUrl ? <AmazonPriceCta url={amazonUrl} /> : null;
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
