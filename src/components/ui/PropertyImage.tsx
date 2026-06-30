"use client";
import Image from "next/image";
import { useState } from "react";
import styles from "./PropertyImage.module.css";

export function PropertyImage({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return <div className={`${styles.placeholder} ${className}`} />;
  }

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.placeholder} />
      <Image
        src={src}
        alt={alt}
        fill
        className={styles.image}
        priority={priority}
        onError={() => setErrored(true)}
      />
    </div>
  );
}
