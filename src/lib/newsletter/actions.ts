"use server";
import { brevoConfig, newsletterSchema, type NewsletterState } from "./schema";

/** Double-Opt-In über Brevo: Brevo verschickt die Bestätigungsmail, erst danach wird der Kontakt in die Liste aufgenommen. */
export async function subscribeNewsletter(_prev: NewsletterState, fd: FormData): Promise<NewsletterState> {
  if (String(fd.get("website") ?? "").trim()) return { ok: true, message: "Fast geschafft! Bitte bestätigen Sie die Anmeldung in der E-Mail, die wir Ihnen geschickt haben." };
  const parsed = newsletterSchema.safeParse({ email: fd.get("email"), consent: fd.get("consent") });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Bitte Eingaben prüfen." };
  const cfg = brevoConfig(process.env);
  if (!cfg) return { ok: false, message: "Die Newsletter-Anmeldung wird gerade eingerichtet. Bitte versuchen Sie es in Kürze erneut." };
  try {
    const res = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
      method: "POST",
      headers: { "api-key": cfg.apiKey, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email: parsed.data.email, includeListIds: [cfg.listId], templateId: cfg.templateId, redirectionUrl: cfg.redirectUrl }),
    });
    if (!res.ok && res.status !== 204) {
      const body = (await res.json().catch(() => ({}))) as { code?: string };
      if (body.code === "duplicate_parameter") return { ok: true, message: "Diese Adresse ist bereits angemeldet." };
      console.error("brevo", res.status, body.code);
      return { ok: false, message: "Die Anmeldung hat nicht geklappt. Bitte später erneut versuchen." };
    }
  } catch {
    return { ok: false, message: "Die Anmeldung hat nicht geklappt. Bitte später erneut versuchen." };
  }
  return { ok: true, message: "Fast geschafft! Bitte bestätigen Sie die Anmeldung in der E-Mail, die wir Ihnen geschickt haben." };
}
