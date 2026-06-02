import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { formatBillingPeriod } from "@/lib/billing";
import { monthlyInvoiceEmail, monthlyInvoiceSms } from "@/lib/data/payments";
import { formatCurrency } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { clientId, channel } = await req.json();
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const settings = await prisma.agencySettings.findUnique({ where: { id: "default" } });
  const period = formatBillingPeriod();
  const paymentLink =
    settings?.stripePaymentLinkMonthly ||
    settings?.stripePaymentLinkSetup ||
    "(add monthly Stripe link in Payments settings)";

  const ctx = {
    contactName: client.contactName ?? "there",
    businessName: client.businessName,
    yourName: settings?.yourName ?? "Your Name",
    agencyName: settings?.agencyName ?? "Your Agency",
    packageName: client.packageName ?? "Automation support",
    monthlyFee: formatCurrency(client.monthlyFee),
    billingPeriod: period,
    paymentLink,
    zellePhone: settings?.zellePhone ?? undefined,
    venmoHandle: settings?.venmoHandle ?? undefined,
    yourPhone: settings?.yourPhone ?? "",
  };

  await prisma.client.update({
    where: { id: clientId },
    data: {
      monthlyPaymentStatus: "sent",
      lastMonthlyRequestAt: new Date(),
    },
  });

  const email = monthlyInvoiceEmail(ctx);
  const sms = monthlyInvoiceSms(ctx);

  if (channel === "sms") return NextResponse.json({ text: sms, channel: "sms" });
  if (channel === "email") return NextResponse.json({ text: email, channel: "email" });
  return NextResponse.json({ email, sms });
}
