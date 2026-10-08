import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Anmelden · Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user?.id) redirect("/admin");
  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg-soft px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <Image src="/brand/logo-round-512.png" alt="Futterprüfer.de" width={160} height={160} priority className="mx-auto size-24 rounded-full bg-white" />
          <h1 className="mt-3 text-2xl font-extrabold">Redaktions-Login</h1>
          <p className="mt-1 text-sm text-muted">Futterprüfer.de – Verwaltung</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="inline-flex min-h-11 items-center font-semibold text-brand hover:underline">
            ← Zur Website
          </Link>
        </p>
      </div>
    </main>
  );
}
