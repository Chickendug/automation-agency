import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalLeads,
    notCalled,
    callbacksToday,
    interested,
    totalClients,
    activeClients,
    callsToday,
    settings,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { callStatus: "not_called" } }),
    prisma.lead.count({
      where: {
        callbackAt: {
          gte: today,
          lt: new Date(today.getTime() + 86400000),
        },
      },
    }),
    prisma.lead.count({ where: { callStatus: "interested" } }),
    prisma.client.count(),
    prisma.client.count({ where: { status: "active" } }),
    prisma.callLog.count({
      where: { createdAt: { gte: today } },
    }),
    prisma.agencySettings.findUnique({ where: { id: "default" } }),
  ]);

  const clients = await prisma.client.findMany({
    where: { status: "active" },
    select: { monthlyFee: true, setupFee: true },
  });

  const paidClients = await prisma.client.findMany({
    where: { setupPaymentStatus: "paid" },
    select: { setupFee: true, setupPaidAmount: true },
  });

  const mrr = clients.reduce((sum, c) => sum + c.monthlyFee, 0);
  const setupCollected = paidClients.reduce(
    (sum, c) => sum + (c.setupPaidAmount ?? c.setupFee),
    0
  );
  const awaitingPayment = await prisma.client.count({
    where: { OR: [{ status: "awaiting_payment" }, { setupPaymentStatus: "sent" }] },
  });

  const monthlyDueCount = await prisma.client.count({
    where: {
      status: "active",
      setupPaymentStatus: "paid",
      monthlyPaymentStatus: { in: ["due", "overdue", "sent"] },
    },
  });
  const goal = 10000;

  return NextResponse.json({
    totalLeads,
    notCalled,
    callbacksToday,
    interested,
    totalClients,
    activeClients,
    callsToday,
    mrr,
    mrrGoal: goal,
    setupCollected,
    awaitingPayment,
    monthlyDueCount,
    agencyName: settings?.agencyName ?? "Your Automation Agency",
  });
}
