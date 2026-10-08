-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "analysis" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "claims" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "composition" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "harmfulReason" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "packageSize" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "price" DECIMAL(8,2),
ADD COLUMN     "priceDate" TIMESTAMP(3),
ADD COLUMN     "pricePerDay" DECIMAL(8,2),
ADD COLUMN     "testedAt" TIMESTAMP(3);

-- Kategorie-Slugs für die URL /{kategorie}/{test}
UPDATE "Category" SET slug = 'alleinfuttermittel-hund' WHERE slug = 'alleinfutter-hund';
UPDATE "Category" SET slug = 'alleinfuttermittel-katze' WHERE slug = 'alleinfutter-katze';
UPDATE "Category" SET slug = 'ergaenzungsfuttermittel-hund' WHERE slug = 'ergaenzungsfutter-hund';
UPDATE "Category" SET slug = 'ergaenzungsfuttermittel-katze' WHERE slug = 'ergaenzungsfutter-katze';
