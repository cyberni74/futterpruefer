-- Ergänzungsfutter-Bewertung.
-- Bestehende Tests bekommen bewertungsart ALLEINFUTTER. scoreRaw … totalScore werden nicht verändert.

CREATE TYPE "Bewertungsart" AS ENUM ('ALLEINFUTTER', 'ERGAENZUNGSFUTTER');
CREATE TYPE "EfSicherheit" AS ENUM ('OK', 'MITTEL', 'SCHWER');
CREATE TYPE "EfStudienTier" AS ENUM ('HUND', 'KATZE', 'ANDERE_TIERART', 'MENSCH', 'IN_VITRO');
CREATE TYPE "EfEvidenz" AS ENUM ('META_ANALYSE', 'SYSTEMATISCHES_REVIEW', 'RCT', 'KONTROLLIERT_NICHT_RANDOMISIERT', 'BEOBACHTUNG', 'FALLBERICHT', 'IN_VITRO', 'EXPERTENMEINUNG');
CREATE TYPE "EfRichtung" AS ENUM ('POSITIV', 'KEIN_EFFEKT', 'NEGATIV', 'GEMISCHT');
CREATE TYPE "EfDosisEinheit" AS ENUM ('MG', 'G', 'KBE', 'MG_KG_075');

ALTER TABLE "Review" ADD COLUMN "bewertungsart" "Bewertungsart" NOT NULL DEFAULT 'ALLEINFUTTER';
ALTER TABLE "Review" ADD COLUMN "methodikVersion" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Review" ADD COLUMN "efWirkstoffAuswahl" INTEGER;
ALTER TABLE "Review" ADD COLUMN "efWirkstoffAuswahlBegruendung" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Review" ADD COLUMN "efWirkstoffDosierung" INTEGER;
ALTER TABLE "Review" ADD COLUMN "efWirkstoffDosierungBegruendung" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Review" ADD COLUMN "efWerbung" INTEGER;
ALTER TABLE "Review" ADD COLUMN "efWerbungBegruendung" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Review" ADD COLUMN "efTraeger" INTEGER;
ALTER TABLE "Review" ADD COLUMN "efTraegerBegruendung" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Review" ADD COLUMN "efTransparenzMengen" INTEGER;
ALTER TABLE "Review" ADD COLUMN "efTransparenzMengenBegruendung" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Review" ADD COLUMN "efTransparenzUnterlagen" INTEGER;
ALTER TABLE "Review" ADD COLUMN "efTransparenzUnterlagenBegruendung" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Review" ADD COLUMN "efAlibiDosierung" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Review" ADD COLUMN "efKeineReferenzdosis" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Review" ADD COLUMN "efHeilaussage" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Review" ADD COLUMN "efSicherheit" "EfSicherheit" NOT NULL DEFAULT 'OK';
ALTER TABLE "Review" ADD COLUMN "efSicherheitBegruendung" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Review" ADD COLUMN "efTierschutzText" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Review" ADD COLUMN "efTraegerAbzuege" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Review" ADD COLUMN "efPreisTagesdosisEur" DECIMAL(8,2);

CREATE TABLE "ErgaenzungWirkstoff" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mengeMgProTagesdosis" DECIMAL(12,3),
    "referenzMgProKg" DECIMAL(12,3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ErgaenzungWirkstoff_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ErgaenzungStudie" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "wirkstoffId" TEXT NOT NULL,
    "titel" TEXT NOT NULL,
    "autoren" TEXT NOT NULL,
    "jahr" INTEGER NOT NULL,
    "zeitschrift" TEXT NOT NULL DEFAULT '',
    "tierart" "EfStudienTier" NOT NULL,
    "studiendosisJeKg" DECIMAL(14,4),
    "einheit" "EfDosisEinheit",
    "studiendosisOriginal" TEXT NOT NULL DEFAULT '',
    "ergebnisKurz" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "linkFreigabe" BOOLEAN NOT NULL DEFAULT false,
    "evidenzstufe" "EfEvidenz" NOT NULL,
    "richtung" "EfRichtung" NOT NULL,
    "geprueftAm" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ErgaenzungStudie_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Referenzdosis" (
    "id" TEXT NOT NULL,
    "wirkstoff" TEXT NOT NULL,
    "tierart" "Animal" NOT NULL,
    "mgProKgMin" DECIMAL(14,4),
    "mgProKgMax" DECIMAL(14,4),
    "einheit" TEXT NOT NULL DEFAULT 'mg/kg',
    "quelle" TEXT NOT NULL,
    "luecke" BOOLEAN NOT NULL DEFAULT false,
    "stand" TIMESTAMP(3) NOT NULL,
    "hinweis" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Referenzdosis_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ErgaenzungWirkstoff_reviewId_idx" ON "ErgaenzungWirkstoff"("reviewId");
CREATE INDEX "ErgaenzungStudie_reviewId_idx" ON "ErgaenzungStudie"("reviewId");
CREATE INDEX "ErgaenzungStudie_wirkstoffId_idx" ON "ErgaenzungStudie"("wirkstoffId");
CREATE UNIQUE INDEX "Referenzdosis_wirkstoff_tierart_key" ON "Referenzdosis"("wirkstoff", "tierart");

ALTER TABLE "ErgaenzungWirkstoff" ADD CONSTRAINT "ErgaenzungWirkstoff_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ErgaenzungStudie" ADD CONSTRAINT "ErgaenzungStudie_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ErgaenzungStudie" ADD CONSTRAINT "ErgaenzungStudie_wirkstoffId_fkey" FOREIGN KEY ("wirkstoffId") REFERENCES "ErgaenzungWirkstoff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ErgaenzungWirkstoff" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ErgaenzungStudie" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Referenzdosis" ENABLE ROW LEVEL SECURITY;
