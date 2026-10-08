"use client";
import { ImageUp, Loader2, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { MAX_UPLOAD_BYTES, ALLOWED_MIME } from "@/lib/admin/upload";
import { describe, inputCls, labelCls } from "./ui";

type Props = {
  kind: "review" | "blog";
  /** Grundlage für SEO-Dateiname und Alt-Vorschlag (Produkt bzw. Titel) */
  nameSource: string;
  initialUrl?: string | null;
  initialAlt?: string;
  initialBlur?: string | null;
  errors?: Record<string, string>;
};

export function ImageField({ kind, nameSource, initialUrl, initialAlt = "", initialBlur, errors = {} }: Props) {
  const uid = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl ?? "");
  const [blur, setBlur] = useState(initialBlur ?? "");
  const [alt, setAlt] = useState(initialAlt);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function upload(file: File) {
    setMsg(null);
    if (!(ALLOWED_MIME as readonly string[]).includes(file.type)) {
      setMsg({ ok: false, text: "Nur JPEG, PNG, WebP oder AVIF erlaubt." });
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setMsg({ ok: false, text: "Die Datei ist größer als 8 MB." });
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("name", nameSource);
      fd.set("kind", kind);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { url?: string; blur?: string; altSuggestion?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Upload fehlgeschlagen.");
      setUrl(data.url);
      setBlur(data.blur ?? "");
      if (data.altSuggestion && (!alt || alt.startsWith("Verpackung von") || alt.startsWith("Titelbild:"))) setAlt(data.altSuggestion);
      setMsg({ ok: true, text: "Bild hochgeladen und als WebP optimiert." });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Upload fehlgeschlagen." });
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={`${uid}-file`} className={labelCls}>
          Bild
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl border border-border bg-bg-soft sm:w-48">
            {url ? (
              // eslint-disable-next-line @next/next/no-img-element -- Admin-Vorschau, keine Optimierung nötig
              <img src={url} alt={alt || "Bildvorschau"} className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-muted">
                <ImageUp className="size-8" aria-hidden />
              </div>
            )}
            {busy && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface/70">
                <Loader2 className="size-6 animate-spin text-brand" aria-hidden />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <input
              ref={fileRef}
              id={`${uid}-file`}
              type="file"
              accept={ALLOWED_MIME.join(",")}
              disabled={busy}
              aria-describedby={`${uid}-file-hint`}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void upload(f);
              }}
              className="block w-full min-h-11 text-sm text-fg file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-xl file:border-0 file:bg-brand-soft file:px-4 file:font-semibold file:text-brand"
            />
            <p id={`${uid}-file-hint`} className="text-xs text-muted">
              JPEG, PNG, WebP oder AVIF, max. 8 MB. Wird automatisch gedreht, auf max. 1600 px verkleinert und als WebP gespeichert.
            </p>
            {url && (
              <button
                type="button"
                onClick={() => {
                  setUrl("");
                  setBlur("");
                  setMsg({ ok: true, text: "Bild entfernt (wird beim Speichern übernommen)." });
                }}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-bad hover:bg-bad-soft"
              >
                <X className="size-4" aria-hidden /> Bild entfernen
              </button>
            )}
            <p aria-live="polite" className={`text-sm ${msg?.ok ? "text-good" : "text-bad"}`}>
              {msg?.text}
            </p>
            {errors.imageUrl && <p className="text-sm font-medium text-bad">{errors.imageUrl}</p>}
          </div>
        </div>
      </div>
      <div>
        <label htmlFor={`${uid}-alt`} className={labelCls}>
          Alt-Text {url && <span className="text-bad">*</span>}
        </label>
        <input
          id={`${uid}-alt`}
          name="imageAlt"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          maxLength={200}
          placeholder={kind === "blog" ? "Titelbild: …" : "Verpackung von …"}
          className={inputCls}
          {...describe(`${uid}-alt`, errors.imageAlt)}
        />
        {errors.imageAlt && (
          <p id={`${uid}-alt-error`} className="mt-1 text-sm font-medium text-bad">
            {errors.imageAlt}
          </p>
        )}
      </div>
      <input type="hidden" name="imageUrl" value={url} />
      <input type="hidden" name="imageBlur" value={blur} />
    </div>
  );
}
