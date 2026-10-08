import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHeader, btnPrimary, btnSecondary, cardCls, inputCls } from "@/components/admin/ui";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDateTime } from "@/lib/admin/datetime";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Fachblog" };

export default async function BlogListPage({ searchParams }: { searchParams: Promise<{ q?: string; geloescht?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 100);
  const now = new Date();
  const posts = await prisma.blogPost.findMany({
    where: q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { slug: { contains: q, mode: "insensitive" } }] } : {},
    orderBy: { updatedAt: "desc" },
    take: 200,
    select: { id: true, title: true, slug: true, status: true, publishedAt: true, updatedAt: true },
  });

  return (
    <>
      <PageHeader
        title="Fachblog"
        description={`${posts.length} ${posts.length === 1 ? "Artikel" : "Artikel"}`}
        actions={
          <Link href="/admin/blog/neu" className={btnPrimary}>
            <Plus className="size-4" aria-hidden /> Neuer Artikel
          </Link>
        }
      />
      {sp.geloescht && (
        <p role="status" className="mb-4 rounded-xl bg-good-soft px-4 py-2.5 text-sm font-medium text-good">
          Artikel gelöscht.
        </p>
      )}
      <form role="search" className="mb-4 flex gap-2" action="/admin/blog">
        <label htmlFor="q" className="sr-only">
          Artikel durchsuchen
        </label>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input id="q" name="q" type="search" defaultValue={q} placeholder="Titel oder Slug …" className={`${inputCls} pl-9`} />
        </div>
        <button type="submit" className={btnSecondary}>
          Suchen
        </button>
      </form>
      {posts.length === 0 ? (
        <div className={`${cardCls} text-center text-muted`}>Keine Artikel gefunden.</div>
      ) : (
        <ul className={`${cardCls} divide-y divide-border !p-0`}>
          {posts.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/blog/${p.id}`} className="flex min-h-11 items-center gap-3 px-4 py-3 hover:bg-bg-soft md:px-5">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{p.title}</p>
                  <p className="truncate text-xs text-muted">/blog/{p.slug}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <StatusBadge status={p.status} publishedAt={p.publishedAt} now={now} />
                  <span className="hidden text-xs text-muted sm:block">{formatDateTime(p.updatedAt)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
