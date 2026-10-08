import "server-only";
import { revalidatePath } from "next/cache";

/** Nach dem Speichern/Veröffentlichen aufrufen, damit Inhalte sofort live sind. */
export function revalidateContent(kind: "review" | "blog" | "ticker" | "pdm" | "faq", slugs: Array<string | null | undefined> = []) {
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/rss.xml");
  if (kind === "review" || kind === "pdm") {
    revalidatePath("/tests");
    revalidatePath("/[kategorie]", "page");
    revalidatePath("/[kategorie]/[slug]", "page");
    revalidatePath("/produkt-des-monats");
  }
  if (kind === "blog") {
    revalidatePath("/blog");
    for (const s of slugs) if (s) revalidatePath(`/blog/${s}`);
  }
  if (kind === "faq") revalidatePath("/faq");
}
