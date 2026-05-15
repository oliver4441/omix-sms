import { PrismaClient } from "@prisma/client";
import { PrismaClient as LocalPrismaClient } from "@/generated/local-client";

// ─── Primary Database Client (Supabase PostgreSQL) ───
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ─── Secondary Database Client (SQLite Local) ───
const globalForLocal = globalThis as unknown as {
  localDb: LocalPrismaClient | undefined;
};

export const localDb = globalForLocal.localDb ?? new LocalPrismaClient();

if (process.env.NODE_ENV !== "production") globalForLocal.localDb = localDb;
