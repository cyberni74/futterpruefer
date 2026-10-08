-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "contentImageAlt" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "contentImageBlur" TEXT,
ADD COLUMN     "contentImageUrl" TEXT;
