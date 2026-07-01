"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PropertyImage } from "@/components/ui/PropertyImage";
import type { Agent } from "@/lib/types";
import { BookingCalendar } from "./BookingCalendar";
import { CONFIRMATION_RESET_MS, formatBookingDate, isValidEmail, TIME_SLOTS } from "./booking";
import styles from "./BookingPanel.module.css";

type Confirmation = {
  agentName: string;
  dateLabel: string;
  name: string;
};

// Right panel: calendar first, then a details step (agent chip, time slots,
// name/email) once a date is chosen, then an inline success state. No popup -
// confirming swaps the panel body in place. Nothing is sent. See docs/adr/0005.
export function BookingPanel({
  agent,
  selectionKey,
}: {
  agent: Agent;
  // Changes whenever the chosen property (or general-enquiry) changes, so a
  // completed booking resets back to the form for the newly selected agent.
  selectionKey: string;
}) {
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  // Re-selecting a property after confirming returns to the form (so the user
  // can book with the new agent) while keeping their date/details typed in.
  // Adjust during render instead of an effect to avoid a cascading re-render.
  const [lastSelectionKey, setLastSelectionKey] = useState(selectionKey);
  if (selectionKey !== lastSelectionKey) {
    setLastSelectionKey(selectionKey);
    setConfirmation(null);
  }

  // After the confirmation shows, reset to a fresh calendar so the panel doesn't
  // stay stuck on a stale success. A timer is a real external system, so this is
  // an effect (the cleanup clears it if the user navigates away first).
  useEffect(() => {
    if (!confirmation) return;
    const timer = setTimeout(() => {
      setDate(null);
      setSlot(null);
      setName("");
      setEmail("");
      setConfirmation(null);
    }, CONFIRMATION_RESET_MS);
    return () => clearTimeout(timer);
  }, [confirmation]);

  const canConfirm = date != null && slot != null && name.trim() !== "" && isValidEmail(email);

  function handleConfirm() {
    if (!canConfirm || date == null || slot == null) return;
    setConfirmation({
      agentName: agent.name,
      dateLabel: formatBookingDate(date),
      name: name.trim(),
    });
  }

  return (
    <div className={styles.panel}>
      {confirmation ? (
        <motion.div
          key="success"
          className={styles.success}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
            <span className={styles.successIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className={styles.successTitle}>Consultation requested</p>
            <p className={styles.successText}>
              Thanks, {confirmation.name}.
              <br />
              {confirmation.agentName} will be in touch soon regarding your consultation on{" "}
              <strong>{confirmation.dateLabel}</strong>.
            </p>
        </motion.div>
      ) : date == null ? (
        <motion.div
          key="calendar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <BookingCalendar
            selectedDate={date}
            onSelectDate={(next) => {
              setDate(next);
              setSlot(null);
            }}
          />
        </motion.div>
      ) : (
        // Picking a date transforms the calendar into this step - name/email on
        // the left, time slots on the right - with a back control to the calendar.
        <motion.div
          key="details"
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className={styles.chip}>
            <span className={styles.chipAvatar}>
              <PropertyImage src={agent.avatar} alt={agent.name} className={styles.chipAvatarImg} />
            </span>
            <span className={styles.chipText}>
              <span className={styles.chipLabel}>Booking with</span>
              <span className={styles.chipName}>{agent.name}</span>
              <span className={styles.chipTitle}>{agent.title}</span>
            </span>
          </div>

          <button
            type="button"
            className={styles.back}
            onClick={() => setDate(null)}
            aria-label="Change date"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{formatBookingDate(date)}</span>
          </button>

          <div className={styles.detailsGrid}>
            <div className={styles.info}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Name</span>
                <input
                  className={styles.input}
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Email</span>
                <input
                  className={styles.input}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>
            </div>

            <div className={styles.times} role="group" aria-label="Choose a time">
              <span className={styles.timesLabel}>Choose a time</span>
              {TIME_SLOTS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`${styles.slot} ${slot === option ? styles.slotSelected : ""}`}
                  aria-pressed={slot === option}
                  onClick={() => setSlot(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={styles.confirm}
            onClick={handleConfirm}
            disabled={!canConfirm}
          >
            Request consultation
          </button>
        </motion.div>
      )}
    </div>
  );
}
