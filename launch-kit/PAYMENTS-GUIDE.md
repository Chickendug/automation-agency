# Payments Guide — Automation Agency

## The rule

**Never start building until setup fee is paid.**

Monthly fee starts after go-live (or include first month in setup if you want).

---

## Best setup (do this)

### Tier 1 — Today (15 minutes, no code)

1. Create **Stripe** account: https://stripe.com
2. **Products** → create each package:
   - "Missed Call Setup" — $1,500 **one-time**
   - "Missed Call Monthly" — $397 **recurring / month**
3. Each product → **Create payment link** → copy URL
4. Paste links in Agency OS → **Payments** page → Save
5. When client says yes → **Clients** → **Copy pay email** or **Copy pay SMS** → send link

### Tier 2 — This week (auto mark-paid)

1. Stripe → **Developers** → API keys → copy Secret key
2. Add to `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```
3. Stripe → Webhooks → Add endpoint:
   - URL: `https://yourdomain.com/api/payments/webhook`
   - Event: `checkout.session.completed`
4. **Clients** → **Stripe link (setup)** — opens Checkout for exact client amount

---

## What to charge

| Package | Setup (due first) | Monthly (after live) |
|---------|-------------------|----------------------|
| Missed Call Recovery | $1,500 | $397 |
| Lead Follow-Up | $1,200 | $297 |
| Review & Reputation | $800 | $197 |
| Appointment Reminders | $1,000 | $297 |

---

## Scripts to say on the demo

> "We do a one-time setup to build everything — that's $1,500. After it's live, it's $397 a month to keep it running and supported. I'll send you a secure Stripe link — once that clears, we start within 48 hours."

---

## Backup methods

| Method | When to use |
|--------|-------------|
| Venmo / Zelle | Trusted local client, same-day deposit |
| PayPal | They insist, one-time setup only |
| Bank transfer | Setup over $2k, corporate client |
| Check | Rare — wait for clear before starting |

Always **Mark setup paid** in Agency OS when money hits.

---

## Taxes & business (US)

- Open **Stripe** with legal name (LLC or sole prop)
- Track income — Stripe exports 1099-K at volume
- Consider LLC + business bank account
- Sales tax: automation services vary by state — ask a CPA when you hit $5k/mo

---

## Monthly billing (recurring)

Open **Monthly Billing** in the app (`/billing`) every month.

### Manual (Zelle / check / Venmo)
1. Client goes **active** after setup paid — app sets their billing day (day they went live)
2. When due → **Copy monthly SMS** (includes Zelle if you set it in Payments settings)
3. They pay → **Mark paid this month**
4. Next due date advances automatically (+1 month)

### Stripe (automatic)
1. Create a **recurring** Payment Link ($397/mo) in Stripe
2. Paste in Payments → **Monthly subscription payment link**
3. Send once at go-live — Stripe charges them every month
4. Or use **Stripe subscription link** per client from Billing page

### Your monthly routine (5 min per client, or batch on the 1st)
- [ ] Open `/billing`
- [ ] Send invoice to everyone in **Due now**
- [ ] Mark paid as money arrives
- [ ] Dashboard shows MRR + who's overdue

---

## Failure scenarios

| Problem | Fix |
|---------|-----|
| "Link doesn't work" | Regenerate in Stripe; check amount |
| "Paid but didn't update" | Clients → Mark setup paid manually |
| "Want to pay half now" | Mark as **Deposit paid** → collect rest before go-live |
| "Chargeback" | Stripe dispute center + your signed agreement |

---

## Files in Agency OS

- **Payments** page — setup + links
- **Clients** — Collect payment panel on each client
- **Toolkit** — Service agreement (sign before payment)
