"use server";
import { prisma } from "@/lib/db";
import { notify } from "@/lib/contact/notify";
import { looksLikeBot } from "@/lib/contact/schema";
import { parseWish, type WishState } from "./schema";

/** Wunschprodukt-Anfragen landen im Anfragen-Posteingang des Admin-Bereichs (kind = "wunsch"). */
export async function submitWish(_prev: WishState, fd: FormData): Promise<WishState> {
  const values = Object.fromEntries(["product", "question", "email"].map((k) => [k, String(fd.get(k) ?? "").slice(0, 1000)]));
  const fail = (message: string, errors?: Record<string, string>): WishState => ({ ok: false, message, errors, values });
  const thanks = "Danke! Ihr Wunsch ist eingegangen. Wir prüfen ihn für einen Test oder einen Fachbeitrag.";
  if (looksLikeBot(fd.get("website"), fd.get("startedAt"))) return { ok: true, message: thanks };

  const parsed = parseWish(fd);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] ??= i.message;
    return fail("Bitte prüfen Sie Ihre Eingaben.", errors);
  }
  const d = parsed.data;
  const since = new Date(Date.now() - 3600_000);
  const recent = await prisma.contactMessage.count({ where: { kind: "wunsch", createdAt: { gte: since }, ...(d.email ? { email: d.email } : {}) } });
  if (recent >= (d.email ? 3 : 30)) return fail("Es gingen gerade viele Wünsche ein. Bitte versuchen Sie es später erneut.");

  await prisma.contactMessage.create({ data: { kind: "wunsch", name: d.product, email: d.email ?? "", message: d.question ?? "(keine Fragen angegeben)" } });
  await notify(`[Testwunsch] ${d.product}`, `Produkt: ${d.product}\n${d.email ? `E-Mail: ${d.email}\n` : ""}\n${d.question ?? "(keine Fragen angegeben)"}`, d.email ?? "no-reply@futterpruefer.de");
  return { ok: true, message: thanks };
}
