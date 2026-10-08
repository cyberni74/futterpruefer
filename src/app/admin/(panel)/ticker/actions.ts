"use server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/auth";
import { revalidateContent } from "@/lib/revalidate";
import { tickerFormToRaw, tickerSchema, toFieldErrors, type ActionResult } from "@/lib/admin/schemas";
import { berlinLocalToDate } from "@/lib/admin/datetime";
import { fail, guard, ok, revalidateAdmin } from "@/lib/admin/guard";

export async function saveTicker(id: string | null, _prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;
  const parsed = tickerSchema.safeParse(tickerFormToRaw(formData));
  if (!parsed.success) return fail("Bitte die markierten Felder korrigieren.", toFieldErrors(parsed.error));
  const v = parsed.data;
  const expiresAt = v.expiresAt ? berlinLocalToDate(v.expiresAt) : null;
  if (v.expiresAt && !expiresAt) return fail("Ungültiges Ablaufdatum.", { expiresAt: "Ungültiges Ablaufdatum." });

  const data = { text: v.text, href: v.href || null, isWarning: v.isWarning, active: v.active, expiresAt };
  try {
    if (id) await prisma.tickerItem.update({ where: { id }, data });
    else await prisma.tickerItem.create({ data });
  } catch (e) {
    console.error("saveTicker", e);
    return fail("Speichern fehlgeschlagen.");
  }
  revalidateContent("ticker");
  revalidateAdmin();
  return ok(id ? "Ticker-Meldung gespeichert." : "Ticker-Meldung angelegt.");
}

export async function deleteTicker(id: string) {
  await requireAdmin();
  await prisma.tickerItem.delete({ where: { id } });
  revalidateContent("ticker");
  revalidateAdmin();
  return { ok: true, message: "Gelöscht." };
}
