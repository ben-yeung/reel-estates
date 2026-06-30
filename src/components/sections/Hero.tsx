"use client";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { StatChip } from "@/components/ui/StatChip";
import { PropertyImage } from "@/components/ui/PropertyImage";
import { getFeaturedProperties } from "@/lib/data-utils";
import { kenBurns, heroEntrance } from "@/lib/motion";
import styles from "./Hero.module.css";

export default function Hero() {
  const featured = getFeaturedProperties()[0];

  return (
    <section className={styles.hero}>
      <motion.div
        className={styles.bgWrapper}
        initial={kenBurns.initial}
        animate={kenBurns.animate}
        transition={kenBurns.transition}
      >
        <PropertyImage src={featured.images[0]} alt={featured.name} className={styles.bgImage} priority />
        <div className={styles.scrim} />
      </motion.div>

      <motion.div
        className={styles.textBlock}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={heroEntrance.text}
      >
        <p className={styles.eyebrow}>Southeast Asia&apos;s Premier Modern Homes</p>
        <h1 className={styles.title}>
          <span className={styles.titleLight}>Reel</span>
          <span className={styles.titleBold}>Estates</span>
        </h1>
        <p className={styles.subtitle}>
          Modern homes across Southeast Asia, discovered through the content you already love.
        </p>
      </motion.div>

      <motion.div
        className={styles.featuredCardWrapper}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={heroEntrance.card}
      >
        <Badge variant="warm" className={styles.featuredBadge}>
          Featured Project
        </Badge>
        <p className={styles.featuredName}>{featured.name}</p>
        <p className={styles.featuredLocation}>
          {featured.location.city}, {featured.location.region}, {featured.location.country}
        </p>
        <div className={styles.statRow}>
          <StatChip icon="bed" value={featured.beds} tone="light" />
          <span className={styles.statDivider}>|</span>
          <StatChip icon="bath" value={featured.baths} tone="light" />
          <span className={styles.statDivider}>|</span>
          <StatChip icon="sqft" value={`${featured.sqft.toLocaleString()} sqft`} tone="light" />
        </div>
      </motion.div>

      <motion.div
        className={styles.scrollHint}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={heroEntrance.scrollHint}
      >
        <span className={styles.scrollLabel}>Scroll</span>
        <motion.div
          className={styles.scrollLine}
          animate={{ opacity: [0.35, 0.85, 0.35], scaleY: [1, 1.2, 1] }}
          transition={heroEntrance.scrollHintPulse}
        />
      </motion.div>
    </section>
  );
}
