import Link from "next/link";
import { notFound } from "next/navigation";
import { readFile } from "fs/promises";
import path from "path";
import { GUIDES, getGuide } from "@/lib/data/guides";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(GUIDES).map((slug) => ({ slug }));
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const filePath = path.join(process.cwd(), "public", "docs", guide.file);
  let content: string;
  try {
    content = await readFile(filePath, "utf8");
  } catch {
    notFound();
  }

  return (
    <div className="max-w-3xl pb-12">
      <Link href="/playbooks" className="text-sm text-zinc-500 hover:text-white">
        ← Playbooks
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-white">{guide.title}</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Use after setup fee is paid ·{" "}
        <Link href="/toolkit" className="text-emerald-500 hover:underline">
          Toolkit
        </Link>
      </p>
      <article className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-300">
          {content}
        </pre>
      </article>
    </div>
  );
}
