"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/** Appears once the main buy box has scrolled out of view above; jumps back to it. */
export function StickyBuyBar({ target, label, price }: { target: string; label: string; price: string }) {
  const [show, setShow] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = document.getElementById(target);
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={reduced ? false : { y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed inset-x-0 bottom-0 z-30 border-t border-sage bg-white/95 backdrop-blur"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate font-medium">{label}</p>
              <p className="text-sm text-soil/70 tnum">{price}</p>
            </div>
            <a href={`#${target}`} className="btn btn-primary shrink-0">
              Choose a size
            </a>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
