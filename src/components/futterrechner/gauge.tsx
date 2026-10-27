"use client";

import { motion, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const C = { x: 100, y: 100, r: 80 };
const pt = (score: number, r = C.r) => {
  const a = Math.PI * (1 - score / 100);
  return [C.x + r * Math.cos(a), C.y - r * Math.sin(a)];
};
const arc = (from: number, to: number) => {
  const [x1, y1] = pt(from);
  const [x2, y2] = pt(to);
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${C.r} ${C.r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
};

/** Segmente nach Konzept 6.5: 0–59 bad, 60–79 mid (zwei Abstufungen), 80–89 good-soft, 90–100 good. */
const SEGMENTE: Array<[number, number, string, number]> = [
  [0, 60, "var(--bad)", 1],
  [60, 70, "var(--mid-fill)", 1],
  [70, 80, "var(--mid-fill)", 0.6],
  [80, 90, "var(--good)", 0.6],
  [90, 100, "var(--good)", 1],
];

/** Zahl zählt hoch; ohne Animation bei prefers-reduced-motion. */
export function useZaehler(ziel: number) {
  const reduziert = useReducedMotion();
  const [wert, setWert] = useState(ziel);
  const von = useRef(ziel);
  useEffect(() => {
    if (reduziert) { von.current = ziel; return; }
    const start = von.current;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 450);
      const v = start + (ziel - start) * (1 - (1 - k) ** 3);
      setWert(v);
      if (k < 1) raf = requestAnimationFrame(tick);
      else von.current = ziel;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ziel, reduziert]);
  return reduziert ? ziel : Math.round(wert);
}

export function Gauge({ score, klein = false, titel }: { score: number; klein?: boolean; titel: string }) {
  const reduziert = useReducedMotion();
  const laenge = klein ? 70 : 66;
  // Nadel als Linie von der Mitte aus: Endpunkt direkt aus dem Winkel, keine Transform-Drehung (die Drehung ließ die Nadel am Rand abschneiden)
  const wert = useSpring(score, reduziert ? { duration: 0 } : { stiffness: 200, damping: 25 });
  useEffect(() => { wert.set(score); }, [score, wert]);
  const x2 = useTransform(wert, (v) => C.x + laenge * Math.cos(Math.PI * (1 - Math.min(100, Math.max(0, v)) / 100)));
  const y2 = useTransform(wert, (v) => C.y - laenge * Math.sin(Math.PI * (1 - Math.min(100, Math.max(0, v)) / 100)));
  return (
    <svg viewBox="-10 0 220 112" overflow="visible" role="img" aria-label={titel} className={klein ? "h-10 w-[4.5rem]" : "mx-auto w-full max-w-[17rem]"}>
      {SEGMENTE.map(([a, b, farbe, op]) => (
        <path key={a} d={arc(a + 0.6, b - 0.6)} fill="none" stroke={farbe} strokeOpacity={op} strokeWidth={klein ? 20 : 16} strokeLinecap="butt" />
      ))}
      <motion.line x1={C.x} y1={C.y} x2={x2} y2={y2} stroke="var(--fg)" strokeWidth={klein ? 7 : 5} strokeLinecap="round" />
      <circle cx={C.x} cy={C.y} r={klein ? 11 : 9} fill="var(--fg)" />
    </svg>
  );
}
