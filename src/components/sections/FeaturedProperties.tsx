"use client";
import { Suspense, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyDetailModal } from "@/components/property/PropertyDetailModal";
import { SnapCarousel } from "@/components/ui/SnapCarousel";
import { properties } from "@/lib/data-utils";
import { useIsMobile } from "@/lib/useMediaQuery";
import { reelPreviewCopy } from "@/lib/motion";
import styles from "./FeaturedProperties.module.css";

// Featured-first so the section's name still means something even though every
// property is shown - see docs/adr/0003.
const orderedProperties = [...properties].sort((a, b) => Number(b.featured) - Number(a.featured));

function FeaturedPropertiesInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("property");
  const isMobile = useIsMobile();

  const handleOpen = useCallback(
    (slug: string) => {
      router.push(`${pathname}?property=${slug}`, { scroll: false });
    },
    [router, pathname]
  );

  // Explicit close (Esc / backdrop / X) clears the query param directly rather
  // than relying on router.back(), which would be wrong for a property opened
  // via a shared deep link with no in-app history to return to.
  const handleClose = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  // "Book Consultation" from the modal: swap `?property=` for `?book=`, which
  // closes the modal and pre-selects this property in the Consultation Booking.
  // The section brings itself into view once the modal releases scroll lock.
  // See docs/adr/0006.
  const handleBook = useCallback(
    (slug: string) => {
      router.push(`${pathname}?book=${slug}`, { scroll: false });
    },
    [router, pathname]
  );

  return (
    <section id="properties" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <p className={styles.eyebrow}>The Collection</p>
          <h2 className={styles.title}>Our Properties</h2>
        </motion.div>

        {isMobile ? (
          <SnapCarousel label="Featured properties">
            {orderedProperties.map((property) => (
              <PropertyCard key={property.slug} property={property} onOpen={handleOpen} />
            ))}
          </SnapCarousel>
        ) : (
          <motion.div
            variants={reelPreviewCopy.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className={styles.grid}
          >
            {orderedProperties.map((property) => (
              <motion.div key={property.slug} variants={reelPreviewCopy.item}>
                <PropertyCard property={property} onOpen={handleOpen} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {activeSlug && (
          <PropertyDetailModal
            key="property-detail-modal"
            slug={activeSlug}
            onClose={handleClose}
            onBookConsultation={() => handleBook(activeSlug)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export default function FeaturedProperties() {
  return (
    <Suspense fallback={null}>
      <FeaturedPropertiesInner />
    </Suspense>
  );
}
