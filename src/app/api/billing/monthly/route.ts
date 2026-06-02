import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  billingDayFromDate,
  computeNextMonthlyDue,
  formatBillingPeriod,
  isDue,
} from "@/lib/billing";

export async function GET() {
  try {
  const period = formatBillingPeriod();

  const clients = await prisma.client.findMany({
    where: {
      status: "active",
      setupPaymentStatus: "paid",
    },
    orderBy: { businessName: "asc" },
    include: {
      payments: {
        where: { type: "monthly", status: "paid" },
      },
    },
  });

  const settings = await prisma.agencySettings.findUnique({
    where: { id: "default" },
  });

  const rows = clients.map((c) => {
    let billingDay = c.monthlyBillingDay;
    let nextDue = c.nextMonthlyDueAt;
    const started = c.startedAt ?? c.setupPaidAt ?? c.createdAt;

    if (!billingDay) billingDay = billingDayFromDate(started);
    if (!nextDue) nextDue = computeNextMonthlyDue(started, billingDay);

    const paidThisMonth = c.payments.some(
      (p) => (p as { billingPeriod?: string | null }).billingPeriod === period
    );
    let status = c.monthlyPaymentStatus;

    if (paidThisMonth) {
      status = "active";
    } else if (c.monthlyPaymentStatus === "paused") {
      status = "paused";
    } else if (isDue(nextDue)) {
      const daysPast = Math.floor((Date.now() - nextDue.getTime()) / 86400000);
      if (daysPast > 7) status = "overdue";
      else if (c.monthlyPaymentStatus === "sent") status = "sent";
      else status = "due";
    } else {
      status = "scheduled";
    }

    return {
      id: c.id,
      businessName: c.businessName,
      contactName: c.contactName,
      email: c.email,
      phone: c.phone,
      packageName: c.packageName,
      monthlyFee: c.monthlyFee,
      monthlyBillingDay: billingDay,
      nextMonthlyDueAt: nextDue.toISOString(),
      lastMonthlyPaidAt: c.lastMonthlyPaidAt?.toISOString() ?? null,
      monthlyPaymentStatus: status,
      paidThisMonth,
      billingPeriod: period,
    };
  });

  const dueNow = rows.filter(
    (r) =>
      !r.paidThisMonth &&
      ["due", "overdue", "sent"].includes(r.monthlyPaymentStatus)
  );
  const paid = rows.filter((r) => r.paidThisMonth);
  const upcoming = rows.filter(
    (r) => !r.paidThisMonth && r.monthlyPaymentStatus === "scheduled"
  );

  const mrr = clients.reduce((s, c) => s + c.monthlyFee, 0);
  const atRisk = dueNow.reduce((s, r) => s + r.monthlyFee, 0);

  return NextResponse.json({
    period,
    mrr,
    atRisk,
    stripeMonthlyLink: settings?.stripePaymentLinkMonthly ?? null,
    dueNow,
    paid,
    upcoming,
    all: rows,
  });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Billing failed";
    return NextResponse.json(
      {
        error: message,
        hint: "Run: npx prisma generate && restart npm run dev",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
  const period = formatBillingPeriod();
  const clients = await prisma.client.findMany({
    where: { status: "active", setupPaymentStatus: "paid" },
  });

  let updated = 0;
  for (const c of clients) {
    const started = c.startedAt ?? c.setupPaidAt ?? new Date();
    const billingDay = c.monthlyBillingDay ?? billingDayFromDate(started);
    const nextDue = c.nextMonthlyDueAt ?? computeNextMonthlyDue(started, billingDay);

    const monthlyPaid = await prisma.payment.findMany({
      where: { clientId: c.id, type: "monthly", status: "paid" },
    });
    const paid = monthlyPaid.some(
      (p) => (p as { billingPeriod?: string | null }).billingPeriod === period
    );

    let status = c.monthlyPaymentStatus;
    if (paid) status = "active";
    else if (isDue(nextDue)) status = "due";
    else status = "scheduled";

    await prisma.client.update({
      where: { id: c.id },
      data: {
        monthlyBillingDay: billingDay,
        nextMonthlyDueAt: nextDue,
        monthlyPaymentStatus: status,
      },
    });
    updated++;
  }

  return NextResponse.json({ synced: updated, period });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
