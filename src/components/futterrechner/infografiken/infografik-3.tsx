import type { Art } from "@/lib/futterrechner/types";
import { Karte, Rahmen } from "./rahmen";

export const INFOGRAFIK_3 = {
  datei: "kalorienbedarf-hund-katze-berechnen",
  alt: "Energiebedarf von Hund und Katze nach FEDIAF: Faktoren nach Aktivität und Lebensphase mit Rechenbeispielen",
};

const HUND: Array<[string, string, number]> = [
  ["wenig aktiv", "95", 95], ["Senior ab 8 J.", "95", 95], ["normal, 3–7 J.", "110", 110], ["sportlich", "125", 125], ["normal, 1–2 J.", "130", 130], ["Arbeitshund", "150–175", 162.5],
];

function Hund() {
  return (
    <Karte>
      <p className="font-display text-lg font-extrabold">Hund</p>
      <p className="mt-1 text-sm font-bold">MER = Faktor × Gewicht<sup>0,75</sup> (kcal/Tag)</p>
      <ul className="mt-3 space-y-2">
        {HUND.map(([name, wert, breite]) => (
          <li key={name} className="grid grid-cols-[7.5rem_1fr] items-center gap-2 text-sm sm:grid-cols-[9rem_1fr]">
            <span>{name}</span>
            <span className="flex items-center gap-2"><span className="h-3 rounded-full bg-brand" style={{ width: `${(breite / 175) * 100}%` }} /><span className="font-bold tabular-nums">{wert}</span></span>
          </li>
        ))}
        <li className="text-sm text-muted">kastriert: ungefähr −10 % (eigene Ableitung aus AAHA 2021)</li>
      </ul>
      <p className="mt-3 rounded-xl bg-bg-soft p-3 text-sm">Beispiel: 20 kg, normal aktiv: 110 × 20<sup>0,75</sup> = <strong>1.040 kcal/Tag</strong></p>
      <p className="mt-2 rounded-xl bg-bg-soft p-3 text-sm"><strong>Welpe:</strong> (254,1 − 135 × aktuell ÷ Endgewicht) × Gewicht<sup>0,75</sup>. Beispiel 12 kg von 30 kg: <strong>1.290 kcal/Tag</strong></p>
    </Karte>
  );
}

function Katze() {
  return (
    <Karte>
      <p className="font-display text-lg font-extrabold">Katze</p>
      <p className="mt-1 text-sm font-bold">MER = Faktor × Gewicht<sup>0,67</sup> (kcal/Tag)</p>
      <ul className="mt-3 space-y-1.5 text-sm">
        <li>kastriert oder Wohnung: <strong>75</strong> (Spanne 52–75)</li>
        <li>Freigang: <strong>100</strong></li>
        <li>Kitten bis 4 Mon.: <strong>× 2,0–2,5</strong> · 4–9 Mon.: <strong>× 1,75–2,0</strong> · 9–12 Mon.: <strong>× 1,5</strong> (von 100 × kg<sup>0,67</sup>)</li>
      </ul>
      <p className="mt-3 rounded-xl bg-bg-soft p-3 text-sm">Beispiel: 4,5 kg, kastriert: 75 × 4,5<sup>0,67</sup> = <strong>206 kcal/Tag</strong></p>
    </Karte>
  );
}

export function Infografik3({ art = "hund" }: { art?: Art }) {
  return (
    <Rahmen nr={3} datei={INFOGRAFIK_3.datei} titel="Wie viele Kalorien braucht mein Tier?" alt={INFOGRAFIK_3.alt} quelle="FEDIAF 2025, Tab. VII-6, VII-7, VII-8b, VII-9, VII-10; AAHA 2021">
      {art === "hund" ? <><Hund /><Katze /></> : <><Katze /><Hund /></>}
      <p className="rounded-2xl bg-mid-soft p-3 text-sm font-semibold text-fg">Startwert, kein Muss: Diese Werte können den Bedarf um 10–60 % überschätzen. Wiegen und anpassen.</p>
    </Rahmen>
  );
}
