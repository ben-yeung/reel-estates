import styles from "./ProcessFlow.module.css";

const steps = [
  {
    label: "Scroll",
    caption: "Find a home you love",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="2" width="10" height="20" rx="2.5" />
        <path d="M12 15V9" />
        <path d="M9.5 11.5 12 9l2.5 2.5" />
      </svg>
    ),
  },
  {
    label: "Agent",
    caption: "Book a consultation",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
      </svg>
    ),
  },
  {
    label: "Book",
    caption: "Secure your private viewing",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
        <path d="M3.5 9.5h17" />
        <path d="M8 3v4M16 3v4" />
        <path d="M9 15l2 2 4-4" />
      </svg>
    ),
  },
];

export function ProcessFlow() {
  return (
    <div className={styles.flow}>
      {steps.map((step) => (
        <div key={step.label} className={styles.step}>
          <span className={styles.iconWrap}>{step.icon}</span>
          <span className={styles.label}>{step.label}</span>
          <span className={styles.caption}>{step.caption}</span>
        </div>
      ))}
    </div>
  );
}
