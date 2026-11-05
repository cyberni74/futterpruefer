import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ONLINE_AUFBEWAHRUNG_MS, ONLINE_FENSTER_MS, bremse, gueltigeId, ipSchluessel, istBot } from "@/lib/online";

export const dynamic = "force-dynamic";

const zuSchnell = bremse();
const KEIN_CACHE = { "Cache-Control": "no-store" };

/**
 * Meldet „diese Seite ist offen“ und liefert die Zahl der Besucher der letzten 90 Sekunden.
 * Gespeichert werden nur eine zufällige ID und der Zeitstempel (keine IP, kein User-Agent, kein Cookie).
 * Die IP wird nur als gesalzener Hash im Arbeitsspeicher für die Bremse genutzt. Der Browser sendet nur nach Zustimmung.
 */
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unbekannt";
  if (zuSchnell(ipSchluessel(ip))) return NextResponse.json({ count: null }, { status: 429, headers: KEIN_CACHE });
  // Bots und Crawler werden weder gespeichert noch gezählt
  if (istBot(request.headers.get("user-agent"))) return NextResponse.json({ count: null }, { headers: KEIN_CACHE });
  let id: unknown;
  try {
    id = (await request.json())?.id;
  } catch {
    return NextResponse.json({ count: null }, { status: 400, headers: KEIN_CACHE });
  }
  if (!gueltigeId(id)) return NextResponse.json({ count: null }, { status: 400, headers: KEIN_CACHE });
  try {
    const jetzt = Date.now();
    await prisma.liveVisitor.upsert({ where: { id }, create: { id }, update: { seenAt: new Date(jetzt) } });
    // bei jedem Ping aufräumen, damit nichts länger als ONLINE_AUFBEWAHRUNG_MS (10 Minuten) gespeichert bleibt
    await prisma.liveVisitor.deleteMany({ where: { seenAt: { lt: new Date(jetzt - ONLINE_AUFBEWAHRUNG_MS) } } });
    const count = await prisma.liveVisitor.count({ where: { seenAt: { gte: new Date(jetzt - ONLINE_FENSTER_MS) } } });
    return NextResponse.json({ count }, { headers: KEIN_CACHE });
  } catch (error) {
    // z. B. Tabelle noch nicht migriert: der Zähler bleibt unsichtbar, die Seite läuft normal weiter
    console.error("online: Zähler nicht verfügbar", error);
    return NextResponse.json({ count: null }, { status: 503, headers: KEIN_CACHE });
  }
}
