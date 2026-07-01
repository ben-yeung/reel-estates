"use client";
import { motion } from "framer-motion";
import { ReelStage } from "@/components/reel/ReelStage";
import { ProcessFlow } from "@/components/sections/ProcessFlow";
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
            Through Reels
          </motion.h2>
          <motion.p variants={reelPreviewCopy.item} className={styles.paragraph}>
            We build, sell, and rent modern homes across Southeast Asia.
            <br />
            Every property gets its own reel: shot on location, styled to the space,
            posted where you already spend your time.
          </motion.p>
          <motion.p variants={reelPreviewCopy.item} className={styles.paragraph}>
            What you see in the reel is exactly what you&apos;ll walk into.
            <br />
            Imagine doom scrolling into your next dream home.
          </motion.p>
          <motion.div variants={reelPreviewCopy.item}>
            <ProcessFlow />
          </motion.div>
        </motion.div>

        <ReelStage />
      </div>
    </section>
  );
}
