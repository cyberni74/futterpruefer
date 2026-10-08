-- CreateEnum
CREATE TYPE "Concern" AS ENUM ('UNBEDENKLICH', 'EINGESCHRAENKT', 'BEDENKLICH');

-- CreateTable
CREATE TABLE "LexikonEntry" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "synonyms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "group" TEXT NOT NULL DEFAULT '',
    "concern" "Concern" NOT NULL DEFAULT 'UNBEDENKLICH',
    "shortDescription" TEXT NOT NULL DEFAULT '',
    "assessment" TEXT NOT NULL DEFAULT '',
    "bodyHtml" TEXT NOT NULL DEFAULT '',
    "metaTitle" TEXT NOT NULL DEFAULT '',
    "metaDescription" TEXT NOT NULL DEFAULT '',
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LexikonEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlossaryTerm" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "synonyms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "definition" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlossaryTerm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LexikonEntry_slug_key" ON "LexikonEntry"("slug");

-- CreateIndex
CREATE INDEX "LexikonEntry_status_idx" ON "LexikonEntry"("status");

-- CreateIndex
CREATE UNIQUE INDEX "GlossaryTerm_slug_key" ON "GlossaryTerm"("slug");

-- Supabase: REST-API sperren (siehe enable_rls)
ALTER TABLE "LexikonEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GlossaryTerm" ENABLE ROW LEVEL SECURITY;
CREATE INDEX "LexikonEntry_trgm_idx" ON "LexikonEntry" USING GIN ((lower("name")) gin_trgm_ops);
