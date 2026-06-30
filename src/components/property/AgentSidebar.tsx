import { PropertyImage } from "@/components/ui/PropertyImage";
import type { Agent } from "@/lib/types";
import styles from "./AgentSidebar.module.css";

export function AgentSidebar({
  agent,
  formattedPrice,
}: {
  agent: Agent;
  formattedPrice: string;
}) {
  return (
    <div className={styles.sidebar}>
      <p className={styles.price}>{formattedPrice}</p>

      <div className={styles.agentRow}>
        <PropertyImage src={agent.avatar} alt={agent.name} className={styles.avatar} />
        <div>
          <p className={styles.agentName}>{agent.name}</p>
          <p className={styles.agentTitle}>{agent.title}</p>
        </div>
      </div>

      <p className={styles.phoneLabel}>Or call for consultation</p>
      <p className={styles.phone}>{agent.phone}</p>

      {/* Decorative for v1: the Contact section is still a placeholder, so this
          CTA has no destination yet. See docs/adr/0003. */}
      <button type="button" className={styles.cta}>
        Book Consultation
      </button>
    </div>
  );
}
