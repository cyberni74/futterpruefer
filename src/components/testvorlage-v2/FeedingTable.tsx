import type { LayoutData } from "./schema";

/** Dosierungs- bzw. Fütterungstabelle (z. B. Körpergewicht → Tagesmenge). */
export function FeedingTable({ dosierung }: { dosierung?: LayoutData["dosierung"] }) {
  if (!dosierung?.zeilen.length) return null;
  const [a, b] = dosierung.kopf ?? ["Körpergewicht", "Tagesdosis"];
  return (
    <table className="data">
      <caption className="sr-only">Dosierung</caption>
      <thead><tr><th scope="col">{a}</th><th scope="col">{b}</th></tr></thead>
      <tbody>{dosierung.zeilen.map((z) => <tr key={z.label}><td className="left-val">{z.label}</td><td>{z.wert}</td></tr>)}</tbody>
    </table>
  );
}
