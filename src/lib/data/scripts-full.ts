/** Word-for-word scripts — use with fillTemplate() from script-engine */

export const MASTER_DIAL_SCRIPT = {
  title: "Master cold call (read this on every dial)",
  sections: [
    {
      id: "opening",
      label: "1. Opening (10 seconds)",
      text: `Hi, is this [Business Name]?

Great — my name is [Your Name], I'll be quick.

I help [niche] stop losing jobs when the phone rings and nobody can pick up.`,
    },
    {
      id: "question",
      label: "2. One question (pause — let them answer)",
      text: `When you're on a job or with a customer — do most calls go to voicemail?`,
    },
    {
      id: "yes",
      label: '3A. If YES or "sometimes"',
      text: `That's what we fix. We install a system that texts them back in under a minute and follows up automatically — so you don't lose the lead.

It's done-for-you — we build it in about 2 days.

Would a quick 10-minute demo Tuesday or Thursday morning be crazy?`,
    },
    {
      id: "cost",
      label: '3B. If "how much?"',
      text: `Setup is about fifteen hundred one time, then around four hundred a month to run and support it.

Most shops make that back from one extra job.

Worth a 10-minute demo before you decide anything?`,
    },
    {
      id: "no",
      label: "3C. If NOT interested",
      text: `Totally fair. Mind if I text you a 30-second video — in case timing's better next month?

What's the best cell for that?`,
    },
    {
      id: "gatekeeper",
      label: '3D. If gatekeeper / "owner not here"',
      text: `No problem — who handles operations or the phones for the owner?

Can I leave my name? It's about automatic text follow-up when calls are missed.`,
    },
    {
      id: "busy",
      label: '3E. If "send info"',
      text: `I'll keep it shorter than email — 10 minutes on Zoom and you'll know if it fits.

What's better — morning or after lunch?`,
    },
  ],
};

/** They texted or called you back (e.g. after your outreach). */
export const CALLBACK_INBOUND_SCRIPT = {
  title: "Callback — they called you",
  sections: [
    {
      id: "opening",
      label: "1. Opening (they initiated)",
      text: `Hey [Business Name], thanks for calling/texting back — it's [Your Name].

Quick context: I reached out about speed-to-lead — making sure Zillow, Facebook, and website leads get a reply in under a minute, not hours later.`,
    },
    {
      id: "question",
      label: "2. One question",
      text: `When a new buyer or seller lead comes in today — who follows up first, and how fast does that usually happen?`,
    },
    {
      id: "yes",
      label: '3A. If slow / manual / "depends"',
      text: `That's the gap we fix. Instant text + a short nurture sequence so you're first while they're still hot — you already do auto text on missed calls, which is smart; this is for *new* portal leads before they talk to three agents.

Worth a 15-minute screen-share this week — Tuesday or Thursday morning?`,
    },
    {
      id: "cost",
      label: '3B. If "how much?"',
      text: `Setup's about twelve hundred one time, then around three hundred a month to run it.

One extra deal pays for the year. Want to see it on a quick demo?`,
    },
    {
      id: "no",
      label: "3C. If not a fit",
      text: `No worries — appreciate you getting back to me. If timing's better later, I'll check in once. Good luck out there.`,
    },
  ],
};

/** Cold outbound when weakness is slow lead follow-up (realtors, etc.). */
export const LEAD_FOLLOWUP_OUTBOUND_SCRIPT = {
  title: "Outbound — speed-to-lead (realtors / forms)",
  sections: [
    {
      id: "opening",
      label: "1. Opening",
      text: `Hi, is this [Business Name]?

[Your Name] — I'll be quick. I help [niche] with speed-to-lead: when someone hits your site or a Zillow/FB lead form, they get a text back in under 60 seconds.`,
    },
    {
      id: "question",
      label: "2. One question",
      text: `When those leads come in — are you usually first to reply, or does it sometimes sit until later in the day?`,
    },
    {
      id: "yes",
      label: '3A. If slow / sometimes / after hours',
      text: `We automate that first touch plus a few follow-ups so competitors don't beat you to the conversation.

Done-for-you — live in about 2 days. Ten-minute demo this week — does morning or afternoon work better?`,
    },
    {
      id: "cost",
      label: '3B. If "how much?"',
      text: `About twelve hundred setup, then three hundred a month.

One closed side pays for it. Open to a quick demo?`,
    },
    {
      id: "no",
      label: "3C. If NOT interested",
      text: `Fair enough. Mind if I text a 30-second overview — in case Q4 gets busier?

Best cell for that?`,
    },
  ],
};

/** Cold outbound for appointment / no-show niche (dental, med spa, salon). */
export const APPOINTMENT_REMINDER_OUTBOUND_SCRIPT = {
  title: "Outbound — no-shows & reminders (dental / appointments)",
  sections: [
    {
      id: "opening",
      label: "1. Opening",
      text: `Hi, is this [Business Name]?

[Your Name] — I'll be quick. I help [niche] cut no-shows with text reminders patients actually reply to — confirm, reschedule, and follow up if they don't show.`,
    },
    {
      id: "question",
      label: "2. One question",
      text: `How many no-shows or last-minute cancels do you get in a typical week — and what happens automatically after someone doesn't show?`,
    },
    {
      id: "yes",
      label: '3A. If "we have reminders" or "still a problem"',
      text: `That's common — most offices have email or one text from their software, but no confirm-by-reply and no recovery after a no-show. We layer SMS on top: 24h + 2h reminders, YES/RESCHEDULE replies, and a text 30 minutes after a missed appointment.

Worth a 15-minute demo — Tuesday or Thursday morning?`,
    },
    {
      id: "cost",
      label: '3B. If "how much?"',
      text: `About a thousand setup, then around three hundred a month. Some offices add a new-patient deposit link later — we can talk about that on the demo. Open to 15 minutes this week?`,
    },
    {
      id: "no",
      label: "3C. If NOT interested",
      text: `Fair enough. Mind if I text a 30-second overview — in case no-show season picks up?

Best cell for that?`,
    },
  ],
};

export const APPOINTMENT_DEMO_SCRIPT = `DEMO (15 min) — [Business Name] — Appointment Reminders

1. RECAP (2 min)
"You said no-shows are still costing you chairs even with reminders. Is that still the main headache?"

2. SHOW THE FLOW (6 min)
"Patient has appointment tomorrow → they get this text 24 hours out:"
→ Read 24h SMS on screen

"They reply YES — your front desk gets alerted. RESCHEDULE — you get their number to call back."
"Day of — 2-hour reminder."
"If they no-show → 30 minutes later: 'Want to reschedule? Reply YES.'"

3. VS WHAT THEY HAVE (3 min)
"We're not replacing Dentrix — we add SMS confirm + recovery your current system usually skips."

4. CLOSE (4 min)
"Appointment Reminder System — [setup] setup, [monthly]/month includes support.
Optional later: new-patient deposit link by text (+$500 setup).
I'll send Stripe link for setup — once that clears, live in 2–3 days. Send link today?"`;

export const OBJECTION_HANDLERS: { objection: string; response: string }[] = [
  {
    objection: "We already have someone answering phones",
    response:
      "Totally get it — this isn't replacing them. It's for when they're busy, at lunch, or after hours — the calls that still hit voicemail. Those are the ones that cost you jobs.",
  },
  {
    objection: "Too expensive",
    response:
      "Fair. One missed job usually costs more than the monthly fee. The demo's free — if the math doesn't work, we shake hands. 10 minutes?",
  },
  {
    objection: "Send me an email",
    response:
      "I will — but you'll get more from a 10-minute screen share than a PDF. What's your email, and can we do Thursday at 10?",
  },
  {
    objection: "We're not interested",
    response:
      "No worries. Can I text a 30-second video? If it's not useful, ignore it — if it is, you'll have my number.",
  },
  {
    objection: "Is this a scam / robocalls?",
    response:
      "No — we're not blasting anyone. It's your business texting people who called YOU and didn't get through. You approve every message.",
  },
  {
    objection: "Call me back later",
    response:
      "Sure — what day works? I'll put you down for [day] and send a calendar invite so it actually happens.",
  },
  {
    objection: "We already have reminders",
    response:
      "Totally fair — most offices do. Quick question: when someone no-shows, what happens automatically after? And can patients confirm by text, or does front desk still chase? We usually add SMS confirm + recovery on top — not rip and replace.",
  },
  {
    objection: "We use Dentrix / Open Dental for that",
    response:
      "Perfect — keep that. This sits on top: SMS 24h and 2h before, YES/RESCHEDULE replies, and a text 30 min after a no-show. PMS email reminders and patient texts are different channels. 15-minute demo to see if it's actually different?",
  },
  {
    objection: "Can you do deposits / no-show fees?",
    response:
      "Yes — Phase 1 is reminders + recovery. Phase 2 we add a Stripe deposit link by text when they book — usually fifty bucks for new patients. We don't auto-charge no-show fees Day 1; deposit to hold the slot is the cleanest start.",
  },
];

export const DEMO_SCRIPT = `DEMO CALL (10 minutes) — [Business Name]

1. RECAP (1 min)
"On our call you said when you're on jobs, calls go to voicemail. Is that still the biggest headache?"

2. SHOW THE FLOW (4 min)
"Customer calls → you're busy → they get this text within 60 seconds:"
→ Read sample SMS on screen

"Then if they don't reply, day 1 and day 2 follow-ups go out automatically."
"When they text CALL or YES — you get alerted instantly."

3. PROOF (2 min)
"This is the same system we run for [similar business type]. Setup takes 48 hours — we do it all."

4. CLOSE (3 min)
"Package is [Package Name] — [setup] setup, [monthly]/month includes support and tweaks.

I'll send a secure Stripe link for the setup fee — once that clears, we kick off within 48 hours. Monthly starts after go-live.

Want me to send that link today, or do you need a partner on the call first?"`;

export const SMS_TEMPLATES = [
  {
    name: "After voicemail (your outbound)",
    body: "Hi [Business Name] — [Your Name] here. I help [niche] recover missed calls with auto text follow-up. Worth a 10-min call this week? Reply YES or call [Your Phone]",
  },
  {
    name: "Missed call — instant (client system)",
    body: "Hi! Sorry we missed you at [Business Name] — how can we help today? Reply CALL and we'll ring you back ASAP. Reply STOP to opt out.",
  },
  {
    name: "Follow-up #1 (4 hours)",
    body: "Still here if you need us at [Business Name] — reply with what you need or CALL and we'll reach out. Reply STOP to opt out.",
  },
  {
    name: "Follow-up #2 (24 hours)",
    body: "Last check-in from [Business Name] — happy to help when you're ready. Reply STOP to opt out.",
  },
  {
    name: "Appt — 24h confirm",
    body: "Hi [Name], confirming your appointment at [Business Name] tomorrow at [Time]. Reply YES to confirm or RESCHEDULE to change. Reply STOP to opt out.",
  },
  {
    name: "Appt — 2h reminder",
    body: "Reminder: your appointment at [Business Name] is today at [Time]. Reply C to confirm. Reply STOP to opt out.",
  },
  {
    name: "Appt — no-show recovery",
    body: "Hi [Name], we missed you at [Business Name] today. Want to reschedule? Reply YES. Reply STOP to opt out.",
  },
  {
    name: "Appt — deposit request",
    body: "Hi [Name]! To hold your spot at [Business Name] on [Date], pay your $[Amount] deposit here: [StripeLink]. Reply STOP to opt out.",
  },
];

export const EMAIL_TEMPLATES = [
  {
    name: "Cold email #1",
    subject: "Quick question — missed calls at [Business Name]",
    body: `Hi,

I'm [Your Name] with [Agency Name]. I work with [niche] in [city area].

When you're on a job and miss a call — what happens to that lead today?

We install a done-for-you system that texts them back in under 60 seconds and follows up automatically. Most clients set up in 48 hours.

Open to a 10-minute demo this week?

[Your Name]
[Your Phone]`,
  },
  {
    name: "After interested call",
    subject: "Next step — [Business Name] + missed call recovery",
    body: `Hi [Contact],

Great talking today. As discussed:

• Problem: missed calls → lost jobs when you're busy
• Solution: [Package Name] — instant SMS + automated follow-ups + owner alerts
• Investment: [setup] setup + [monthly]/month
• Timeline: live in 2–3 business days

Here's a 2-min overview: [paste Loom link]

Available for kickoff: [offer 2 times]

[Your Name]
[Agency Name] | [Your Phone]`,
  },
  {
    name: "After interested call — appointments",
    subject: "Next step — [Business Name] + appointment reminders",
    body: `Hi [Contact],

Great speaking earlier — [Your Name] here.

As discussed:
• Problem: no-shows / last-minute cancels despite existing reminders
• Solution: SMS confirm (24h + 2h) + reply YES/RESCHEDULE + no-show recovery text
• Investment: $1,000 setup + $297/month
• Timeline: live in 2–3 business days after setup

Open for a 15-min demo this week? I have [time 1] or [time 2].

[Your Name]
[Your Phone]`,
  },
  {
    name: "Proposal send",
    subject: "Proposal — [Package Name] for [Business Name]",
    body: `Hi [Contact],

Attached/inline is the proposal for [Package Name].

Summary:
• Setup: [setup]
• Monthly: [monthly]
• Cancel with 30 days notice

Reply "approved" or book kickoff here: [calendar link]

Questions — call/text [Your Phone].

[Your Name]`,
  },
];

export const DAILY_SCHEDULE = [
  { time: "7:00 AM", task: "Coffee + open Agency OS → Dashboard. Check callbacks due today." },
  { time: "7:30 AM", task: "Find Leads: pull 50–100 NEW leads (same niche + city every day this week)." },
  { time: "8:00 AM", task: "Open /dial (teleprompter) + /leads/call side by side. Start dialing." },
  { time: "8:00–12:00", task: "POWER BLOCK: 80–100 dials. Log every call. No email. No building." },
  { time: "12:00 PM", task: "Lunch. Text interested leads to confirm demo times." },
  { time: "1:00–4:00 PM", task: "Demos (15 min) + send proposals same day for yes/maybe." },
  { time: "4:00–5:00 PM", task: "Delivery work ONLY for paying clients. No free builds." },
  { time: "5:00 PM", task: "Update Clients pipeline. Note tomorrow callbacks on Leads page." },
];

export const SERVICE_AGREEMENT = `AUTOMATION SERVICES AGREEMENT

Provider: [Agency Name] ("Provider")
Client: [Business Name] ("Client")
Date: _______________

1. SERVICES
Provider will design, configure, and maintain automation workflows as described in the approved proposal for [Package Name].

2. FEES
• One-time setup: $[setup] due before work begins
• Monthly support: $[monthly]/month, billed on the 1st
• Late payment: work may pause after 7 days overdue

3. TERM
Month-to-month after go-live. Either party may cancel with 30 days written notice.

4. CLIENT RESPONSIBILITIES
Client will provide timely access to phone/SMS accounts, calendar, and forms; approve message copy; comply with TCPA/SMS opt-out laws.

5. LIMITATIONS
Provider is not liable for lost profits. Maximum liability limited to fees paid in the prior 30 days.

6. ACCEPTANCE
Client signature: _________________________ Date: _______

Provider: [Your Name], [Agency Name]`;

export const TOOL_SETUP_CHECKLIST = [
  { tool: "Make.com", url: "https://www.make.com", purpose: "Build automations (free tier to start)", done: false },
  { tool: "Twilio", url: "https://www.twilio.com", purpose: "SMS + phone numbers (~$15 credit)", done: false },
  { tool: "Google Cloud", url: "https://console.cloud.google.com", purpose: "Places API for lead finder", done: false },
  { tool: "Loom", url: "https://www.loom.com", purpose: "Record 2-min demo videos for prospects", done: false },
  { tool: "Calendly", url: "https://calendly.com", purpose: "Book demos without back-and-forth", done: false },
  { tool: "Stripe", url: "https://stripe.com", purpose: "Collect setup fees + monthly (optional Day 1)", done: false },
];

export const FIRST_WEEK_PLAN = [
  { day: "Day 1", focus: "Setup", tasks: ["Fill Settings", "Sign up Twilio + Make", "Find 100 leads", "Practice script 10x out loud"] },
  { day: "Day 2", focus: "Dial", tasks: ["100 dials", "Goal: 3 interested", "Book 1 demo"] },
  { day: "Day 3", focus: "Dial + Demo", tasks: ["80 dials AM", "1–2 demos PM", "Send 1 proposal"] },
  { day: "Day 4", focus: "Dial + Close", tasks: ["80 dials", "Follow up all interested", "Ask for deposit on yes"] },
  { day: "Day 5", focus: "First sale", tasks: ["50 dials", "Send Stripe setup link — don't build until paid", "Deliver if closed — use Playbook"] },
  { day: "Day 6–7", focus: "Repeat", tasks: ["Maintain dial volume", "Finish first delivery", "Ask client for 1 referral"] },
];
