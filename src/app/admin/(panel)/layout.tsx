import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/admin/admin-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin | Futterprüfer" },
  robots: { index: false, follow: false, nocache: true },
};

async function logout() {
  "use server";
  await signOut({ redirectTo: "/admin/login" });
}

function LogoutButton({ compact = false }: { compact?: boolean }) {
  return (
    <form action={logout}>
      <button
        type="submit"
        className={`inline-flex min-h-11 items-center gap-2 rounded-xl text-sm font-semibold text-fg hover:bg-bg-soft ${compact ? "size-11 justify-center" : "w-full px-3"}`}
        aria-label={compact ? "Abmelden" : undefined}
      >
        <LogOut className="size-5" aria-hidden />
        {!compact && "Abmelden"}
      </button>
    </form>
  );
}

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");
  const unread = await prisma.contactMessage.count({ where: { read: false } });

  return (
    <div className="min-h-dvh bg-bg-soft lg:flex">
      <a href="#admin-main" className="skip-link">
        Zum Inhalt springen
      </a>

      {/* Desktop-Seitenleiste */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-surface p-4 lg:flex">
        <Link href="/admin" className="mb-6 flex min-h-11 items-center gap-2 px-2 font-display text-lg font-extrabold">
          <Image src="/brand/logo-round-512.png" alt="" width={64} height={64} className="size-10 rounded-full bg-white" />
          Futterprüfer <span className="text-xs font-semibold text-muted">Admin</span>
        </Link>
        <AdminNav unread={unread} variant="sidebar" />
        <div className="mt-auto space-y-1 border-t border-border pt-4">
          <Link href="/" target="_blank" className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold hover:bg-bg-soft">
            <ExternalLink className="size-5" aria-hidden /> Website ansehen
          </Link>
          <LogoutButton />
          <div className="flex items-center justify-between px-3 pt-2 text-xs text-muted">
            <span className="truncate" title={session.user.email ?? ""}>
              {session.user.name ?? session.user.email}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Mobile Kopfzeile */}
        <header className="sticky top-0 z-30 border-b border-border bg-surface/95 px-4 pt-2 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex min-h-11 items-center gap-2 font-display font-extrabold">
              <Image src="/brand/logo-round-512.png" alt="" width={64} height={64} className="size-9 rounded-full bg-white" />
              Admin
            </Link>
            <div className="flex items-center">
              <Link href="/" target="_blank" className="inline-flex size-11 items-center justify-center rounded-xl hover:bg-bg-soft" aria-label="Website ansehen">
                <ExternalLink className="size-5" aria-hidden />
              </Link>
              <ThemeToggle />
              <LogoutButton compact />
            </div>
          </div>
          <AdminNav unread={unread} variant="top" />
        </header>

        <main id="admin-main" className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
