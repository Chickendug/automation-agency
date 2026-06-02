"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MASTER_DIAL_SCRIPT, OBJECTION_HANDLERS } from "@/lib/data/scripts-full";
import { fillTemplate } from "@/lib/script-engine";
import { getPackage } from "@/lib/data/packages";

type Settings = {
  yourName: string | null;
  agencyName: string;
  yourPhone: string | null;
  yourEmail: string | null;
  defaultNiche: string;
  defaultCity: string | null;
  defaultPackageId: string;
};

export default function DialScriptPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [showObjections, setShowObjections] = useState(false);
  const [fontSize, setFontSize] = useState<"lg" | "xl" | "2xl">("xl");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings);
  }, []);

  const pkg = settings ? getPackage(settings.defaultPackageId) : null;

  const ctx = {
    yourName: settings?.yourName || "Your Name",
    agencyName: settings?.agencyName || "Your Agency",
    yourPhone: settings?.yourPhone || "YOUR PHONE",
    yourEmail: settings?.yourEmail || "you@email.com",
    niche: settings?.defaultNiche || "local businesses",
    businessName: businessName || "their business",
    packageName: pkg?.name || "Missed Call Recovery System",
    setupFee: pkg ? `$${pkg.setupFee}` : "$1,500",
    monthlyFee: pkg ? `$${pkg.monthlyFee}/mo` : "$397/mo",
  };

  const sizeClass =
    fontSize === "2xl" ? "text-2xl leading-relaxed" : fontSize === "xl" ? "text-xl leading-relaxed" : "text-lg leading-relaxed";

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black text-white">
      <header className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-zinc-500 hover:text-white">
            ← Exit
          </Link>
          <span className="text-sm font-medium text-emerald-400">DIAL SCRIPT — read aloud</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            placeholder="Business name on this call"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-48 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm sm:w-64"
          />
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as "lg" | "xl" | "2xl")}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm"
          >
            <option value="lg">A</option>
            <option value="xl">A+</option>
            <option value="2xl">A++</option>
          </select>
          <button
            type="button"
            onClick={() => setShowObjections(!showObjections)}
            className="rounded-lg border border-zinc-600 px-3 py-1.5 text-sm hover:bg-zinc-900"
          >
            {showObjections ? "Script" : "Objections"}
          </button>
          <Link
            href="/leads/call"
            className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-medium hover:bg-emerald-500"
          >
            Call Mode →
          </Link>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        {!showObjections ? (
          <div className="mx-auto max-w-3xl space-y-10">
            <p className="text-center text-sm text-zinc-500">
              Calling as <strong className="text-white">{ctx.yourName}</strong> ·{" "}
              {ctx.niche}
              {settings?.defaultCity ? ` · ${settings.defaultCity}` : ""}
            </p>
            {MASTER_DIAL_SCRIPT.sections.map((section) => (
              <section key={section.id}>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-emerald-500">
                  {section.label}
                </h2>
                <p className={`whitespace-pre-wrap font-medium text-zinc-100 ${sizeClass}`}>
                  {fillTemplate(section.text, ctx)}
                </p>
              </section>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-lg font-bold text-amber-400">Objection handlers</h2>
            {OBJECTION_HANDLERS.map((o) => (
              <div key={o.objection} className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="font-semibold text-amber-300">"{o.objection}"</p>
                <p className={`mt-3 text-zinc-200 ${sizeClass}`}>{fillTemplate(o.response, ctx)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
