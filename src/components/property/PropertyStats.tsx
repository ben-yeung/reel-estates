import { StatChip } from "@/components/ui/StatChip";
import styles from "./PropertyStats.module.css";

export function PropertyStats({
  beds,
  baths,
  sqft,
}: {
  beds: number;
  baths: number;
  sqft: number;
}) {
  return (
    <div className={styles.stats}>
      <StatChip icon="bed" value={`${beds} Beds`} />
      <span className={styles.divider}>|</span>
      <StatChip icon="bath" value={`${baths} Baths`} />
      <span className={styles.divider}>|</span>
      <StatChip icon="sqft" value={`${sqft.toLocaleString()} sqft`} />
    </div>
  );
}
