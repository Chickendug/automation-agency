import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  const headers = [
    "businessName",
    "phone",
    "email",
    "city",
    "niche",
    "callStatus",
    "painSignals",
    "website",
    "notes",
  ];

  const escape = (v: string | null | undefined) => {
    const s = v ?? "";
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const rows = leads.map((l) =>
    headers.map((h) => escape(l[h as keyof typeof l] as string | null)).join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="leads-export-${Date.now()}.csv"`,
    },
  });
}
