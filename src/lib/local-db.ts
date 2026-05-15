// ─── Local SQLite Database Client ───
// This file is intentionally separate from prisma.ts to prevent Turbopack
// from tracing the SQLite WASM engine into Edge Runtime (middleware).
//
// The require() call is hidden through indirect eval to bypass static analysis.
// This module is ONLY safe to import from Node.js server components/APIs.
// Do NOT import in middleware or any file that middleware transitively imports.
// ────────────────────────────────────────────────────────────────────────

// Type-only import — erased at compile time, no module loading
type LocalClientType = import("@/generated/local-client").PrismaClient;

const globalForLocal = globalThis as unknown as {
  localDb: LocalClientType | undefined;
};

/**
 * Get or create the local SQLite Prisma client instance.
 * Uses indirect eval to hide the require() call from Turbopack's static analysis,
 * preventing Edge Runtime errors (setImmediate not available).
 *
 * Only call this from Node.js server components, not from middleware or Edge routes.
 */
export function getLocalDb(): LocalClientType {
  if (globalForLocal.localDb) return globalForLocal.localDb;

  // Indirect eval — Turbopack CANNOT statically trace eval()
  // This is safe because getLocalDb() is only ever called on the Node.js server
  const modPath = "@/generated/local-client";
  const nodeRequire = eval("require");
  const mod = nodeRequire(modPath);
  const db = new mod.PrismaClient() as LocalClientType;

  if (process.env.NODE_ENV !== "production") globalForLocal.localDb = db;
  return db;
}
