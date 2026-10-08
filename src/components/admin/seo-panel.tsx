"use client";
import { Loader2, Sparkles } from "lucide-react";
import { useId, useState } from "react";
import {
  META_DESC_MAX,
  META_DESC_MIN,
  META_TITLE_MAX,
  metaDescriptionTone,
  metaTitleTone,
  truncateForSerp,
  type LengthTone,
} from "@/lib/admin/seo";
import type { AiContext, AiKind } from "@/lib/admin/ai";
import { btnSecondary, describe, inputCls, labelCls, textareaCls } from "./ui";

const TONE_CLS: Record<LengthTone, string> = {
  good: "text-good",
  mid: "text-mid",
  bad: "text-bad",
};
const BAR_CLS: Record<LengthTone, string> = { good: "bg-good", mid: "bg-mid", bad: "bg-bad" };

type Props = {
  kind: AiKind;
  slug: string;
  /** Fallback-Titel für die SERP-Vorschau, wenn kein Meta-Titel gesetzt ist */
  fallbackTitle: string;
  fallbackDescription?: string;
  initial: { metaTitle: string; metaDescription: string; keywords: string[] };
  /** Liefert den aktuellen Inhalt für die KI-Generierung */
  getContext: () => AiContext;
  errors?: Record<string, string>;
  /** Keyword-Feld und -Generierung anzeigen (nicht jeder Inhaltstyp speichert Keywords) */
  showKeywords?: boolean;
};

function Counter({ length, tone, label }: { length: number; tone: LengthTone; label: string }) {
  return (
    <span className={`text-xs font-semibold tabular-nums ${TONE_CLS[tone]}`} aria-label={`${length} Zeichen, ${label}`}>
      {length} Zeichen · {label}
    </span>
  );
}

export function SeoPanel({ kind, slug, fallbackTitle, fallbackDescription = "", initial, getContext, errors = {}, showKeywords = true }: Props) {
  const uid = useId();
  const [metaTitle, setMetaTitle] = useState(initial.metaTitle);
  const [metaDescription, setMetaDescription] = useState(initial.metaDescription);
  const [keywords, setKeywords] = useState(initial.keywords.join(", "));
  const [busy, setBusy] = useState<"meta" | "keywords" | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const tTone = metaTitleTone(metaTitle.length);
  const dTone = metaDescriptionTone(metaDescription.length);
  const tLabel = metaTitle.length === 0 ? "fehlt" : metaTitle.length <= META_TITLE_MAX ? (metaTitle.length < 30 ? "eher kurz" : "optimal") : "zu lang";
  const dLabel =
    metaDescription.length === 0
      ? "fehlt"
      : metaDescription.length < META_DESC_MIN
        ? "zu kurz"
        : metaDescription.length <= META_DESC_MAX
          ? "optimal"
          : "zu lang";

  const serpTitle = truncateForSerp(metaTitle || `${fallbackTitle} | Futterprüfer`, 60);
  const serpDesc = truncateForSerp(metaDescription || fallbackDescription || "Keine Meta-Beschreibung – Google wählt selbst einen Textausschnitt.", 158);
  const section = kind === "review" ? "tests" : kind === "lexikon" ? "lexikon" : "blog";

  async function generate(task: "meta" | "keywords") {
    setBusy(task);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, kind, context: getContext() }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string[];
      };
      if (!res.ok) throw new Error(data.error ?? "KI-Anfrage fehlgeschlagen.");
      if (task === "meta") {
        if (data.metaTitle) setMetaTitle(data.metaTitle);
        if (data.metaDescription) setMetaDescription(data.metaDescription);
        setMsg({ ok: true, text: "Meta-Angaben vorgeschlagen – bitte prüfen und ggf. anpassen." });
      } else {
        setKeywords((data.keywords ?? []).join(", "));
        setMsg({ ok: true, text: "Keywords vorgeschlagen – bitte prüfen und ggf. anpassen." });
      }
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "KI-Anfrage fehlgeschlagen." });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={btnSecondary} onClick={() => generate("meta")} disabled={busy !== null}>
          {busy === "meta" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Sparkles className="size-4 text-brand" aria-hidden />}
          Meta generieren
        </button>
        {showKeywords && (
          <button type="button" className={btnSecondary} onClick={() => generate("keywords")} disabled={busy !== null}>
            {busy === "keywords" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Sparkles className="size-4 text-brand" aria-hidden />}
            Keywords generieren
          </button>
        )}
      </div>
      <p aria-live="polite" className={`text-sm empty:hidden ${msg?.ok ? "text-good" : "font-medium text-bad"}`}>
        {msg?.text}
      </p>

      <div>
        <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
          <label htmlFor={`${uid}-title`} className={labelCls + " mb-0"}>
            Meta-Titel
          </label>
          <Counter length={metaTitle.length} tone={tTone} label={tLabel} />
        </div>
        <input
          id={`${uid}-title`}
          name="metaTitle"
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          maxLength={120}
          className={inputCls}
          {...describe(`${uid}-title`, errors.metaTitle, true)}
        />
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bg-soft" aria-hidden>
          <div className={`h-full ${BAR_CLS[tTone]}`} style={{ width: `${Math.min(100, (metaTitle.length / META_TITLE_MAX) * 100)}%` }} />
        </div>
        <p id={`${uid}-title-hint`} className="mt-1 text-xs text-muted">
          Optimal: bis {META_TITLE_MAX} Zeichen. Leer = Seitentitel wird verwendet.
        </p>
        {errors.metaTitle && <p className="mt-1 text-sm font-medium text-bad">{errors.metaTitle}</p>}
      </div>

      <div>
        <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
          <label htmlFor={`${uid}-desc`} className={labelCls + " mb-0"}>
            Meta-Beschreibung
          </label>
          <Counter length={metaDescription.length} tone={dTone} label={dLabel} />
        </div>
        <textarea
          id={`${uid}-desc`}
          name="metaDescription"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          maxLength={300}
          rows={3}
          className={textareaCls}
          {...describe(`${uid}-desc`, errors.metaDescription, true)}
        />
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bg-soft" aria-hidden>
          <div className={`h-full ${BAR_CLS[dTone]}`} style={{ width: `${Math.min(100, (metaDescription.length / META_DESC_MAX) * 100)}%` }} />
        </div>
        <p id={`${uid}-desc-hint`} className="mt-1 text-xs text-muted">
          Optimal: {META_DESC_MIN}–{META_DESC_MAX} Zeichen.
        </p>
        {errors.metaDescription && <p className="mt-1 text-sm font-medium text-bad">{errors.metaDescription}</p>}
      </div>

      <div>
        <p className={labelCls}>Google-Vorschau</p>
        <div className="rounded-xl border border-border bg-white p-4 text-left shadow-card dark:bg-[#1f1f1f]" aria-label="Vorschau des Google-Suchergebnisses">
          <p className="truncate text-sm text-[#202124] dark:text-[#dadce0]">
            futterpruefer.de <span className="text-[#4d5156] dark:text-[#bdc1c6]">› {section} › {slug || "…"}</span>
          </p>
          <p className="mt-1 text-xl leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">{serpTitle}</p>
          <p className="mt-1 text-sm leading-relaxed text-[#4d5156] dark:text-[#bdc1c6]">{serpDesc}</p>
        </div>
      </div>

      {showKeywords && (
      <div>
        <label htmlFor={`${uid}-kw`} className={labelCls}>
          Keywords
        </label>
        <input
          id={`${uid}-kw`}
          name="keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="z. B. hundefutter test, getreidefrei, nassfutter"
          className={inputCls}
          {...describe(`${uid}-kw`, errors.keywords, true)}
        />
        <p id={`${uid}-kw-hint`} className="mt-1 text-xs text-muted">
          Durch Kommas getrennt.
        </p>
      </div>
      )}
    </div>
  );
}
