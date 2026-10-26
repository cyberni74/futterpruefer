import { Scale } from "lucide-react";
import { Karte, Rahmen } from "./rahmen";

export const INFOGRAFIK_5 = {
  datei: "calcium-phosphor-verhaeltnis-hundefutter-katzenfutter",
  alt: "Empfohlene Calcium-Phosphor-Verhältnisse für Hund, Welpe, Katze und Kitten sowie typischer Rohaschegehalt in der Trockenmasse",
};

const MIN = 0.5;
const MAX = 3;
const p = (v: number) => `${((v - MIN) / (MAX - MIN)) * 100}%`;
const ZEILEN: Array<{ name: string; von: number; bis: number; text: string; punkte?: Array<{ wert: number; label: string; ok: boolean }> }> = [
  { name: "Hund adult", von: 1, bis: 2, text: "1–2 : 1", punkte: [{ wert: 1.37, label: "T1", ok: true }, { wert: 3, label: "T7", ok: false }] },
  { name: "Welpe unter 14 Wochen", von: 1, bis: 1.6, text: "1–1,6 : 1" },
  { name: "Welpe ab 14 Wo., bis 15 kg Endgewicht", von: 1, bis: 1.8, text: "1–1,8 : 1" },
  { name: "Welpe ab 14 Wo., über 15 kg Endgewicht", von: 1, bis: 1.6, text: "1–1,6 : 1" },
  { name: "Katze adult", von: 1, bis: 2, text: "1–2 : 1" },
  { name: "Kitten", von: 1, bis: 1.5, text: "1–1,5 : 1" },
];
const ASCHE_MAX = 15;
const a = (v: number) => `${(v / ASCHE_MAX) * 100}%`;

export function Infografik5() {
  return (
    <Rahmen nr={5} datei={INFOGRAFIK_5.datei} titel="Calcium, Phosphor und Rohasche einordnen" alt={INFOGRAFIK_5.alt} quelle="FEDIAF 2025, Tab. III-3a, III-4a; Kazimierska et al. 2020">
      <Karte>
        <p className="flex items-center gap-2 font-display font-extrabold"><Scale aria-hidden className="size-5 text-brand" /> Calcium zu Phosphor (Ca : P)</p>
        <ul className="mt-3 space-y-3">
          {ZEILEN.map((z) => (
            <li key={z.name}>
              <div className="flex items-baseline justify-between gap-2 text-sm"><span className="font-semibold">{z.name}</span><strong className="shrink-0 whitespace-nowrap tabular-nums">{z.text}</strong></div>
              <div className="relative mt-1.5 h-4 rounded-full bg-border" role="img" aria-label={`empfohlen ${z.text}`}>
                <span className="absolute inset-y-0 rounded-full bg-good" style={{ left: p(z.von), width: `calc(${p(z.bis)} - ${p(z.von)})` }} />
                {z.punkte?.map((pt) => (
                  <span key={pt.label} className={`absolute -top-1 grid h-6 w-max -translate-x-1/2 place-items-center whitespace-nowrap rounded-full border-2 bg-surface px-1.5 text-[0.65rem] font-extrabold ${pt.ok ? "border-good text-good" : "border-bad text-bad"}`} style={{ left: pt.wert === MAX ? "96%" : p(pt.wert) }}>{pt.label}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex justify-between text-xs tabular-nums text-muted"><span>0,5 : 1</span><span>1,5 : 1</span><span>3 : 1</span></div>
        <p className="mt-2 text-xs text-muted">Beispielpunkte: T1 = 1,37 (im Bereich), T7 = 3,0 (außerhalb).</p>
      </Karte>
      <Karte>
        <p className="font-display font-extrabold">Rohasche in % der Trockenmasse</p>
        <div className="relative mt-6 h-5 rounded-full bg-border" role="img" aria-label="Gemessene Spanne 4,8 bis 9,9 Prozent, Rechner-Band 3 bis 12 Prozent">
          <span className="absolute -inset-y-1.5 rounded-xl border-2 border-dashed border-brand" style={{ left: a(3), width: `calc(${a(12)} - ${a(3)})` }} />
          <span className="absolute inset-y-0 rounded-full bg-brand" style={{ left: a(4.8), width: `calc(${a(9.9)} - ${a(4.8)})` }} />
          <span aria-hidden className="absolute -top-2.5 h-10 w-1 -translate-x-1/2 rounded bg-accent" style={{ left: a(7.1) }} />
        </div>
        <div className="mt-2 flex justify-between text-xs tabular-nums text-muted"><span>0</span><span>5</span><span>10</span><span>15 %</span></div>
        <ul className="mt-3 space-y-1 text-sm">
          <li><strong className="text-brand">Gemessen</strong> bei 30 Hunde-Trockenfuttern: 4,8–9,9 % TS, Mittel 7,1 %</li>
          <li><strong className="text-brand">Gestrichelt:</strong> Rechner-Band 3–12 % (eigene Festlegung)</li>
        </ul>
        <p className="mt-2 text-sm font-semibold">Rohasche ist eine Summe. Sie sagt nicht, welche Mineralstoffe drin sind.</p>
      </Karte>
    </Rahmen>
  );
}
