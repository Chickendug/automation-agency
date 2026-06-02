import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPackage } from "@/lib/data/packages";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const clients = await prisma.client.findMany({
    where: status ? { status } : undefined,
    orderBy: { updatedAt: "desc" },
    include: { lead: true },
  });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const pkg = body.packageId ? getPackage(body.packageId) : null;

  const client = await prisma.client.create({
    data: {
      leadId: body.leadId ?? null,
      businessName: body.businessName,
      contactName: body.contactName ?? null,
      phone: body.phone ?? null,
      email: body.email ?? null,
      packageId: body.packageId ?? null,
      packageName: pkg?.name ?? body.packageName ?? null,
      status: body.status ?? "prospect",
      setupFee: body.setupFee ?? pkg?.setupFee ?? 0,
      monthlyFee: body.monthlyFee ?? pkg?.monthlyFee ?? 0,
      notes: body.notes ?? null,
    },
  });

  if (body.leadId) {
    await prisma.lead.update({
      where: { id: body.leadId },
      data: { callStatus: "interested" },
    });
  }

  return NextResponse.json(client);
}
