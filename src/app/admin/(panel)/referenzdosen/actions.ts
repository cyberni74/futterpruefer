"use server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/auth";
import { isUniqueViolation, toFieldErrors, type ActionResult } from "@/lib/admin/schemas";
import { fail, guard, ok, revalidateAdmin } from "@/lib/admin/guard";
import { z } from "zod";

const schema = z.object({
  wirkstoff: z.string().trim().min(2, { error: "Wirkstoff angeben." }).max(160),
  tierart: z.enum(["HUND", "KATZE"], { error: "Tierart wählen." }),
  mgProKgMin: z.string().trim(),
  mgProKgMax: z.string().trim(),
  einheit: z.string().trim().min(1).max(40),
  quelle: z.string().trim().max(2000),
  luecke: z.boolean(),
  hinweis: z.string().trim().max(2000),
  stand: z.string().trim(),
});

function decimal(raw: string) {
  if (!raw.trim()) return null;
  const n = Number(raw.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function formToRaw(fd: FormData) {
  const on = fd.get("luecke");
  return {
    wirkstoff: String(fd.get("wirkstoff") ?? ""),
    tierart: String(fd.get("tierart") ?? ""),
    mgProKgMin: String(fd.get("mgProKgMin") ?? ""),
    mgProKgMax: String(fd.get("mgProKgMax") ?? ""),
    einheit: String(fd.get("einheit") ?? ""),
    quelle: String(fd.get("quelle") ?? ""),
    luecke: on === "on" || on === "true",
    hinweis: String(fd.get("hinweis") ?? ""),
    stand: String(fd.get("stand") ?? ""),
  };
}

export async function saveReferenzdosis(id: string | null, _prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;
  const parsed = schema.safeParse(formToRaw(formData));
  if (!parsed.success) return fail("Bitte die markierten Felder korrigieren.", toFieldErrors(parsed.error));
  const v = parsed.data;
  const min = decimal(v.mgProKgMin);
  const max = decimal(v.mgProKgMax);
  if (v.mgProKgMin.trim() && min == null) return fail("Mindestwert ist keine Zahl.", { mgProKgMin: "Bitte eine Zahl angeben." });
  if (v.mgProKgMax.trim() && max == null) return fail("Höchstwert ist keine Zahl.", { mgProKgMax: "Bitte eine Zahl angeben." });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v.stand)) return fail("Bitte den Stand als Datum angeben.", { stand: "Datum JJJJ-MM-TT." });
  const data = {
    wirkstoff: v.wirkstoff,
    tierart: v.tierart,
    mgProKgMin: min,
    mgProKgMax: max,
    einheit: v.einheit,
    quelle: v.quelle || "keine Quelle hinterlegt",
    luecke: v.luecke,
    hinweis: v.hinweis,
    stand: new Date(`${v.stand}T12:00:00Z`),
  };
  try {
    if (id) await prisma.referenzdosis.update({ where: { id }, data });
    else await prisma.referenzdosis.create({ data });
  } catch (e) {
    if (isUniqueViolation(e)) return fail("Diesen Wirkstoff gibt es für die Tierart schon.", { wirkstoff: "Schon vorhanden." });
    console.error("saveReferenzdosis", e);
    return fail("Speichern fehlgeschlagen.");
  }
  revalidateAdmin();
  return ok(id ? "Referenzdosis gespeichert." : "Referenzdosis angelegt.");
}

export async function deleteReferenzdosis(id: string) {
  await requireAdmin();
  await prisma.referenzdosis.delete({ where: { id } });
  revalidateAdmin();
  return { ok: true, message: "Gelöscht." };
}
