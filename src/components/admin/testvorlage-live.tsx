"use client";
import { useEffect, useRef, useState } from "react";
import { btnSecondary } from "./ui";
import { VORSCHAU_NACHRICHT, type VorschauNachricht } from "./testvorlage-vorschau";

/** Live-Vorschau im iframe: Mobil (390 px) oder Desktop. Das iframe bekommt die aktuelle layoutData per postMessage. */
export function TestvorlageLive({ layoutData, totalScore, titel }: { layoutData: unknown; totalScore: number; titel: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [breite, setBreite] = useState<"mobil" | "desktop">("mobil");
  const letzte = useRef<VorschauNachricht | null>(null);
  const json = JSON.stringify(layoutData);

  const senden = () => {
    if (letzte.current) ref.current?.contentWindow?.postMessage(letzte.current, window.location.origin);
  };
  useEffect(() => {
    letzte.current = { type: VORSCHAU_NACHRICHT, layoutData: JSON.parse(json), totalScore, titel };
    const t = setTimeout(senden, 250);
    return () => clearTimeout(t);
  }, [json, totalScore, titel]);
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin === window.location.origin && (e.data as { type?: string })?.type === "tv2-bereit") senden();
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2" role="group" aria-label="Vorschau-Breite">
        {(["mobil", "desktop"] as const).map((b) => (
          <button key={b} type="button" aria-pressed={breite === b} onClick={() => setBreite(b)} className={`${btnSecondary} ${breite === b ? "ring-2 ring-brand" : ""}`}>
            {b === "mobil" ? "Mobil 390 px" : "Desktop"}
          </button>
        ))}
      </div>
      <div className={`overflow-hidden rounded-2xl border border-border bg-bg ${breite === "mobil" ? "mx-auto w-[390px] max-w-full" : "w-full"}`}>
        <iframe ref={ref} title="Vorschau der Testvorlage" src="/admin/vorschau-v2" onLoad={senden} className="block h-[75vh] min-h-[480px] w-full bg-bg" />
      </div>
    </div>
  );
}
