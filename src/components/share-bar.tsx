"use client";
import { Link2, Mail, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useClientValue } from "@/lib/use-client";

/** Schwebende Teilen-Leiste, erscheint ab 50 % Scrolltiefe. */
export function ShareBar({ url, title }: { url: string; title: string }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const canShare = useClientValue(() => typeof navigator.share === "function", false);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(max > 0 && window.scrollY / max >= 0.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const btn = "inline-flex size-11 items-center justify-center rounded-full hover:bg-bg-soft";
  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-20 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-surface/95 p-1 shadow-lift backdrop-blur transition duration-300 md:bottom-6 ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
      role="group"
      aria-label="Artikel teilen"
    >
      <a href={`https://wa.me/?text=${t}%20${u}`} target="_blank" rel="noopener noreferrer" tabIndex={visible ? 0 : -1} className={`${btn} bg-[#146c38] text-white hover:bg-[#0f5a2e]`} aria-label="Per WhatsApp teilen">
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z"/></svg>
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noopener noreferrer" tabIndex={visible ? 0 : -1} className={`${btn} text-sm font-bold`} aria-label="Bei Facebook teilen">f</a>
      <a href={`mailto:?subject=${t}&body=${u}`} tabIndex={visible ? 0 : -1} className={btn} aria-label="Per E-Mail teilen"><Mail className="size-5" aria-hidden /></a>
      <button type="button" tabIndex={visible ? 0 : -1} className={btn} aria-label={copied ? "Link kopiert" : "Link kopieren"} onClick={async () => { try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {} }}>
        <Link2 className={`size-5 ${copied ? "text-good" : ""}`} aria-hidden />
      </button>
      {canShare && (
        <button type="button" tabIndex={visible ? 0 : -1} className={btn} aria-label="Teilen" onClick={() => navigator.share({ title, url }).catch(() => {})}><Share2 className="size-5" aria-hidden /></button>
      )}
    </div>
  );
}
