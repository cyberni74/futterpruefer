import { berlinLocalToDate } from "./datetime";

export type PublishMode = "draft" | "now" | "scheduled";
export type ContentStatus = "DRAFT" | "PUBLISHED";
export type StatusKey = "entwurf" | "geplant" | "veroeffentlicht";

export const STATUS_LABEL: Record<StatusKey, string> = {
  entwurf: "Entwurf",
  geplant: "Geplant",
  veroeffentlicht: "Veröffentlicht",
};

export function statusKey(status: ContentStatus, publishedAt: Date | string | null | undefined, now = new Date()): StatusKey {
  if (status !== "PUBLISHED") return "entwurf";
  const d = publishedAt ? new Date(publishedAt) : null;
  if (d && d.getTime() > now.getTime()) return "geplant";
  return "veroeffentlicht";
}

export function initialPublishMode(status: ContentStatus | undefined, publishedAt: Date | string | null | undefined, now = new Date()): PublishMode {
  if (!status) return "draft";
  const key = statusKey(status, publishedAt, now);
  return key === "entwurf" ? "draft" : key === "geplant" ? "scheduled" : "now";
}

export type PublishResult =
  | { ok: true; status: ContentStatus; publishedAt: Date | null }
  | { ok: false; error: string };

/**
 * Leitet Status und Veröffentlichungsdatum aus der Formularauswahl ab.
 * Beim erneuten Speichern bereits veröffentlichter Inhalte bleibt das ursprüngliche Datum erhalten.
 */
export function resolvePublish(
  mode: PublishMode,
  scheduledLocal: string | null | undefined,
  existing: { status: ContentStatus; publishedAt: Date | null } | null,
  now = new Date(),
): PublishResult {
  if (mode === "draft") return { ok: true, status: "DRAFT", publishedAt: null };
  if (mode === "now") {
    const keep =
      existing?.status === "PUBLISHED" && existing.publishedAt && existing.publishedAt.getTime() <= now.getTime()
        ? existing.publishedAt
        : now;
    return { ok: true, status: "PUBLISHED", publishedAt: keep };
  }
  const date = berlinLocalToDate(scheduledLocal);
  if (!date) return { ok: false, error: "Bitte ein gültiges Datum und eine Uhrzeit für die geplante Veröffentlichung angeben." };
  if (date.getTime() <= now.getTime()) return { ok: false, error: "Der geplante Zeitpunkt muss in der Zukunft liegen." };
  return { ok: true, status: "PUBLISHED", publishedAt: date };
}
