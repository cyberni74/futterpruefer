import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/db";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 5;

class RateLimited extends CredentialsSignin {
  code = "rate_limited";
}

const schema = z.object({ email: z.string().trim().toLowerCase().email().max(200), password: z.string().min(1).max(200) });

async function tooManyFailures(keys: string[]) {
  const since = new Date(Date.now() - WINDOW_MS);
  const counts = await Promise.all(keys.map((key) => prisma.loginAttempt.count({ where: { key, success: false, createdAt: { gte: since } } })));
  return counts.some((c) => c >= MAX_FAILS);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = schema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const h = await headers();
        const ip = (h.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
        const keys = [`email:${email}`, `ip:${ip}`];
        if (await tooManyFailures(keys)) throw new RateLimited();

        const user = await prisma.adminUser.findUnique({ where: { email } });
        // Vergleich immer ausführen, um Timing-Unterschiede zu vermeiden
        const ok = await bcrypt.compare(password, user?.passwordHash ?? "$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva");
        await prisma.loginAttempt.createMany({ data: keys.map((key) => ({ key, success: ok && !!user })) });
        if (!ok || !user) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.uid = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user && typeof token.uid === "string") session.user.id = token.uid;
      return session;
    },
  },
});

/** In jeder Admin-Server-Action und jeder geschützten Route aufrufen. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Nicht autorisiert");
  return session.user;
}
