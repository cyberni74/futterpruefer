import type { LayoutData } from "./schema";

/** Analytische Bestandteile bzw. Nährwerte als Tabelle. */
export function AnalyticalValues({ werte }: { werte?: LayoutData["analysewerte"] }) {
  if (!werte?.length) return null;
  const mitHinweis = werte.some((w) => w.hinweis);
  return (
    <table className="data">
      <caption className="sr-only">Analytische Bestandteile</caption>
      <thead><tr><th scope="col">Wert</th><th scope="col">Gehalt</th>{mitHinweis && <th scope="col">Hinweis</th>}</tr></thead>
      <tbody>
        {werte.map((w) => (
          <tr key={w.name}><td className="left-val">{w.name}</td><td>{w.wert}</td>{mitHinweis && <td className="left-val">{w.hinweis ?? ""}</td>}</tr>
        ))}
      </tbody>
    </table>
  );
}
