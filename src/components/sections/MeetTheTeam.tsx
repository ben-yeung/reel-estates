"use client";
import { motion } from "framer-motion";
import { AgentCard } from "@/components/agent/AgentCard";
import { agents } from "@/lib/data-utils";
import { reelPreviewCopy } from "@/lib/motion";
import styles from "./MeetTheTeam.module.css";

// Senior agents already lead the data array, so the roster renders in-order -
// no sort needed. See docs/adr/0004.
export default function MeetTheTeam() {
  return (
    <section id="agents" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <p className={styles.eyebrow}>Meet The Team</p>
          <h2 className={styles.title}>The People Behind The Reels</h2>
          <p className={styles.intro}>
            Behind every reel is a local expert - someone who knows their coastline, their
            market, and the story each home is waiting to tell.
          </p>
        </motion.div>

        <motion.div
          variants={reelPreviewCopy.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className={styles.grid}
        >
          {agents.map((agent) => (
            <motion.div key={agent.slug} variants={reelPreviewCopy.item} className={styles.cell}>
              <AgentCard agent={agent} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
