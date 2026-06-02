import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const paymentFields = [
  "stripePaymentLinkSetup",
  "stripePaymentLinkMonthly",
  "paypalEmail",
  "venmoHandle",
  "zellePhone",
  "bankTransferNotes",
  "invoicePrefix",
  "collectTax",
] as const;

export async function GET() {
  const settings = await prisma.agencySettings.upsert({
    where: { id: "default" },
    create: { id: "default" },
    update: {},
  });
  return NextResponse.json({
    ...settings,
    stripeApiConfigured: !!process.env.STRIPE_SECRET_KEY,
  });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const paymentUpdate = Object.fromEntries(
    paymentFields
      .filter((f) => body[f] !== undefined)
      .map((f) => [f, body[f]])
  );

  const settings = await prisma.agencySettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      agencyName: body.agencyName ?? "Your Automation Agency",
      yourName: body.yourName,
      yourPhone: body.yourPhone,
      yourEmail: body.yourEmail,
      defaultNiche: body.defaultNiche ?? "HVAC / plumbing",
      defaultCity: body.defaultCity,
      defaultPackageId: body.defaultPackageId ?? "missed-call-recovery",
      onboardingDone: body.onboardingDone ?? false,
      ...paymentUpdate,
    },
    update: {
      ...(body.agencyName !== undefined && { agencyName: body.agencyName }),
      ...(body.yourName !== undefined && { yourName: body.yourName }),
      ...(body.yourPhone !== undefined && { yourPhone: body.yourPhone }),
      ...(body.yourEmail !== undefined && { yourEmail: body.yourEmail }),
      ...(body.defaultNiche !== undefined && { defaultNiche: body.defaultNiche }),
      ...(body.defaultCity !== undefined && { defaultCity: body.defaultCity }),
      ...(body.defaultPackageId !== undefined && {
        defaultPackageId: body.defaultPackageId,
      }),
      ...(body.onboardingDone !== undefined && { onboardingDone: body.onboardingDone }),
      ...paymentUpdate,
    },
  });
  return NextResponse.json({
    ...settings,
    stripeApiConfigured: !!process.env.STRIPE_SECRET_KEY,
  });
}
