"use client";
import { ArrowDown, ArrowUp, Download, Plus, Trash2, Upload } from "lucide-react";
import { useId, useRef, useState, type ReactNode } from "react";
import { AMAZON_TAG, KRITERIEN_ANZAHL, parseLayoutData, pruefeVorVeroeffentlichung, type Bewertungsart } from "@/components/testvorlage-v2/schema";
import {
  VORLAGE_LABEL, draftToLayoutData, draftTotal, exportLayoutJson, importLayoutJson, kriterienVorlage, neuerSchluessel, type Draft,
} from "@/lib/admin/testvorlage-form";
import { RichEditor } from "./rich-editor";
import { Field, Section, btnSecondary, inputCls, textareaCls } from "./ui";

type K = { _k: string };

/** Wiederholbare Zeilen mit Hinzufügen, Entfernen und Verschieben. */
function Repeater<T extends K>({ items, onChange, neu, titel, addLabel, max = 40, children }: {
  items: T[]; onChange: (items: T[]) => void; neu: () => Omit<T, "_k">; titel: (item: T, i: number) => string; addLabel: string; max?: number;
  children: (item: T, update: (patch: Partial<T>) => void, i: number) => ReactNode;
}) {
  const set = (i: number, patch: Partial<T>) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const copy = [...items];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  };
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <fieldset key={it._k} className="rounded-xl border border-border p-3">
          <legend className="px-1 text-sm font-bold">{titel(it, i)}</legend>
          <div className="space-y-3">{children(it, (p) => set(i, p), i)}</div>
          <div className="mt-3 flex flex-wrap gap-1">
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Nach oben" className="inline-flex size-11 items-center justify-center rounded-lg border border-border hover:bg-bg-soft disabled:opacity-40"><ArrowUp className="size-4" aria-hidden /></button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Nach unten" className="inline-flex size-11 items-center justify-center rounded-lg border border-border hover:bg-bg-soft disabled:opacity-40"><ArrowDown className="size-4" aria-hidden /></button>
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label="Entfernen" className="inline-flex size-11 items-center justify-center rounded-lg border border-bad/40 text-bad hover:bg-bad-soft"><Trash2 className="size-4" aria-hidden /></button>
          </div>
        </fieldset>
      ))}
      {items.length < max && (
        <button type="button" onClick={() => onChange([...items, { _k: neuerSchluessel(), ...neu() } as T])} className={btnSecondary}>
          <Plus className="size-4" aria-hidden /> {addLabel}
        </button>
      )}
    </div>
  );
}

function Txt({ label, value, onChange, hint, rows, max = 300, placeholder, mono }: { label: string; value: string; onChange: (v: string) => void; hint?: ReactNode; rows?: number; max?: number; placeholder?: string; mono?: boolean }) {
  const id = useId();
  return (
    <Field id={id} label={label} hint={hint}>
      {rows ? (
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={rows} maxLength={max} placeholder={placeholder} className={textareaCls} />
      ) : (
        <input id={id} value={value} onChange={(e) => onChange(e.target.value)} maxLength={max} placeholder={placeholder} className={`${inputCls} ${mono ? "font-mono text-sm" : ""}`} />
      )}
    </Field>
  );
}

function Lines({ label, items, onChange, min = 2, max = 8 }: { label: string; items: string[]; onChange: (v: string[]) => void; min?: number; max?: number }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{label}</p>
      {items.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input value={v} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} aria-label={`${label} ${i + 1}`} maxLength={300} className={inputCls} />
          {items.length > min && <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label={`${label} ${i + 1} entfernen`} className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-border hover:bg-bg-soft"><Trash2 className="size-4" aria-hidden /></button>}
        </div>
      ))}
      {items.length < max && <button type="button" onClick={() => onChange([...items, ""])} className={btnSecondary}><Plus className="size-4" aria-hidden /> Hinzufügen</button>}
    </div>
  );
}

/** Eingabemaske für die Testvorlage V2. Erzeugt layoutData (JSON), kein HTML von Hand. */
export function TestvorlageEditor({ draft, onChange, bewertungsart, errors }: { draft: Draft; onChange: (d: Draft) => void; bewertungsart: Bewertungsart; errors: Record<string, string> }) {
  const set = <K2 extends keyof Draft>(key: K2, value: Draft[K2]) => onChange({ ...draft, [key]: value });
  const total = draftTotal(draft);
  const fileRef = useRef<HTMLInputElement>(null);
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const parsed = parseLayoutData(draftToLayoutData(draft));
  const issues = parsed.ok
    ? pruefeVorVeroeffentlichung(parsed.data, { bewertungsart, totalScore: total }).map((i) => i.message)
    : parsed.error.split("; ");

  const exportieren = () => {
    const blob = new Blob([exportLayoutJson(draft)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vorlage-daten.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const importieren = async (file: File | undefined) => {
    if (!file) return;
    const r = importLayoutJson(await file.text());
    if (r.ok) {
      onChange(r.draft);
      setImportMsg({ ok: true, text: `„${file.name}“ eingelesen. Bitte die Werte unten prüfen und speichern.` });
    } else setImportMsg({ ok: false, text: r.error });
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <Section title="Testvorlage V2: Import und Export" id="sec-v2-io" description="Die Redaktion liefert vorlage-daten.json. Import füllt alle Bereiche, Export lädt den aktuellen Stand als JSON.">
        <div className="flex flex-wrap gap-2">
          <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" id="v2-import" onChange={(e) => importieren(e.target.files?.[0])} />
          <label htmlFor="v2-import" className={`${btnSecondary} cursor-pointer`}><Upload className="size-4" aria-hidden /> JSON importieren</label>
          <button type="button" onClick={exportieren} className={btnSecondary}><Download className="size-4" aria-hidden /> JSON exportieren</button>
        </div>
        {importMsg && <p role={importMsg.ok ? "status" : "alert"} className={`whitespace-pre-line text-sm font-medium ${importMsg.ok ? "text-good" : "text-bad"}`}>{importMsg.text}</p>}
      </Section>

      <Section title="Hero" id="sec-v2-hero" description="Die Überschrift (H1) kommt aus dem Titel des Tests. Die Gesamtpunktzahl wird aus den Kriterien berechnet.">
        <Txt label="Titel (Zeile über dem Untertitel)" value={draft.hero.titel} onChange={(v) => set("hero", { ...draft.hero, titel: v })} />
        <Txt label="Untertitel" value={draft.hero.untertitel} onChange={(v) => set("hero", { ...draft.hero, untertitel: v })} rows={2} max={2000} />
        <Lines label="Tags" items={draft.hero.tags} onChange={(v) => set("hero", { ...draft.hero, tags: v })} min={0} max={12} />
        <Txt label="Gesamturteil-Text" value={draft.hero.gesamturteil} onChange={(v) => set("hero", { ...draft.hero, gesamturteil: v })} rows={3} max={2000} hint="Erscheint unter dem Haupttacho und als Kurzfazit im Schema." />
        <Txt label="Notenwort (optional)" value={draft.hero.notenwort} onChange={(v) => set("hero", { ...draft.hero, notenwort: v })} hint="Leer = Empfehlenswert / Mit Abstrichen / Rot – keine Empfehlung nach Ampel." />
        <div className="flex items-center justify-between rounded-xl bg-brand-soft px-4 py-3" aria-live="polite">
          <span className="font-semibold">Gesamtpunktzahl (berechnet)</span>
          <span className="font-display text-2xl font-extrabold tabular-nums text-brand">{total}</span>
        </div>
        {errors.layoutData && <p role="alert" className="whitespace-pre-line text-sm font-medium text-bad">{errors.layoutData}</p>}
      </Section>

      <Section title="Kennzahl-Kacheln" id="sec-v2-kennzahlen">
        <Repeater items={draft.kennzahlen} onChange={(v) => set("kennzahlen", v)} neu={() => ({ wert: "", label: "", sub: "" })} titel={(x, i) => `Kachel ${i + 1}`} addLabel="Kachel hinzufügen" max={8}>
          {(x, up) => (<><Txt label="Kennzahl" value={x.wert} onChange={(v) => up({ wert: v })} /><Txt label="Beschriftung" value={x.label} onChange={(v) => up({ label: v })} /><Txt label="Unterzeile (optional)" value={x.sub} onChange={(v) => up({ sub: v })} /></>)}
        </Repeater>
      </Section>

      <Section title="Kriterien" id="sec-v2-kriterien" description={`${bewertungsart === "ERGAENZUNGSFUTTER" ? "Ergänzungsfutter: 5" : "Alleinfutter: 6"} Kriterien, jedes mit eigenem Maximum. Die Summe der Punkte ist die Gesamtwertung.`}>
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(VORLAGE_LABEL) as Bewertungsart[]).map((art) => (
            <button key={art} type="button" className={btnSecondary} onClick={() => { if (draft.kriterien.length === 0 || window.confirm("Die Kriterien durch die Vorauswahl ersetzen? Eingetragene Texte gehen verloren.")) set("kriterien", kriterienVorlage(art)); }}>
              Vorauswahl: {VORLAGE_LABEL[art]}
            </button>
          ))}
        </div>
        {draft.kriterien.length !== KRITERIEN_ANZAHL[bewertungsart] && draft.kriterien.length > 0 && (
          <p className="text-sm font-medium text-mid">Diese Art braucht {KRITERIEN_ANZAHL[bewertungsart]} Kriterien (aktuell {draft.kriterien.length}).</p>
        )}
        <Repeater items={draft.kriterien} onChange={(v) => set("kriterien", v)} neu={() => ({ name: "", punkte: "", max: "", kurz: "", begruendung: "" })} titel={(x, i) => `Kriterium ${i + 1}${x.name ? `: ${x.name}` : ""}`} addLabel="Kriterium hinzufügen" max={6}>
          {(x, up) => (
            <>
              <Txt label="Name" value={x.name} onChange={(v) => up({ name: v })} />
              <div className="grid grid-cols-2 gap-3">
                <Txt label="Punkte" value={x.punkte} onChange={(v) => up({ punkte: v })} />
                <Txt label="Maximum" value={x.max} onChange={(v) => up({ max: v })} />
              </div>
              <Txt label="Kurzbewertung" value={x.kurz} onChange={(v) => up({ kurz: v })} rows={2} max={400} />
              <Txt label="Ausführliche Begründung" value={x.begruendung} onChange={(v) => up({ begruendung: v })} rows={4} max={4000} />
            </>
          )}
        </Repeater>
      </Section>

      <Section title="Kapitel" id="sec-v2-kapitel" description="Kapitel 01 bis NN: Überschrift und Rich-Text. Die Nummerierung entsteht automatisch.">
        <Repeater items={draft.kapitel} onChange={(v) => set("kapitel", v)} neu={() => ({ titel: "", html: "" })} titel={(x, i) => `Kapitel ${String(i + 1).padStart(2, "0")}${x.titel ? `: ${x.titel}` : ""}`} addLabel="Kapitel hinzufügen" max={30}>
          {(x, up, i) => (<><Txt label="Überschrift" value={x.titel} onChange={(v) => up({ titel: v })} /><RichEditor name={`kapitel-${i}-html`} id={`kapitel-${x._k}`} label="Text" initialHtml={x.html} onChange={(h) => up({ html: h })} /></>)}
        </Repeater>
      </Section>

      <Section title="Zutaten" id="sec-v2-zutaten" description="Erscheinen als aufklappbare Liste.">
        <Repeater items={draft.zutaten} onChange={(v) => set("zutaten", v)} neu={() => ({ name: "", menge: "", funktion: "", bewertung: "" })} titel={(x, i) => `Zutat ${i + 1}${x.name ? `: ${x.name}` : ""}`} addLabel="Zutat hinzufügen" max={60}>
          {(x, up) => (<><Txt label="Name" value={x.name} onChange={(v) => up({ name: v })} /><Txt label="Menge" value={x.menge} onChange={(v) => up({ menge: v })} /><Txt label="Funktion" value={x.funktion} onChange={(v) => up({ funktion: v })} rows={2} max={2000} /><Txt label="Bewertung" value={x.bewertung} onChange={(v) => up({ bewertung: v })} rows={2} max={2000} /></>)}
        </Repeater>
      </Section>

      <Section title="Nährwerte und Dosierung" id="sec-v2-analyse" description="Zwei Tabellen: analytische Bestandteile und Dosierung.">
        <Repeater items={draft.analysewerte} onChange={(v) => set("analysewerte", v)} neu={() => ({ name: "", wert: "", hinweis: "" })} titel={(x, i) => `Nährwert ${i + 1}${x.name ? `: ${x.name}` : ""}`} addLabel="Nährwert hinzufügen" max={40}>
          {(x, up) => (<><Txt label="Bezeichnung" value={x.name} onChange={(v) => up({ name: v })} /><Txt label="Gehalt (mit Einheit)" value={x.wert} onChange={(v) => up({ wert: v })} /><Txt label="Hinweis (optional)" value={x.hinweis} onChange={(v) => up({ hinweis: v })} max={500} /></>)}
        </Repeater>
        <div className="grid gap-3 sm:grid-cols-2">
          <Txt label="Dosierung: Spaltenkopf links" value={draft.dosierung.kopf1} onChange={(v) => set("dosierung", { ...draft.dosierung, kopf1: v })} placeholder="Körpergewicht" />
          <Txt label="Dosierung: Spaltenkopf rechts" value={draft.dosierung.kopf2} onChange={(v) => set("dosierung", { ...draft.dosierung, kopf2: v })} placeholder="Tagesdosis" />
        </div>
        <Repeater items={draft.dosierung.zeilen} onChange={(v) => set("dosierung", { ...draft.dosierung, zeilen: v })} neu={() => ({ label: "", wert: "" })} titel={(x, i) => `Dosierung ${i + 1}`} addLabel="Dosierungszeile hinzufügen" max={30}>
          {(x, up) => (<div className="grid gap-3 sm:grid-cols-2"><Txt label="Körpergewicht o. Ä." value={x.label} onChange={(v) => up({ label: v })} /><Txt label="Menge" value={x.wert} onChange={(v) => up({ wert: v })} /></div>)}
        </Repeater>
      </Section>

      <Section title="Evidenz-Karten" id="sec-v2-evidenz">
        <Repeater items={draft.evidenz} onChange={(v) => set("evidenz", v)} neu={() => ({ aussage: "", status: "PLAUSIBEL" as const, quelle: "" })} titel={(x, i) => `Evidenz ${i + 1}`} addLabel="Evidenz-Karte hinzufügen" max={30}>
          {(x, up) => {
            return (
              <>
                <Txt label="Aussage" value={x.aussage} onChange={(v) => up({ aussage: v })} />
                <div>
                  <label className="mb-1.5 block text-sm font-semibold" htmlFor={`ev-${x._k}`}>Einstufung</label>
                  <select id={`ev-${x._k}`} value={x.status} onChange={(e) => up({ status: e.target.value as typeof x.status })} className={inputCls}>
                    <option value="BELEGT">BELEGT</option>
                    <option value="PLAUSIBEL">PLAUSIBEL</option>
                    <option value="NICHT_VERIFIZIERT">NICHT VERIFIZIERT</option>
                  </select>
                </div>
                <Txt label="Quelle" value={x.quelle} onChange={(v) => up({ quelle: v })} max={1000} />
              </>
            );
          }}
        </Repeater>
      </Section>

      <Section title="Herstellerangaben mit Balken" id="sec-v2-hersteller">
        <Repeater items={draft.herstellerangaben} onChange={(v) => set("herstellerangaben", v)} neu={() => ({ label: "", prozent: "" })} titel={(x, i) => `Angabe ${i + 1}`} addLabel="Angabe hinzufügen" max={20}>
          {(x, up) => (<div className="grid gap-3 sm:grid-cols-[1fr_8rem]"><Txt label="Angabe" value={x.label} onChange={(v) => up({ label: v })} /><Txt label="Anteil in %" value={x.prozent} onChange={(v) => up({ prozent: v })} /></div>)}
        </Repeater>
      </Section>

      <Section title="Preisrechner" id="sec-v2-preis" description="Der Besucher gibt Körpergewicht und Zeitraum ein. Preis, Inhalt und Dosis legen Sie hier fest.">
        <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={draft.preisrechner.aktiv} onChange={(e) => set("preisrechner", { ...draft.preisrechner, aktiv: e.target.checked })} className="size-5" /> Preisrechner anzeigen
        </label>
        {draft.preisrechner.aktiv && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Txt label="Preis je Packung (€)" value={draft.preisrechner.preis} onChange={(v) => set("preisrechner", { ...draft.preisrechner, preis: v })} />
            <Txt label="Inhalt je Packung" value={draft.preisrechner.inhalt} onChange={(v) => set("preisrechner", { ...draft.preisrechner, inhalt: v })} />
            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="pr-einheit">Einheit des Inhalts</label>
              <select id="pr-einheit" value={draft.preisrechner.einheit} onChange={(e) => set("preisrechner", { ...draft.preisrechner, einheit: e.target.value as Draft["preisrechner"]["einheit"] })} className={inputCls}>
                <option value="STUECK">Stück</option>
                <option value="GRAMM">Gramm</option>
                <option value="KILOGRAMM">Kilogramm</option>
              </select>
            </div>
            <Txt label="Tagesdosis je kg Körpergewicht (in dieser Einheit)" value={draft.preisrechner.dosisProKg} onChange={(v) => set("preisrechner", { ...draft.preisrechner, dosisProKg: v })} />
            <Txt label="Voreingestelltes Körpergewicht (kg)" value={draft.preisrechner.koerpergewicht} onChange={(v) => set("preisrechner", { ...draft.preisrechner, koerpergewicht: v })} />
            <Txt label="Voreingestellter Zeitraum (Tage)" value={draft.preisrechner.tage} onChange={(v) => set("preisrechner", { ...draft.preisrechner, tage: v })} />
          </div>
        )}
      </Section>

      <Section title="Sicherheit, Vor- und Nachteile" id="sec-v2-sicherheit">
        <div>
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="si-stufe">Sicherheitsstufe</label>
          <select id="si-stufe" value={draft.sicherheit.stufe} onChange={(e) => set("sicherheit", { ...draft.sicherheit, stufe: e.target.value as Draft["sicherheit"]["stufe"] })} className={inputCls}>
            <option value="OK">Unbedenklich</option>
            <option value="HINWEIS">Hinweis</option>
            <option value="KRITISCH">Kritisch</option>
          </select>
        </div>
        <Txt label="Überschrift der Hervorhebung (optional)" value={draft.sicherheit.titel} onChange={(v) => set("sicherheit", { ...draft.sicherheit, titel: v })} />
        <Txt label="Sicherheitsbewertung" value={draft.sicherheit.text} onChange={(v) => set("sicherheit", { ...draft.sicherheit, text: v })} rows={4} max={4000} />
        <Lines label="Vorteile" items={draft.pros} onChange={(v) => set("pros", v)} />
        <Lines label="Nachteile" items={draft.cons} onChange={(v) => set("cons", v)} />
      </Section>

      <Section title="Fazit (Pollmer-Stil)" id="sec-v2-fazit">
        <Txt label="Überschrift (optional)" value={draft.fazit.titel} onChange={(v) => set("fazit", { ...draft.fazit, titel: v })} />
        <RichEditor name="v2-fazit" id="v2-fazit" label="Fazit" initialHtml={draft.fazit.html} onChange={(h) => set("fazit", { ...draft.fazit, html: h })} />
      </Section>

      <Section title="FAQ" id="sec-v2-faq" description="Die Fragen erscheinen sichtbar und als FAQ-Schema, 1:1.">
        <Repeater items={draft.faq} onChange={(v) => set("faq", v)} neu={() => ({ frage: "", antwort: "" })} titel={(x, i) => `Frage ${i + 1}`} addLabel="Frage hinzufügen" max={40}>
          {(x, up) => (<><Txt label="Frage" value={x.frage} onChange={(v) => up({ frage: v })} /><Txt label="Antwort" value={x.antwort} onChange={(v) => up({ antwort: v })} rows={3} max={4000} /></>)}
        </Repeater>
      </Section>

      <Section title="Quellen" id="sec-v2-quellen">
        <Repeater items={draft.quellen} onChange={(v) => set("quellen", v)} neu={() => ({ titel: "", doi: "", url: "", hinweis: "" })} titel={(x, i) => `Quelle ${i + 1}`} addLabel="Quelle hinzufügen" max={60}>
          {(x, up) => (<><Txt label="Titel und Angaben" value={x.titel} onChange={(v) => up({ titel: v })} /><div className="grid gap-3 sm:grid-cols-2"><Txt label="DOI (z. B. 10.1000/xyz)" value={x.doi} onChange={(v) => up({ doi: v })} mono /><Txt label="URL (https://…)" value={x.url} onChange={(v) => up({ url: v })} mono /></div><Txt label="Hinweis (optional)" value={x.hinweis} onChange={(v) => up({ hinweis: v })} max={1000} /></>)}
        </Repeater>
        <Txt label="Prüfstand" value={draft.pruefstand} onChange={(v) => set("pruefstand", v)} rows={2} max={2000} />
        <Txt label="Methodik-Hinweis" value={draft.methodikHinweis} onChange={(v) => set("methodikHinweis", v)} rows={2} max={2000} />
      </Section>

      <Section title="Kauflink, Bildnachweis, ähnliche Tests" id="sec-v2-links">
        <Txt label="Amazon-ASIN" value={draft.asin} onChange={(v) => set("asin", v.toUpperCase())} max={10} mono hint={`Daraus entsteht der Button mit tag=${AMAZON_TAG} und dem Affiliate-Hinweis. Ohne ASIN kein Button.`} />
        <Txt label="Bildnachweis" value={draft.bildnachweis} onChange={(v) => set("bildnachweis", v)} max={500} hint="Erscheint unter den Produktbildern. Die Bilder selbst laden Sie oben bei „Produktbilder“ hoch." />
        <Lines label="Ähnliche Tests (Slug des Tests)" items={draft.aehnlicheTests} onChange={(v) => set("aehnlicheTests", v)} min={0} max={6} />
        <p className="text-xs text-muted">Leer = automatische Auswahl aus derselben Kategorie.</p>
      </Section>

      <Section title="Prüfung vor dem Veröffentlichen" id="sec-v2-pruefung" description="Dieselben Regeln gelten beim Speichern als „Veröffentlicht“. Entwürfe lassen sich immer speichern.">
        {issues.length === 0 ? (
          <p role="status" className="text-sm font-semibold text-good">Alles in Ordnung: Pflichtfelder, Summe, Amazon-Link und Sperrliste.</p>
        ) : (
          <ul role="status" className="list-disc space-y-1 pl-5 text-sm text-bad">{issues.map((m) => <li key={m}>{m}</li>)}</ul>
        )}
      </Section>
    </div>
  );
}
