import { PrismaClient } from "@prisma/client";

// ─── Primary Database Client (Supabase PostgreSQL) ───
// This is the only export from this module. Middleware/auth depend on this.
// ────────────────────────────────────────────────────────────────────────

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
