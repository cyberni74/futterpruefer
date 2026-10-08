import "server-only";
import { revalidatePath } from "next/cache";

/**
 * Lexikon- und Glossarbegriffe werden in Test- und Blogartikeln automatisch verlinkt –
 * daher nach jeder Änderung auch alle Artikelseiten neu validieren.
 */
export function revalidateTerms() {
  revalidatePath("/lexikon");
  revalidatePath("/lexikon/[slug]", "page");
  revalidatePath("/glossar");
  revalidatePath("/tests/[slug]", "page");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
}
