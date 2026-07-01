"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { StatChip } from "@/components/ui/StatChip";
import { PropertyImage } from "@/components/ui/PropertyImage";
import { properties } from "@/lib/data-utils";
import { heroEntrance, heroRotateMs, heroBgLayer, heroFeaturedSwap, heroParallax } from "@/lib/motion";
import styles from "./Hero.module.css";

export default function Hero() {
  const featuredList = properties;
  const [index, setIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: heroParallax.scrollOffset,
  });
  const bgY = useTransform(scrollYProgress, [0, 1], heroParallax.yRange);

  useEffect(() => {
    if (featuredList.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % featuredList.length);
    }, heroRotateMs);
    return () => clearInterval(id);
  }, [featuredList.length]);

  const featured = featuredList[index];

  return (
    <section ref={sectionRef} className={styles.hero}>
      <motion.div className={styles.bgWrapper} style={{ y: bgY }}>
        <AnimatePresence>
          <motion.div
            key={featured.slug}
            className={styles.bgLayer}
            initial={heroBgLayer.initial}
            animate={heroBgLayer.animate}
            exit={heroBgLayer.exit}
            transition={heroBgLayer.transition}
          >
            <PropertyImage src={featured.images[0]} alt={featured.name} className={styles.bgImage} priority />
          </motion.div>
        </AnimatePresence>
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
          Modern homes across Southeast Asia,
          <br />
          in locations you would stop scrolling for.
        </p>
      </motion.div>

      <motion.div
        className={styles.featuredCardWrapper}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={heroEntrance.card}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={featured.slug}
            initial={heroFeaturedSwap.initial}
            animate={heroFeaturedSwap.animate}
            exit={heroFeaturedSwap.exit}
            transition={heroFeaturedSwap.transition}
          >
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
        </AnimatePresence>
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
