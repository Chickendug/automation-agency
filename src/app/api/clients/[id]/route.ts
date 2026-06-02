import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();

  const client = await prisma.client.update({
    where: { id },
    data: {
      ...(body.status !== undefined && { status: body.status }),
      ...(body.contactName !== undefined && { contactName: body.contactName }),
      ...(body.email !== undefined && { email: body.email }),
      ...(body.setupFee !== undefined && { setupFee: body.setupFee }),
      ...(body.monthlyFee !== undefined && { monthlyFee: body.monthlyFee }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.setupPaymentStatus !== undefined && {
        setupPaymentStatus: body.setupPaymentStatus,
      }),
      ...(body.monthlyPaymentStatus !== undefined && {
        monthlyPaymentStatus: body.monthlyPaymentStatus,
      }),
      ...(body.status === "active" &&
        !body.startedAt && { startedAt: new Date() }),
      ...(body.monthlyPaymentStatus !== undefined && {
        monthlyPaymentStatus: body.monthlyPaymentStatus,
      }),
      ...(body.monthlyBillingDay !== undefined && {
        monthlyBillingDay: body.monthlyBillingDay,
      }),
      ...(body.nextMonthlyDueAt !== undefined && {
        nextMonthlyDueAt: body.nextMonthlyDueAt ? new Date(body.nextMonthlyDueAt) : null,
      }),
      ...(body.setupPaymentStatus === "paid" &&
        !body.setupPaidAt && {
          setupPaidAt: new Date(),
          setupPaidAmount: body.setupPaidAmount,
        }),
    },
  });

  return NextResponse.json(client);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await prisma.client.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
