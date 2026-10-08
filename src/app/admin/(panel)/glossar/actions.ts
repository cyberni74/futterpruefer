"use server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/auth";
import { isUniqueViolation, toFieldErrors, type ActionResult } from "@/lib/admin/schemas";
import { glossaryFormToRaw, glossarySchema } from "@/lib/admin/glossary";
import { fail, guard, ok, revalidateAdmin } from "@/lib/admin/guard";
import { revalidateTerms } from "@/lib/admin/revalidate-terms";

export async function saveGlossary(id: string | null, _prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;
  const parsed = glossarySchema.safeParse(glossaryFormToRaw(formData));
  if (!parsed.success) return fail("Bitte die markierten Felder korrigieren.", toFieldErrors(parsed.error));
  try {
    if (id) await prisma.glossaryTerm.update({ where: { id }, data: parsed.data });
    else await prisma.glossaryTerm.create({ data: parsed.data });
  } catch (e) {
    if (isUniqueViolation(e)) return fail("Dieser Slug ist bereits vergeben.", { slug: "Dieser Slug ist bereits vergeben." });
    console.error("saveGlossary", e);
    return fail("Speichern fehlgeschlagen.");
  }
  revalidateTerms();
  revalidateAdmin();
  return ok(id ? "Begriff gespeichert." : "Begriff angelegt.");
}

export async function deleteGlossary(id: string) {
  await requireAdmin();
  await prisma.glossaryTerm.delete({ where: { id } });
  revalidateTerms();
  revalidateAdmin();
  return { ok: true, message: "Gelöscht." };
}
