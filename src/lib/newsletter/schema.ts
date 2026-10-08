import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Bitte gültige E-Mail-Adresse angeben.").max(200),
  consent: z.literal("on", { message: "Bitte der Anmeldung zustimmen." }),
});

export type NewsletterState = { ok: boolean; message: string };

export type BrevoConfig = { apiKey: string; listId: number; templateId: number; redirectUrl: string };

/** Liest die Brevo-Konfiguration; null, wenn unvollständig. */
export function brevoConfig(env: Record<string, string | undefined>): BrevoConfig | null {
  const apiKey = env.BREVO_API_KEY?.trim();
  const listId = Number(env.BREVO_LIST_ID);
  const templateId = Number(env.BREVO_DOI_TEMPLATE_ID);
  const site = (env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  if (!apiKey || !Number.isInteger(listId) || listId <= 0 || !Number.isInteger(templateId) || templateId <= 0 || !site) return null;
  return { apiKey, listId, templateId, redirectUrl: `${site}/newsletter/bestaetigt` };
}
