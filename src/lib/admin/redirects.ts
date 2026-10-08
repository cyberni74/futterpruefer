export type RedirectPlan = {
  /** Weiterleitung mit diesem Quellpfad löschen (neue URL darf nicht weitergeleitet werden). */
  deleteFromPath: string;
  /** Bestehende Weiterleitungen auf den alten Pfad auf den neuen umbiegen (keine Ketten). */
  retarget: { fromToPath: string; toPath: string } | null;
  /** Neue Weiterleitung alt → neu. */
  upsert: { fromPath: string; toPath: string } | null;
};

export function contentPath(prefix: "tests" | "blog", slug: string): string {
  return `/${prefix}/${slug}`;
}

/** Plant die Weiterleitungs-Änderungen für einen (ggf. geänderten) Slug. */
export function planSlugRedirect(prefix: "tests" | "blog", oldSlug: string | null | undefined, newSlug: string): RedirectPlan {
  const newPath = contentPath(prefix, newSlug);
  if (!oldSlug || oldSlug === newSlug) return { deleteFromPath: newPath, retarget: null, upsert: null };
  const oldPath = contentPath(prefix, oldSlug);
  return {
    deleteFromPath: newPath,
    retarget: { fromToPath: oldPath, toPath: newPath },
    upsert: { fromPath: oldPath, toPath: newPath },
  };
}

/** Minimale Schnittstelle des Prisma-Delegates (testbar ohne Datenbank). */
export type RedirectDelegate = {
  deleteMany(args: { where: { fromPath: string } }): Promise<unknown>;
  updateMany(args: { where: { toPath: string }; data: { toPath: string } }): Promise<unknown>;
  upsert(args: { where: { fromPath: string }; create: { fromPath: string; toPath: string }; update: { toPath: string } }): Promise<unknown>;
};

export async function applyRedirectPlan(redirect: RedirectDelegate, plan: RedirectPlan): Promise<void> {
  await redirect.deleteMany({ where: { fromPath: plan.deleteFromPath } });
  if (plan.retarget) {
    await redirect.updateMany({ where: { toPath: plan.retarget.fromToPath }, data: { toPath: plan.retarget.toPath } });
  }
  if (plan.upsert) {
    await redirect.upsert({
      where: { fromPath: plan.upsert.fromPath },
      create: plan.upsert,
      update: { toPath: plan.upsert.toPath },
    });
  }
}
