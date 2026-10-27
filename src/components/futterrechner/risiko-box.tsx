import { AlertTriangle, Info } from "lucide-react";
import Link from "next/link";
import { QUELLEN, RISIKEN, RISIKO_PFLICHTZEILE, type RisikoId, type Stufe } from "@/lib/futterrechner/risiken";

function Inhalt({ id }: { id: RisikoId }) {
  const r = RISIKEN[id];
  return (
    <>
      <p>{r.risiko}</p>
      <p>
        <strong>Lösung:</strong>{" "}
        {r.loesung.map((t, i) =>
          typeof t === "string" ? <span key={i}>{t}</span> : <Link key={i} href={t.href} className="break-words font-semibold">{t.a}</Link>,
        )}
      </p>
      <p className="text-xs text-muted">
        Quelle:{" "}
        {r.quellen.map((q, i) => (
          <span key={q.id + i}>
            {i > 0 && "; "}
            <a href={QUELLEN[q.id].url} target="_blank" rel="noopener noreferrer" title={QUELLEN[q.id].voll} className="break-words">{q.text}</a>
          </span>
        ))}
      </p>
    </>
  );
}

/** „Mögliche Folgen“: rot (bad) offen, gelb (warn) eingeklappt. Vorhandene Stile fp-box fp-warn. */
export function RisikoBox({ id, stufe, offen }: { id: RisikoId; stufe: Stufe; offen: boolean }) {
  const aufgeklappt = stufe === "bad" && offen;
  return (
    <div className="prose-fp mt-3" data-risiko={id}>
      <div className="fp-box fp-warn fp-ergebnis-box">
        {aufgeklappt ? (
          <>
            <p className="flex items-center gap-2 font-semibold"><AlertTriangle aria-hidden className="size-5 shrink-0" /> Mögliche Folgen</p>
            <Inhalt id={id} />
          </>
        ) : (
          <details>
            <summary className="font-semibold"><AlertTriangle aria-hidden className="size-5 shrink-0" /> Mögliche Folgen</summary>
            <div className="space-y-3"><Inhalt id={id} /></div>
          </details>
        )}
      </div>
    </div>
  );
}

/** Mengen-Box (Info, neutral) unter der Tagesmenge bzw. dem Leckerli-Budget: fp-box fp-merk. */
export function MengenBox({ id }: { id: RisikoId }) {
  return (
    <div className="prose-fp mt-3" data-risiko={id}>
      <div className="fp-box fp-merk fp-ergebnis-box">
        <p className="flex items-center gap-2 font-semibold"><Info aria-hidden className="size-5 shrink-0" /> Gut zu wissen</p>
        <Inhalt id={id} />
      </div>
    </div>
  );
}

/** Pflichtzeile einmal über der ersten Box: normale Textgröße, immer sichtbar. */
export function RisikoPflichtzeile() {
  return <p className="mt-3 text-base leading-relaxed" data-risiko-pflichtzeile>{RISIKO_PFLICHTZEILE}</p>;
}
