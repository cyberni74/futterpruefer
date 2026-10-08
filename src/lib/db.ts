import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { pgConfig } from "@/lib/pg-config";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL ist nicht gesetzt.");
  return new PrismaClient({ adapter: new PrismaPg(pgConfig(connectionString)) });
}

export const prisma = globalForPrisma.prisma ?? createClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
