import styles from "./SectionPlaceholder.module.css";

export function SectionPlaceholder({
  id,
  eyebrow,
  title,
}: {
  id: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <section id={id} className={styles.section}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.note}>Coming soon</p>
    </section>
  );
}
