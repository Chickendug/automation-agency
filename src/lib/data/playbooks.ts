export type Playbook = {
  slug: string;
  title: string;
  packageId: string;
  estimatedHours: number;
  steps: { title: string; detail: string }[];
  checklist: string[];
  buildGuidePath?: string;
  addonGuidePath?: string;
};

export const PLAYBOOKS: Playbook[] = [
  {
    slug: "missed-call-recovery",
    title: "Deliver: Missed Call Recovery System",
    packageId: "missed-call-recovery",
    estimatedHours: 6,
    buildGuidePath: "/guides/missed-call-recovery",
    steps: [
      {
        title: "Kickoff (30 min)",
        detail:
          "Get Twilio number or use theirs, business hours, SMS tone approval, and where leads should land (Sheet/CRM).",
      },
      {
        title: "Missed call trigger",
        detail:
          "Option A: Call forwarding to Twilio with status callback. Option B: Integrate their phone system webhook. Option C: Manual Zap from Google Voice export (lowest tech).",
      },
      {
        title: "Instant SMS workflow",
        detail:
          "Trigger → Wait 30s → If no answer logged → Send SMS: 'Hi, sorry we missed you at [Business] — how can we help? Reply CALL and we'll ring you back.'",
      },
      {
        title: "Follow-up sequence",
        detail:
          "Hour 4, Hour 24, Hour 48 follow-ups. Stop if they reply STOP or book.",
      },
      {
        title: "Owner notifications",
        detail:
          "Slack/email/SMS to owner when lead replies 'CALL' or 'YES'.",
      },
      {
        title: "Test & handoff",
        detail:
          "Run 3 test calls. Document what owner sees. Record Loom walkthrough.",
      },
    ],
    checklist: [
      "Twilio account in client name or subaccount",
      "TCPA-compliant opt-out language in first SMS",
      "Test missed call from 2 numbers",
      "Weekly report automation scheduled",
      "Support channel defined (text/email)",
    ],
  },
  {
    slug: "lead-follow-up",
    title: "Deliver: Lead Follow-Up Automation",
    packageId: "lead-follow-up",
    estimatedHours: 5,
    steps: [
      {
        title: "Map lead sources",
        detail: "Website form, Facebook Lead Ads, Google LSA — webhook each into Make/n8n.",
      },
      {
        title: "Instant response (<60s)",
        detail: "SMS + email: 'Got your request — someone will reach out shortly.'",
      },
      {
        title: "Nurture sequence",
        detail: "Day 0, 1, 2 emails + Day 0, 1 SMS. Personalize with service type if captured.",
      },
      {
        title: "Hot lead routing",
        detail: "If reply contains 'today', 'urgent', 'quote' → immediate owner alert.",
      },
      {
        title: "Reporting",
        detail: "Daily Slack/email: new leads, replied, needs follow-up.",
      },
    ],
    checklist: [
      "All forms send to one webhook URL",
      "SPF/DKIM ok for email domain",
      "Owner phone gets alerts",
      "Duplicate lead handling",
    ],
  },
  {
    slug: "review-reputation",
    title: "Deliver: Review & Reputation System",
    packageId: "review-reputation",
    estimatedHours: 4,
    steps: [
      {
        title: "Trigger definition",
        detail: "Appointment completed tag in calendar/CRM OR manual daily CSV upload.",
      },
      {
        title: "Happy path SMS",
        detail: "2h after visit: 'Thanks for visiting! Mind leaving a quick Google review? [link]'",
      },
      {
        title: "Private feedback path",
        detail: "If they reply 1–3 stars keyword → route to owner, NOT public review.",
      },
      {
        title: "Monthly report",
        detail: "Review count delta, messages sent, response rate.",
      },
    ],
    checklist: [
      "Correct Google review link",
      "Timing matches business hours",
      "Opt-out honored",
    ],
  },
  {
    slug: "appointment-reminders",
    title: "Deliver: Appointment Reminder System",
    packageId: "appointment-reminders",
    estimatedHours: 5,
    buildGuidePath: "/guides/appointment-reminders",
    addonGuidePath: "/guides/deposit-hold",
    steps: [
      {
        title: "Calendar connect",
        detail: "Google Calendar watch → new/updated events with customer phone in description.",
      },
      {
        title: "Reminder schedule",
        detail: "24h and 2h before: SMS with confirm. Parse YES/NO replies.",
      },
      {
        title: "No-show recovery",
        detail: "30 min after missed appointment → 'Want to reschedule? Reply YES.'",
      },
      {
        title: "Handoff doc",
        detail: "How to add phone numbers to calendar events consistently.",
      },
    ],
    checklist: [
      "Timezone correct",
      "Test confirm and cancel flows",
      "Owner sees cancellations",
    ],
  },
];

export function getPlaybook(slug: string) {
  return PLAYBOOKS.find((p) => p.slug === slug);
}
