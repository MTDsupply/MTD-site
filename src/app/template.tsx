"use client";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Soft page transition: content fades and settles on every navigation. */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
