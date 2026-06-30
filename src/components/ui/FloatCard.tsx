import { ReactNode } from "react";
import styles from "./FloatCard.module.css";

export function FloatCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${styles.card} ${className}`}>{children}</div>;
}
