"use client";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { CLAIM_LABEL, CLAIM_RATINGS, suggestedDeclarationDeduction, type Claim } from "@/lib/product-data";
import { inputCls, labelCls, textareaCls } from "./ui";

const btn = "inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-3 text-sm font-semibold hover:bg-bg-soft";
const iconBtn = "inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-border text-muted hover:bg-bad-soft hover:text-bad";

// ---------- Analytische Bestandteile ----------
type Row = { name: string; value: string };
const DEFAULT_ROWS = ["Rohprotein", "Rohfett", "Rohfaser", "Rohasche", "Feuchtigkeit"].map((name) => ({ name, value: "" }));

export function AnalysisField({ initial, error }: { initial: Array<{ name: string; value: number }>; error?: string }) {
  const [rows, setRows] = useState<Row[]>(() => (initial?.length ? initial.map((r) => ({ name: r.name, value: String(r.value).replace(".", ",") })) : DEFAULT_ROWS));
  const json = JSON.stringify(rows.filter((r) => r.name.trim() && r.value.trim()).map((r) => ({ name: r.name.trim(), value: Number(r.value.replace(",", ".")) })));
  const set = (i: number, k: keyof Row, v: string) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  return (
    <fieldset>
      <legend className={labelCls}>Analytische Bestandteile (in %)</legend>
      <input type="hidden" name="analysis" value={json} />
      <ul className="space-y-2">
        {rows.map((r, i) => (
          <li key={i} className="flex gap-2">
            <input aria-label={`Bestandteil ${i + 1}`} value={r.name} onChange={(e) => set(i, "name", e.target.value)} maxLength={60} className={`${inputCls} flex-1`} placeholder="z. B. Calcium" />
            <input aria-label={`Wert ${i + 1} in Prozent`} value={r.value} onChange={(e) => set(i, "value", e.target.value)} inputMode="decimal" maxLength={8} className={`${inputCls} !w-28 text-right tabular-nums`} placeholder="0,0" />
            <button type="button" onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))} className={iconBtn} aria-label={`Zeile ${i + 1} entfernen`}><Trash2 className="size-4" aria-hidden /></button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => setRows((rs) => [...rs, { name: "", value: "" }])} className={`${btn} mt-2`}><Plus className="size-4" aria-hidden /> Zeile hinzufügen</button>
      <p className="mt-1 text-xs text-muted">Mit „Feuchtigkeit“ wird auf der Testseite automatisch die Trockensubstanz berechnet. Leere Werte werden ignoriert.</p>
      {error && <p className="mt-1 text-sm font-medium text-bad">{error}</p>}
    </fieldset>
  );
}

// ---------- Werbeaussagen ----------
const EMPTY: Claim = { claim: "", rating: "FRAGWUERDIG", reason: "", legal: "", imageUrl: "" };
const RATING_TONE = { ZULAESSIG: "border-good", FRAGWUERDIG: "border-mid", UNZULAESSIG: "border-bad" } as const;

async function uploadImage(file: File, nameSource: string, variant = ""): Promise<{ url?: string; error?: string }> {
  const fd = new FormData();
  fd.set("file", file);
  fd.set("name", nameSource || "produktbild");
  fd.set("kind", "review");
  if (variant) fd.set("variant", variant);
  try {
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
    return res.ok && data.url ? { url: data.url } : { error: data.error ?? "Upload fehlgeschlagen." };
  } catch {
    return { error: "Upload fehlgeschlagen." };
  }
}

function ClaimPhoto({ value, onChange, nameSource, index }: { value: string; onChange: (url: string) => void; nameSource: string; index: number }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  return (
    <div>
      <span className={labelCls}>Foto der Aussage auf der Verpackung (optional)</span>
      <div className="flex items-center gap-3">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element -- Admin-Vorschau
          <img src={value} alt="" className="size-16 shrink-0 rounded-lg border border-border object-cover" />
        )}
        <label className={`${btn} cursor-pointer ${busy ? "pointer-events-none opacity-60" : ""}`}>
          <ImagePlus className="size-4" aria-hidden /> {busy ? "Lädt hoch …" : value ? "Foto ersetzen" : "Foto hochladen"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            disabled={busy}
            aria-label={`Foto zu Werbeaussage ${index + 1} hochladen`}
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (!f) return;
              setBusy(true);
              setMsg("");
              const r = await uploadImage(f, nameSource, "aussage");
              setBusy(false);
              if (r.url) onChange(r.url);
              else setMsg(r.error ?? "Upload fehlgeschlagen.");
            }}
          />
        </label>
        {value && <button type="button" onClick={() => onChange("")} className={iconBtn} aria-label={`Foto zu Werbeaussage ${index + 1} entfernen`}><Trash2 className="size-4" aria-hidden /></button>}
      </div>
      {msg && <p className="mt-1 text-sm font-medium text-bad" aria-live="polite">{msg}</p>}
    </div>
  );
}

export function ClaimsField({ claims, setClaims, error, declarationMax, onApplyDeduction, nameSource = "" }: { claims: Claim[]; setClaims: React.Dispatch<React.SetStateAction<Claim[]>>; error?: string; declarationMax: number; onApplyDeduction: (score: number) => void; nameSource?: string }) {
  const valid = claims.filter((c) => c.claim.trim());
  const deduction = suggestedDeclarationDeduction(valid);
  const set = (i: number, patch: Partial<Claim>) => setClaims((cs) => cs.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  return (
    <div className="space-y-3">
      <input type="hidden" name="claims" value={JSON.stringify(valid)} />
      <p className="rounded-xl bg-bg-soft p-3 text-sm text-muted">
        Formulieren Sie Bewertungen als <strong className="text-fg">begründete Meinung mit Belegen</strong> („unserer Einschätzung nach unzulässig, weil …“), nicht als bloße Behauptung. Rote Aussagen erscheinen automatisch als Contra-Punkt.
      </p>
      {claims.map((c, i) => (
        <fieldset key={i} className={`space-y-3 rounded-2xl border-2 p-4 ${RATING_TONE[c.rating]}`}>
          <legend className="px-1 text-sm font-bold">Werbeaussage {i + 1}</legend>
          <div className="grid gap-3 sm:grid-cols-[1fr_14rem]">
            <label className="block"><span className={labelCls}>Aussage *</span><input value={c.claim} onChange={(e) => set(i, { claim: e.target.value })} maxLength={200} className={inputCls} placeholder="z. B. stärkt das Immunsystem" /></label>
            <label className="block"><span className={labelCls}>Bewertung</span>
              <select value={c.rating} onChange={(e) => set(i, { rating: e.target.value as Claim["rating"] })} className={inputCls}>
                {CLAIM_RATINGS.map((r) => <option key={r} value={r}>{CLAIM_LABEL[r]}</option>)}
              </select>
            </label>
          </div>
          <label className="block"><span className={labelCls}>Begründung</span><textarea value={c.reason} onChange={(e) => set(i, { reason: e.target.value })} rows={2} maxLength={1000} className={textareaCls} placeholder="Unserer Einschätzung nach … , weil …" /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block"><span className={labelCls}>Rechtsgrundlage (optional)</span><input value={c.legal} onChange={(e) => set(i, { legal: e.target.value })} maxLength={200} className={inputCls} placeholder="z. B. VO (EG) 767/2009 Art. 13" /></label>
            <ClaimPhoto value={c.imageUrl} onChange={(imageUrl) => set(i, { imageUrl })} nameSource={nameSource} index={i} />
          </div>
          <button type="button" onClick={() => setClaims((cs) => cs.filter((_, j) => j !== i))} className={`${btn} text-bad`}><Trash2 className="size-4" aria-hidden /> Aussage entfernen</button>
        </fieldset>
      ))}
      <button type="button" onClick={() => setClaims((cs) => [...cs, { ...EMPTY }])} className={btn}><Plus className="size-4" aria-hidden /> Werbeaussage hinzufügen</button>
      {deduction > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-mid-soft p-3 text-sm" aria-live="polite">
          <span className="flex-1">Vorschlag: <strong>−{deduction} Punkte</strong> bei „Deklaration &amp; Transparenz“ (3 je unzulässiger, 1 je fragwürdiger Aussage). Der Wert bleibt manuell anpassbar.</span>
          <button type="button" onClick={() => onApplyDeduction(Math.max(0, declarationMax - deduction))} className={btn}>Übernehmen ({Math.max(0, declarationMax - deduction)}/{declarationMax})</button>
        </div>
      )}
      {error && <p className="text-sm font-medium text-bad">{error}</p>}
    </div>
  );
}

// ---------- Weitere Produktbilder ----------
export function GalleryField({ initial, nameSource, error }: { initial: string[]; nameSource: string; error?: string }) {
  const [urls, setUrls] = useState<string[]>(initial ?? []);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  async function upload(file: File) {
    setBusy(true);
    setMsg("");
    const r = await uploadImage(file, nameSource);
    setBusy(false);
    if (r.url) setUrls((u) => [...u, r.url!]);
    else setMsg(r.error ?? "Upload fehlgeschlagen.");
  }
  return (
    <div>
      {urls.map((u) => <input key={u} type="hidden" name="gallery" value={u} />)}
      {urls.length > 0 && (
        <ul className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {urls.map((u, i) => (
            <li key={u} className="relative aspect-square overflow-hidden rounded-xl border border-border bg-bg-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt={`Weiteres Bild ${i + 1}`} className="size-full object-cover" />
              <button type="button" onClick={() => setUrls((x) => x.filter((y) => y !== u))} className="absolute top-1 right-1 inline-flex size-9 items-center justify-center rounded-full bg-surface/90 text-bad" aria-label={`Bild ${i + 1} entfernen`}><Trash2 className="size-4" aria-hidden /></button>
            </li>
          ))}
        </ul>
      )}
      <label className={`${btn} cursor-pointer ${busy || urls.length >= 8 ? "pointer-events-none opacity-60" : ""}`}>
        <ImagePlus className="size-4" aria-hidden /> {busy ? "Lädt hoch …" : "Weiteres Bild hochladen"}
        <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" disabled={busy || urls.length >= 8} onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f); e.target.value = ""; }} />
      </label>
      <p className="mt-1 text-xs text-muted">Bis zu 8 weitere Bilder (z. B. Rückseite mit Deklaration). Wird automatisch als WebP optimiert.</p>
      {(msg || error) && <p className="mt-1 text-sm font-medium text-bad" aria-live="polite">{msg || error}</p>}
    </div>
  );
}
