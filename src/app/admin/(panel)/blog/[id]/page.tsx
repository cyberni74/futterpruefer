import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { BlogEditor } from "@/components/admin/blog-editor";
import { StatusBadge } from "@/components/admin/status-badge";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { postToEditorData } from "@/lib/admin/editor-data";
import { deletePost, savePost } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Artikel bearbeiten" };

export default async function EditPostPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ neu?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();
  return (
    <BlogEditor
      key={post.id}
      initial={postToEditorData(post)}
      action={savePost.bind(null, post.id)}
      justCreated={sp.neu === "1"}
      badge={<StatusBadge status={post.status} publishedAt={post.publishedAt} />}
      deleteSlot={
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">Löschen entfernt den Artikel endgültig.</p>
          <ConfirmButton action={deletePost.bind(null, post.id)} label="Artikel löschen" confirmText={`„${post.title}“ wirklich endgültig löschen?`} />
        </div>
      }
    />
  );
}
