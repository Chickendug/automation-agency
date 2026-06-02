import { CALL_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function CallStatusBadge({ status }: { status: string }) {
  const cfg = CALL_STATUSES.find((s) => s.value === status) ?? {
    label: status,
    color: "bg-zinc-500",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium text-white",
        cfg.color
      )}
    >
      {cfg.label}
    </span>
  );
}
