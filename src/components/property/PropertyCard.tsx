"use client";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { StatChip } from "@/components/ui/StatChip";
import { PropertyImage } from "@/components/ui/PropertyImage";
import { formatPrice } from "@/lib/data-utils";
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
      </div>

      <div className={styles.content}>
        <p className={styles.name}>{property.name}</p>
        <p className={styles.location}>
          {property.location.city}, {property.location.region}, {property.location.country}
        </p>
        <p className={styles.price}>{formatPrice(property.price)}</p>
        <div className={styles.statRow}>
          <StatChip icon="bed" value={property.beds} />
          <span className={styles.statDivider}>|</span>
          <StatChip icon="bath" value={property.baths} />
          <span className={styles.statDivider}>|</span>
          <StatChip icon="sqft" value={property.sqft.toLocaleString()} />
        </div>
      </div>
    </motion.button>
  );
}
