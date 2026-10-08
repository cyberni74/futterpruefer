import { CONCERN_LABEL, type Concern } from "@/lib/admin/lexikon";

const TONE: Record<Concern, { cls: string; dot: string }> = {
  UNBEDENKLICH: { cls: "bg-good-soft text-good border-good/30", dot: "bg-good" },
  EINGESCHRAENKT: { cls: "bg-mid-soft text-mid border-mid/30", dot: "bg-mid" },
  BEDENKLICH: { cls: "bg-bad-soft text-bad border-bad/30", dot: "bg-bad" },
};

/** Ampel-Badge für die Bedenklichkeit eines Inhaltsstoffs. */
export function ConcernBadge({ concern }: { concern: Concern }) {
  const t = TONE[concern];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${t.cls}`}>
      <span className={`size-2 rounded-full ${t.dot}`} aria-hidden />
      {CONCERN_LABEL[concern]}
    </span>
  );
}
