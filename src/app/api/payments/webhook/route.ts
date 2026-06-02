import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import {
  billingDayFromDate,
  computeNextMonthlyDue,
  formatBillingPeriod,
} from "@/lib/billing";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const clientId = session.metadata?.clientId;
    const paymentType = session.metadata?.paymentType;

    if (clientId) {
      const amount = (session.amount_total ?? 0) / 100;

      await prisma.payment.updateMany({
        where: { externalId: session.id },
        data: { status: "paid", paidAt: new Date(), method: "stripe" },
      });

      if (paymentType === "setup") {
        await prisma.client.update({
          where: { id: clientId },
          data: {
            setupPaymentStatus: "paid",
            setupPaidAt: new Date(),
            setupPaidAmount: amount,
            status: "active",
            startedAt: new Date(),
          },
        });
      } else if (paymentType === "monthly") {
        const client = await prisma.client.findUnique({ where: { id: clientId } });
        const billingDay =
          client?.monthlyBillingDay ??
          billingDayFromDate(client?.startedAt ?? new Date());
        await prisma.client.update({
          where: { id: clientId },
          data: {
            monthlyPaymentStatus: "active",
            lastMonthlyPaidAt: new Date(),
            nextMonthlyDueAt: computeNextMonthlyDue(new Date(), billingDay),
          },
        });
        await prisma.payment.updateMany({
          where: { externalId: session.id },
          data: { billingPeriod: formatBillingPeriod() },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
