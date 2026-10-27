-- Row Level Security für den Online-Zähler (wie bei allen anderen Tabellen). Zugriff nur serverseitig über Prisma.
ALTER TABLE "public"."LiveVisitor" ENABLE ROW LEVEL SECURITY;
