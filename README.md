# Agency OS — Automation Agency (#2)

**Everything you need to find leads, dial all day, close clients, and deliver automations.**

## ☀️ Woke up? Read `WOKE-UP.txt` or `START-HERE.md`

## Quick start

```powershell
cd C:\Users\jeden\Projects\automation-agency
npm run setup    # first time only
npm run dev
```

| Page | URL |
|------|-----|
| **Morning checklist** | http://localhost:3000/start |
| **Dial script (fullscreen)** | http://localhost:3000/dial |
| **Call mode** | http://localhost:3000/leads/call |
| **Settings** | http://localhost:3000/settings |
| **Payments** | http://localhost:3000/payments |

## What's included

### App
- Lead finder (Google Places) + CSV import/export
- **Call Mode** — tap to dial, log outcomes
- **Dial Script** — teleprompter with your name/niche filled in
- Client CRM pipeline + MRR dashboard
- 4 service packages with pricing
- Scripts: cold call, voicemail, demo, emails, SMS, objections
- Playbooks: step-by-step delivery after client pays
- Toolkit: tool signups, service agreement, daily schedule
- **Payments**: Stripe setup, payment links, collect from clients, email/SMS pay templates

### Offline / print
- `launch-kit/MASTER-DIAL-SCRIPT.txt` — print and keep by phone
- `launch-kit/DAY-1-CHECKLIST.md`
- `public/docs/missed-call-recovery-build.md` — Make + Twilio build guide

### Data
- `npm run seed` — 10 practice leads (HVAC, dental, etc.)
- `sample-leads.csv` — import more

## Daily routine

1. **Start** page checklist
2. **Find** 50–100 leads (same niche + city all week)
3. **Dial** script + **Call** mode — 80–100 calls
4. Afternoon demos → proposals → deliver with playbooks

## Path to $10k/mo

~20–25 active clients × ~$400/mo. Primary offer: **Missed Call Recovery** ($1,500 setup + $397/mo).

## Google Places API (optional)

`.env` → `GOOGLE_PLACES_API_KEY=...` — enable Places API (New) in Google Cloud.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start app |
| `npm run setup` | Migrate DB + seed leads |
| `npm run seed` | Re-add sample leads |
| `npm run db:studio` | Browse database |

Built with Next.js, Prisma, SQLite, Tailwind.
