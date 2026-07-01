// Shared constants + helpers for the Consultation Booking section (see docs/adr/0005).
// Everything here is mock: no request is ever sent or stored.

// The Agent shown on the general-enquiry path when no Property is selected.
// A real, documented, overridable choice - the highest-profile agent - rather
// than a neutral brand placeholder. See the "Lead Agent" term in CONTEXT.md.
export const LEAD_AGENT_SLUG = "siriporn-thanawan";

// Fixed consultation slots. Labels are the source of truth - there is no real
// scheduling, so the strings are what a visitor picks and what success echoes back.
export const TIME_SLOTS = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"] as const;

export const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

// How long the inline confirmation lingers before the panel resets to a fresh
// calendar. Mock flow, so the reset is purely a UX convenience.
export const CONFIRMATION_RESET_MS = 10_000;

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Whole-day comparison that ignores the time component.
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function formatBookingDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatMonthTitle(year: number, month: number): string {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
    new Date(year, month, 1)
  );
}
