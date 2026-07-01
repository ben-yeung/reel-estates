"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PropertyImage } from "@/components/ui/PropertyImage";
import { EASE_STANDARD } from "@/lib/motion";
import styles from "./PropertyGallery.module.css";

export function PropertyGallery({ images, name }: { images: string[]; name: string }) {
  // No need to reset `active` on prop change: the parent modal keys its content
  // block by property slug, so this component fully remounts (fresh `active`
  // state) on every prev/next step rather than receiving new `images` in place.
  const [active, setActive] = useState(0);

  // Left/Right cycles gallery images. This component only exists while the
  // detail modal is open, so the listener is implicitly scoped to that lifetime.
  // Esc and Tab are owned by the modal, not here, so there's no key overlap.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        setActive((i) => Math.min(i + 1, images.length - 1));
      } else if (e.key === "ArrowLeft") {
        setActive((i) => Math.max(i - 1, 0));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length]);

  return (
    <div className={styles.gallery}>
      <div className={styles.hero}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className={styles.heroImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_STANDARD }}
          >
            <PropertyImage
              src={images[active]}
              alt={`${name}, image ${active + 1} of ${images.length}`}
              className={styles.heroImageInner}
              priority={active === 0}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className={styles.thumbStrip}>
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-current={i === active}
              className={`${styles.thumb} ${i === active ? styles.thumbActive : ""}`}
            >
              <PropertyImage src={src} alt="" className={styles.thumbImage} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
