"use client";
import { useState } from "react";
import { formatMonthTitle, isSameDay, startOfToday, WEEKDAY_LABELS } from "./booking";
import styles from "./BookingCalendar.module.css";

// Month calendar for the right panel. Past days are disabled and the month can't
// be navigated earlier than the current one - a consultation is always booked
// today or later. Purely a date picker; time slots live in BookingPanel.
export function BookingCalendar({
  selectedDate,
  onSelectDate,
}: {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}) {
  const today = startOfToday();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const firstWeekday = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const isCurrentMonth = view.year === today.getFullYear() && view.month === today.getMonth();

  function shiftMonth(delta: number) {
    setView((prev) => {
      const next = new Date(prev.year, prev.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(view.year, view.month, day));

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.nav}
          onClick={() => shiftMonth(-1)}
          disabled={isCurrentMonth}
          aria-label="Previous month"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className={styles.title}>{formatMonthTitle(view.year, view.month)}</span>
        <button
          type="button"
          className={styles.nav}
          onClick={() => shiftMonth(1)}
          aria-label="Next month"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className={styles.weekdays}>
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className={styles.weekday}>
            {label}
          </span>
        ))}
      </div>

      <div className={styles.days}>
        {cells.map((date, i) => {
          if (!date) return <span key={`blank-${i}`} className={styles.blank} />;
          const disabled = date < today;
          const selected = selectedDate != null && isSameDay(date, selectedDate);
          return (
            <button
              key={date.toISOString()}
              type="button"
              className={`${styles.day} ${selected ? styles.daySelected : ""}`}
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => onSelectDate(date)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
