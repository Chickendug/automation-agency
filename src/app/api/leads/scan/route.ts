import { NextRequest, NextResponse } from "next/server";
import { searchPlaces } from "@/lib/places";

/** Preview leads + weakness analysis without saving */
export async function POST(req: NextRequest) {
  const { niche, city, query } = await req.json();
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!niche || !city) {
    return NextResponse.json({ error: "niche and city required" }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: "missing_api_key", message: "Add GOOGLE_PLACES_API_KEY to .env" },
      { status: 400 }
    );
  }

  try {
    const leads = await searchPlaces(query || niche, city, apiKey, niche);
    return NextResponse.json({ total: leads.length, leads });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Scan failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
