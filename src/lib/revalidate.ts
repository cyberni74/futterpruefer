import "server-only";
import { revalidatePath } from "next/cache";
import { revalidationPlan, type PathTarget, type RevalidateKind } from "./revalidate-plan";

export function revalidateTargets(targets: PathTarget[]) {
  for (const t of targets) {
    if (t.type) revalidatePath(t.path, t.type);
    else revalidatePath(t.path);
  }
  return targets.map((t) => t.path);
}

/**
 * Nach dem Speichern/Veröffentlichen aufrufen, damit Inhalte sofort live sind.
 * Der Admin ruft das direkt auf; für direkte Datenbankänderungen gibt es POST /api/revalidate (docs/REVALIDATE.md).
 */
export function revalidateContent(kind: RevalidateKind, slugs: Array<string | null | undefined> = [], categories: Array<string | null | undefined> = []) {
  return revalidateTargets(revalidationPlan(kind, slugs, categories));
}
