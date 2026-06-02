"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { MONTHLY_PAYMENT_STATUSES } from "@/lib/constants";
import { dueLabel } from "@/lib/billing";
import { formatCurrency } from "@/lib/utils";

type BillingRow = {
  id: string;
  businessName: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  packageName: string | null;
  monthlyFee: number;
  monthlyBillingDay: number;
  nextMonthlyDueAt: string;
  lastMonthlyPaidAt: string | null;
  monthlyPaymentStatus: string;
  paidThisMonth: boolean;
  billingPeriod: string;
};

type BillingData = {
  period: string;
  mrr: number;
  atRisk: number;
  stripeMonthlyLink: string | null;
  dueNow: BillingRow[];
  paid: BillingRow[];
  upcoming: BillingRow[];
  error?: string;
};

function statusBadge(status: string) {
  const cfg = MONTHLY_PAYMENT_STATUSES.find((s) => s.value === status);
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium text-white ${cfg?.color ?? "bg-zinc-500"}`}
    >
      {cfg?.label ?? status}
    </span>
  );
}

function BillingCard({
  row,
  onAction,
  loading,
}: {
  row: BillingRow;
  onAction: () => void;
  loading: string | null;
}) {
  const [busy, setBusy] = useState<string | null>(null);

  async function copyMonthly(channel: "email" | "sms") {
    setBusy(channel);
    const res = await fetch("/api/payments/monthly-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: row.id, channel }),
    });
    const data = await res.json();
    await navigator.clipboard.writeText(data.text ?? data.email ?? data.sms);
    setBusy(null);
    onAction();
  }

  async function markMonthlyPaid() {
    const method = prompt("Payment method? (stripe, zelle, venmo, check, cash)");
    if (!method) return;
    setBusy("paid");
    await fetch("/api/payments/mark-paid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: row.id,
        type: "monthly",
        method,
        billingPeriod: row.billingPeriod,
      }),
    });
    setBusy(null);
    onAction();
  }

  async function stripeMonthly() {
    setBusy("stripe");
    const res = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: row.id, type: "monthly" }),
    });
    const data = await res.json();
    setBusy(null);
    if (data.url) window.open(data.url, "_blank");
    else alert(data.message || "Add STRIPE_SECRET_KEY or use Zelle/check + Mark paid");
    onAction();
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-white">{row.businessName}</p>
          <p className="text-sm text-zinc-500">
            {row.packageName} · Bill on day {row.monthlyBillingDay} ·{" "}
            {formatCurrency(row.monthlyFee)}/mo
          </p>
          <p className="mt-1 text-sm text-amber-400/90">
            {dueLabel(new Date(row.nextMonthlyDueAt))}
          </p>
          {row.lastMonthlyPaidAt && (
            <p className="text-xs text-zinc-600">
              Last paid: {new Date(row.lastMonthlyPaidAt).toLocaleDateString()}
            </p>
          )}
        </div>
        {statusBadge(row.paidThisMonth ? "active" : row.monthlyPaymentStatus)}
      </div>

      {!row.paidThisMonth && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!!busy || !!loading}
            onClick={() => copyMonthly("email")}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
          >
            {busy === "email" ? "…" : "Copy monthly email"}
          </button>
          <button
            type="button"
            disabled={!!busy || !!loading}
            onClick={() => copyMonthly("sms")}
            className="rounded-lg border border-zinc-600 px-3 py-1.5 text-xs text-white hover:bg-zinc-800"
          >
            {busy === "sms" ? "…" : "Copy monthly SMS"}
          </button>
          <button
            type="button"
            disabled={!!busy || !!loading}
            onClick={stripeMonthly}
            className="rounded-lg border border-zinc-600 px-3 py-1.5 text-xs text-white hover:bg-zinc-800"
          >
            Stripe subscription link
          </button>
          <button
            type="button"
            disabled={!!busy || !!loading}
            onClick={markMonthlyPaid}
            className="rounded-lg border border-emerald-800 px-3 py-1.5 text-xs text-emerald-400"
          >
            Mark paid this month
          </button>
        </div>
      )}
    </div>
  );
}

export default function BillingPage() {
  const [data, setData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/monthly");
      const text = await res.text();
      if (!text) throw new Error("Empty response — restart dev server after migrations");
      const d = JSON.parse(text);
      if (!res.ok) throw new Error(d.error || d.hint || "Failed to load billing");
      setData(d);
    } catch (e) {
      setData({
        period: "",
        mrr: 0,
        atRisk: 0,
        stripeMonthlyLink: null,
        dueNow: [],
        paid: [],
        upcoming: [],
        error: e instanceof Error ? e.message : "Load failed",
      } as BillingData & { error?: string });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch("/api/billing/monthly", { method: "POST" })
      .catch(() => undefined)
      .finally(() => load());
  }, [load]);

  if (loading && !data) {
    return <p className="text-zinc-500">Loading monthly billing…</p>;
  }

  if (!data) return null;

  if (data.error) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold text-white">Monthly billing</h1>
        <p className="mt-4 rounded-xl border border-amber-800 bg-amber-950/30 p-4 text-amber-200">
          {data.error}
        </p>
        <p className="mt-4 text-sm text-zinc-400">
          In the project folder run:{" "}
          <code className="text-zinc-200">npx prisma generate</code> then restart{" "}
          <code className="text-zinc-200">npm run dev</code>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white">Monthly billing</h1>
      <p className="mt-1 text-zinc-400">
        Recurring revenue for <strong className="text-white">{data.period}</strong> — send
        invoices, collect Zelle/check/Stripe, mark paid.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-sm text-zinc-500">MRR (active clients)</p>
          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(data.mrr)}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-sm text-zinc-500">Due / overdue this month</p>
          <p className="text-2xl font-bold text-amber-400">{data.dueNow.length}</p>
          <p className="text-xs text-zinc-600">{formatCurrency(data.atRisk)} at risk</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-sm text-zinc-500">Paid this month</p>
          <p className="text-2xl font-bold text-white">{data.paid.length}</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-blue-800/40 bg-blue-950/20 p-4 text-sm text-zinc-300">
        <p className="font-medium text-blue-300">Monthly routine (1st of month or when due)</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-zinc-400">
          <li>Open this page → sync runs automatically</li>
          <li>For each client under <strong>Due now</strong> → Copy monthly SMS or email</li>
          <li>Zelle/check: they pay → <strong>Mark paid this month</strong></li>
          <li>Stripe: use recurring Payment Link or subscription checkout once, then auto-bills</li>
        </ol>
        <Link href="/payments" className="mt-3 inline-block text-emerald-400 hover:underline">
          Payment settings (monthly Stripe link) →
        </Link>
      </div>

      {data.dueNow.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-amber-400">
            Due now ({data.dueNow.length})
          </h2>
          <div className="space-y-3">
            {data.dueNow.map((r) => (
              <BillingCard key={r.id} row={r} onAction={load} loading={loading ? "x" : null} />
            ))}
          </div>
        </section>
      )}

      {data.upcoming.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-zinc-400">
            Upcoming ({data.upcoming.length})
          </h2>
          <div className="space-y-3">
            {data.upcoming.map((r) => (
              <BillingCard key={r.id} row={r} onAction={load} loading={null} />
            ))}
          </div>
        </section>
      )}

      {data.paid.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-emerald-400">
            Paid {data.period} ({data.paid.length})
          </h2>
          <div className="space-y-2">
            {data.paid.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800/50 px-4 py-3"
              >
                <span className="text-white">{r.businessName}</span>
                <span className="text-sm text-emerald-500">{formatCurrency(r.monthlyFee)} ✓</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.dueNow.length === 0 && data.paid.length === 0 && data.upcoming.length === 0 && (
        <p className="mt-10 text-center text-zinc-500">
          No active clients with setup paid yet. Close a client first, then return here.
        </p>
      )}
    </div>
  );
}
