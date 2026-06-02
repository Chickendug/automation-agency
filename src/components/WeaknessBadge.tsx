import { WEAKNESS_OPTIONS } from "@/lib/weakness-analysis";

const COLORS: Record<string, string> = {
  missed_calls: "bg-orange-600",
  lead_followup: "bg-blue-600",
  reputation: "bg-purple-600",
  appointments: "bg-pink-600",
  online_presence: "bg-zinc-600",
};

export function WeaknessBadge({
  weakness,
  score,
}: {
  weakness: string | null;
  score?: number | null;
}) {
  if (!weakness) return <span className="text-xs text-zinc-600">—</span>;

  const label = WEAKNESS_OPTIONS.find((w) => w.id === weakness)?.label ?? weakness;
  const color = COLORS[weakness] ?? "bg-zinc-600";

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium text-white ${color}`}>
        {label.split(" / ")[0]}
      </span>
      {score != null && score > 0 && (
        <span className="text-xs font-mono text-amber-400">{score}</span>
      )}
    </span>
  );
}
