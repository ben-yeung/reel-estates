"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ReelCard } from "./ReelCard";
import type { Property, Reel } from "@/lib/types";
import styles from "./ReelFeed.module.css";

const AUTO_ADVANCE_MS = 4000;
const SWIPE_THRESHOLD_PX = 50;
const TAP_MOVEMENT_PX = 10;

export function ReelFeed({
  properties,
  reels,
  isFocused,
  onRequestFocus,
}: {
  properties: Property[];
  reels: Reel[];
  isFocused: boolean;
  onRequestFocus: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isHovered, setIsHovered] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [feedTab, setFeedTab] = useState<"following" | "forYou">("forYou");
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  const step = useCallback(
    (delta: 1 | -1) => {
      setDirection(delta);
      setIndex((prev) => (prev + delta + properties.length) % properties.length);
      setCommentOpen(false);
    },
    [properties.length]
  );

  const goToIndex = useCallback(
    (target: number) => {
      setDirection(target > index ? 1 : -1);
      setIndex(target);
      setCommentOpen(false);
    },
    [index]
  );

  // Auto-advance every 4s, paused while hovered (desktop), focused (touch), or comments are open
  useEffect(() => {
    if (isHovered || isFocused || commentOpen) return;
    const id = setInterval(() => step(1), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [isHovered, isFocused, commentOpen, step]);

  // Desktop: wheel while hovering steps reels (loops at the ends) instead of scrolling the page.
  // Outside the hover area, wheel events never reach this listener, so page scroll is untouched.
  // While comments are open, this is suspended so the wheel scrolls the comment list instead.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isHovered || commentOpen) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      step(e.deltaY > 0 ? 1 : -1);
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [isHovered, commentOpen, step]);

  // Touch: vertical drags only navigate once the stage is focused (tap-to-focus gate).
  // Until then this listener isn't even attached, so touchmove passes through as ordinary page scroll.
  // While comments are open, this is suspended so the drag scrolls the comment list instead.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isFocused || commentOpen) return;
    const handleTouchMove = (e: TouchEvent) => e.preventDefault();
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", handleTouchMove);
  }, [isFocused, commentOpen]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartY.current === null) return;
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    touchStartY.current = null;

    if (commentOpen) return;
    if (!isFocused) {
      if (Math.abs(deltaY) < TAP_MOVEMENT_PX) onRequestFocus();
      return;
    }
    if (Math.abs(deltaY) > SWIPE_THRESHOLD_PX) {
      step(deltaY > 0 ? 1 : -1);
    }
  }

  const currentProperty = properties[index];
  const currentReel = reels.find((r) => r.propertySlug === currentProperty.slug) ?? reels[0];

  return (
    <div
      ref={containerRef}
      className={styles.feed}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Stationary top chrome (a sibling of the sliding ReelCard, like the
          dots) so it stays put while reels slide. Mock tabs, à la TikTok. */}
      <div className={styles.topScrim} aria-hidden />
      <div className={styles.tabs} role="tablist" aria-label="Reel feed">
        <button
          type="button"
          role="tab"
          aria-selected={feedTab === "following"}
          onClick={() => setFeedTab("following")}
          className={`${styles.tab} ${feedTab === "following" ? styles.tabActive : ""}`}
        >
          Following
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={feedTab === "forYou"}
          onClick={() => setFeedTab("forYou")}
          className={`${styles.tab} ${feedTab === "forYou" ? styles.tabActive : ""}`}
        >
          For You
        </button>
      </div>

      <AnimatePresence initial={false} custom={direction}>
        <ReelCard
          key={currentProperty.slug}
          property={currentProperty}
          reel={currentReel}
          direction={direction}
          commentOpen={commentOpen}
          onCommentOpenChange={setCommentOpen}
        />
      </AnimatePresence>

      {/* Hidden while the comment drawer is open: the dots live at the feed level
          (a sibling of the animated ReelCard, whose transform forms a stacking
          context), so they'd otherwise float above the drawer that renders inside
          the card. The half-height sheet covers this bottom region anyway. */}
      <div className={`${styles.dots} ${commentOpen ? styles.dotsHidden : ""}`}>
        {properties.map((property, i) => (
          <button
            key={property.slug}
            type="button"
            aria-label={`Show ${property.name}`}
            onClick={() => goToIndex(i)}
            className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
