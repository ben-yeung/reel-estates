"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { PropertySelector } from "@/components/consultation/PropertySelector";
import { BookingPanel } from "@/components/consultation/BookingPanel";
import { LEAD_AGENT_SLUG } from "@/components/consultation/booking";
import { getAgentBySlug, getPropertyBySlug, properties } from "@/lib/data-utils";
import styles from "./ConsultationBooking.module.css";

function ConsultationBookingInner() {
  const searchParams = useSearchParams();
  // Consultation Deep-Link: `?book=[slug]` pre-selects a property (distinct from
  // the modal's `?property=`, which would re-open the modal). See docs/adr/0006.
  const bookParam = searchParams.get("book");

  const [selectedSlug, setSelectedSlug] = useState<string | null>(() =>
    bookParam && getPropertyBySlug(bookParam) ? bookParam : null
  );

  // Sync to a deep link that arrives while the section is already mounted (e.g. a
  // future in-page "Book a consultation" CTA that sets ?book= without a remount).
  // Adjusting state during render - rather than in an effect - avoids a cascading
  // re-render. See React's "you might not need an effect".
  const [lastBookParam, setLastBookParam] = useState(bookParam);
  if (bookParam !== lastBookParam) {
    setLastBookParam(bookParam);
    if (bookParam && getPropertyBySlug(bookParam)) {
      setSelectedSlug(bookParam);
    }
  }

  const property = selectedSlug ? getPropertyBySlug(selectedSlug) ?? null : null;
  // Agent auto-fills from the property; the general-enquiry path falls back to
  // the Lead Agent so every path shows a real person. See docs/adr/0005.
  const agent = getAgentBySlug(property?.agentSlug ?? LEAD_AGENT_SLUG);

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <p className={styles.eyebrow}>Get In Touch</p>
          <h2 className={styles.title}>Book a Consultation</h2>
          <p className={styles.subtitle}>
            Pick a property to speak with its agent, or send a general enquiry - choose a time that suits you.
          </p>
        </motion.div>

        <div className={styles.card}>
          <div className={styles.left}>
            <PropertySelector
              properties={properties}
              selectedSlug={selectedSlug}
              onSelect={setSelectedSlug}
            />
          </div>
          <div className={styles.right}>
            {agent && (
              <BookingPanel
                agent={agent}
                propertyName={property?.name ?? null}
                selectionKey={selectedSlug ?? "__general__"}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ConsultationBooking() {
  return (
    <Suspense fallback={null}>
      <ConsultationBookingInner />
    </Suspense>
  );
}
