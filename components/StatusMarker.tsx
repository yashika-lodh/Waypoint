"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Step } from "@/types/agent";

type StatusMarkerProps = {
  status: Step["status"];
  stale: boolean;
  number: number;
};

export function StatusMarker({ status, stale, number }: StatusMarkerProps) {
  const look =
    status === "done" && stale
      ? "border border-dashed border-[var(--wp-route)] bg-[var(--wp-surface)] text-[var(--wp-route)]"
      : {
          pending: "border border-[var(--wp-line)] bg-[var(--wp-surface)] text-[var(--wp-muted)]",
          running: "bg-[var(--wp-route)] text-[var(--wp-on-accent)]",
          done: "bg-[var(--wp-route)] text-[var(--wp-on-accent)]",
          paused: "border-2 border-[var(--wp-annot)] bg-[var(--wp-surface)] text-[var(--wp-annot)]",
          error: "bg-[var(--wp-danger)] text-[var(--wp-on-accent)]",
        }[status];

  return (
    <span
      className={`relative z-10 grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold transition-colors duration-300 ${look}`}
    >
      {status === "running" && (
        <span className="wp-pulse absolute inset-0 rounded-full bg-[var(--wp-route)]" />
      )}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={`${status}-${stale}`}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.15 }}
          className="relative grid place-items-center"
        >
          <Glyph status={status} stale={stale} number={number} />
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Glyph({ status, stale, number }: StatusMarkerProps) {
  if (status === "done" && !stale) {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === "paused") {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
        <rect x="2.5" y="2" width="2.5" height="8" rx="0.75" fill="currentColor" />
        <rect x="7" y="2" width="2.5" height="8" rx="0.75" fill="currentColor" />
      </svg>
    );
  }
  if (status === "error") return <span>!</span>;
  return <span>{number}</span>;
}