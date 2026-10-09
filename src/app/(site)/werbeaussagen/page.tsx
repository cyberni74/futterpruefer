import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { publishedWhere } from "@/lib/queries";
import { reviewPath } from "@/lib/urls";
import { parseClaims } from "@/lib/product-data";
import { PageShell } from "@/components/page-shell";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Werbeaussagen-Check: Irreführende Werbung bei Tierfutter",
  description:
    "Welche Werbeaussagen auf Hunde- und Katzenfutter halten dem Etikett nicht stand? Unsere Auswertung aller Tests nach Marke, mit Begründung und Hinweisen, wie Sie fragwürdige Werbung melden.",
  alternates: { canonical: "/werbeaussagen" },
  openGraph: { type: "article", url: "/werbeaussagen", title: "Werbeaussagen-Check: Irreführende Werbung bei Tierfutter", images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }] },
};

type Row = { slug: string; title: string; path: string; flagged: number; unz: number; total: number; examples: { claim: string; reason: string }[] };

export default async function WerbeaussagenPage() {
  const reviews = await prisma.review.findMany({
    where: publishedWhere(),
    select: { slug: true, title: true, brand: true, claims: true, category: { select: { slug: true } } },
  });
  const byBrand = new Map<string, Row[]>();
  let totalClaims = 0, totalFlagged = 0, totalUnz = 0;
  for (const r of reviews) {
    const claims = parseClaims(r.claims);
    if (claims.length === 0) continue;
    const flagged = claims.filter((c) => c.rating !== "ZULAESSIG");
    const unz = claims.filter((c) => c.rating === "UNZULAESSIG");
    totalClaims += claims.length; totalFlagged += flagged.length; totalUnz += unz.length;
    const row: Row = {
      slug: r.slug, title: r.title, path: reviewPath(r), flagged: flagged.length, unz: unz.length, total: claims.length,
      examples: unz.slice(0, 3).map((c) => ({ claim: c.claim, reason: c.reason })),
    };
    byBrand.set(r.brand, [...(byBrand.get(r.brand) ?? []), row]);
  }
  const brands = [...byBrand.entries()]
    .map(([brand, rows]) => ({ brand, rows: rows.sort((a, b) => b.flagged - a.flagged), flagged: rows.reduce((s, r) => s + r.flagged, 0), unz: rows.reduce((s, r) => s + r.unz, 0), total: rows.reduce((s, r) => s + r.total, 0) }))
    .sort((a, b) => b.flagged - a.flagged);

  return (
    <PageShell
      crumb="Werbeaussagen-Check"
      title="Werbeaussagen-Check: Was die Werbung verspricht"
      intro="In jedem unserer Tests prüfen wir Werbeaussagen der Hersteller auf Zulässigkeit und Richtigkeit. Hier steht die Auswertung über alle Tests."
    >
      <p className="rounded-2xl border border-border bg-bg-soft p-4 text-sm text-muted">
        Alle Einstufungen sind unsere begründete fachliche Einschätzung auf Grundlage veröffentlichter Herstellerangaben (VO (EG) 767/2009, UWG). Sie sind keine rechtsverbindliche Feststellung. Jede Aussage ist im jeweiligen Test mit Quelle und Begründung nachzulesen.
      </p>

      <ul className="mt-6 grid grid-cols-3 gap-3 text-center">
        {[
          [totalClaims, "geprüfte Aussagen"],
          [totalFlagged, "als fragwürdig oder unzulässig eingestuft"],
          [totalUnz, "davon als unzulässig eingestuft"],
        ].map(([n, label]) => (
          <li key={String(label)} className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-3xl font-extrabold text-brand">{n}</p>
            <p className="mt-1 text-xs text-muted">{label}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-2xl font-extrabold">Nach Marke</h2>
      <p className="mt-2 text-muted">Sortiert nach Zahl der als fragwürdig oder unzulässig eingestuften Aussagen. Das sagt nichts über die Qualität des Futters, sondern über die Werbung. Ein Futter kann gut sein und trotzdem schlecht beworben werden.</p>
      <div className="mt-4 space-y-3">
        {brands.map((b) => (
          <details key={b.brand} className="group rounded-2xl border border-border bg-surface shadow-card">
            <summary className="flex min-h-14 list-none flex-wrap items-center justify-between gap-2 rounded-2xl p-4 font-bold transition-colors hover:text-brand">
              <span className="text-lg">{b.brand}</span>
              <span className="text-sm font-semibold text-muted">
                {b.rows.length} {b.rows.length === 1 ? "Test" : "Tests"} · {b.flagged} von {b.total} Aussagen beanstandet · {b.unz} unzulässig
              </span>
            </summary>
            <ul className="space-y-4 px-4 pb-4">
              {b.rows.map((r) => (
                <li key={r.slug} className="border-t border-border pt-3">
                  <Link href={r.path} className="font-semibold text-brand underline underline-offset-4 hover:text-brand-strong">{r.title}</Link>
                  <p className="mt-1 text-sm text-muted">{r.flagged} von {r.total} Aussagen beanstandet, davon {r.unz} als unzulässig eingestuft.</p>
                  {r.examples.length > 0 && (
                    <ul className="mt-2 space-y-2 text-sm">
                      {r.examples.map((e) => (
                        <li key={e.claim} className="rounded-xl bg-bg-soft p-3">
                          <p className="font-semibold">„{e.claim}“</p>
                          <p className="mt-1 text-muted">{e.reason}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-extrabold">Fragwürdige Werbung melden</h2>
      <p className="mt-2 text-muted">Wer eine Werbeaussage für irreführend hält, kann das melden. Zuständig sind je nach Fall:</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
        <li><strong className="text-fg">Futtermittelüberwachung der Länder:</strong> Für Tierfutter ist in der Regel das örtliche Veterinär- oder Lebensmittelüberwachungsamt zuständig. Die Zuständigkeit ist je nach Bundesland und Kommune unterschiedlich; die Adresse finden Sie auf der Website Ihres Landkreises oder Ihrer Stadt.</li>
        <li><strong className="text-fg">Verband oder Wettbewerber:</strong> Irreführende Werbung kann nach dem Gesetz gegen den unlauteren Wettbewerb (UWG) abgemahnt werden, etwa durch Wettbewerber oder dazu berechtigte Verbände. Einzelne Verbraucherinnen und Verbraucher können das nicht selbst; sie können Hinweise an Verbraucherzentralen geben.</li>
        <li><strong className="text-fg">Hersteller und Händler:</strong> Wenn Sie ein Produkt gekauft haben, das nicht hält, was es verspricht, können Sie sich direkt an Verkäufer oder Hersteller wenden und Erstattung verlangen.</li>
      </ul>
      <p className="mt-3 text-muted">Sichern Sie Beweise: Verpackung, Etikett, Screenshots der Produktseite mit Datum und den Kaufbeleg. Wir selbst sind keine Behörde und können Beschwerden nicht weiterleiten.</p>

      <p className="mt-8 text-sm text-muted">
        Hintergrund und Beispiele: <Link href="/blog/irrefuehrende-werbung-tierfutter-erkennen" className="font-semibold text-brand underline underline-offset-4">So erkennen Sie irreführende Werbung bei Tierfutter</Link>. Wie wir bewerten: <Link href="/methodik" className="font-semibold text-brand underline underline-offset-4">Methodik</Link>.
      </p>
    </PageShell>
  );
}
