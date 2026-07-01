"use client";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { StatChip } from "@/components/ui/StatChip";
import { PropertyImage } from "@/components/ui/PropertyImage";
import { formatPrice, getPropertyReel } from "@/lib/data-utils";
import { EASE_STANDARD } from "@/lib/motion";
import type { Property } from "@/lib/types";
import styles from "./PropertyCard.module.css";

export function PropertyCard({
  property,
  onOpen,
}: {
  property: Property;
  onOpen: (slug: string) => void;
}) {
  const reel = getPropertyReel(property.slug);

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(property.slug)}
      whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(0, 0, 0, 0.12)" }}
      transition={{ duration: 0.2, ease: EASE_STANDARD }}
      className={styles.card}
    >
      <div className={styles.imageWrapper}>
        <PropertyImage src={property.images[0]} alt={property.name} className={styles.image} />
        {property.featured && (
          <Badge variant="warm" className={styles.badge}>
            Featured
          </Badge>
        )}
        <div className={styles.viewLabel}>
          <span className={styles.viewLabelText}>View Property</span>
        </div>
        {reel && (
          <div className={styles.reelStats} aria-label="Reel engagement">
            <span className={styles.reelStat}>
              <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {reel.likes.toLocaleString()}
            </span>
            <span className={styles.reelStat}>
              <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {reel.comments.length}
            </span>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <p className={styles.name}>{property.name}</p>
        <p className={styles.location}>
          {property.location.city}, {property.location.region}, {property.location.country}
        </p>
        <p className={styles.price}>{formatPrice(property.price)}</p>
        <div className={styles.statRow} data-testid="property-specs">
          <StatChip icon="bed" value={property.beds} label={property.beds === 1 ? "Bed" : "Beds"} />
          <span className={styles.statDivider}>|</span>
          <StatChip icon="bath" value={property.baths} label={property.baths === 1 ? "Bath" : "Baths"} />
          <span className={styles.statDivider}>|</span>
          <StatChip icon="sqft" value={property.sqft.toLocaleString()} label="sqft" />
        </div>
      </div>
    </motion.button>
  );
}
