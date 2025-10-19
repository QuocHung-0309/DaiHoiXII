// /lib/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

// Lưu Prisma client vào global trong dev để tránh tạo nhiều connection khi HMR
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
