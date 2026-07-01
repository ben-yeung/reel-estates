"use client";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { PropertyImage } from "@/components/ui/PropertyImage";
import { spotlights, getSpotlightLikes, formatLikes } from "@/lib/data-utils";
import styles from "./Locations.module.css";

// useLayoutEffect on the client, useEffect on the server, so the initial
// centering happens before paint (no flash) without the SSR warning.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SPRING = { type: "spring", stiffness: 260, damping: 32 } as const;
const N = spotlights.length;
// Cards rendered on each side of the centre one. Only these mount; the loop is
// achieved by an UNBOUNDED index and a sliding window - no copies, no rebase,
// so nothing can feed back on itself. The buffer must exceed the widest peek.
const W = 4;
// Gap between cards as a fraction of card width (kept proportional so it scales
// with the fluid card size). step = card width + gap.
const GAP_RATIO = 0.04;

export default function Locations() {
  // `index` is unbounded; the real destination is ((index % N) + N) % N. It only
  // ever changes by an explicit user action - there is no self-triggering rebase.
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const [step, setStep] = useState(0);

  const viewportRef = useRef<HTMLDivElement>(null);
  const activeCardRef = useRef<HTMLDivElement>(null);
  const metrics = useRef({ step: 0, cardW: 0, vpW: 0 });

  const targetX = useCallback((i: number) => {
    const { step: s, cardW, vpW } = metrics.current;
    return vpW / 2 - cardW / 2 - i * s;
  }, []);

  const setIdx = useCallback((i: number) => {
    indexRef.current = i;
    setIndex(i);
  }, []);

  const measure = useCallback(() => {
    const vp = viewportRef.current;
    const card = activeCardRef.current;
    if (!vp || !card) return;
    const cardW = card.offsetWidth;
    const s = cardW * (1 + GAP_RATIO);
    metrics.current = { step: s, cardW, vpW: vp.offsetWidth };
    setStep(s);
  }, []);

  const move = useCallback(
    (delta: number) => setIdx(indexRef.current + delta),
    [setIdx],
  );

  // Position on mount before paint.
  useIsoLayoutEffect(() => {
    measure();
    x.set(targetX(indexRef.current));
  }, [measure, targetX, x]);

  // Re-measure and re-center on viewport resize (the card is fluid).
  useEffect(() => {
    function onResize() {
      measure();
      x.set(targetX(indexRef.current));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure, targetX, x]);

  // Spring the track to the active card whenever the index changes. No onComplete
  // work - the window handles the loop by mounting/unmounting off-screen cards.
  useEffect(() => {
    const controls = animate(x, targetX(index), reduce ? { duration: 0 } : SPRING);
    return () => controls.stop();
  }, [index, reduce, targetX, x]);

  // Keep the live drag to ~1 card either side of centre so a swipe advances one.
  function handleDrag() {
    const { step: s } = metrics.current;
    if (!s) return;
    const center = targetX(indexRef.current);
    const max = 1.15 * s;
    const cur = x.get();
    if (cur > center + max) x.set(center + max);
    else if (cur < center - max) x.set(center - max);
  }

  function handleDragEnd(_event: unknown, info: PanInfo) {
    const { step: s } = metrics.current;
    if (!s) return;
    if (info.offset.x <= -s * 0.2 || info.velocity.x < -400) move(1);
    else if (info.offset.x >= s * 0.2 || info.velocity.x > 400) move(-1);
    else animate(x, targetX(indexRef.current), reduce ? { duration: 0 } : SPRING);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }
  }

  // The sliding window of cards around the current index.
  const windowCards = [];
  for (let i = index - W; i <= index + W; i++) {
    const real = ((i % N) + N) % N;
    windowCards.push({ i, spot: spotlights[real] });
  }

  return (
    <section
      id="locations"
      className={styles.section}
      aria-roledescription="carousel"
      aria-label="Featured destinations"
    >
      <div className={styles.header}>
        <p className={styles.eyebrow}>Where We Build</p>
        <h2 className={styles.title}>Locations</h2>
      </div>

      <div
        className={styles.viewport}
        ref={viewportRef}
        tabIndex={0}
        role="group"
        onKeyDown={handleKeyDown}
      >
        <motion.div
          className={styles.track}
          style={{ x }}
          drag="x"
          dragMomentum={false}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
        >
          {windowCards.map(({ i, spot }) => {
            const isActive = i === index;
            return (
              <div
                key={i}
                ref={isActive ? activeCardRef : undefined}
                className={`${styles.card} ${isActive ? styles.active : ""}`}
                style={step ? { left: i * step } : undefined}
                onClick={() => {
                  if (!isActive) move(i - index);
                }}
                role={isActive ? undefined : "button"}
                tabIndex={isActive ? -1 : 0}
                aria-hidden={!isActive}
                aria-label={isActive ? undefined : `Show ${spot.title}`}
                onKeyDown={(e) => {
                  if (!isActive && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    move(i - index);
                  }
                }}
              >
                <PropertyImage
                  src={spot.image}
                  alt={`${spot.title}, ${spot.country}`}
                  className={styles.image}
                />
                <div className={styles.scrim} />

                <div className={styles.stat}>
                  <svg
                    className={styles.statIcon}
                    viewBox="0 0 24 24"
                    fill="#ff4d6d"
                    aria-hidden="true"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span>{formatLikes(getSpotlightLikes(spot))}</span>
                </div>

                <div className={styles.copy}>
                  <p className={styles.country}>{spot.country}</p>
                  <h3 className={styles.name}>{spot.title}</h3>
                  <p className={styles.desc}>{spot.description}</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={() => move(-1)}
          aria-label="Previous destination"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={() => move(1)}
          aria-label="Next destination"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
