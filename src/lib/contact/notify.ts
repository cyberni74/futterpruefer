export async function notify(subject: string, text: string, replyTo: string) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.CONTACT_FROM_EMAIL ?? "Futterprüfer <kontakt@futterpruefer.de>", to: [to], reply_to: replyTo, subject, text }),
  }).catch(() => {});
}
