import { notFound, permanentRedirect } from "next/navigation";
import { resolveReviewPath } from "@/lib/queries";

/** Alte URL /tests/{slug} → /{kategorie}/{slug} (301). */
export default async function LegacyReviewRedirect({ params }: PageProps<"/tests/[slug]">) {
  const path = await resolveReviewPath((await params).slug);
  if (path) permanentRedirect(path);
  notFound();
}
