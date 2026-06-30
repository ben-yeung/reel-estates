import type { Transition, Variants } from "framer-motion";

export const EASE_STANDARD: [number, number, number, number] = [0.4, 0, 0.2, 1];

export const kenBurns = {
  initial: { scale: 1.05 },
  animate: { scale: 1 },
  transition: { duration: 8, ease: "easeOut" } as Transition,
};

export const heroEntrance = {
  text: { duration: 0.8, delay: 0.4, ease: "easeOut" } as Transition,
  card: { duration: 0.7, delay: 0.85, ease: "easeOut" } as Transition,
  scrollHint: { delay: 1.4, duration: 0.6 } as Transition,
  scrollHintPulse: { duration: 2, repeat: Infinity, delay: 1.8 } as Transition,
};

export const navVariants: Variants = {
  top: {
    top: "0px",
    left: "0%",
    right: "0%",
    borderRadius: "0px",
    height: "64px",
    backgroundColor: "rgba(255,255,255,0)",
    borderColor: "rgba(220,215,210,0)",
    boxShadow: "0 0px 0px rgba(0,0,0,0)",
    transition: {
      top: { duration: 0.45, ease: EASE_STANDARD },
      left: { duration: 0.45, ease: EASE_STANDARD },
      right: { duration: 0.45, ease: EASE_STANDARD },
      borderRadius: { duration: 0.4, ease: EASE_STANDARD },
      height: { duration: 0.4, ease: EASE_STANDARD },
      backgroundColor: { duration: 0.15, ease: "easeOut" },
      borderColor: { duration: 0.15, ease: "easeOut" },
      boxShadow: { duration: 0.15, ease: "easeOut" },
    },
  },
  island: {
    top: "14px",
    left: "15%",
    right: "15%",
    borderRadius: "14px",
    height: "52px",
    backgroundColor: "rgba(255,255,255,0.52)",
    borderColor: "rgba(220,215,210,0.5)",
    boxShadow:
      "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.55)",
    transition: {
      top: { duration: 0.38, ease: EASE_STANDARD },
      left: { duration: 0.38, ease: EASE_STANDARD },
      right: { duration: 0.38, ease: EASE_STANDARD },
      borderRadius: { duration: 0.35, ease: EASE_STANDARD },
      height: { duration: 0.35, ease: EASE_STANDARD },
      backgroundColor: { duration: 0.38, ease: "easeOut" },
      borderColor: { duration: 0.38, ease: "easeOut" },
      boxShadow: { duration: 0.38, ease: "easeOut" },
    },
  },
};

export const navColorTransitionMs = 550;

export const reelPreviewCopy: { container: Variants; item: Variants } = {
  container: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  },
  item: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_STANDARD } },
  },
};

export const reelStageEntrance: Transition = { duration: 0.7, delay: 0.2 };

export const reelCardVariants: Variants = {
  enter: (direction: 1 | -1) => ({ y: direction > 0 ? "100%" : "-100%", opacity: 0.6 }),
  center: { y: 0, opacity: 1 },
  exit: (direction: 1 | -1) => ({ y: direction > 0 ? "-100%" : "100%", opacity: 0.6 }),
};

export const reelCardTransition: Transition = { duration: 0.35, ease: EASE_STANDARD };

export const likePopTransition: Transition = { duration: 0.3, ease: "easeOut" };

export const commentDrawerTransition: Transition = { duration: 0.3, ease: EASE_STANDARD };

export const reelFocusHintTransition: Transition = { duration: 0.25, ease: "easeOut" };
