"use client";
import { Pause, Play, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useClientValue } from "@/lib/use-client";

/** Vorlesefunktion über die geräteinterne Web Speech API. Liest den Text des Elements mit der angegebenen ID. */
export function ReadAloud({ targetId }: { targetId: string }) {
  const supported = useClientValue(() => "speechSynthesis" in window, false);
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const utter = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); };
  }, []);

  if (!supported) return null;

  const start = () => {
    const el = document.getElementById(targetId);
    const text = el?.innerText?.trim();
    if (!text) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "de-DE";
    u.rate = 1;
    const voice = synth.getVoices().find((v) => v.lang?.toLowerCase().startsWith("de"));
    if (voice) u.voice = voice;
    u.onend = () => setState("idle");
    u.onerror = () => setState("idle");
    utter.current = u;
    synth.speak(u);
    setState("playing");
  };

  const btn = "inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-semibold hover:bg-bg-soft";
  return (
    <div className="flex gap-2">
      {state === "idle" && <button type="button" onClick={start} className={btn}><Play className="size-4" aria-hidden />Vorlesen</button>}
      {state === "playing" && <button type="button" onClick={() => { window.speechSynthesis.pause(); setState("paused"); }} className={btn}><Pause className="size-4" aria-hidden />Pause</button>}
      {state === "paused" && <button type="button" onClick={() => { window.speechSynthesis.resume(); setState("playing"); }} className={btn}><Play className="size-4" aria-hidden />Weiter</button>}
      {state !== "idle" && <button type="button" onClick={() => { window.speechSynthesis.cancel(); setState("idle"); }} className={btn} aria-label="Vorlesen beenden"><Square className="size-4" aria-hidden />Stopp</button>}
    </div>
  );
}
