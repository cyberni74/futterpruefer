import type { Art } from "@/lib/futterrechner/types";
import { Karte, Rahmen } from "./rahmen";

export const INFOGRAFIK_4 = {
  datei: "rohprotein-hundefutter-wieviel-fediaf",
  alt: "Ampelskala Rohprotein und Rohfett je 1000 kcal mit FEDIAF-Mindestwerten für Hund und Katze nach Lebensphase",
};

const SKALA = 1.6; // Skalenende = 160 % des Minimums
type Zeile = { name: string; min: string; marker?: { wert: number; label: string } };

const PROTEIN_HUND: Zeile[] = [
  { name: "Hund adult", min: "45", marker: { wert: 67.5 / 45, label: "Beispiel T1: 67 g Protein → 1,5-fach" } },
  { name: "Hund wenig aktiv / Senior", min: "52,1", marker: { wert: 49.2 / 52.1, label: "Beispiel T7: 49 g bei 52,1 nötig → 94 %" } },
  { name: "Welpe unter 14 Wochen", min: "62,5" },
  { name: "Welpe ab 14 Wochen", min: "50" },
];
const PROTEIN_KATZE: Zeile[] = [
  { name: "Katze Freigang", min: "62,5" },
  { name: "Katze kastriert / Wohnung", min: "83,3" },
  { name: "Kitten", min: "70" },
];
const FETT: Zeile[] = [{ name: "Hund adult", min: "13,75" }, { name: "Welpe", min: "21,25" }, { name: "Katze", min: "22,5" }];

function Skala({ z }: { z: Zeile }) {
  const pos = (r: number) => `${Math.min(100, (r / SKALA) * 100)}%`;
  return (
    <li className="py-2">
      <div className="flex items-baseline justify-between gap-2 text-sm"><span className="font-semibold">{z.name}</span><span className="shrink-0 whitespace-nowrap tabular-nums">Minimum <strong>{z.min} g</strong></span></div>
      <div className="relative mt-2 flex h-4 overflow-hidden rounded-full" role="img" aria-label={`Minimum ${z.min} Gramm je 1000 Kilokalorien`}>
        <span className="bg-bad" style={{ width: pos(0.9) }} />
        <span className="bg-mid-fill" style={{ width: `${(0.1 / SKALA) * 100}%` }} />
        <span className="flex-1 bg-good" />
      </div>
      <div className="relative h-0">
        <span aria-hidden className="absolute -top-[1.35rem] h-6 w-1 -translate-x-1/2 rounded bg-fg" style={{ left: pos(1) }} />
        {z.marker && <span aria-hidden className="absolute -top-[1.2rem] size-3.5 -translate-x-1/2 rounded-full border-2 border-fg bg-surface" style={{ left: pos(z.marker.wert) }} />}
      </div>
      {z.marker && <p className="mt-1.5 text-xs font-semibold text-muted">{z.marker.label}</p>}
    </li>
  );
}

export function Infografik4({ art = "hund" }: { art?: Art }) {
  const protein = art === "hund" ? [...PROTEIN_HUND, ...PROTEIN_KATZE] : [...PROTEIN_KATZE, ...PROTEIN_HUND];
  return (
    <Rahmen nr={4} datei={INFOGRAFIK_4.datei} titel="Protein und Fett je 1000 kcal: die FEDIAF-Ampel" alt={INFOGRAFIK_4.alt} quelle="FEDIAF 2025, Tab. III-3b, III-4b">
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold">
        <span className="inline-flex items-center gap-1.5"><i className="size-3 rounded-full bg-bad" /> unter 90 % des Minimums</span>
        <span className="inline-flex items-center gap-1.5"><i className="size-3 rounded-full bg-mid-fill" /> 90–99 %</span>
        <span className="inline-flex items-center gap-1.5"><i className="size-3 rounded-full bg-good" /> ab 100 %</span>
        <span className="inline-flex items-center gap-1.5"><i className="h-3 w-1 rounded bg-fg" /> Minimum</span>
      </p>
      <Karte>
        <p className="font-display font-extrabold">Rohprotein (g je 1000 kcal)</p>
        <ul className="mt-1 divide-y divide-border">{protein.map((z) => <Skala key={z.name} z={z} />)}</ul>
      </Karte>
      <Karte>
        <p className="font-display font-extrabold">Rohfett (g je 1000 kcal)</p>
        <ul className="mt-1 divide-y divide-border">{FETT.map((z) => <Skala key={z.name} z={z} />)}</ul>
      </Karte>
      <p className="text-sm font-semibold">Wer weniger frisst, braucht mehr Nährstoff pro Kalorie. Deshalb ist der Wert für kastrierte Katzen höher.</p>
      <p className="text-sm">Das Minimum zu erreichen bringt 10 bzw. 5 Punkte. Den größeren Teil der Note bestimmt das Verhältnis von Protein zu Fett.</p>
    </Rahmen>
  );
}
