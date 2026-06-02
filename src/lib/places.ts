import { analyzeLeadWeakness } from "@/lib/weakness-analysis";

export type PlaceLead = {
  businessName: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  website: string | null;
  rating: number | null;
  reviewCount: number | null;
  googlePlaceId: string;
  painSignals: string | null;
  primaryWeakness: string;
  recommendedPackageId: string;
  recommendedPackageName: string;
  weaknessScore: number;
  pitchHook: string;
  weaknessSignals: { id: string; label: string; severity: string }[];
};

export async function searchPlaces(
  query: string,
  city: string,
  apiKey: string,
  niche?: string
): Promise<PlaceLead[]> {
  const textQuery = `${query} in ${city}`;
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.businessStatus",
    },
    body: JSON.stringify({
      textQuery,
      maxResultCount: 20,
      languageCode: "en",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Places API error: ${res.status} — ${err}`);
  }

  const data = (await res.json()) as {
    places?: Array<{
      id?: string;
      displayName?: { text?: string };
      formattedAddress?: string;
      nationalPhoneNumber?: string;
      internationalPhoneNumber?: string;
      websiteUri?: string;
      rating?: number;
      userRatingCount?: number;
      businessStatus?: string;
    }>;
  };

  const leads: PlaceLead[] = [];

  for (const place of data.places ?? []) {
    if (place.businessStatus === "CLOSED_PERMANENTLY") continue;
    const id = place.id;
    if (!id) continue;

    const phone =
      place.nationalPhoneNumber ?? place.internationalPhoneNumber ?? null;
    const website = place.websiteUri ?? null;
    const businessName = place.displayName?.text ?? "Unknown";

    const analysis = analyzeLeadWeakness({
      businessName,
      niche: niche ?? query,
      phone,
      website,
      rating: place.rating ?? null,
      reviewCount: place.userRatingCount ?? null,
    });

    leads.push({
      businessName,
      phone,
      address: place.formattedAddress ?? null,
      city,
      website,
      rating: place.rating ?? null,
      reviewCount: place.userRatingCount ?? null,
      googlePlaceId: id,
      painSignals: analysis.painSignals,
      primaryWeakness: analysis.primaryWeakness,
      recommendedPackageId: analysis.recommendedPackageId,
      recommendedPackageName: analysis.recommendedPackageName,
      weaknessScore: analysis.targetScore,
      pitchHook: analysis.pitchHook,
      weaknessSignals: analysis.signals,
    });
  }

  leads.sort((a, b) => b.weaknessScore - a.weaknessScore);

  return leads;
}

export function normalizePhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return digits;
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
  return digits.length >= 10 ? digits : null;
}
