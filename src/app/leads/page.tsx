"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CallStatusBadge } from "@/components/CallStatusBadge";
import { WeaknessBadge } from "@/components/WeaknessBadge";
import { CALL_STATUSES } from "@/lib/constants";
import { formatPhone, telLink } from "@/lib/utils";

type Lead = {
  id: string;
  businessName: string;
  phone: string | null;
  city: string | null;
  niche: string | null;
  callStatus: string;
  painSignals: string | null;
  primaryWeakness: string | null;
  weaknessScore: number | null;
  recommendedPackageId: string | null;
  _count: { callLogs: number };
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState("");
  const [importing, setImporting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const load = useCallback(() => {
    const params = new URLSearchParams();
    if (filter) params.set("status", filter);
    params.set("sort", "weakness");
    const q = `?${params.toString()}`;
    fetch(`/api/leads${q}`)
      .then((r) => r.json())
      .then(setLeads);
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("niche", "Imported");
    await fetch("/api/leads/import", { method: "POST", body: fd });
    setImporting(false);
    load();
    e.target.value = "";
  }

  async function updateStatus(leadId: string, callStatus: string) {
    await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callStatus }),
    });
    load();
  }

  async function reanalyzeAll() {
    setAnalyzing(true);
    await fetch("/api/leads/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onlyUncalled: false }),
    });
    setAnalyzing(false);
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-zinc-400">{leads.length} leads</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/leads/find"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Find + weaknesses
          </Link>
          <button
            type="button"
            onClick={reanalyzeAll}
            disabled={analyzing}
            className="rounded-lg border border-blue-800 px-4 py-2 text-sm text-blue-300 hover:bg-blue-950 disabled:opacity-50"
          >
            {analyzing ? "Scoring…" : "Re-score weaknesses"}
          </button>
          <Link
            href="/leads/call"
            className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-white hover:bg-zinc-800"
          >
            Call mode
          </Link>
          <label className="cursor-pointer rounded-lg border border-zinc-600 px-4 py-2 text-sm text-white hover:bg-zinc-800">
            {importing ? "Importing…" : "Import CSV"}
            <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
          </label>
          <a
            href="/api/leads/export"
            className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-white hover:bg-zinc-800"
          >
            Export CSV
          </a>
        </div>
      </div>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mt-4 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
      >
        <option value="">All statuses</option>
        {CALL_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-950 text-zinc-500">
            <tr>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Weakness</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Calls</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-zinc-800/50 hover:bg-zinc-950/50">
                <td className="px-4 py-3 font-medium text-white">
                  {lead.businessName}
                  <Link
                    href={`/dial?mode=callback&name=${encodeURIComponent(lead.businessName)}`}
                    className="ml-2 text-xs font-normal text-emerald-500 hover:underline"
                  >
                    Script
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {lead.phone ? (
                    <a href={telLink(lead.phone) ?? "#"} className="text-emerald-400 hover:underline">
                      {formatPhone(lead.phone)}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  <WeaknessBadge
                    weakness={lead.primaryWeakness}
                    score={lead.weaknessScore}
                  />
                </td>
                <td className="px-4 py-3 text-zinc-400">{lead.city ?? "—"}</td>
                <td className="px-4 py-3">
                  <select
                    value={lead.callStatus}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                    className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-white"
                    aria-label={`Status for ${lead.businessName}`}
                  >
                    {CALL_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-zinc-500">{lead._count.callLogs}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <p className="p-8 text-center text-zinc-500">No leads yet. Find or import some.</p>
        )}
      </div>
    </div>
  );
}
