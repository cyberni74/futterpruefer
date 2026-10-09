import type { Metadata } from "next";
import { MapPin, Quote } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { JsonLd } from "@/components/json-ld";
import { SITE, absoluteUrl } from "@/lib/site";
import { PERSON_MARKUP, TEAM, TEAM_MOTTO, initials } from "@/lib/team";

export const metadata: Metadata = {
  title: "Team",
  description: "Wer hinter Futterprüfer steht: Tierärztinnen, Biologin, Testleiter und Redaktion – Qualifikationen, Stationen und Aufgaben.",
  alternates: { canonical: "/team" },
};

function List({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <>
      <h3>{title}</h3>
      <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>
    </>
  );
}

export default function TeamPage() {
  return (
    <PageShell crumb="Team" title="Unser Team" intro={`„${TEAM_MOTTO}“`}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE.name,
          url: SITE.url,
          slogan: TEAM_MOTTO,
          knowsAbout: ["Tierernährung", "Futtermittelrecht", "Hundefutter", "Katzenfutter"],
          // Personen erst mit echten Profilen als strukturierte Daten ausgeben
          ...(!PERSON_MARKUP ? {} : { member: TEAM.map((m) => ({ "@type": "Person", name: m.name, jobTitle: m.role, url: absoluteUrl(`/team#${m.slug}`) })) }),
        }}
      />

      <ul className="grid gap-3 sm:grid-cols-2" aria-label="Teamübersicht">
        {TEAM.map((m) => (
          <li key={m.slug}>
            <a href={`#${m.slug}`} className="flex h-full gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift motion-reduce:hover:translate-y-0">
              <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-lg font-extrabold text-brand-strong">{initials(m.name)}</span>
              <span className="min-w-0">
                <span className="block font-bold">{m.name}</span>
                <span className="block text-sm font-semibold text-brand">{m.role}</span>
                <span className="mt-1 block text-sm text-muted">{m.qualification}</span>
                <span className="mt-1 flex items-start gap-1 text-xs text-muted"><MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />{m.stations.join(" · ")}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-12 space-y-12">
        {TEAM.map((m) => (
          <section key={m.slug} id={m.slug} aria-labelledby={`${m.slug}-h`} className="scroll-mt-28 border-t border-border pt-10">
            <div className="flex items-center gap-4">
              <span aria-hidden className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-2xl font-extrabold text-brand-strong">{initials(m.name)}</span>
              <div>
                <h2 id={`${m.slug}-h`} className="text-2xl font-extrabold">{m.name}</h2>
                <p className="font-semibold text-brand">{m.role}</p>
              </div>
            </div>
            <dl className="mt-4 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
              <dt className="font-semibold">Geboren</dt><dd className="text-muted">{m.born}</dd>
              <dt className="font-semibold">Schwerpunkt</dt><dd className="text-muted">{m.focus}</dd>
              <dt className="font-semibold">Sprachen</dt><dd className="text-muted">{m.languages}</dd>
            </dl>
            <div className="prose-fp mt-4">
              <p>{m.bio}</p>
              <List title="Studium & akademische Laufbahn" items={m.education} />
              <List title="Berufliche Stationen" items={m.career} />
              <List title="Aufgaben bei Futterprüfer.de" items={m.tasks} />
              {m.skills && (<><h3>Methoden & Kompetenzen</h3><p>{m.skills}</p></>)}
            </div>
            <blockquote className="mt-5 flex gap-3 rounded-2xl bg-bg-soft p-4 italic">
              <Quote className="size-5 shrink-0 text-brand" aria-hidden />
              <p>„{m.motto}“</p>
            </blockquote>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
