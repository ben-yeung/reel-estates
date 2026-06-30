"use client";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { navVariants, navColorTransitionMs } from "@/lib/motion";
import styles from "./Navbar.module.css";

const links = [
  { label: "Properties", href: "/#properties" },
  { label: "Locations", href: "/#locations" },
  { label: "Agents", href: "/#agents" },
  { label: "About", href: "/#about" },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setIsScrolled(v > 56));

  const linkColor = isScrolled ? "var(--text)" : "rgba(255,255,255,0.88)";

  return (
    <motion.nav
      variants={navVariants}
      animate={isScrolled ? "island" : "top"}
      initial="top"
      className={styles.nav}
      style={{
        backdropFilter: isScrolled ? "blur(32px) saturate(180%)" : "blur(0px)",
        paddingLeft: isScrolled ? "24px" : "40px",
        paddingRight: isScrolled ? "24px" : "40px",
      }}
    >
      <Link href="/" className={styles.logoLink}>
        <div className={styles.logoMark}>
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="10" width="4" height="6" rx="1" fill="white" />
            <rect x="7" y="6" width="4" height="10" rx="1" fill="white" />
            <rect x="12" y="2" width="4" height="14" rx="1" fill="white" />
            <path d="M2 9 L16 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <motion.span
          className={styles.logoText}
          style={{ color: "var(--text)" }}
          animate={{ opacity: isScrolled ? 1 : 0 }}
          transition={{ duration: navColorTransitionMs / 1000, ease: "easeOut" }}
        >
          Reel Estates
        </motion.span>
      </Link>

      <ul className={styles.links}>
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              className={styles.link}
              style={{ color: linkColor, transitionDuration: `${navColorTransitionMs}ms` }}
            >
              {label}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/#contact" className={styles.cta}>
            Book Consultation
          </Link>
        </li>
      </ul>
    </motion.nav>
  );
}
