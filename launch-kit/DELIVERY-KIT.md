# Delivery Kit — When a Client Pays

**Rule:** No build until setup fee is paid. See `PAYMENTS-GUIDE.md`.

---

## Quick start

1. **Mark paid** → Agency OS → Clients → Collect $ / Mark setup paid
2. **Kickoff call** → `CLIENT-KICKOFF-QUESTIONNAIRE.md`
3. **Build** → pick guide below
4. **Test** → checklist in build guide
5. **Handoff** → Loom + mark client Active
6. **Monthly** → `/billing` when due

---

## Build guides (step-by-step)

| Package | Guide | Playbook in app |
|---------|-------|-----------------|
| Missed Call Recovery | `/docs/missed-call-recovery-build.md` | `/playbooks/missed-call-recovery` |
| Appointment Reminders | `/docs/appointment-reminders-build.md` | `/playbooks/appointment-reminders` |
| Deposit hold add-on | `/docs/deposit-hold-addon.md` | (add-on to appointments) |
| Lead Follow-Up | `/playbooks/lead-follow-up` | steps in app |
| Reviews | `/playbooks/review-reputation` | steps in app |

Open guides on live site: `https://YOUR-URL.vercel.app/docs/appointment-reminders-build.md`

---

## Get AI help building

After kickoff, message Cursor with:

```
Client paid — Appointment Reminders
Business: Tustin Dental Group
Calendar: Google Calendar
Owner alert: (714) 555-1234
Timezone: America/Los_Angeles
Deposit add-on: no
```

We'll customize SMS copy and troubleshoot Make/Twilio steps.

---

## Timeline

| Day | Task |
|-----|------|
| 0 | Payment clears, kickoff scheduled |
| 1 | Kickoff + Twilio + Make accounts |
| 2 | Build + internal test |
| 3 | Client test + go-live + Loom |

---

## Pricing reminder

| Package | Setup | Monthly |
|---------|-------|---------|
| Missed Call Recovery | $1,500 | $397 |
| Lead Follow-Up | $1,200 | $297 |
| Appointment Reminders | $1,000 | $297 |
| Reviews | $800 | $197 |
| Deposit add-on | +$500 | +$50 |
