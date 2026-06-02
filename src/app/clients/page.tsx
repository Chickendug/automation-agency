import { Suspense } from "react";
import ClientsContent from "./ClientsContent";

export default function ClientsPage() {
  return (
    <Suspense fallback={<p className="text-zinc-500">Loading clients…</p>}>
      <ClientsContent />
    </Suspense>
  );
}
