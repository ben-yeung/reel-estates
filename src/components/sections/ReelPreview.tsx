"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ReelStage } from "@/components/reel/ReelStage";
import { reelPreviewCopy } from "@/lib/motion";
import styles from "./ReelPreview.module.css";

export default function ReelPreview() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.grid}>
        <motion.div
          variants={reelPreviewCopy.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.p variants={reelPreviewCopy.item} className={styles.eyebrow}>
            How We Work
          </motion.p>
          <motion.h2 variants={reelPreviewCopy.item} className={styles.title}>
            Real Estate,
            <br />
            Discovered
            <br />
            Through Reels
          </motion.h2>
          <motion.p variants={reelPreviewCopy.item} className={styles.paragraph}>
            We build and sell modern homes across Southeast Asia, and we let the content speak
            first. Every property gets its own reel: shot on location, styled to the space,
            posted where you already spend your time.
          </motion.p>
          <motion.p variants={reelPreviewCopy.item} className={styles.paragraph}>
            No cold listings. No stock photos. Just the real thing, thirty seconds at a time.
          </motion.p>
          <motion.div variants={reelPreviewCopy.item}>
            <Link href="/#properties" className={styles.cta}>
              Browse Properties
            </Link>
          </motion.div>
        </motion.div>

        <ReelStage />
      </div>
    </section>
  );
}
