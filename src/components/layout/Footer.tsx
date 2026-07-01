import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.wordmark}>Reel Estates</span>
          <p className={styles.tagline}>
            Modern homes across Southeast Asia, discovered through the reels you love.
          </p>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>© {year} Reel Estates</p>
          <p className={styles.notice}>
            Property listings and imagery are{" "}
            <a
              className={styles.noticeLink}
              href="https://github.com/ben-yeung/openrouter-image-gen"
              target="_blank"
              rel="noopener noreferrer"
            >
              AI generated
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
