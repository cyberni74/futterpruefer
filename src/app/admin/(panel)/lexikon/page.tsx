import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHeader, btnPrimary, btnSecondary, cardCls, inputCls } from "@/components/admin/ui";
import { StatusBadge } from "@/components/admin/status-badge";
import { ConcernBadge } from "@/components/admin/concern-badge";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Lexikon" };

export default async function LexikonListPage({ searchParams }: { searchParams: Promise<{ q?: string; geloescht?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 100);
  const now = new Date();
  const entries = await prisma.lexikonEntry.findMany({
    where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { slug: { contains: q, mode: "insensitive" } }, { synonyms: { has: q } }] } : {},
    orderBy: { name: "asc" },
    take: 500,
    select: { id: true, name: true, slug: true, group: true, concern: true, status: true, publishedAt: true },
  });
  return (
    <>
      <PageHeader
        title="Futter-Lexikon"
        description={`${entries.length} Einträge – Begriffe werden in Test- und Blogartikeln automatisch verlinkt.`}
        actions={<Link href="/admin/lexikon/neu" className={btnPrimary}><Plus className="size-4" aria-hidden /> Neuer Eintrag</Link>}
      />
      {sp.geloescht && <p role="status" className="mb-4 rounded-xl bg-good-soft px-4 py-2.5 text-sm font-medium text-good">Eintrag gelöscht.</p>}
      <form role="search" className="mb-4 flex gap-2" action="/admin/lexikon">
        <label htmlFor="q" className="sr-only">Lexikon durchsuchen</label>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input id="q" name="q" type="search" defaultValue={q} placeholder="Name oder Slug …" className={`${inputCls} pl-9`} />
        </div>
        <button type="submit" className={btnSecondary}>Suchen</button>
      </form>
      {entries.length === 0 ? (
        <div className={`${cardCls} text-center text-muted`}>Keine Einträge gefunden.</div>
      ) : (
        <ul className={`${cardCls} divide-y divide-border !p-0`}>
          {entries.map((e) => (
            <li key={e.id}>
              <Link href={`/admin/lexikon/${e.id}`} className="flex min-h-11 items-center gap-3 px-4 py-3 hover:bg-bg-soft md:px-5">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{e.name}</p>
                  <p className="truncate text-xs text-muted">{e.group || "ohne Gruppe"} · /lexikon/{e.slug}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <ConcernBadge concern={e.concern} />
                  <StatusBadge status={e.status} publishedAt={e.publishedAt} now={now} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
