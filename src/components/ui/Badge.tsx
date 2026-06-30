import { ReactNode } from "react";
import styles from "./Badge.module.css";

export function Badge({
  children,
  variant = "warm",
  className = "",
}: {
  children: ReactNode;
  variant?: "warm" | "dark";
  className?: string;
}) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}
