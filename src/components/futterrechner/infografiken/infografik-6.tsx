import { ArrowRight, EyeOff } from "lucide-react";
import Link from "next/link";
import { NOTEN, NOTEN_REIHE } from "@/lib/futterrechner/fediaf";
import { Karte, Rahmen } from "./rahmen";

export const INFOGRAFIK_6 = {
  datei: "hundefutter-pruefen-bewertung-futterrechner",
  alt: "Punkteschema des Futterrechners von sehr gut bis mangelhaft und Liste dessen, was Analysewerte nicht zeigen",
};

const PUNKTE: Array<[string, number]> = [["Protein", 35], ["Fett", 20], ["Calcium/Phosphor", 20], ["Taurin (nur Katze)", 10], ["Plausibilität", 15]];
const SCHWELLEN = ["ab 90", "80–89", "70–79", "60–69", "unter 60"];
const FARBE = ["bg-good-soft text-good", "bg-good-soft text-good", "bg-mid-soft text-mid", "bg-mid-soft text-mid", "bg-bad-soft text-bad"];
const NICHT = ["Herkunft und Qualität der Rohstoffe", "Fleischanteil", "Zusatzstoffe und Konservierung", "Schadstoffe", "Verarbeitung", "Deklaration"];

export function Infografik6() {
  return (
    <Rahmen nr={6} datei={INFOGRAFIK_6.datei} titel="So bewertet der Futterrechner und was die Analyse nicht zeigt" alt={INFOGRAFIK_6.alt} quelle="Futterprüfer-Methodik (Stand 26.10.2026); FEDIAF 2025">
      <div className="grid gap-3 md:grid-cols-2">
        <Karte>
          <p className="font-display font-extrabold">Was wir rechnen</p>
          <ul className="mt-3 space-y-2">
            {PUNKTE.map(([n, pt]) => (
              <li key={n} className="grid grid-cols-[8.5rem_1fr_2rem] items-center gap-2 text-sm">
                <span>{n}</span>
                <span className="h-3 rounded-full bg-brand" style={{ width: `${(pt / 35) * 100}%` }} />
                <strong className="tabular-nums">{pt}</strong>
              </li>
            ))}
          </ul>
          <ul className="mt-4 space-y-1.5">
            {NOTEN_REIHE.map((n, i) => (
              <li key={n} className={`flex items-center justify-between rounded-xl px-3 py-1.5 text-sm font-bold ${FARBE[i]}`}><span>{NOTEN[n]}</span><span className="tabular-nums">{SCHWELLEN[i]} Punkte</span></li>
            ))}
          </ul>
          <p className="mt-3 rounded-xl bg-bg-soft p-3 text-sm font-semibold">Unter 90 % des FEDIAF-Minimums: höchstens „mangelhaft“.</p>
        </Karte>
        <Karte>
          <p className="font-display font-extrabold">Was die Analyse nicht zeigt</p>
          <ul className="mt-3 space-y-2">
            {NICHT.map((t) => (
              <li key={t} className="flex items-center gap-2.5 text-sm"><EyeOff aria-hidden className="size-5 shrink-0 text-muted" />{t}</li>
            ))}
          </ul>
        </Karte>
      </div>
      <Link href="/tests" className="fp-btn flex min-h-12 items-center justify-between gap-3 rounded-2xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand-strong dark:text-black">
        Das prüfen unsere Tests nach der 100-Punkte-Methodik
        <ArrowRight aria-hidden className="size-5 shrink-0" />
      </Link>
    </Rahmen>
  );
}
