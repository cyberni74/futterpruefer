import type { Metadata } from "next";
import { Mail, MailOpen } from "lucide-react";
import { prisma } from "@/lib/db";
import { ActionButton } from "@/components/admin/action-button";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { PageHeader, cardCls } from "@/components/admin/ui";
import { formatDateTime } from "@/lib/admin/datetime";
import { deleteMessage, setMessageRead } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Anfragen" };

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const sp = await searchParams;
  const onlyUnread = sp.filter === "ungelesen";
  const [messages, unread] = await Promise.all([
    prisma.contactMessage.findMany({ where: onlyUnread ? { read: false } : {}, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  return (
    <>
      <PageHeader title="Anfragen" description={`${unread} ungelesen`} />
      <nav aria-label="Filter" className="mb-4 flex gap-2">
        {[
          { href: "/admin/anfragen", label: "Alle", active: !onlyUnread },
          { href: "/admin/anfragen?filter=ungelesen", label: `Ungelesen (${unread})`, active: onlyUnread },
        ].map((l) => (
          <a
            key={l.href}
            href={l.href}
            aria-current={l.active ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-semibold ${l.active ? "bg-brand text-white dark:text-[#04201e]" : "border border-border bg-surface hover:bg-bg-soft"}`}
          >
            {l.label}
          </a>
        ))}
      </nav>
      {messages.length === 0 ? (
        <p className={`${cardCls} text-muted`}>Keine Anfragen.</p>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.id} className={`${cardCls} ${m.read ? "" : "border-l-4 border-l-accent"}`}>
              <article aria-label={`Anfrage von ${m.name}`}>
                <header className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {m.read ? <MailOpen className="size-5 text-muted" aria-hidden /> : <Mail className="size-5 text-accent" aria-hidden />}
                  <h2 className="font-bold">{m.name}</h2>
                  <span className="rounded-md bg-bg-soft px-2 py-0.5 text-xs font-semibold text-muted">{m.kind === "wunsch" ? "Wunschprodukt" : m.kind}</span>
                  {!m.read && <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-white">Neu</span>}
                  <time className="ml-auto text-xs text-muted" dateTime={m.createdAt.toISOString()}>
                    {formatDateTime(m.createdAt)}
                  </time>
                </header>
                <p className="mt-1 text-sm">
                  {m.email ? (
                    <a href={`mailto:${m.email}`} className="inline-flex min-h-11 items-center font-semibold break-all text-brand underline-offset-4 hover:underline sm:min-h-0">
                      {m.email}
                    </a>
                  ) : (
                    <span className="text-muted">Keine E-Mail angegeben</span>
                  )}
                  {m.company && <span className="text-muted"> · {m.company}</span>}
                </p>
                <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">{m.message}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ActionButton action={setMessageRead.bind(null, m.id, !m.read)}>{m.read ? "Als ungelesen markieren" : "Als gelesen markieren"}</ActionButton>
                  <ConfirmButton action={deleteMessage.bind(null, m.id)} confirmText={`Anfrage von ${m.name} wirklich löschen?`} />
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
