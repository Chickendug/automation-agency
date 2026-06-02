# Build Guide: Appointment Reminder System (Make.com + Twilio)

Use this **after the client pays** the setup fee ($1,000).

**Before you start:** complete `launch-kit/CLIENT-KICKOFF-QUESTIONNAIRE.md` on the kickoff call.

---

## What you're building

1. Calendar event with patient phone → scheduled reminders
2. **24 hours before** → SMS confirm/reschedule
3. **2 hours before** → SMS reminder
4. Patient replies YES / RESCHEDULE → alert staff
5. **30 min after no-show** → recovery SMS
6. Optional Phase 2: deposit hold → see `deposit-hold-addon.md`

---

## Accounts needed

| Tool | Purpose | Cost (approx) |
|------|---------|---------------|
| Make.com | Automation brain | Free tier OK to start |
| Twilio | SMS send/receive | ~$1/mo number + ~$0.01/SMS |
| Google Calendar | Appointment source | Client's existing account |
| Google Sheet | Log (optional) | Free |

---

## Kickoff inputs (must have)

- [ ] Business legal name + display name for texts
- [ ] Timezone (e.g. America/Los_Angeles)
- [ ] Owner/staff alert phone(s)
- [ ] Twilio number area code preference
- [ ] Approved SMS copy (see templates below)
- [ ] How appointments get phone numbers (calendar description format)

---

## Twilio setup

1. Create Twilio account (client name or your subaccount)
2. Buy local number in client's area code
3. Enable SMS on the number
4. **Messaging → Incoming Message Webhook** → point to Make webhook URL (for YES/RESCHEDULE replies)
5. Add opt-out language to first message: `Reply STOP to opt out.`

---

## Calendar format (critical)

Staff must put patient phone in every calendar event. Pick one format and document it:

**Recommended — event description:**
```
Phone: (714) 555-1234
Patient: Maria Garcia
```

**Make.com** parses description for phone regex `\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}`.

**Alternative:** dedicated Google Calendar named "Appointments - SMS" so automations don't fire on internal meetings.

---

## Make.com — Scenario A: Reminder scheduler

### Trigger: Google Calendar — Watch Events
- Calendar: client's appointment calendar
- Create/update events with phone in description

### Module: Store in Google Sheet (or Data Store)
Columns: `event_id`, `phone`, `start_time`, `patient_name`, `status`, `reminder_24_sent`, `reminder_2_sent`, `confirmed`

### Scheduled scenario (runs every 15 min): Check due reminders

**Router 1 — 24h reminder due**
- If `start_time - now` between 23h45m and 24h15m AND `reminder_24_sent` = false
- Twilio Send SMS:

```
Hi {{patient_name}}, this is {{BusinessName}}. Confirming your appointment tomorrow at {{time}}. Reply YES to confirm or RESCHEDULE to change. Reply STOP to opt out.
```

- Mark `reminder_24_sent` = true

**Router 2 — 2h reminder due**
- If `start_time - now` between 1h45m and 2h15m AND `reminder_2_sent` = false AND not cancelled
- Twilio Send SMS:

```
Reminder: your appointment at {{BusinessName}} is today at {{time}}. Reply C to confirm you're coming. Reply STOP to opt out.
```

- Mark `reminder_2_sent` = true

---

## Make.com — Scenario B: Inbound SMS replies

### Trigger: Webhook (Twilio incoming SMS)

**Router — keyword match (case insensitive)**

| Reply contains | Action |
|----------------|--------|
| YES, C, CONFIRM | Mark confirmed in sheet; SMS owner: "✓ {{patient}} confirmed {{time}}" |
| RESCHEDULE, CHANGE | SMS owner: "↻ {{patient}} wants to reschedule — call {{phone}}" |
| STOP | Mark opted out; no more messages |

---

## Make.com — Scenario C: No-show recovery

### Scheduled (every 15 min)

- If `start_time + 30min` < now AND status ≠ confirmed AND status ≠ recovered AND not opted out
- Twilio Send SMS:

```
Hi {{patient_name}}, we missed you at {{BusinessName}} today. Want to reschedule? Reply YES and we'll text you a link to rebook. Reply STOP to opt out.
```

- If reply YES → alert staff to call back
- Mark status = recovered_attempt

---

## SMS copy library (edit with client)

| Message | Text |
|---------|------|
| 24h | Hi {name}, confirming your appointment at {business} tomorrow at {time}. Reply YES to confirm or RESCHEDULE to change. Reply STOP to opt out. |
| 2h | Reminder: appointment at {business} today at {time}. Reply C to confirm. Reply STOP to opt out. |
| No-show | We missed you at {business} today. Want to reschedule? Reply YES. Reply STOP to opt out. |
| Owner confirm alert | ✓ {name} confirmed {date} {time} |
| Owner reschedule alert | ↻ {name} wants to reschedule — {phone} |

---

## Testing checklist

- [ ] Create test event 25 hours out with your cell in description
- [ ] Receive 24h SMS (or manually trigger for faster test)
- [ ] Reply YES → owner alert received
- [ ] Reply RESCHEDULE → owner alert received
- [ ] Create test event 2.5 hours out → receive 2h SMS
- [ ] Simulate no-show → receive recovery SMS 30 min after start
- [ ] Reply STOP → no further messages
- [ ] Timezone correct on all messages

---

## Handoff to client

1. **Loom (5 min):** walk through one test appointment end-to-end
2. **One-page SOP:** how to add phone numbers to calendar events
3. **Support:** text/email you for breaks (included in $297/mo)
4. Mark client **Active** in Agency OS

---

## Time estimate

| Client | Hours |
|--------|-------|
| First build | 5–6 |
| Same template #2 | 2–3 |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| No SMS sent | Phone missing from calendar description |
| Wrong time | Check timezone in Make + Google Calendar |
| Reminders on staff meetings | Use dedicated "Patient Appointments" calendar |
| "We already have reminders" | Layer this on top — focus on SMS + 2-way + no-show recovery |
| PMS (Dentrix) | Phase 1: Google Cal sync or manual export; Phase 2: integrate when volume justifies |

---

## When client pays — message Cursor

Send:

```
Client paid — Appointment Reminders
Business: [name]
Calendar: Google / other
Area code: [714]
Owner alert phone: [number]
Timezone: [PST]
Deposit add-on: yes/no
```

We'll customize copy and troubleshoot any stuck Make step.
