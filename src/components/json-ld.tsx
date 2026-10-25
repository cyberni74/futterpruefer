import { withoutIncompleteProducts } from "@/lib/review-schema";

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const safe = withoutIncompleteProducts(data);
  if (!safe) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(safe).replace(/</g, "\\u003c") }} />;
}
