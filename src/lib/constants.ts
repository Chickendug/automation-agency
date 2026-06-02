export const CALL_STATUSES = [
  { value: "not_called", label: "Not called", color: "bg-zinc-500" },
  { value: "no_answer", label: "No answer", color: "bg-amber-500" },
  { value: "voicemail", label: "Voicemail", color: "bg-orange-500" },
  { value: "callback", label: "Callback scheduled", color: "bg-blue-500" },
  { value: "interested", label: "Interested", color: "bg-emerald-500" },
  { value: "not_interested", label: "Not interested", color: "bg-red-500" },
  { value: "wrong_number", label: "Wrong number", color: "bg-zinc-600" },
] as const;

export const CLIENT_STATUSES = [
  { value: "prospect", label: "Prospect" },
  { value: "demo_scheduled", label: "Demo scheduled" },
  { value: "proposal_sent", label: "Proposal sent" },
  { value: "awaiting_payment", label: "Awaiting payment" },
  { value: "active", label: "Active client" },
  { value: "paused", label: "Paused" },
  { value: "churned", label: "Churned" },
] as const;

export const MONTHLY_PAYMENT_STATUSES = [
  { value: "n/a", label: "N/A (not active)", color: "bg-zinc-600" },
  { value: "scheduled", label: "Scheduled", color: "bg-zinc-500" },
  { value: "due", label: "Due now", color: "bg-amber-500" },
  { value: "sent", label: "Invoice sent", color: "bg-blue-500" },
  { value: "active", label: "Paid / current", color: "bg-emerald-600" },
  { value: "overdue", label: "Overdue", color: "bg-red-600" },
  { value: "paused", label: "Paused", color: "bg-zinc-500" },
] as const;

export const SETUP_PAYMENT_STATUSES = [
  { value: "pending", label: "Pending", color: "bg-zinc-500" },
  { value: "sent", label: "Link sent", color: "bg-amber-500" },
  { value: "paid", label: "Paid ✓", color: "bg-emerald-600" },
  { value: "partial", label: "Deposit paid", color: "bg-blue-500" },
  { value: "waived", label: "Waived", color: "bg-zinc-600" },
] as const;

export const NICHES = [
  "Dental offices",
  "Med spas",
  "HVAC / plumbing",
  "Roofing / contractors",
  "Salons / barbers",
  "Gyms / fitness",
  "Law firms",
  "Real estate agents",
  "Property management",
  "Auto repair",
  "Restaurants",
  "General local services",
] as const;

export type CallStatus = (typeof CALL_STATUSES)[number]["value"];
export type ClientStatus = (typeof CLIENT_STATUSES)[number]["value"];
export type SetupPaymentStatus = (typeof SETUP_PAYMENT_STATUSES)[number]["value"];
