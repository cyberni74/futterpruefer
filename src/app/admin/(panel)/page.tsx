import type { Metadata } from "next";
import Link from "next/link";
import { FilePlus2, FlaskConical, Inbox, Megaphone, Newspaper, PenSquare, Trophy } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHeader, cardCls } from "@/components/admin/ui";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDateTime } from "@/lib/admin/datetime";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const now = new Date();
  const [published, drafts, scheduled, blogPublished, blogDrafts, blogScheduled, tickerActive, unread, reviews, posts] = await Promise.all([
    prisma.review.count({ where: { status: "PUBLISHED", publishedAt: { lte: now } } }),
    prisma.review.count({ where: { status: "DRAFT" } }),
    prisma.review.count({ where: { status: "PUBLISHED", publishedAt: { gt: now } } }),
    prisma.blogPost.count({ where: { status: "PUBLISHED", publishedAt: { lte: now } } }),
    prisma.blogPost.count({ where: { status: "DRAFT" } }),
    prisma.blogPost.count({ where: { status: "PUBLISHED", publishedAt: { gt: now } } }),
    prisma.tickerItem.count({ where: { active: true, OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] } }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.review.findMany({ orderBy: { updatedAt: "desc" }, take: 5, select: { id: true, title: true, status: true, publishedAt: true, updatedAt: true } }),
    prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" }, take: 5, select: { id: true, title: true, status: true, publishedAt: true, updatedAt: true } }),
  ]);

  const latest = [
    ...reviews.map((r) => ({ ...r, kind: "Test" as const, href: `/admin/tests/${r.id}` })),
    ...posts.map((p) => ({ ...p, kind: "Blog" as const, href: `/admin/blog/${p.id}` })),
  ]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  const stats = [
    { label: "Tests veröffentlicht", value: published, href: "/admin/tests?status=veroeffentlicht", icon: FlaskConical, tone: "text-good" },
    { label: "Tests im Entwurf", value: drafts, href: "/admin/tests?status=entwurf", icon: PenSquare, tone: "text-muted" },
    { label: "Tests geplant", value: scheduled, href: "/admin/tests?status=geplant", icon: FlaskConical, tone: "text-mid" },
    { label: "Blogartikel", value: blogPublished, sub: `${blogDrafts} Entwürfe · ${blogScheduled} geplant`, href: "/admin/blog", icon: Newspaper, tone: "text-brand" },
    { label: "Ticker aktiv", value: tickerActive, href: "/admin/ticker", icon: Megaphone, tone: "text-brand" },
    { label: "Ungelesene Anfragen", value: unread, href: "/admin/anfragen", icon: Inbox, tone: unread > 0 ? "text-accent" : "text-muted" },
  ];

  return (
    <>
      <PageHeader title="Dashboard" description="Überblick über Inhalte und Anfragen." />
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <li key={s.label}>
              <Link href={s.href} className={`${cardCls} block h-full !p-4 transition hover:shadow-lift`}>
                <Icon className={`size-5 ${s.tone}`} aria-hidden />
                <p className="mt-2 font-display text-3xl font-extrabold tabular-nums">{s.value}</p>
                <p className="text-sm font-medium text-muted">{s.label}</p>
                {s.sub && <p className="mt-0.5 text-xs text-muted">{s.sub}</p>}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className={cardCls} aria-labelledby="latest-h">
          <h2 id="latest-h" className="text-lg font-bold">
            Zuletzt bearbeitet
          </h2>
          {latest.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Noch keine Inhalte.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {latest.map((it) => (
                <li key={`${it.kind}-${it.id}`}>
                  <Link href={it.href} className="flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 py-3 hover:text-brand">
                    <span className="rounded-md bg-bg-soft px-2 py-0.5 text-xs font-semibold text-muted">{it.kind}</span>
                    <span className="min-w-0 flex-1 truncate font-semibold">{it.title}</span>
                    <StatusBadge status={it.status} publishedAt={it.publishedAt} now={now} />
                    <span className="w-full text-xs text-muted sm:w-auto">{formatDateTime(it.updatedAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className={cardCls} aria-labelledby="quick-h">
          <h2 id="quick-h" className="text-lg font-bold">
            Schnellzugriff
          </h2>
          <ul className="mt-3 space-y-2">
            {[
              { href: "/admin/tests/neu", label: "Neuen Test anlegen", icon: FilePlus2 },
              { href: "/admin/blog/neu", label: "Neuen Blogartikel schreiben", icon: Newspaper },
              { href: "/admin/ticker", label: "Ticker-Meldung erstellen", icon: Megaphone },
              { href: "/admin/produkt-des-monats", label: "Produkt des Monats wählen", icon: Trophy },
            ].map((q) => (
              <li key={q.href}>
                <Link href={q.href} className="flex min-h-11 items-center gap-3 rounded-xl border border-border px-3 text-sm font-semibold hover:bg-bg-soft">
                  <q.icon className="size-5 text-brand" aria-hidden />
                  {q.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
