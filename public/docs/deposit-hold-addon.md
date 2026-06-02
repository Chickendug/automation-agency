# Add-On: New Patient Deposit Hold (Stripe + SMS)

**Sell after** base Appointment Reminder System is live — or bundle at close if they ask about no-shows.

**Add-on pricing:** +$500 setup, +$50/mo (adjust as needed)

---

## What it does

1. New appointment booked → SMS with Stripe payment link for deposit
2. Deposit paid → appointment confirmed + reminder sequence starts
3. Not paid within 2 hours → staff alert + optional "spot released" SMS
4. Office keeps deposit per **their policy** if patient no-shows (manual — you don't auto-charge cards Day 1)

---

## Client must decide (kickoff)

- [ ] Deposit amount ($25 / $50 / $100)
- [ ] Who pays: new patients only? high-value procedures?
- [ ] Refund policy if they cancel 24h+ ahead
- [ ] Waiver/consent language (client's responsibility — not legal advice)

---

## Stripe setup

1. Stripe → Products → **New Patient Deposit** — one-time price (e.g. $50)
2. Create **Payment Link** → copy URL
3. Optional: add `client_reference_id` via Make for tracking

---

## Make.com flow

### Trigger options

- **A:** New row in Google Sheet (staff enters booking)
- **B:** Website form webhook (new patient request)
- **C:** New Google Calendar event tagged `NEEDS_DEPOSIT` in title

### Flow

```
New booking detected
  → SMS: "To hold your spot at {Business}, pay ${amount} deposit: {StripeLink}. Expires in 2 hours."
  → Wait 2 hours
  → Router: payment received?
      YES → SMS: "You're confirmed for {date} {time}. See you then!"
           → Start reminder sequence (main build)
      NO  → SMS staff: "Deposit not received — {name} {phone}"
           → Optional SMS patient: "Your hold expired — call us to rebook."
```

### Track payment

- Stripe webhook → Make → mark row `deposit_paid = true`
- Webhook URL: use Make custom webhook; Stripe event `checkout.session.completed`

---

## SMS templates

**Deposit request:**
```
Hi {name}! To confirm your appointment at {Business} on {date}, please pay your ${amount} deposit here: {link}
Link expires in 2 hours. Questions? Call {phone}. Reply STOP to opt out.
```

**Confirmed after pay:**
```
You're all set for {date} at {time} at {Business}. Reply YES if you need to reschedule. Reply STOP to opt out.
```

**Staff — not paid:**
```
⚠ Deposit not received: {name} {phone} — appt {date}. Follow up or release slot.
```

---

## What NOT to promise Day 1

- Automatic no-show **fee charge** to card on file (needs deeper PMS/payment integration)
- Legal enforcement of cancellation policy
- Integration with Dentrix billing module

Position as: **"Deposit to hold the slot"** — simple, works everywhere.

---

## Testing

- [ ] Test Stripe link opens and pays (use $0.50 test mode or refund)
- [ ] Webhook marks booking confirmed
- [ ] Reminder sequence starts only after paid
- [ ] Staff alert fires when unpaid after 2h

---

## Time estimate

+2–3 hours on top of base appointment build (first time)
