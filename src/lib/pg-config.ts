import type { PoolConfig } from "pg";

/**
 * Verbindungsoptionen für den pg-Treiber.
 * Lokal ohne SSL; entfernte Hosts (z. B. Supabase Supavisor) mit TLS. Supabase signiert mit eigener CA,
 * daher ohne CA-Prüfung, solange kein SUPABASE_CA_CERT hinterlegt ist.
 */
export function pgConfig(connectionString: string): PoolConfig {
  const host = (() => {
    try {
      return new URL(connectionString).hostname;
    } catch {
      return "";
    }
  })();
  const local = host === "" || host === "localhost" || host === "127.0.0.1";
  const ca = process.env.SUPABASE_CA_CERT?.replace(/\\n/g, "\n");
  return {
    connectionString,
    max: local ? 10 : 3,
    ...(local ? {} : { ssl: ca ? { ca, rejectUnauthorized: true } : { rejectUnauthorized: false } }),
  };
}
