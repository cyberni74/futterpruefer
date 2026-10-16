import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { formatIncidentDate, safeUrl, type BrandInfo } from "@/lib/brand-info";

const ART_STYLE: Record<string, string> = {
  Rückruf: "bg-bad/15 text-bad",
  Behördenwarnung: "bg-bad/15 text-bad",
  Verfahren: "bg-accent/15 text-accent-strong",
  Kritik: "bg-bg-soft text-muted",
};

function Src({ url, label }: { url: string; label: string }) {
  const href = safeUrl(url);
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
      {label}<ExternalLink className="size-3.5" aria-hidden />
    </a>
  );
}

/** Firmenprofil: Überblick, Geschichte, dokumentierte Vorfälle – jede Angabe mit Quelle. */
export function BrandProfile({ info }: { info: BrandInfo }) {
  const facts = [
    ["Unternehmen", info.unternehmen],
    ["Sitz", info.sitz],
    ["Konzern / Eigentümer", info.konzern],
    ["Gegründet", info.gegruendet],
  ].filter(([, v]) => v) as [string, string][];
  return (
    <div className="mt-12 space-y-12">
      <section aria-labelledby="marke-ueber">
        <h2 id="marke-ueber" className="text-2xl font-extrabold">Über {info.name}</h2>
        {info.ueberblick && <p className="mt-3 max-w-3xl text-muted">{info.ueberblick}</p>}
        {facts.length > 0 && (
          <dl className="mt-5 grid max-w-3xl gap-x-8 gap-y-3 rounded-2xl border border-border bg-bg-soft p-5 sm:grid-cols-2">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-bold uppercase tracking-wide text-muted">{k}</dt>
                <dd className="mt-0.5 font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      {info.geschichte.length > 0 && (
        <section aria-labelledby="marke-geschichte">
          <h2 id="marke-geschichte" className="text-2xl font-extrabold">Geschichte</h2>
          <ol className="mt-5 max-w-3xl space-y-4 border-l-2 border-brand-soft pl-5">
            {info.geschichte.map((g, i) => (
              <li key={i} className="relative">
                <span aria-hidden className="absolute -left-[1.72rem] top-1.5 size-3 rounded-full bg-brand" />
                <p className="text-sm font-bold text-brand">{g.jahr}</p>
                <p className="mt-0.5">{g.text}</p>
                <Src url={g.quelle} label="Quelle" />
              </li>
            ))}
          </ol>
        </section>
      )}

      <section aria-labelledby="marke-vorfaelle">
        <h2 id="marke-vorfaelle" className="text-2xl font-extrabold">Rückrufe, Verfahren und Kritik</h2>
        {info.vorfaelle.length > 0 ? (
          <ol className="mt-5 max-w-3xl space-y-5">
            {info.vorfaelle.map((v, i) => (
              <li key={i} className="rounded-2xl border border-border bg-surface p-5 shadow-card">
                <p className="flex flex-wrap items-center gap-2 text-sm">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${ART_STYLE[v.art] ?? ART_STYLE.Kritik}`}>{v.art}</span>
                  <time className="font-semibold text-muted">{formatIncidentDate(v.datum)}</time>
                </p>
                <h3 className="mt-2 text-lg font-bold leading-snug">{v.titel}</h3>
                <p className="mt-1 text-muted">{v.text}</p>
                <p className="mt-2"><Src url={v.quelle} label={v.quelle_name || "Quelle"} /></p>
              </li>
            ))}
          </ol>
        ) : null}
        <p className="mt-4 max-w-3xl rounded-2xl bg-bg-soft p-4 text-sm text-muted">
          {info.vorfaelle_hinweis} Die Angaben beruhen auf öffentlich zugänglichen Quellen (Stand Oktober 2026) und sind keine Bewertung der Produktqualität. Rückrufe betreffen oft einzelne Chargen. Fehlt etwas oder ist etwas überholt, schreiben Sie uns über das <Link href="/kontakt" className="font-semibold text-brand underline">Kontaktformular</Link>.
        </p>
      </section>
    </div>
  );
}
