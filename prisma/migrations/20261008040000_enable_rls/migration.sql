-- Supabase stellt das Schema "public" über die REST-API (anon/authenticated) bereit.
-- RLS ohne Policies sperrt diesen Zugriff; die App greift über eine eigene Rolle mit BYPASSRLS bzw. als Owner zu.
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlogPost" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductOfMonth" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TickerItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Redirect" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FaqItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContactMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AdminUser" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LoginAttempt" ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    EXECUTE 'REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated';
  END IF;
END $$;
