import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { paymentRequestEmail, paymentRequestSms } from "@/lib/data/payments";
import { formatCurrency } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { clientId, channel } = await req.json();
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const settings = await prisma.agencySettings.findUnique({ where: { id: "default" } });
  const paymentLink =
    settings?.stripePaymentLinkSetup ||
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/clients — (add Stripe link in Settings)`;

  const ctx = {
    contactName: client.contactName ?? "there",
    businessName: client.businessName,
    yourName: settings?.yourName ?? "Your Name",
    agencyName: settings?.agencyName ?? "Your Agency",
    packageName: client.packageName ?? "Automation package",
    setupFee: formatCurrency(client.setupFee),
    monthlyFee: formatCurrency(client.monthlyFee) + "/mo",
    paymentLink,
    yourPhone: settings?.yourPhone ?? "",
  };

  await prisma.client.update({
    where: { id: clientId },
    data: {
      setupPaymentStatus: "sent",
      status: "awaiting_payment",
      lastPaymentRequestAt: new Date(),
    },
  });

  const email = paymentRequestEmail(ctx);
  const sms = paymentRequestSms({
    businessName: client.businessName,
    yourName: ctx.yourName,
    setupFee: ctx.setupFee,
    paymentLink,
  });

  if (channel === "sms") return NextResponse.json({ text: sms, channel: "sms" });
  if (channel === "email") return NextResponse.json({ text: email, channel: "email" });
  return NextResponse.json({ email, sms });
}
