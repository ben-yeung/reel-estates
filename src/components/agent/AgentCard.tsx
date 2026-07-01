import { PropertyImage } from "@/components/ui/PropertyImage";
import { formatViews } from "@/lib/data-utils";
import type { Agent } from "@/lib/types";
import styles from "./AgentCard.module.css";

const SOCIAL_LABEL: Record<Agent["socialLinks"][number]["platform"], string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
};

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <article className={styles.card}>
      <div className={styles.photo}>
        <PropertyImage src={agent.avatar} alt={agent.name} className={styles.image} />
        <div className={styles.scrim} aria-hidden="true" />
        <div className={styles.identity}>
          <h3 className={styles.name}>{agent.name}</h3>
          <p className={styles.title}>{agent.title}</p>
        </div>
      </div>

      <div className={styles.body}>
        <p className={styles.quote}>{agent.quote}</p>

        <ul className={styles.regions}>
          {agent.regions.map((region) => (
            <li key={region} className={styles.region}>
              {region}
            </li>
          ))}
        </ul>

        <p className={styles.stats}>
          <span>{agent.reelCount} reels</span>
          <span className={styles.statDot} aria-hidden="true">
            ·
          </span>
          <span>{formatViews(agent.totalViews)} views</span>
        </p>

        <div className={styles.socials}>
          {agent.socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.social}
              aria-label={`${agent.name} on ${SOCIAL_LABEL[link.platform]}`}
            >
              <SocialIcon platform={link.platform} />
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

function SocialIcon({ platform }: { platform: Agent["socialLinks"][number]["platform"] }) {
  switch (platform) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
          <path d="M16.5 3c.3 2.1 1.6 3.8 3.7 4.1v2.6c-1.4.1-2.7-.3-3.9-1v5.9a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.7a2.9 2.9 0 1 0 2 2.8V3h2.9z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
          <path d="M22.5 7.2a2.8 2.8 0 0 0-2-2C18.8 4.8 12 4.8 12 4.8s-6.8 0-8.5.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1.2 12a29 29 0 0 0 .3 4.8 2.8 2.8 0 0 0 2 2c1.7.4 8.5.4 8.5.4s6.8 0 8.5-.4a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .3-4.8 29 29 0 0 0-.3-4.8zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z" />
        </svg>
      );
  }
}
