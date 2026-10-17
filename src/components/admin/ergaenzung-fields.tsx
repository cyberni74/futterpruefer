"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  EF_FIELDS,
  EF_METHODIK_VERSION,
  EINHEIT_LABEL,
  EVIDENZ_LABEL,
  TIERART_LABEL,
  TRAEGER_ABZUEGE,
  dosisAnteilProzent,
  gewichtFuerTier,
  suggestAuswahl,
  traegerVorschlag,
  type EfEvidenz,
  type EfRichtung,
  type EfTierart,
  type Zieltier,
} from "@/lib/ergaenzung";
import { draftsToInputs, type EfFormState, type StudieDraft, type WirkstoffDraft } from "@/lib/admin/ergaenzung-form";
import { Field, describe, inputCls, textareaCls } from "./ui";

const reasonOf = Object.fromEntries(EF_FIELDS.map((f) => [f.key, f.begruendung])) as Record<(typeof EF_FIELDS)[number]["key"], string>;
const stateOf = {
  auswahl: "auswahl",
  dosierung: "dosierung",
  werbung: "werbung",
  traeger: "traeger",
  mengen: "mengen",
  unterlagen: "unterlagen",
} as const;
const reasonState = {
  auswahl: "auswahlBegruendung",
  dosierung: "dosierungBegruendung",
  werbung: "werbungBegruendung",
  traeger: "traegerBegruendung",
  mengen: "mengenBegruendung",
  unterlagen: "unterlagenBegruendung",
} as const;

export type ReferenzOption = {
  id: string;
  wirkstoff: string;
  tierart: Zieltier;
  mgProKgMin: number | null;
  einheit: string;
  quelle: string;
  luecke: boolean;
  hinweis: string;
};

const newKey = () => (globalThis.crypto?.randomUUID?.() ?? `k-${Date.now()}-${Math.random().toString(16).slice(2)}`);

const emptyStudie = (wirkstoffKey: string): StudieDraft => ({
  key: newKey(),
  wirkstoffKey,
  titel: "",
  autoren: "",
  jahr: "",
  zeitschrift: "",
  tierart: "HUND",
  dosis: "",
  einheit: "",
  original: "",
  ergebnis: "",
  link: "",
  freigabe: false,
  evidenz: "RCT",
  richtung: "POSITIV",
  geprueftAm: new Date().toISOString().slice(0, 10),
});

export function BewertungsartSwitch({
  value,
  onChange,
  categorySlug,
  published,
}: {
  value: "ALLEINFUTTER" | "ERGAENZUNGSFUTTER";
  onChange: (next: "ALLEINFUTTER" | "ERGAENZUNGSFUTTER") => void;
  categorySlug: string;
  published: boolean;
}) {
  const choose = (next: "ALLEINFUTTER" | "ERGAENZUNGSFUTTER") => {
    if (next === value) return;
    if (published && !window.confirm("Die Gesamtnote wird neu berechnet.")) return;
    onChange(next);
  };
  const hinweis = categorySlug.startsWith("ergaenzungsfuttermittel") && value === "ALLEINFUTTER";
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-card">
      <div role="tablist" aria-label="Bewertungsart" className="grid gap-1 rounded-xl bg-bg-soft p-1 sm:grid-cols-2">
        {(
          [
            ["ALLEINFUTTER", "Alleinfutter (Ernährung)"],
            ["ERGAENZUNGSFUTTER", "Ergänzungsfutter"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={value === id}
            onClick={() => choose(id)}
            className={`min-h-11 rounded-lg px-3 text-sm font-semibold ${value === id ? "bg-surface text-fg shadow-card" : "text-muted"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <input type="hidden" name="bewertungsart" value={value} />
      <p className="mt-3 text-sm text-muted">
        Methodik-Version: {value === "ERGAENZUNGSFUTTER" ? EF_METHODIK_VERSION : "Alleinfutter"}
        {" · "}
        <Link href="/methodik" className="font-semibold text-brand underline">
          Methodik Alleinfutter
        </Link>
        {value === "ERGAENZUNGSFUTTER" ? (
          <>
            {". "}
            <Link href="/methodik/ergaenzungsfutter" className="font-semibold text-brand underline">Methodik Ergänzungsfutter</Link>
            .
          </>
        ) : "."}
      </p>
      {hinweis && (
        <p className="mt-2 text-sm font-medium text-mid">Hinweis: Diese Kategorie ist Ergänzungsfuttermittel. Die Bewertungsart stellt sich nicht automatisch um.</p>
      )}
    </div>
  );
}

export function ErgaenzungFields({
  value,
  onChange,
  errors,
  referenzen,
  tierart,
}: {
  value: EfFormState;
  onChange: (next: EfFormState) => void;
  errors: Record<string, string | undefined>;
  referenzen: ReferenzOption[];
  tierart: Zieltier;
}) {
  const [dirtyDose, setDirtyDose] = useState(false);
  const [vorlage, setVorlage] = useState(referenzen[0]?.id ?? "");
  const set = (patch: Partial<EfFormState>) => onChange({ ...value, ...patch });
  const { wirkstoffe, studien } = draftsToInputs(value);
  const haupt = wirkstoffe[0];
  const anteil = dosisAnteilProzent(haupt?.mengeMgProTagesdosis ?? null, haupt?.referenzMgProKg ?? null, gewichtFuerTier(tierart));
  const vorschlag = suggestAuswahl(studien, tierart, haupt?.key);
  const traegerPunkte = traegerVorschlag(value.traegerAbzuege);

  useEffect(() => {
    if (!dirtyDose || anteil == null || anteil >= 25 || value.alibi) return;
    onChange({ ...value, alibi: true, dosierung: "0" });
    // Nur wenn sich die gerechnete Dosis ändert. Das manuelle Abwählen bleibt, bis die Menge erneut wechselt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anteil, dirtyDose]);

  const payload = JSON.stringify({ wirkstoffe: value.wirkstoffe, studien: value.studien });

  return (
    <div className="space-y-6">
      <input type="hidden" name="efPayload" value={payload} />
      <section className="rounded-2xl border border-border bg-surface p-4 shadow-card md:p-6" aria-labelledby="sec-ef">
        <h2 id="sec-ef" className="text-lg font-bold">Ergänzungsfutter-Bewertung</h2>
        <p className="mt-1 text-sm text-muted">Wirkstoff 50, Werbeaussagen 20, Träger 15, Transparenz 15. Die Gesamtnote und die Deckel rechnet der Server.</p>
        <div className="mt-4 space-y-5">
          {EF_FIELDS.map((field) => {
            const stateKey = stateOf[field.key];
            const reasonKey = reasonState[field.key];
            const current = String(value[stateKey]);
            const n = Number(current);
            const below = Number.isInteger(n) && n < field.max;
            return (
              <div key={field.key}>
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor={field.column} className="text-sm font-semibold">
                    {field.label} <span className="font-normal text-muted">(0–{field.max})</span>
                  </label>
                  <input
                    id={field.column}
                    name={field.column}
                    type="number"
                    min={0}
                    max={field.max}
                    step={1}
                    value={current}
                    onChange={(e) => {
                      if (field.key === "dosierung") setDirtyDose(true);
                      set({ [stateKey]: e.target.value });
                    }}
                    className={`${inputCls.replace("w-full", "")} w-24 text-right tabular-nums`}
                    {...describe(field.column, errors[field.column])}
                  />
                </div>
                {errors[field.column] && <p id={`${field.column}-error`} className="mt-1 text-sm font-medium text-bad">{errors[field.column]}</p>}
                <Field id={reasonOf[field.key]} label={`Begründung${below ? " *" : ""}`} error={errors[reasonOf[field.key]]}>
                  <textarea
                    id={reasonOf[field.key]}
                    name={reasonOf[field.key]}
                    value={String(value[reasonKey])}
                    onChange={(e) => set({ [reasonKey]: e.target.value })}
                    rows={2}
                    maxLength={2000}
                    className={textareaCls}
                    {...describe(reasonOf[field.key], errors[reasonOf[field.key]])}
                  />
                </Field>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-muted">Auswahl-Vorschlag: {vorschlag.hinweis}</p>
        {anteil != null && (
          <p className="mt-1 text-sm text-muted">
            Dosisanteil für {tierart === "KATZE" ? "eine Katze mit 4 kg" : "einen Hund mit 10 kg"}: {Math.round(anteil)} % der Referenz
            {anteil < 25 ? " – unter 25 % wird die Alibi-Dosierung vorbelegt." : "."}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4 shadow-card md:p-6" aria-labelledby="sec-ef-regeln">
        <h2 id="sec-ef-regeln" className="text-lg font-bold">Regeln ohne Punkte</h2>
        <div className="mt-4 space-y-4">
          <label className="flex min-h-11 items-center gap-3 text-sm font-semibold">
            <input type="checkbox" name="efAlibiDosierung" value="true" checked={value.alibi} onChange={(e) => set({ alibi: e.target.checked, dosierung: e.target.checked ? "0" : value.dosierung })} />
            Alibi-Dosierung (Dosierung wird 0, Gesamtnote höchstens 59)
          </label>
          <label className="flex min-h-11 items-center gap-3 text-sm font-semibold">
            <input type="checkbox" name="efKeineReferenzdosis" value="true" checked={value.keineReferenz} onChange={(e) => set({ keineReferenz: e.target.checked })} />
            Keine belegte Referenzdosis (Dosierung höchstens 10)
          </label>
          <label className="flex min-h-11 items-center gap-3 text-sm font-semibold">
            <input type="checkbox" name="efHeilaussage" value="true" checked={value.heilaussage} onChange={(e) => set({ heilaussage: e.target.checked })} />
            Heilaussage (Gesamtnote höchstens 79)
          </label>
          <Field id="efSicherheit" label="Sicherheit" error={errors.efSicherheit}>
            <select id="efSicherheit" name="efSicherheit" value={value.sicherheit} onChange={(e) => set({ sicherheit: e.target.value as EfFormState["sicherheit"] })} className={inputCls}>
              <option value="OK">OK</option>
              <option value="MITTEL">mittel (Warnsignal, höchstens 59)</option>
              <option value="SCHWER">schwer (Warnsignal, höchstens 39)</option>
            </select>
          </Field>
          <Field id="efSicherheitBegruendung" label={`Begründung Sicherheit${value.sicherheit === "OK" ? "" : " *"}`} error={errors.efSicherheitBegruendung}>
            <textarea id="efSicherheitBegruendung" name="efSicherheitBegruendung" value={value.sicherheitBegruendung} onChange={(e) => set({ sicherheitBegruendung: e.target.value })} rows={3} className={textareaCls} />
          </Field>
          <Field id="efTierschutzText" label="Tierschutz *" error={errors.efTierschutzText} hint="Pflicht. Erscheint auf der Testseite als Abschnitt Tierschutz.">
            <textarea id="efTierschutzText" name="efTierschutzText" value={value.tierschutz} onChange={(e) => set({ tierschutz: e.target.value })} rows={5} className={textareaCls} />
          </Field>
          <Field id="efPreisTagesdosisEur" label="Preis pro Tagesdosis (€, optional)" error={errors.efPreisTagesdosisEur} hint="Für einen Hund mit 10 kg bzw. eine Katze mit 4 kg.">
            <input id="efPreisTagesdosisEur" name="efPreisTagesdosisEur" value={value.preisTagesdosis} onChange={(e) => set({ preisTagesdosis: e.target.value })} inputMode="decimal" className={inputCls} />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4 shadow-card md:p-6" aria-labelledby="sec-traeger">
        <h2 id="sec-traeger" className="text-lg font-bold">Träger-Abzüge</h2>
        <p className="mt-1 text-sm text-muted">Vorschlag: {traegerPunkte} von 15. Der eingetragene Wert oben bleibt, bis Sie ihn übernehmen.</p>
        <ul className="mt-4 space-y-2">
          {TRAEGER_ABZUEGE.map((item) => (
            <li key={item.id}>
              <label className="flex min-h-11 items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  name="efTraegerAbzuege"
                  value={item.id}
                  checked={value.traegerAbzuege.includes(item.id)}
                  onChange={(e) => {
                    const next = e.target.checked ? [...value.traegerAbzuege, item.id] : value.traegerAbzuege.filter((id) => id !== item.id);
                    set({ traegerAbzuege: next });
                  }}
                  className="mt-1"
                />
                <span>{item.label} (−{item.points})</span>
              </label>
            </li>
          ))}
        </ul>
        <button type="button" className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-border px-4 text-sm font-semibold" onClick={() => set({ traeger: String(traegerPunkte) })}>
          Vorschlag {traegerPunkte} übernehmen
        </button>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4 shadow-card md:p-6" aria-labelledby="sec-wirkstoffe">
        <h2 id="sec-wirkstoffe" className="text-lg font-bold">Wirkstoffe</h2>
        <div className="mt-4 space-y-4">
          {value.wirkstoffe.map((w, index) => (
            <div key={w.key} className="grid gap-3 rounded-xl border border-border p-3 sm:grid-cols-3">
              <Field id={`wirkstoff-${w.key}`} label={`Wirkstoff ${index + 1}`} error={undefined}>
                <input id={`wirkstoff-${w.key}`} value={w.name} onChange={(e) => updateWirkstoff(value, onChange, w.key, { name: e.target.value })} className={inputCls} />
              </Field>
              <Field id={`menge-${w.key}`} label="mg je Tagesdosis" error={undefined}>
                <input id={`menge-${w.key}`} value={w.menge} onChange={(e) => { setDirtyDose(true); updateWirkstoff(value, onChange, w.key, { menge: e.target.value }); }} inputMode="decimal" className={inputCls} />
              </Field>
              <Field id={`referenz-${w.key}`} label="Referenz mg/kg" error={undefined}>
                <input id={`referenz-${w.key}`} value={w.referenz} onChange={(e) => { setDirtyDose(true); updateWirkstoff(value, onChange, w.key, { referenz: e.target.value }); }} inputMode="decimal" className={inputCls} />
              </Field>
              <button type="button" className="text-left text-sm font-semibold text-bad" onClick={() => onChange({ ...value, wirkstoffe: value.wirkstoffe.filter((x) => x.key !== w.key), studien: value.studien.filter((s) => s.wirkstoffKey !== w.key) })}>
                Wirkstoff entfernen
              </button>
            </div>
          ))}
          <button type="button" className="inline-flex min-h-11 items-center rounded-xl border border-border px-4 text-sm font-semibold" onClick={() => onChange({ ...value, wirkstoffe: [...value.wirkstoffe, { key: newKey(), name: "", menge: "", referenz: "" }] })}>
            Wirkstoff hinzufügen
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4 shadow-card md:p-6" aria-labelledby="sec-studien">
        <h2 id="sec-studien" className="text-lg font-bold">Studien</h2>
        <p className="mt-1 text-sm text-muted">Erscheinen auf der Testseite in der Quellenliste. Auswahl über 10 Punkte braucht eine Studie beim Zieltier.</p>
        {errors.efPayload && <p className="mt-2 text-sm font-medium text-bad">{errors.efPayload}</p>}
        <div className="mt-4 flex flex-wrap items-end gap-2">
          <Field id="referenz-vorlage" label="Aus der Referenztabelle" error={undefined} className="min-w-64 flex-1">
            <select id="referenz-vorlage" value={vorlage} onChange={(e) => setVorlage(e.target.value)} className={inputCls}>
              {referenzen.length === 0 && <option value="">Noch keine Referenzdosis</option>}
              {referenzen.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.wirkstoff} ({r.tierart === "KATZE" ? "Katze" : "Hund"}){r.luecke ? " – Lücke" : ""}
                </option>
              ))}
            </select>
          </Field>
          <button
            type="button"
            className="inline-flex min-h-11 items-center rounded-xl border border-border px-4 text-sm font-semibold"
            onClick={() => {
              const row = referenzen.find((r) => r.id === vorlage);
              if (!row) return;
              const key = value.wirkstoffe.find((w) => w.name.trim().toLowerCase() === row.wirkstoff.toLowerCase())?.key ?? newKey();
              const wirkstoffe = value.wirkstoffe.some((w) => w.key === key)
                ? value.wirkstoffe.map((w) => (w.key === key ? { ...w, referenz: row.mgProKgMin == null ? w.referenz : String(row.mgProKgMin).replace(".", ",") } : w))
                : [...value.wirkstoffe, { key, name: row.wirkstoff, menge: "", referenz: row.mgProKgMin == null ? "" : String(row.mgProKgMin).replace(".", ",") }];
              const jahr = /\b(19|20)\d{2}\b/.exec(row.quelle)?.[0] ?? "";
              const studie: StudieDraft = {
                ...emptyStudie(key),
                tierart: row.tierart,
                link: /^https:\/\//.test(row.quelle) ? row.quelle : "",
                ergebnis: row.hinweis.slice(0, 280),
                jahr,
                freigabe: false,
              };
              onChange({ ...value, wirkstoffe, studien: [...value.studien, studie], keineReferenz: row.luecke || value.keineReferenz });
            }}
          >
            aus Referenztabelle übernehmen
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {value.studien.map((s, index) => (
            <StudieEditor key={s.key} index={index} studie={s} wirkstoffe={value.wirkstoffe} onChange={(next) => onChange({ ...value, studien: value.studien.map((x) => (x.key === s.key ? next : x)) })} onRemove={() => onChange({ ...value, studien: value.studien.filter((x) => x.key !== s.key) })} />
          ))}
          <button type="button" className="inline-flex min-h-11 items-center rounded-xl border border-border px-4 text-sm font-semibold" onClick={() => onChange({ ...value, studien: [...value.studien, emptyStudie(value.wirkstoffe[0]?.key ?? "")] })}>
            Studie hinzufügen
          </button>
        </div>
      </section>
    </div>
  );
}

function updateWirkstoff(value: EfFormState, onChange: (next: EfFormState) => void, key: string, patch: Partial<WirkstoffDraft>) {
  onChange({ ...value, wirkstoffe: value.wirkstoffe.map((w) => (w.key === key ? { ...w, ...patch } : w)) });
}

function StudieEditor({ studie, index, wirkstoffe, onChange, onRemove }: { studie: StudieDraft; index: number; wirkstoffe: WirkstoffDraft[]; onChange: (next: StudieDraft) => void; onRemove: () => void }) {
  const set = (patch: Partial<StudieDraft>) => onChange({ ...studie, ...patch });
  return (
    <fieldset className="space-y-3 rounded-xl border border-border p-3">
      <legend className="px-1 text-sm font-bold">Studie {index + 1}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field id={`sw-${studie.key}`} label="Wirkstoff *" error={undefined}>
          <select id={`sw-${studie.key}`} value={studie.wirkstoffKey} onChange={(e) => set({ wirkstoffKey: e.target.value })} className={inputCls}>
            <option value="">Bitte wählen …</option>
            {wirkstoffe.map((w) => (
              <option key={w.key} value={w.key}>{w.name || "Ohne Namen"}</option>
            ))}
          </select>
        </Field>
        <Field id={`st-${studie.key}`} label="Titel *" error={undefined}>
          <input id={`st-${studie.key}`} value={studie.titel} maxLength={300} onChange={(e) => set({ titel: e.target.value })} className={inputCls} />
        </Field>
        <Field id={`sa-${studie.key}`} label="Autoren *" error={undefined}>
          <input id={`sa-${studie.key}`} value={studie.autoren} onChange={(e) => set({ autoren: e.target.value })} className={inputCls} />
        </Field>
        <Field id={`sj-${studie.key}`} label="Jahr *" error={undefined}>
          <input id={`sj-${studie.key}`} value={studie.jahr} inputMode="numeric" onChange={(e) => set({ jahr: e.target.value })} className={inputCls} />
        </Field>
        <Field id={`sz-${studie.key}`} label="Zeitschrift" error={undefined}>
          <input id={`sz-${studie.key}`} value={studie.zeitschrift} onChange={(e) => set({ zeitschrift: e.target.value })} className={inputCls} />
        </Field>
        <Field id={`stier-${studie.key}`} label="Tierart *" error={undefined}>
          <select id={`stier-${studie.key}`} value={studie.tierart} onChange={(e) => set({ tierart: e.target.value as EfTierart })} className={inputCls}>
            {Object.entries(TIERART_LABEL).map(([k, label]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
        </Field>
        <Field id={`sd-${studie.key}`} label="Dosis je kg" error={undefined}>
          <input id={`sd-${studie.key}`} value={studie.dosis} onChange={(e) => set({ dosis: e.target.value })} inputMode="decimal" className={inputCls} />
        </Field>
        <Field id={`se-${studie.key}`} label="Einheit" error={undefined}>
          <select id={`se-${studie.key}`} value={studie.einheit} onChange={(e) => set({ einheit: e.target.value as StudieDraft["einheit"] })} className={inputCls}>
            <option value="">keine</option>
            {Object.entries(EINHEIT_LABEL).map(([k, label]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field id={`so-${studie.key}`} label="Originalangabe der Dosis" error={undefined}>
        <input id={`so-${studie.key}`} value={studie.original} onChange={(e) => set({ original: e.target.value })} className={inputCls} />
      </Field>
      <Field id={`ser-${studie.key}`} label="Ergebnis, kurz *" error={undefined}>
        <input id={`ser-${studie.key}`} value={studie.ergebnis} maxLength={280} onChange={(e) => set({ ergebnis: e.target.value })} className={inputCls} />
      </Field>
      <Field id={`sl-${studie.key}`} label="Link *" error={undefined} hint="doi.org, PubMed oder PMC. Andere https-Links nur mit Freigabe.">
        <input id={`sl-${studie.key}`} value={studie.link} onChange={(e) => set({ link: e.target.value })} className={inputCls} />
      </Field>
      <label className="flex min-h-11 items-center gap-3 text-sm font-semibold">
        <input type="checkbox" checked={studie.freigabe} onChange={(e) => set({ freigabe: e.target.checked })} />
        Link außerhalb von DOI, PubMed und PMC freigegeben
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field id={`sev-${studie.key}`} label="Evidenzstufe *" error={undefined}>
          <select id={`sev-${studie.key}`} value={studie.evidenz} onChange={(e) => set({ evidenz: e.target.value as EfEvidenz })} className={inputCls}>
            {Object.entries(EVIDENZ_LABEL).map(([k, label]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
        </Field>
        <Field id={`sr-${studie.key}`} label="Richtung *" error={undefined}>
          <select id={`sr-${studie.key}`} value={studie.richtung} onChange={(e) => set({ richtung: e.target.value as EfRichtung })} className={inputCls}>
            <option value="POSITIV">positiv</option>
            <option value="KEIN_EFFEKT">kein Effekt</option>
            <option value="NEGATIV">negativ</option>
            <option value="GEMISCHT">gemischt</option>
          </select>
        </Field>
        <Field id={`sg-${studie.key}`} label="Geprüft am *" error={undefined}>
          <input id={`sg-${studie.key}`} type="date" value={studie.geprueftAm} onChange={(e) => set({ geprueftAm: e.target.value })} className={inputCls} />
        </Field>
      </div>
      <button type="button" className="text-sm font-semibold text-bad" onClick={onRemove}>Studie entfernen</button>
    </fieldset>
  );
}
