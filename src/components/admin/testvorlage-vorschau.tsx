"use client";
import { useEffect, useState } from "react";
import { TestvorlageV2, parseLayoutData, type LayoutData } from "@/components/testvorlage-v2";
import { RATING_LABEL, ratingFor } from "@/lib/scoring";

export const VORSCHAU_NACHRICHT = "tv2-vorschau";
export type VorschauNachricht = { type: typeof VORSCHAU_NACHRICHT; layoutData: unknown; totalScore: number; titel: string };

/** Inhalt des iframes: rendert dieselbe Komponente wie die öffentliche Seite. Die Viewport-Breite des iframes bestimmt das Layout (390 px = mobil). */
export function TestvorlageVorschau() {
  const [state, setState] = useState<{ data: LayoutData; totalScore: number; titel: string } | { fehler: string } | null>(null);
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const m = e.data as VorschauNachricht;
      if (!m || m.type !== VORSCHAU_NACHRICHT) return;
      const r = parseLayoutData(m.layoutData);
      setState(r.ok ? { data: r.data, totalScore: m.totalScore, titel: m.titel } : { fehler: r.error });
    };
    window.addEventListener("message", onMessage);
    window.parent?.postMessage({ type: "tv2-bereit" }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  return (
    <div className="py-4">
      {!state && <p className="mx-4 text-sm text-muted">Vorschau wird geladen …</p>}
      {state && "fehler" in state && <p role="alert" className="mx-4 rounded-xl border border-bad/40 bg-bad-soft p-3 text-sm font-semibold text-bad">Die Eingaben sind noch nicht gültig: {state.fehler}</p>}
      {state && "data" in state && (
        <>
          <TestvorlageV2 data={state.data} totalScore={state.totalScore} ampelLabel={RATING_LABEL[ratingFor(state.totalScore)]} kopf={<h1>{state.titel || "Titel des Tests"}</h1>} />
        </>
      )}
    </div>
  );
}
