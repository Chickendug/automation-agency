import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { analyzeLeadWeakness } from "../src/lib/weakness-analysis";

const url = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

const SAMPLE_LEADS = [
  { businessName: "Summit Air HVAC", phone: "6025550101", city: "Phoenix, AZ", niche: "HVAC / plumbing", painSignals: "Few reviews; likely busy on jobs" },
  { businessName: "Desert Flow Plumbing", phone: "6025550102", city: "Phoenix, AZ", niche: "HVAC / plumbing", painSignals: "No website listed" },
  { businessName: "Cool Breeze Mechanical", phone: "6025550103", city: "Phoenix, AZ", niche: "HVAC / plumbing", painSignals: "Established — may have budget" },
  { businessName: "Premier Dental Studio", phone: "4805550201", city: "Scottsdale, AZ", niche: "Dental offices", painSignals: "High rating; busy practice" },
  { businessName: "Smile Path Dentistry", phone: "4805550202", city: "Scottsdale, AZ", niche: "Dental offices", painSignals: "Low rating (3.8)" },
  { businessName: "Elite Med Spa AZ", phone: "4805550301", city: "Scottsdale, AZ", niche: "Med spas", painSignals: "No online booking visible" },
  { businessName: "Apex Roofing Solutions", phone: "6235550401", city: "Glendale, AZ", niche: "Roofing / contractors", painSignals: "Seasonal demand — missed calls costly" },
  { businessName: "Valley Electric & HVAC", phone: "6235550402", city: "Glendale, AZ", niche: "HVAC / plumbing", painSignals: "Cell only — owner-operator" },
  { businessName: "Luxe Salon Collective", phone: "6025550501", city: "Phoenix, AZ", niche: "Salons / barbers", painSignals: "Booking mentions in reviews" },
  { businessName: "Iron Forge Gym", phone: "6025550601", city: "Phoenix, AZ", niche: "Gyms / fitness", painSignals: "Front desk may miss calls" },
];

async function main() {
  await prisma.agencySettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      agencyName: "RapidFlow Automations",
      yourName: "Your Name Here",
      yourPhone: "",
      yourEmail: "",
      defaultNiche: "HVAC / plumbing",
      defaultCity: "Phoenix, AZ",
      defaultPackageId: "missed-call-recovery",
      onboardingDone: false,
    },
    update: {},
  });

  let created = 0;
  for (const lead of SAMPLE_LEADS) {
    const exists = await prisma.lead.findFirst({
      where: { businessName: lead.businessName, phone: lead.phone },
    });
    if (exists) continue;

    const analysis = analyzeLeadWeakness({
      businessName: lead.businessName,
      niche: lead.niche,
      phone: lead.phone,
    });

    await prisma.lead.create({
      data: {
        ...lead,
        painSignals: analysis.painSignals,
        primaryWeakness: analysis.primaryWeakness,
        recommendedPackageId: analysis.recommendedPackageId,
        weaknessScore: analysis.targetScore,
        pitchHook: analysis.pitchHook,
        source: "seed",
        callStatus: "not_called",
      },
    });
    created++;
  }

  console.log(`Seed complete: ${created} sample leads added (skips duplicates).`);
  console.log("Update Settings with your real name/phone before dialing.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
