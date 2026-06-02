# Publish Agency OS (use on your phone)

Get a URL like `https://your-agency.vercel.app` — open it on your phone, tap **Call**, dial.

---

## Step 1 — Put code on GitHub (10 min)

1. Create a repo at [github.com/new](https://github.com/new) (private is fine)
2. In PowerShell:

```powershell
cd C:\Users\jeden\Projects\automation-agency
git add .
git commit -m "Prepare for deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/automation-agency.git
git push -u origin main
```

---

## Step 2 — Cloud database Turso (free, 5 min)

Your phone needs a **shared database** in the cloud (not just your laptop).

1. Sign up at [turso.tech](https://turso.tech)
2. Install Turso CLI (or use their web dashboard)
3. Create a database:

```powershell
turso db create automation-agency
turso db show automation-agency --url
turso db tokens create automation-agency
```

4. Copy the URL — looks like:
   `libsql://your-db-name-username.turso.io`

5. Set token as part of URL or use:
   `libsql://your-db-name-username.turso.io?authToken=YOUR_TOKEN`

---

## Step 3 — Deploy on Vercel (5 min)

1. Sign up at [vercel.com](https://vercel.com) (free)
2. **Add New Project** → Import your GitHub repo
3. **Environment variables** (Settings → Environment Variables):

| Name | Value |
|------|--------|
| `DATABASE_URL` | `libsql://...` (from Turso) |
| `GOOGLE_PLACES_API_KEY` | your Google key |
| `NEXT_PUBLIC_APP_URL` | `https://YOUR-PROJECT.vercel.app` |

4. Click **Deploy**
5. After deploy, run migrations once (Vercel may do this on build — if errors, use Turso shell or local):

```powershell
$env:DATABASE_URL="libsql://..."
npx prisma migrate deploy
npm run seed
```

---

## Step 4 — Use on your phone

1. Open **Safari** (iPhone) or **Chrome** (Android)
2. Go to your Vercel URL
3. **iPhone:** Share → **Add to Home Screen** → opens like an app
4. **Android:** Menu → **Install app** or Add to Home Screen
5. Tap **Call** in the bottom bar → **Tap to dial** opens your phone app

---

## Daily use from home + phone

| Device | URL |
|--------|-----|
| Laptop | `http://localhost:3000` (dev) or same Vercel URL |
| Phone | Your Vercel URL (bookmarked / home screen) |

Same leads, same scripts — synced via Turso database.

---

## Optional: Stripe on live site

Add to Vercel env:

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Webhook URL: `https://YOUR-PROJECT.vercel.app/api/payments/webhook`

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Site loads but empty data | Run `prisma migrate deploy` against Turso URL |
| Build fails on Vercel | Check `DATABASE_URL` is set before deploy |
| Google find leads fails | Add API key in Vercel env, redeploy |
| Old localhost data missing | Re-import or re-scan leads on live site (local SQLite ≠ cloud) |
| **404 on `/docs/*.md`** | Use `/guides/appointment-reminders` instead |
| **401 / login wall on Vercel URL** | Settings → Deployment Protection → set **Production** to **Off** (or "Only Preview"), then redeploy |

---

## Build guides (in app)

After deploy: `/guides/appointment-reminders` · `/guides/deposit-hold` · `/guides/missed-call-recovery`

Local dev: `http://localhost:3000/guides/appointment-reminders`

---

## Quick test without full deploy

Only works while your PC is on:

```powershell
npx ngrok http 3000
```

Open the `https://xxxx.ngrok.io` link on your phone — temporary, not for daily use.
