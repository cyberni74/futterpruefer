import { AlertOctagon, Megaphone } from "lucide-react";
import { harmfulFailed } from "@/lib/scoring";

/** Rote Warnbox, wenn „Schadstoffe & Bedenkliches“ unter dem Schwellenwert liegt. */
export function WarningBanner({ scoreHarmful, reason, flush = false }: { scoreHarmful: number | null | undefined; reason?: string | null; flush?: boolean }) {
  if (!harmfulFailed(scoreHarmful)) return null;
  return (
    <div role="alert" className={`flex items-start gap-3 bg-bad px-5 py-4 text-white ${flush ? "" : "rounded-2xl"}`}>
      <AlertOctagon className="mt-0.5 size-7 shrink-0" aria-hidden />
      <div>
        <p className="font-bold">Warnhinweis: Schadstoffe &amp; Bedenkliches – {scoreHarmful ?? 0} von 20 Punkten</p>
        <p className="mt-1 text-sm leading-snug text-white/95">{reason?.trim() || "Das Produkt enthält nach unserer Einschätzung ungeeignete oder problematische Inhaltsstoffe."}</p>
      </div>
    </div>
  );
}

/** Orange Warnbox bei unzulässigen bzw. irreführenden Werbeaussagen. */
export function MisleadingClaimsBanner({ count }: { count: number }) {
  if (!count || count < 1) return null;
  return (
    <div role="note" className="flex items-start gap-3 rounded-2xl border-2 border-accent bg-[#fff1e8] px-5 py-4 text-[#7c2d12] dark:bg-[#2c1709] dark:text-[#fdba74]">
      <Megaphone className="mt-0.5 size-7 shrink-0" aria-hidden />
      <div>
        <p className="font-bold">Achtung: irreführende Werbeaussagen</p>
        <p className="mt-1 text-sm">
          {count === 1 ? "Eine Werbeaussage ist" : `${count} Werbeaussagen sind`} nach unserer Einschätzung unzulässig oder irreführend.{" "}
          <a href="#werbeaussagen" className="font-bold underline underline-offset-2">Zum Werbeaussagen-Check</a>
        </p>
      </div>
    </div>
  );
}
