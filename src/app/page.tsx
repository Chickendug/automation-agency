"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { formatCurrency } from "@/lib/utils";

type Dashboard = {
  totalLeads: number;
  notCalled: number;
  callbacksToday: number;
  interested: number;
  activeClients: number;
  callsToday: number;
  mrr: number;
  mrrGoal: number;
  setupCollected: number;
  awaitingPayment: number;
  monthlyDueCount: number;
  agencyName: string;
};

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    fetch("/api/dashboard", { signal: controller.signal })
      .then(async (r) => {
        const text = await r.text();
        if (!text) throw new Error("Server returned empty response");
        const json = JSON.parse(text);
        if (!r.ok) throw new Error(json.error ?? "Dashboard failed");
        setData(json);
      })
      .catch((e) => {
        setError(
          e instanceof Error ? e.message : "Could not load — restart npm run dev"
        );
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);

  if (error) {
    return (
      <div className="max-w-lg">
        <p className="rounded-xl border border-amber-800 bg-amber-950/30 p-4 text-amber-200">
          {error}
        </p>
        <p className="mt-4 text-sm text-zinc-400">
          Stop the terminal (Ctrl+C), then run:
        </p>
        <pre className="mt-2 rounded-lg bg-zinc-900 p-3 text-sm text-white">
          cd C:\Users\jeden\Projects\automation-agency{"\n"}npm run dev:clean
        </pre>
        <Link href="/start" className="mt-4 inline-block text-emerald-400 hover:underline">
          Or go to Start Here →
        </Link>
      </div>
    );
  }

  if (!data) {
    return <p className="text-zinc-500">Loading dashboard…</p>;
  }

  const mrrPct = Math.min(100, Math.round((data.mrr / data.mrrGoal) * 100));

  return (
    <div className="max-w-5xl">
      <Link
        href="/start"
        className="mb-6 flex items-center justify-between rounded-xl border border-emerald-700/50 bg-emerald-950/40 px-5 py-4 transition hover:border-emerald-500"
      >
        <span className="font-semibold text-emerald-300">★ Wake up? Start Here — today&apos;s checklist</span>
        <span className="text-emerald-500">→</span>
      </Link>

      <h1 className="text-2xl font-bold text-white">{data.agencyName}</h1>
      <p className="mt-1 text-zinc-400">Your command center — find leads, dial, close clients.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Leads in pipeline" value={data.totalLeads} sub={`${data.notCalled} not called yet`} />
        <StatCard label="Callbacks today" value={data.callbacksToday} />
        <StatCard label="Interested leads" value={data.interested} />
        <StatCard label="Calls logged today" value={data.callsToday} />
      </div>

      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-zinc-500">Monthly recurring revenue</p>
            <p className="text-3xl font-bold text-emerald-400">
              {formatCurrency(data.mrr)}
              <span className="text-lg font-normal text-zinc-500">
                {" "}
                / {formatCurrency(data.mrrGoal)} goal
              </span>
            </p>
          </div>
          <p className="text-2xl font-semibold text-zinc-400">{mrrPct}%</p>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${mrrPct}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-zinc-500">
          {data.activeClients} active clients — target ~20–25 at $400–500/mo
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          Setup fees collected: {formatCurrency(data.setupCollected)}
          {data.awaitingPayment > 0 && (
            <span className="text-amber-400">
              {" "}
              · {data.awaitingPayment} awaiting payment
            </span>
          )}
        </p>
        <div className="mt-3 flex gap-4 text-sm">
          <Link href="/payments" className="text-emerald-400 hover:underline">
            Payment setup →
          </Link>
          {data.monthlyDueCount > 0 && (
            <Link href="/billing" className="text-amber-400 hover:underline">
              {data.monthlyDueCount} monthly due →
            </Link>
          )}
          <Link href="/billing" className="text-zinc-500 hover:text-white">
            Monthly billing →
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/leads/find"
          className="rounded-xl border border-emerald-800/50 bg-emerald-950/30 p-6 transition hover:border-emerald-600"
        >
          <h2 className="font-semibold text-emerald-400">1. Find leads</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Search Google for businesses in your niche + city. Pull phones automatically.
          </p>
        </Link>
        <Link
          href="/dial"
          className="rounded-xl border border-blue-800/50 bg-blue-950/30 p-6 transition hover:border-blue-600"
        >
          <h2 className="font-semibold text-blue-400">2. Dial script + call</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Dial through your list. Log outcomes in one click. Hit 80–100 calls/day.
          </p>
        </Link>
        <Link
          href="/packages"
          className="rounded-xl border border-amber-800/50 bg-amber-950/30 p-6 transition hover:border-amber-600"
        >
          <h2 className="font-semibold text-amber-400">3. Sell & deliver</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Use packages, scripts, and playbooks to close and build automations.
          </p>
        </Link>
      </div>

      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="font-semibold text-white">Daily routine (copy this)</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-zinc-300">
          <li>Morning: Find 50–100 new leads in ONE niche + ONE city</li>
          <li>9am–12pm: Call mode — log every outcome</li>
          <li>Afternoon: Demos for interested leads (15 min each)</li>
          <li>Send proposals same day — use Scripts page template</li>
          <li>Deliver using Playbooks — 2–3 days per client</li>
        </ol>
      </div>
    </div>
  );
}
