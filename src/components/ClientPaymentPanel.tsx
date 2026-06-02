"use client";

import { useState } from "react";
import Link from "next/link";
import { SETUP_PAYMENT_STATUSES, MONTHLY_PAYMENT_STATUSES } from "@/lib/constants";
import { dueLabel } from "@/lib/billing";
import { formatCurrency } from "@/lib/utils";

type Client = {
  id: string;
  businessName: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  packageName: string | null;
  setupFee: number;
  monthlyFee: number;
  setupPaymentStatus: string;
  monthlyPaymentStatus: string;
  nextMonthlyDueAt?: string | null;
  monthlyBillingDay?: number | null;
};

export function ClientPaymentPanel({
  client,
  onUpdate,
}: {
  client: Client;
  onUpdate: () => void;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function createCheckout(type: "setup" | "monthly") {
    setLoading(type);
    const res = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: client.id, type }),
    });
    const data = await res.json();
    setLoading(null);
    if (data.url) {
      window.open(data.url, "_blank");
      onUpdate();
    } else {
      alert(data.message || data.error || "Add Stripe in .env or use Zelle/check + Mark paid");
    }
  }

  async function copyRequest(type: "setup" | "monthly", channel: "email" | "sms") {
    setLoading(`${type}-${channel}`);
    const url =
      type === "monthly" ? "/api/payments/monthly-request" : "/api/payments/request-text";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: client.id, channel }),
    });
    const data = await res.json();
    const text = data.text ?? data.email ?? data.sms;
    await navigator.clipboard.writeText(text);
    setCopied(`${type}-${channel}`);
    setLoading(null);
    onUpdate();
    setTimeout(() => setCopied(null), 2000);
  }

  async function markPaid(type: "setup" | "monthly") {
    const method = prompt("How did they pay? (stripe, zelle, venmo, check, cash)");
    if (!method) return;
    setLoading("paid");
    await fetch("/api/payments/mark-paid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: client.id, type, method }),
    });
    setLoading(null);
    onUpdate();
  }

  async function setSetupStatus(status: string) {
    await fetch(`/api/clients/${client.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        setupPaymentStatus: status,
        status: status === "paid" ? "active" : "awaiting_payment",
      }),
    });
    onUpdate();
  }

  const setupDone = client.setupPaymentStatus === "paid";

  return (
    <div className="mt-3 space-y-4">
      <div className="rounded-lg border border-zinc-700/50 bg-zinc-900/50 p-3">
        <p className="text-xs font-medium uppercase text-zinc-500">Setup (one-time)</p>
        <p className="mt-1 text-sm text-zinc-300">{formatCurrency(client.setupFee)}</p>
        <p className="text-xs text-amber-400">{client.setupPaymentStatus}</p>
        {!setupDone && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!!loading}
              onClick={() => createCheckout("setup")}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs text-white"
            >
              Stripe setup link
            </button>
            <button
              type="button"
              disabled={!!loading}
              onClick={() => copyRequest("setup", "email")}
              className="rounded-lg border border-zinc-600 px-3 py-1.5 text-xs text-white"
            >
              {copied === "setup-email" ? "Copied" : "Copy setup email"}
            </button>
            <button
              type="button"
              disabled={!!loading}
              onClick={() => copyRequest("setup", "sms")}
              className="rounded-lg border border-zinc-600 px-3 py-1.5 text-xs text-white"
            >
              Copy setup SMS
            </button>
            <button
              type="button"
              disabled={!!loading}
              onClick={() => markPaid("setup")}
              className="rounded-lg border border-emerald-800 px-3 py-1.5 text-xs text-emerald-400"
            >
              Mark setup paid
            </button>
          </div>
        )}
        <select
          value={client.setupPaymentStatus}
          onChange={(e) => setSetupStatus(e.target.value)}
          className="mt-3 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-white"
        >
          {SETUP_PAYMENT_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {setupDone && (
        <div className="rounded-lg border border-blue-800/30 bg-blue-950/20 p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase text-blue-400">Monthly recurring</p>
            <Link href="/billing" className="text-xs text-blue-300 hover:underline">
              Billing hub →
            </Link>
          </div>
          <p className="mt-1 text-sm text-zinc-300">{formatCurrency(client.monthlyFee)}/mo</p>
          <p className="text-xs text-zinc-500">
            Status: {client.monthlyPaymentStatus}
            {client.nextMonthlyDueAt &&
              ` · ${dueLabel(new Date(client.nextMonthlyDueAt))}`}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!!loading}
              onClick={() => copyRequest("monthly", "email")}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-500"
            >
              {copied === "monthly-email" ? "Copied" : "Copy monthly invoice email"}
            </button>
            <button
              type="button"
              disabled={!!loading}
              onClick={() => copyRequest("monthly", "sms")}
              className="rounded-lg border border-zinc-600 px-3 py-1.5 text-xs text-white"
            >
              {copied === "monthly-sms" ? "Copied" : "Copy monthly SMS (Zelle)"}
            </button>
            <button
              type="button"
              disabled={!!loading}
              onClick={() => createCheckout("monthly")}
              className="rounded-lg border border-zinc-600 px-3 py-1.5 text-xs text-white"
            >
              Stripe monthly link
            </button>
            <button
              type="button"
              disabled={!!loading}
              onClick={() => markPaid("monthly")}
              className="rounded-lg border border-emerald-800 px-3 py-1.5 text-xs text-emerald-400"
            >
              Mark monthly paid
            </button>
          </div>
          <select
            value={client.monthlyPaymentStatus}
            onChange={async (e) => {
              await fetch(`/api/clients/${client.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ monthlyPaymentStatus: e.target.value }),
              });
              onUpdate();
            }}
            className="mt-3 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-white"
          >
            {MONTHLY_PAYMENT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
