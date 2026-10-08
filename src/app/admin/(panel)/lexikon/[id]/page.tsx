import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { LexikonEditor } from "@/components/admin/lexikon-editor";
import { StatusBadge } from "@/components/admin/status-badge";
import { ConcernBadge } from "@/components/admin/concern-badge";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { lexikonToEditorData } from "@/lib/admin/lexikon";
import { deleteLexikon, saveLexikon } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Lexikon-Eintrag bearbeiten" };

export default async function EditLexikonPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ neu?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const entry = await prisma.lexikonEntry.findUnique({ where: { id } });
  if (!entry) notFound();
  return (
    <LexikonEditor
      key={entry.id}
      initial={lexikonToEditorData(entry)}
      action={saveLexikon.bind(null, entry.id)}
      justCreated={sp.neu === "1"}
      badge={
        <span className="flex flex-wrap gap-1.5">
          <StatusBadge status={entry.status} publishedAt={entry.publishedAt} />
          <ConcernBadge concern={entry.concern} />
        </span>
      }
      deleteSlot={
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">Löschen entfernt den Eintrag endgültig (inkl. Weiterleitungen auf ihn).</p>
          <ConfirmButton action={deleteLexikon.bind(null, entry.id)} label="Eintrag löschen" confirmText={`„${entry.name}“ wirklich endgültig löschen?`} />
        </div>
      }
    />
  );
}
