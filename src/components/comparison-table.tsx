import Link from "next/link";
import { AMAZON_CTA, AFFILIATE_HINWEIS } from "@/components/testvorlage-v2/Sources";
import { formatScore } from "@/lib/scoring";
import {
  COMPARISON_AMAZON_REL,
  formatEuro,
  formatNote,
  rowAmazonCtaUrl,
  rowAmpelWord,
  rowNote,
  rowRating,
  type ComparisonTableRow,
} from "@/lib/comparison-table";

const AMPEL_CLASS = {
  gut: "vt-ampel vt-ampel-gut",
  mittel: "vt-ampel vt-ampel-mittel",
  schlecht: "vt-ampel vt-ampel-schlecht",
} as const;

export function ComparisonTable({
  rows,
  caption,
  showPlace = false,
}: {
  rows: ComparisonTableRow[];
  caption?: string;
  showPlace?: boolean;
}) {
  if (!rows.length) return null;
  const showDose = rows.some((row) => row.dosePerKgLabel);
  const showPrice = rows.some((row) => row.pricePerDay != null && row.pricePerDay > 0);
  const showAmazon = rows.some((row) => rowAmazonCtaUrl(row));
  return (
    <div className="prose-fp">
      <table className="vt-table">
        {caption ? <caption className="mb-2 text-left text-sm text-muted">{caption}</caption> : null}
        <thead>
          <tr>
            {showPlace ? <th scope="col">Platz</th> : null}
            <th scope="col">Produkt</th>
            <th scope="col">Punkte</th>
            <th scope="col">Ampel</th>
            <th scope="col">Note</th>
            {showDose ? <th scope="col">Dosis je kg</th> : null}
            {showPrice ? <th scope="col">Preis / Tag</th> : null}
            {showAmazon ? <th scope="col">Angebot</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const rating = rowRating(row);
            const amazon = rowAmazonCtaUrl(row);
            return (
              <tr key={`${row.href}-${row.name}`}>
                {showPlace ? <td className="vt-c-place">{row.place ?? ""}</td> : null}
                <td className="vt-c-name">
                  <Link href={row.href}>{row.name}</Link>
                </td>
                <td>{formatScore(row.score)}</td>
                <td>
                  <span className={AMPEL_CLASS[rating]}>{rowAmpelWord(row)}</span>
                </td>
                <td>{formatNote(rowNote(row))}</td>
                {showDose ? <td>{row.dosePerKgLabel ?? "–"}</td> : null}
                {showPrice ? <td>{row.pricePerDay != null && row.pricePerDay > 0 ? formatEuro(row.pricePerDay) : "–"}</td> : null}
                {showAmazon ? (
                  <td>
                    {amazon ? (
                      <a className="cta-amazon-btn" href={amazon} target="_blank" rel={COMPARISON_AMAZON_REL}>
                        {AMAZON_CTA}
                      </a>
                    ) : (
                      "–"
                    )}
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
      {showAmazon ? <p className="cta-hinweis">{AFFILIATE_HINWEIS}</p> : null}
    </div>
  );
}
