import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { outcome, notes, callbackAt } = await req.json();

  if (!outcome) {
    return NextResponse.json({ error: "outcome required" }, { status: 400 });
  }

  const [log, lead] = await prisma.$transaction([
    prisma.callLog.create({
      data: { leadId: id, outcome, notes: notes ?? null },
    }),
    prisma.lead.update({
      where: { id },
      data: {
        callStatus: outcome,
        lastCalledAt: new Date(),
        callbackAt: callbackAt ? new Date(callbackAt) : null,
        ...(notes && { notes }),
      },
    }),
  ]);

  return NextResponse.json({ log, lead });
}
