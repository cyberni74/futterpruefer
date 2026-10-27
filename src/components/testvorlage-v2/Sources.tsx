import { isSponsoredHref } from "@/lib/sanitize";
import type { LayoutData } from "./schema";

export const AFFILIATE_HINWEIS =
  "*Affiliate-Link: Wir erhalten bei einem Kauf eine Provision, der Preis ändert sich für Sie nicht. Die Provision hat keinen Einfluss auf unsere Bewertung.";

export const AMAZON_CTA = "Jetzt bei Amazon entdecken*";

/** Bei Ampel Rot: neutraler Preis-Hinweis statt Entdecken-Formulierung. */
export const AMAZON_CTA_ROT = "Aktuellen Preis bei Amazon ansehen*";

/** Steht bei Ampel Rot direkt unter dem Kauf-Button. Wortlaut der Redaktion, ohne Produktname. */
export const ROT_KEINE_KAUFEMPFEHLUNG = "Unsere Bewertung für dieses Produkt ist Rot; der Link ist keine Kaufempfehlung.";

/** Kauf-Button mit Affiliate-Hinweis. Bei Rot andere Beschriftung und der Hinweis, dass der Link keine Kaufempfehlung ist. */
export function AmazonKauf({ url, rot, className = "kauf" }: { url: string; rot: boolean; className?: string }) {
  const rel = isSponsoredHref(url) ? "sponsored nofollow noopener" : "nofollow noopener noreferrer";
  return (
    <div className={className}>
      <a className="btn" href={url} target="_blank" rel={rel}>{rot ? AMAZON_CTA_ROT : AMAZON_CTA}</a>
      {rot ? <p className="rot-hinweis">{ROT_KEINE_KAUFEMPFEHLUNG}</p> : null}
      <p className="affiliate-note">{AFFILIATE_HINWEIS}</p>
    </div>
  );
}

/** Nummerierte Quellen (externe Links nofollow), Methodik- und Prüfstand-Hinweis und der Kauf-Button mit Affiliate-Hinweis. */
export function Sources({ quellen, pruefstand, methodikHinweis, kaufUrl, rot = false }: { quellen?: LayoutData["quellen"]; pruefstand?: string; methodikHinweis?: string; kaufUrl?: string | null; rot?: boolean }) {
  return (
    <>
      {quellen?.length ? (
        <ol className="source-list">
          {quellen.map((q) => (
            <li key={`${q.titel}-${q.doi ?? q.url ?? ""}`}>
              {q.url ? <a href={q.url} target="_blank" rel="nofollow noopener noreferrer">{q.titel}</a> : <span>{q.titel}</span>}
              {q.doi && <span className="hinweis">DOI: <a href={`https://doi.org/${q.doi}`} target="_blank" rel="nofollow noopener noreferrer">{q.doi}</a></span>}
              {q.hinweis && <span className="hinweis">{q.hinweis}</span>}
            </li>
          ))}
        </ol>
      ) : null}
      {methodikHinweis && <div className="bottom-note">{methodikHinweis}</div>}
      {pruefstand && <p className="pruefstand">{pruefstand}</p>}
      {kaufUrl && <AmazonKauf url={kaufUrl} rot={rot} />}
    </>
  );
}
