import { Nav } from "./Nav";
import { MobileNav } from "./MobileNav";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full bg-zinc-900 text-zinc-100">
      <Nav />
      <main className="flex-1 overflow-auto p-4 pb-24 md:p-8 md:pb-8">{children}</main>
      <MobileNav />
    </div>
  );
}
