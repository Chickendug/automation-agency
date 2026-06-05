"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileHeader() {
  const pathname = usePathname();
  if (pathname.startsWith("/dial")) return null;

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/95 px-4 py-3 backdrop-blur lg:hidden">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-500">Agency OS</p>
        <p className="text-sm font-semibold text-white">Automation Agency</p>
      </div>
      <Link
        href="/settings"
        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900"
      >
        Settings
      </Link>
    </header>
  );
}
