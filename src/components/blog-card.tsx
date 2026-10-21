import Link from "next/link";
import type { BlogCardData } from "@/lib/queries";
import { formatDate } from "@/lib/site";
import { FpImage } from "./fp-image";

/** variant „tile“: schmale, leicht hochkant stehende Kachel für dreispaltige Raster (Startseite). */
export function BlogCard({ post, as: Heading = "h3", variant = "card" }: { post: BlogCardData; as?: "h2" | "h3"; variant?: "card" | "tile" }) {
  if (variant === "tile") {
    return (
      <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0 sm:rounded-2xl">
        <div className="relative aspect-square overflow-hidden bg-bg-soft">
          <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden className="absolute inset-0 z-[1]" />
          <FpImage src={post.imageUrl} alt={post.imageAlt.trim() || `Titelbild: ${post.title}`} blur={post.imageBlur} sizes="(min-width:1152px) 380px, 33vw" className="transition duration-500 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100" />
        </div>
        <div className="flex flex-1 flex-col p-2 sm:p-4">
          {post.publishedAt && <time dateTime={post.publishedAt.toISOString()} className="hidden text-xs font-semibold text-muted sm:block">{formatDate(post.publishedAt)}</time>}
          <Heading className="hyphens-auto break-words text-[0.78rem] font-bold leading-tight sm:mt-1 sm:text-base sm:leading-snug">
            <Link href={`/blog/${post.slug}`} className="line-clamp-4 after:absolute after:inset-0 after:z-[1] sm:line-clamp-3">{post.title}</Link>
          </Heading>
          {post.excerpt && <p className="mt-2 hidden line-clamp-3 text-sm text-muted lg:block">{post.excerpt}</p>}
        </div>
      </article>
    );
  }
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0">
      <div className="relative aspect-[16/9] overflow-hidden bg-bg-soft">
        <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden className="absolute inset-0 z-[1]" />
        <FpImage src={post.imageUrl} alt={post.imageAlt.trim() || `Titelbild: ${post.title}`} blur={post.imageBlur} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="transition duration-500 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        {post.publishedAt && <time dateTime={post.publishedAt.toISOString()} className="text-xs font-semibold text-muted">{formatDate(post.publishedAt)}</time>}
        <Heading className="mt-1 text-lg font-bold leading-snug">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:z-[1]">{post.title}</Link>
        </Heading>
        {post.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted">{post.excerpt}</p>}
      </div>
    </article>
  );
}
