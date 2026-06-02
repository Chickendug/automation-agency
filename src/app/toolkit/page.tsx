"use client";

import Link from "next/link";
import { useState } from "react";
import {
  TOOL_SETUP_CHECKLIST,
  SERVICE_AGREEMENT,
  DAILY_SCHEDULE,
} from "@/lib/data/scripts-full";
import { fillTemplate } from "@/lib/script-engine";

export default function ToolkitPage() {
  const [agreementCtx, setAgreementCtx] = useState({
    agencyName: "Your Automation Agency",
    yourName: "Your Name",
    businessName: "Client Business",
    packageName: "Missed Call Recovery System",
    setup: "1500",
    monthly: "397",
  });

  const agreement = fillTemplate(SERVICE_AGREEMENT, {
    agencyName: agreementCtx.agencyName,
    yourName: agreementCtx.yourName,
    businessName: agreementCtx.businessName,
    packageName: agreementCtx.packageName,
    setupFee: `$${agreementCtx.setup}`,
    monthlyFee: `$${agreementCtx.monthly}`,
  });

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white">Toolkit</h1>
      <p className="mt-1 text-zinc-400">Accounts to open, contract template, and printable schedule.</p>

      <section className="mt-8">
        <h2 className="font-semibold text-white">Tool accounts (sign up today)</h2>
        <ul className="mt-4 space-y-3">
          {TOOL_SETUP_CHECKLIST.map((t) => (
            <li
              key={t.tool}
              className="flex items-start justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4"
            >
              <div>
                <p className="font-medium text-white">{t.tool}</p>
                <p className="text-sm text-zinc-500">{t.purpose}</p>
              </div>
              <a
                href={t.url}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-emerald-400 hover:bg-zinc-700"
              >
                Sign up →
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-semibold text-white">Service agreement (copy / print)</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            placeholder="Agency name"
            value={agreementCtx.agencyName}
            onChange={(e) => setAgreementCtx({ ...agreementCtx, agencyName: e.target.value })}
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
          />
          <input
            placeholder="Your name"
            value={agreementCtx.yourName}
            onChange={(e) => setAgreementCtx({ ...agreementCtx, yourName: e.target.value })}
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
          />
          <input
            placeholder="Client business"
            value={agreementCtx.businessName}
            onChange={(e) => setAgreementCtx({ ...agreementCtx, businessName: e.target.value })}
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
          />
          <input
            placeholder="Package"
            value={agreementCtx.packageName}
            onChange={(e) => setAgreementCtx({ ...agreementCtx, packageName: e.target.value })}
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
          />
        </div>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(agreement)}
          className="mt-3 text-sm text-emerald-400 hover:underline"
        >
          Copy agreement
        </button>
        <pre className="mt-4 max-h-96 overflow-y-auto whitespace-pre-wrap rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-400">
          {agreement}
        </pre>
      </section>

      <section className="mt-10 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        <h2 className="font-semibold text-white">Delivery guides (after client pays)</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Make.com + Twilio step-by-step. Complete kickoff form first.
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <Link href="/playbooks/appointment-reminders" className="text-emerald-400 hover:underline">
              Appointment Reminders playbook →
            </Link>
          </li>
          <li>
            <Link href="/guides/appointment-reminders" className="text-emerald-400 hover:underline">
              Appointment build guide (full) →
            </Link>
          </li>
          <li>
            <Link href="/guides/deposit-hold" className="text-emerald-400 hover:underline">
              Deposit hold add-on →
            </Link>
          </li>
          <li>
            <Link href="/guides/missed-call-recovery" className="text-emerald-400 hover:underline">
              Missed call build guide →
            </Link>
          </li>
          <li>
            <Link href="/playbooks/missed-call-recovery" className="text-emerald-400 hover:underline">
              Missed Call Recovery playbook →
            </Link>
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-semibold text-white">Print daily schedule</h2>
        <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">
          {DAILY_SCHEDULE.map((r) => `${r.time} — ${r.task}`).join("\n")}
        </pre>
      </section>
    </div>
  );
}
