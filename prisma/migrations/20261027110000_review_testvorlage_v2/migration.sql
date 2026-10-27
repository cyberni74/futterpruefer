-- Testvorlage V2: Opt-in pro Test. Additiv, bestehende Zeilen behalten das bisherige Layout.
ALTER TABLE "Review" ADD COLUMN "layout" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Review" ADD COLUMN "layoutData" JSONB;
