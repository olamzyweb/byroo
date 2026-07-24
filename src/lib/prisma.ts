import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

let prisma: PrismaClient;

const getPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "postgresql://postgres:postgres@db.") + ":5432/postgres";

  if (!process.env.DATABASE_URL) {
    console.warn(
      "⚠️ DATABASE_URL environment variable is missing. Please configure it in your .env.local file to connect to the database via Prisma."
    );
  }

  try {
    const pool = new pg.Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000,
    });

    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  } catch (error) {
    console.error("❌ Failed to initialize Prisma adapter:", error);
    // Fallback client for build steps where DB might be offline
    return new PrismaClient();
  }
};

if (process.env.NODE_ENV === "production") {
  prisma = getPrismaClient();
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma?: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = getPrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

export { prisma };
