"use client";
import { Check, Link2, Mail, Share2 } from "lucide-react";
import { useState } from "react";
import { useClientValue } from "@/lib/use-client";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const canShare = useClientValue(() => typeof navigator.share === "function", false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const btn = "inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-semibold hover:bg-bg-soft";
  return (
    <div className="flex flex-wrap gap-2" aria-label="Teilen">
      <a href={`https://wa.me/?text=${t}%20${u}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#146c38] px-4 text-sm font-bold text-white hover:bg-[#0f5a2e]">
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z"/></svg>
        WhatsApp
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noopener noreferrer" className={btn}>Facebook</a>
      <a href={`mailto:?subject=${t}&body=${u}`} className={btn}><Mail className="size-4" aria-hidden />E-Mail</a>
      <button
        type="button"
        className={btn}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {}
        }}
      >
        {copied ? <Check className="size-4" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
        <span aria-live="polite">{copied ? "Kopiert" : "Link kopieren"}</span>
      </button>
      {canShare && (
        <button type="button" className={btn} onClick={() => navigator.share({ title, url }).catch(() => {})}>
          <Share2 className="size-4" aria-hidden />Teilen
        </button>
      )}
    </div>
  );
}
