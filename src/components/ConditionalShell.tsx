"use client";

import { usePathname } from "next/navigation";
import { Shell } from "./Shell";

const FULLSCREEN_ROUTES = ["/dial"];

export function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (FULLSCREEN_ROUTES.some((r) => pathname.startsWith(r))) {
    return <>{children}</>;
  }
  return <Shell>{children}</Shell>;
}
