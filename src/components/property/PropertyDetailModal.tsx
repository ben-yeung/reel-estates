"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyStats } from "@/components/property/PropertyStats";
import { AgentSidebar } from "@/components/property/AgentSidebar";
import { PropertyReviews } from "@/components/property/PropertyReviews";
import { getAgentBySlug, getPropertyBySlug, getPropertyReel, formatPrice } from "@/lib/data-utils";
import { EASE_STANDARD } from "@/lib/motion";
import styles from "./PropertyDetailModal.module.css";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function PropertyDetailModal({
  slug,
  onClose,
  onBookConsultation,
}: {
  slug: string;
  onClose: () => void;
  onBookConsultation?: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const property = getPropertyBySlug(slug);
  const agent = property ? getAgentBySlug(property.agentSlug) : undefined;
  const reel = property ? getPropertyReel(property.slug) : undefined;

  // Defensive: a stale or hand-typed `?property=` slug shouldn't crash the page,
  // it should just fall back to a closed modal.
  useEffect(() => {
    if (!property || !agent) {
      onClose();
    }
  }, [property, agent, onClose]);

  // Captures the triggering element, locks page scroll, and moves focus into
  // the panel - all for the lifetime of this component being mounted (i.e.
  // the modal being open at all).
  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      // preventScroll so restoring focus doesn't yank the page back up - e.g.
      // when closing to deep-link into the Consultation Booking below.
      previouslyFocusedRef.current?.focus({ preventScroll: true });
    };
  }, []);

  // Escape closes; Tab is trapped within the panel.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!property || !agent) return null;

  const headingId = `property-modal-heading-${slug}`;

  return (
    <>
      <motion.div
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        tabIndex={-1}
        className={styles.panel}
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25, ease: EASE_STANDARD }}
      >
        <button type="button" onClick={onClose} aria-label="Close property details" className={styles.closeButton}>
          ×
        </button>

        <div className={styles.body}>
          <div className={styles.left}>
            <PropertyGallery
              images={property.images}
              name={property.name}
              location={`${property.location.city}, ${property.location.region}, ${property.location.country}`}
              headingId={headingId}
            />
            <p className={styles.description}>{property.description}</p>
          </div>
          <div className={styles.right}>
            <AgentSidebar
              agent={agent}
              formattedPrice={formatPrice(property.price)}
              onBookConsultation={onBookConsultation}
            />
            <PropertyStats beds={property.beds} baths={property.baths} sqft={property.sqft} />
            {reel && reel.comments.length > 0 && (
              <PropertyReviews comments={reel.comments} likes={reel.likes} />
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
