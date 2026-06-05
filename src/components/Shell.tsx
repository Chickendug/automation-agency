import { Nav } from "./Nav";
import { MobileHeader } from "./MobileHeader";
import { MobileNav } from "./MobileNav";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-zinc-900 text-zinc-100 lg:flex-row">
      <Nav />
      <div className="flex min-h-0 flex-1 flex-col">
        <MobileHeader />
        <main className="flex-1 overflow-auto p-4 pb-24 lg:p-8 lg:pb-8">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
