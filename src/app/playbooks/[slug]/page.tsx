import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlaybook } from "@/lib/data/playbooks";
import { getPackage } from "@/lib/data/packages";

type Props = { params: Promise<{ slug: string }> };

export default async function PlaybookDetailPage({ params }: Props) {
  const { slug } = await params;
  const playbook = getPlaybook(slug);
  if (!playbook) notFound();

  const pkg = getPackage(playbook.packageId);

  return (
    <div className="max-w-3xl">
      <Link href="/playbooks" className="text-sm text-zinc-500 hover:text-white">
        ← Playbooks
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-white">{playbook.title}</h1>
      {pkg && (
        <p className="mt-1 text-zinc-400">
          Package: {pkg.name} · ~{playbook.estimatedHours} hours
        </p>
      )}

      <div className="mt-8 space-y-6">
        <section>
          <h2 className="font-semibold text-white">Steps</h2>
          <ol className="mt-4 space-y-4">
            {playbook.steps.map((step, i) => (
              <li key={step.title} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-sm text-emerald-500">Step {i + 1}</p>
                <p className="font-medium text-white">{step.title}</p>
                <p className="mt-2 text-sm text-zinc-400">{step.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="font-semibold text-white">Launch checklist</h2>
          <ul className="mt-4 list-inside list-disc text-sm text-zinc-400">
            {playbook.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
