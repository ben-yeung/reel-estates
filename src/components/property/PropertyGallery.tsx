"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { PropertyImage } from "@/components/ui/PropertyImage";
import { WindowedDots } from "@/components/ui/WindowedDots";
import { useIsMobile } from "@/lib/useMediaQuery";
import { EASE_STANDARD } from "@/lib/motion";
import styles from "./PropertyGallery.module.css";

export function PropertyGallery({
  images,
  name,
  location,
  headingId,
}: {
  images: string[];
  name: string;
  location: string;
  headingId: string;
}) {
  // No need to reset `active` on prop change: the parent modal keys its content
  // block by property slug, so this component fully remounts (fresh `active`
  // state) on every prev/next step rather than receiving new `images` in place.
  const [active, setActive] = useState(0);
  const isMobile = useIsMobile();

  const showPrev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const showNext = () => setActive((i) => (i + 1) % images.length);

  // Swipe the gallery on touch: a horizontal drag past a small threshold (or a
  // quick flick) steps the image, looping like the arrows.
  function handleDragEnd(_event: unknown, info: PanInfo) {
    if (info.offset.x <= -40 || info.velocity.x < -400) showNext();
    else if (info.offset.x >= 40 || info.velocity.x > 400) showPrev();
  }

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

  const canSwipe = isMobile && images.length > 1;

  return (
    <div className={styles.gallery}>
      <motion.div
        className={styles.hero}
        drag={canSwipe ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
      >
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
      </motion.div>

      {images.length > 1 && (
        <WindowedDots
          count={images.length}
          active={active}
          onSelect={setActive}
          label="Gallery pagination"
          className={styles.galleryDots}
        />
      )}

      {/* Name/location and the thumbnail picker share one row to save vertical
          space: caption stacked on the left, thumbnails right-aligned and
          centered against it. On mobile the thumbnails are hidden (the hero
          arrows navigate instead), leaving just the caption. */}
      <div className={styles.metaRow}>
        <div className={styles.meta}>
          <h2 id={headingId} className={styles.name}>
            {name}
          </h2>
          <p className={styles.location}>{location}</p>
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
    </div>
  );
}
