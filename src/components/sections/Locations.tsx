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
// The track renders the destinations three times so there is always a card on
// each side of the centered one. We live in the middle copy [N, 2N) and rebase
// back into it after every settle, which makes the loop seamless in both
// directions - the copies are identical, so the rebase is pixel-invisible.
const COPIES = 3;
const RENDERED = Array.from({ length: COPIES * N }, (_, i) => ({
  spot: spotlights[i % N],
  physical: i,
  key: `${spotlights[i % N].slug}-${Math.floor(i / N)}`,
}));

export default function Locations() {
  // `active` is a physical index into RENDERED; the real destination is active % N.
  const [active, setActive] = useState(N);
  const activeRef = useRef(N);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);

  const viewportRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Measured geometry: card width, step (card + gap), viewport width - read from
  // the DOM so it stays correct across the responsive clamp() sizing.
  const metrics = useRef({ step: 0, cardW: 0, vpW: 0 });

  const setActiveIndex = useCallback((index: number) => {
    activeRef.current = index;
    setActive(index);
  }, []);

  const targetX = useCallback((index: number) => {
    const { step, cardW, vpW } = metrics.current;
    return vpW / 2 - cardW / 2 - index * step;
  }, []);

  const measure = useCallback(() => {
    const vp = viewportRef.current;
    const first = cardRefs.current[0];
    const second = cardRefs.current[1];
    if (!vp || !first) return;
    const cardW = first.offsetWidth;
    const step = second ? second.offsetLeft - first.offsetLeft : cardW;
    const vpW = vp.offsetWidth;
    metrics.current = { step, cardW, vpW };
  }, []);

  // Snap `active` back into the middle copy [N, 2N) without moving any pixels:
  // shifting both the index and x by a whole copy keeps identical content centered.
  const normalize = useCallback(() => {
    const { step } = metrics.current;
    if (!step) return;
    const v = activeRef.current;
    const band = (((v - N) % N) + N) % N + N;
    if (band !== v) {
      x.set(x.get() - (band - v) * step);
      setActiveIndex(band);
    }
  }, [setActiveIndex, x]);

  // Move by ±1 (arrows / keys / swipe): normalize first so we stay bounded.
  const move = useCallback(
    (delta: number) => {
      normalize();
      setActiveIndex(activeRef.current + delta);
    },
    [normalize, setActiveIndex],
  );

  // Jump to a real destination index by the shortest way around the ring.
  const goToReal = useCallback(
    (real: number) => {
      normalize();
      const current = activeRef.current - N;
      let d = (((real - current) % N) + N) % N;
      if (d > N / 2) d -= N;
      setActiveIndex(activeRef.current + d);
    },
    [normalize, setActiveIndex],
  );

  // Position on mount before paint.
  useIsoLayoutEffect(() => {
    measure();
    x.set(targetX(activeRef.current));
  }, [measure, targetX, x]);

  // Re-measure and re-center on viewport resize (the card width is fluid).
  useEffect(() => {
    function onResize() {
      measure();
      x.set(targetX(activeRef.current));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure, targetX, x]);

  // Spring the track to the active card whenever it changes, then rebase into
  // the middle copy once the motion settles.
  useEffect(() => {
    const controls = animate(x, targetX(active), {
      ...(reduce ? { duration: 0 } : SPRING),
      onComplete: normalize,
    });
    return () => controls.stop();
  }, [active, reduce, targetX, x, normalize]);

  // Clamp the live drag to ~1 card either side of the current card. Doing it
  // here (rather than via framer's dragConstraints) means the motion value is
  // never "out of bounds" after the fact, so the invisible rebase - which jumps
  // x by a whole copy - is not fought/snapped back across the strip.
  function handleDrag() {
    const { step: s } = metrics.current;
    if (!s) return;
    const center = targetX(activeRef.current);
    const max = 1.15 * s;
    const cur = x.get();
    if (cur > center + max) x.set(center + max);
    else if (cur < center - max) x.set(center - max);
  }

  function handleDragEnd(_event: unknown, info: PanInfo) {
    const { step: s } = metrics.current;
    if (!s) return;
    // A swipe past ~1/5 of a card (or a decent flick) advances exactly one card;
    // otherwise settle back to the current one.
    if (info.offset.x <= -s * 0.2 || info.velocity.x < -400) move(1);
    else if (info.offset.x >= s * 0.2 || info.velocity.x > 400) move(-1);
    else animate(x, targetX(activeRef.current), reduce ? { duration: 0 } : SPRING);
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

  const realActive = ((active % N) + N) % N;

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
          {RENDERED.map(({ spot, physical, key }) => {
            const isActive = physical === active;
            return (
              <div
                key={key}
                ref={(el) => {
                  cardRefs.current[physical] = el;
                }}
                className={`${styles.card} ${isActive ? styles.active : ""}`}
                onClick={() => {
                  if (!isActive) goToReal(physical % N);
                }}
                role={isActive ? undefined : "button"}
                tabIndex={isActive ? -1 : 0}
                aria-hidden={!isActive}
                aria-label={isActive ? undefined : `Show ${spot.title}`}
                onKeyDown={(e) => {
                  if (!isActive && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    goToReal(physical % N);
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
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => move(-1)}
          aria-label="Previous destination"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className={styles.dots} role="tablist" aria-label="Choose destination">
          {spotlights.map((spot, i) => (
            <button
              key={spot.slug}
              type="button"
              role="tab"
              aria-selected={i === realActive}
              aria-label={spot.title}
              className={`${styles.dot} ${i === realActive ? styles.dotActive : ""}`}
              onClick={() => goToReal(i)}
            />
          ))}
        </div>

        <button
          type="button"
          className={styles.arrow}
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
