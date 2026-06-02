import { PACKAGES } from "@/lib/data/packages";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function PackagesPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white">Service packages</h1>
      <p className="mt-1 text-zinc-400">
        Sell these as done-for-you automations. Same pitch on every cold call in your niche.
      </p>

      <div className="mt-8 space-y-6">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className="rounded-xl border border-zinc-800 bg-zinc-950 p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">{pkg.name}</h2>
                <p className="text-zinc-400">{pkg.tagline}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-emerald-400">
                  {formatCurrency(pkg.setupFee)} setup
                </p>
                <p className="text-zinc-400">{formatCurrency(pkg.monthlyFee)}/mo</p>
                <p className="text-xs text-zinc-600">~{pkg.deliveryDays} days to deliver</p>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-zinc-900 p-3">
              <p className="text-xs font-medium uppercase text-zinc-500">Cold call one-liner</p>
              <p className="mt-1 text-sm text-zinc-200">{pkg.pitchOneLiner}</p>
            </div>

            <ul className="mt-4 list-inside list-disc text-sm text-zinc-400">
              {pkg.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <p className="mt-3 text-xs text-zinc-600">Tools: {pkg.tools.join(", ")}</p>

            <Link
              href={`/playbooks/${pkg.playbookSlug}`}
              className="mt-4 inline-block text-sm text-emerald-400 hover:underline"
            >
              View delivery playbook →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
