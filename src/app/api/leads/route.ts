import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizePhone } from "@/lib/places";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const callable = req.nextUrl.searchParams.get("callable") === "true";
  const niche = req.nextUrl.searchParams.get("niche");
  const q = req.nextUrl.searchParams.get("q");
  const sort = req.nextUrl.searchParams.get("sort");

  const CALLABLE_STATUSES = ["not_called", "no_answer", "voicemail", "callback"];

  const orderBy =
    sort === "weakness"
      ? [{ weaknessScore: "desc" as const }, { createdAt: "desc" as const }]
      : [{ callbackAt: "asc" as const }, { createdAt: "desc" as const }];

  const leads = await prisma.lead.findMany({
    where: {
      ...(callable
        ? { callStatus: { in: CALLABLE_STATUSES } }
        : status
          ? { callStatus: status }
          : {}),
      ...(niche ? { niche } : {}),
      ...(q
        ? {
            OR: [
              { businessName: { contains: q } },
              { phone: { contains: q } },
              { city: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy,
    include: { client: true, _count: { select: { callLogs: true } } },
  });

  return NextResponse.json(leads);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const phone = normalizePhone(body.phone);

  const lead = await prisma.lead.create({
    data: {
      businessName: body.businessName,
      phone,
      email: body.email ?? null,
      website: body.website ?? null,
      address: body.address ?? null,
      city: body.city ?? null,
      state: body.state ?? null,
      niche: body.niche ?? null,
      rating: body.rating ?? null,
      reviewCount: body.reviewCount ?? null,
      googlePlaceId: body.googlePlaceId ?? null,
      painSignals: body.painSignals ?? null,
      notes: body.notes ?? null,
      source: body.source ?? "manual",
    },
  });

  return NextResponse.json(lead);
}
