import Link from "next/link";
import { GUIDES, guideHref } from "@/lib/data/guides";

export default function GuidesIndexPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white">Delivery build guides</h1>
      <p className="mt-1 text-zinc-400">Use after client pays setup fee.</p>
      <ul className="mt-8 space-y-3">
        {Object.entries(GUIDES).map(([slug, guide]) => (
          <li key={slug}>
            <Link
              href={guideHref(slug as keyof typeof GUIDES)}
              className="block rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-zinc-600"
            >
              <span className="font-semibold text-white">{guide.title}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/playbooks" className="mt-6 inline-block text-sm text-emerald-400 hover:underline">
        ← Playbooks
      </Link>
    </div>
  );
}
