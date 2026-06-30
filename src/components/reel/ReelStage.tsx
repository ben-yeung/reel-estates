"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ReelFeed } from "./ReelFeed";
import { properties } from "@/data/properties";
import { reels } from "@/data/reels";
import { reelStageEntrance, reelFocusHintTransition } from "@/lib/motion";
import styles from "./ReelStage.module.css";

export function ReelStage() {
  const [isFocused, setIsFocused] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const hasFocusedBefore = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);

  function handleRequestFocus() {
    setIsFocused(true);
    if (!hasFocusedBefore.current) {
      hasFocusedBefore.current = true;
      setShowHint(true);
    }
  }

  function exitFocus() {
    setIsFocused(false);
    setShowHint(false);
  }

  useEffect(() => {
    if (!isFocused) return;
    function handlePointerDown(e: PointerEvent) {
      if (stageRef.current && !stageRef.current.contains(e.target as Node)) {
        exitFocus();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isFocused]);

  return (
    <motion.div
      ref={stageRef}
      className={`${styles.stage} ${isFocused ? styles.focused : ""}`}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={reelStageEntrance}
    >
      <div className={styles.screen}>
        <ReelFeed properties={properties} reels={reels} isFocused={isFocused} onRequestFocus={handleRequestFocus} />
      </div>

      {showHint && (
        <motion.p
          className={styles.hint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reelFocusHintTransition}
        >
          Swipe to browse, tap outside to exit
        </motion.p>
      )}
    </motion.div>
  );
}
