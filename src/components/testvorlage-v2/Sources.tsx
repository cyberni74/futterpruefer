import { isSponsoredHref } from "@/lib/sanitize";
import type { LayoutData } from "./schema";

export const AFFILIATE_HINWEIS =
  "*Affiliate-Link: Wir erhalten bei einem Kauf eine Provision, der Preis ändert sich für Sie nicht. Die Provision hat keinen Einfluss auf unsere Bewertung.";

/** Nummerierte Quellen (externe Links nofollow), Methodik- und Prüfstand-Hinweis und der Kauf-Button mit Affiliate-Hinweis. */
export function Sources({ quellen, pruefstand, methodikHinweis, kaufUrl, kaufLabel }: { quellen?: LayoutData["quellen"]; pruefstand?: string; methodikHinweis?: string; kaufUrl?: string | null; kaufLabel?: string }) {
  const rel = kaufUrl && isSponsoredHref(kaufUrl) ? "sponsored nofollow noopener" : "nofollow noopener noreferrer";
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
      {kaufUrl && (
        <div className="kauf">
          <a className="btn" href={kaufUrl} target="_blank" rel={rel}>{kaufLabel || "Bei Amazon ansehen*"}</a>
          <p className="affiliate-note">{AFFILIATE_HINWEIS}</p>
        </div>
      )}
    </>
  );
}
