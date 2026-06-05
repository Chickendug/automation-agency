"use client";

import { useCallback, useEffect, useState } from "react";
import { CallStatusBadge } from "@/components/CallStatusBadge";
import { WeaknessBadge } from "@/components/WeaknessBadge";
import { CALL_STATUSES } from "@/lib/constants";
import { formatPhone, telLink } from "@/lib/utils";
import Link from "next/link";

type Lead = {
  id: string;
  businessName: string;
  phone: string | null;
  city: string | null;
  niche: string | null;
  painSignals: string | null;
  notes: string | null;
  website: string | null;
  callStatus: string;
  primaryWeakness: string | null;
  recommendedPackageId: string | null;
  recommendedPackageName?: string;
  weaknessScore: number | null;
  pitchHook: string | null;
};

export default function CallModePage() {
  const [queue, setQueue] = useState<Lead[]>([]);
  const [index, setIndex] = useState(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadQueue = useCallback(() => {
    setLoading(true);
    fetch("/api/leads?callable=true&sort=weakness")
      .then((r) => r.json())
      .then((leads: Lead[]) => {
        const withPhone = leads.filter((l) => l.phone);
        setQueue(withPhone);
        setIndex(0);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  const current = queue[index];

  async function logCall(outcome: string) {
    if (!current) return;
    setSaving(true);
    const callbackAt =
      outcome === "callback"
        ? new Date(Date.now() + 86400000).toISOString()
        : null;

    await fetch(`/api/leads/${current.id}/call`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outcome, notes, callbackAt }),
    });

    setNotes("");
    setQueue((q) => q.filter((_, i) => i !== index));
    if (index >= queue.length - 1) setIndex(Math.max(0, index - 1));
    setSaving(false);
  }

  async function convertToClient() {
    if (!current) return;
    await fetch(`/api/leads/${current.id}/convert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        packageId: current.recommendedPackageId ?? "missed-call-recovery",
        status: "prospect",
      }),
    });
    alert("Added to Clients with recommended package!");
    loadQueue();
  }

  if (loading) return <p className="text-zinc-500">Loading call queue (best targets first)…</p>;

  if (!current) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white">Call mode</h1>
        <p className="mt-4 text-zinc-400">
          No callable leads (not called, no answer, voicemail, or callback). Scan or import on this
          site — laptop data does not sync unless you use the same Vercel URL + Turso.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/leads/find" className="text-emerald-400 hover:underline">
            Find leads →
          </Link>
          <Link href="/leads" className="text-emerald-400 hover:underline">
            Import CSV →
          </Link>
        </div>
      </div>
    );
  }

  const tel = telLink(current.phone);

  return (
    <div className="max-w-2xl pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Call mode</h1>
        <span className="text-sm text-zinc-500">
          {index + 1} of {queue.length} · sorted by weakness score
        </span>
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-700 bg-zinc-950 p-8">
        <div className="flex flex-wrap items-center gap-2">
          <CallStatusBadge status={current.callStatus} />
          {current.primaryWeakness && (
            <WeaknessBadge
              weakness={current.primaryWeakness}
              score={current.weaknessScore}
            />
          )}
        </div>

        <h2 className="mt-4 text-3xl font-bold text-white">{current.businessName}</h2>
        <p className="mt-2 text-xl text-emerald-400">{formatPhone(current.phone)}</p>
        {current.city && <p className="text-zinc-500">{current.city}</p>}

        {current.pitchHook && (
          <div className="mt-6 rounded-xl border border-amber-800/40 bg-amber-950/20 p-4">
            <p className="text-xs font-bold uppercase text-amber-400">Say this (their weakness)</p>
            <p className="mt-2 text-lg leading-relaxed text-white">{current.pitchHook}</p>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(current.pitchHook!)}
              className="mt-2 text-xs text-amber-300 hover:underline"
            >
              Copy pitch
            </button>
          </div>
        )}

        {current.painSignals && (
          <p className="mt-3 text-sm text-zinc-500">Signals: {current.painSignals}</p>
        )}

        {tel ? (
          <a
            href={tel}
            className="mt-6 flex min-h-14 w-full touch-manipulation items-center justify-center rounded-xl bg-emerald-600 py-4 text-xl font-semibold text-white active:bg-emerald-700"
          >
            📞 Tap to dial
          </a>
        ) : (
          <p className="mt-6 text-center text-sm text-amber-400">No phone number on this lead.</p>
        )}

        <textarea
          placeholder="Call notes…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-4 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
          rows={2}
        />

        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CALL_STATUSES.filter((s) => s.value !== "not_called").map((s) => (
            <button
              key={s.value}
              type="button"
              disabled={saving}
              onClick={() => logCall(s.value)}
              className="rounded-lg border border-zinc-700 px-3 py-3 text-sm text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900 disabled:opacity-50"
            >
              {s.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={convertToClient}
          className="mt-4 w-full rounded-lg border border-emerald-700 py-2 text-sm text-emerald-400 hover:bg-emerald-950"
        >
          Interested → add to Clients (recommended package)
        </button>
      </div>

      <a
        href="/dial"
        target="_blank"
        rel="noreferrer"
        className="mt-6 flex w-full items-center justify-center rounded-xl border border-emerald-700 py-3 text-emerald-400 hover:bg-emerald-950"
      >
        Open full Dial Script →
      </a>
    </div>
  );
}
