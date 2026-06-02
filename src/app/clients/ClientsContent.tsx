"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ClientPaymentPanel } from "@/components/ClientPaymentPanel";
import { CLIENT_STATUSES, SETUP_PAYMENT_STATUSES } from "@/lib/constants";
import { PACKAGES } from "@/lib/data/packages";
import { formatCurrency, formatPhone } from "@/lib/utils";

type Client = {
  id: string;
  businessName: string;
  contactName: string | null;
  phone: string | null;
  email: string | null;
  packageName: string | null;
  status: string;
  setupFee: number;
  monthlyFee: number;
  setupPaymentStatus: string;
  monthlyPaymentStatus: string;
  setupPaidAt: string | null;
  nextMonthlyDueAt: string | null;
  monthlyBillingDay: number | null;
};

export default function ClientsContent() {
  const searchParams = useSearchParams();
  const [clients, setClients] = useState<Client[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    phone: "",
    email: "",
    packageId: PACKAGES[0].id,
    status: "prospect",
  });

  function load() {
    fetch("/api/clients")
      .then((r) => r.json())
      .then(setClients);
  }

  useEffect(() => {
    load();
    if (searchParams.get("paid")) {
      setTimeout(
        () =>
          alert(
            "If payment went through, client should be marked paid. Otherwise use Mark setup paid."
          ),
        300
      );
    }
  }, [searchParams]);

  useEffect(() => {
    const clientId = searchParams.get("client");
    if (clientId) setExpanded(clientId);
  }, [searchParams]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({
      businessName: "",
      contactName: "",
      phone: "",
      email: "",
      packageId: PACKAGES[0].id,
      status: "prospect",
    });
    load();
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/clients/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  const mrr = clients
    .filter((c) => c.status === "active")
    .reduce((s, c) => s + c.monthlyFee, 0);

  const collected = clients
    .filter((c) => c.setupPaymentStatus === "paid")
    .reduce((s, c) => s + c.setupFee, 0);

  const awaiting = clients.filter(
    (c) => c.setupPaymentStatus === "sent" || c.status === "awaiting_payment"
  );

  const paymentLabel = (status: string) =>
    SETUP_PAYMENT_STATUSES.find((s) => s.value === status)?.label ?? status;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-zinc-400">
            MRR: {formatCurrency(mrr)} · Setup collected: {formatCurrency(collected)}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/payments"
            className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-white hover:bg-zinc-800"
          >
            Payment setup
          </Link>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
          >
            Add client
          </button>
        </div>
      </div>

      {awaiting.length > 0 && (
        <div className="mt-6 rounded-xl border border-amber-800/50 bg-amber-950/20 p-4">
          <p className="font-medium text-amber-300">
            {awaiting.length} awaiting setup payment — send link & mark paid when cleared
          </p>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mt-6 max-w-md space-y-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4"
        >
          <input
            required
            placeholder="Business name"
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
          />
          <input
            placeholder="Contact name"
            value={form.contactName}
            onChange={(e) => setForm({ ...form, contactName: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
          />
          <input
            placeholder="Email (for Stripe receipts)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
          />
          <select
            value={form.packageId}
            onChange={(e) => setForm({ ...form, packageId: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
          >
            {PACKAGES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — ${p.setupFee} + ${p.monthlyFee}/mo
              </option>
            ))}
          </select>
          <button type="submit" className="w-full rounded-lg bg-emerald-600 py-2 text-white">
            Save
          </button>
        </form>
      )}

      <div className="mt-8 space-y-4">
        {CLIENT_STATUSES.map((status) => {
          const group = clients.filter((c) => c.status === status.value);
          if (group.length === 0) return null;
          return (
            <div key={status.value}>
              <h2 className="mb-2 text-sm font-medium uppercase text-zinc-500">
                {status.label} ({group.length})
              </h2>
              <div className="space-y-2">
                {group.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-white">{c.businessName}</p>
                        <p className="text-sm text-zinc-500">
                          {c.packageName ?? "No package"} · {formatPhone(c.phone)}
                          {c.email ? ` · ${c.email}` : ""}
                        </p>
                        <p className="text-sm text-emerald-500">
                          {formatCurrency(c.setupFee)} setup + {formatCurrency(c.monthlyFee)}/mo
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          Payment: {paymentLabel(c.setupPaymentStatus)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <select
                          value={c.status}
                          onChange={(e) => updateStatus(c.id, e.target.value)}
                          className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-white"
                        >
                          {CLIENT_STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() =>
                            setExpanded(expanded === c.id ? null : c.id)
                          }
                          className="rounded-lg border border-emerald-800 px-3 py-1 text-xs text-emerald-400 hover:bg-emerald-950"
                        >
                          {expanded === c.id ? "Hide pay" : "Collect $"}
                        </button>
                      </div>
                    </div>
                    {expanded === c.id && (
                      <ClientPaymentPanel client={c} onUpdate={load} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {clients.length === 0 && (
        <p className="mt-8 text-center text-zinc-500">
          No clients yet. Convert an interested lead from Call Mode.
        </p>
      )}
    </div>
  );
}
