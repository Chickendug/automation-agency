"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  COLD_CALL_SCRIPT,
  DISCOVERY_QUESTIONS,
  PROPOSAL_TEMPLATE,
  VOICEMAIL_SCRIPT,
} from "@/lib/data/scripts";
import {
  DEMO_SCRIPT,
  EMAIL_TEMPLATES,
  SMS_TEMPLATES,
  OBJECTION_HANDLERS,
  DAILY_SCHEDULE,
} from "@/lib/data/scripts-full";
import { fillTemplate } from "@/lib/script-engine";
import { getPackage } from "@/lib/data/packages";

function CopyBlock({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-semibold text-white">{title}</h2>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(content)}
          className="shrink-0 text-sm text-emerald-400 hover:underline"
        >
          Copy
        </button>
      </div>
      <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-300">
        {content}
      </pre>
    </div>
  );
}

export default function ScriptsPage() {
  const [ctx, setCtx] = useState({
    yourName: "Your Name",
    agencyName: "Your Automation Agency",
    yourPhone: "555-000-0000",
    yourEmail: "you@email.com",
    niche: "HVAC / plumbing",
    businessName: "their business",
    packageName: "Missed Call Recovery System",
    setupFee: "$1,500",
    monthlyFee: "$397/mo",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => {
        const pkg = getPackage(s.defaultPackageId);
        setCtx({
          yourName: s.yourName || "Your Name",
          agencyName: s.agencyName,
          yourPhone: s.yourPhone || "YOUR PHONE",
          yourEmail: s.yourEmail || "you@email.com",
          niche: s.defaultNiche,
          businessName: "their business",
          packageName: pkg?.name || "Missed Call Recovery System",
          setupFee: pkg ? `$${pkg.setupFee}` : "$1,500",
          monthlyFee: pkg ? `$${pkg.monthlyFee}/mo` : "$397/mo",
        });
      });
  }, []);

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Scripts & templates</h1>
          <p className="mt-1 text-zinc-400">Auto-filled from Settings. For live calls use Dial Script.</p>
        </div>
        <Link
          href="/dial"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Full-screen Dial Script →
        </Link>
      </div>

      <div className="mt-8 space-y-6">
        <CopyBlock title="Voicemail (leave after no answer)" content={fillTemplate(VOICEMAIL_SCRIPT, ctx)} />
        <CopyBlock title="Demo call (10 min)" content={fillTemplate(DEMO_SCRIPT, ctx)} />
        <CopyBlock title="Proposal email body" content={fillTemplate(PROPOSAL_TEMPLATE, ctx)} />

        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="font-semibold text-white">Discovery questions</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-zinc-300">
            {DISCOVERY_QUESTIONS.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
        </div>

        <div>
          <h2 className="mb-4 font-semibold text-white">SMS templates</h2>
          <div className="space-y-4">
            {SMS_TEMPLATES.map((s) => (
              <CopyBlock key={s.name} title={s.name} content={fillTemplate(s.body, ctx)} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-semibold text-white">Email templates</h2>
          <div className="space-y-4">
            {EMAIL_TEMPLATES.map((e) => (
              <CopyBlock
                key={e.name}
                title={`${e.name} — Subject: ${fillTemplate(e.subject, ctx)}`}
                content={fillTemplate(e.body, ctx)}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-semibold text-white">Objection handlers</h2>
          <div className="space-y-3">
            {OBJECTION_HANDLERS.map((o) => (
              <CopyBlock
                key={o.objection}
                title={o.objection}
                content={fillTemplate(o.response, ctx)}
              />
            ))}
          </div>
        </div>

        <CopyBlock title="Legacy cold call script" content={fillTemplate(COLD_CALL_SCRIPT, ctx)} />

        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="font-semibold text-white">Daily schedule</h2>
          <pre className="mt-4 text-sm text-zinc-400">
            {DAILY_SCHEDULE.map((r) => `${r.time} — ${r.task}`).join("\n")}
          </pre>
        </div>
      </div>
    </div>
  );
}
