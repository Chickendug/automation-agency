# Build Guide: Missed Call Recovery (Make.com + Twilio)

Use this **after the client pays** the setup fee.

## What you're building

1. Missed call detected → wait 30s → SMS to caller
2. Follow-ups at 4h, 24h, 48h if no reply
3. Owner alert when they reply CALL/YES
4. Weekly email report

## Accounts needed (client or your subaccount)

- Twilio: phone number + SMS enabled
- Make.com scenario
- Google Sheet for log (optional)

## Twilio setup

1. Buy a local number in client's area code
2. Enable SMS on the number
3. For missed call detection:
   - **Option A:** Call forwarding to Twilio → use Status Callback webhook to Make
   - **Option B:** Client uses OpenPhone/RingCentral — use their webhook
   - **Option C (simplest MVP):** Client forwards missed call alerts to email → Make parses email (slower)

## Make.com scenario (modules)

### Module 1: Webhook (instant trigger)
- Custom webhook URL — save for Twilio callback

### Module 2: Router
- If call status = no-answer or busy → continue
- Else → stop

### Module 3: Sleep 30 seconds

### Module 4: Twilio — Send SMS
```
Hi! Sorry we missed you at {{BusinessName}} — how can we help?
Reply CALL and we'll ring you back. Reply STOP to opt out.
```

### Module 5: Google Sheets — Add row
Columns: Date, Phone, Status, Source

### Module 6–8: Follow-up delays
- 4 hours → SMS #2
- 24 hours → SMS #3  
- 48 hours → SMS #4 (final)

Stop sequence if: reply contains STOP, or CALL, or YES

### Module 9: Owner notification
- Twilio SMS or Gmail to owner when hot keyword detected

## Testing checklist

- [ ] 3 test calls from different phones
- [ ] STOP opt-out works
- [ ] Owner gets alert on CALL reply
- [ ] Sheet logs correctly

## Handoff to client

- Loom 5-min walkthrough
- One-page PDF: "how to add staff to alert list"
- Support: text you for breaks; included in monthly fee

## Time estimate

- First build: 5–6 hours
- Same template client #2: 2–3 hours
