/** Standard-Empfänger aller Formulare (Kontakt, Herstelleranfrage, Testwunsch); per CONTACT_TO_EMAIL überschreibbar. */
const DEFAULT_TO = "bernhardehmer@gmail.com";
/** Ohne eigene verifizierte Domain bei Resend darf nur von dieser Adresse an die E-Mail des Resend-Kontoinhabers gesendet werden. */
const DEFAULT_FROM = "Futterprüfer <onboarding@resend.dev>";

export async function notify(subject: string, text: string, replyTo: string) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    console.warn("[notify] RESEND_API_KEY fehlt – keine E-Mail gesendet (Nachricht liegt im Admin unter „Anfragen“).");
    return;
  }
  const to = process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_TO;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.CONTACT_FROM_EMAIL?.trim() || DEFAULT_FROM, to: [to], reply_to: replyTo, subject, text }),
    });
    if (!res.ok) console.error("[notify] Resend-Fehler", res.status, (await res.text()).slice(0, 300));
  } catch (e) {
    console.error("[notify] E-Mail-Versand fehlgeschlagen", e);
  }
}
