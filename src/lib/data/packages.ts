export type Package = {
  id: string;
  name: string;
  tagline: string;
  setupFee: number;
  monthlyFee: number;
  deliveryDays: number;
  pitchOneLiner: string;
  includes: string[];
  tools: string[];
  playbookSlug: string;
};

export const PACKAGES: Package[] = [
  {
    id: "missed-call-recovery",
    name: "Missed Call Recovery System",
    tagline: "Never lose a lead when you're on a job or with a client",
    setupFee: 1500,
    monthlyFee: 397,
    deliveryDays: 3,
    pitchOneLiner:
      "When someone calls and you miss it, we text them back instantly and follow up until they book or say no.",
    includes: [
      "Instant SMS when a call is missed",
      "3 automated follow-up texts over 48 hours",
      "Lead logged in CRM/spreadsheet",
      "Weekly summary email to owner",
      "Basic call routing instructions doc",
    ],
    tools: ["Make.com or n8n", "Twilio", "Google Sheet or CRM", "Optional: GoHighLevel"],
    playbookSlug: "missed-call-recovery",
  },
  {
    id: "lead-follow-up",
    name: "Lead Follow-Up Automation",
    tagline: "Speed-to-lead in under 60 seconds",
    setupFee: 1200,
    monthlyFee: 297,
    deliveryDays: 2,
    pitchOneLiner:
      "Every form fill or Facebook lead gets an instant text and email sequence so competitors don't beat you to the reply.",
    includes: [
      "Form/webhook → instant SMS + email",
      "5-touch nurture sequence (3 days)",
      "Owner alert on hot replies",
      "Lead source tagging",
    ],
    tools: ["Make.com or n8n", "Twilio", "Gmail/SendGrid", "Meta Lead Ads or website form"],
    playbookSlug: "lead-follow-up",
  },
  {
    id: "review-reputation",
    name: "Review & Reputation System",
    tagline: "More 5-star reviews without awkward asks",
    setupFee: 800,
    monthlyFee: 197,
    deliveryDays: 2,
    pitchOneLiner:
      "After every visit we automatically ask happy customers for a Google review and route unhappy ones to you privately.",
    includes: [
      "Post-appointment review request SMS",
      "Negative feedback routed to owner first",
      "Monthly review count report",
    ],
    tools: ["Make.com or n8n", "Twilio", "Google Business Profile link"],
    playbookSlug: "review-reputation",
  },
  {
    id: "appointment-reminders",
    name: "Appointment Reminder System",
    tagline: "Cut no-shows and back-and-forth texting",
    setupFee: 1000,
    monthlyFee: 297,
    deliveryDays: 3,
    pitchOneLiner:
      "Automatic reminders 24h and 2h before appointments plus easy confirm/reschedule replies.",
    includes: [
      "24-hour and 2-hour SMS reminders",
      "Confirm / reschedule keyword handling",
      "No-show follow-up message",
      "Calendar integration (Google Cal)",
    ],
    tools: ["Make.com or n8n", "Twilio", "Google Calendar"],
    playbookSlug: "appointment-reminders",
  },
];

export function getPackage(id: string) {
  return PACKAGES.find((p) => p.id === id);
}
