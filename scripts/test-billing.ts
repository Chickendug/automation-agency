import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const period = "2026-06";
  const clients = await prisma.client.findMany({
    where: { status: "active", setupPaymentStatus: "paid" },
    orderBy: { nextMonthlyDueAt: "asc" },
    include: {
      payments: {
        where: { type: "monthly", billingPeriod: period, status: "paid" },
        take: 1,
      },
    },
  });
  console.log("ok", clients.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
