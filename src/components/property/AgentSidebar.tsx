import { PropertyImage } from "@/components/ui/PropertyImage";
import type { Agent } from "@/lib/types";
import styles from "./AgentSidebar.module.css";

export function AgentSidebar({
  agent,
  formattedPrice,
  onBookConsultation,
}: {
  agent: Agent;
  formattedPrice: string;
  onBookConsultation?: () => void;
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

      {/* Deep-links to the Consultation Booking with this property preselected
          (?book=), closing the modal on the way. See docs/adr/0006. */}
      <button type="button" className={styles.cta} onClick={onBookConsultation}>
        Book Consultation
      </button>
    </div>
  );
}
