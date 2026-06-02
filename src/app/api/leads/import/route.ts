import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizePhone } from "@/lib/places";
import { analyzeLeadWeakness } from "@/lib/weakness-analysis";
import Papa from "papaparse";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const niche = (formData.get("niche") as string) || null;

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const text = await file.text();
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  let created = 0;
  let skipped = 0;

  for (const row of parsed.data) {
    const name =
      row.businessName ||
      row.name ||
      row.Business ||
      row["Business Name"] ||
      row.company;
    if (!name) {
      skipped++;
      continue;
    }

    const phone = normalizePhone(
      row.phone || row.Phone || row.telephone || row.mobile
    );

    const ratingParsed = row.rating ? parseFloat(row.rating) : NaN;
    const rating = Number.isNaN(ratingParsed) ? null : ratingParsed;
    const reviewParsed = row.reviewCount ? parseInt(row.reviewCount, 10) : NaN;
    const reviewCount = Number.isNaN(reviewParsed) ? null : reviewParsed;
    const analysis = analyzeLeadWeakness({
      businessName: name,
      niche,
      phone,
      website: row.website || row.Website || null,
      rating,
      reviewCount,
    });

    const lead = await prisma.lead.create({
      data: {
        businessName: name,
        phone,
        email: row.email || row.Email || null,
        website: row.website || row.Website || null,
        address: row.address || row.Address || null,
        city: row.city || row.City || null,
        state: row.state || row.State || null,
        niche,
        notes: row.notes || null,
        painSignals: analysis.painSignals,
        primaryWeakness: analysis.primaryWeakness,
        recommendedPackageId: analysis.recommendedPackageId,
        weaknessScore: analysis.targetScore,
        pitchHook: analysis.pitchHook,
        source: "csv_import",
        callStatus: "not_called",
      },
    });
    if (lead) created++;
  }

  return NextResponse.json({ created, skipped, total: parsed.data.length });
}
