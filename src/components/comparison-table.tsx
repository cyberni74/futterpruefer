import Link from "next/link";
import { AMAZON_CTA, AFFILIATE_HINWEIS } from "@/components/testvorlage-v2/Sources";
import { formatScore } from "@/lib/scoring";
import {
  COMPARISON_AMAZON_REL,
  METHODIK_V1_NOTE_FOOTNOTE,
  PRICE_PER_DAY_FOOTNOTE,
  TEAMWERTUNG_FOOTNOTE,
  formatEuro,
  productNameWithTeamWertung,
  rowAmazonCtaUrl,
  rowAmpelWord,
  rowIsMethodikV1,
  rowNoteLabel,
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
  showPriceStand = false,
}: {
  rows: ComparisonTableRow[];
  caption?: string;
  showPlace?: boolean;
  /** A4: Preisstand-Satz unter Hub-Tabellen mit Spalte „Preis / Tag“. */
  showPriceStand?: boolean;
}) {
  if (!rows.length) return null;
  const showDose = rows.some((row) => row.dosePerKgLabel);
  const showPrice = rows.some((row) => row.pricePerDay != null && row.pricePerDay > 0);
  const showAmazon = rows.some((row) => rowAmazonCtaUrl(row));
  const showV1Note = rows.some((row) => rowIsMethodikV1(row));
  const showTeamWertung = rows.some((row) => row.teamWertung);
  return (
    <div className="prose-fp">
      <table className="vt-table vt-table-cmp">
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
                {showPlace ? <td className="vt-c-place" data-label="Platz">{row.place ?? ""}</td> : null}
                <td className="vt-c-name" data-label="Produkt">
                  <Link href={row.href}>{productNameWithTeamWertung(row.name, row.teamWertung)}</Link>
                </td>
                <td data-label="Punkte">{formatScore(row.score)}</td>
                <td data-label="Ampel">
                  <span className={AMPEL_CLASS[rating]}>{rowAmpelWord(row)}</span>
                </td>
                <td data-label="Note">{rowNoteLabel(row)}</td>
                {showDose ? <td data-label="Dosis je kg">{row.dosePerKgLabel ?? "–"}</td> : null}
                {showPrice ? <td data-label="Preis / Tag">{row.pricePerDay != null && row.pricePerDay > 0 ? formatEuro(row.pricePerDay) : "–"}</td> : null}
                {showAmazon ? (
                  <td data-label="Angebot">
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
      {showV1Note ? <p className="mt-2 text-sm text-muted">{METHODIK_V1_NOTE_FOOTNOTE}</p> : null}
      {showTeamWertung ? <p className="mt-2 text-sm text-muted">{TEAMWERTUNG_FOOTNOTE}</p> : null}
      {showPrice && showPriceStand ? <p className="mt-2 text-sm text-muted">{PRICE_PER_DAY_FOOTNOTE}</p> : null}
      {showAmazon ? <p className="cta-hinweis">{AFFILIATE_HINWEIS}</p> : null}
    </div>
  );
}
