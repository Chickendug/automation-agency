import { getPackage } from "@/lib/data/packages";

export type WeaknessId =
  | "missed_calls"
  | "lead_followup"
  | "reputation"
  | "appointments"
  | "online_presence";

export type WeaknessSignal = {
  id: string;
  label: string;
  severity: "high" | "medium" | "low";
};

export type WeaknessAnalysis = {
  primaryWeakness: WeaknessId;
  primaryLabel: string;
  recommendedPackageId: string;
  recommendedPackageName: string;
  pitchHook: string;
  targetScore: number;
  signals: WeaknessSignal[];
  painSignals: string;
};

export type LeadAnalysisInput = {
  businessName: string;
  niche?: string | null;
  phone?: string | null;
  website?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
};

const WEAKNESS_LABELS: Record<WeaknessId, string> = {
  missed_calls: "Missed calls / slow phone response",
  lead_followup: "Slow lead follow-up",
  reputation: "Weak online reputation",
  appointments: "No-shows & booking chaos",
  online_presence: "Weak online presence",
};

const PACKAGE_BY_WEAKNESS: Record<WeaknessId, string> = {
  missed_calls: "missed-call-recovery",
  lead_followup: "lead-follow-up",
  reputation: "review-reputation",
  appointments: "appointment-reminders",
  online_presence: "missed-call-recovery",
};

/** Niche → default weakness when signals are tied */
const NICHE_DEFAULT_WEAKNESS: Record<string, WeaknessId> = {
  "HVAC / plumbing": "missed_calls",
  "Roofing / contractors": "missed_calls",
  "Dental offices": "appointments",
  "Med spas": "appointments",
  "Salons / barbers": "appointments",
  "Gyms / fitness": "lead_followup",
  "Law firms": "lead_followup",
  "Real estate agents": "lead_followup",
  "Property management": "lead_followup",
  "Auto repair": "missed_calls",
  "Restaurants": "missed_calls",
  "General local services": "missed_calls",
};

function nicheKey(niche: string | null | undefined): string {
  if (!niche) return "General local services";
  const found = Object.keys(NICHE_DEFAULT_WEAKNESS).find(
    (k) => niche.toLowerCase().includes(k.split("/")[0].trim().toLowerCase().slice(0, 4))
  );
  return found ?? niche;
}

function scoreMissedCalls(input: LeadAnalysisInput, niche: string): { score: number; signals: WeaknessSignal[] } {
  const signals: WeaknessSignal[] = [];
  let score = 40;

  const fieldNiches = ["hvac", "plumb", "roof", "contract", "electric", "auto", "restaurant"];
  const isField = fieldNiches.some((k) => niche.toLowerCase().includes(k));

  if (isField) {
    score += 35;
    signals.push({
      id: "field_niche",
      label: "On-the-job niche — likely misses calls while busy",
      severity: "high",
    });
  }

  if (!input.phone) {
    score += 15;
    signals.push({ id: "no_phone", label: "No phone on Google — hard for customers to reach them", severity: "high" });
  }

  if (input.rating !== null && input.rating !== undefined && input.rating < 4.2) {
    score += 10;
    signals.push({
      id: "rating_calls",
      label: "Lower rating — reviews may mention hard to reach / no answer",
      severity: "medium",
    });
  }

  return { score: Math.min(score, 100), signals };
}

function scoreLeadFollowup(input: LeadAnalysisInput, niche: string): { score: number; signals: WeaknessSignal[] } {
  const signals: WeaknessSignal[] = [];
  let score = 25;

  const leadNiches = ["law", "real estate", "property", "gym", "fitness"];
  if (leadNiches.some((k) => niche.toLowerCase().includes(k))) {
    score += 40;
    signals.push({
      id: "lead_niche",
      label: "High competition for speed-to-lead in this niche",
      severity: "high",
    });
  }

  if (input.website) {
    score += 10;
    signals.push({
      id: "has_site",
      label: "Has website — likely web forms need instant auto-reply",
      severity: "medium",
    });
  } else {
    score += 5;
  }

  return { score: Math.min(score, 100), signals };
}

function scoreReputation(input: LeadAnalysisInput): { score: number; signals: WeaknessSignal[] } {
  const signals: WeaknessSignal[] = [];
  let score = 0;

  if (input.rating !== null && input.rating !== undefined) {
    if (input.rating < 3.8) {
      score += 50;
      signals.push({
        id: "low_rating",
        label: `Low Google rating (${input.rating}) — needs more 5-star reviews`,
        severity: "high",
      });
    } else if (input.rating < 4.3) {
      score += 30;
      signals.push({
        id: "mid_rating",
        label: `Rating ${input.rating} — room to improve reputation`,
        severity: "medium",
      });
    }
  }

  if (input.reviewCount !== null && input.reviewCount !== undefined) {
    if (input.reviewCount < 15) {
      score += 35;
      signals.push({
        id: "few_reviews",
        label: `Only ${input.reviewCount} reviews — not enough social proof`,
        severity: "high",
      });
    } else if (input.reviewCount < 40) {
      score += 15;
      signals.push({
        id: "some_reviews",
        label: "Moderate review count — automated review asks would help",
        severity: "medium",
      });
    }
  }

  return { score: Math.min(score, 100), signals };
}

function scoreAppointments(input: LeadAnalysisInput, niche: string): { score: number; signals: WeaknessSignal[] } {
  const signals: WeaknessSignal[] = [];
  let score = 20;

  const apptNiches = ["dental", "med spa", "salon", "barber", "spa", "clinic"];
  if (apptNiches.some((k) => niche.toLowerCase().includes(k))) {
    score += 45;
    signals.push({
      id: "appt_niche",
      label: "Appointment-based business — no-shows cost real money",
      severity: "high",
    });
  }

  if (input.rating !== null && input.rating !== undefined && input.rating < 4.0) {
    score += 10;
    signals.push({
      id: "wait_reviews",
      label: "Reviews may mention wait times or scheduling issues",
      severity: "medium",
    });
  }

  return { score: Math.min(score, 100), signals };
}

function scoreOnlinePresence(input: LeadAnalysisInput): { score: number; signals: WeaknessSignal[] } {
  const signals: WeaknessSignal[] = [];
  let score = 0;

  if (!input.website) {
    score += 55;
    signals.push({
      id: "no_website",
      label: "No website — losing leads to competitors online",
      severity: "high",
    });
  }

  if (!input.phone) {
    score += 20;
    signals.push({ id: "no_phone_online", label: "No listed phone — broken lead capture", severity: "high" });
  }

  return { score: Math.min(score, 100), signals };
}

function buildPitchHook(
  weakness: WeaknessId,
  businessName: string,
  pkgName: string
): string {
  const hooks: Record<WeaknessId, string> = {
    missed_calls: `When you're on a job, do calls to ${businessName} usually go to voicemail? We fix that with instant text-back so you don't lose the job.`,
    lead_followup: `How fast does ${businessName} reply when someone fills out your website or Facebook lead — same day or hours later? We get it under 60 seconds.`,
    reputation: `Are you happy with ${businessName}'s Google reviews, or do you wish you had more 5-stars without chasing people? We automate that.`,
    appointments: `How many no-shows or last-minute cancels does ${businessName} get in a week? We set up auto reminders that cut that down.`,
    online_presence: `A lot of ${businessName}'s customers search online first — are you capturing those leads as well as you could?`,
  };
  return hooks[weakness] ?? `We help businesses like ${businessName} with ${pkgName}. Worth a 10-minute look?`;
}

export function analyzeLeadWeakness(input: LeadAnalysisInput): WeaknessAnalysis {
  const niche = input.niche ?? "General local services";

  const scores: { id: WeaknessId; score: number; signals: WeaknessSignal[] }[] = [
    { id: "missed_calls", ...scoreMissedCalls(input, niche) },
    { id: "lead_followup", ...scoreLeadFollowup(input, niche) },
    { id: "reputation", ...scoreReputation(input) },
    { id: "appointments", ...scoreAppointments(input, niche) },
    { id: "online_presence", ...scoreOnlinePresence(input) },
  ];

  scores.sort((a, b) => b.score - a.score);

  let primary = scores[0];
  if (primary.score < 25) {
    const fallback = NICHE_DEFAULT_WEAKNESS[niche] ?? NICHE_DEFAULT_WEAKNESS[nicheKey(niche)] ?? "missed_calls";
    primary = {
      id: fallback,
      score: 50,
      signals: [
        {
          id: "niche_default",
          label: `Typical pain for ${niche}: ${WEAKNESS_LABELS[fallback]}`,
          severity: "medium",
        },
      ],
    };
  }

  const allSignals = scores.flatMap((s) => s.signals).slice(0, 6);
  const packageId = PACKAGE_BY_WEAKNESS[primary.id];
  const pkg = getPackage(packageId);

  const targetScore = Math.min(
    100,
    primary.score + (input.phone ? 10 : 0) + (primary.score >= 40 ? 15 : 0)
  );

  return {
    primaryWeakness: primary.id,
    primaryLabel: WEAKNESS_LABELS[primary.id],
    recommendedPackageId: packageId,
    recommendedPackageName: pkg?.name ?? "Missed Call Recovery System",
    pitchHook: buildPitchHook(primary.id, input.businessName, pkg?.name ?? "automation"),
    targetScore,
    signals: allSignals,
    painSignals: allSignals.map((s) => s.label).join("; "),
  };
}

export const WEAKNESS_OPTIONS = (Object.keys(WEAKNESS_LABELS) as WeaknessId[]).map((id) => ({
  id,
  label: WEAKNESS_LABELS[id],
  packageId: PACKAGE_BY_WEAKNESS[id],
}));
