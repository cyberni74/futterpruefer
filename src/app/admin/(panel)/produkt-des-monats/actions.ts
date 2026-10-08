"use server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/auth";
import { revalidateContent } from "@/lib/revalidate";
import { MONTHS } from "@/lib/site";
import { pdmFormToRaw, pdmSchema, toFieldErrors, type ActionResult } from "@/lib/admin/schemas";
import { fail, guard, ok, revalidateAdmin } from "@/lib/admin/guard";

export async function savePdm(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;
  const parsed = pdmSchema.safeParse(pdmFormToRaw(formData));
  if (!parsed.success) return fail("Bitte die markierten Felder korrigieren.", toFieldErrors(parsed.error));
  const v = parsed.data;
  const review = await prisma.review.findFirst({ where: { id: v.reviewId, status: "PUBLISHED", publishedAt: { lte: new Date() } }, select: { id: true } });
  if (!review) return fail("Bitte einen veröffentlichten Test wählen.", { reviewId: "Nur veröffentlichte Tests sind möglich." });

  const existing = await prisma.productOfMonth.findUnique({ where: { year_month: { year: v.year, month: v.month } }, select: { id: true } });
  await prisma.productOfMonth.upsert({
    where: { year_month: { year: v.year, month: v.month } },
    create: { year: v.year, month: v.month, reviewId: v.reviewId, reason: v.reason },
    update: { reviewId: v.reviewId, reason: v.reason },
  });
  revalidateContent("pdm");
  revalidateAdmin();
  const label = `${MONTHS[v.month - 1]} ${v.year}`;
  return ok(existing ? `Produkt des Monats ${label} ersetzt.` : `Produkt des Monats ${label} gespeichert.`);
}

export async function deletePdm(id: string) {
  await requireAdmin();
  await prisma.productOfMonth.delete({ where: { id } });
  revalidateContent("pdm");
  revalidateAdmin();
  return { ok: true, message: "Gelöscht." };
}
