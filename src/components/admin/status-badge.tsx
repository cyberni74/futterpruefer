import { STATUS_LABEL, statusKey, type ContentStatus } from "@/lib/admin/publish";
import { formatDateTime } from "@/lib/admin/datetime";

const TONE = {
  entwurf: "bg-bg-soft text-muted border-border",
  geplant: "bg-mid-soft text-mid border-mid/30",
  veroeffentlicht: "bg-good-soft text-good border-good/30",
} as const;

export function StatusBadge({ status, publishedAt, now }: { status: ContentStatus; publishedAt: Date | null; now?: Date }) {
  const key = statusKey(status, publishedAt, now);
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TONE[key]}`}
      title={key === "geplant" && publishedAt ? `Geplant für ${formatDateTime(publishedAt)}` : undefined}
    >
      {STATUS_LABEL[key]}
      {key === "geplant" && publishedAt ? ` · ${formatDateTime(publishedAt)}` : ""}
    </span>
  );
}
