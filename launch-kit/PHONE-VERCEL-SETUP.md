# Phone + Vercel — make everything work

Your laptop (`localhost:3000`) and phone (Vercel URL) must share the **same Turso database**.

---

## Step 1 — Turn off the login wall (required)

Vercel → **automation-agency** → **Settings** → **Deployment Protection**

Set **Production** to **Off** (or disable Standard Protection for production).

Without this, your phone shows login / connection errors.

---

## Step 2 — Env vars on Vercel (required)

| Name | Value |
|------|--------|
| `DATABASE_URL` | `libsql://....turso.io?authToken=...` |
| `GOOGLE_PLACES_API_KEY` | your key |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` |

Redeploy after saving.

---

## Step 3 — Seed Turso (required once)

Your 20 leads on laptop are in **local SQLite**. Phone uses **Turso** — empty until you scan or import.

**Option A — Re-scan on phone**
1. Open Vercel URL on phone
2. **Find** → scan Orange County dental
3. Leads appear in cloud DB

**Option B — Export from laptop, import on phone**
1. Laptop → **Leads** → **Export CSV**
2. Phone/browser → **Leads** → **Import CSV**

**Option C — Seed script (settings only)**
```powershell
cd C:\Users\jeden\Projects\automation-agency
.\scripts\seed-turso.ps1 -DatabaseUrl "libsql://...?authToken=..."
```

---

## Step 4 — Add to Home Screen

**iPhone (Safari):** Share → **Add to Home Screen**  
**Android (Chrome):** Menu → **Install app**

Opens to **Call mode** (bottom bar: Call · Find · Script · Leads · Home).

---

## Phone features checklist

| Feature | How |
|---------|-----|
| Bottom nav | Shows on phone/tablet (< 1024px width) |
| Tap to dial | **Call mode** → green **Tap to dial** button |
| Call queue | Includes not_called, no_answer, voicemail, callback |
| Scripts | **Script** tab or `/dial` |
| Find leads | **Find** tab (needs Google API key in Vercel) |
| Synced data | Same Turso DB on laptop + phone |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Login wall on phone | Deployment Protection → Off |
| Call mode empty | Import CSV or Find leads on live site |
| No bottom bar | Widen issue — rotate phone portrait; don't use "Desktop site" |
| Tap to dial does nothing | Must open site in phone browser, not laptop |
| Find leads fails | Add `GOOGLE_PLACES_API_KEY` in Vercel, redeploy |
