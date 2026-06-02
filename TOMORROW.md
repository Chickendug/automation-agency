# Tomorrow — Sign up, lead finder, start dialing

Do these in order. **~45 min setup**, then dial the rest of the day.

---

## 1. Start the app (2 min)

```powershell
cd C:\Users\jeden\Projects\automation-agency
npx prisma generate
npm run dev
```

Open **http://localhost:3000/start**

If billing or any page errors: stop the server (Ctrl+C), run `npx prisma generate` again, then `npm run dev`.

---

## 2. Your info in the app (5 min)

**Settings** → fill in:

- Your name, phone, email  
- Agency name  
- **Default niche** (one only — e.g. `HVAC / plumbing`)  
- **Default city** (e.g. `Phoenix, AZ`)

---

## 3. Google Lead Finder (15 min) — so you can pull real numbers

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or pick one)
3. **APIs & Services → Library** → search **Places API (New)** → **Enable**
4. **APIs & Services → Credentials** → **Create credentials → API key**
5. Copy the key into `.env`:

   ```
   GOOGLE_PLACES_API_KEY=paste_your_key_here
   ```

6. **Restart** the dev server (`Ctrl+C`, then `npm run dev`)

7. Test: **Find Leads** → pick niche + city → **Find & save leads**  
   - Should say “Added X leads”  
   - If error: key wrong, API not enabled, or billing not set on Google Cloud (free tier usually enough)

**No Google key yet?** Use **Leads → Import CSV** or the 10 sample leads already loaded.

---

## 4. Sign ups you can do tomorrow (optional before dialing)

| Tool | Why | Link |
|------|-----|------|
| **Stripe** | Setup + monthly payments | stripe.com |
| **Make.com** | Build automations after clients pay | make.com |
| **Twilio** | SMS for clients | twilio.com |

Paste Stripe payment links in **Payments** when ready. Not required to start dialing.

---

## 5. Dialing setup (2 min)

1. **Dial Script** — `/dial` — open on phone or second monitor  
2. **Call Mode** — `/leads/call` — tap to dial + log results  

---

## 6. Your dialing day

| Time | Task |
|------|------|
| Morning | Find 50–100 leads (one niche, one city) |
| 9am–12pm | **80–100 dials** — log every call |
| Afternoon | Demos for interested → send payment link when they say yes |

**Goals:** 3 interested · 1 demo booked

---

## Quick links

| Page | URL |
|------|-----|
| Start checklist | http://localhost:3000/start |
| Find leads | http://localhost:3000/leads/find |
| Call mode | http://localhost:3000/leads/call |
| Dial script | http://localhost:3000/dial |
| Payments (later) | http://localhost:3000/payments |
| Monthly billing (later) | http://localhost:3000/billing |

---

## Remember

- **One niche + one city** all week — don't switch mid-day  
- **Don't build automations** until someone pays setup  
- Monthly billing page is for **after** you have active clients  

You've got this.
