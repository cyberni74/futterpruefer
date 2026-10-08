import type { Metadata } from "next";
import { BlogEditor } from "@/components/admin/blog-editor";
import { EMPTY_POST } from "@/lib/admin/editor-data";
import { savePost } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Neuer Artikel" };

export default function NewPostPage() {
  return <BlogEditor initial={EMPTY_POST} action={savePost.bind(null, null)} />;
}
