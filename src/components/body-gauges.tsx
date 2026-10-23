"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ScoreRing } from "@/components/score-ring";

type Target = { el: HTMLElement; score: number };

/**
 * Macht Tacho-Platzhalter im Artikel-HTML lebendig: nur Elemente mit der Klasse
 * `fp-gauge` innerhalb von #artikel. Die Punktzahl steht als Text in `.fp-gauge-score`
 * (keine data-Attribute nötig, der Sanitizer bleibt unverändert streng). Ohne JS
 * bleibt der statische Fallback-Ring sichtbar.
 */
export function BodyGauges({ rootId = "artikel" }: { rootId?: string }) {
  const [targets, setTargets] = useState<Target[]>([]);
  const [size, setSize] = useState(128);

  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    const found: Target[] = [];
    root.querySelectorAll<HTMLElement>(".fp-gauge").forEach((el) => {
      const raw = el.querySelector(".fp-gauge-score")?.textContent?.trim() ?? "";
      if (!/^\d{1,3}$/.test(raw)) return;
      const score = Number(raw);
      if (score < 0 || score > 100) return;
      el.classList.add("fp-gauge-live");
      found.push({ el, score });
    });
    const mq = window.matchMedia("(min-width: 40rem)");
    const apply = () => setSize(mq.matches ? 140 : 128);
    mq.addEventListener("change", apply);
    // Nach dem ersten Frame übernehmen (DOM des Artikels ist dann sicher vorhanden).
    const raf = requestAnimationFrame(() => {
      apply();
      setTargets(found);
    });
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", apply);
      found.forEach(({ el }) => el.classList.remove("fp-gauge-live"));
    };
  }, [rootId]);

  return <>{targets.map(({ el, score }, i) => createPortal(<ScoreRing score={score} size={size} compact />, el, `g${i}`))}</>;
}
