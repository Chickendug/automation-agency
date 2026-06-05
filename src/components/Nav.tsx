"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/start", label: "★ Start Here" },
  { href: "/dial", label: "Dial Script" },
  { href: "/", label: "Dashboard" },
  { href: "/leads/find", label: "Find Leads" },
  { href: "/leads", label: "Leads" },
  { href: "/leads/call", label: "Call Mode" },
  { href: "/clients", label: "Clients" },
  { href: "/payments", label: "Payments" },
  { href: "/billing", label: "Monthly Billing" },
  { href: "/packages", label: "Packages" },
  { href: "/scripts", label: "Scripts" },
  { href: "/toolkit", label: "Toolkit" },
  { href: "/playbooks", label: "Playbooks" },
  { href: "/settings", label: "Settings" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="hidden w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 p-4 lg:flex">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-emerald-500">
          Agency OS
        </p>
        <h1 className="text-lg font-semibold text-white">Automation Agency</h1>
      </div>
      <ul className="flex flex-1 flex-col gap-1">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-emerald-600/20 text-emerald-400"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-xs text-zinc-600">
        Dial → Demo → Deliver → $10k/mo
      </p>
    </nav>
  );
}
