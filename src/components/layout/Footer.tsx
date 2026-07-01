import LogoGlyph from "@/components/brand/LogoGlyph";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.brandTop}>
            <LogoGlyph size="1.75rem" color="var(--text)" />
            <span className={styles.wordmark}>Reel Estates</span>
          </div>
          <p className={styles.tagline}>
            Modern homes across Southeast Asia,
            <br />
            discovered through the reels you love.
          </p>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>© {year} Reel Estates</p>
          <p className={styles.notice}>
            Property listings, imagery, and agents are{" "}
            <a
              className={styles.noticeLink}
              href="https://github.com/ben-yeung/openrouter-image-gen"
              target="_blank"
              rel="noopener noreferrer"
            >
              AI generated
            </a>{" "}
            for mockup purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
