import { Karte, Rahmen } from "./rahmen";

export const INFOGRAFIK_1 = {
  datei: "analytische-bestandteile-hundefutter-erklaert",
  alt: "Etikett eines Hundefutters mit erklärten analytischen Bestandteilen: Rohprotein, Rohfett, Rohfaser, Rohasche und Feuchte",
};

const CALLOUTS = [
  "Pflicht bei Hunde- und Katzenfutter: Rohprotein, Rohfett, Rohfaser, Rohasche (VO (EG) 767/2009, Anhang VII Kap. II)",
  "Feuchte: Pflicht erst über 14 %. Fehlt sie bei Trockenfutter, rechnen wir mit 10 %.",
  "Rohasche = Mineralstoffe. Auch „Ascherückstand“ oder „anorganischer Stoff“.",
  "Calcium und Phosphor: freiwillig. Fehlen sie, fragen Sie den Hersteller.",
  "Taurin unter Zusatzstoffe = zugesetzte Menge, nicht der Gesamtgehalt.",
  "Alle Werte gelten für das Futter, wie es in der Packung ist, inklusive Wasser.",
];

const ZEILEN: Array<[string, string, number]> = [
  ["Rohprotein", "25 %", 1], ["Rohfett", "14 %", 1], ["Rohfaser", "2,5 %", 1], ["Rohasche", "7 %", 3], ["Feuchtigkeit", "10 %", 2], ["Calcium", "1,3 %", 4], ["Phosphor", "0,95 %", 4],
];

export function Infografik1() {
  return (
    <Rahmen nr={1} datei={INFOGRAFIK_1.datei} titel="Die Analysewerte auf der Packung lesen" alt={INFOGRAFIK_1.alt} quelle="VO (EG) 767/2009 · FEDIAF Labelling Code">
      <div className="grid gap-4 md:grid-cols-2">
        <Karte className="border-dashed">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Beispieletikett (neutral, ohne Marke)</p>
          <p className="mt-2 text-sm font-bold">Alleinfuttermittel für ausgewachsene Hunde</p>
          <p className="mt-3 text-sm font-extrabold">Analytische Bestandteile</p>
          <ul className="mt-1 divide-y divide-border text-sm">
            {ZEILEN.map(([name, wert, c]) => (
              <li key={name} className="flex items-center justify-between gap-2 py-1.5">
                <span className="flex items-center gap-2"><Nummer n={c === 1 ? 1 : c} />{name}</span>
                <span className="font-bold tabular-nums">{wert}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm font-extrabold">Zusatzstoffe je kg</p>
          <p className="flex items-center gap-2 text-sm"><Nummer n={5} />Taurin 1.000 mg</p>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted"><Nummer n={6} />gilt für das Futter wie verpackt</p>
        </Karte>
        <ol className="space-y-2">
          {CALLOUTS.map((t, i) => (
            <li key={t} className="flex gap-3 rounded-2xl bg-surface p-3 text-sm leading-snug">
              <Nummer n={i + 1} />
              <span>{t}</span>
            </li>
          ))}
        </ol>
      </div>
    </Rahmen>
  );
}

const Nummer = ({ n }: { n: number }) => (
  <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-brand text-xs font-extrabold text-white dark:text-black">{n}</span>
);
