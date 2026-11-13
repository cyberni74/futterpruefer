import { NextResponse } from "next/server";
import {
  CONSENT_COOKIE,
  CONSENT_COOKIE_OPTIONS,
  isConsentChoice,
  serializeConsent,
} from "@/lib/consent";

export async function POST(req: Request) {
  let choice: unknown;
  try {
    const body = await req.json();
    choice = body?.choice;
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  if (!isConsentChoice(choice)) {
    return NextResponse.json({ error: "invalid" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  const res = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  res.cookies.set(CONSENT_COOKIE, serializeConsent(choice), CONSENT_COOKIE_OPTIONS);
  return res;
}
