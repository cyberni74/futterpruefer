-- Lexikon-Langartikel: H1, Bilder und FAQ. Additiv, bestehende Zeilen bleiben leer.
ALTER TABLE "LexikonEntry" ADD COLUMN "headline" TEXT NOT NULL DEFAULT '';
ALTER TABLE "LexikonEntry" ADD COLUMN "images" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "LexikonEntry" ADD COLUMN "faqs" JSONB NOT NULL DEFAULT '[]';
