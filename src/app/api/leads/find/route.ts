import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizePhone, searchPlaces } from "@/lib/places";

export async function POST(req: NextRequest) {
  const { niche, city, query } = await req.json();
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!niche || !city) {
    return NextResponse.json(
      { error: "niche and city are required" },
      { status: 400 }
    );
  }

  const searchQuery = query || niche;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "missing_api_key",
        message:
          "Add GOOGLE_PLACES_API_KEY to .env — or import leads via CSV on the Leads page.",
      },
      { status: 400 }
    );
  }

  try {
    const places = await searchPlaces(searchQuery, city, apiKey, niche);
    let created = 0;
    let skipped = 0;
    const results = [];

    for (const place of places) {
      const phone = normalizePhone(place.phone);
      if (place.googlePlaceId) {
        const existing = await prisma.lead.findUnique({
          where: { googlePlaceId: place.googlePlaceId },
        });
        if (existing) {
          skipped++;
          results.push({ ...place, status: "duplicate" });
          continue;
        }
      }

      const lead = await prisma.lead.create({
        data: {
          businessName: place.businessName,
          phone,
          website: place.website,
          address: place.address,
          city: place.city,
          niche,
          rating: place.rating,
          reviewCount: place.reviewCount,
          googlePlaceId: place.googlePlaceId,
          painSignals: place.painSignals,
          primaryWeakness: place.primaryWeakness,
          recommendedPackageId: place.recommendedPackageId,
          weaknessScore: place.weaknessScore,
          pitchHook: place.pitchHook,
          source: "google_places",
          callStatus: "not_called",
        },
      });
      created++;
      results.push({ ...lead, status: "created" });
    }

    return NextResponse.json({ created, skipped, total: places.length, results });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Search failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
