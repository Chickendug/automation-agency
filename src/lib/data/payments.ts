import { PACKAGES } from "./packages";

export const PAYMENT_METHODS = [
  {
    id: "stripe",
    name: "Stripe (recommended)",
    why: "Cards, Apple Pay, automatic receipts, subscriptions, professional",
    fees: "~2.9% + 30¢ per charge",
    bestFor: "Setup fee + monthly recurring",
  },
  {
    id: "stripe_link",
    name: "Stripe Payment Links (no code)",
    why: "Create links in Stripe Dashboard in 5 min — paste into Agency OS",
    fees: "Same as Stripe",
    bestFor: "Starting today before API keys",
  },
  {
    id: "paypal",
    name: "PayPal / PayPal.me",
    why: "Some owners trust PayPal; easy for one-time setup fee",
    fees: "~3.49% + fixed",
    bestFor: "Backup for setup only",
  },
  {
    id: "venmo",
    name: "Venmo / Zelle",
    why: "Fast for local businesses; zero fees",
    fees: "Usually free (P2P)",
    bestFor: "Small setup deposits — get less professional over time",
  },
  {
    id: "bank",
    name: "ACH / bank transfer",
    why: "Large setup fees ($2k+) — no card fees",
    fees: "Often free or flat",
    bestFor: "B2B clients who insist on invoice + NET-7",
  },
] as const;

export const PAYMENT_FLOW_STEPS = [
  {
    step: 1,
    title: "Verbal yes on demo",
    action: "Do NOT start building. Say: \"I'll send a secure payment link for the setup fee — once that's in, we kick off within 48 hours.\"",
  },
  {
    step: 2,
    title: "Send setup payment (same day)",
    action: "Clients page → Collect Payment → copy email/SMS. Use Stripe link for exact package amount.",
  },
  {
    step: 3,
    title: "Mark paid → start work",
    action: "When paid: set Setup Payment = Paid, status = active, open Playbook.",
  },
  {
    step: 4,
    title: "Go live + start monthly",
    action: "After delivery: send monthly Stripe subscription link OR invoice on the 1st.",
  },
  {
    step: 5,
    title: "Every month",
    action: "Stripe auto-charges if subscription. If manual: send link + mark in Payments log.",
  },
];

export const STRIPE_SETUP_STEPS = [
  "Create account at stripe.com (use your real business name)",
  "Settings → Business → add your address (required for payouts)",
  "Settings → Bank accounts → add where money deposits",
  "Products → Add product per package (e.g. \"Missed Call Setup — $1,500\")",
  "For each product → Add Price → One time → $1500",
  "Product → Payment link → Create link → copy URL into Agency OS Settings",
  "For monthly: create second Price → Recurring → $397/month → Payment link",
  "Optional: Developers → API keys → add STRIPE_SECRET_KEY to .env for one-click links in app",
  "Optional: Developers → Webhooks → endpoint /api/payments/webhook for auto mark-paid",
];

export const PACKAGE_STRIPE_PRODUCTS = PACKAGES.map((p) => ({
  packageId: p.id,
  setupProductName: `${p.name} — Setup`,
  setupAmount: p.setupFee,
  monthlyProductName: `${p.name} — Monthly`,
  monthlyAmount: p.monthlyFee,
}));

export function paymentRequestEmail(ctx: {
  contactName: string;
  businessName: string;
  yourName: string;
  agencyName: string;
  packageName: string;
  setupFee: string;
  monthlyFee: string;
  paymentLink: string;
  yourPhone: string;
}) {
  return `Hi ${ctx.contactName || "there"},

Great speaking with you about ${ctx.businessName}.

As discussed, here's the secure link to pay the **one-time setup** for ${ctx.packageName}:

${ctx.paymentLink}

Amount: ${ctx.setupFee} (setup — work begins within 48 hours of payment)

After go-live, monthly support is ${ctx.monthlyFee} (cancel anytime with 30 days notice).

Questions? Reply here or call ${ctx.yourPhone}.

Thanks,
${ctx.yourName}
${ctx.agencyName}`;
}

export function paymentRequestSms(ctx: {
  businessName: string;
  yourName: string;
  setupFee: string;
  paymentLink: string;
}) {
  return `Hi ${ctx.businessName} — ${ctx.yourName} here. Setup fee (${ctx.setupFee}) for your automation system: ${ctx.paymentLink} — work starts within 48hrs of payment. Reply if questions!`;
}

export function monthlyInvoiceEmail(ctx: {
  contactName: string;
  businessName: string;
  yourName: string;
  agencyName: string;
  packageName: string;
  monthlyFee: string;
  billingPeriod: string;
  paymentLink: string;
  zellePhone?: string;
  venmoHandle?: string;
  yourPhone: string;
}) {
  const altPay = [
    ctx.zellePhone ? `Zelle: ${ctx.zellePhone}` : "",
    ctx.venmoHandle ? `Venmo: ${ctx.venmoHandle}` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return `Hi ${ctx.contactName || "there"},

Your monthly invoice for ${ctx.packageName} at ${ctx.businessName}:

Period: ${ctx.billingPeriod}
Amount due: ${ctx.monthlyFee}

Pay here: ${ctx.paymentLink}
${altPay ? `\nOr: ${altPay}\n` : ""}
Please pay by your due date to keep automations running without interruption.

Questions? ${ctx.yourPhone}

Thanks,
${ctx.yourName}
${ctx.agencyName}`;
}

export function monthlyInvoiceSms(ctx: {
  businessName: string;
  yourName: string;
  monthlyFee: string;
  billingPeriod: string;
  paymentLink: string;
  zellePhone?: string;
}) {
  if (ctx.zellePhone) {
    return `${ctx.businessName} — ${ctx.yourName}: Monthly ${ctx.monthlyFee} (${ctx.billingPeriod}) due. Zelle ${ctx.zellePhone} memo "${ctx.businessName}". Thanks!`;
  }
  return `${ctx.businessName} — ${ctx.yourName}: Monthly ${ctx.monthlyFee} (${ctx.billingPeriod}) due: ${ctx.paymentLink}`;
}

export function paymentReminderEmail(ctx: {
  contactName: string;
  businessName: string;
  yourName: string;
  setupFee: string;
  paymentLink: string;
}) {
  return `Hi ${ctx.contactName || "there"},

Quick follow-up on the setup payment (${ctx.setupFee}) for ${ctx.businessName}:

${ctx.paymentLink}

Happy to hop on a 5-min call if anything's unclear.

${ctx.yourName}`;
}

export const INVOICE_TEMPLATE = `INVOICE

{{invoiceNumber}}
Date: {{date}}

Bill To:
{{businessName}}
{{contactName}}
{{email}}

From:
{{agencyName}}
{{yourName}}
{{yourEmail}}
{{yourPhone}}

────────────────────────────────────────
Description                              Amount
────────────────────────────────────────
{{packageName}} — One-time setup         {{setupFee}}
{{packageName}} — Monthly (starting {{startDate}})  {{monthlyFee}}/mo
────────────────────────────────────────
TOTAL DUE NOW (setup):                   {{setupFee}}

Payment methods:
• Pay online: {{paymentLink}}
{{#if paypal}}• PayPal: {{paypal}}{{/if}}
{{#if venmo}}• Venmo: {{venmo}}{{/if}}
{{#if zelle}}• Zelle: {{zelle}}{{/if}}
{{#if bank}}• Bank transfer: {{bank}}{{/if}}

Terms: Setup due before work begins. Monthly billed on go-live date.
Thank you for your business!`;
