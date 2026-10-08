import type { Metadata } from "next";
import { getLexikonEntries } from "@/lib/content";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LexikonBrowser } from "@/components/lexikon-browser";
import { CONCERN } from "@/components/concern-badge";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Futter-Lexikon: Inhaltsstoffe erklärt",
  description: "Durchsuchbares Lexikon der Inhaltsstoffe in Hunde- und Katzenfutter – mit Erklärung, fachlicher Einschätzung und Bedenklichkeits-Ampel.",
  alternates: { canonical: "/lexikon" },
};

export default async function LexikonPage() {
  const entries = await getLexikonEntries();
  return (
    <div className="mx-auto max-w-4xl px-4">
      <Breadcrumbs items={[{ label: "Futter-Lexikon" }]} />
      <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">Futter-Lexikon</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">Was steckt hinter den Begriffen auf dem Etikett? Jeder Inhaltsstoff mit Erklärung und Ampel-Bewertung.</p>
      <ul className="mb-6 mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
        {(Object.keys(CONCERN) as Array<keyof typeof CONCERN>).map((k) => (
          <li key={k} className="flex items-center gap-2"><span className={`size-3 rounded-full ${CONCERN[k].dot}`} aria-hidden />{CONCERN[k].label}</li>
        ))}
      </ul>
      <LexikonBrowser items={entries.map((e) => ({ slug: e.slug, name: e.name, synonyms: e.synonyms, group: e.group, concern: e.concern, shortDescription: e.shortDescription }))} />
    </div>
  );
}
