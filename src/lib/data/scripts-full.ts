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
