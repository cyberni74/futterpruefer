/** Dezente Scroll-Animation per CSS (animation-timeline: view()). Ohne Unterstützung oder bei reduzierter Bewegung: sofort sichtbar. */
export function Reveal({ children, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return <div className={`reveal ${className}`}>{children}</div>;
}
