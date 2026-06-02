"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NICHES } from "@/lib/constants";
import { PACKAGES } from "@/lib/data/packages";

type Settings = {
  agencyName: string;
  yourName: string | null;
  yourPhone: string | null;
  yourEmail: string | null;
  defaultNiche: string;
  defaultCity: string | null;
  defaultPackageId: string;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings);
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!settings) return <p className="text-zinc-500">Loading…</p>;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-white">Settings</h1>
      <p className="mt-1 text-zinc-400">
        Fills your Dial Script automatically. <strong className="text-emerald-400">Do this first.</strong>
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm text-zinc-400">Agency name</label>
          <input
            value={settings.agencyName}
            onChange={(e) => setSettings({ ...settings, agencyName: e.target.value })}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Your name (on calls)</label>
          <input
            required
            value={settings.yourName ?? ""}
            onChange={(e) => setSettings({ ...settings, yourName: e.target.value })}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Your phone</label>
          <input
            required
            placeholder="5551234567"
            value={settings.yourPhone ?? ""}
            onChange={(e) => setSettings({ ...settings, yourPhone: e.target.value })}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Your email</label>
          <input
            value={settings.yourEmail ?? ""}
            onChange={(e) => setSettings({ ...settings, yourEmail: e.target.value })}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Default niche (for scripts + lead search)</label>
          <select
            value={settings.defaultNiche}
            onChange={(e) => setSettings({ ...settings, defaultNiche: e.target.value })}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          >
            {NICHES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Default city (for lead search)</label>
          <input
            placeholder="Phoenix, AZ"
            value={settings.defaultCity ?? ""}
            onChange={(e) => setSettings({ ...settings, defaultCity: e.target.value })}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Default package to sell</label>
          <select
            value={settings.defaultPackageId}
            onChange={(e) => setSettings({ ...settings, defaultPackageId: e.target.value })}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          >
            {PACKAGES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-emerald-600 px-6 py-2 font-medium text-white hover:bg-emerald-500"
        >
          Save
        </button>
        {saved && <span className="ml-3 text-sm text-emerald-400">Saved!</span>}
      </form>

      <div className="mt-6 flex flex-col gap-2">
        <Link href="/dial" className="text-emerald-400 hover:underline">
          Open Dial Script →
        </Link>
        <Link href="/payments" className="text-emerald-400 hover:underline">
          Set up how you get paid (Stripe) →
        </Link>
      </div>

      <div className="mt-10 rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">
        <p className="font-medium text-zinc-300">Environment (.env)</p>
        <pre className="mt-2 overflow-x-auto text-xs text-zinc-500">
          {`DATABASE_URL="file:./dev.db"
GOOGLE_PLACES_API_KEY=your_key_here`}
        </pre>
      </div>
    </div>
  );
}
