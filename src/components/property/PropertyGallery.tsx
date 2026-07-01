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

  const showPrev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const showNext = () => setActive((i) => (i + 1) % images.length);

  // Left/Right cycles gallery images (looped). This component only exists while
  // the detail modal is open, so the listener is implicitly scoped to that
  // lifetime. Esc and Tab are owned by the modal, not here, so there's no key
  // overlap.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        setActive((i) => (i + 1) % images.length);
      } else if (e.key === "ArrowLeft") {
        setActive((i) => (i - 1 + images.length) % images.length);
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

        {/* Looped prev/next controls. Shown only on mobile (CSS), where they
            replace the thumbnail strip to save vertical space. */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrev}
              aria-label="Previous image"
              className={`${styles.arrow} ${styles.arrowPrev}`}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Next image"
              className={`${styles.arrow} ${styles.arrowNext}`}
            >
              ›
            </button>
          </>
        )}
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
