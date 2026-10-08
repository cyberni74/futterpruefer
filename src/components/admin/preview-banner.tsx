import Link from "next/link";
import { EyeOff } from "lucide-react";

export function PreviewBanner({ editHref, note }: { editHref: string; note?: string }) {
  return (
    <div role="note" className="mb-6 flex flex-col gap-2 rounded-2xl border border-mid/40 bg-mid-soft px-4 py-3 text-mid sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-center gap-2 font-bold">
        <EyeOff className="size-5" aria-hidden /> Vorschau – nicht veröffentlicht
        {note && <span className="font-medium">· {note}</span>}
      </p>
      <Link href={editHref} className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
        Zurück zum Editor
      </Link>
    </div>
  );
}
