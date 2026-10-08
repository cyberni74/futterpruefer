import { AlertOctagon, AlertTriangle, CheckCircle2 } from "lucide-react";

export const CONCERN = {
  UNBEDENKLICH: { label: "Unbedenklich", cls: "bg-good-soft text-good", dot: "bg-good", Icon: CheckCircle2 },
  EINGESCHRAENKT: { label: "Eingeschränkt", cls: "bg-mid-soft text-mid", dot: "bg-mid", Icon: AlertTriangle },
  BEDENKLICH: { label: "Bedenklich", cls: "bg-bad-soft text-bad", dot: "bg-bad", Icon: AlertOctagon },
} as const;
export type ConcernKey = keyof typeof CONCERN;

export function ConcernBadge({ concern, size = "md" }: { concern: ConcernKey; size?: "md" | "lg" }) {
  const c = CONCERN[concern] ?? CONCERN.UNBEDENKLICH;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-bold ${c.cls} ${size === "lg" ? "px-4 py-2 text-base" : "px-2.5 py-1 text-xs"}`}>
      <c.Icon className={size === "lg" ? "size-5" : "size-3.5"} aria-hidden />
      {c.label}
    </span>
  );
}

/** Ampel mit drei Lichtern, das aktive leuchtet. */
export function ConcernLight({ concern }: { concern: ConcernKey }) {
  const order: ConcernKey[] = ["BEDENKLICH", "EINGESCHRAENKT", "UNBEDENKLICH"];
  return (
    <span className="inline-flex flex-col gap-1.5 rounded-2xl bg-[#1d2b2a] p-2" role="img" aria-label={`Bedenklichkeits-Ampel: ${CONCERN[concern].label}`}>
      {order.map((k) => (
        <span key={k} className={`size-5 rounded-full ${k === concern ? CONCERN[k].dot : "bg-white/15"}`} />
      ))}
    </span>
  );
}
