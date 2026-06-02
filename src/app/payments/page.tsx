"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PAYMENT_METHODS,
  PAYMENT_FLOW_STEPS,
  STRIPE_SETUP_STEPS,
  PACKAGE_STRIPE_PRODUCTS,
  INVOICE_TEMPLATE,
} from "@/lib/data/payments";
import { fillTemplate } from "@/lib/script-engine";

type PaymentSettings = {
  stripePaymentLinkSetup: string | null;
  stripePaymentLinkMonthly: string | null;
  paypalEmail: string | null;
  venmoHandle: string | null;
  zellePhone: string | null;
  bankTransferNotes: string | null;
  invoicePrefix: string;
  stripeApiConfigured?: boolean;
  agencyName: string;
  yourName: string | null;
  yourEmail: string | null;
  yourPhone: string | null;
};

export default function PaymentsPage() {
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings);
  }, []);

  async function save(e: React.FormEvent) {
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

  const invoicePreview = settings
    ? fillTemplate(
        INVOICE_TEMPLATE.replace(/\{\{#if (\w+)\}\}/g, "").replace(/\{\{\/if\}\}/g, "").replace(/\{\{(\w+)\}\}/g, "[$1]"),
        {
          agencyName: settings.agencyName,
          yourName: settings.yourName ?? "Your Name",
          yourEmail: settings.yourEmail ?? "",
          yourPhone: settings.yourPhone ?? "",
          businessName: "Client Business LLC",
          packageName: "Missed Call Recovery System",
          setupFee: "$1,500",
          monthlyFee: "$397/mo",
        }
      )
    : "";

  if (!settings) return <p className="text-zinc-500">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white">Payments</h1>
      <p className="mt-1 text-zinc-400">
        How you get paid: setup fee before work, monthly after go-live.{" "}
        <strong className="text-emerald-400">Stripe is the default.</strong>
      </p>

      <div className="mt-6 rounded-xl border border-emerald-800/40 bg-emerald-950/20 p-5">
        <h2 className="font-semibold text-emerald-300">Recommended stack</h2>
        <p className="mt-2 text-sm text-zinc-300">
          <strong>Stripe Payment Links</strong> (today, no code) + optional{" "}
          <strong>Stripe API</strong> (one-click links from Clients page).
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          API status:{" "}
          {settings.stripeApiConfigured ? (
            <span className="text-emerald-400">Connected (STRIPE_SECRET_KEY in .env)</span>
          ) : (
            <span className="text-amber-400">Not connected — paste Payment Links below</span>
          )}
        </p>
        <Link href="/clients" className="mt-3 inline-block text-sm text-emerald-400 hover:underline">
          Collect from a client →
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="font-semibold text-white">Payment flow (memorize this)</h2>
        <ol className="mt-4 space-y-4">
          {PAYMENT_FLOW_STEPS.map((s) => (
            <li key={s.step} className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold">
                {s.step}
              </span>
              <div>
                <p className="font-medium text-white">{s.title}</p>
                <p className="mt-1 text-sm text-zinc-400">{s.action}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="font-semibold text-white">Compare methods</h2>
        <div className="mt-4 space-y-3">
          {PAYMENT_METHODS.map((m) => (
            <div key={m.id} className="rounded-xl border border-zinc-800 p-4">
              <p className="font-medium text-white">
                {m.name}
                {m.id === "stripe" && (
                  <span className="ml-2 text-xs text-emerald-400">★ Best</span>
                )}
              </p>
              <p className="mt-1 text-sm text-zinc-400">{m.why}</p>
              <p className="mt-1 text-xs text-zinc-600">
                Fees: {m.fees} · Best for: {m.bestFor}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-semibold text-white">Stripe setup (one time)</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-zinc-400">
          {STRIPE_SETUP_STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <a
          href="https://dashboard.stripe.com/register"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block rounded-lg bg-[#635bff] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Open Stripe Dashboard →
        </a>

        <h3 className="mt-8 text-sm font-medium text-zinc-300">Products to create</h3>
        <div className="mt-3 overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="text-zinc-500">
              <tr>
                <th className="px-3 py-2">Package</th>
                <th className="px-3 py-2">Setup</th>
                <th className="px-3 py-2">Monthly</th>
              </tr>
            </thead>
            <tbody>
              {PACKAGE_STRIPE_PRODUCTS.map((p) => (
                <tr key={p.packageId} className="border-t border-zinc-800 text-zinc-300">
                  <td className="px-3 py-2">{p.setupProductName}</td>
                  <td className="px-3 py-2">${p.setupAmount}</td>
                  <td className="px-3 py-2">${p.monthlyAmount}/mo</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <form onSubmit={save} className="mt-10 space-y-4 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="font-semibold text-white">Your payment links (paste from Stripe)</h2>
        <div>
          <label className="block text-sm text-zinc-400">Setup fee payment link (default)</label>
          <input
            placeholder="https://buy.stripe.com/..."
            value={settings.stripePaymentLinkSetup ?? ""}
            onChange={(e) =>
              setSettings({ ...settings, stripePaymentLinkSetup: e.target.value })
            }
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Monthly subscription payment link</label>
          <input
            placeholder="https://buy.stripe.com/..."
            value={settings.stripePaymentLinkMonthly ?? ""}
            onChange={(e) =>
              setSettings({ ...settings, stripePaymentLinkMonthly: e.target.value })
            }
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">PayPal email</label>
          <input
            value={settings.paypalEmail ?? ""}
            onChange={(e) => setSettings({ ...settings, paypalEmail: e.target.value })}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Venmo @handle</label>
          <input
            value={settings.venmoHandle ?? ""}
            onChange={(e) => setSettings({ ...settings, venmoHandle: e.target.value })}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Zelle phone</label>
          <input
            value={settings.zellePhone ?? ""}
            onChange={(e) => setSettings({ ...settings, zellePhone: e.target.value })}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Bank transfer instructions</label>
          <textarea
            rows={2}
            value={settings.bankTransferNotes ?? ""}
            onChange={(e) =>
              setSettings({ ...settings, bankTransferNotes: e.target.value })
            }
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-emerald-600 px-6 py-2 font-medium text-white hover:bg-emerald-500"
        >
          Save payment settings
        </button>
        {saved && <span className="ml-2 text-sm text-emerald-400">Saved</span>}
      </form>

      <section className="mt-10 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="font-semibold text-white">Stripe API (optional — auto links)</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Add to <code className="text-zinc-300">.env</code> for one-click Checkout from Clients:
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-zinc-900 p-3 text-xs text-zinc-500">
{`STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000`}
        </pre>
        <p className="mt-2 text-xs text-zinc-600">
          Webhook URL: <code>{typeof window !== "undefined" ? window.location.origin : "https://yourdomain.com"}/api/payments/webhook</code> — event: checkout.session.completed
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-semibold text-white">Invoice template</h2>
        <pre className="mt-4 max-h-64 overflow-y-auto whitespace-pre-wrap rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-500">
          {invoicePreview}
        </pre>
      </section>

      <p className="mt-8 text-sm text-zinc-600">
        Full guide: <code>launch-kit/PAYMENTS-GUIDE.md</code>
      </p>
    </div>
  );
}
