"use client";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { navVariants, navColorTransitionMs } from "@/lib/motion";
import LogoGlyph from "@/components/brand/LogoGlyph";
import styles from "./Navbar.module.css";

const links = [
  { label: "About", href: "/#about" },
  { label: "Properties", href: "/#properties" },
  { label: "Locations", href: "/#locations" },
  { label: "Agents", href: "/#agents" },
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
        paddingLeft: isScrolled ? "0.875rem" : "2.5rem",
        paddingRight: isScrolled ? "0.875rem" : "2.5rem",
      }}
    >
      <Link href="/" className={styles.logoLink}>
        <div className={styles.logoMark}>
          <LogoGlyph />
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
