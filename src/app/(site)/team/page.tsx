import type { Metadata } from "next";
import Link from "next/link";
import { Quote, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { JsonLd } from "@/components/json-ld";
import { SITE } from "@/lib/site";
import { TEAM, TEAM_MOTTO, initials } from "@/lib/team";

export const metadata: Metadata = {
  title: "Team",
  description: "Die Redaktion hinter Futterprüfer: Tierärztinnen, Biologin, Testleitung und Redaktion – Rollen, Qualifikationen und Aufgaben. Die Mitglieder arbeiten in der Branche und bleiben namentlich ungenannt.",
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
        }}
      />

      <aside className="flex gap-3 rounded-2xl border border-border bg-brand-soft p-4 text-[0.95rem]">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
        <div>
          <p className="font-bold">Warum nur Kürzel?</p>
          <p className="mt-1 text-muted">
            Unsere Expertinnen und Experten arbeiten in der Branche. Zum Schutz ihrer Unabhängigkeit nennen wir keine Namen und Fotos, sondern Rolle und Qualifikation. Verantwortlich für die Inhalte ist die Redaktion, im <Link href="/impressum" className="font-semibold text-brand underline">Impressum</Link> finden Sie die Anbieterkennzeichnung. Wie wir bewerten, steht offen in der <Link href="/methodik" className="font-semibold text-brand underline">Methodik</Link>.
          </p>
        </div>
      </aside>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2" aria-label="Teamübersicht">
        {TEAM.map((m) => (
          <li key={m.slug}>
            <a href={`#${m.slug}`} className="flex h-full gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift motion-reduce:hover:translate-y-0">
              <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-lg font-extrabold text-brand-strong">{initials(m.label)}</span>
              <span className="min-w-0">
                <span className="block font-bold">{m.label}</span>
                <span className="block text-sm font-semibold text-brand">{m.role}</span>
                <span className="mt-1 block text-sm text-muted">{m.qualification}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-12 space-y-12">
        {TEAM.map((m) => (
          <section key={m.slug} id={m.slug} aria-labelledby={`${m.slug}-h`} className="scroll-mt-28 border-t border-border pt-10">
            <div className="flex items-center gap-4">
              <span aria-hidden className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-2xl font-extrabold text-brand-strong">{initials(m.label)}</span>
              <div>
                <h2 id={`${m.slug}-h`} className="text-2xl font-extrabold">{m.role}</h2>
                <p className="font-semibold text-brand">{m.label} · {m.qualification}</p>
              </div>
            </div>
            <div className="prose-fp mt-4">
              <p>{m.bio}</p>
              <List title="Aufgaben bei Futterprüfer.de" items={m.tasks} />
              {m.skills && (<><h3>Kompetenzen</h3><p>{m.skills}</p></>)}
            </div>
          </section>
        ))}
      </div>

      <blockquote className="mt-12 flex gap-3 rounded-2xl bg-bg-soft p-4 italic">
        <Quote className="size-5 shrink-0 text-brand" aria-hidden />
        <p>„{TEAM_MOTTO}“</p>
      </blockquote>
    </PageShell>
  );
}
