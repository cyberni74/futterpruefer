import { z } from "zod";

export const contactSchema = z.object({
  kind: z.enum(["allgemein", "hersteller"]),
  name: z.string().trim().min(2, "Bitte Namen angeben.").max(120),
  email: z.string().trim().toLowerCase().email("Bitte gültige E-Mail-Adresse angeben.").max(200),
  company: z.string().trim().max(160).optional().transform((v) => v || undefined),
  message: z.string().trim().min(20, "Bitte mindestens 20 Zeichen schreiben.").max(5000),
  consent: z.literal("on", { message: "Bitte der Datenverarbeitung zustimmen." }),
});

export type ContactState = { ok: boolean; message: string; errors?: Record<string, string>; values?: Record<string, string> };

/** Honeypot gefüllt oder Formular in unter 3 Sekunden abgeschickt → Bot. */
export function looksLikeBot(honeypot: unknown, startedAt: unknown, now = Date.now()): boolean {
  if (typeof honeypot === "string" && honeypot.trim() !== "") return true;
  const t = Number(startedAt);
  if (!Number.isFinite(t) || t <= 0) return true;
  return now - t < 3000;
}

export function parseContact(fd: FormData) {
  return contactSchema.safeParse({
    kind: fd.get("kind"),
    name: fd.get("name"),
    email: fd.get("email"),
    company: fd.get("company") ?? undefined,
    message: fd.get("message"),
    consent: fd.get("consent"),
  });
}
