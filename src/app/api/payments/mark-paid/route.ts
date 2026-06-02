import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  billingDayFromDate,
  computeNextMonthlyDue,
  formatBillingPeriod,
} from "@/lib/billing";
export async function POST(req: NextRequest) {
  const { clientId, type, amount, method, notes, billingPeriod } = await req.json();
  if (!clientId || !type) {
    return NextResponse.json({ error: "clientId and type required" }, { status: 400 });
  }

  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const paidAmount = amount ?? (type === "setup" ? client.setupFee : client.monthlyFee);
  const period = billingPeriod ?? formatBillingPeriod();

  await prisma.payment.create({
    data: {
      clientId,
      type,
      amount: paidAmount,
      status: "paid",
      method: method ?? "manual",
      notes: notes ?? null,
      billingPeriod: type === "monthly" ? period : null,
      paidAt: new Date(),
    },
  });

  if (type === "setup") {
    const started = client.startedAt ?? new Date();
    const billingDay = client.monthlyBillingDay ?? billingDayFromDate(started);
    const nextDue = computeNextMonthlyDue(started, billingDay);

    const updated = await prisma.client.update({
      where: { id: clientId },
      data: {
        setupPaymentStatus: "paid",
        setupPaidAt: new Date(),
        setupPaidAmount: paidAmount,
        status: "active",
        startedAt: started,
        monthlyBillingDay: billingDay,
        nextMonthlyDueAt: nextDue,
        monthlyPaymentStatus: "scheduled",
      },
    });
    return NextResponse.json(updated);
  }

  const billingDay =
    client.monthlyBillingDay ??
    billingDayFromDate(client.startedAt ?? new Date());
  const nextDue = computeNextMonthlyDue(new Date(), billingDay);

  const updated = await prisma.client.update({
    where: { id: clientId },
    data: {
      monthlyPaymentStatus: "active",
      lastMonthlyPaidAt: new Date(),
      nextMonthlyDueAt: nextDue,
      monthlyBillingDay: billingDay,
    },
  });

  return NextResponse.json(updated);
}
