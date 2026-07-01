"use client";
import styles from "./WindowedDots.module.css";

const MAX_VISIBLE = 7;

// iOS-style pagination dots. Up to MAX_VISIBLE dots are shown; when there are
// more, the strip windows around the active dot and the two dots nearest an
// edge that has hidden neighbours beyond it shrink (small, then smallest) to
// signal "more this way". Shared by every carousel on the site - see ADR 0009.
export function WindowedDots({
  count,
  active,
  onSelect,
  label,
  className,
}: {
  count: number;
  active: number;
  onSelect: (index: number) => void;
  label: string;
  className?: string;
}) {
  if (count <= 1) return null;

  // The window of indices to render.
  let start = 0;
  let end = count;
  if (count > MAX_VISIBLE) {
    const half = Math.floor(MAX_VISIBLE / 2);
    start = Math.min(Math.max(active - half, 0), count - MAX_VISIBLE);
    end = start + MAX_VISIBLE;
  }
  const moreBefore = start > 0;
  const moreAfter = end < count;

  const dots = [];
  for (let i = start; i < end; i++) {
    const pos = i - start;
    // Distance from whichever edge is hiding more dots decides the shrink level.
    let size = "";
    if (moreBefore && pos === 0) size = styles.smallest;
    else if (moreBefore && pos === 1) size = styles.small;
    else if (moreAfter && pos === end - start - 1) size = styles.smallest;
    else if (moreAfter && pos === end - start - 2) size = styles.small;
    dots.push(
      <button
        key={i}
        type="button"
        className={`${styles.dot} ${i === active ? styles.active : ""} ${size}`}
        aria-label={`Go to slide ${i + 1} of ${count}`}
        aria-current={i === active}
        onClick={() => onSelect(i)}
      />
    );
  }

  return (
    <div className={`${styles.dots} ${className ?? ""}`} role="tablist" aria-label={label}>
      {dots}
    </div>
  );
}
