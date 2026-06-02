import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        error: "stripe_not_configured",
        message: "Add STRIPE_SECRET_KEY to .env — or use Payment Links in Settings",
      },
      { status: 400 }
    );
  }

  const { clientId, type } = await req.json();
  if (!clientId || !["setup", "monthly"].includes(type)) {
    return NextResponse.json({ error: "clientId and type (setup|monthly) required" }, { status: 400 });
  }

  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const settings = await prisma.agencySettings.findUnique({ where: { id: "default" } });
  const amount = type === "setup" ? client.setupFee : client.monthlyFee;
  if (amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const origin = req.nextUrl.origin;
  const label =
    type === "setup"
      ? `${client.packageName ?? "Automation"} — Setup for ${client.businessName}`
      : `${client.packageName ?? "Automation"} — Monthly for ${client.businessName}`;

  const lineItem: Stripe.Checkout.SessionCreateParams.LineItem =
    type === "setup"
      ? {
          price_data: {
            currency: "usd",
            unit_amount: amount * 100,
            product_data: { name: label },
          },
          quantity: 1,
        }
      : {
          price_data: {
            currency: "usd",
            unit_amount: amount * 100,
            recurring: { interval: "month" },
            product_data: { name: label },
          },
          quantity: 1,
        };

  const session = await stripe.checkout.sessions.create({
    mode: type === "setup" ? "payment" : "subscription",
    success_url: `${origin}/clients?paid=1&client=${clientId}`,
    cancel_url: `${origin}/clients?cancel=1`,
    customer_email: client.email ?? undefined,
    metadata: {
      clientId,
      paymentType: type,
      agencyName: settings?.agencyName ?? "Agency",
    },
    line_items: [lineItem],
  });

  await prisma.payment.create({
    data: {
      clientId,
      type,
      amount,
      status: "pending",
      method: "stripe",
      externalId: session.id,
    },
  });

  if (type === "setup") {
    await prisma.client.update({
      where: { id: clientId },
      data: {
        setupPaymentStatus: "sent",
        status: "awaiting_payment",
        lastPaymentRequestAt: new Date(),
        stripeSessionId: session.id,
      },
    });
  }

  return NextResponse.json({ url: session.url, sessionId: session.id });
}
