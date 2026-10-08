"use server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/auth";
import { revalidateContent } from "@/lib/revalidate";
import { faqFormToRaw, faqSchema, toFieldErrors, type ActionResult } from "@/lib/admin/schemas";
import { fail, guard, ok, revalidateAdmin } from "@/lib/admin/guard";

export async function saveFaq(id: string | null, _prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;
  const parsed = faqSchema.safeParse(faqFormToRaw(formData));
  if (!parsed.success) return fail("Bitte die markierten Felder korrigieren.", toFieldErrors(parsed.error));
  try {
    if (id) await prisma.faqItem.update({ where: { id }, data: parsed.data });
    else await prisma.faqItem.create({ data: parsed.data });
  } catch (e) {
    console.error("saveFaq", e);
    return fail("Speichern fehlgeschlagen.");
  }
  revalidateContent("faq");
  revalidateAdmin();
  return ok(id ? "Frage gespeichert." : "Frage angelegt.");
}

export async function deleteFaq(id: string) {
  await requireAdmin();
  await prisma.faqItem.delete({ where: { id } });
  revalidateContent("faq");
  revalidateAdmin();
  return { ok: true, message: "Gelöscht." };
}
