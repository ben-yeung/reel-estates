"use client";

import { useState } from "react";
import LogoGlyph from "@/components/brand/LogoGlyph";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Mockup: there is no backend, so a valid-looking email just flips to a
  // confirmation state rather than sending anything.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
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

          {/* Desktop-only listing-alerts capture; hidden below 860px. */}
          <div className={styles.newsletter}>
            <div className={styles.newsletterTop}>
              <h2 className={styles.newsletterHeading}>New reels, in your inbox</h2>
              <ul className={styles.socials}>
                <li>
                  <a
                    className={styles.socialLink}
                    href="https://www.tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M16.5 3c.3 2.1 1.6 3.6 3.7 3.8v2.4c-1.3.1-2.5-.3-3.7-1v5.9c0 3.4-2.7 5.9-5.9 5.6-2.9-.2-5-2.7-4.9-5.6.1-2.8 2.5-5 5.3-4.9.3 0 .5 0 .8.1v2.5c-.3-.1-.6-.2-.9-.2-1.4 0-2.5 1.2-2.4 2.6.1 1.3 1.2 2.3 2.5 2.3 1.4 0 2.5-1.1 2.5-2.5V3h2.9z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    className={styles.socialLink}
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    className={styles.socialLink}
                    href="https://www.youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M22 8.2a2.6 2.6 0 0 0-1.8-1.8C18.6 6 12 6 12 6s-6.6 0-8.2.4A2.6 2.6 0 0 0 2 8.2 27 27 0 0 0 1.7 12 27 27 0 0 0 2 15.8a2.6 2.6 0 0 0 1.8 1.8C5.4 18 12 18 12 18s6.6 0 8.2-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22.3 12 27 27 0 0 0 22 8.2zM10 15V9l5.2 3L10 15z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>

            {subscribed ? (
              <p className={styles.subscribed} role="status">
                Thanks - you&rsquo;re on the list.
              </p>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <input
                  className={styles.emailInput}
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@email.com"
                  aria-label="Email address"
                />
                <button className={styles.submit} type="submit">
                  Notify me
                </button>
              </form>
            )}
          </div>
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
