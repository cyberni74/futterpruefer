"use client";

import { Bone, Cat, Dog, Footprints, House, Mountain, Sofa, Trash2, Trees, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BEREICHE, hundKgAusPos, hundPosAusKg, hundGewichtPos } from "@/lib/futterrechner/bereiche";
import { berechne } from "@/lib/futterrechner";
import { decodeHash, encodeHash } from "@/lib/futterrechner/hash";
import {
  ALTER_MAX, alterAusPosition, alterText, lebensphase, positionAusAlter, startState,
  type FormState, type Lebensphase, type Werte,
} from "@/lib/futterrechner/state";
import { parseZahl, pruefe } from "@/lib/futterrechner/validierung";
import type { Art, ErgebnisOk } from "@/lib/futterrechner/types";
import { ChipGroup } from "./chip-group";
import { ErgebnisKarte, vorlesetext } from "./ergebnis-karte";
import { ErgebnisLeiste } from "./ergebnis-leiste";
import { Infografik1 } from "./infografiken/infografik-1";
import { ValueSlider, type Marker } from "./value-slider";

const Kroketten = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="9" r="3" /><circle cx="16" cy="9" r="3" /><circle cx="12" cy="16" r="3" /></svg>
);
const Dose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="6" rx="7" ry="2.5" /><path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" /><path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" /></svg>
);

const PHASEN: Record<Art, Array<{ value: Lebensphase; label: string; pos: number }>> = {
  hund: [
    { value: "welpe", label: "Welpe", pos: 9 },
    { value: "jung", label: "1–2 Jahre", pos: 45 },
    { value: "adult", label: "3–7 Jahre", pos: 49 },
    { value: "senior", label: "ab 8 Jahren", pos: 52 },
  ],
  katze: [
    { value: "kitten", label: "Kitten", pos: 3 },
    { value: "adult", label: "Erwachsen", pos: 13 },
    { value: "senior", label: "Senior (ab 11)", pos: 21 },
  ],
};

const eigen = (x: number | null, d: number) => x ?? d;

export type RechnerCtas = { trocken?: ReactNode; nass?: ReactNode };

export function Rechner({ art, ctas }: { art: Art; ctas?: RechnerCtas }) {
  const router = useRouter();
  const [s, setS] = useState<FormState>(() => startState(art));
  const bereit = useRef(false);
  const [geteilt, setGeteilt] = useState("");
  const [undo, setUndo] = useState<FormState | null>(null);
  const [vorlesen, setVorlesen] = useState("");
  /** Ergebnis erst nach Klick auf „Jetzt Futter analysieren“ (Zusatz Manni 27.10.) */
  const [analysiert, setAnalysiert] = useState(false);
  const [versucht, setVersucht] = useState(false);

  // Fragment lesen (Teilen-Link, Zurück-Taste, Deep-Link der Startseite)
  useEffect(() => {
    const lies = () => {
      const d = decodeHash(window.location.hash, art);
      if (d && d.art === art) {
        setS(d);
        if (pruefe(d).eingabe) setAnalysiert(true); // geteilter Link mit vollständigen Werten zeigt das Ergebnis
      }
    };
    lies();
    bereit.current = true;
    window.addEventListener("hashchange", lies);
    return () => window.removeEventListener("hashchange", lies);
  }, [art]);

  // Fragment schreiben, gedrosselt
  useEffect(() => {
    if (!bereit.current) return;
    const t = setTimeout(() => {
      const w = s.werte[s.futterart];
      const leer = Object.values(w).every((v) => v == null || typeof v === "string") && s.gewicht == null && s.alterPos == null;
      const url = `${window.location.pathname}${leer ? "" : `#${encodeHash(s)}`}`;
      window.history.replaceState(null, "", url);
    }, 300);
    return () => clearTimeout(t);
  }, [s]);

  const pr = useMemo(() => pruefe(s), [s]);
  const ergebnis = useMemo(() => (pr.eingabe ? berechne(pr.eingabe) : null), [pr]);

  // Vorlesen erst 600 ms nach der letzten Änderung
  const text = vorlesetext(ergebnis);
  useEffect(() => {
    const t = setTimeout(() => setVorlesen(text), 600);
    return () => clearTimeout(t);
  }, [text]);

  // Die Leiste darf die Ergebnis-Karte nie verdecken: Sie erscheint nur, solange die Karte nicht im Bild ist
  const [karteImBild, setKarteImBild] = useState(false);
  useEffect(() => {
    const el = document.getElementById("ergebnis");
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setKarteImBild(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const set = useCallback((patch: Partial<FormState>) => setS((x) => ({ ...x, ...patch })), []);
  const setWert = useCallback(
    (patch: Partial<Werte>) => setS((x) => ({ ...x, werte: { ...x.werte, [x.futterart]: { ...x.werte[x.futterart], ...patch } } })),
    [],
  );

  const w = s.werte[s.futterart];
  const B = BEREICHE[s.art][s.futterart];
  const alter = s.alterPos != null ? alterAusPosition(s.art, s.alterPos) : null;
  const phase = alter ? lebensphase(s.art, alter) : null;
  const ergaenzung = s.futterart === "snack" || s.typ === "ergaenzung";

  // FEDIAF-Marker: Mindestwert als % wie gefüttert, aus ME und Tierprofil zurückgerechnet (fehlende Werte mit Platzhaltern)
  const marker = useMemo(() => {
    if (ergaenzung || s.alterPos == null) return null;
    const fill = (v: number | null, d: number) => v ?? d;
    const w2: Werte = {
      ...w, p: fill(w.p, B.p.platzhalter), f: fill(w.f, B.f.platzhalter), fa: fill(w.fa, B.fa.platzhalter), a: fill(w.a, B.a.platzhalter),
      m: w.m ?? (s.futterart === "nass" ? B.m.platzhalter : null),
    };
    const s2: FormState = {
      ...s, werte: { ...s.werte, [s.futterart]: w2 }, gewicht: eigen(s.gewicht, 10), endgewicht: eigen(s.endgewicht, 30),
      hundAktiv: s.hundAktiv ?? "normal", katzeAktiv: s.katzeAktiv ?? "wohnung",
    };
    const e = pruefe(s2).eingabe;
    if (!e) return null;
    const r = berechne(e);
    if (r.status !== "ok") return null;
    const ok = r as ErgebnisOk;
    const f = (x: number) => new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(x);
    const p: Marker = { wert: (ok.mindest.p * ok.me) / 1000, label: `FEDIAF-Minimum ≈ ${f((ok.mindest.p * ok.me) / 1000)} %` };
    const fe: Marker = { wert: (ok.mindest.f * ok.me) / 1000, label: `FEDIAF-Minimum ≈ ${f((ok.mindest.f * ok.me) / 1000)} %` };
    return { p, f: fe };
  }, [s, w, B, ergaenzung]);

  const teilen = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${encodeHash(s)}`;
    try {
      if (navigator.share) await navigator.share({ title: "Futterrechner", url });
      else { await navigator.clipboard.writeText(url); setGeteilt("Link kopiert."); }
    } catch { /* abgebrochen */ }
    setTimeout(() => setGeteilt(""), 3000);
  };

  const zuruecksetzen = () => {
    setUndo(s);
    setAnalysiert(false);
    setVersucht(false);
    setS(startState(s.art, s.futterart));
    setTimeout(() => setUndo(null), 5000);
  };

  const wechselArt = (neu: Art) => {
    if (neu === s.art) return;
    const x: FormState = { ...startState(neu, s.futterart), werte: s.werte, typ: s.typ, gewicht: s.gewicht, kastriert: s.kastriert };
    router.push(`/futterrechner/${neu}#${encodeHash(x)}`);
  };

  const fehlt = pr.fehlend.length;
  const kannAnalysieren = pr.eingabe != null && !pr.fehler.summe;
  const zeigeFehlt = (label: string) => versucht && !analysiert && pr.fehlend.includes(label);
  const analysieren = () => {
    if (kannAnalysieren) {
      setAnalysiert(true);
      setVersucht(false);
      document.getElementById("ergebnis")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      return;
    }
    setVersucht(true);
    // erstes fehlendes Feld in der Reihenfolge des Formulars
    const reihenfolge = ["Gewicht", "Alter", "Endgewicht", "Aktivität", "Rohprotein", "Rohfett", "Rohfaser", "Rohasche", "Feuchte"];
    const ids: Record<string, string> = { Gewicht: "fld-gewicht", Alter: "fld-alter", Endgewicht: "fld-endgewicht", Aktivität: "fld-aktivitaet", Rohprotein: "fld-p", Rohfett: "fld-f", Rohfaser: "fld-fa", Rohasche: "fld-a", Feuchte: "fld-m" };
    const erstes = reihenfolge.find((l) => pr.fehlend.includes(l));
    setTimeout(() => {
      const ziel = erstes ? (erstes === "Aktivität" ? document.querySelector<HTMLElement>(`#${ids[erstes]} input`) : document.getElementById(`${ids[erstes]}-r`)) : document.querySelector<HTMLElement>("[aria-invalid=true]");
      ziel?.focus({ preventScroll: true });
      ziel?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    }, 0);
  };
  const tierName = s.art === "hund" ? "Hund" : "Katze";
  const gewichtSkala = s.art === "hund" ? { max: hundGewichtPos.max, zuPos: hundPosAusKg, vonPos: hundKgAusPos } : undefined;
  const ctaNode = ergebnis?.status === "ok" && s.futterart !== "snack" ? ctas?.[s.futterart] : null;
  const wertErsatz = (k: keyof Werte) => (w[k] as number | null);

  const feld = (k: "p" | "f" | "fa" | "a" | "m" | "ca" | "ph", label: string, hilfe?: string) => (
    <ValueSlider
      key={`${s.futterart}-${k}`} id={`fld-${k}`} fehlt={zeigeFehlt(label)} label={label} einheit="%" value={wertErsatz(k)} onChange={(v) => setWert({ [k]: v })}
      min={B[k].min} max={B[k].max} step={B[k].step} platzhalter={B[k].platzhalter}
      marker={k === "p" ? marker?.p : k === "f" ? marker?.f : null}
      fehler={pr.fehler[k]} warnung={pr.warnungen[k]} hilfe={hilfe}
      valueText={(v) => `${v} Prozent ${label}`}
    />
  );

  return (
    <div className="fp-raster -mx-4 rounded-3xl bg-bg-soft px-4 py-5 sm:mx-0 sm:px-6">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-start lg:gap-6">
        <div className="space-y-4">
          {/* Karte 1 */}
          <section aria-labelledby="k1" className="rounded-3xl bg-surface p-5 shadow-card">
            <Kopf nr={1} id="k1" titel={`Ihr${s.art === "hund" ? " Hund" : "e Katze"}`} />
            <div className="mt-4 space-y-4">
              <ChipGroup
                legend="Tierart" value={s.art} onChange={wechselArt}
                options={[{ value: "hund", label: "Hund", icon: <Dog /> }, { value: "katze", label: "Katze", icon: <Cat /> }]}
              />
              <ValueSlider
                id="fld-gewicht" fehlt={zeigeFehlt("Gewicht")} label="Gewicht" einheit="kg" value={s.gewicht} onChange={(v) => set({ gewicht: v })}
                min={s.art === "hund" ? 0.5 : 1} max={s.art === "hund" ? 80 : 10} step={s.art === "hund" ? 0.5 : 0.1}
                platzhalter={s.art === "hund" ? 15 : 4.5} skala={gewichtSkala}
                fehler={pr.fehler.gewicht} hilfe="Aktuelles Gewicht. Bei Übergewicht: Idealgewicht nehmen."
                valueText={(v) => `${v} Kilogramm`}
              />
              <ValueSlider
                id="fld-alter" fehlt={zeigeFehlt("Alter")} label="Alter" einheit="" value={s.alterPos} onChange={(v) => set({ alterPos: v == null ? null : Math.round(v) })}
                min={0} max={ALTER_MAX[s.art]} step={1} platzhalter={s.art === "hund" ? 49 : 13}
                textAnzeige={(p) => alterText(alterAusPosition(s.art, p))} valueText={(p) => alterText(alterAusPosition(s.art, p))}
              />
              {alter && (
                <ChipGroup
                  legend="Lebensphase" hideLegend cols={s.art === "hund" ? 2 : 3} value={phase}
                  onChange={(v) => { const o = PHASEN[s.art].find((x) => x.value === v); if (o) set({ alterPos: o.pos }); }}
                  options={PHASEN[s.art].map(({ value, label }) => ({ value, label }))}
                />
              )}
              {phase === "welpe" && (
                <ValueSlider
                  id="fld-endgewicht" fehlt={zeigeFehlt("Endgewicht")} label="Erwartetes Endgewicht" einheit="kg" value={s.endgewicht} onChange={(v) => set({ endgewicht: v })}
                  min={2} max={90} step={0.5} platzhalter={25} skala={{ max: hundGewichtPos.max, zuPos: hundPosAusKg, vonPos: hundKgAusPos }}
                  fehler={pr.fehler.endgewicht} hilfe="Rassestandard oder Schätzung der Tierarztpraxis."
                  valueText={(v) => `${v} Kilogramm Endgewicht`}
                />
              )}
              {phase && phase !== "welpe" && phase !== "kitten" && (
                <>
                  {s.art === "hund" ? (
                    <ChipGroup
                      legend="Aktivität" id="fld-aktivitaet" fehlt={zeigeFehlt("Aktivität")} tile cols={4} value={s.hundAktiv} onChange={(v) => set({ hundAktiv: v })}
                      options={[
                        { value: "wenig", label: "Wenig", icon: <Sofa />, hilfe: "unter 1 Std./Tag" },
                        { value: "normal", label: "Normal", icon: <Footprints />, hilfe: "1–2 Std./Tag" },
                        { value: "sportlich", label: "Sportlich", icon: <Zap />, hilfe: "1–3 Std. intensiv" },
                        { value: "arbeit", label: "Arbeitshund", icon: <Mountain />, hilfe: "3–6 Std./Tag" },
                      ]}
                    />
                  ) : (
                    <ChipGroup
                      legend="Aktivität" id="fld-aktivitaet" fehlt={zeigeFehlt("Aktivität")} tile cols={2} value={s.katzeAktiv} onChange={(v) => set({ katzeAktiv: v })}
                      options={[{ value: "wohnung", label: "Wohnung", icon: <House />, hilfe: "kein Freigang" }, { value: "freigang", label: "Freigang", icon: <Trees />, hilfe: "regelmäßig draußen" }]}
                    />
                  )}
                  <div>
                    <ChipGroup
                      legend="Kastriert" value={s.kastriert == null ? null : s.kastriert ? "ja" : "nein"} onChange={(v) => set({ kastriert: v === "ja" })}
                      options={[{ value: "ja", label: "Ja" }, { value: "nein", label: "Nein" }]}
                    />
                    {s.kastriert == null && <p className="mt-1 text-xs text-muted">Ohne Auswahl rechnen wir mit „nein“.</p>}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Karte 2 */}
          <section aria-labelledby="k2" className="rounded-3xl bg-surface p-5 shadow-card">
            <Kopf nr={2} id="k2" titel="Das Futter" />
            <div className="mt-4 space-y-4">
              <ChipGroup
                legend="Futterart" cols={3} value={s.futterart}
                onChange={(v) => set({ futterart: v, typ: v === "snack" ? "ergaenzung" : s.futterart === "snack" ? "alleinfutter" : s.typ })}
                options={[{ value: "trocken", label: "Trocken", icon: <Kroketten /> }, { value: "nass", label: "Nass", icon: <Dose /> }, { value: "snack", label: "Snack", icon: <Bone /> }]}
              />
              {s.futterart !== "snack" && (
                <div>
                  <ChipGroup
                    legend="Futtertyp" value={s.typ} onChange={(v) => set({ typ: v })}
                    options={[{ value: "alleinfutter", label: "Alleinfutter" }, { value: "ergaenzung", label: "Ergänzungsfutter" }]}
                  />
                  <p className="mt-1 text-xs text-muted">Steht vorn auf der Packung: „Alleinfuttermittel“ oder „Ergänzungsfuttermittel“.</p>
                </div>
              )}
              {s.futterart === "snack" && <p className="text-sm text-muted">Snacks und Ergänzungsfutter bekommen keine Note. Sie sehen die Energie und Ihr Leckerli-Budget.</p>}
            </div>
          </section>

          {/* Karte 3 */}
          <section aria-labelledby="k3" className="rounded-3xl bg-surface p-5 shadow-card">
            <Kopf nr={3} id="k3" titel="Analysewerte vom Etikett" />
            <details className="group mt-3 rounded-2xl bg-bg-soft p-3">
              <summary className="min-h-11 cursor-pointer list-none text-sm font-bold leading-[2.75rem]">Wo steht das? So lesen Sie das Etikett</summary>
              <div className="mt-2"><Infografik1 /></div>
              <p className="mt-2 text-sm">Mehr dazu: <Link href="/blog/futterdeklaration-richtig-lesen" className="font-semibold text-brand underline underline-offset-4">Futterdeklaration richtig lesen</Link>.</p>
            </details>
            <p className="mt-3 text-sm text-muted">Alle Werte in %, so wie auf der Packung („wie gefüttert“).</p>
            <div className="mt-2 divide-y divide-border">
              {feld("p", "Rohprotein")}
              {feld("f", "Rohfett")}
              {feld("fa", "Rohfaser")}
              {feld("a", "Rohasche", "Auch „Ascherückstand“ oder „anorganischer Stoff“.")}
              {feld("m", "Feuchte", s.futterart === "nass" ? "Pflichtangabe bei Nassfutter." : "Pflicht erst über 14 %. Fehlt sie, rechnen wir mit 10 %.")}
            </div>
            {!ergaenzung && <ZutatenFeld value={w.zutaten} onChange={(v) => setWert({ zutaten: v })} />}
            <details className="group mt-3 rounded-2xl border border-border p-3">
              <summary className="min-h-11 cursor-pointer list-none text-sm font-bold leading-[2.75rem]">Mehr Werte (genauer)</summary>
              <div className="mt-2 divide-y divide-border">
                {!ergaenzung && feld("ca", "Calcium", "Freiwillige Angabe, oft auf Anfrage beim Hersteller.")}
                {!ergaenzung && feld("ph", "Phosphor", "Freiwillige Angabe, oft auf Anfrage beim Hersteller.")}
                {s.art === "katze" && B.taurin && !ergaenzung && (
                  <ValueSlider
                    label="Taurin" einheit="mg/kg" value={w.taurin} onChange={(v) => setWert({ taurin: v })}
                    min={B.taurin.min} max={B.taurin.max} step={B.taurin.step} platzhalter={B.taurin.platzhalter}
                    fehler={pr.fehler.taurin} hilfe="Unter „Zusatzstoffe je kg“: die zugesetzte Menge, nicht der Gesamtgehalt."
                  />
                )}
                {ergaenzung && (
                  <ValueSlider
                    label="Gewicht pro Stück" einheit="g" value={w.stueck} onChange={(v) => setWert({ stueck: v })}
                    min={0.5} max={50} step={0.5} platzhalter={3} hilfe="Optional, für die Energie je Stück."
                  />
                )}
                <EnergieFeld w={w} onChange={setWert} fehler={pr.fehler.me} />
              </div>
            </details>
            {pr.fehler.summe && <p role="alert" className="mt-3 rounded-xl bg-bad-soft p-3 text-sm font-semibold text-bad">{pr.fehler.summe}</p>}
            <div className="mt-5">
              <button
                id="analysieren" type="button" onClick={analysieren}
                className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-accent px-6 text-lg font-extrabold text-white shadow-lift hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:text-black"
              >
                Jetzt Futter analysieren
              </button>
              <p role="status" className="mt-2 text-center text-sm font-bold text-accent">
                {versucht && !analysiert && fehlt > 0 ? `Bitte noch ${fehlt} ${fehlt === 1 ? "Angabe" : "Angaben"} ergänzen` : ""}
              </p>
            </div>
            <p className="mt-4 text-xs text-muted">Ihre Eingaben bleiben auf Ihrem Gerät. Wir speichern nichts.</p>
            <button type="button" onClick={zuruecksetzen} className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-muted underline underline-offset-4 hover:text-fg">
              <Trash2 aria-hidden className="size-4" /> Alle Werte löschen
            </button>
          </section>
        </div>

        <div className="mt-4 lg:sticky lg:top-24 lg:mt-0">
          <ErgebnisKarte
            titel={`Nährwert-Check ${tierName}`}
            ergebnis={pr.fehler.summe ? null : ergebnis} nochFehlt={pr.fehlend} fehlerText={pr.fehler.summe}
            analysiert={analysiert} bereit={kannAnalysieren} art={s.art}
            onTeilen={teilen} geteilt={geteilt || vorlesen} ctas={ctaNode}
          />
        </div>
      </div>

      <ErgebnisLeiste ergebnis={analysiert && !pr.fehler.summe ? ergebnis : null} nochFehlt={fehlt} bereit={kannAnalysieren} sichtbar={(fehlt < 5 || analysiert) && !karteImBild} />

      {undo && (
        <div role="status" className="fixed inset-x-3 bottom-[calc(7.5rem+env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-sm items-center justify-between gap-3 rounded-2xl bg-fg px-4 py-3 text-sm font-semibold text-bg shadow-lift md:bottom-20">
          Werte gelöscht.
          <button type="button" className="min-h-11 rounded-full px-3 font-bold underline" onClick={() => { setS(undo); setUndo(null); }}>Rückgängig</button>
        </div>
      )}
    </div>
  );
}

/** Optionales Feld „Erste Zutaten“: ändert nur den Kollagen-Abzug, wird nicht gespeichert und nicht in den Teilen-Link übernommen. */
function ZutatenFeld({ value, onChange }: { value: string | null; onChange: (v: string | null) => void }) {
  return (
    <div className="mt-4 py-1">
      <label htmlFor="zutaten-feld" className="text-sm font-bold">Erste Zutaten (optional)</label>
      <textarea
        id="zutaten-feld" rows={2} maxLength={600} value={value ?? ""} aria-describedby="zutaten-hilfe" autoComplete="off"
        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
        className="mt-1 w-full rounded-xl border border-border bg-bg-soft px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      />
      <p id="zutaten-hilfe" className="mt-1 text-xs text-muted">Die ersten Zutaten von der Packung, durch Komma getrennt. Wir prüfen die ersten fünf auf Bindegewebe-Rohstoffe.</p>
    </div>
  );
}

function Kopf({ nr, id, titel }: { nr: number; id: string; titel: string }) {
  return (
    <h2 id={id} className="flex items-center gap-3 font-display text-lg font-extrabold">
      <span aria-hidden className="grid size-8 place-items-center rounded-full bg-brand-soft text-sm font-extrabold text-brand">{nr}</span>
      {titel}
    </h2>
  );
}

function EnergieFeld({ w, onChange, fehler }: { w: Werte; onChange: (p: Partial<Werte>) => void; fehler?: string }) {
  const [t, setT] = useState(w.me == null ? "" : String(w.me).replace(".", ","));
  // Feld an Wert von außen angleichen (Zurücksetzen, Teilen-Link); Tippen setzt w.me selbst
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setT(w.me == null ? "" : String(w.me).replace(".", ",")); }, [w.me]);
  return (
    <div className="py-2">
      <label htmlFor="me-feld" className="text-sm font-bold">Energie laut Hersteller (optional)</label>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <input
          id="me-feld" type="text" inputMode="decimal" value={t} placeholder="z. B. 370" aria-invalid={fehler ? true : undefined}
          onChange={(e) => { setT(e.target.value); const n = parseZahl(e.target.value); if (!Number.isNaN(n)) onChange({ me: n }); }}
          className="font-display h-11 w-28 rounded-xl border border-border bg-bg-soft px-2 text-right text-xl font-bold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        />
        <ChipGroup
          legend="Einheit" hideLegend cols={3} value={w.meEinheit} onChange={(v) => onChange({ meEinheit: v })}
          options={[{ value: "kcal100g", label: "kcal/100 g" }, { value: "kcalkg", label: "kcal/kg" }, { value: "mjkg", label: "MJ/kg" }]}
        />
      </div>
      <p className="mt-1 text-xs text-muted">Wenn angegeben, hat sie Vorrang vor unserer Schätzung.</p>
      {fehler && <p role="alert" className="mt-1 text-xs font-semibold text-bad">{fehler}</p>}
    </div>
  );
}
