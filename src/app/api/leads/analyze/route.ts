import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { analyzeLeadWeakness } from "@/lib/weakness-analysis";

/** Re-run weakness analysis on all leads (or uncalled only) */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const onlyUncalled = body.onlyUncalled !== false;

  const leads = await prisma.lead.findMany({
    where: onlyUncalled ? { callStatus: "not_called" } : undefined,
  });

  let updated = 0;
  for (const lead of leads) {
    const analysis = analyzeLeadWeakness({
      businessName: lead.businessName,
      niche: lead.niche,
      phone: lead.phone,
      website: lead.website,
      rating: lead.rating,
      reviewCount: lead.reviewCount,
    });

    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        painSignals: analysis.painSignals,
        primaryWeakness: analysis.primaryWeakness,
        recommendedPackageId: analysis.recommendedPackageId,
        weaknessScore: analysis.targetScore,
        pitchHook: analysis.pitchHook,
      },
    });
    updated++;
  }

  return NextResponse.json({ updated });
}

export async function GET() {
  const leads = await prisma.lead.findMany({
    where: { callStatus: "not_called", phone: { not: null } },
    orderBy: { weaknessScore: "desc" },
    take: 100,
  });

  const byWeakness: Record<string, number> = {};
  for (const l of leads) {
    const w = l.primaryWeakness ?? "unknown";
    byWeakness[w] = (byWeakness[w] ?? 0) + 1;
  }

  return NextResponse.json({
    topTargets: leads.slice(0, 10),
    weaknessBreakdown: byWeakness,
    totalScored: leads.length,
  });
}
