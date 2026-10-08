import { auth } from "@/auth";
import { AI_MAX_TOKENS, AI_MODEL, buildPrompt, createRateLimiter, extractJson, normalizeAiResult, sanitizeContext } from "@/lib/admin/ai";

export const dynamic = "force-dynamic";

const allow = createRateLimiter(20, 60_000);

function error(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return error("Nicht angemeldet.", 401);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return error("KI nicht konfiguriert (ANTHROPIC_API_KEY fehlt)", 503);

  const raw = await request.text();
  if (raw.length > 20_000) return error("Anfrage zu groß.", 413);
  let body: { task?: unknown; kind?: unknown; context?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return error("Ungültige Anfrage.", 400);
  }
  const task = body.task === "keywords" ? "keywords" : body.task === "meta" ? "meta" : null;
  const kind = body.kind === "blog" ? "blog" : "review";
  if (!task) return error("Unbekannte Aufgabe.", 400);
  const ctx = sanitizeContext(body.context);
  if (!ctx.title) return error("Bitte zuerst einen Titel eingeben.", 400);

  if (!allow()) return error("Zu viele KI-Anfragen – bitte eine Minute warten.", 429);

  let res: Response;
  try {
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: AI_MODEL,
        max_tokens: AI_MAX_TOKENS,
        messages: [{ role: "user", content: buildPrompt(task, kind, ctx) }],
      }),
      signal: AbortSignal.timeout(30_000),
    });
  } catch (e) {
    console.error("ai: fetch", e);
    return error("KI-Dienst nicht erreichbar.", 502);
  }
  if (!res.ok) {
    console.error("ai: status", res.status, (await res.text().catch(() => "")).slice(0, 500));
    return error(`KI-Dienst meldet einen Fehler (${res.status}).`, 502);
  }

  try {
    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = (data.content ?? []).filter((c) => c.type === "text").map((c) => c.text ?? "").join("");
    return Response.json(normalizeAiResult(task, extractJson(text)));
  } catch (e) {
    console.error("ai: parse", e);
    return error("Die KI-Antwort konnte nicht gelesen werden – bitte erneut versuchen.", 502);
  }
}
