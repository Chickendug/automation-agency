import Link from "next/link";
import { PLAYBOOKS } from "@/lib/data/playbooks";

export default function PlaybooksPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white">Delivery playbooks</h1>
      <p className="mt-1 text-zinc-400">
        Step-by-step guides to fulfill each package after a client says yes.
      </p>
      <p className="mt-2 text-sm text-zinc-500">
        Delivery kit index + kickoff form:{" "}
        <code className="rounded bg-zinc-900 px-1">launch-kit/DELIVERY-KIT.md</code>
      </p>

      <div className="mt-8 space-y-4">
        {PLAYBOOKS.map((pb) => (
          <Link
            key={pb.slug}
            href={`/playbooks/${pb.slug}`}
            className="block rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-zinc-600"
          >
            <h2 className="font-semibold text-white">{pb.title}</h2>
            <p className="mt-1 text-sm text-zinc-500">~{pb.estimatedHours} hours · {pb.steps.length} steps</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
