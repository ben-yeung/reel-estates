"use client";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { navVariants, navVariantsMobile, navColorTransitionMs, EASE_STANDARD } from "@/lib/motion";
import { useIsMobile } from "@/lib/useMediaQuery";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useMotionValueEvent(scrollY, "change", (v) => setIsScrolled(v > 56));

  // A tablet resized up to desktop should never leave the sheet stuck open.
  // Adjust during render rather than in an effect to avoid a cascading render -
  // the same pattern the consultation booking uses for its deep-link sync.
  if (!isMobile && menuOpen) setMenuOpen(false);

  // Lock page scroll and wire Escape-to-close while the sheet is open.
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Frosted look when scrolled, or whenever the sheet is open (so links stay
  // legible even over the transparent hero top-state).
  const frosted = isScrolled || menuOpen;
  const linkColor = isScrolled ? "var(--text)" : "rgba(255,255,255,0.88)";

  return (
    <>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.scrim}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.nav
        variants={isMobile ? navVariantsMobile : navVariants}
        animate={isMobile ? (frosted ? "island" : "top") : isScrolled ? "island" : "top"}
        initial="top"
        className={styles.nav}
        style={{
          backdropFilter: frosted ? "blur(32px) saturate(180%)" : "blur(0px)",
          paddingLeft: isMobile ? "1rem" : isScrolled ? "0.875rem" : "2.5rem",
          paddingRight: isMobile ? "1rem" : isScrolled ? "0.875rem" : "2.5rem",
        }}
      >
        <Link href="/" className={styles.logoLink} onClick={() => setMenuOpen(false)}>
          <div className={styles.logoMark}>
            <LogoGlyph />
          </div>
          <motion.span
            className={styles.logoText}
            style={{ color: "var(--text)" }}
            animate={{ opacity: frosted ? 1 : 0 }}
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
              <span className={styles.ctaLabelFull}>Book Consultation</span>
              <span className={styles.ctaLabelShort}>Book</span>
            </Link>
          </li>
        </ul>

        <button
          type="button"
          className={styles.hamburger}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          style={{ color: frosted ? "var(--text)" : "rgba(255,255,255,0.92)" }}
        >
          <span className={`${styles.bar} ${menuOpen ? styles.barTop : ""}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barMid : ""}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barBottom : ""}`} />
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className={styles.sheet}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.32, ease: EASE_STANDARD }}
            >
              <div className={styles.sheetInner}>
                <ul className={styles.sheetLinks}>
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className={styles.sheetLink}
                        onClick={() => setMenuOpen(false)}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/#contact" className={styles.sheetCta} onClick={() => setMenuOpen(false)}>
                  Book Consultation
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
