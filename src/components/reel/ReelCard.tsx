"use client";
import { motion } from "framer-motion";
import { PropertyImage } from "@/components/ui/PropertyImage";
import type { Property, Reel } from "@/lib/types";
import { reelCardVariants, reelCardTransition } from "@/lib/motion";
import { ReelActions } from "./ReelActions";
import { CommentDrawer } from "./CommentDrawer";
import styles from "./ReelCard.module.css";

export function ReelCard({
  property,
  reel,
  direction,
  commentOpen,
  onCommentOpenChange,
}: {
  property: Property;
  reel: Reel;
  direction: 1 | -1;
  commentOpen: boolean;
  onCommentOpenChange: (open: boolean) => void;
}) {
  return (
    <motion.div
      className={styles.card}
      custom={direction}
      variants={reelCardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={reelCardTransition}
    >
      <PropertyImage src={property.images[0]} alt={property.name} className={styles.image} />
      <div className={styles.scrim} />

      <div className={styles.info}>
        <p className={styles.name}>{property.name}</p>
        <p className={styles.location}>
          {property.location.city}, {property.location.country}
        </p>
        <p className={styles.hashtags}>
          {property.tags.map((tag) => `#${tag.replace(/-/g, "")}`).join(" ")}
        </p>
      </div>

      <div className={styles.actionRail}>
        <ReelActions reel={reel} onCommentOpen={() => onCommentOpenChange(true)} />
      </div>

      <CommentDrawer reel={reel} isOpen={commentOpen} onClose={() => onCommentOpenChange(false)} />
    </motion.div>
  );
}
