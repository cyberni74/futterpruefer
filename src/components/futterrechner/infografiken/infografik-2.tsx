import { Karte, Rahmen } from "./rahmen";

export const INFOGRAFIK_2 = {
  datei: "trockensubstanz-berechnen-nassfutter-trockenfutter",
  alt: "Rechenbeispiel Trockenmasse: Nassfutter mit 10,5 Prozent Protein hat 47,7 Prozent in der Trockenmasse, Trockenfutter mit 25 Prozent hat 27,8 Prozent",
};

function Fall({ titel, protein, feuchte, ts, ergebnis }: { titel: string; protein: string; feuchte: number; ts: number; ergebnis: string }) {
  return (
    <Karte>
      <p className="font-display text-lg font-extrabold">{titel}</p>
      <p className="mt-1 text-sm text-muted">{protein} Rohprotein · {feuchte} % Feuchte</p>
      <div className="mt-3 flex h-6 overflow-hidden rounded-full border border-border" role="img" aria-label={`${feuchte} Prozent Wasser, ${ts} Prozent Trockenmasse`}>
        <span className="flex items-center justify-center bg-border text-xs font-bold text-muted" style={{ width: `${feuchte}%` }}>Wasser {feuchte} %</span>
        <span className="flex items-center justify-center bg-brand text-xs font-bold text-white dark:text-black" style={{ width: `${ts}%` }}>{ts} %</span>
      </div>
      <p className="mt-3 text-sm">Trockenmasse {ts} %</p>
      <p className="mt-1 text-sm tabular-nums">{protein.replace(" %", "")} ÷ {ts} × 100 = <strong className="text-lg text-brand">{ergebnis} % Protein in der TS</strong></p>
    </Karte>
  );
}

export function Infografik2() {
  return (
    <Rahmen nr={2} datei={INFOGRAFIK_2.datei} titel="Trockenmasse: so werden Nass- und Trockenfutter vergleichbar" alt={INFOGRAFIK_2.alt} quelle="FEDIAF 2025, Tab. III-3a; Testfälle T1/T2">
      <div className="grid gap-3 md:grid-cols-2">
        <Fall titel="Nassfutter" protein="10,5 %" feuchte={78} ts={22} ergebnis="47,7" />
        <Fall titel="Trockenfutter" protein="25 %" feuchte={10} ts={90} ergebnis="27,8" />
      </div>
      <p className="rounded-2xl bg-brand-soft p-3 text-center text-sm font-bold text-brand-strong">Wert in TS = Wert ÷ (100 − Feuchte) × 100</p>
      <p className="text-sm font-semibold">Auf der Packung wirkt Nassfutter eiweißarm, in der Trockenmasse ist es oft reicher.</p>
      <p className="text-xs text-muted">Noch fairer ist der Vergleich je 1000 kcal (Grafik 4).</p>
    </Rahmen>
  );
}
