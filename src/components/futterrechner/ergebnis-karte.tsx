"use client";

import { AlertTriangle, CheckCircle2, ChevronDown, Info, Share2, XCircle } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { NOTEN } from "@/lib/futterrechner/fediaf";
import type { Ergebnis, ErgebnisOk, Grund, Note } from "@/lib/futterrechner/types";
import { ERGAENZUNG_TEXT, GUTE_WERTE, NICHT_GEZEIGT_VORN, NUR_NAEHRWERTE, n0, n1, n2 } from "@/lib/futterrechner/texte";
import { MAX_OFFEN } from "@/lib/futterrechner/risiken";
import { FazitBox } from "./fazit-box";
import { Gauge, useZaehler } from "./gauge";
import { MengenBox, RisikoBox, RisikoPflichtzeile } from "./risiko-box";

export const NOTE_STIL: Record<Note, { klasse: string; icon: typeof CheckCircle2 }> = {
  "sehr gut": { klasse: "bg-good-soft text-good", icon: CheckCircle2 },
  gut: { klasse: "bg-good-soft text-good", icon: CheckCircle2 },
  befriedigend: { klasse: "bg-mid-soft text-mid", icon: AlertTriangle },
  ausreichend: { klasse: "bg-mid-soft text-mid", icon: AlertTriangle },
  mangelhaft: { klasse: "bg-bad-soft text-bad", icon: XCircle },
};

export function NoteBadge({ note, gross = false, puls = false }: { note: Note; gross?: boolean; puls?: boolean }) {
  const { klasse, icon: Icon } = NOTE_STIL[note];
  return (
    <span key={note} className={`${puls ? "fp-pulse" : ""} inline-flex items-center gap-1.5 rounded-full font-extrabold uppercase tracking-wide ${klasse} ${gross ? "px-4 py-2 text-base" : "px-2.5 py-1 text-xs"}`}>
      <Icon aria-hidden className={gross ? "size-5" : "size-4"} />
      {NOTEN[note]}
    </span>
  );
}

const GRUND_STIL: Record<Grund["art"], { icon: typeof Info; farbe: string }> = {
  ok: { icon: CheckCircle2, farbe: "text-good" },
  warn: { icon: AlertTriangle, farbe: "text-mid" },
  bad: { icon: XCircle, farbe: "text-bad" },
  info: { icon: Info, farbe: "text-brand" },
};

function Balken({ verhaeltnis }: { verhaeltnis: number }) {
  const breite = Math.min(100, (verhaeltnis / 2) * 100);
  const farbe = verhaeltnis >= 1 ? "bg-good" : verhaeltnis >= 0.9 ? "bg-mid-fill" : "bg-bad";
  return (
    <span aria-hidden className="relative mt-1.5 block h-2 rounded-full bg-border">
      <span className={`absolute inset-y-0 left-0 rounded-full ${farbe}`} style={{ width: `${breite}%` }} />
      <span className="absolute -inset-y-1 left-1/2 w-0.5 bg-fg/70" />
    </span>
  );
}

function RechenwegZeilen({ r }: { r: ErgebnisOk }) {
  const zeilen: Array<[string, string]> = [
    ["Trockenmasse (TS)", `${n1(r.ts)} %${r.feuchteGeschaetzt ? " (Feuchte geschätzt)" : ""}`],
    ["NfE (nur Information)", `${n1(r.nfe < 0 ? 0 : r.nfe)} % (${n1(r.nfeTs)} % der TS)`],
    ["Bruttoenergie GE", `${n1(r.ge)} kcal/100 g`],
    ["Verdaulichkeit", `${n2(r.dig)} %`],
    ["Verdauliche Energie DE", `${n1(r.de)} kcal/100 g`],
    ["Umsetzbare Energie ME (Schätzung)", `${n1(r.meSchaetzung)} kcal/100 g`],
    ...(r.me !== r.meSchaetzung ? ([["ME laut Hersteller (gilt)", `${n1(r.me)} kcal/100 g`]] as Array<[string, string]>) : []),
    ["Ruheenergiebedarf RER", `${n0(r.rer)} kcal/Tag`],
    ["Energiebedarf MER" + (r.bedarf.faktor ? ` (Faktor ${n1(r.bedarf.faktor)})` : ""), Number.isFinite(r.bedarf.kcal) ? `${n0(r.bedarf.kcal)} kcal/Tag` : "–"],
    ["Rohprotein je 1000 kcal", `${n1(r.p1000)} g (Minimum ${r.mindest.p} g)`],
    ["Rohfett je 1000 kcal", `${n1(r.f1000)} g (Minimum ${r.mindest.f} g)`],
  ];
  return (
    <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 text-sm">
      {zeilen.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-muted">{k}</dt>
          <dd className="text-right font-semibold tabular-nums">{v}</dd>
        </div>
      ))}
      <div className="col-span-2 mt-2 text-xs text-muted">Quelle: FEDIAF Nutritional Guidelines 2025, NRC 2006 (Vierschrittverfahren). Kastriert-Faktor × 0,9: eigene Ableitung aus AAHA 2021.</div>
    </dl>
  );
}

export function ErgebnisKarte({ ergebnis: roh, nochFehlt, fehlerText, onTeilen, geteilt, ctas, titel, analysiert, bereit, art }: {
  ergebnis: Ergebnis | null; nochFehlt: string[]; fehlerText?: string; onTeilen: () => void; geteilt: string; ctas?: ReactNode; titel: string;
  /** Ergebnis erst nach Klick auf „Jetzt Futter analysieren“ */
  analysiert: boolean; bereit: boolean; art: "hund" | "katze";
}) {
  const ergebnis = analysiert ? roh : null;
  const score = ergebnis?.status === "ok" ? ergebnis.score : 0;
  const zahl = useZaehler(score);
  const ok = ergebnis?.status === "ok" ? ergebnis : null;
  const offenZaehler = { n: 0 };

  return (
    <section id="ergebnis" aria-labelledby="ergebnis-h" className="scroll-mt-24 rounded-3xl border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <h2 id="ergebnis-h" className="font-display text-lg font-extrabold">{titel}</h2>
        <button type="button" onClick={onTeilen} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-bold text-white hover:bg-accent-strong dark:text-black">
          <Share2 aria-hidden className="size-4" /> Teilen
        </button>
      </div>
      <p aria-live="polite" className="sr-only">{geteilt}</p>

      {!ergebnis && (
        <div className="mt-4 rounded-2xl bg-bg-soft p-4 text-sm text-muted">
          {fehlerText ? <p role="alert" className="font-semibold text-bad">{fehlerText}</p> : <p><strong className="text-fg">{nochFehlt.length > 0 ? `Noch ${nochFehlt.length} ${nochFehlt.length === 1 ? "Wert" : "Werte"}, dann können Sie analysieren.` : bereit ? "Alle Pflichtangaben sind da." : "Noch keine Eingabe."}</strong>{nochFehlt.length > 0 && <> Es fehlt: {nochFehlt.join(", ")}.</>}{(nochFehlt.length > 0 || bereit) && <> Tippen Sie dann auf „Jetzt Futter analysieren“.</>}</p>}
        </div>
      )}

      {ergebnis && (ergebnis.status === "fehlt" || ergebnis.status === "unplausibel") && (
        <p role="alert" className="mt-4 rounded-2xl bg-bad-soft p-4 text-sm font-semibold text-bad">{ergebnis.msg}</p>
      )}

      {ergebnis?.status === "ergaenzung" && (
        <div className="mt-4 space-y-3 rounded-2xl bg-brand-soft p-4 text-sm">
          <p className="font-bold">Keine Note für Ergänzungsfutter und Snacks.</p>
          <p>{ERGAENZUNG_TEXT} Mehr dazu: <Link href="/blog/alleinfuttermittel-ergaenzungsfuttermittel" className="font-semibold text-brand underline underline-offset-4">Alleinfutter oder Ergänzungsfutter</Link>.</p>
          <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 tabular-nums">
            <dt>Energie (ME)</dt><dd className="text-right font-bold">{n0(ergebnis.me)} kcal/100 g</dd>
            <dt>Trockenmasse</dt><dd className="text-right font-bold">{n1(ergebnis.ts)} %</dd>
            {ergebnis.kcalStueck != null && (<><dt>Energie je Stück</dt><dd className="text-right font-bold">{n1(ergebnis.kcalStueck)} kcal</dd></>)}
          </dl>
          <p className="rounded-xl bg-surface p-3 font-semibold">Leckerli-Budget: bis {n0(ergebnis.budgetKcal)} kcal, das sind etwa {n0(ergebnis.budgetGramm)} g pro Tag. Höchstens 10 % des Tagesbedarfs.</p>
          <RisikoPflichtzeile />
          <MengenBox id={ergebnis.leckerliRisiko} />
          {ergebnis.hinweise.map((h) => <p key={h.id} className="text-xs text-muted">{h.text}</p>)}
        </div>
      )}

      {ok && (
        <>
          <div className="mt-3 text-center">
            <Gauge score={ok.score} titel={`Nährwert-Check ${ok.score} von 100`} />
            <p className="font-display -mt-2 text-5xl font-extrabold tabular-nums leading-none">{zahl}</p>
            <div className="mt-3"><NoteBadge note={ok.note} gross puls /></div>
            <p className="mx-auto mt-3 max-w-sm text-sm text-muted">{NUR_NAEHRWERTE}</p>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            {ok.menge != null ? (
              <>
                <p className="font-display text-3xl font-extrabold tabular-nums">{n0(ok.menge)} g <span className="text-base font-bold text-muted">pro Tag</span></p>
                <p className="text-sm text-muted tabular-nums">Spanne {n0(ok.mengeLo!)} bis {n0(ok.mengeHi!)} g · {n0(ok.bedarf.kcal)} kcal/Tag · {n0(ok.me)} kcal/100 g</p>
              </>
            ) : (
              <p className="text-sm font-semibold">Ohne erwartetes Endgewicht gibt es keine Tagesmenge. · {n0(ok.me)} kcal/100 g</p>
            )}
            {ok.mengeRisiko && (
              <>
                <RisikoPflichtzeile />
                <MengenBox id={ok.mengeRisiko} />
              </>
            )}
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <h3 className="font-display text-base font-extrabold">Warum?</h3>
            <ul className="mt-3 space-y-3">
              {ok.gruende.map((g) => {
                const { icon: Icon, farbe } = GRUND_STIL[g.art];
                const offenFlags = (g.risiken ?? []).map((_, i) => (g.risikoStufen?.[i] === "bad" ? offenZaehler.n++ < MAX_OFFEN : false));
                return (
                  <li key={g.id} className="flex gap-2.5 text-sm leading-relaxed">
                    <Icon aria-hidden className={`mt-0.5 size-5 shrink-0 ${farbe}`} />
                    <span className="min-w-0 flex-1">
                      <span className="sr-only">{g.titel}: </span>
                      {g.text}
                      {g.verhaeltnis != null && <Balken verhaeltnis={g.verhaeltnis} />}
                      {g.risiken?.map((rid, i) => <RisikoBox key={rid} id={rid} stufe={g.risikoStufen?.[i] ?? "warn"} offen={offenFlags[i] ?? false} />)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-4 space-y-1.5 text-sm text-muted">
            {ok.hinweise.map((h) => <p key={h.id}>{h.text}</p>)}
          </div>
          <FazitBox art={art} score={ok.score} />

          <details className="group mt-4 rounded-2xl border border-border bg-bg-soft p-3">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 text-sm font-bold">
              Rechenweg anzeigen
              <ChevronDown aria-hidden className="size-5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-3"><RechenwegZeilen r={ok} /></div>
          </details>
        </>
      )}

      {(ok || ergebnis?.status === "ergaenzung") && (
        <div className="mt-5 rounded-2xl border border-brand/30 bg-brand-soft p-4 text-sm">
          <p className="font-bold">{GUTE_WERTE}</p>
          <p className="mt-1"><strong>Was der Rechner nicht sieht:</strong> {NICHT_GEZEIGT_VORN} <Link href="/tests" className="font-semibold text-brand underline underline-offset-4">Futtertests</Link> nach unserer <Link href="/methodik" className="font-semibold text-brand underline underline-offset-4">Methodik</Link>.</p>
        </div>
      )}

      {ok && ctas}
    </section>
  );
}

/** Kurzfassung für die Live-Region. */
export const vorlesetext = (e: Ergebnis | null) =>
  e?.status === "ok" ? `Nährwert-Check ${e.score} von 100, ${NOTEN[e.note]}.${e.menge != null ? ` Tagesmenge ${n0(e.menge)} Gramm.` : ""}` : "";
