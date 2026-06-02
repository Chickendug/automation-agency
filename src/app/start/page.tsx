"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DAILY_SCHEDULE, FIRST_WEEK_PLAN, TOOL_SETUP_CHECKLIST } from "@/lib/data/scripts-full";

const TODAY_CHECKLIST = [
  { id: "settings", label: "Fill Settings (name, phone, email, niche, city)", href: "/settings" },
  { id: "stripe", label: "Set up Stripe + paste payment links (Payments page)", href: "/payments" },
  { id: "tools", label: "Sign up Twilio + Make.com (Toolkit page)", href: "/toolkit" },
  { id: "dial", label: "Open Dial Script — practice once out loud", href: "/dial" },
  { id: "leads", label: "Find 50+ leads OR use 10 sample leads already loaded", href: "/leads/find" },
  { id: "call", label: "Call Mode — 80+ dials today", href: "/leads/call" },
  { id: "demo", label: "Book 1 demo (Scripts → demo script)", href: "/scripts" },
];

export default function StartPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("agency-os-checklist");
    if (saved) setChecked(JSON.parse(saved));
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => setOnboardingDone(s.onboardingDone));
  }, []);

  function toggle(id: string) {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    localStorage.setItem("agency-os-checklist", JSON.stringify(next));
  }

  async function markReady() {
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onboardingDone: true }),
    });
    setOnboardingDone(true);
  }

  const doneCount = TODAY_CHECKLIST.filter((c) => checked[c.id]).length;

  return (
    <div className="max-w-3xl">
      <div className="rounded-2xl border border-emerald-800/50 bg-emerald-950/20 p-6">
        <h1 className="text-3xl font-bold text-white">Good morning — start here</h1>
        <p className="mt-2 text-zinc-300">
          Everything is built. Check off each box, then go straight to Call Mode.
        </p>
        <p className="mt-4 text-sm text-emerald-400">
          Progress: {doneCount}/{TODAY_CHECKLIST.length}
        </p>
      </div>

      <ul className="mt-8 space-y-3">
        {TODAY_CHECKLIST.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4"
          >
            <input
              type="checkbox"
              checked={!!checked[item.id]}
              onChange={() => toggle(item.id)}
              className="mt-1 h-5 w-5 rounded border-zinc-600"
            />
            <div className="flex-1">
              <p className={checked[item.id] ? "text-zinc-500 line-through" : "text-white"}>
                {item.label}
              </p>
              <Link href={item.href} className="text-sm text-emerald-400 hover:underline">
                Open →
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {doneCount >= 4 && !onboardingDone && (
        <button
          type="button"
          onClick={markReady}
          className="mt-6 w-full rounded-xl bg-emerald-600 py-4 text-lg font-semibold text-white hover:bg-emerald-500"
        >
          I'm ready to dial today →
        </button>
      )}

      {onboardingDone && (
        <Link
          href="/dial"
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-emerald-600 py-4 text-lg font-semibold text-white hover:bg-emerald-500"
        >
          Open full-screen Dial Script →
        </Link>
      )}

      <section className="mt-12">
        <h2 className="font-semibold text-white">Today's schedule</h2>
        <div className="mt-4 space-y-2">
          {DAILY_SCHEDULE.map((row) => (
            <div
              key={row.time}
              className="flex gap-4 rounded-lg border border-zinc-800/50 bg-zinc-950/50 px-4 py-3 text-sm"
            >
              <span className="w-20 shrink-0 font-mono text-emerald-500">{row.time}</span>
              <span className="text-zinc-300">{row.task}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-semibold text-white">First week plan</h2>
        <div className="mt-4 space-y-4">
          {FIRST_WEEK_PLAN.map((day) => (
            <div key={day.day} className="rounded-xl border border-zinc-800 p-4">
              <p className="font-medium text-emerald-400">
                {day.day} — {day.focus}
              </p>
              <ul className="mt-2 list-inside list-disc text-sm text-zinc-400">
                {day.tasks.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-8 text-sm text-zinc-600">
        Offline copy: read <code className="text-zinc-400">START-HERE.md</code> and{" "}
        <code className="text-zinc-400">launch-kit/</code> in the project folder.
      </p>
    </div>
  );
}
