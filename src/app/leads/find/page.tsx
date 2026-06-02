"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NICHES } from "@/lib/constants";
import { WeaknessBadge } from "@/components/WeaknessBadge";

type ScannedLead = {
  businessName: string;
  phone: string | null;
  rating: number | null;
  reviewCount: number | null;
  primaryWeakness: string;
  recommendedPackageName: string;
  weaknessScore: number;
  pitchHook: string;
  painSignals: string | null;
  weaknessSignals: { label: string; severity: string }[];
};

export default function FindLeadsPage() {
  const [niche, setNiche] = useState<string>(NICHES[0]);
  const [city, setCity] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<ScannedLead[] | null>(null);
  const [result, setResult] = useState<{
    created?: number;
    skipped?: number;
    total?: number;
    error?: string;
    message?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => {
        if (s.defaultNiche) setNiche(s.defaultNiche);
        if (s.defaultCity) setCity(s.defaultCity);
      })
      .catch(() => undefined);
  }, []);

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setPreview(null);
    const res = await fetch("/api/leads/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche, city, query: query || niche }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) {
      setResult({ error: data.error, message: data.message });
      return;
    }
    setPreview(data.leads ?? []);
  }

  async function handleSave() {
    setSaving(true);
    setResult(null);
    const res = await fetch("/api/leads/find", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche, city, query: query || niche }),
    });
    const data = await res.json();
    setSaving(false);
    setResult(data);
    if (!data.error) setPreview(null);
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white">Find leads + weaknesses</h1>
      <p className="mt-1 text-zinc-400">
        Scans Google, scores what each business lacks most, and tells you which package to sell.
      </p>

      <form onSubmit={handleScan} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm text-zinc-400">Niche</label>
          <select
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
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
          <label className="block text-sm text-zinc-400">City + state</label>
          <input
            required
            placeholder="Phoenix, AZ"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Search query (optional)</label>
          <input
            placeholder="Defaults to niche name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? "Scanning weaknesses…" : "Scan for weaknesses"}
        </button>
      </form>

      {preview && preview.length > 0 && (
        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-zinc-400">
              Sorted by best targets first (higher score = easier sell)
            </p>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              {saving ? "Saving…" : `Save all ${preview.length} to leads`}
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {preview.map((lead, i) => (
              <div
                key={`${lead.businessName}-${i}`}
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-white">{lead.businessName}</p>
                    <p className="text-sm text-zinc-500">
                      {lead.phone ?? "No phone"}
                      {lead.rating != null && ` · ★ ${lead.rating} (${lead.reviewCount ?? 0} reviews)`}
                    </p>
                  </div>
                  <WeaknessBadge weakness={lead.primaryWeakness} score={lead.weaknessScore} />
                </div>

                <p className="mt-2 text-xs font-medium text-emerald-400">
                  Sell: {lead.recommendedPackageName}
                </p>

                <p className="mt-2 rounded-lg bg-zinc-900 p-3 text-sm italic text-zinc-300">
                  &ldquo;{lead.pitchHook}&rdquo;
                </p>

                {lead.weaknessSignals?.length > 0 && (
                  <ul className="mt-2 list-inside list-disc text-xs text-zinc-500">
                    {lead.weaknessSignals.slice(0, 3).map((s) => (
                      <li key={s.label}>{s.label}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="mt-4 w-full rounded-lg bg-emerald-600 py-3 font-medium text-white"
          >
            Save to leads & start dialing
          </button>
        </div>
      )}

      {result && (
        <div
          className={`mt-6 rounded-lg border p-4 ${
            result.error
              ? "border-amber-800 bg-amber-950/30 text-amber-200"
              : "border-emerald-800 bg-emerald-950/30 text-emerald-200"
          }`}
        >
          {result.error === "missing_api_key" ? (
            <>
              <p className="font-medium">Google Places API key required</p>
              <p className="mt-2 text-sm opacity-90">{result.message}</p>
            </>
          ) : result.error ? (
            <p>{result.error}</p>
          ) : (
            <>
              <p>
                Added <strong>{result.created}</strong> leads ({result.skipped} duplicates skipped).
              </p>
              <Link href="/leads/call" className="mt-2 inline-block text-sm underline">
                Go to Call Mode →
              </Link>
            </>
          )}
        </div>
      )}

      <div className="mt-8 rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">
        <p className="font-medium text-zinc-300">What we detect</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Missed calls — field-service niches, no phone listed</li>
          <li>Slow lead follow-up — law, real estate, gyms</li>
          <li>Weak reputation — low rating or few Google reviews</li>
          <li>No-shows — dental, salons, med spas</li>
          <li>Weak online presence — no website</li>
        </ul>
      </div>
    </div>
  );
}
