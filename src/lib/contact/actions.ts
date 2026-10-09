"use server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { notify } from "./notify";
import { looksLikeBot, parseContact, type ContactState } from "./schema";

async function verifyTurnstile(token: FormDataEntryValue | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // nicht konfiguriert → nur Honeypot/Zeitprüfung
  if (typeof token !== "string" || !token) return false;
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim();
  const body = new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) });
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const d = (await r.json()) as { success?: boolean };
    return d.success === true;
  } catch {
    return false;
  }
}

export async function submitContact(_prev: ContactState, fd: FormData): Promise<ContactState> {
  const values = Object.fromEntries(["kind", "name", "email", "company", "message"].map((k) => [k, String(fd.get(k) ?? "").slice(0, 5000)]));
  const fail = (message: string, errors?: Record<string, string>): ContactState => ({ ok: false, message, errors, values });
  if (looksLikeBot(fd.get("website"), fd.get("startedAt"))) return { ok: true, message: "Vielen Dank! Ihre Nachricht ist eingegangen." };
  if (!(await verifyTurnstile(fd.get("cf-turnstile-response")))) return fail("Die Spam-Prüfung ist fehlgeschlagen. Bitte erneut versuchen.");

  const parsed = parseContact(fd);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] ??= i.message;
    return fail("Bitte prüfen Sie Ihre Eingaben.", errors);
  }
  const d = parsed.data;
  const recent = await prisma.contactMessage.count({ where: { email: d.email, createdAt: { gte: new Date(Date.now() - 3600_000) } } });
  if (recent >= 3) return fail("Sie haben bereits mehrere Nachrichten gesendet. Bitte versuchen Sie es später erneut.");

  await prisma.contactMessage.create({ data: { kind: d.kind, name: d.name, email: d.email, company: d.company ?? null, message: d.message } });
  await notify(`[${d.kind === "hersteller" ? "Herstelleranfrage" : "Kontakt"}] ${d.name}`, `${d.name} <${d.email}>${d.company ? `\nFirma: ${d.company}` : ""}\n\n${d.message}`, d.email);
  return { ok: true, message: "Vielen Dank! Ihre Nachricht ist eingegangen. Wir melden uns zeitnah." };
}
