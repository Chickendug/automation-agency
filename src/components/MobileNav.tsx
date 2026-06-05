"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/leads/call", label: "Call", icon: "📞" },
  { href: "/leads/find", label: "Find", icon: "🔍" },
  { href: "/dial", label: "Script", icon: "📋" },
  { href: "/leads", label: "Leads", icon: "👥" },
  { href: "/start", label: "Home", icon: "★" },
];

export function MobileNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/dial")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <ul className="flex justify-around">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={cn(
                  "flex flex-col items-center px-3 py-2 text-xs",
                  active ? "text-emerald-400" : "text-zinc-500"
                )}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
