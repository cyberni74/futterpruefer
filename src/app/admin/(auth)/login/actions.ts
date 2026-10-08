"use server";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export type LoginState = { error: string; email: string; at: number } | null;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().slice(0, 200);
  const password = String(formData.get("password") ?? "").slice(0, 200);
  if (!email || !password) return { error: "Bitte E-Mail-Adresse und Passwort eingeben.", email, at: Date.now() };
  try {
    await signIn("credentials", { email, password, redirectTo: "/admin" });
  } catch (e) {
    if (e instanceof AuthError) {
      const code = (e as AuthError & { code?: string }).code;
      if (code === "rate_limited") return { error: "Zu viele Fehlversuche – bitte 15 Minuten warten.", email, at: Date.now() };
      if (e.type === "CredentialsSignin") return { error: "E-Mail-Adresse oder Passwort ist falsch.", email, at: Date.now() };
      return { error: "Anmeldung fehlgeschlagen. Bitte später erneut versuchen.", email, at: Date.now() };
    }
    throw e; // NEXT_REDIRECT bei Erfolg weiterreichen
  }
  return null;
}
