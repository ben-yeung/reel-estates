"use client";
import { Children, useCallback, useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/lib/useMediaQuery";
import { WindowedDots } from "./WindowedDots";
import styles from "./SnapCarousel.module.css";

// Number of slides cloned onto each end so the centred card always has a real
// neighbour peeking (needs to cover the widest peek: 2 is safe). See ADR 0009.
const CLONES = 2;
// Milliseconds of scroll-silence that counts as "settled" - when we then jump
// silently past a clone back onto the matching real slide.
const SETTLE_MS = 140;

// A CSS scroll-snap carousel that becomes a grid on desktop. On mobile (<=1024)
// it renders leading/trailing clones and, on scroll-settle, jumps the scroll
// position without animation from a clone onto the matching real slide, giving a
// seamless infinite loop on top of native momentum scrolling. The clones and the
// loop logic exist only on mobile, so desktop keeps a plain grid and the
// accessibility tree only ever contains the real slides.
export function SnapCarousel({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  const isMobile = useIsMobile();
  const items = Children.toArray(children);
  const n = items.length;

  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const jumpingRef = useRef(false);
  const rafRef = useRef(0);
  const settleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setActiveIndex = useCallback((i: number) => {
    activeRef.current = i;
    setActive(i);
  }, []);

  const slideEls = useCallback(
    () =>
      trackRef.current
        ? (Array.from(
            trackRef.current.querySelectorAll<HTMLElement>("[data-slide]")
          ) as HTMLElement[])
        : [],
    []
  );

  // Which slide (in full DOM order, clones included) is nearest the viewport centre.
  const centeredFull = useCallback(() => {
    const track = trackRef.current;
    if (!track) return -1;
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = -1;
    let min = Infinity;
    slideEls().forEach((s, i) => {
      const c = s.offsetLeft + s.offsetWidth / 2;
      const d = Math.abs(c - center);
      if (d < min) {
        min = d;
        best = i;
      }
    });
    return best;
  }, [slideEls]);

  const fullToReal = useCallback((full: number) => ((full - CLONES) % n + n) % n, [n]);

  const centerOn = useCallback(
    (full: number, smooth: boolean) => {
      const track = trackRef.current;
      const s = slideEls()[full];
      if (!track || !s) return;
      const left = s.offsetLeft + s.offsetWidth / 2 - track.clientWidth / 2;
      track.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
    },
    [slideEls]
  );

  // Position on the first real slide once the clones are in the DOM.
  useEffect(() => {
    if (!isMobile) return;
    const id = requestAnimationFrame(() => centerOn(CLONES + activeRef.current, false));
    return () => cancelAnimationFrame(id);
  }, [isMobile, centerOn, n]);

  // Track the centred slide while scrolling; on settle, silently rebase off a clone.
  useEffect(() => {
    const track = trackRef.current;
    if (!isMobile || !track) return;

    function onSettle() {
      const full = centeredFull();
      if (full < 0) return;
      let target = full;
      if (full < CLONES) target = full + n;
      else if (full >= CLONES + n) target = full - n;
      if (target !== full) {
        jumpingRef.current = true;
        centerOn(target, false);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            jumpingRef.current = false;
          })
        );
      }
    }

    function onScroll() {
      if (jumpingRef.current) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const full = centeredFull();
        if (full >= 0) setActiveIndex(fullToReal(full));
      });
      if (settleRef.current) clearTimeout(settleRef.current);
      settleRef.current = setTimeout(onSettle, SETTLE_MS);
    }

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
      if (settleRef.current) clearTimeout(settleRef.current);
    };
  }, [isMobile, n, centeredFull, centerOn, fullToReal, setActiveIndex]);

  // Re-centre on resize (slide width is fluid).
  useEffect(() => {
    if (!isMobile) return;
    function onResize() {
      centerOn(CLONES + activeRef.current, false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMobile, centerOn]);

  // Jump to a real slide by the shortest wrapped path; settle handler rebases.
  const goTo = useCallback(
    (realIndex: number) => {
      const current = centeredFull();
      if (current < 0) return;
      const currentReal = fullToReal(current);
      let delta = realIndex - currentReal;
      if (delta > n / 2) delta -= n;
      if (delta < -n / 2) delta += n;
      centerOn(current + delta, true);
    },
    [centeredFull, fullToReal, centerOn, n]
  );

  const move = useCallback(
    (dir: 1 | -1) => {
      const current = centeredFull();
      if (current < 0) return;
      centerOn(current + dir, true);
    },
    [centeredFull, centerOn]
  );

  // A tap on a non-centred slide navigates to it instead of activating the card
  // (e.g. opening the modal). Handled in the capture phase on the wrapper so it
  // pre-empts the inner card's own click. Only the centred real card passes the
  // click through. Clones never activate a card - they always just navigate.
  function handleSlideClick(e: React.MouseEvent, fullIndex: number, isClone: boolean) {
    const c = centeredFull();
    if (!isClone && (c < 0 || fullIndex === c)) return;
    e.stopPropagation();
    centerOn(fullIndex, true);
  }

  const before = isMobile ? items.slice(n - CLONES) : [];
  const after = isMobile ? items.slice(0, CLONES) : [];

  return (
    <div className={styles.viewport} aria-roledescription="carousel" aria-label={label}>
      <div className={styles.track} ref={trackRef}>
        {before.map((child, i) => (
          <div
            key={`clone-before-${i}`}
            className={`${styles.slide} ${styles.clone}`}
            data-slide
            aria-hidden="true"
            onClickCapture={(e) => handleSlideClick(e, i, true)}
          >
            {child}
          </div>
        ))}
        {items.map((child, i) => (
          <div
            key={i}
            className={styles.slide}
            data-slide
            data-index={i}
            onClickCapture={(e) => handleSlideClick(e, CLONES + i, false)}
          >
            {child}
          </div>
        ))}
        {after.map((child, i) => (
          <div
            key={`clone-after-${i}`}
            className={`${styles.slide} ${styles.clone}`}
            data-slide
            aria-hidden="true"
            onClickCapture={(e) => handleSlideClick(e, CLONES + n + i, true)}
          >
            {child}
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button type="button" className={styles.arrow} onClick={() => move(-1)} aria-label="Previous">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <WindowedDots count={n} active={active} onSelect={goTo} label={`${label} pagination`} />
        <button type="button" className={styles.arrow} onClick={() => move(1)} aria-label="Next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
