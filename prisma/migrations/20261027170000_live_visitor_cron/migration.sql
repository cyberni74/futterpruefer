-- Zeitgesteuerte Löschung des Online-Zählers alle 5 Minuten (zusätzlich zur Löschung bei jedem Ping).
-- pg_cron ist auf Supabase verfügbar, aber evtl. nicht aktiviert. Schlägt etwas fehl (z. B. lokale Entwicklungs-DB ohne pg_cron),
-- bricht die Migration nicht ab; die Löschung bei jedem Ping bleibt bestehen.
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS pg_cron;
  PERFORM cron.schedule(
    'livevisitor-cleanup',
    '*/5 * * * *',
    $job$DELETE FROM "public"."LiveVisitor" WHERE "seenAt" < (now() AT TIME ZONE 'UTC') - interval '10 minutes'$job$
  );
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'pg_cron nicht eingerichtet (%): Löschung nur bei jedem Ping', SQLERRM;
END
$$;
