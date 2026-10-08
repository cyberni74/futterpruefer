import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { blogCardSelect, publishedWhere } from "@/lib/queries";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BlogCard } from "@/components/blog-card";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Fachblog",
  description: "Fachartikel rund um Hunde- und Katzenernährung: Deklaration, Inhaltsstoffe, Bedarf und Mythen.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({ where: publishedWhere(), orderBy: { publishedAt: "desc" }, select: blogCardSelect, take: 100 });
  return (
    <div className="mx-auto max-w-6xl px-4">
      <Breadcrumbs items={[{ label: "Fachblog" }]} />
      <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">Fachblog</h1>
      <p className="mb-10 mt-3 max-w-2xl text-lg text-muted">Hintergrundwissen zur Tierernährung – unabhängig von den Produkttests.</p>
      {posts.length === 0 ? (
        <p className="text-muted">Noch keine Artikel veröffentlicht.</p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => <li key={p.id}><BlogCard post={p} /></li>)}
        </ul>
      )}
    </div>
  );
}
