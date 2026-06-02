import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizePhone } from "@/lib/places";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { callLogs: { orderBy: { createdAt: "desc" } }, client: true },
  });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();

  const lead = await prisma.lead.update({
    where: { id },
    data: {
      ...(body.businessName !== undefined && { businessName: body.businessName }),
      ...(body.phone !== undefined && { phone: normalizePhone(body.phone) }),
      ...(body.callStatus !== undefined && { callStatus: body.callStatus }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.callbackAt !== undefined && {
        callbackAt: body.callbackAt ? new Date(body.callbackAt) : null,
      }),
      ...(body.lastCalledAt !== undefined && {
        lastCalledAt: body.lastCalledAt ? new Date(body.lastCalledAt) : null,
      }),
    },
  });

  return NextResponse.json(lead);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await prisma.lead.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
