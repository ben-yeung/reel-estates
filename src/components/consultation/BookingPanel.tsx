"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { PropertyImage } from "@/components/ui/PropertyImage";
import type { Agent } from "@/lib/types";
import { BookingCalendar } from "./BookingCalendar";
import { formatBookingDate, isValidEmail, TIME_SLOTS } from "./booking";
import styles from "./BookingPanel.module.css";

type Confirmation = {
  agentName: string;
  propertyName: string | null;
  dateLabel: string;
  slot: string;
  name: string;
};

// Right panel: agent chip (auto-filled from the selection), calendar, time
// slots, name/email, and an inline success state. No popup - confirming swaps
// the panel body in place. Nothing is actually sent. See docs/adr/0005.
export function BookingPanel({
  agent,
  propertyName,
  selectionKey,
}: {
  agent: Agent;
  propertyName: string | null;
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

  const canConfirm = date != null && slot != null && name.trim() !== "" && isValidEmail(email);

  function handleConfirm() {
    if (!canConfirm || date == null || slot == null) return;
    setConfirmation({
      agentName: agent.name,
      propertyName,
      dateLabel: formatBookingDate(date),
      slot,
      name: name.trim(),
    });
  }

  function handleReset() {
    setDate(null);
    setSlot(null);
    setName("");
    setEmail("");
    setConfirmation(null);
  }

  return (
    <div className={styles.panel}>
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
              Thanks, {confirmation.name}. {confirmation.agentName} will confirm your{" "}
              {confirmation.propertyName ? (
                <>
                  consultation for <strong>{confirmation.propertyName}</strong>
                </>
              ) : (
                <>general consultation</>
              )}{" "}
              on <strong>{confirmation.dateLabel}</strong> at <strong>{confirmation.slot}</strong>.
            </p>
            <button type="button" className={styles.bookAnother} onClick={handleReset}>
              Book another
            </button>
        </motion.div>
      ) : (
        <div>
          <BookingCalendar
              selectedDate={date}
              onSelectDate={(next) => {
                setDate(next);
                setSlot(null);
              }}
            />

            {date && (
              <div className={styles.slots} role="group" aria-label="Choose a time">
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
            )}

            {slot && (
              <div className={styles.fields}>
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
                <button
                  type="button"
                  className={styles.confirm}
                  onClick={handleConfirm}
                  disabled={!canConfirm}
                >
                  Request consultation
                </button>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
