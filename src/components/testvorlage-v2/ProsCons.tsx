/** Vor- und Nachteile. */
export function ProsCons({ pros, cons }: { pros?: string[]; cons?: string[] }) {
  if (!pros?.length && !cons?.length) return null;
  return (
    <div className="report">
      {pros?.length ? <div className="positive"><h3>Vorteile</h3><ul>{pros.map((p) => <li key={p}>{p}</li>)}</ul></div> : null}
      {cons?.length ? <div className="negative"><h3>Nachteile</h3><ul>{cons.map((c) => <li key={c}>{c}</li>)}</ul></div> : null}
    </div>
  );
}
