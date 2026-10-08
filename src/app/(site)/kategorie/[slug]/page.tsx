import { permanentRedirect } from "next/navigation";
import { OLD_CATEGORY_SLUGS } from "@/lib/urls";

/** Alte URL /kategorie/{slug} → /{slug} (301). */
export default async function LegacyCategoryRedirect({ params }: PageProps<"/kategorie/[slug]">) {
  const { slug } = await params;
  permanentRedirect(`/${OLD_CATEGORY_SLUGS[slug] ?? slug}`);
}
