"use client";
import { PropertyImage } from "@/components/ui/PropertyImage";
import { formatPrice } from "@/lib/data-utils";
import type { Property } from "@/lib/types";
import styles from "./PropertySelector.module.css";

// Left panel of the Consultation Booking: a scrollable image-row list of every
// Property, with a pinned "general enquiry" row on top. Selecting a row drives
// the agent auto-fill in the right panel. `selectedSlug === null` is the
// general-enquiry path. See docs/adr/0005.
export function PropertySelector({
  properties,
  selectedSlug,
  onSelect,
}: {
  properties: Property[];
  selectedSlug: string | null;
  onSelect: (slug: string | null) => void;
}) {
  return (
    <div className={styles.list} role="listbox" aria-label="Choose a property">
      <button
        type="button"
        role="option"
        aria-selected={selectedSlug === null}
        className={`${styles.row} ${selectedSlug === null ? styles.rowSelected : ""}`}
        onClick={() => onSelect(null)}
      >
        <span className={styles.generalIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className={styles.rowText}>
          <span className={styles.rowName}>No specific property</span>
          <span className={styles.rowMeta}>General enquiry</span>
        </span>
      </button>

      {properties.map((property) => (
        <button
          key={property.slug}
          type="button"
          role="option"
          aria-selected={selectedSlug === property.slug}
          className={`${styles.row} ${selectedSlug === property.slug ? styles.rowSelected : ""}`}
          onClick={() => onSelect(property.slug)}
        >
          <span className={styles.thumb}>
            <PropertyImage src={property.images[0]} alt={property.name} className={styles.thumbImg} />
          </span>
          <span className={styles.rowText}>
            <span className={styles.rowName}>{property.name}</span>
            <span className={styles.rowMeta}>{property.location.city}</span>
          </span>
          <span className={styles.rowPrice}>{formatPrice(property.price)}</span>
        </button>
      ))}
    </div>
  );
}
