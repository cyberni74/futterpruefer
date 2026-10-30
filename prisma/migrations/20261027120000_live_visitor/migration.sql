-- Anonymer Online-Zähler: nur zufällige ID und Zeitstempel. Additiv.
CREATE TABLE "LiveVisitor" (
    "id" TEXT NOT NULL,
    "seenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LiveVisitor_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "LiveVisitor_seenAt_idx" ON "LiveVisitor"("seenAt");
