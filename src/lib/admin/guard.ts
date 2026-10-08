import "server-only";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/auth";
import type { ActionResult } from "@/lib/admin/schemas";

/** Prüft die Admin-Session; gibt bei Fehler ein ActionResult zurück. */
export async function guard(): Promise<ActionResult | null> {
  try {
    await requireAdmin();
    return null;
  } catch {
    return fail("Nicht angemeldet – bitte erneut einloggen.");
  }
}

export function fail(message: string, fieldErrors?: Record<string, string>): ActionResult {
  return { ok: false, message, fieldErrors, at: Date.now() };
}

export function ok(message: string): ActionResult {
  return { ok: true, message, at: Date.now() };
}

export function revalidateAdmin() {
  revalidatePath("/admin", "layout");
}
