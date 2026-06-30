"use client";
import { AnimatePresence, motion } from "framer-motion";
import type { Reel } from "@/lib/types";
import { commentDrawerTransition } from "@/lib/motion";
import styles from "./CommentDrawer.module.css";

export function CommentDrawer({
  reel,
  isOpen,
  onClose,
}: {
  reel: Reel;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.sheet}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={commentDrawerTransition}
          >
            <div className={styles.header}>
              <span className={styles.headerTitle}>{reel.comments.length} Comments</span>
              <button type="button" aria-label="Close comments" onClick={onClose} className={styles.closeButton}>
                ×
              </button>
            </div>
            <div className={styles.list}>
              {reel.comments.map((comment) => (
                <div key={`${comment.author}-${comment.text}`} className={styles.comment}>
                  <div className={styles.avatar}>{comment.author.replace("@", "")[0]?.toUpperCase() ?? "?"}</div>
                  <div>
                    <p className={styles.author}>{comment.author}</p>
                    <p className={styles.text}>{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
