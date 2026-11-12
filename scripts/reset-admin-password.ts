/**
 * Setzt das Passwort eines bestehenden Admin-Kontos neu.
 *
 * Liest das neue Passwort nur aus FUTTERPRUEFER_ADMIN_PASSWORD (mindestens
 * 12 Zeichen). Die Ziel-Adresse kommt aus FUTTERPRUEFER_ADMIN_EMAIL, sonst
 * info@futterpruefer.de. Die Verbindung kommt aus DIRECT_URL, sonst
 * DATABASE_URL (dieselben Variablen wie die App; Werte nicht ins Repo).
 *
 * Aufruf, Passwort nur in der Shell, nicht in der Datei:
 *   FUTTERPRUEFER_ADMIN_PASSWORD='…' npx tsx scripts/reset-admin-password.ts
 *
 * Legt kein Konto an und gibt weder Passwort noch Hash noch Verbindungs-URL aus.
 * Der nächste Deploy überschreibt den Hash wieder, wenn in Vercel ADMIN_PASSWORD
 * (mindestens 12 Zeichen) gesetzt ist und ADMIN_EMAIL dieselbe Adresse hat.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { pgConfig } from "../src/lib/pg-config";

const MIN_LENGTH = 12;
const BCRYPT_COST = 12;
const DEFAULT_EMAIL = "info@futterpruefer.de";

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function targetEmail(): string {
  const email = (process.env.FUTTERPRUEFER_ADMIN_EMAIL ?? DEFAULT_EMAIL).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    fail("FUTTERPRUEFER_ADMIN_EMAIL ist keine gültige E-Mail-Adresse. Datenbank unverändert.");
  }
  return email;
}

function connectionString(): string {
  const raw = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!raw) fail("DATABASE_URL oder DIRECT_URL fehlt. Datenbank unverändert.");
  const hostOverride = process.env.DB_HOST_OVERRIDE?.trim();
  if (!hostOverride) return raw;
  try {
    const url = new URL(raw);
    url.hostname = hostOverride;
    return url.toString();
  } catch {
    fail("DATABASE_URL oder DIRECT_URL ist keine gültige URL. Datenbank unverändert.");
  }
}

async function main() {
  const password = process.env.FUTTERPRUEFER_ADMIN_PASSWORD;
  if (!password || password.length < MIN_LENGTH) {
    fail("FUTTERPRUEFER_ADMIN_PASSWORD fehlt oder ist kürzer als 12 Zeichen. Datenbank unverändert.");
  }

  const email = targetEmail();
  const prisma = new PrismaClient({ adapter: new PrismaPg(pgConfig(connectionString())) });
  try {
    const existing = await prisma.adminUser.findUnique({ where: { email }, select: { id: true } });
    if (!existing) {
      fail(`Kein Admin-Konto für ${email}. Nichts angelegt, Datenbank unverändert.`);
    }
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
    await prisma.adminUser.update({ where: { email }, data: { passwordHash } });
    const cleared = await prisma.loginAttempt.deleteMany({ where: { key: `email:${email}` } });
    console.log(`Passwort-Hash für ${email} aktualisiert (bcrypt, Kostenfaktor ${BCRYPT_COST}).`);
    console.log(`Fehlversuche dieser Adresse gelöscht: ${cleared.count}. Eine IP-Sperre läuft nach 15 Minuten von selbst ab.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(() => {
  console.error("Aktualisierung fehlgeschlagen. Verbindung prüfen, ohne URL oder Passwort auszugeben.");
  process.exit(1);
});
