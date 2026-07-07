import { PrismaClient } from "@/generated/inventory-client";

const globalForPrismaInv = global as unknown as { prismaInv: PrismaClient };

export const prismaInv =
  globalForPrismaInv.prismaInv ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrismaInv.prismaInv = prismaInv;
