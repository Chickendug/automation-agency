/** Monthly billing helpers */

export function clampBillingDay(day: number): number {
  return Math.min(Math.max(day, 1), 28);
}

export function billingDayFromDate(d: Date): number {
  return clampBillingDay(d.getDate());
}

export function formatBillingPeriod(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/** Next due date: same day-of-month, at least 1 month after `from` */
export function computeNextMonthlyDue(from: Date, billingDay: number): Date {
  const day = clampBillingDay(billingDay);
  const next = new Date(from);
  next.setMonth(next.getMonth() + 1);
  next.setDate(day);
  next.setHours(12, 0, 0, 0);
  return next;
}

export function isDue(nextDue: Date | null | undefined): boolean {
  if (!nextDue) return false;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return nextDue <= today;
}

export function daysUntilDue(nextDue: Date | null | undefined): number | null {
  if (!nextDue) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(nextDue);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - today.getTime()) / 86400000);
}

export function dueLabel(nextDue: Date | null | undefined): string {
  const days = daysUntilDue(nextDue);
  if (days === null) return "—";
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Due today";
  if (days <= 7) return `Due in ${days}d`;
  return `Due ${nextDue?.toLocaleDateString()}`;
}
