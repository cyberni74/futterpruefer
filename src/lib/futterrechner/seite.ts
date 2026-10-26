import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, pageAlternates, SITE } from "@/lib/site";
import { META, type SeitenKey } from "./seo";

/** Metadata je Seite: Title absolut (kein doppeltes „| Futterprüfer“), Canonical ohne Fragment, OG. */
export function futterrechnerMetadata(key: SeitenKey): Metadata {
  const m = META[key];
  return {
    title: { absolute: m.title },
    description: m.description,
    alternates: pageAlternates(m.path),
    openGraph: { type: "website", locale: "de_DE", siteName: SITE.name, url: m.path, title: m.title, description: m.description, images: [DEFAULT_OG_IMAGE] },
    twitter: { card: "summary_large_image", title: m.title, description: m.description, images: [DEFAULT_OG_IMAGE] },
  };
}
