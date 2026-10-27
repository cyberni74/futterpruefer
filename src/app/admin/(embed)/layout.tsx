import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Vorschau", robots: { index: false, follow: false, nocache: true } };

/** Seiten ohne Admin-Rahmen (z. B. die Live-Vorschau im iframe). Nur mit Anmeldung. */
export default async function EmbedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");
  return <>{children}</>;
}
