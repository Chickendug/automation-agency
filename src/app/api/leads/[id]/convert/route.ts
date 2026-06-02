import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPackage } from "@/lib/data/packages";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { packageId, status } = await req.json();

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const existing = await prisma.client.findUnique({ where: { leadId: id } });
  if (existing) {
    return NextResponse.json(existing);
  }

  const resolvedPackageId = packageId ?? lead.recommendedPackageId ?? "missed-call-recovery";
  const pkg = getPackage(resolvedPackageId);

  const client = await prisma.client.create({
    data: {
      leadId: id,
      businessName: lead.businessName,
      phone: lead.phone,
      email: lead.email,
      packageId: resolvedPackageId,
      packageName: pkg?.name ?? null,
      status: status ?? "prospect",
      setupFee: pkg?.setupFee ?? 0,
      monthlyFee: pkg?.monthlyFee ?? 0,
    },
  });

  await prisma.lead.update({
    where: { id },
    data: { callStatus: "interested" },
  });

  return NextResponse.json(client);
}
