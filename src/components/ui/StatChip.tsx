import styles from "./StatChip.module.css";

const icons = {
  bed: (
    <svg width="1em" height="1em" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="7" width="12" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 7V4a1 1 0 011-1h3v4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M5 7V4h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
  bath: (
    <svg width="1em" height="1em" viewBox="0 0 14 14" fill="none">
      <path d="M2 7h10v2a3 3 0 01-3 3H5a3 3 0 01-3-3V7z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 7V3a1 1 0 011-1h1v5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M5 12.5v1M9 12.5v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  sqft: (
    <svg width="1em" height="1em" viewBox="0 0 14 14" fill="none">
      <rect x="1.5" y="1.5" width="11" height="11" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 5h4v4H5z" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
};

export function StatChip({
  icon,
  value,
  tone = "muted",
}: {
  icon: "bed" | "bath" | "sqft";
  value: number | string;
  tone?: "muted" | "light";
}) {
  return (
    <span className={`${styles.chip} ${tone === "light" ? styles.light : ""}`}>
      <span className={styles.icon}>{icons[icon]}</span>
      <span>{value}</span>
    </span>
  );
}
