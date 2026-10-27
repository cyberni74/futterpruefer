"use client";

import type { Ergebnis } from "@/lib/futterrechner/types";
import { NOTE_ABGRENZUNG, n0 } from "@/lib/futterrechner/texte";
import { NoteBadge } from "./ergebnis-karte";
import { Gauge } from "./gauge";

/** Sticky Leiste (mobil), über der Bottom-Bar. Tipp scrollt zur Ergebnis-Karte. */
export function ErgebnisLeiste({ ergebnis, nochFehlt, sichtbar, bereit }: { ergebnis: Ergebnis | null; nochFehlt: number; sichtbar: boolean; bereit: boolean }) {
  if (!sichtbar) return null;
  const ok = ergebnis?.status === "ok" ? ergebnis : null;
  return (
    <a
      href={ergebnis ? "#ergebnis" : "#analysieren"}
      className="fixed inset-x-3 bottom-[calc(3.5rem+env(safe-area-inset-bottom)+0.5rem)] z-30 flex min-h-16 flex-col justify-center gap-1 rounded-2xl py-2 border border-border bg-surface/90 px-3 shadow-lift backdrop-blur-md md:bottom-3 lg:hidden"
    >
      {ok ? (
        <>
          <span className="flex w-full items-center gap-3">
            <Gauge score={ok.score} klein titel={`Nährwert-Check ${ok.score} von 100`} />
            <NoteBadge note={ok.note} />
            <span className="ml-auto font-display text-lg font-extrabold tabular-nums">{ok.menge != null ? `${n0(ok.menge)} g/Tag` : `${ok.score}/100`}</span>
          </span>
          <span className="block text-xs leading-snug">{NOTE_ABGRENZUNG}</span>
        </>
      ) : ergebnis?.status === "ergaenzung" ? (
        <span className="text-sm font-bold">Leckerli-Budget: {n0(ergebnis.budgetGramm)} g/Tag</span>
      ) : (
        <span className="text-sm font-bold">{nochFehlt > 0 ? `Noch ${nochFehlt} ${nochFehlt === 1 ? "Wert" : "Werte"}, dann können Sie analysieren` : bereit ? "Alles da: Jetzt Futter analysieren" : "Bitte Eingabe prüfen"}</span>
      )}
    </a>
  );
}
